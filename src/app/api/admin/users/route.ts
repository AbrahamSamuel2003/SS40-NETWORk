import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const VALID_ROLES = ['ADMIN', 'MEMBER'];

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
        const searchParam = searchParams.get('search');
        const roleParam = searchParams.get('role');
        const limitStr = searchParams.get('limit') || '20';
        const pageStr = searchParams.get('page') || '1';

        const where: any = {};

        if (roleParam) {
            if (VALID_ROLES.includes(roleParam)) {
                where.role = roleParam;
            } else {
                return NextResponse.json({ success: false, error: 'Invalid role filter' }, { status: 400 });
            }
        }

        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { name: { contains: searchParam, mode: 'insensitive' } },
                { email: { contains: searchParam, mode: 'insensitive' } },
            ];
        }

        let limit = parseInt(limitStr, 10);
        if (isNaN(limit) || limit <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid limit parameter' }, { status: 400 });
        }
        if (limit > 100) limit = 100;

        let page = parseInt(pageStr, 10);
        if (isNaN(page) || page <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid page parameter' }, { status: 400 });
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma.user.count({ where })
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
        console.error('Error fetching Users:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
        }

        const { name, email, role } = body;

        // Required fields check
        if (typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'name is required and must be a non-empty string' },
                { status: 400 }
            );
        }
        if (typeof email !== 'string' || email.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'email is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
            return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
        }

        let resolvedRole: any = 'MEMBER';
        if (role !== undefined) {
            if (!VALID_ROLES.includes(role)) {
                return NextResponse.json({ success: false, error: 'Invalid role specified' }, { status: 400 });
            }
            resolvedRole = role;
        }

        // Check for duplicate email
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (existingUser) {
            return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 409 });
        }

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                passwordHash: 'UNSET_PASSWORD',
                role: resolvedRole
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        let clientIp = null;
        let clientAgent = null;
        try {
            clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            clientAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'USER_CREATED',
            entity: 'User',
            entityId: newUser.id,
            description: `User created: ${newUser.email} (${newUser.role})`,
            ipAddress: clientIp,
            userAgent: clientAgent
        });

        return NextResponse.json({ success: true, data: newUser }, { status: 201 });
    } catch (error) {
        console.error('Error creating User:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
