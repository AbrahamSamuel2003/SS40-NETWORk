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
        const platform =
            typeof body?.platform === 'string' && body.platform.trim() !== ''
                ? body.platform.trim().toLowerCase()
                : 'android';

        if (!rawToken || rawToken.length < 10) {
            return NextResponse.json(
                { success: false, error: 'Valid device token is required' },
                { status: 400 }
            );
        }

        const saved = await prisma.adminDeviceToken.upsert({
            where: { token: rawToken },
            update: {
                adminUserId: admin.id,
                platform,
            },
            create: {
                adminUserId: admin.id,
                token: rawToken,
                platform,
            },
            select: {
                id: true,
                platform: true,
                updatedAt: true,
            },
        });

        return NextResponse.json({ success: true, data: saved }, { status: 200 });
    } catch (error) {
        console.error('Error registering admin device token:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
