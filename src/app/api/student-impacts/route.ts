import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const academicRoute = searchParams.get('academicRoute');
        const isFeatured = searchParams.get('isFeatured');
        const search = searchParams.get('search');

        const where: any = {
            isActive: true
        };

        if (academicRoute && academicRoute.trim() !== '') {
            where.academicRoute = academicRoute.trim();
        }

        if (isFeatured === 'true') {
            where.isFeatured = true;
        } else if (isFeatured === 'false') {
            where.isFeatured = false;
        }

        if (search && search.trim() !== '') {
            where.OR = [
                { studentName: { contains: search.trim(), mode: 'insensitive' } },
                { designation: { contains: search.trim(), mode: 'insensitive' } },
                { quote: { contains: search.trim(), mode: 'insensitive' } },
                { academicRoute: { contains: search.trim(), mode: 'insensitive' } },
            ];
        }

        const impacts = await prisma.studentImpact.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ],
            select: {
                id: true,
                studentName: true,
                designation: true,
                quote: true,
                academicRoute: true,
                videoUrl: true,
                isFeatured: true,
                sortOrder: true
            }
        });

        return NextResponse.json({ success: true, data: impacts }, { status: 200 });
    } catch (error) {
        console.error('Error fetching student impacts:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch student impacts' }, { status: 500 });
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
