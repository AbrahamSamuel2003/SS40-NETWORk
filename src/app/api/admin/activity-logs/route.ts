import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const searchParam = searchParams.get('search');
        const actionParam = searchParams.get('action');
        const entityParam = searchParams.get('entity');
        const entityIdParam = searchParams.get('entityId');
        const adminIdParam = searchParams.get('adminId');
        const limitStr = searchParams.get('limit') || '20';
        const pageStr = searchParams.get('page') || '1';

        const where: any = {};

        if (actionParam && actionParam.trim() !== '') {
            where.action = actionParam.trim();
        }

        if (entityParam && entityParam.trim() !== '') {
            where.entity = entityParam.trim();
        }

        if (entityIdParam && entityIdParam.trim() !== '') {
            where.entityId = entityIdParam.trim();
        }

        if (adminIdParam && adminIdParam.trim() !== '') {
            where.adminUserId = adminIdParam.trim();
        }

        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { action: { contains: searchParam, mode: 'insensitive' } },
                { entity: { contains: searchParam, mode: 'insensitive' } },
                { description: { contains: searchParam, mode: 'insensitive' } },
            ];
        }

        let limit = parseInt(limitStr, 10);
        if (isNaN(limit) || limit <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid limit parameter' }, { status: 400 });
        }
        if (limit > 100) limit = 100;

        let page = parseInt(pageStr, 10);
        if (isNaN(page) || page <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid page parameter' }, { status: 400 });
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.adminActivityLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    adminUser: {
                        select: {
                            email: true,
                            fullName: true
                        }
                    }
                }
            }),
            prisma.adminActivityLog.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching AdminActivityLogs:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST() {
    return NextResponse.json(
        { success: false, error: 'Audit logs are immutable. Method not allowed.' },
        { status: 405 }
    );
}

export async function PUT() {
    return NextResponse.json(
        { success: false, error: 'Audit logs are immutable. Method not allowed.' },
        { status: 405 }
    );
}

export async function PATCH() {
    return NextResponse.json(
        { success: false, error: 'Audit logs are immutable. Method not allowed.' },
        { status: 405 }
    );
}

export async function DELETE() {
    return NextResponse.json(
        { success: false, error: 'Audit logs are immutable. Method not allowed.' },
        { status: 405 }
    );
}
