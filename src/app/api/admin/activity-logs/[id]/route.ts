import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid Activity Log ID format' }, { status: 400 });
        }

        const activityLog = await prisma.adminActivityLog.findUnique({
            where: { id },
            include: {
                adminUser: {
                    select: {
                        email: true,
                        fullName: true
                    }
                }
            }
        });

        if (!activityLog) {
            return NextResponse.json({ success: false, error: 'Activity log not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: activityLog }, { status: 200 });
    } catch (error) {
        console.error('Error fetching Activity log:', error);
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
