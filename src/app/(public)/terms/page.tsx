import { LegalHero, LegalSummaryBlocks, LegalSidebarLayout, LegalCTA } from "@/components/legal/LegalComponents";
import { termsData } from "@/data/terms";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | SS40 NETWORK PRIVATE LIMITED",
    description: "Read the Terms of Service for using websites, software, products, and services provided by SS40 NETWORK PRIVATE LIMITED.",
    alternates: {
        canonical: "https://www.ss40network.com/terms",
    },
    openGraph: {
        title: "Terms of Service | SS40 NETWORK PRIVATE LIMITED",
        description: "Read the Terms of Service for using websites, software, products, and services provided by SS40 NETWORK PRIVATE LIMITED.",
        url: "https://www.ss40network.com/terms",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Terms of Service — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Terms of Service | SS40 NETWORK PRIVATE LIMITED",
        description: "Read the Terms of Service for using websites, software, products, and services provided by SS40 NETWORK PRIVATE LIMITED.",
        images: ["https://www.ss40network.com/og-image.jpg"],
    },
};

export default function TermsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://www.ss40network.com/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Terms of Service",
                        "item": "https://www.ss40network.com/terms"
                    }
                ]
            }
        ]
    };

    return (
        <div className="w-full flex-col flex bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <LegalHero
                title={termsData.title}
                description={termsData.description}
                lastUpdated={termsData.lastUpdated}
            />
            <LegalSummaryBlocks summaries={termsData.summaries} />
            <LegalSidebarLayout sections={termsData.sections} />
            <LegalCTA
                heading={termsData.cta.heading}
                text={termsData.cta.text}
            />
        </div>
    );
}
