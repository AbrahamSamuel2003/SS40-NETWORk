import { LegalHero, LegalSummaryBlocks, LegalSidebarLayout, LegalCTA } from "@/components/legal/LegalComponents";
import { privacyPolicyData } from "@/data/privacy-policy";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | SS40 NETWORK PRIVATE LIMITED",
    description: "Learn about how personal information is protected and managed by SS40 NETWORK PRIVATE LIMITED in accordance with international data security standards.",
    alternates: {
        canonical: "https://www.ss40network.com/privacy-policy",
    },
    openGraph: {
        title: "Privacy Policy | SS40 NETWORK PRIVATE LIMITED",
        description: "Learn about how personal information is protected and managed by SS40 NETWORK PRIVATE LIMITED in accordance with international data security standards.",
        url: "https://www.ss40network.com/privacy-policy",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Privacy Policy — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy | SS40 NETWORK PRIVATE LIMITED",
        description: "Learn about how personal information is protected and managed by SS40 NETWORK PRIVATE LIMITED in accordance with international data security standards.",
        images: ["https://www.ss40network.com/og-image.jpg"],
    },
};

export default function PrivacyPolicyPage() {
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
                        "name": "Privacy Policy",
                        "item": "https://www.ss40network.com/privacy-policy"
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
                title={privacyPolicyData.title}
                description={privacyPolicyData.description}
                lastUpdated={privacyPolicyData.lastUpdated}
            />
            <LegalSummaryBlocks summaries={privacyPolicyData.summaries} />
            <LegalSidebarLayout sections={privacyPolicyData.sections} />
            <LegalCTA
                heading={privacyPolicyData.cta.heading}
                text={privacyPolicyData.cta.text}
            />
        </div>
    );
}
