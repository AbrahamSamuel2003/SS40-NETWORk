import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const industry = searchParams.get('industry');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const where: any = {
            isActive: true
        };

        if (industry && industry.trim() !== '') {
            where.industry = industry.trim();
        }

        if (status && status.trim() !== '') {
            where.status = status.trim();
        }

        if (search && search.trim() !== '') {
            where.OR = [
                { title: { contains: search.trim(), mode: 'insensitive' } },
                { industry: { contains: search.trim(), mode: 'insensitive' } },
                { description: { contains: search.trim(), mode: 'insensitive' } },
                { status: { contains: search.trim(), mode: 'insensitive' } },
            ];
        }

        const projects = await prisma.clientProject.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ],
            select: {
                id: true,
                title: true,
                industry: true,
                description: true,
                status: true,
                isConfidential: true,
                tags: true,
                imageUrl: true,
                projectUrl: true,
                caseStudy: true,
                sortOrder: true
            }
        });

        return NextResponse.json({ success: true, data: projects }, { status: 200 });
    } catch (error) {
        console.error('Error fetching client projects:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch client projects' }, { status: 500 });
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
