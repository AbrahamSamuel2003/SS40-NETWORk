import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession, validateJwtSecret, isAccountLocked, recordFailedLogin, resetFailedLoginAttempts } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limiter';

export async function POST(request: Request) {
    try {
        // Validate JWT secret configuration
        if (!validateJwtSecret()) {
            console.error('JWT secret not properly configured');
        }

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required.' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Apply rate limiting
        const identifier = normalizedEmail;
        const rateLimitResult = rateLimit(identifier, 100, 15 * 60 * 1000); // 100 attempts per 15 minutes
        
        if (!rateLimitResult.success) {
            const resetTime = new Date(rateLimitResult.resetTime);
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Too many login attempts. Please try again later.',
                    resetTime: resetTime.toISOString()
                },
                { status: 429 }
            );
        }

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
            if (isValid) {
                // Reset failed login attempts on successful login
                await resetFailedLoginAttempts(adminUser.id);
                
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
            } else {
                // Record failed login attempt
                await recordFailedLogin(adminUser.id);
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
