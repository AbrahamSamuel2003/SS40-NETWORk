import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                marketingTitle: true,
                badgeText: true,
                description: true,
                productUrl: true,
                ctaText: true,
                tags: true,
                features: true,
                isFeatured: true,
                screenshotUrl: true,
                sortOrder: true,
            },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
        });

        return NextResponse.json({ success: true, data: products }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}
