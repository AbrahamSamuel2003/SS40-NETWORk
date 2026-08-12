import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

// Helpers
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

const isValidJsonParam = (val: any) => {
    return typeof val === 'object' && val !== null;
};

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const isActiveParam = searchParams.get('isActive');
        const isFeaturedParam = searchParams.get('isFeatured');
        const searchParam = searchParams.get('search');

        // Default to active only, unless explicitly asked for false or all
        let isActiveFilter: boolean | undefined = true;
        if (isActiveParam === 'false') {
            isActiveFilter = false;
        } else if (isActiveParam === 'all') {
            isActiveFilter = undefined;
        } else if (isActiveParam === 'true') {
            isActiveFilter = true;
        }

        const where: any = {};
        if (isActiveFilter !== undefined) {
            where.isActive = isActiveFilter;
        }

        if (isFeaturedParam === 'true') {
            where.isFeatured = true;
        } else if (isFeaturedParam === 'false') {
            where.isFeatured = false;
        }

        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { marketingTitle: { contains: searchParam, mode: 'insensitive' } },
                { description: { contains: searchParam, mode: 'insensitive' } },
                { badgeText: { contains: searchParam, mode: 'insensitive' } },
            ];
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' },
            ],
        });

        return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error) {
        console.error('Error fetching Products:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
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
            marketingTitle,
            description,
            tags,
            features,
            badgeText,
            productUrl,
            ctaText,
            screenshotUrl,
            isFeatured,
            sortOrder,
            isActive,
        } = body;

        // Required fields check
        if (
            typeof marketingTitle !== 'string' || marketingTitle.trim() === '' ||
            typeof description !== 'string' || description.trim() === '' ||
            !isValidJsonParam(tags) ||
            !isValidJsonParam(features)
        ) {
            return NextResponse.json({ success: false, error: 'Missing or invalid required fields (marketingTitle, description, tags, features)' }, { status: 400 });
        }

        // Optional URL checks
        if (!isValidUrlPath(productUrl) || !isValidUrlPath(screenshotUrl)) {
            return NextResponse.json({ success: false, error: 'Invalid URL format provided' }, { status: 400 });
        }

        // Booleans & Integers
        if (isFeatured !== undefined && typeof isFeatured !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isFeatured must be a boolean' }, { status: 400 });
        }
        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isActive must be a boolean' }, { status: 400 });
        }
        if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
            return NextResponse.json({ success: false, error: 'sortOrder must be an integer' }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                marketingTitle: marketingTitle.trim(),
                description: description.trim(),
                tags,
                features,
                badgeText: badgeText ? String(badgeText).trim() : null,
                productUrl: productUrl ? String(productUrl).trim() : null,
                ctaText: ctaText ? String(ctaText).trim() : null,
                screenshotUrl: screenshotUrl ? String(screenshotUrl).trim() : null,
                isFeatured: isFeatured ?? false,
                sortOrder: sortOrder ?? 0,
                isActive: isActive ?? true,
            },
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'PRODUCT_CREATED',
            entity: 'Product',
            entityId: newProduct.id,
            description: `Product created: ${newProduct.marketingTitle}`,
            ipAddress,
            userAgent,
        });

        return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    } catch (error) {
        console.error('Error creating Product:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
