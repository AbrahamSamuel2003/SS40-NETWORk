import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const VALID_MEDIA_TYPES = ['IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER'];

const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

const isValidUrlPath = (u: any) => {
    if (u === null || u === undefined || u === '') return true;
    if (typeof u !== 'string') return false;
    if (u.startsWith('/')) return true;
    try {
        const parsed = new URL(u);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
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
            return NextResponse.json({ success: false, error: 'Invalid Media ID format' }, { status: 400 });
        }

        const media = await prisma.media.findUnique({
            where: { id }
        });

        if (!media) {
            return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: media }, { status: 200 });
    } catch (error) {
        console.error('Error fetching Media:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Media ID format' }, { status: 400 });
        }

        const existing = await prisma.media.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
        }

        const updateData: any = {};

        if (body.fileName !== undefined) {
            if (typeof body.fileName !== 'string' || body.fileName.trim() === '') {
                return NextResponse.json({ success: false, error: 'fileName must be a non-empty string' }, { status: 400 });
            }
            updateData.fileName = body.fileName.trim();
        }

        if (body.fileUrl !== undefined) {
            if (!isValidUrlPath(body.fileUrl) || typeof body.fileUrl !== 'string' || body.fileUrl.trim() === '') {
                return NextResponse.json({ success: false, error: 'fileUrl must be a valid non-empty URL or path' }, { status: 400 });
            }
            updateData.fileUrl = body.fileUrl.trim();
        }

        if (body.mimeType !== undefined) {
            if (typeof body.mimeType !== 'string' || body.mimeType.trim() === '') {
                return NextResponse.json({ success: false, error: 'mimeType must be a non-empty string' }, { status: 400 });
            }
            updateData.mimeType = body.mimeType.trim();
        }

        if (body.mediaType !== undefined) {
            if (!VALID_MEDIA_TYPES.includes(body.mediaType)) {
                return NextResponse.json({ success: false, error: 'Invalid mediaType' }, { status: 400 });
            }
            updateData.mediaType = body.mediaType as any;
        }

        if (body.fileSize !== undefined) {
            if (body.fileSize !== null && !Number.isInteger(body.fileSize)) {
                return NextResponse.json({ success: false, error: 'fileSize must be an integer if provided' }, { status: 400 });
            }
            updateData.fileSize = body.fileSize;
        }

        if (body.altText !== undefined) {
            if (body.altText !== null && typeof body.altText !== 'string') {
                return NextResponse.json({ success: false, error: 'altText must be a string if provided' }, { status: 400 });
            }
            updateData.altText = (body.altText && body.altText.trim() !== '') ? body.altText.trim() : null;
        }

        if (body.uploadedBy !== undefined) {
            if (body.uploadedBy !== null && typeof body.uploadedBy !== 'string') {
                return NextResponse.json({ success: false, error: 'uploadedBy must be a string if provided' }, { status: 400 });
            }
            updateData.uploadedBy = (body.uploadedBy && body.uploadedBy.trim() !== '') ? body.uploadedBy.trim() : null;
        }

        if (body.isActive !== undefined) {
            if (typeof body.isActive !== 'boolean') {
                return NextResponse.json({ success: false, error: 'isActive must be a strict boolean' }, { status: 400 });
            }
            updateData.isActive = body.isActive;
        }

        if (body.pageScope !== undefined) {
            updateData.pageScope = String(body.pageScope).trim();
        }

        const updatedMedia = await prisma.media.update({
            where: { id },
            data: updateData
        });

        let clientIp = null;
        let clientAgent = null;
        try {
            clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            clientAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'MEDIA_UPDATED',
            entity: 'Media',
            entityId: id,
            description: `Media updated: ${updatedMedia.fileName}`,
            ipAddress: clientIp,
            userAgent: clientAgent
        });

        return NextResponse.json({ success: true, data: updatedMedia }, { status: 200 });
    } catch (error) {
        console.error('Error updating Media:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Media ID format' }, { status: 400 });
        }

        const existing = await prisma.media.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Media not found' }, { status: 404 });
        }

        await prisma.media.delete({
            where: { id }
        });

        let clientIp = null;
        let clientAgent = null;
        try {
            clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            clientAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'MEDIA_DELETED',
            entity: 'Media',
            entityId: id,
            description: `Media deleted: ${existing.fileName}`,
            ipAddress: clientIp,
            userAgent: clientAgent
        });

        return NextResponse.json({ success: true, message: 'Media deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Media:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
