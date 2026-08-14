import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const VALID_PLACEMENTS = ['CLIENT', 'BRAND', 'UNIVERSITY', 'PARTNER'];

const isValidUrlOrPath = (url: string | null) => {
    if (!url) return true;
    if (url.startsWith('/')) return true;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const validateId = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!validateId(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        const logo = await prisma.organizationLogo.findUnique({
            where: { id }
        });

        if (!logo) {
            return NextResponse.json(
                { success: false, error: 'Not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: logo }, { status: 200 });
    } catch (error) {
        console.error('Error fetching OrganizationLogo:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!validateId(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        const existing = await prisma.organizationLogo.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Not found' },
                { status: 404 }
            );
        }

        const body = await request.json();
        let { name, category, placementType, logoUrl, sortOrder, isActive, pageScope, showTextOnCard } = body;

        const updateData: any = {};

        if (name !== undefined) {
            name = name?.trim();
            if (!name || typeof name !== 'string') {
                return NextResponse.json(
                    { success: false, error: 'name must not be blank' },
                    { status: 400 }
                );
            }
            updateData.name = name;
        }

        if (category !== undefined) {
            category = category?.trim();
            if (!category || typeof category !== 'string') {
                return NextResponse.json(
                    { success: false, error: 'category must not be blank' },
                    { status: 400 }
                );
            }
            updateData.category = category;
        }

        if (placementType !== undefined) {
            if (!VALID_PLACEMENTS.includes(placementType)) {
                return NextResponse.json(
                    { success: false, error: 'Invalid placementType' },
                    { status: 400 }
                );
            }
            updateData.placementType = placementType;
        }

        if (logoUrl !== undefined) {
            logoUrl = logoUrl === null ? null : logoUrl.trim();
            if (logoUrl && !isValidUrlOrPath(logoUrl)) {
                return NextResponse.json(
                    { success: false, error: 'Invalid logoUrl format' },
                    { status: 400 }
                );
            }
            updateData.logoUrl = logoUrl;
        }

        if (sortOrder !== undefined) {
            if (typeof sortOrder !== 'number' || !Number.isInteger(sortOrder)) {
                return NextResponse.json(
                    { success: false, error: 'sortOrder must be an integer' },
                    { status: 400 }
                );
            }
            updateData.sortOrder = sortOrder;
        }

        if (isActive !== undefined) {
            if (typeof isActive !== 'boolean') {
                return NextResponse.json(
                    { success: false, error: 'isActive must be a boolean' },
                    { status: 400 }
                );
            }
            updateData.isActive = isActive;
        }

        if (pageScope !== undefined) {
            updateData.pageScope = String(pageScope).trim();
        }

        if (showTextOnCard !== undefined) {
            if (typeof showTextOnCard !== 'boolean') {
                return NextResponse.json(
                    { success: false, error: 'showTextOnCard must be a boolean' },
                    { status: 400 }
                );
            }
            updateData.showTextOnCard = showTextOnCard;
        }

        const updated = await prisma.organizationLogo.update({
            where: { id },
            data: updateData
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch {
            // fallback
        }

        await logAdminActivity({
            adminId: admin.id,
            action: 'ORGANIZATION_LOGO_UPDATED',
            entity: 'OrganizationLogo',
            entityId: id,
            description: `Organization logo updated: ${updated.name}`,
            ipAddress,
            userAgent,
        });

        return NextResponse.json({ success: true, data: updated }, { status: 200 });
    } catch (error) {
        console.error('Error updating OrganizationLogo:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!validateId(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid ID format' },
                { status: 400 }
            );
        }

        const existing = await prisma.organizationLogo.findUnique({
            where: { id }
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, error: 'Not found' },
                { status: 404 }
            );
        }

        await prisma.organizationLogo.delete({
            where: { id }
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch {
            // fallback
        }

        await logAdminActivity({
            adminId: admin.id,
            action: 'ORGANIZATION_LOGO_DELETED',
            entity: 'OrganizationLogo',
            entityId: id,
            description: `Organization logo deleted: ${existing.name}`,
            ipAddress,
            userAgent,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error deleting OrganizationLogo:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
