import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        if (!id || !isValidUUID(id)) {
            return NextResponse.json({ success: false, error: 'Invalid Visitor ID format' }, { status: 400 });
        }

        const visitor = await prisma.visitor.findUnique({
            where: { id }
        });

        if (!visitor) {
            return NextResponse.json({ success: false, error: 'Visitor not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: visitor }, { status: 200 });
    } catch (error) {
        console.error('Error fetching Visitor:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Visitor ID format' }, { status: 400 });
        }

        const existing = await prisma.visitor.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Visitor not found' }, { status: 404 });
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
        }

        const updateData: any = {};

        if (body.sessionId !== undefined) {
            if (typeof body.sessionId !== 'string' || body.sessionId.trim() === '') {
                return NextResponse.json({ success: false, error: 'sessionId must be a non-empty string' }, { status: 400 });
            }
            updateData.sessionId = body.sessionId.trim();
        }

        const stringFields = [
            'ipAddress', 'userAgent', 'country', 'city', 'deviceType',
            'browser', 'operatingSystem', 'landingPage', 'referrerUrl'
        ];

        for (const field of stringFields) {
            if (body[field] !== undefined) {
                if (body[field] !== null && typeof body[field] !== 'string') {
                    return NextResponse.json({ success: false, error: `${field} must be a string if provided` }, { status: 400 });
                }
                updateData[field] = (body[field] && body[field].trim() !== '') ? body[field].trim() : null;
            }
        }

        if (body.pageViews !== undefined) {
            if (!Number.isInteger(body.pageViews)) {
                return NextResponse.json({ success: false, error: 'pageViews must be an integer' }, { status: 400 });
            }
            updateData.pageViews = body.pageViews;
        }

        if (body.isBot !== undefined) {
            if (typeof body.isBot !== 'boolean') {
                return NextResponse.json({ success: false, error: 'isBot must be a strict boolean' }, { status: 400 });
            }
            updateData.isBot = body.isBot;
        }

        const parseDate = (d: any) => {
            if (!d) return undefined;
            const dateObj = new Date(d);
            if (isNaN(dateObj.getTime())) return null;
            return dateObj;
        };

        if (body.firstVisitedAt !== undefined) {
            const pd = parseDate(body.firstVisitedAt);
            if (pd === null) return NextResponse.json({ success: false, error: 'Invalid firstVisitedAt date' }, { status: 400 });
            if (pd !== undefined) updateData.firstVisitedAt = pd;
        }

        if (body.lastVisitedAt !== undefined) {
            const pd = parseDate(body.lastVisitedAt);
            if (pd === null) return NextResponse.json({ success: false, error: 'Invalid lastVisitedAt date' }, { status: 400 });
            if (pd !== undefined) updateData.lastVisitedAt = pd;
        }

        const updatedVisitor = await prisma.visitor.update({
            where: { id },
            data: updateData
        });

        let clientIp = null;
        let clientAgent = null;
        try {
            clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            clientAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'VISITOR_UPDATED',
            entity: 'Visitor',
            entityId: id,
            description: `Visitor updated for sessionId: ${updatedVisitor.sessionId}`,
            ipAddress: clientIp,
            userAgent: clientAgent
        });

        return NextResponse.json({ success: true, data: updatedVisitor }, { status: 200 });
    } catch (error) {
        console.error('Error updating Visitor:', error);
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
            return NextResponse.json({ success: false, error: 'Invalid Visitor ID format' }, { status: 400 });
        }

        const existing = await prisma.visitor.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ success: false, error: 'Visitor not found' }, { status: 404 });
        }

        await prisma.visitor.delete({
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
            action: 'VISITOR_DELETED',
            entity: 'Visitor',
            entityId: id,
            description: `Visitor deleted for sessionId: ${existing.sessionId}`,
            ipAddress: clientIp,
            userAgent: clientAgent
        });

        return NextResponse.json({ success: true, message: 'Visitor deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting Visitor:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
