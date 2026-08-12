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

/** Validates a YouTube URL and returns the 11-char video ID, or null if invalid. */
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
                const v = parsed.pathname.split('/shorts/')[1]?.split('/')[0];
                return v && /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null;
            }
        }
        if (host === 'youtu.be') {
            const v = parsed.pathname.slice(1).split('/')[0];
            return v && /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null;
        }
    } catch {
        return null;
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
        const industryParam = searchParams.get('industry');
        const searchParam = searchParams.get('search');
        const pageScope = searchParams.get('pageScope');

        let isActiveFilter: boolean | undefined = true;
        if (isActiveParam === 'false') {
            isActiveFilter = false;
        } else if (isActiveParam === 'all') {
            isActiveFilter = undefined;
        } else if (isActiveParam === 'true') {
            isActiveFilter = true;
        }

        const where: any = {};
        if (isActiveFilter !== undefined) where.isActive = isActiveFilter;
        if (industryParam && industryParam.trim() !== '') where.industry = industryParam.trim();
        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { clientName: { contains: searchParam, mode: 'insensitive' } },
                { companyName: { contains: searchParam, mode: 'insensitive' } },
                { industry: { contains: searchParam, mode: 'insensitive' } },
                { testimonial: { contains: searchParam, mode: 'insensitive' } },
            ];
        }
        if (pageScope && pageScope.trim() !== '') where.pageScope = pageScope.trim();

        const happimonials = await prisma.happimonial.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
        });

        return NextResponse.json({ success: true, data: happimonials }, { status: 200 });
    } catch (error) {
        console.error('Error fetching Happimonials:', error);
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
        const { clientName, companyName, industry, testimonial, videoUrl, thumbnailUrl, youtubeUrl, sortOrder, isActive, pageScope } = body;

        // Required fields
        if (
            typeof clientName !== 'string' || clientName.trim() === '' ||
            typeof companyName !== 'string' || companyName.trim() === '' ||
            typeof industry !== 'string' || industry.trim() === '' ||
            typeof testimonial !== 'string' || testimonial.trim() === ''
        ) {
            return NextResponse.json({ success: false, error: 'Missing or invalid required strings (clientName, companyName, industry, testimonial)' }, { status: 400 });
        }

        if (videoUrl !== undefined && !isValidAbsoluteUrl(videoUrl)) {
            return NextResponse.json({ success: false, error: 'videoUrl must be a valid absolute HTTP/HTTPS URL' }, { status: 400 });
        }
        if (thumbnailUrl !== undefined && !isValidUrlPath(thumbnailUrl)) {
            return NextResponse.json({ success: false, error: 'thumbnailUrl must be a valid absolute or relative URL' }, { status: 400 });
        }
        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isActive must be a strict boolean' }, { status: 400 });
        }
        if (sortOrder !== undefined && !Number.isInteger(sortOrder)) {
            return NextResponse.json({ success: false, error: 'sortOrder must be an integer' }, { status: 400 });
        }

        // YouTube URL validation
        let resolvedYoutubeUrl: string | null = null;
        if (youtubeUrl && String(youtubeUrl).trim() !== '') {
            const videoId = extractYouTubeVideoId(String(youtubeUrl).trim());
            if (!videoId) {
                return NextResponse.json({ success: false, error: 'Please enter a valid YouTube video URL.' }, { status: 400 });
            }
            resolvedYoutubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }

        // One-video-HOME rule (HOME scope only)
        const resolvedScope = pageScope ? String(pageScope).trim() : 'GLOBAL';
        if (resolvedYoutubeUrl && resolvedScope === 'HOME') {
            const existing = await prisma.happimonial.findFirst({
                where: { pageScope: 'HOME', youtubeUrl: { not: null } }
            });
            if (existing) {
                return NextResponse.json({
                    success: false,
                    error: 'A YouTube video is already assigned to another Home success story. Only one Home success story can contain a video.'
                }, { status: 409 });
            }
        }

        const newHappimonial = await prisma.happimonial.create({
            data: {
                clientName: clientName.trim(),
                companyName: companyName.trim(),
                industry: industry.trim(),
                testimonial: testimonial.trim(),
                videoUrl: (videoUrl && String(videoUrl).trim() !== '') ? String(videoUrl).trim() : null,
                thumbnailUrl: (thumbnailUrl && String(thumbnailUrl).trim() !== '') ? String(thumbnailUrl).trim() : null,
                youtubeUrl: resolvedYoutubeUrl,
                pageScope: resolvedScope,
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
            action: 'HAPPIMONIAL_CREATED',
            entity: 'Happimonial',
            entityId: newHappimonial.id,
            description: `Happimonial created for: ${newHappimonial.clientName} (${newHappimonial.companyName})`,
            ipAddress,
            userAgent
        });

        return NextResponse.json({ success: true, data: newHappimonial }, { status: 201 });
    } catch (error) {
        console.error('Error creating Happimonial:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
