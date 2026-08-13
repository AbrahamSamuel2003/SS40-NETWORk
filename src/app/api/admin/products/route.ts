import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

export async function GET() {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const products = await prisma.product.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
        });
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching admin products:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        // Basic validation
        if (!body.name || !body.marketingTitle) {
            return NextResponse.json({ success: false, error: 'Name and Marketing Title are required' }, { status: 400 });
        }

        const newRecord = await prisma.product.create({
            data: {
                name: body.name,
                marketingTitle: body.marketingTitle,
                badgeText: body.badgeText || null,
                description: body.description || '',
                productUrl: body.productUrl || null,
                ctaText: body.ctaText || null,
                tags: body.tags || [],
                features: body.features || [],
                isFeatured: body.isFeatured || false,
                screenshotUrl: body.screenshotUrl || null,
                sortOrder: isNaN(Number(body.sortOrder)) ? 0 : Number(body.sortOrder),
                isActive: body.isActive !== undefined ? !!body.isActive : true
            }
        });

        await logAdminActivity({
            adminId: admin.id,
            action: 'CREATE',
            entity: 'Product',
            entityId: newRecord.id,
            description: `Created product: ${newRecord.name}`
        });

        return NextResponse.json({ success: true, data: newRecord });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
    }
}
