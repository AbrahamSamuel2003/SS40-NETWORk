import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

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

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid StudentProject ID format' }, { status: 400 });
        }

        const studentProject = await prisma.studentProject.findUnique({
            where: { id }
        });

        if (!studentProject) {
            return NextResponse.json({ success: false, error: 'StudentProject not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: studentProject }, { status: 200 });
    } catch (error) {
        console.error('Error fetching StudentProject:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid StudentProject ID format' }, { status: 400 });
        }

        const existing = await prisma.studentProject.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'StudentProject not found' }, { status: 404 });
        }

        const body = await request.json();
        const updateData: any = {};

        if (body.title !== undefined) {
            if (typeof body.title !== 'string' || body.title.trim() === '') {
                return NextResponse.json({ success: false, error: 'title must be a non-empty string' }, { status: 400 });
            }
            updateData.title = body.title.trim();
        }

        if (body.category !== undefined) {
            if (typeof body.category !== 'string' || body.category.trim() === '') {
                return NextResponse.json({ success: false, error: 'category must be a non-empty string' }, { status: 400 });
            }
            updateData.category = body.category.trim();
        }

        if (body.description !== undefined) {
            if (typeof body.description !== 'string' || body.description.trim() === '') {
                return NextResponse.json({ success: false, error: 'description must be a non-empty string' }, { status: 400 });
            }
            updateData.description = body.description.trim();
        }

        if (body.tags !== undefined) {
            if (!isValidJsonParam(body.tags)) {
                return NextResponse.json({ success: false, error: 'tags must be valid JSON' }, { status: 400 });
            }
            updateData.tags = body.tags;
        }

        if (body.badge !== undefined) {
            if (body.badge !== null && typeof body.badge !== 'string') {
                return NextResponse.json({ success: false, error: 'badge must be a string if provided' }, { status: 400 });
            }
            updateData.badge = (body.badge && typeof body.badge === 'string' && body.badge.trim() !== '') ? body.badge.trim() : null;
        }

        if (body.imageUrl !== undefined) {
            if (!isValidUrlPath(body.imageUrl)) {
                return NextResponse.json({ success: false, error: 'imageUrl must be a valid absolute or relative URL' }, { status: 400 });
            }
            updateData.imageUrl = (body.imageUrl && typeof body.imageUrl === 'string' && body.imageUrl.trim() !== '') ? body.imageUrl.trim() : null;
        }

        if (body.isActive !== undefined) {
            if (typeof body.isActive !== 'boolean') {
                return NextResponse.json({ success: false, error: 'isActive must be a strict boolean' }, { status: 400 });
            }
            updateData.isActive = body.isActive;
        }

        if (body.sortOrder !== undefined) {
            if (!Number.isInteger(body.sortOrder)) {
                return NextResponse.json({ success: false, error: 'sortOrder must be an integer' }, { status: 400 });
            }
            updateData.sortOrder = body.sortOrder;
        }

        const updatedStudentProject = await prisma.studentProject.update({
            where: { id },
            data: updateData
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'STUDENT_PROJECT_UPDATED',
            entity: 'StudentProject',
            entityId: id,
            description: `StudentProject updated: ${updatedStudentProject.title}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: updatedStudentProject }, { status: 200 });
    } catch (error) {
        console.error('Error updating StudentProject:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid StudentProject ID format' }, { status: 400 });
        }

        const existing = await prisma.studentProject.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'StudentProject not found' }, { status: 404 });
        }

        await prisma.studentProject.delete({
            where: { id }
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'STUDENT_PROJECT_DELETED',
            entity: 'StudentProject',
            entityId: id,
            description: `StudentProject deleted: ${existing.title}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, message: 'StudentProject deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting StudentProject:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
