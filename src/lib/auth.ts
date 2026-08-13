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
    cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });
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
