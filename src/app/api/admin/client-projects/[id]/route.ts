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

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid ClientProject ID format' }, { status: 400 });
        }

        const clientProject = await prisma.clientProject.findUnique({
            where: { id }
        });

        if (!clientProject) {
            return NextResponse.json({ success: false, error: 'ClientProject not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: clientProject }, { status: 200 });
    } catch (error) {
        console.error('Error fetching ClientProject:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid ClientProject ID format' }, { status: 400 });
        }

        const existing = await prisma.clientProject.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'ClientProject not found' }, { status: 404 });
        }

        const body = await request.json();
        const updateData: any = {};

        if (body.title !== undefined) {
            if (typeof body.title !== 'string' || body.title.trim() === '') {
                return NextResponse.json({ success: false, error: 'title must be a non-empty string' }, { status: 400 });
            }
            updateData.title = body.title.trim();
        }

        if (body.industry !== undefined) {
            if (typeof body.industry !== 'string' || body.industry.trim() === '') {
                return NextResponse.json({ success: false, error: 'industry must be a non-empty string' }, { status: 400 });
            }
            updateData.industry = body.industry.trim();
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

        if (body.status !== undefined) {
            if (body.status !== null && typeof body.status !== 'string') {
                return NextResponse.json({ success: false, error: 'status must be a string if provided' }, { status: 400 });
            }
            updateData.status = (body.status && typeof body.status === 'string' && body.status.trim() !== '') ? body.status.trim() : null;
        }

        if (body.isConfidential !== undefined) {
            if (typeof body.isConfidential !== 'boolean') {
                return NextResponse.json({ success: false, error: 'isConfidential must be a strict boolean' }, { status: 400 });
            }
            updateData.isConfidential = body.isConfidential;
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

        if (body.imageUrl !== undefined) {
            if (body.imageUrl !== null && typeof body.imageUrl !== 'string') {
                return NextResponse.json({ success: false, error: 'imageUrl must be a string' }, { status: 400 });
            }
            updateData.imageUrl = (body.imageUrl && typeof body.imageUrl === 'string' && body.imageUrl.trim() !== '') ? body.imageUrl.trim() : null;
        }

        if (body.projectUrl !== undefined) {
            if (body.projectUrl !== null && typeof body.projectUrl !== 'string') {
                return NextResponse.json({ success: false, error: 'projectUrl must be a string' }, { status: 400 });
            }
            if (body.projectUrl && typeof body.projectUrl === 'string' && !body.projectUrl.trim().startsWith('http')) {
                return NextResponse.json({ success: false, error: 'projectUrl must be a valid HTTP/HTTPS URL' }, { status: 400 });
            }
            updateData.projectUrl = (body.projectUrl && typeof body.projectUrl === 'string' && body.projectUrl.trim() !== '') ? body.projectUrl.trim() : null;
        }

        if (body.caseStudy !== undefined) {
            if (body.caseStudy !== null && typeof body.caseStudy !== 'string') {
                return NextResponse.json({ success: false, error: 'caseStudy must be a string' }, { status: 400 });
            }
            updateData.caseStudy = (body.caseStudy && typeof body.caseStudy === 'string' && body.caseStudy.trim() !== '') ? body.caseStudy.trim() : null;
        }

        // Apply partial update safely
        const updatedClientProject = await prisma.clientProject.update({
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
            action: 'CLIENT_PROJECT_UPDATED',
            entity: 'ClientProject',
            entityId: id,
            description: `ClientProject updated: ${updatedClientProject.title}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: updatedClientProject }, { status: 200 });
    } catch (error) {
        console.error('Error updating ClientProject:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid ClientProject ID format' }, { status: 400 });
        }

        const existing = await prisma.clientProject.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'ClientProject not found' }, { status: 404 });
        }

        await prisma.clientProject.delete({
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
            action: 'CLIENT_PROJECT_DELETED',
            entity: 'ClientProject',
            entityId: id,
            description: `ClientProject deleted: ${existing.title}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, message: 'ClientProject deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting ClientProject:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
