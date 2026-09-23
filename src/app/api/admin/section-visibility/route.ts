import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { revalidateEntityCache } from '@/lib/revalidate-helpers';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        let visibility: Record<string, boolean> = {};
        try {
            const config = await prisma.siteConfig.findFirst({
                select: { sectionVisibility: true }
            });
            visibility = (config?.sectionVisibility as Record<string, boolean>) || {};
        } catch {
            const rows: any = await prisma.$queryRawUnsafe(`SELECT "sectionVisibility" FROM "SiteConfig" LIMIT 1`);
            if (rows && rows.length > 0 && rows[0].sectionVisibility) {
                visibility = typeof rows[0].sectionVisibility === 'string' 
                    ? JSON.parse(rows[0].sectionVisibility) 
                    : rows[0].sectionVisibility;
            }
        }

        return NextResponse.json({ success: true, data: visibility });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const admin = await getCurrentAdmin();
    if (!admin) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { sectionKey, isVisible } = body;

        if (!sectionKey || typeof isVisible !== 'boolean') {
            return NextResponse.json({ success: false, error: 'Invalid request payload' }, { status: 400 });
        }

        let existingId: number | null = null;
        let currentVisibility: Record<string, boolean> = {};

        try {
            const existingConfig = await prisma.siteConfig.findFirst();
            if (existingConfig) {
                existingId = existingConfig.id;
                currentVisibility = (existingConfig.sectionVisibility as Record<string, boolean>) || {};
            }
        } catch {
            const rows: any = await prisma.$queryRawUnsafe(`SELECT id, "sectionVisibility" FROM "SiteConfig" LIMIT 1`);
            if (rows && rows.length > 0) {
                existingId = rows[0].id;
                if (rows[0].sectionVisibility) {
                    currentVisibility = typeof rows[0].sectionVisibility === 'string'
                        ? JSON.parse(rows[0].sectionVisibility)
                        : rows[0].sectionVisibility;
                }
            }
        }

        const updatedVisibility = {
            ...currentVisibility,
            [sectionKey]: isVisible
        };
        const visibilityJsonStr = JSON.stringify(updatedVisibility);

        if (existingId) {
            await prisma.$executeRawUnsafe(
                `UPDATE "SiteConfig" SET "sectionVisibility" = $1::jsonb, "updatedAt" = NOW() WHERE id = $2`,
                visibilityJsonStr,
                existingId
            );
        } else {
            await prisma.$executeRawUnsafe(
                `INSERT INTO "SiteConfig" (
                    "companyName", "legalName", "contactEmail", "contactPhone", 
                    "whatsappNumber", "addressText", "businessHours", "footerDescription", 
                    "seoDefaultTitle", "seoDefaultDescription", "sectionVisibility", "createdAt", "updatedAt"
                ) VALUES (
                    'SS40 NETWORK PRIVATE LIMITED', 'SS40 NETWORK PRIVATE LIMITED', 'support@ss40network.com', '+91 83005 91750',
                    '+91 83005 91750', '1st Floor, Municipal Corporation Incubation Centre (Near by trade centre), Sree Puram, Tirunelveli, Tamil Nadu 627001', 
                    'Monday - Saturday: 09:00 AM - 06:00 PM', 'Architecting high-scale digital systems, intelligent SaaS products, and career-launching tech academics.', 
                    'SS40 NETWORK PRIVATE LIMITED', 'Enterprise Digital Solutions, SaaS Products and Tech Academics',
                    $1::jsonb, NOW(), NOW()
                )`,
                visibilityJsonStr
            );
        }

        try {
            revalidateEntityCache('SITE_CONFIG');
            revalidatePath('/', 'page');
            revalidatePath('/digital-solutions', 'page');
            revalidatePath('/products', 'page');
            revalidatePath('/academics', 'page');
        } catch {}

        return NextResponse.json({
            success: true,
            data: updatedVisibility,
            message: `Section visibility updated to ${isVisible ? 'Visible' : 'Hidden'}`
        });
    } catch (error: any) {
        console.error('Error in section-visibility route:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
