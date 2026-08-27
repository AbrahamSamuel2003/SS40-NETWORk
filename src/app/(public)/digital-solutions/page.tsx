import type { Metadata } from "next";
import { Hero } from "@/components/digital-solutions/Hero";
import { WhatWeBuild } from "@/components/digital-solutions/WhatWeBuild";
import { DevelopmentLifecycle } from "@/components/digital-solutions/DevelopmentLifecycle";
import { ClientProjects } from "@/components/digital-solutions/ClientProjects";
import { Happimonials } from "@/components/digital-solutions/Happimonials";
import { TrustedClients } from "@/components/digital-solutions/TrustedClients";
import { GetQuote } from "@/components/digital-solutions/GetQuote";

export const metadata: Metadata = {
    title: "Digital Solutions | SS40 NETWORK PRIVATE LIMITED",
    description: "Empowering enterprises with custom software, full-stack web applications, AI automation, and cloud infrastructure engineered by SS40 NETWORK PRIVATE LIMITED.",
    alternates: {
        canonical: "https://www.ss40network.com/digital-solutions",
    },
    openGraph: {
        title: "Digital Solutions | SS40 NETWORK PRIVATE LIMITED",
        description: "Empowering enterprises with custom software, full-stack web applications, AI automation, and cloud infrastructure engineered by SS40 NETWORK PRIVATE LIMITED.",
        url: "https://www.ss40network.com/digital-solutions",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Digital Solutions — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Digital Solutions | SS40 NETWORK PRIVATE LIMITED",
        description: "Empowering enterprises with custom software, full-stack web applications, AI automation, and cloud infrastructure engineered by SS40 NETWORK PRIVATE LIMITED.",
        images: ["https://www.ss40network.com/og-image.jpg"],
    },
};

export const revalidate = 60;

export default function DigitalSolutionsPage() {
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
                        "name": "Digital Solutions",
                        "item": "https://www.ss40network.com/digital-solutions"
                    }
                ]
            },
            {
                "@type": "Service",
                "@id": "https://www.ss40network.com/digital-solutions#service",
                "name": "Enterprise Digital Solutions",
                "provider": {
                    "@type": "Organization",
                    "name": "SS40 NETWORK PRIVATE LIMITED",
                    "url": "https://www.ss40network.com"
                },
                "serviceType": "Custom Software Development, Web Applications, AI & Cloud Systems",
                "areaServed": "Global",
                "description": "Full-cycle digital transformation services including responsive web platforms, mobile applications, cloud architectures, and bespoke AI automations."
            }
        ]
    };

    return (
        <div className="w-full flex-col flex">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Above the fold (Critical Path) */}
            <Hero />
            <WhatWeBuild />

            {/* Below the fold (Clean direct imports, 0 preload fragmentation) */}
            <DevelopmentLifecycle />
            <ClientProjects />
            <Happimonials />
            <TrustedClients />
            <GetQuote />
        </div>
    );
}
