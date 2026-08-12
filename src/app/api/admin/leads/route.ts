import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'CONVERTED', 'SPAM'];

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get('status');
        const isArchivedParam = searchParams.get('isArchived');
        const searchParam = searchParams.get('search');
        const serviceInterestParam = searchParams.get('serviceInterest');
        const limitStr = searchParams.get('limit') || '20';
        const pageStr = searchParams.get('page') || '1';

        const where: any = {};

        // Status logic
        if (statusParam) {
            if (statusParam === 'all') {
                // no status filter
            } else if (VALID_STATUSES.includes(statusParam)) {
                where.status = statusParam;
            } else {
                return NextResponse.json({ success: false, error: 'Invalid status filter' }, { status: 400 });
            }
        } else {
            // Default: exclude SPAM
            where.status = { not: 'SPAM' };
        }

        // Archived logic
        if (isArchivedParam === 'true') {
            where.isArchived = true;
        } else if (isArchivedParam === 'all') {
            // no archive filter
        } else {
            // Default: exclude archived
            where.isArchived = false;
        }

        if (serviceInterestParam && serviceInterestParam.trim() !== '') {
            where.serviceInterest = serviceInterestParam.trim();
        }

        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { fullName: { contains: searchParam, mode: 'insensitive' } },
                { email: { contains: searchParam, mode: 'insensitive' } },
                { phone: { contains: searchParam, mode: 'insensitive' } },
                { company: { contains: searchParam, mode: 'insensitive' } },
                { serviceInterest: { contains: searchParam, mode: 'insensitive' } },
                { message: { contains: searchParam, mode: 'insensitive' } },
            ];
        }

        let limit = parseInt(limitStr, 10);
        if (isNaN(limit) || limit <= 0) limit = 20;
        if (limit > 100) limit = 100;

        let page = parseInt(pageStr, 10);
        if (isNaN(page) || page <= 0) page = 1;

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.lead.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching Leads:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            fullName,
            email,
            phone,
            serviceInterest,
            message,
            company,
            status,
            internalNotes,
            isArchived
        } = body;

        // Required fields check
        if (
            typeof fullName !== 'string' || fullName.trim() === '' ||
            typeof email !== 'string' || email.trim() === '' ||
            typeof phone !== 'string' || phone.trim() === '' ||
            typeof serviceInterest !== 'string' || serviceInterest.trim() === '' ||
            typeof message !== 'string' || message.trim() === ''
        ) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid required fields (fullName, email, phone, serviceInterest, message)' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
            return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
        }

        // Optional fields validation
        if (company !== undefined && company !== null && typeof company !== 'string') {
            return NextResponse.json({ success: false, error: 'company must be a string if provided' }, { status: 400 });
        }

        let resolvedStatus: any = 'NEW';
        if (status !== undefined) {
            if (!VALID_STATUSES.includes(status)) {
                return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
            }
            resolvedStatus = status;
        }

        if (internalNotes !== undefined && internalNotes !== null && typeof internalNotes !== 'string') {
            return NextResponse.json({ success: false, error: 'internalNotes must be a string if provided' }, { status: 400 });
        }

        if (isArchived !== undefined && typeof isArchived !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isArchived must be a strict boolean' }, { status: 400 });
        }

        // Verify duplicate conceptually (logging/tagging logic, doesn't block creation)
        const duplicateCount = await prisma.lead.count({
            where: { email: normalizedEmail, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } // created in last 30 days
        });

        // Create the lead
        const newLead = await prisma.lead.create({
            data: {
                fullName: fullName.trim(),
                email: normalizedEmail,
                phone: phone.trim(),
                serviceInterest: serviceInterest.trim(),
                message: message.trim(),
                company: (company && String(company).trim() !== '') ? String(company).trim() : null,
                status: resolvedStatus,
                internalNotes: (internalNotes && String(internalNotes).trim() !== '') ? String(internalNotes).trim() : null,
                isArchived: isArchived ?? false,
            }
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'LEAD_CREATED',
            entity: 'Lead',
            entityId: newLead.id,
            description: `Lead created for: ${newLead.email} (Duplicates checked: ${duplicateCount > 0 ? 'Yes' : 'No'})`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: newLead, metadata: { duplicateWarning: duplicateCount > 0 } }, { status: 201 });
    } catch (error) {
        console.error('Error creating Lead:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
