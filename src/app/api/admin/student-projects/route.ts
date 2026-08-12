import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const isValidJsonParam = (val: any) => {
    return typeof val === 'object' && val !== null;
};

const isValidUrlPath = (u: any) => {
    if (u === null || u === undefined || u === '') return true;
    if (typeof u !== 'string') return false;
    if (u.startsWith('/')) return true;
    try {
        new URL(u);
        return true;
    } catch {
        return false;
    }
};

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const isActiveParam = searchParams.get('isActive');
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');

        // Filter defaults for isActive
        let isActiveFilter: boolean | undefined = true;
        if (isActiveParam === 'false') {
            isActiveFilter = false;
        } else if (isActiveParam === 'all') {
            isActiveFilter = undefined;
        } else if (isActiveParam === 'true') {
            isActiveFilter = true;
        }

        const where: any = {};
        if (isActiveFilter !== undefined) {
            where.isActive = isActiveFilter;
        }

        if (categoryParam && categoryParam.trim() !== '') {
            where.category = categoryParam.trim();
        }

        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { title: { contains: searchParam, mode: 'insensitive' } },
                { category: { contains: searchParam, mode: 'insensitive' } },
                { badge: { contains: searchParam, mode: 'insensitive' } },
                { description: { contains: searchParam, mode: 'insensitive' } },
            ];
        }

        const studentProjects = await prisma.studentProject.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ]
        });

        return NextResponse.json({ success: true, data: studentProjects }, { status: 200 });
    } catch (error) {
        console.error('Error fetching StudentProjects:', error);
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
            category,
            badge,
            description,
            imageUrl,
            tags,
            sortOrder,
            isActive
        } = body;

        // Required fields check
        if (
            typeof title !== 'string' || title.trim() === '' ||
            typeof category !== 'string' || category.trim() === '' ||
            typeof description !== 'string' || description.trim() === '' ||
            !isValidJsonParam(tags)
        ) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid required fields (title, category, description, tags)' },
                { status: 400 }
            );
        }

        // Optional field formatting and validation
        if (badge !== undefined && badge !== null && typeof badge !== 'string') {
            return NextResponse.json({ success: false, error: 'badge must be a string if provided' }, { status: 400 });
        }

        if (imageUrl !== undefined && !isValidUrlPath(imageUrl)) {
            return NextResponse.json({ success: false, error: 'imageUrl must be a valid absolute or relative URL' }, { status: 400 });
        }

        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isActive must be a strict boolean' }, { status: 400 });
        }

        if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
            return NextResponse.json({ success: false, error: 'sortOrder must be an integer' }, { status: 400 });
        }

        const newStudentProject = await prisma.studentProject.create({
            data: {
                title: title.trim(),
                category: category.trim(),
                description: description.trim(),
                tags,
                badge: (badge && String(badge).trim() !== '') ? String(badge).trim() : null,
                imageUrl: (imageUrl && String(imageUrl).trim() !== '') ? String(imageUrl).trim() : null,
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
            action: 'STUDENT_PROJECT_CREATED',
            entity: 'StudentProject',
            entityId: newStudentProject.id,
            description: `StudentProject created: ${newStudentProject.title}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: newStudentProject }, { status: 201 });
    } catch (error) {
        console.error('Error creating StudentProject:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
