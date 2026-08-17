import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'ss40-network-fallback-secret-key-development'
);

export async function hashPassword(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, 10);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
}

export async function createSession(userId: string, accountType: 'AdminUser', role: 'ADMIN') {
    const token = await new SignJWT({ userId, accountType, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET_KEY);

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    const secure = isProduction && process.env.COOKIE_SECURE === 'true';
    
    const cookieOptions: any = {
        httpOnly: true,
        secure: secure,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    };

    if (process.env.COOKIE_DOMAIN) {
        cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    cookieStore.set('admin_session', token, cookieOptions);
}

export async function refreshSessionIfNeeded() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY, {
            currentDate: new Date(), // Use current date for validation
        });

        // Check if token is expiring within 1 hour (3600 seconds)
        const exp = payload.exp ? payload.exp * 1000 : 0;
        const now = Date.now();
        const timeUntilExpiry = exp - now;
        const oneHour = 60 * 60 * 1000;

        if (timeUntilExpiry < oneHour && timeUntilExpiry > 0) {
            // Token is expiring soon, refresh it
            const userId = payload.userId as string || (payload.adminId as string);
            const accountType = payload.accountType as 'AdminUser' || 'AdminUser';
            const role = payload.role as 'ADMIN' || 'ADMIN';
            
            if (userId) {
                await createSession(userId, accountType, role);
                return true;
            }
        }
        return false;
    } catch {
        return false;
    }
}

// Preserve for existing flows if needed, but redirects to the new unified session
export async function createAdminSession(adminId: string) {
    await createSession(adminId, 'AdminUser', 'ADMIN');
}

export async function getCurrentSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        // Handle legacy payload (only had { adminId }) vs new payload
        let userId = payload.userId as string;
        let accountType = payload.accountType as 'AdminUser';
        let role = payload.role as 'ADMIN';

        if (!userId && payload.adminId) {
            // Legacy token seamlessly upgrades in logic
            userId = payload.adminId as string;
            accountType = 'AdminUser';
            role = 'ADMIN';
        }

        return { userId, accountType, role };
    } catch {
        return null;
    }
}

// Validate JWT secret is properly configured
export function validateJwtSecret(): boolean {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.warn('JWT_SECRET not configured, using fallback (not recommended for production)');
        return false;
    }
    if (secret === 'ss40-network-fallback-secret-key-development') {
        console.warn('Using fallback JWT secret, please set JWT_SECRET in production');
        return false;
    }
    if (secret.length < 32) {
        console.warn('JWT_SECRET is too short, should be at least 32 characters');
        return false;
    }
    return true;
}

// Check if account is locked due to too many failed attempts
export async function isAccountLocked(userId: string): Promise<{ locked: boolean; unlockTime?: Date }> {
    const admin = await prisma.adminUser.findUnique({
        where: { id: userId },
        select: { failedLoginAttempts: true, lockUntil: true }
    });
    
    if (!admin) return { locked: false };
    
    // Check if lock has expired
    if (admin.lockUntil && admin.lockUntil > new Date()) {
        return { locked: true, unlockTime: admin.lockUntil };
    }
    
    // Reset failed attempts if lock has expired
    if (admin.lockUntil && admin.lockUntil <= new Date() && admin.failedLoginAttempts > 0) {
        await prisma.adminUser.update({
            where: { id: userId },
            data: { failedLoginAttempts: 0, lockUntil: null }
        });
    }
    
    return { locked: false };
}

// Record failed login attempt
export async function recordFailedLogin(userId: string): Promise<void> {
    const admin = await prisma.adminUser.findUnique({
        where: { id: userId },
        select: { failedLoginAttempts: true }
    });
    
    if (!admin) return;
    
    const newAttempts = (admin.failedLoginAttempts || 0) + 1;
    const maxAttempts = 5; // Lock after 5 failed attempts
    
    if (newAttempts >= maxAttempts) {
        // Lock account for 30 minutes
        const lockUntil = new Date(Date.now() + 30 * 60 * 1000);
        await prisma.adminUser.update({
            where: { id: userId },
            data: { 
                failedLoginAttempts: newAttempts,
                lockUntil: lockUntil
            }
        });
    } else {
        await prisma.adminUser.update({
            where: { id: userId },
            data: { failedLoginAttempts: newAttempts }
        });
    }
}

// Reset failed login attempts on successful login
export async function resetFailedLoginAttempts(userId: string): Promise<void> {
    await prisma.adminUser.update({
        where: { id: userId },
        data: { failedLoginAttempts: 0, lockUntil: null }
    });
}

export async function getCurrentAdmin() {
    const session = await getCurrentSession();
    if (!session || session.role !== 'ADMIN') return null;

    if (session.accountType === 'AdminUser') {
        const admin = await prisma.adminUser.findUnique({
            where: { id: session.userId },
            select: { id: true, username: true, email: true, fullName: true, isActive: true },
        });
        if (!admin || !admin.isActive) return null;
        return admin;
    }

    return null;
}

export async function destroyAdminSession() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
}
