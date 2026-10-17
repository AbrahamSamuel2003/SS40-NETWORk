import React from "react";
import type { Metadata } from "next";
import { SEO_SERVICES_DATA } from "@/data/seo-services";
import { ServicesDirectory } from "@/components/blog/ServicesDirectory";

export const metadata: Metadata = {
    title: "Services & Solutions Directory | SS40 NETWORK",
    description:
        "Explore dedicated custom software, web application development, mobile apps, AI solutions, cloud hosting, and business automation services across Tirunelveli, Chennai, Coimbatore, Madurai, and Tamil Nadu.",
    alternates: {
        canonical: "https://ss40network.com/blog",
    },
    openGraph: {
        title: "Services & Solutions Directory | SS40 NETWORK",
        description:
            "Explore dedicated custom software, web application development, mobile apps, AI solutions, cloud hosting, and business automation services across Tirunelveli, Chennai, Coimbatore, Madurai, and Tamil Nadu.",
        url: "https://ss40network.com/blog",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Services & Solutions Directory — SS40 NETWORK",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Services & Solutions Directory | SS40 NETWORK",
        description:
            "Explore dedicated custom software, web application development, mobile apps, AI solutions, cloud hosting, and business automation services across Tirunelveli, Chennai, Coimbatore, Madurai, and Tamil Nadu.",
        images: ["https://ss40network.com/og-image.jpg"],
    },
};

export const revalidate = 86400; // 24 hours static revalidation

export default function BlogServicesDirectoryPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "SS40 NETWORK Services & Regional Solutions Directory",
        "description":
            "Directory of specialized custom software, web applications, mobile apps, AI solutions, cloud platforms, and business automation services across Tirunelveli, Chennai, Coimbatore, Madurai, and Tamil Nadu.",
        "url": "https://ss40network.com/blog",
        "publisher": {
            "@type": "Organization",
            "name": "SS40 NETWORK PRIVATE LIMITED",
            "url": "https://ss40network.com",
            "logo": "https://ss40network.com/icon.jpg"
        },
        "hasPart": SEO_SERVICES_DATA.map((service, index) => ({
            "@type": "WebPage",
            "position": index + 1,
            "name": service.title,
            "url": `https://ss40network.com/${service.slug}`,
            "description": service.summary
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ServicesDirectory services={SEO_SERVICES_DATA} />
        </>
    );
}
