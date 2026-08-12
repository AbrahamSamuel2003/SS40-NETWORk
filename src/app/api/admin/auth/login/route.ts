import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createAdminSession } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json(
                { success: false, error: 'Identifier and password are required' },
                { status: 400 }
            );
        }

        // Attempt to find by email or username
        const adminUser = await prisma.adminUser.findFirst({
            where: {
                OR: [{ email: identifier }, { username: identifier }],
            },
        });

        if (!adminUser || !adminUser.isActive) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials or inactive account' },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, adminUser.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials or inactive account' },
                { status: 401 }
            );
        }

        // Authenticated correctly
        await createAdminSession(adminUser.id);

        // Update lastLoginAt
        await prisma.adminUser.update({
            where: { id: adminUser.id },
            data: { lastLoginAt: new Date() },
        });

        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
        const userAgent = request.headers.get('user-agent') || null;

        // Log the event
        await logAdminActivity({
            adminId: adminUser.id,
            action: 'LOGIN',
            entity: 'AdminUser',
            entityId: adminUser.id,
            description: `Admin logged in via ${identifier === adminUser.email ? 'email' : 'username'}`,
            ipAddress,
            userAgent,
        });

        return NextResponse.json({
            success: true,
            admin: {
                id: adminUser.id,
                username: adminUser.username,
                email: adminUser.email,
                fullName: adminUser.fullName,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
