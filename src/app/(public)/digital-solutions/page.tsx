import type { Metadata } from "next";
import { Hero } from "@/components/digital-solutions/Hero";
import { WhatWeBuild } from "@/components/digital-solutions/WhatWeBuild";
import { DevelopmentLifecycle } from "@/components/digital-solutions/DevelopmentLifecycle";
import { ClientProjects } from "@/components/digital-solutions/ClientProjects";
import { Happimonials } from "@/components/digital-solutions/Happimonials";
import { TrustedClients } from "@/components/digital-solutions/TrustedClients";
import { GetQuote } from "@/components/digital-solutions/GetQuote";

export const metadata: Metadata = {
    title: "Engineering Digital Experiences That Scale | SS40 NETWORK PRIVATE LIMITED",
    description: "Custom software development company in Tirunelveli delivering enterprise web applications, mobile apps, and scalable AI solutions by SS40 NETWORK PRIVATE LIMITED.",
    alternates: {
        canonical: "https://ss40network.com/digital-solutions",
    },
    openGraph: {
        title: "Engineering Digital Experiences That Scale | SS40 NETWORK PRIVATE LIMITED",
        description: "Custom software development company in Tirunelveli delivering enterprise web applications, mobile apps, and scalable AI solutions by SS40 NETWORK PRIVATE LIMITED.",
        url: "https://ss40network.com/digital-solutions",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Digital Solutions — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Engineering Digital Experiences That Scale | SS40 NETWORK PRIVATE LIMITED",
        description: "Custom software development company in Tirunelveli delivering enterprise web applications, mobile apps, and scalable AI solutions by SS40 NETWORK PRIVATE LIMITED.",
        images: ["https://ss40network.com/og-image.jpg"],
    },
};

export const revalidate = 60;

import { prisma } from "@/lib/prisma";
import { getSiteConfig, isSectionVisible } from "@/lib/site-config";

export default async function DigitalSolutionsPage() {
    const [config, projects, happimonials, logos] = await Promise.all([
        getSiteConfig(),
        prisma.clientProject.findMany({
            where: { isActive: true },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ]
        }).catch(() => []),
        prisma.happimonial.findMany({
            where: { pageScope: 'DIGITAL_SOLUTIONS', isActive: true },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ]
        }).catch(() => []),
        prisma.organizationLogo.findMany({
            where: { pageScope: 'DIGITAL_SOLUTIONS', isActive: true },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ]
        }).catch(() => [])
    ]);

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
                        "item": "https://ss40network.com/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Digital Solutions",
                        "item": "https://ss40network.com/digital-solutions"
                    }
                ]
            },
            {
                "@type": "Service",
                "@id": "https://ss40network.com/digital-solutions#service",
                "name": "Enterprise Digital Solutions",
                "provider": {
                    "@type": "Organization",
                    "name": "SS40 NETWORK PRIVATE LIMITED",
                    "url": "https://ss40network.com"
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

            {/* Below the fold (GPU-accelerated with content-visibility containment) */}
            <DevelopmentLifecycle />
            {isSectionVisible(config, 'digitalSolutions_projects') && (
                <ClientProjects initialData={projects} />
            )}
            {isSectionVisible(config, 'digitalSolutions_happimonials') && (
                <div className="cv-auto">
                    <Happimonials initialData={happimonials} />
                </div>
            )}
            {isSectionVisible(config, 'digitalSolutions_logos') && (
                <div className="cv-auto">
                    <TrustedClients initialData={logos} />
                </div>
            )}
            <div className="cv-auto">
                <GetQuote />
            </div>
        </div>
    );
}
