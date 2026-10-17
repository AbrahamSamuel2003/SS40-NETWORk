import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, SEO_SERVICES_DATA } from "@/data/seo-services";
import { ServiceLandingPage } from "@/components/seo/ServiceLandingPage";

const SLUG = "ai-development-services-in-tamilnadu";

export async function generateMetadata(): Promise<Metadata> {
    const service = getServiceBySlug(SLUG);
    if (!service) return { title: "AI Development Services in Tamilnadu" };

    const canonicalUrl = `https://ss40network.com/${SLUG}`;

    return {
        title: service.metaTitle,
        description: service.metaDescription,
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            title: service.metaTitle,
            description: service.metaDescription,
            url: canonicalUrl,
            siteName: "SS40 NETWORK PRIVATE LIMITED",
            type: "article",
            images: [
                {
                    url: "https://ss40network.com/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "AI Development Services in Tamilnadu — SS40 NETWORK",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: service.metaTitle,
            description: service.metaDescription,
            images: ["https://ss40network.com/og-image.jpg"],
        },
    };
}

export const revalidate = 86400; // 24 hours static revalidation

export default function AiDevelopmentServicesTamilNaduPage() {
    const service = getServiceBySlug(SLUG);
    if (!service) notFound();

    const relatedServices = SEO_SERVICES_DATA.filter(
        (item) => item.slug !== SLUG && (item.category === "AI Solutions" || item.city === "Tamil Nadu")
    );

    return <ServiceLandingPage service={service} relatedServices={relatedServices} />;
}
