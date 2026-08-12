import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const isValidJsonParam = (val: any) => {
    return typeof val === 'object' && val !== null;
};

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const isActiveParam = searchParams.get('isActive');
        const isConfidentialParam = searchParams.get('isConfidential');
        const searchParam = searchParams.get('search');
        const industryParam = searchParams.get('industry');
        const statusParam = searchParams.get('status');

        // Filter defaults
        let isActiveFilter: boolean | undefined = true;
        if (isActiveParam === 'false') {
            isActiveFilter = false;
        } else if (isActiveParam === 'all') {
            isActiveFilter = undefined; // allow 'all' if explicitly queried
        } else if (isActiveParam === 'true') {
            isActiveFilter = true;
        }

        const where: any = {};
        if (isActiveFilter !== undefined) {
            where.isActive = isActiveFilter;
        }

        if (isConfidentialParam === 'true') {
            where.isConfidential = true;
        } else if (isConfidentialParam === 'false') {
            where.isConfidential = false;
        }

        if (industryParam && industryParam.trim() !== '') {
            where.industry = industryParam.trim();
        }

        if (statusParam && statusParam.trim() !== '') {
            where.status = statusParam.trim();
        }

        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { title: { contains: searchParam, mode: 'insensitive' } },
                { industry: { contains: searchParam, mode: 'insensitive' } },
                { description: { contains: searchParam, mode: 'insensitive' } },
                { status: { contains: searchParam, mode: 'insensitive' } }
            ];
        }

        const clientProjects = await prisma.clientProject.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ]
        });

        return NextResponse.json({ success: true, data: clientProjects }, { status: 200 });
    } catch (error) {
        console.error('Error fetching ClientProjects:', error);
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
            title,
            industry,
            description,
            tags,
            status,
            isConfidential,
            sortOrder,
            isActive,
            imageUrl,
            projectUrl,
            caseStudy
        } = body;

        // Required fields check
        if (
            typeof title !== 'string' || title.trim() === '' ||
            typeof industry !== 'string' || industry.trim() === '' ||
            typeof description !== 'string' || description.trim() === '' ||
            !isValidJsonParam(tags)
        ) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid required fields (title, industry, description, tags)' },
                { status: 400 }
            );
        }

        // Optional field formatting and validation
        if (status !== undefined && status !== null && typeof status !== 'string') {
            return NextResponse.json({ success: false, error: 'status must be a string if provided' }, { status: 400 });
        }

        if (projectUrl && typeof projectUrl !== 'string') {
            return NextResponse.json({ success: false, error: 'projectUrl must be a string' }, { status: 400 });
        }

        if (projectUrl && !projectUrl.startsWith('http')) {
            return NextResponse.json({ success: false, error: 'projectUrl must be a valid HTTP/HTTPS URL' }, { status: 400 });
        }

        if (imageUrl && typeof imageUrl !== 'string') {
            return NextResponse.json({ success: false, error: 'imageUrl must be a string' }, { status: 400 });
        }

        if (caseStudy && typeof caseStudy !== 'string') {
            return NextResponse.json({ success: false, error: 'caseStudy must be a string' }, { status: 400 });
        }

        if (isConfidential !== undefined && typeof isConfidential !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isConfidential must be a strict boolean' }, { status: 400 });
        }

        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isActive must be a strict boolean' }, { status: 400 });
        }

        if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
            return NextResponse.json({ success: false, error: 'sortOrder must be an integer' }, { status: 400 });
        }

        const newClientProject = await prisma.clientProject.create({
            data: {
                title: title.trim(),
                industry: industry.trim(),
                description: description.trim(),
                tags,
                status: (status && String(status).trim() !== '') ? String(status).trim() : null,
                imageUrl: (imageUrl && String(imageUrl).trim() !== '') ? String(imageUrl).trim() : null,
                projectUrl: (projectUrl && String(projectUrl).trim() !== '') ? String(projectUrl).trim() : null,
                caseStudy: (caseStudy && String(caseStudy).trim() !== '') ? String(caseStudy).trim() : null,
                isConfidential: isConfidential ?? false,
                sortOrder: sortOrder ?? 0,
                isActive: isActive ?? true
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
            action: 'CLIENT_PROJECT_CREATED',
            entity: 'ClientProject',
            entityId: newClientProject.id,
            description: `ClientProject created: ${newClientProject.title}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: newClientProject }, { status: 201 });
    } catch (error) {
        console.error('Error creating ClientProject:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
