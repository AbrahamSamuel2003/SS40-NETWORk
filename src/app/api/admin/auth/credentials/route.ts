import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, verifyPassword, hashPassword, createSession, recordFailedLogin, resetFailedLoginAttempts } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

export async function GET() {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in as an admin.' },
                { status: 401 }
            );
        }

        const adminRecord = await prisma.adminUser.findUnique({
            where: { id: admin.id },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                createdAt: true,
                lastLoginAt: true,
            },
        });

        if (!adminRecord) {
            return NextResponse.json(
                { success: false, error: 'Admin user not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: adminRecord,
        });
    } catch (error: any) {
        console.error('Error fetching admin profile:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to retrieve admin details.' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in as an admin.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            currentPassword,
            newUsername,
            newPassword,
            confirmPassword,
        } = body;

        // 1. Mandatory verification: current password must be provided
        if (!currentPassword || typeof currentPassword !== 'string' || currentPassword.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'Current password is required to authorize changes.' },
                { status: 400 }
            );
        }

        // 2. Fetch full admin record including password hash
        const adminRecord = await prisma.adminUser.findUnique({
            where: { id: admin.id },
        });

        if (!adminRecord) {
            return NextResponse.json(
                { success: false, error: 'Admin account not found.' },
                { status: 404 }
            );
        }

        // 3. Verify current password
        const isPasswordValid = await verifyPassword(currentPassword, adminRecord.passwordHash);
        if (!isPasswordValid) {
            await recordFailedLogin(adminRecord.id);
            return NextResponse.json(
                { success: false, error: 'The current password you entered is incorrect.' },
                { status: 400 }
            );
        }

        // Reset failed login counter on valid password verification
        await resetFailedLoginAttempts(adminRecord.id);

        const updateData: {
            username?: string;
            passwordHash?: string;
        } = {};

        const changes: string[] = [];

        // 4. Validate and prepare username change if provided
        if (newUsername !== undefined && newUsername !== null) {
            const cleanUsername = String(newUsername).trim();
            
            if (cleanUsername.length === 0) {
                return NextResponse.json(
                    { success: false, error: 'Username cannot be empty.' },
                    { status: 400 }
                );
            }

            if (cleanUsername !== adminRecord.username) {
                // Check uniqueness
                const existing = await prisma.adminUser.findFirst({
                    where: {
                        username: cleanUsername,
                        NOT: { id: adminRecord.id },
                    },
                });

                if (existing) {
                    return NextResponse.json(
                        { success: false, error: 'This username is already taken by another account.' },
                        { status: 400 }
                    );
                }

                updateData.username = cleanUsername;
                changes.push(`username changed from '${adminRecord.username}' to '${cleanUsername}'`);
            }
        }

        // 5. Validate and prepare password change if provided
        if (newPassword && typeof newPassword === 'string' && newPassword.trim() !== '') {
            if (newPassword.length < 8) {
                return NextResponse.json(
                    { success: false, error: 'New password must be at least 8 characters long.' },
                    { status: 400 }
                );
            }

            if (newPassword !== confirmPassword) {
                return NextResponse.json(
                    { success: false, error: 'New password and confirmation password do not match.' },
                    { status: 400 }
                );
            }

            const hashed = await hashPassword(newPassword);
            updateData.passwordHash = hashed;
            changes.push('password updated');
        }

        // 6. If no actual changes requested
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, error: 'No changes were made. Please provide a new username or new password.' },
                { status: 400 }
            );
        }

        // 7. Update in database
        const updatedAdmin = await prisma.adminUser.update({
            where: { id: admin.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
            },
        });

        // 8. Log Admin Audit Activity
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        await logAdminActivity({
            adminId: admin.id,
            action: 'UPDATE_CREDENTIALS',
            entity: 'AdminUser',
            entityId: admin.id,
            description: `Admin updated credentials: ${changes.join(', ')}`,
            ipAddress: ip,
            userAgent: userAgent,
        });

        // 9. Re-issue fresh session token to ensure session persistence
        await createSession(admin.id, 'AdminUser', 'ADMIN');

        return NextResponse.json({
            success: true,
            message: 'Admin credentials updated successfully.',
            data: updatedAdmin,
        });
    } catch (error: any) {
        console.error('Error updating admin credentials:', error);
        return NextResponse.json(
            { success: false, error: error?.message || 'Failed to update credentials. Please try again.' },
            { status: 500 }
        );
    }
}
