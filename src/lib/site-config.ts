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
    seoDefaultTitle: "SS40 NETWORK PRIVATE LIMITED — Enterprise Digital Solutions, SaaS Products & Tech Academics",
    seoDefaultDescription: "Architecting high-scale digital systems, intelligent SaaS products, and career-launching tech academics by SS40 NETWORK PRIVATE LIMITED. Built in India. Thinking Globally."
};

export const getSiteConfig = unstable_cache(
    async function (): Promise<SiteConfigData | null> {
        if (!process.env.DATABASE_URL) {
            return DEFAULT_SITE_CONFIG;
        }
        try {
            const config = await prisma.siteConfig.findUnique({
                where: { id: 1 },
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
                }
            });
            return config || DEFAULT_SITE_CONFIG;
        } catch (e) {
            console.warn('Database offline or unreachable, returning default site config fallback.');
            return DEFAULT_SITE_CONFIG;
        }
    },
    ['site-config'],
    { tags: ['site-config'], revalidate: 3600 }
);
