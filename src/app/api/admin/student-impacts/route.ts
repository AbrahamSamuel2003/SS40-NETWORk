import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

const isValidAbsoluteUrl = (u: any) => {
    if (u === null || u === undefined || u === '') return true;
    if (typeof u !== 'string') return false;
    try {
        const parsed = new URL(u);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

export function extractYouTubeVideoId(url: string): string | null {
    if (!url || url.trim() === '') return null;
    try {
        const parsed = new URL(url.trim());
        const host = parsed.hostname.replace('www.', '');
        if (host === 'youtube.com') {
            if (parsed.pathname === '/watch') {
                const v = parsed.searchParams.get('v');
                return v && /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null;
            }
            if (parsed.pathname.startsWith('/shorts/')) {
                const parts = parsed.pathname.split('/');
                const id = parts[2];
                return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
            }
            if (parsed.pathname.startsWith('/embed/')) {
                const parts = parsed.pathname.split('/');
                const id = parts[2];
                return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
            }
        } else if (host === 'youtu.be') {
            const id = parsed.pathname.slice(1).split('/')[0];
            return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
        }
    } catch {
        return null; // invalid URL wrapper
    }
    return null;
}

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const isActiveParam = searchParams.get('isActive');
        const isFeaturedParam = searchParams.get('isFeatured');
        const academicRouteParam = searchParams.get('academicRoute');
        const searchParam = searchParams.get('search');

        // Filter defaults for isActive
        let isActiveFilter: boolean | undefined = true;
        if (isActiveParam === 'false') {
            isActiveFilter = false;
        } else if (isActiveParam === 'all') {
            isActiveFilter = undefined;
        } else if (isActiveParam === 'true') {
            isActiveFilter = true;
        }

        const where: any = {};
        if (isActiveFilter !== undefined) {
            where.isActive = isActiveFilter;
        }

        if (isFeaturedParam === 'true') {
            where.isFeatured = true;
        } else if (isFeaturedParam === 'false') {
            where.isFeatured = false;
        }

        if (academicRouteParam && academicRouteParam.trim() !== '') {
            where.academicRoute = academicRouteParam.trim();
        }

        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { studentName: { contains: searchParam, mode: 'insensitive' } },
                { designation: { contains: searchParam, mode: 'insensitive' } },
                { quote: { contains: searchParam, mode: 'insensitive' } },
                { academicRoute: { contains: searchParam, mode: 'insensitive' } },
            ];
        }

        const studentImpacts = await prisma.studentImpact.findMany({
            where,
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ]
        });

        return NextResponse.json({ success: true, data: studentImpacts }, { status: 200 });
    } catch (error) {
        console.error('Error fetching StudentImpacts:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            studentName,
            designation,
            quote,
            academicRoute,
            videoUrl,
            youtubeUrl,
            isFeatured,
            sortOrder,
            isActive
        } = body;

        // Required fields check
        if (
            typeof studentName !== 'string' || studentName.trim() === '' ||
            typeof designation !== 'string' || designation.trim() === '' ||
            typeof quote !== 'string' || quote.trim() === '' ||
            typeof academicRoute !== 'string' || academicRoute.trim() === ''
        ) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid required strings (studentName, designation, quote, academicRoute)' },
                { status: 400 }
            );
        }

        // Optional field validation
        if (videoUrl !== undefined && !isValidAbsoluteUrl(videoUrl)) {
            return NextResponse.json({ success: false, error: 'videoUrl must be a valid absolute HTTP/HTTPS URL if provided' }, { status: 400 });
        }

        if (isFeatured !== undefined && typeof isFeatured !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isFeatured must be a strict boolean' }, { status: 400 });
        }

        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isActive must be a strict boolean' }, { status: 400 });
        }

        if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
            return NextResponse.json({ success: false, error: 'sortOrder must be an integer' }, { status: 400 });
        }

        let resolvedYoutubeUrl: string | null = null;
        if (youtubeUrl && String(youtubeUrl).trim() !== '') {
            const videoId = extractYouTubeVideoId(String(youtubeUrl).trim());
            if (!videoId) {
                return NextResponse.json({ success: false, error: 'Please enter a valid YouTube video URL.' }, { status: 400 });
            }
            resolvedYoutubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }

        if (resolvedYoutubeUrl) {
            const existing = await prisma.studentImpact.findFirst({
                where: { youtubeUrl: { not: null } }
            });
            if (existing) {
                return NextResponse.json({
                    success: false,
                    error: 'A YouTube video is already assigned to another Student Impact. Only one video is allowed.'
                }, { status: 409 });
            }
        }

        const newStudentImpact = await prisma.studentImpact.create({
            data: {
                studentName: studentName.trim(),
                designation: designation.trim(),
                quote: quote.trim(),
                academicRoute: academicRoute.trim(),
                videoUrl: (videoUrl && String(videoUrl).trim() !== '') ? String(videoUrl).trim() : null,
                youtubeUrl: resolvedYoutubeUrl,
                isFeatured: isFeatured ?? false,
                sortOrder: sortOrder ?? 0,
                isActive: isActive ?? true
            }
        });

        let ipAddress = null;
        let userAgent = null;
        try {
            ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
            userAgent = request.headers.get('user-agent') || null;
        } catch { }

        await logAdminActivity({
            adminId: admin.id,
            action: 'STUDENT_IMPACT_CREATED',
            entity: 'StudentImpact',
            entityId: newStudentImpact.id,
            description: `StudentImpact created for: ${newStudentImpact.studentName}`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: newStudentImpact }, { status: 201 });
    } catch (error) {
        console.error('Error creating StudentImpact:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
