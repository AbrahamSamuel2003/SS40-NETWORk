import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
    getServiceBySlug,
    getAllServiceSlugs,
    SEO_SERVICES_DATA
} from "@/data/seo-services";
import { ServiceLandingPage } from "@/components/seo/ServiceLandingPage";

interface Props {
    params: Promise<{ serviceSlug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
    return getAllServiceSlugs().map((slug) => ({
        serviceSlug: slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { serviceSlug } = await params;
    const service = getServiceBySlug(serviceSlug);

    if (!service) {
        return {
            title: "Service Not Found | SS40 NETWORK",
        };
    }

    const canonicalUrl = `https://ss40network.com/${service.slug}`;

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
                    alt: `${service.title} — SS40 NETWORK`,
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

export default async function DynamicServicePage({ params }: Props) {
    const { serviceSlug } = await params;
    const service = getServiceBySlug(serviceSlug);

    if (!service) {
        notFound();
    }

    // Related services: same category or same city, excluding current
    const relatedServices = SEO_SERVICES_DATA.filter(
        (item) =>
            item.slug !== service.slug &&
            (item.category === service.category || item.city === service.city)
    );

    return <ServiceLandingPage service={service} relatedServices={relatedServices} />;
}
