import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const VALID_MEDIA_TYPES = ['IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER'];

const isValidUrlPath = (u: any) => {
    if (u === null || u === undefined || u === '') return true;
    if (typeof u !== 'string') return false;
    if (u.startsWith('/')) return true;
    try {
        const parsed = new URL(u);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const searchParam = searchParams.get('search');
        const typeParam = searchParams.get('type');
        const isActiveParam = searchParams.get('isActive');
        const pageScopeParam = searchParams.get('pageScope');
        const limitStr = searchParams.get('limit') || '20';
        const pageStr = searchParams.get('page') || '1';

        const where: any = {};

        if (typeParam) {
            if (VALID_MEDIA_TYPES.includes(typeParam)) {
                where.mediaType = typeParam;
            } else {
                return NextResponse.json({ success: false, error: 'Invalid type filter' }, { status: 400 });
            }
        }

        if (isActiveParam === 'false') {
            where.isActive = false;
        } else if (isActiveParam === 'all') {
            // no isActive filter
        } else if (isActiveParam === 'true') {
            where.isActive = true;
        } else {
            // no default filter requested by prompt, but usually isActive defaults to true,
            // I will leave it to return all if not explicitly specified unless logic dictates true. 
            // Actually, wait, standard is: ?isActive=false returns inactive, isActive=all returns both,
            // default is isActive=true for most collections, but specifically if nothing passed we'll use active=true.
            where.isActive = true;
        }

        if (pageScopeParam && pageScopeParam.trim() !== '') {
            where.pageScope = pageScopeParam.trim();
        }

        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { fileName: { contains: searchParam, mode: 'insensitive' } },
                { fileUrl: { contains: searchParam, mode: 'insensitive' } },
                { mimeType: { contains: searchParam, mode: 'insensitive' } },
                { altText: { contains: searchParam, mode: 'insensitive' } },
                { uploadedBy: { contains: searchParam, mode: 'insensitive' } },
            ];
        }

        let limit = parseInt(limitStr, 10);
        if (isNaN(limit) || limit <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid limit parameter' }, { status: 400 });
        }
        if (limit > 100) limit = 100;

        let page = parseInt(pageStr, 10);
        if (isNaN(page) || page <= 0) {
            return NextResponse.json({ success: false, error: 'Invalid page parameter' }, { status: 400 });
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.media.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.media.count({ where })
        ]);

        return NextResponse.json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching Media:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
        }

        const {
            fileName,
            fileUrl,
            mimeType,
            mediaType,
            fileSize,
            altText,
            uploadedBy,
            isActive,
            pageScope
        } = body;

        // Required fields check
        if (
            typeof fileName !== 'string' || fileName.trim() === '' ||
            typeof mimeType !== 'string' || mimeType.trim() === '' ||
            !VALID_MEDIA_TYPES.includes(mediaType)
        ) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid required fields (fileName, mimeType, mediaType)' },
                { status: 400 }
            );
        }

        if (!isValidUrlPath(fileUrl) || typeof fileUrl !== 'string' || fileUrl.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'fileUrl is required and must be a valid URL or path' },
                { status: 400 }
            );
        }

        // Optional field validation
        if (fileSize !== undefined && fileSize !== null && !Number.isInteger(fileSize)) {
            return NextResponse.json({ success: false, error: 'fileSize must be an integer if provided' }, { status: 400 });
        }

        if (altText !== undefined && altText !== null && typeof altText !== 'string') {
            return NextResponse.json({ success: false, error: 'altText must be a string if provided' }, { status: 400 });
        }

        if (uploadedBy !== undefined && uploadedBy !== null && typeof uploadedBy !== 'string') {
            return NextResponse.json({ success: false, error: 'uploadedBy must be a string if provided' }, { status: 400 });
        }

        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isActive must be a strict boolean' }, { status: 400 });
        }

        const newMedia = await prisma.media.create({
            data: {
                fileName: fileName.trim(),
                fileUrl: fileUrl.trim(),
                mimeType: mimeType.trim(),
                mediaType: mediaType as any,
                fileSize: fileSize ?? null,
                altText: (altText && String(altText).trim() !== '') ? String(altText).trim() : null,
                uploadedBy: (uploadedBy && String(uploadedBy).trim() !== '') ? String(uploadedBy).trim() : null,
                pageScope: pageScope ? String(pageScope).trim() : 'GLOBAL',
                isActive: isActive ?? true
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
            action: 'MEDIA_CREATED',
            entity: 'Media',
            entityId: newMedia.id,
            description: `Media created: ${newMedia.fileName}`,
            ipAddress: clientIp,
            userAgent: clientAgent
        });

        return NextResponse.json({ success: true, data: newMedia }, { status: 201 });
    } catch (error) {
        console.error('Error creating Media:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
