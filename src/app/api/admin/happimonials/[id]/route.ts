import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';
import { extractYouTubeVideoId } from '../route';

const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

const isValidAbsoluteUrl = (u: any) => {
    if (u === null || u === undefined || u === '') return true;
    if (typeof u !== 'string') return false;
    try {
        const parsed = new URL(u);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
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
            return NextResponse.json({ success: false, error: 'Invalid Happimonial ID format' }, { status: 400 });
        }

        const happimonial = await prisma.happimonial.findUnique({
            where: { id }
        });

        if (!happimonial) {
            return NextResponse.json({ success: false, error: 'Happimonial not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: happimonial }, { status: 200 });
    } catch (error) {
        console.error('Error fetching Happimonial:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Happimonial ID format' }, { status: 400 });
        }

        const existing = await prisma.happimonial.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Happimonial not found' }, { status: 404 });
        }

        const body = await request.json();
        const updateData: any = {};

        if (body.clientName !== undefined) {
            if (typeof body.clientName !== 'string' || body.clientName.trim() === '') {
                return NextResponse.json({ success: false, error: 'clientName must be a non-empty string' }, { status: 400 });
            }
            updateData.clientName = body.clientName.trim();
        }

        if (body.companyName !== undefined) {
            if (typeof body.companyName !== 'string' || body.companyName.trim() === '') {
                return NextResponse.json({ success: false, error: 'companyName must be a non-empty string' }, { status: 400 });
            }
            updateData.companyName = body.companyName.trim();
        }

        if (body.industry !== undefined) {
            if (typeof body.industry !== 'string' || body.industry.trim() === '') {
                return NextResponse.json({ success: false, error: 'industry must be a non-empty string' }, { status: 400 });
            }
            updateData.industry = body.industry.trim();
        }

        if (body.testimonial !== undefined) {
            if (typeof body.testimonial !== 'string' || body.testimonial.trim() === '') {
                return NextResponse.json({ success: false, error: 'testimonial must be a non-empty string' }, { status: 400 });
            }
            updateData.testimonial = body.testimonial.trim();
        }

        if (body.videoUrl !== undefined) {
            if (!isValidAbsoluteUrl(body.videoUrl)) {
                return NextResponse.json({ success: false, error: 'videoUrl must be a valid absolute HTTP/HTTPS URL' }, { status: 400 });
            }
            updateData.videoUrl = (body.videoUrl && typeof body.videoUrl === 'string' && body.videoUrl.trim() !== '') ? body.videoUrl.trim() : null;
        }

        // youtubeUrl — validate format + one-video-HOME rule
        if (body.youtubeUrl !== undefined) {
            const rawYt = String(body.youtubeUrl ?? '').trim();
            if (rawYt === '') {
                // Explicitly clearing
                updateData.youtubeUrl = null;
            } else {
                const videoId = extractYouTubeVideoId(rawYt);
                if (!videoId) {
                    return NextResponse.json({ success: false, error: 'Please enter a valid YouTube video URL.' }, { status: 400 });
                }
                const resolvedYoutubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                // One-video-HOME rule: only when the record's scope is HOME, exclude self
                const effectiveScope = body.pageScope ? String(body.pageScope).trim() : existing.pageScope;
                if (effectiveScope === 'HOME') {
                    const conflict = await prisma.happimonial.findFirst({
                        where: {
                            pageScope: 'HOME',
                            youtubeUrl: { not: null },
                            id: { not: id }
                        }
                    });
                    if (conflict) {
                        return NextResponse.json({
                            success: false,
                            error: 'A YouTube video is already assigned to another Home success story. Only one Home success story can contain a video.'
                        }, { status: 409 });
                    }
                }
                updateData.youtubeUrl = resolvedYoutubeUrl;
            }
        }

        if (body.thumbnailUrl !== undefined) {
            if (!isValidUrlPath(body.thumbnailUrl)) {
                return NextResponse.json({ success: false, error: 'thumbnailUrl must be a valid absolute or relative URL' }, { status: 400 });
            }
            updateData.thumbnailUrl = (body.thumbnailUrl && typeof body.thumbnailUrl === 'string' && body.thumbnailUrl.trim() !== '') ? body.thumbnailUrl.trim() : null;
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

        if (body.pageScope !== undefined) {
            updateData.pageScope = String(body.pageScope).trim();
        }

        const updatedHappimonial = await prisma.happimonial.update({
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
            action: 'HAPPIMONIAL_UPDATED',
            entity: 'Happimonial',
            entityId: id,
            description: `Happimonial updated for: ${updatedHappimonial.clientName} (${updatedHappimonial.companyName})`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: updatedHappimonial }, { status: 200 });
    } catch (error) {
        console.error('Error updating Happimonial:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Happimonial ID format' }, { status: 400 });
        }

        const existing = await prisma.happimonial.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Happimonial not found' }, { status: 404 });
        }

        await prisma.happimonial.delete({
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
            action: 'HAPPIMONIAL_DELETED',
            entity: 'Happimonial',
            entityId: id,
            description: `Happimonial deleted for: ${existing.clientName} (${existing.companyName})`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, message: 'Happimonial deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Happimonial:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
