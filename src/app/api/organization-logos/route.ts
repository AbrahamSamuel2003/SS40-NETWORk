import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const VALID_PLACEMENTS = ['CLIENT', 'BRAND', 'UNIVERSITY', 'PARTNER'];

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const placementType = searchParams.get('placementType');
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const pageScope = searchParams.get('pageScope');

        const where: any = {
            isActive: true
        };

        if (pageScope && pageScope.trim() !== '') {
            where.pageScope = pageScope.trim();
        }

        if (placementType !== null) {
            if (VALID_PLACEMENTS.includes(placementType)) {
                where.placementType = placementType;
            } else {
                return NextResponse.json({ success: false, error: 'Invalid placementType' }, { status: 400 });
            }
        }

        if (category && category.trim() !== '') {
            where.category = category.trim();
        }

        if (search && search.trim() !== '') {
            where.OR = [
                { name: { contains: search.trim(), mode: 'insensitive' } },
                { category: { contains: search.trim(), mode: 'insensitive' } },
            ];
        }

        const logos = await prisma.organizationLogo.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ],
            select: {
                id: true,
                name: true,
                logoUrl: true,
                category: true,
                placementType: true,
                sortOrder: true,
                showTextOnCard: true
            }
        });

        return NextResponse.json({ success: true, data: logos }, { status: 200 });
    } catch (error) {
        console.error('Error fetching organization logos:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch organization logos' }, { status: 500 });
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
