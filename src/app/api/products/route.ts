import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isFeatured = searchParams.get('isFeatured');
        const search = searchParams.get('search');

        const where: any = {
            isActive: true
        };

        if (isFeatured === 'true') {
            where.isFeatured = true;
        } else if (isFeatured === 'false') {
            where.isFeatured = false;
        }

        if (search && search.trim() !== '') {
            where.OR = [
                { marketingTitle: { contains: search.trim(), mode: 'insensitive' } },
                { description: { contains: search.trim(), mode: 'insensitive' } },
                { badgeText: { contains: search.trim(), mode: 'insensitive' } },
            ];
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ],
            select: {
                id: true,
                marketingTitle: true,
                badgeText: true,
                description: true,
                productUrl: true,
                ctaText: true,
                tags: true,
                features: true,
                isFeatured: true,
                screenshotUrl: true,
                sortOrder: true
            }
        });

        return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST() {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
}
