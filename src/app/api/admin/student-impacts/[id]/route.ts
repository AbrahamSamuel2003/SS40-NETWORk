import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

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

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid StudentImpact ID format' }, { status: 400 });
        }

        const studentImpact = await prisma.studentImpact.findUnique({
            where: { id }
        });

        if (!studentImpact) {
            return NextResponse.json({ success: false, error: 'StudentImpact not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: studentImpact }, { status: 200 });
    } catch (error) {
        console.error('Error fetching StudentImpact:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid StudentImpact ID format' }, { status: 400 });
        }

        const existing = await prisma.studentImpact.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'StudentImpact not found' }, { status: 404 });
        }

        const body = await request.json();
        const updateData: any = {};

        if (body.studentName !== undefined) {
            if (typeof body.studentName !== 'string' || body.studentName.trim() === '') {
                return NextResponse.json({ success: false, error: 'studentName must be a non-empty string' }, { status: 400 });
            }
            updateData.studentName = body.studentName.trim();
        }

        if (body.designation !== undefined) {
            if (typeof body.designation !== 'string' || body.designation.trim() === '') {
                return NextResponse.json({ success: false, error: 'designation must be a non-empty string' }, { status: 400 });
            }
            updateData.designation = body.designation.trim();
        }

        if (body.quote !== undefined) {
            if (typeof body.quote !== 'string' || body.quote.trim() === '') {
                return NextResponse.json({ success: false, error: 'quote must be a non-empty string' }, { status: 400 });
            }
            updateData.quote = body.quote.trim();
        }

        if (body.academicRoute !== undefined) {
            if (typeof body.academicRoute !== 'string' || body.academicRoute.trim() === '') {
                return NextResponse.json({ success: false, error: 'academicRoute must be a non-empty string' }, { status: 400 });
            }
            updateData.academicRoute = body.academicRoute.trim();
        }

        if (body.videoUrl !== undefined) {
            if (!isValidAbsoluteUrl(body.videoUrl)) {
                return NextResponse.json({ success: false, error: 'videoUrl must be a valid absolute HTTP/HTTPS URL' }, { status: 400 });
            }
            updateData.videoUrl = (body.videoUrl && typeof body.videoUrl === 'string' && body.videoUrl.trim() !== '') ? body.videoUrl.trim() : null;
        }

        if (body.isFeatured !== undefined) {
            if (typeof body.isFeatured !== 'boolean') {
                return NextResponse.json({ success: false, error: 'isFeatured must be a strict boolean' }, { status: 400 });
            }
            updateData.isFeatured = body.isFeatured;
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

        if (body.youtubeUrl !== undefined) {
            if (body.youtubeUrl && String(body.youtubeUrl).trim() !== '') {
                const { extractYouTubeVideoId } = await import('../route');
                const videoId = extractYouTubeVideoId(String(body.youtubeUrl).trim());
                if (!videoId) {
                    return NextResponse.json({ success: false, error: 'Please enter a valid YouTube video URL.' }, { status: 400 });
                }
                updateData.youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
            } else {
                updateData.youtubeUrl = null;
            }
        }

        if (updateData.youtubeUrl !== undefined && updateData.youtubeUrl !== null) {
            const existing = await prisma.studentImpact.findFirst({
                where: {
                    youtubeUrl: { not: null },
                    id: { not: id } // exclude self
                }
            });
            if (existing) {
                return NextResponse.json({
                    success: false,
                    error: 'A YouTube video is already assigned to another Student Impact. Only one video is allowed.'
                }, { status: 409 });
            }
        }

        const updatedStudentImpact = await prisma.studentImpact.update({
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
            action: 'STUDENT_IMPACT_UPDATED',
            entity: 'StudentImpact',
            entityId: id,
            description: `StudentImpact updated for: ${updatedStudentImpact.studentName}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: updatedStudentImpact }, { status: 200 });
    } catch (error) {
        console.error('Error updating StudentImpact:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid StudentImpact ID format' }, { status: 400 });
        }

        const existing = await prisma.studentImpact.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'StudentImpact not found' }, { status: 404 });
        }

        await prisma.studentImpact.delete({
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
            action: 'STUDENT_IMPACT_DELETED',
            entity: 'StudentImpact',
            entityId: id,
            description: `StudentImpact deleted for: ${existing.studentName}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, message: 'StudentImpact deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting StudentImpact:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
