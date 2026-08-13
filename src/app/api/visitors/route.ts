import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { currentPath, referrer } = body;

        let sessionId: string | undefined = request.headers.get('cookie')?.split(';')
            .map(c => c.trim())
            .find(c => c.startsWith('visitor_session='))
            ?.split('=')[1];

        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';
        const userAgent = request.headers.get('user-agent') || 'Unknown';

        let isBot = false;
        const botKeywords = ['bot', 'crawler', 'spider', 'google', 'bing', 'yandex', 'baidu'];
        if (botKeywords.some(keyword => userAgent.toLowerCase().includes(keyword))) {
            isBot = true;
        }

        // Extremely basic user agent parsing to avoid adding heavy libraries
        let browser = 'Unknown';
        let os = 'Unknown';
        let deviceType = 'Desktop';

        if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
            deviceType = 'Mobile';
        } else if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
            deviceType = 'Tablet';
        }

        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac OS')) os = 'macOS';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) os = 'iOS';
        else if (userAgent.includes('Linux')) os = 'Linux';

        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
        else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Edg')) browser = 'Edge';

        let resCookieValue: string | null = null;

        if (sessionId) {
            // Update existing
            const existing = await prisma.visitor.findFirst({
                where: { sessionId }
            });

            if (existing) {
                await prisma.visitor.update({
                    where: { id: existing.id },
                    data: {
                        pageViews: { increment: 1 },
                        lastVisitedAt: new Date()
                    }
                });
            } else {
                // Cookie has invalid session, create a new one
                sessionId = crypto.randomUUID();
                resCookieValue = sessionId;

                await prisma.visitor.create({
                    data: {
                        sessionId: sessionId as string,
                        ipAddress,
                        userAgent,
                        deviceType,
                        browser,
                        operatingSystem: os,
                        landingPage: currentPath,
                        referrerUrl: referrer,
                        isBot
                    }
                });
            }
        } else {
            sessionId = crypto.randomUUID();
            resCookieValue = sessionId;

            await prisma.visitor.create({
                data: {
                    sessionId: sessionId as string,
                    ipAddress,
                    userAgent,
                    deviceType,
                    browser,
                    operatingSystem: os,
                    landingPage: currentPath,
                    referrerUrl: referrer,
                    isBot
                }
            });
        }

        const response = NextResponse.json({ success: true });

        if (resCookieValue) {
            response.cookies.set('visitor_session', resCookieValue, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 365, // 1 year
                sameSite: 'lax'
            });
        }

        return response;

    } catch (e: any) {
        console.error('Visitor tracking error:', e);
        return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 });
    }
}
