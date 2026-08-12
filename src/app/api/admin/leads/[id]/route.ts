import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'CONVERTED', 'SPAM'];

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
            return NextResponse.json({ success: false, error: 'Invalid Lead ID format' }, { status: 400 });
        }

        const lead = await prisma.lead.findUnique({
            where: { id }
        });

        if (!lead) {
            return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: lead }, { status: 200 });
    } catch (error) {
        console.error('Error fetching Lead:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Lead ID format' }, { status: 400 });
        }

        const existing = await prisma.lead.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
        }

        const body = await request.json();
        const updateData: any = {};
        let loggedActions: string[] = [];

        if (body.fullName !== undefined) {
            if (typeof body.fullName !== 'string' || body.fullName.trim() === '') {
                return NextResponse.json({ success: false, error: 'fullName must be a non-empty string' }, { status: 400 });
            }
            updateData.fullName = body.fullName.trim();
        }

        if (body.email !== undefined) {
            if (typeof body.email !== 'string' || body.email.trim() === '') {
                return NextResponse.json({ success: false, error: 'email must be a non-empty string' }, { status: 400 });
            }
            const normalizedEmail = body.email.trim().toLowerCase();
            if (!isValidEmail(normalizedEmail)) {
                return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
            }
            updateData.email = normalizedEmail;
        }

        if (body.phone !== undefined) {
            if (typeof body.phone !== 'string' || body.phone.trim() === '') {
                return NextResponse.json({ success: false, error: 'phone must be a non-empty string' }, { status: 400 });
            }
            updateData.phone = body.phone.trim();
        }

        if (body.company !== undefined) {
            if (body.company !== null && typeof body.company !== 'string') {
                return NextResponse.json({ success: false, error: 'company must be a string' }, { status: 400 });
            }
            updateData.company = (body.company && body.company.trim() !== '') ? body.company.trim() : null;
        }

        if (body.serviceInterest !== undefined) {
            if (typeof body.serviceInterest !== 'string' || body.serviceInterest.trim() === '') {
                return NextResponse.json({ success: false, error: 'serviceInterest must be a non-empty string' }, { status: 400 });
            }
            updateData.serviceInterest = body.serviceInterest.trim();
        }

        if (body.message !== undefined) {
            if (typeof body.message !== 'string' || body.message.trim() === '') {
                return NextResponse.json({ success: false, error: 'message must be a non-empty string' }, { status: 400 });
            }
            updateData.message = body.message.trim();
        }

        if (body.status !== undefined) {
            if (!VALID_STATUSES.includes(body.status)) {
                return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
            }
            updateData.status = body.status;
            if (body.status !== existing.status) loggedActions.push('LEAD_STATUS_CHANGED');
        }

        if (body.internalNotes !== undefined) {
            if (body.internalNotes !== null && typeof body.internalNotes !== 'string') {
                return NextResponse.json({ success: false, error: 'internalNotes must be a string if provided' }, { status: 400 });
            }
            updateData.internalNotes = (body.internalNotes && typeof body.internalNotes === 'string' && body.internalNotes.trim() !== '') ? body.internalNotes.trim() : null;
        }

        if (body.isArchived !== undefined) {
            if (typeof body.isArchived !== 'boolean') {
                return NextResponse.json({ success: false, error: 'isArchived must be a strict boolean' }, { status: 400 });
            }
            updateData.isArchived = body.isArchived;
            if (body.isArchived !== existing.isArchived) {
                loggedActions.push(body.isArchived ? 'LEAD_ARCHIVED' : 'LEAD_UNARCHIVED');
            }
        }

        // Default action fallback
        if (loggedActions.length === 0 && Object.keys(updateData).length > 0) {
            loggedActions.push('LEAD_UPDATED');
        } else if (Object.keys(updateData).length > 0 && !loggedActions.includes('LEAD_STATUS_CHANGED') && !loggedActions.includes('LEAD_ARCHIVED') && !loggedActions.includes('LEAD_UNARCHIVED')) {
            loggedActions.push('LEAD_UPDATED');
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: updateData
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch { }

        // Log the primary determined action
        const primaryAction = loggedActions.length > 0 ? loggedActions[0] : 'LEAD_UPDATED';

        await logAdminActivity({
            adminId: admin.id,
            action: primaryAction,
            entity: 'Lead',
            entityId: id,
            description: `Lead updated for: ${updatedLead.email}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: updatedLead }, { status: 200 });
    } catch (error) {
        console.error('Error updating Lead:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Lead ID format' }, { status: 400 });
        }

        const existing = await prisma.lead.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
        }

        await prisma.lead.delete({
            where: { id }
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'LEAD_DELETED',
            entity: 'Lead',
            entityId: id,
            description: `Lead deleted for: ${existing.email}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, message: 'Lead deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Lead:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
