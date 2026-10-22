import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const careers = await prisma.career.findMany({
            where: { isActive: true },
            select: {
                id: true,
                title: true,
                department: true,
                location: true,
                employmentType: true,
                experienceLevel: true,
            },
            orderBy: [
                { isFeatured: 'desc' },
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json({ success: true, data: careers });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
