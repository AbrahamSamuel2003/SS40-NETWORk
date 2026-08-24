import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';
import { revalidateEntityCache } from '@/lib/revalidate-helpers';

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const record = await prisma.activityPost.findUnique({ where: { id } });
        if (!record) return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: record });
    } catch (error) {
        console.error('Error fetching activity post:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch activity post' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        const existingRecord = await prisma.activityPost.findUnique({ where: { id } });
        if (!existingRecord) return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });

        let updateData: any = {};
        if (body.title !== undefined) updateData.title = body.title;
        if (body.summary !== undefined) updateData.summary = body.summary;
        if (body.content !== undefined) updateData.content = body.content;
        if (body.activityType !== undefined) updateData.activityType = body.activityType;
        if (body.location !== undefined) updateData.location = body.location;
        if (body.activityDate !== undefined) updateData.activityDate = new Date(body.activityDate);
        if (body.externalLink !== undefined) updateData.externalLink = body.externalLink;
        if (body.isFeatured !== undefined) updateData.isFeatured = !!body.isFeatured;
        if (body.showOnHome !== undefined) updateData.showOnHome = !!body.showOnHome;
        if (body.sortOrder !== undefined) updateData.sortOrder = isNaN(Number(body.sortOrder)) ? 0 : Number(body.sortOrder);
        if (body.isActive !== undefined) updateData.isActive = !!body.isActive;

        if (body.images !== undefined) {
            let imagesArray = Array.isArray(body.images) ? body.images : [];
            if (imagesArray.length > 5) {
                imagesArray = imagesArray.slice(0, 5);
            }
            updateData.images = imagesArray;
        }

        if (body.slug !== undefined && body.slug !== existingRecord.slug) {
            let baseSlug = slugify(body.slug || body.title || 'activity');
            let uniqueSlug = baseSlug;
            let counter = 1;
            while (true) {
                const clash = await prisma.activityPost.findFirst({
                    where: { slug: uniqueSlug, NOT: { id } }
                });
                if (!clash) break;
                uniqueSlug = `${baseSlug}-${counter}`;
                counter++;
            }
            updateData.slug = uniqueSlug;
        }

        const updatedRecord = await prisma.activityPost.update({
            where: { id },
            data: updateData
        });

        await logAdminActivity({
            adminId: admin.id,
            action: 'UPDATE',
            entity: 'ActivityPost',
            entityId: id,
            description: `Updated activity post: ${updatedRecord.title}`
        });

        // Invalidate Next.js cache so the updated post appears immediately on public pages
        revalidateEntityCache('ACTIVITY');

        return NextResponse.json({ success: true, data: updatedRecord });
    } catch (error) {
        console.error('Error updating activity post:', error);
        return NextResponse.json({ success: false, error: 'Failed to update activity post' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const record = await prisma.activityPost.findUnique({ where: { id } });
        if (!record) return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });

        await prisma.activityPost.delete({
            where: { id }
        });

        await logAdminActivity({
            adminId: admin.id,
            action: 'DELETE',
            entity: 'ActivityPost',
            entityId: id,
            description: `Deleted activity post: ${record.title}`
        });

        // Invalidate Next.js cache so the deleted post is removed from public pages immediately
        revalidateEntityCache('ACTIVITY');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting activity post:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete activity post' }, { status: 500 });
    }
}
