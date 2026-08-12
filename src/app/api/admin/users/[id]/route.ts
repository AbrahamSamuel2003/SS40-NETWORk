import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const VALID_ROLES = ['ADMIN', 'MEMBER'];

const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid User ID format' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        console.error('Error fetching User:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid User ID format' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
        }

        const updateData: any = {};

        if (body.name !== undefined) {
            if (typeof body.name !== 'string' || body.name.trim() === '') {
                return NextResponse.json({ success: false, error: 'name must be a non-empty string' }, { status: 400 });
            }
            updateData.name = body.name.trim();
        }

        if (body.email !== undefined) {
            if (typeof body.email !== 'string' || body.email.trim() === '') {
                return NextResponse.json({ success: false, error: 'email must be a non-empty string' }, { status: 400 });
            }
            const normalizedEmail = body.email.trim().toLowerCase();
            if (!isValidEmail(normalizedEmail)) {
                return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
            }

            // Check unique exclusion
            const duplicateCheck = await prisma.user.findUnique({
                where: { email: normalizedEmail }
            });
            if (duplicateCheck && duplicateCheck.id !== id) {
                return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 409 });
            }

            updateData.email = normalizedEmail;
        }

        if (body.role !== undefined) {
            if (!VALID_ROLES.includes(body.role)) {
                return NextResponse.json({ success: false, error: 'Invalid role specified' }, { status: 400 });
            }
            updateData.role = body.role as any;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        let clientIp = null;
        let clientAgent = null;
        try {
            clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            clientAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'USER_UPDATED',
            entity: 'User',
            entityId: id,
            description: `User updated: ${updatedUser.email}`,
            ipAddress: clientIp,
            userAgent: clientAgent
        });

        if (existing.role !== updatedUser.role) {
            await logAdminActivity({
                adminId: admin.id,
                action: 'USER_ROLE_CHANGED',
                entity: 'User',
                entityId: id,
                description: `User role changed from ${existing.role} to ${updatedUser.role}.`,
                ipAddress: clientIp,
                userAgent: clientAgent
            });
        }

        return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error updating User:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid User ID format' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        await prisma.user.delete({
            where: { id }
        });

        let clientIp = null;
        let clientAgent = null;
        try {
            clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            clientAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'USER_DELETED',
            entity: 'User',
            entityId: id,
            description: `User deleted: ${existing.email}`,
            ipAddress: clientIp,
            userAgent: clientAgent
        });

        return NextResponse.json({ success: true, message: 'User deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting User:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
