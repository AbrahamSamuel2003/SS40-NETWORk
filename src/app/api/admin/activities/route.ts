import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';
import { revalidateEntityCache } from '@/lib/revalidate-helpers';

export async function GET() {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const activities = await prisma.activityPost.findMany({
            orderBy: [{ sortOrder: 'asc' }, { activityDate: 'desc' }, { createdAt: 'desc' }]
        });
        return NextResponse.json({ success: true, data: activities });
    } catch (error) {
        console.error('Error fetching admin activities:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch activities' }, { status: 500 });
    }
}

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

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        // Validation
        if (!body.title || !body.summary) {
            return NextResponse.json({ success: false, error: 'Title and Summary are required' }, { status: 400 });
        }

        // Limit images to max 5
        let imagesArray = Array.isArray(body.images) ? body.images : [];
        if (imagesArray.length > 5) {
            imagesArray = imagesArray.slice(0, 5);
        }

        // Unique slug generation
        let baseSlug = body.slug ? slugify(body.slug) : slugify(body.title);
        if (!baseSlug) baseSlug = `activity-${Date.now()}`;
        let uniqueSlug = baseSlug;
        let counter = 1;
        while (await prisma.activityPost.findUnique({ where: { slug: uniqueSlug } })) {
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        const newRecord = await prisma.activityPost.create({
            data: {
                title: body.title,
                slug: uniqueSlug,
                activityType: body.activityType || 'MEETING',
                summary: body.summary,
                content: body.content || '',
                images: imagesArray,
                location: body.location || null,
                activityDate: body.activityDate ? new Date(body.activityDate) : new Date(),
                externalLink: body.externalLink || null,
                isFeatured: !!body.isFeatured,
                showOnHome: body.showOnHome !== undefined ? !!body.showOnHome : true,
                sortOrder: isNaN(Number(body.sortOrder)) ? 0 : Number(body.sortOrder),
                isActive: body.isActive !== undefined ? !!body.isActive : true
            }
        });

        await logAdminActivity({
            adminId: admin.id,
            action: 'CREATE',
            entity: 'ActivityPost',
            entityId: newRecord.id,
            description: `Created activity post: ${newRecord.title}`
        });

        // Invalidate Next.js cache so the new post appears immediately on public pages
        revalidateEntityCache('ACTIVITY');

        return NextResponse.json({ success: true, data: newRecord });
    } catch (error) {
        console.error('Error creating activity post:', error);
        return NextResponse.json({ success: false, error: 'Failed to create activity post' }, { status: 500 });
    }
}
