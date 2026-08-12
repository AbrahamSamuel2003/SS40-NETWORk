import { prisma } from '@/lib/prisma';
import { unstable_noStore as noStore } from 'next/cache';

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

export async function getSiteConfig(): Promise<SiteConfigData | null> {
    noStore(); // Fast CMS Propagation
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
        return config;
    } catch (e) {
        console.error('Error fetching site config server-side:', e);
        return null;
    }
}
