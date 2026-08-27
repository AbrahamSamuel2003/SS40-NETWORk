import { LegalHero, LegalSummaryBlocks, LegalSidebarLayout, LegalCTA } from "@/components/legal/LegalComponents";
import { refundPolicyData } from "@/data/refund-policy";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund & Cancellation Policy | SS40 NETWORK PRIVATE LIMITED",
    description: "Read the policies on refunds, cancellations, and service commitments for SS40 NETWORK PRIVATE LIMITED.",
    alternates: {
        canonical: "https://www.ss40network.com/refund-policy",
    },
    openGraph: {
        title: "Refund & Cancellation Policy | SS40 NETWORK PRIVATE LIMITED",
        description: "Read the policies on refunds, cancellations, and service commitments for SS40 NETWORK PRIVATE LIMITED.",
        url: "https://www.ss40network.com/refund-policy",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Refund & Cancellation Policy — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Refund & Cancellation Policy | SS40 NETWORK PRIVATE LIMITED",
        description: "Read the policies on refunds, cancellations, and service commitments for SS40 NETWORK PRIVATE LIMITED.",
        images: ["https://www.ss40network.com/og-image.jpg"],
    },
};

export default function RefundPolicyPage() {
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
                        "name": "Refund & Cancellation Policy",
                        "item": "https://www.ss40network.com/refund-policy"
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
                title={refundPolicyData.title}
                description={refundPolicyData.description}
                lastUpdated={refundPolicyData.lastUpdated}
            />
            <LegalSummaryBlocks summaries={refundPolicyData.summaries} />
            <LegalSidebarLayout sections={refundPolicyData.sections} />
            <LegalCTA
                heading={refundPolicyData.cta.heading}
                text={refundPolicyData.cta.text}
            />
        </div>
    );
}
