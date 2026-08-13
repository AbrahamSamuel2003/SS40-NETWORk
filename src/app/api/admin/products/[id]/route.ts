import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

export async function PUT(request: Request, { params }: any) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        let updateData: any = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.marketingTitle !== undefined) updateData.marketingTitle = body.marketingTitle;
        if (body.badgeText !== undefined) updateData.badgeText = body.badgeText;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.productUrl !== undefined) updateData.productUrl = body.productUrl;
        if (body.ctaText !== undefined) updateData.ctaText = body.ctaText;
        if (body.tags !== undefined) updateData.tags = body.tags;
        if (body.features !== undefined) updateData.features = body.features;
        if (body.isFeatured !== undefined) updateData.isFeatured = !!body.isFeatured;
        if (body.screenshotUrl !== undefined) updateData.screenshotUrl = body.screenshotUrl;
        if (body.sortOrder !== undefined) updateData.sortOrder = isNaN(Number(body.sortOrder)) ? 0 : Number(body.sortOrder);
        if (body.isActive !== undefined) updateData.isActive = !!body.isActive;

        const updatedRecord = await prisma.product.update({
            where: { id: params.id },
            data: updateData
        });

        await logAdminActivity({
            adminId: admin.id,
            action: 'UPDATE',
            entity: 'Product',
            entityId: params.id,
            description: `Updated product: ${updatedRecord.name}`
        });

        return NextResponse.json({ success: true, data: updatedRecord });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: any) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const record = await prisma.product.findUnique({ where: { id: params.id } });
        if (!record) return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });

        await prisma.product.delete({
            where: { id: params.id }
        });

        await logAdminActivity({
            adminId: admin.id,
            action: 'DELETE',
            entity: 'Product',
            entityId: params.id,
            description: `Deleted product: ${record.name}`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
    }
}
