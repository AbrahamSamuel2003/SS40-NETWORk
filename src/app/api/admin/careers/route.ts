import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const department = searchParams.get('department');
        const isActiveParam = searchParams.get('isActive');
        const search = searchParams.get('search');

        const where: any = {};

        if (department && department !== 'ALL') {
            where.department = department;
        }

        if (isActiveParam === 'true') {
            where.isActive = true;
        } else if (isActiveParam === 'false') {
            where.isActive = false;
        }

        if (search && search.trim() !== '') {
            where.OR = [
                { title: { contains: search.trim(), mode: 'insensitive' } },
                { description: { contains: search.trim(), mode: 'insensitive' } },
            ];
        }

        const careers = await prisma.career.findMany({
            where,
            orderBy: [
                { isFeatured: 'desc' },
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({ success: true, data: careers });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
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
            department,
            employmentType,
            location,
            experienceLevel,
            salaryRange,
            description,
            responsibilities,
            requirements,
            skills,
            badgeText,
            applyLink,
            applyEmail,
            isFeatured,
            isActive,
            sortOrder,
            expiresAt
        } = body;

        if (!title || !department || !employmentType || !description) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: title, department, employmentType, and description are required.'
            }, { status: 400 });
        }

        const newCareer = await prisma.career.create({
            data: {
                title: String(title).trim(),
                department: String(department).trim(),
                employmentType: String(employmentType).trim(),
                location: location ? String(location).trim() : 'Tirunelveli, Tamil Nadu (Onsite / Hybrid)',
                experienceLevel: experienceLevel ? String(experienceLevel).trim() : 'Fresher / 0-1 Yr',
                salaryRange: salaryRange ? String(salaryRange).trim() : null,
                description: String(description).trim(),
                responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
                requirements: Array.isArray(requirements) ? requirements : [],
                skills: Array.isArray(skills) ? skills : [],
                badgeText: badgeText ? String(badgeText).trim() : null,
                applyLink: applyLink ? String(applyLink).trim() : null,
                applyEmail: applyEmail ? String(applyEmail).trim() : 'careers@ss40network.com',
                isFeatured: isFeatured === true,
                isActive: isActive !== false,
                sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            }
        });

        // Log admin activity
        await logAdminActivity({
            adminId: admin.id,
            action: 'CREATE',
            entity: 'Career',
            entityId: newCareer.id,
            description: `Created career vacancy: "${newCareer.title}" (${newCareer.department})`
        }).catch(() => {});

        // Revalidate public pages
        revalidatePath('/careers');

        return NextResponse.json({ success: true, data: newCareer }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
