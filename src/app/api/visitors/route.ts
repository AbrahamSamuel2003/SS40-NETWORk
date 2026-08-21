import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple in-memory cache for geolocation results
const geoCache = new Map<string, { city: string; country: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getGeolocation(ipAddress: string): Promise<{ city: string; country: string } | null> {
    // Check cache first
    const cached = geoCache.get(ipAddress);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return { city: cached.city, country: cached.country };
    }

    // Skip geolocation for localhost/internal IPs
    if (ipAddress === 'Unknown' || ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress.startsWith('172.')) {
        console.log('Skipping geolocation for internal IP:', ipAddress);
        return null;
    }

    try {
        // Use ip-api.com (free, no API key required)
        const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
        if (!response.ok) {
            console.error('Geolocation API failed:', response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        console.log('Geolocation response for IP', ipAddress, ':', data);
        
        if (data.status === 'success') {
            const result = {
                city: data.city || 'Unknown',
                country: data.country || 'Unknown'
            };
            // Cache the result
            geoCache.set(ipAddress, { ...result, timestamp: Date.now() });
            console.log('Geolocation result:', result);
            return result;
        } else {
            console.error('Geolocation API returned error:', data.message);
        }
    } catch (error) {
        console.error('Geolocation lookup failed:', error);
    }

    return null;
}

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

        // Get geolocation for IP address
        let city = 'Unknown';
        let country = 'Unknown';
        if (ipAddress !== 'Unknown') {
            const geo = await getGeolocation(ipAddress);
            if (geo) {
                city = geo.city;
                country = geo.country;
            }
        }

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
                // Add current page visit to history
                const currentVisits = (existing.pageVisits as any[]) || [];
                const newVisit = { path: currentPath, timestamp: new Date().toISOString() };
                const updatedVisits = [newVisit, ...currentVisits].slice(0, 100); // Keep last 100 visits

                await prisma.visitor.update({
                    where: { id: existing.id },
                    data: {
                        pageViews: { increment: 1 },
                        lastVisitedAt: new Date(),
                        pageVisits: updatedVisits
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
                        city,
                        country,
                        isBot,
                        pageVisits: [{ path: currentPath, timestamp: new Date().toISOString() }]
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
                    city,
                    country,
                    isBot,
                    pageVisits: [{ path: currentPath, timestamp: new Date().toISOString() }]
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
