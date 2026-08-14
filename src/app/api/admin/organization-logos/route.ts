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

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const isActiveStr = searchParams.get('isActive');
        const placementType = searchParams.get('placementType');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const pageScope = searchParams.get('pageScope');

        if (placementType && !VALID_PLACEMENTS.includes(placementType)) {
            return NextResponse.json(
                { success: false, error: 'Invalid placementType' },
                { status: 400 }
            );
        }

        const where: any = {};

        if (isActiveStr === 'all') {
            // Do not restrict by active status
        } else if (isActiveStr !== null) {
            where.isActive = isActiveStr === 'true';
        } else {
            // Default to only return active records
            where.isActive = true;
        }

        if (placementType) {
            where.placementType = placementType;
        }

        if (category) {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (pageScope) {
            where.pageScope = pageScope;
        }

        const logos = await prisma.organizationLogo.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ]
        });

        return NextResponse.json({ success: true, data: logos }, { status: 200 });
    } catch (error) {
        console.error('Error fetching OrganizationLogos:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        let { name, category, placementType, logoUrl, sortOrder, isActive, pageScope, showTextOnCard } = body;

        name = name?.trim();
        category = category?.trim();
        logoUrl = logoUrl?.trim();

        if (!name || typeof name !== 'string') {
            return NextResponse.json(
                { success: false, error: 'name is required and must not be blank' },
                { status: 400 }
            );
        }

        if (!category || typeof category !== 'string') {
            return NextResponse.json(
                { success: false, error: 'category is required and must not be blank' },
                { status: 400 }
            );
        }

        if (!placementType || !VALID_PLACEMENTS.includes(placementType)) {
            return NextResponse.json(
                { success: false, error: 'Invalid or missing placementType' },
                { status: 400 }
            );
        }

        if (logoUrl && !isValidUrlOrPath(logoUrl)) {
            return NextResponse.json(
                { success: false, error: 'Invalid logoUrl format' },
                { status: 400 }
            );
        }

        if (sortOrder !== undefined && sortOrder !== null) {
            if (typeof sortOrder !== 'number' || !Number.isInteger(sortOrder)) {
                return NextResponse.json(
                    { success: false, error: 'sortOrder must be an integer' },
                    { status: 400 }
                );
            }
        } else {
            sortOrder = 0;
        }

        if (isActive === undefined || isActive === null) {
            isActive = true;
        } else if (typeof isActive !== 'boolean') {
            return NextResponse.json(
                { success: false, error: 'isActive must be a boolean' },
                { status: 400 }
            );
        }

        if (showTextOnCard === undefined || showTextOnCard === null) {
            showTextOnCard = false;
        } else if (typeof showTextOnCard !== 'boolean') {
            return NextResponse.json(
                { success: false, error: 'showTextOnCard must be a boolean' },
                { status: 400 }
            );
        }

        const logo = await prisma.organizationLogo.create({
            data: {
                name,
                category,
                placementType: placementType as any,
                logoUrl: logoUrl || null,
                pageScope: pageScope || 'GLOBAL',
                sortOrder,
                isActive,
                showTextOnCard
            }
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
            action: 'ORGANIZATION_LOGO_CREATED',
            entity: 'OrganizationLogo',
            entityId: logo.id,
            description: `Organization logo created: ${logo.name}`,
            ipAddress,
            userAgent,
        });

        return NextResponse.json({ success: true, data: logo }, { status: 201 });
    } catch (error) {
        console.error('Error creating OrganizationLogo:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
