import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';
import { revalidatePath } from 'next/cache';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const career = await prisma.career.findUnique({
            where: { id }
        });

        if (!career) {
            return NextResponse.json({ success: false, error: 'Career vacancy not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: career });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        const existing = await prisma.career.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json({ success: false, error: 'Career vacancy not found' }, { status: 404 });
        }

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

        const updateData: any = {};
        if (title !== undefined) updateData.title = String(title).trim();
        if (department !== undefined) updateData.department = String(department).trim();
        if (employmentType !== undefined) updateData.employmentType = String(employmentType).trim();
        if (location !== undefined) updateData.location = String(location).trim();
        if (experienceLevel !== undefined) updateData.experienceLevel = String(experienceLevel).trim();
        if (salaryRange !== undefined) updateData.salaryRange = salaryRange ? String(salaryRange).trim() : null;
        if (description !== undefined) updateData.description = String(description).trim();
        if (responsibilities !== undefined && Array.isArray(responsibilities)) updateData.responsibilities = responsibilities;
        if (requirements !== undefined && Array.isArray(requirements)) updateData.requirements = requirements;
        if (skills !== undefined && Array.isArray(skills)) updateData.skills = skills;
        if (badgeText !== undefined) updateData.badgeText = badgeText ? String(badgeText).trim() : null;
        if (applyLink !== undefined) updateData.applyLink = applyLink ? String(applyLink).trim() : null;
        if (applyEmail !== undefined) updateData.applyEmail = applyEmail ? String(applyEmail).trim() : 'careers@ss40network.com';
        if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);
        if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder) || 0;
        if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

        const updated = await prisma.career.update({
            where: { id },
            data: updateData
        });

        // Log admin activity
        await logAdminActivity({
            adminId: admin.id,
            action: 'UPDATE',
            entity: 'Career',
            entityId: updated.id,
            description: `Updated career vacancy: "${updated.title}"`
        }).catch(() => {});

        revalidatePath('/careers');

        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const existing = await prisma.career.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json({ success: false, error: 'Career vacancy not found' }, { status: 404 });
        }

        await prisma.career.delete({
            where: { id }
        });

        await logAdminActivity({
            adminId: admin.id,
            action: 'DELETE',
            entity: 'Career',
            entityId: id,
            description: `Deleted career vacancy: "${existing.title}"`
        }).catch(() => {});

        revalidatePath('/careers');

        return NextResponse.json({ success: true, message: 'Career vacancy deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
