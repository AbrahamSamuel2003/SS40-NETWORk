import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin?.id) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const rawToken = typeof body?.token === 'string' ? body.token.trim() : '';

        if (!rawToken) {
            return NextResponse.json(
                { success: false, error: 'Device token is required' },
                { status: 400 }
            );
        }

        await prisma.adminDeviceToken.deleteMany({
            where: {
                token: rawToken,
                adminUserId: admin.id,
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error unregistering admin device token:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
