import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';
import { revalidateEntityCache } from '@/lib/revalidate-helpers';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const { id } = await context.params;
        const activity = await prisma.activityPost.findUnique({
            where: { id }
        });

        if (!activity) {
            return NextResponse.json({ success: false, error: 'Activity post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: activity });
    } catch (error) {
        console.error('Error fetching activity post:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch activity post' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const { id } = await context.params;
        const body = await request.json();

        const existing = await prisma.activityPost.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Activity post not found' }, { status: 404 });
        }

        let imagesArray = body.images !== undefined ? (Array.isArray(body.images) ? body.images : []) : undefined;
        if (imagesArray && imagesArray.length > 5) {
            imagesArray = imagesArray.slice(0, 5);
        }

        const updated = await prisma.activityPost.update({
            where: { id },
            data: {
                title: body.title !== undefined ? body.title : undefined,
                activityType: body.activityType !== undefined ? body.activityType : undefined,
                summary: body.summary !== undefined ? body.summary : undefined,
                content: body.content !== undefined ? body.content : undefined,
                images: imagesArray !== undefined ? imagesArray : undefined,
                location: body.location !== undefined ? body.location : undefined,
                activityDate: body.activityDate ? new Date(body.activityDate) : undefined,
                externalLink: body.externalLink !== undefined ? body.externalLink : undefined,
                isFeatured: body.isFeatured !== undefined ? !!body.isFeatured : undefined,
                showOnHome: body.showOnHome !== undefined ? !!body.showOnHome : undefined,
                sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
                isActive: body.isActive !== undefined ? !!body.isActive : undefined
            }
        });

        await logAdminActivity({
            adminId: admin.id,
            action: 'UPDATE',
            entity: 'ActivityPost',
            entityId: id,
            description: `Updated activity post: ${updated.title}`
        });

        revalidateEntityCache('ACTIVITY');

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating activity post:', error);
        return NextResponse.json({ success: false, error: 'Failed to update activity post' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const { id } = await context.params;
        const existing = await prisma.activityPost.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Activity post not found' }, { status: 404 });
        }

        await prisma.activityPost.delete({ where: { id } });

        await logAdminActivity({
            adminId: admin.id,
            action: 'DELETE',
            entity: 'ActivityPost',
            entityId: id,
            description: `Deleted activity post: ${existing.title}`
        });

        revalidateEntityCache('ACTIVITY');

        return NextResponse.json({ success: true, message: 'Activity post deleted' });
    } catch (error) {
        console.error('Error deleting activity post:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete activity post' }, { status: 500 });
    }
}
