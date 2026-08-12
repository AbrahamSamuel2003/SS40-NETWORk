import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const industry = searchParams.get('industry');
        const search = searchParams.get('search');
        const pageScope = searchParams.get('pageScope');

        const where: any = {
            isActive: true
        };

        if (pageScope && pageScope.trim() !== '') {
            where.pageScope = pageScope.trim();
        }

        if (industry && industry.trim() !== '') {
            where.industry = industry.trim();
        }

        if (search && search.trim() !== '') {
            where.OR = [
                { clientName: { contains: search.trim(), mode: 'insensitive' } },
                { companyName: { contains: search.trim(), mode: 'insensitive' } },
                { industry: { contains: search.trim(), mode: 'insensitive' } },
                { testimonial: { contains: search.trim(), mode: 'insensitive' } },
            ];
        }

        const happimonials = await prisma.happimonial.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ],
            select: {
                id: true,
                clientName: true,
                companyName: true,
                industry: true,
                testimonial: true,
                videoUrl: true,
                thumbnailUrl: true,
                sortOrder: true
            }
        });

        return NextResponse.json({ success: true, data: happimonials }, { status: 200 });
    } catch (error) {
        console.error('Error fetching happimonials:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch happimonials' }, { status: 500 });
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
