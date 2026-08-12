import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

// Helpers
const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

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

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid Product ID format' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: product }, { status: 200 });
    } catch (error) {
        console.error('Error fetching Product:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Product ID format' }, { status: 400 });
        }

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        const body = await request.json();
        const updateData: any = {};

        // Validate and map fields only if they exist in the payload
        if (body.marketingTitle !== undefined) {
            if (typeof body.marketingTitle !== 'string' || body.marketingTitle.trim() === '') {
                return NextResponse.json({ success: false, error: 'marketingTitle cannot be empty' }, { status: 400 });
            }
            updateData.marketingTitle = body.marketingTitle.trim();
        }

        if (body.description !== undefined) {
            if (typeof body.description !== 'string' || body.description.trim() === '') {
                return NextResponse.json({ success: false, error: 'description cannot be empty' }, { status: 400 });
            }
            updateData.description = body.description.trim();
        }

        if (body.tags !== undefined) {
            if (!isValidJsonParam(body.tags)) return NextResponse.json({ success: false, error: 'tags must be valid JSON' }, { status: 400 });
            updateData.tags = body.tags;
        }

        if (body.features !== undefined) {
            if (!isValidJsonParam(body.features)) return NextResponse.json({ success: false, error: 'features must be valid JSON' }, { status: 400 });
            updateData.features = body.features;
        }

        if (body.badgeText !== undefined) {
            updateData.badgeText = body.badgeText ? String(body.badgeText).trim() : null;
        }

        if (body.productUrl !== undefined) {
            if (!isValidUrlPath(body.productUrl)) return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 });
            updateData.productUrl = body.productUrl ? String(body.productUrl).trim() : null;
        }

        if (body.ctaText !== undefined) {
            updateData.ctaText = body.ctaText ? String(body.ctaText).trim() : null;
        }

        if (body.screenshotUrl !== undefined) {
            if (!isValidUrlPath(body.screenshotUrl)) return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 });
            updateData.screenshotUrl = body.screenshotUrl ? String(body.screenshotUrl).trim() : null;
        }

        if (body.isFeatured !== undefined) {
            if (typeof body.isFeatured !== 'boolean') return NextResponse.json({ success: false, error: 'isFeatured must be boolean' }, { status: 400 });
            updateData.isFeatured = body.isFeatured;
        }

        if (body.isActive !== undefined) {
            if (typeof body.isActive !== 'boolean') return NextResponse.json({ success: false, error: 'isActive must be boolean' }, { status: 400 });
            updateData.isActive = body.isActive;
        }

        if (body.sortOrder !== undefined) {
            if (!Number.isInteger(body.sortOrder)) return NextResponse.json({ success: false, error: 'sortOrder must be an integer' }, { status: 400 });
            updateData.sortOrder = body.sortOrder;
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'PRODUCT_UPDATED',
            entity: 'Product',
            entityId: updatedProduct.id,
            description: `Product updated: ${updatedProduct.marketingTitle}`,
            ipAddress,
            userAgent,
        });

        return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });

    } catch (error) {
        console.error('Error updating Product:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Product ID format' }, { status: 400 });
        }

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id },
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'PRODUCT_DELETED',
            entity: 'Product',
            entityId: id,
            description: `Product deleted: ${existing.marketingTitle}`,
            ipAddress,
            userAgent,
        });

        return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Product:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
