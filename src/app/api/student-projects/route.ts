import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const where: any = {
            isActive: true
        };

        if (category && category.trim() !== '') {
            where.category = category.trim();
        }

        if (search && search.trim() !== '') {
            where.OR = [
                { title: { contains: search.trim(), mode: 'insensitive' } },
                { category: { contains: search.trim(), mode: 'insensitive' } },
                { badge: { contains: search.trim(), mode: 'insensitive' } },
                { description: { contains: search.trim(), mode: 'insensitive' } },
            ];
        }

        const projects = await prisma.studentProject.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ],
        });

        return NextResponse.json({ success: true, data: projects }, {
            headers: {
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
            }
        });
    } catch (error) {
        console.error('Error fetching student projects:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch student projects' }, { status: 500 });
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
