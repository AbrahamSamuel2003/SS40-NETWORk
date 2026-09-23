import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export interface SiteConfigData {
    companyName: string;
    legalName: string;
    logoUrl: string | null;
    uploadedLogoUrl: string | null;
    contactEmail: string;
    contactPhone: string;
    whatsappNumber: string;
    addressText: string;
    businessHours: string;
    footerDescription: string;
    googleMapsIframeUrl: string | null;
    urlLinkedin: string | null;
    urlYoutube: string | null;
    urlInstagram: string | null;
    seoDefaultTitle: string;
    seoDefaultDescription: string;
    sectionVisibility?: Record<string, boolean> | null;
}

export const DEFAULT_SITE_CONFIG: SiteConfigData = {
    companyName: "SS40 NETWORK PRIVATE LIMITED",
    legalName: "SS40 NETWORK PRIVATE LIMITED",
    logoUrl: "/icon.jpg",
    uploadedLogoUrl: null,
    contactEmail: "support@ss40network.com",
    contactPhone: "+91 83005 91750",
    whatsappNumber: "+91 83005 91750",
    addressText: "1st Floor, Municipal Corporation Incubation Centre (Near by trade centre), Sree Puram, Tirunelveli, Tamil Nadu 627001",
    businessHours: "Monday - Saturday: 09:00 AM - 06:00 PM",
    footerDescription: "Architecting high-scale digital systems, intelligent SaaS products, and career-launching tech academics. Built in India. Thinking Globally.",
    googleMapsIframeUrl: null,
    urlLinkedin: "https://www.linkedin.com/company/ss40-network",
    urlYoutube: null,
    urlInstagram: null,
    seoDefaultTitle: "SS40 NETWORK PRIVATE LIMITED — Enterprise Digital Solutions, SaaS Products and Tech Academics",
    seoDefaultDescription: "Architecting high-scale digital systems, intelligent SaaS products, and career-launching tech academics by SS40 NETWORK PRIVATE LIMITED. Built in India. Thinking Globally.",
    sectionVisibility: {}
};

export function isSectionVisible(config: SiteConfigData | null | undefined, sectionKey: string): boolean {
    if (!config || !config.sectionVisibility) return true; // Visible by default
    const visibility = config.sectionVisibility as Record<string, boolean>;
    if (typeof visibility[sectionKey] === 'boolean') {
        return visibility[sectionKey];
    }
    return true; // Default to visible
}

export const getSiteConfig = unstable_cache(
    async function (): Promise<SiteConfigData | null> {
        if (!process.env.DATABASE_URL) {
            return DEFAULT_SITE_CONFIG;
        }
        try {
            const config = await prisma.siteConfig.findFirst({
                select: {
                    companyName: true,
                    legalName: true,
                    logoUrl: true,
                    uploadedLogoUrl: true,
                    contactEmail: true,
                    contactPhone: true,
                    whatsappNumber: true,
                    addressText: true,
                    businessHours: true,
                    footerDescription: true,
                    googleMapsIframeUrl: true,
                    urlLinkedin: true,
                    urlYoutube: true,
                    urlInstagram: true,
                    seoDefaultTitle: true,
                    seoDefaultDescription: true,
                    sectionVisibility: true,
                }
            });
            if (!config) return DEFAULT_SITE_CONFIG;
            return {
                ...config,
                sectionVisibility: (config.sectionVisibility as Record<string, boolean>) || {}
            };
        } catch (e) {
            try {
                const rows: any = await prisma.$queryRawUnsafe(`SELECT * FROM "SiteConfig" LIMIT 1`);
                if (rows && rows.length > 0) {
                    const row = rows[0];
                    let secVis = {};
                    if (row.sectionVisibility) {
                        secVis = typeof row.sectionVisibility === 'string' ? JSON.parse(row.sectionVisibility) : row.sectionVisibility;
                    }
                    return {
                        ...DEFAULT_SITE_CONFIG,
                        ...row,
                        sectionVisibility: secVis
                    };
                }
            } catch {}
            return DEFAULT_SITE_CONFIG;
        }
    },
    ['site-config'],
    { tags: ['site-config'], revalidate: 60 }
);
