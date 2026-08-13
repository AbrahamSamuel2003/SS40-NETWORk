import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Dynamic route

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
        });

        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}
