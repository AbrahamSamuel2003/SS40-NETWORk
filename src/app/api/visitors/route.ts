import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface GeoRecord {
    city: string;
    country: string;
    isBot: boolean;
    timestamp: number;
}

// In-memory cache for geolocation lookups (24 hours TTL)
const geoCache = new Map<string, GeoRecord>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

// Datacenter ASN / Cloud hosting providers commonly used by scrapers
const DATACENTER_KEYWORDS = [
    'amazon', 'aws', 'microsoft', 'azure', 'google cloud', 'digitalocean',
    'cloudflare', 'oracle', 'linode', 'ovh', 'hetzner', 'facebook', 'meta',
    'alibaba', 'tencent', 'fastly', 'akamai', 'm247', 'choopa', 'vultr', 'leaseweb'
];

// User-Agent crawler and bot signatures
const BOT_KEYWORDS = [
    'bot', 'crawler', 'spider', 'google', 'bing', 'yandex', 'baidu',
    'slurp', 'duckduckgo', 'facebookexternalhit', 'whatsapp', 'telegram',
    'headlesschrome', 'lighthouse', 'bytespider', 'python', 'curl', 'wget',
    'semrush', 'ahrefs', 'mj12bot', 'dotbot', 'rogerbot', 'exabot'
];

function isInternalIp(ip: string): boolean {
    if (!ip || ip === 'Unknown' || ip === '127.0.0.1' || ip === '::1') return true;
    if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.16.') || ip.startsWith('172.31.')) return true;
    return false;
}

async function resolveVisitorIntelligence(
    request: Request,
    ipAddress: string,
    userAgent: string
): Promise<{ city: string; country: string; isBot: boolean }> {
    let city = 'Unknown';
    let region = '';
    let country = 'Unknown';
    let isBot = false;

    // 1. Detect User-Agent bot signatures
    const uaLower = userAgent.toLowerCase();
    if (BOT_KEYWORDS.some(k => uaLower.includes(k))) {
        isBot = true;
    }

    // 2. Read Edge CDN headers (0ms latency on Vercel / Cloudflare)
    const edgeCity = request.headers.get('x-vercel-ip-city') || request.headers.get('cf-ipcity');
    const edgeRegion = request.headers.get('x-vercel-ip-country-region') || request.headers.get('cf-region');
    const edgeCountry = request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry');

    if (edgeCity) city = decodeURIComponent(edgeCity);
    if (edgeRegion) region = decodeURIComponent(edgeRegion);
    if (edgeCountry) country = decodeURIComponent(edgeCountry);

    // 3. Skip external lookup for internal or missing IPs
    if (isInternalIp(ipAddress)) {
        const formattedCity = city !== 'Unknown' && region && city.toLowerCase() !== region.toLowerCase()
            ? `${city}, ${region}`
            : (city !== 'Unknown' ? city : (region || 'Unknown'));
        return { city: formattedCity, country, isBot };
    }

    // 4. Check in-memory cache
    const cached = geoCache.get(ipAddress);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return {
            city: edgeCity && edgeRegion ? `${city}, ${region}` : cached.city,
            country: edgeCountry ? country : cached.country,
            isBot: isBot || cached.isBot
        };
    }

    // 5. Query IP API with carrier and datacenter fields
    try {
        const response = await fetch(
            `http://ip-api.com/json/${encodeURIComponent(ipAddress)}?fields=status,message,country,regionName,city,isp,org,as,hosting,proxy`,
            { signal: AbortSignal.timeout(3000) }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.status === 'success') {
                const apiCity = data.city || '';
                const apiRegion = data.regionName || '';
                const apiCountry = data.country || '';
                const apiOrg = (data.org || '').toLowerCase();
                const apiAs = (data.as || '').toLowerCase();

                if (!edgeCity && apiCity) city = apiCity;
                if (!edgeRegion && apiRegion) region = apiRegion;
                if (!edgeCountry && apiCountry) country = apiCountry;

                // Identify server crawlers / hosting datacenters masquerading as organic users
                if (
                    data.hosting === true ||
                    data.proxy === true ||
                    DATACENTER_KEYWORDS.some(k => apiOrg.includes(k) || apiAs.includes(k))
                ) {
                    isBot = true;
                }

                const formattedCity = city !== 'Unknown' && region && city.toLowerCase() !== region.toLowerCase()
                    ? `${city}, ${region}`
                    : (city !== 'Unknown' ? city : (region || 'Unknown'));

                const result = { city: formattedCity, country, isBot };
                geoCache.set(ipAddress, { ...result, timestamp: Date.now() });
                return result;
            }
        }
    } catch {
        // Fallback silently if lookup times out or fails
    }

    const fallbackCity = city !== 'Unknown' && region && city.toLowerCase() !== region.toLowerCase()
        ? `${city}, ${region}`
        : (city !== 'Unknown' ? city : (region || 'Unknown'));

    return { city: fallbackCity, country, isBot };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { currentPath, referrer } = body;

        let sessionId: string | undefined = request.headers.get('cookie')?.split(';')
            .map(c => c.trim())
            .find(c => c.startsWith('visitor_session='))
            ?.split('=')[1];

        const rawIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';
        const ipAddress = rawIp.split(',')[0].trim();
        const userAgent = request.headers.get('user-agent') || 'Unknown';

        // Resolve carrier-aware geolocation and bot intelligence
        const { city, country, isBot } = await resolveVisitorIntelligence(request, ipAddress, userAgent);

        // Parse client device and browser
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
            const existing = await prisma.visitor.findFirst({
                where: { sessionId }
            });

            if (existing) {
                const currentVisits = (existing.pageVisits as any[]) || [];
                const newVisit = { path: currentPath, timestamp: new Date().toISOString() };
                const updatedVisits = [newVisit, ...currentVisits].slice(0, 100);

                const updateData: any = {
                    pageViews: { increment: 1 },
                    lastVisitedAt: new Date(),
                    pageVisits: updatedVisits
                };

                // Update location if previously unpopulated
                if ((!existing.city || existing.city === 'Unknown') && city !== 'Unknown') {
                    updateData.city = city;
                }
                if ((!existing.country || existing.country === 'Unknown') && country !== 'Unknown') {
                    updateData.country = country;
                }
                if (!existing.isBot && isBot) {
                    updateData.isBot = true;
                }

                await prisma.visitor.update({
                    where: { id: existing.id },
                    data: updateData
                });
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
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax'
            });
        }

        return response;

    } catch (e: any) {
        console.error('Visitor tracking error:', e);
        return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 });
    }
}
