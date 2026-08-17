import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createAdminSession, validateJwtSecret, isAccountLocked, recordFailedLogin, resetFailedLoginAttempts } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';
import { rateLimit } from '@/lib/rate-limiter';

export async function POST(request: Request) {
    try {
        // Validate JWT secret configuration
        if (!validateJwtSecret()) {
            console.error('JWT secret not properly configured');
        }

        const body = await request.json();
        const { identifier, password } = body;

        if (!identifier || !password) {
            return NextResponse.json(
                { success: false, error: 'Identifier and password are required' },
                { status: 400 }
            );
        }

        const normalizedIdentifier = identifier.trim().toLowerCase();

        // Attempt to find by email or username
        const adminUser = await prisma.adminUser.findFirst({
            where: {
                OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
            },
        });

        if (!adminUser || !adminUser.isActive) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials or inactive account' },
                { status: 401 }
            );
        }

        // Check if account is locked
        const lockStatus = await isAccountLocked(adminUser.id);
        if (lockStatus.locked) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Account is temporarily locked due to too many failed login attempts. Please try again later.',
                    unlockTime: lockStatus.unlockTime?.toISOString()
                },
                { status: 423 }
            );
        }

        const isValid = await verifyPassword(password, adminUser.passwordHash);

        if (!isValid) {
            // Record failed login attempt
            await recordFailedLogin(adminUser.id);
            return NextResponse.json(
                { success: false, error: 'Invalid credentials or inactive account' },
                { status: 401 }
            );
        }

        // Authenticated correctly
        // Reset failed login attempts on successful login
        await resetFailedLoginAttempts(adminUser.id);
        
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
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error',
                details: error?.message || String(error),
                stack: error?.stack
            },
            { status: 500 }
        );
    }
}
