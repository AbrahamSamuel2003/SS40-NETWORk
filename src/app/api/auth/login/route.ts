import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required.' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 1. Check AdminUser first
        const adminUser = await prisma.adminUser.findFirst({
            where: {
                OR: [
                    { email: normalizedEmail },
                    { username: normalizedEmail }
                ],
                isActive: true
            }
        });

        if (adminUser) {
            const isValid = await verifyPassword(password, adminUser.passwordHash);
            if (isValid) {
                // Update last login
                await prisma.adminUser.update({
                    where: { id: adminUser.id },
                    data: { lastLoginAt: new Date() }
                });

                await createSession(adminUser.id, 'AdminUser', 'ADMIN');

                return NextResponse.json({
                    success: true,
                    role: 'ADMIN',
                    redirectTo: '/admin'
                });
            }
        }

        // 2. Fallback to normal User table
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail } // users only use email
        });

        if (user && user.passwordHash && user.passwordHash !== 'UNSET_PASSWORD') {
            const isValid = await verifyPassword(password, user.passwordHash);
            if (isValid) {
                await createSession(user.id, 'User', user.role);

                const redirectTo = user.role === 'ADMIN' ? '/admin' : '/user';

                return NextResponse.json({
                    success: true,
                    role: user.role,
                    redirectTo
                });
            }
        }

        // 3. Fail gracefully generic
        return NextResponse.json(
            { success: false, error: 'Invalid email or password.' },
            { status: 401 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
