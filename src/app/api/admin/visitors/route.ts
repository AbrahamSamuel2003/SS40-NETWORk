import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { logAdminActivity } from '@/lib/admin-activity';

export async function GET(request: Request) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const searchParam = searchParams.get('search');
        const limitStr = searchParams.get('limit') || '20';
        const pageStr = searchParams.get('page') || '1';

        // Note: The prompt requested `isActive` filtering, but `Visitor` model 
        // does not contain an `isActive` field. We will silently ignore it to 
        // prevent Prisma query crashes, complying with the directive to not invent fields.

        const where: any = {};

        if (searchParam && searchParam.trim() !== '') {
            where.OR = [
                { sessionId: { contains: searchParam, mode: 'insensitive' } },
                { ipAddress: { contains: searchParam, mode: 'insensitive' } },
                { userAgent: { contains: searchParam, mode: 'insensitive' } },
                { country: { contains: searchParam, mode: 'insensitive' } },
                { city: { contains: searchParam, mode: 'insensitive' } },
                { deviceType: { contains: searchParam, mode: 'insensitive' } },
                { browser: { contains: searchParam, mode: 'insensitive' } },
                { operatingSystem: { contains: searchParam, mode: 'insensitive' } },
                { landingPage: { contains: searchParam, mode: 'insensitive' } },
                { referrerUrl: { contains: searchParam, mode: 'insensitive' } },
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
            prisma.visitor.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.visitor.count({ where })
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
        console.error('Error fetching Visitors:', error);
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
            sessionId,
            ipAddress,
            userAgent,
            country,
            city,
            deviceType,
            browser,
            operatingSystem,
            landingPage,
            referrerUrl,
            firstVisitedAt,
            lastVisitedAt,
            pageViews,
            isBot
        } = body;

        // Required fields check
        if (typeof sessionId !== 'string' || sessionId.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'sessionId is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        // Optional field validation safely checks types mapped directly to the Prisma schema
        const checkString = (val: any, fieldName: string) => {
            if (val !== undefined && val !== null && typeof val !== 'string') {
                throw new Error(`${fieldName} must be a string if provided`);
            }
            return (val && String(val).trim() !== '') ? String(val).trim() : null;
        };

        let parsedIpAddress, parsedUserAgent, parsedCountry, parsedCity, parsedDeviceType;
        let parsedBrowser, parsedOperatingSystem, parsedLandingPage, parsedReferrerUrl;

        try {
            parsedIpAddress = checkString(ipAddress, 'ipAddress');
            parsedUserAgent = checkString(userAgent, 'userAgent');
            parsedCountry = checkString(country, 'country');
            parsedCity = checkString(city, 'city');
            parsedDeviceType = checkString(deviceType, 'deviceType');
            parsedBrowser = checkString(browser, 'browser');
            parsedOperatingSystem = checkString(operatingSystem, 'operatingSystem');
            parsedLandingPage = checkString(landingPage, 'landingPage');
            parsedReferrerUrl = checkString(referrerUrl, 'referrerUrl');
        } catch (e: any) {
            return NextResponse.json({ success: false, error: e.message }, { status: 400 });
        }

        if (pageViews !== undefined && !Number.isInteger(pageViews)) {
            return NextResponse.json({ success: false, error: 'pageViews must be an integer' }, { status: 400 });
        }

        if (isBot !== undefined && typeof isBot !== 'boolean') {
            return NextResponse.json({ success: false, error: 'isBot must be a strict boolean' }, { status: 400 });
        }

        const parseDate = (d: any) => {
            if (!d) return undefined;
            const dateObj = new Date(d);
            if (isNaN(dateObj.getTime())) return null;
            return dateObj;
        };

        let parsedFirst = firstVisitedAt ? parseDate(firstVisitedAt) : undefined;
        let parsedLast = lastVisitedAt ? parseDate(lastVisitedAt) : undefined;

        if (parsedFirst === null || parsedLast === null) {
            return NextResponse.json({ success: false, error: 'Invalid date format provided for firstVisitedAt or lastVisitedAt' }, { status: 400 });
        }

        const newVisitor = await prisma.visitor.create({
            data: {
                sessionId: sessionId.trim(),
                ipAddress: parsedIpAddress,
                userAgent: parsedUserAgent,
                country: parsedCountry,
                city: parsedCity,
                deviceType: parsedDeviceType,
                browser: parsedBrowser,
                operatingSystem: parsedOperatingSystem,
                landingPage: parsedLandingPage,
                referrerUrl: parsedReferrerUrl,
                pageViews: pageViews ?? 1,
                isBot: isBot ?? false,
                firstVisitedAt: parsedFirst,
                lastVisitedAt: parsedLast
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
            action: 'VISITOR_CREATED',
            entity: 'Visitor',
            entityId: newVisitor.id,
            description: `Visitor created for sessionId: ${newVisitor.sessionId}`,
            ipAddress: clientIp,
            userAgent: clientAgent
        });

        return NextResponse.json({ success: true, data: newVisitor }, { status: 201 });
    } catch (error) {
        console.error('Error creating Visitor:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
