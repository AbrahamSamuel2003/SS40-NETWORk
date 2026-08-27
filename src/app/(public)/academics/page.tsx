import { Hero } from "@/components/academics/Hero";
import { StudentImpacts } from "@/components/academics/StudentImpacts";
import { BestProjects } from "@/components/academics/BestProjects";
import { Placements } from "@/components/academics/Placements";
import { Collaborations } from "@/components/academics/Collaborations";
import { Collaborate } from "@/components/academics/Collaborate";
import { prisma } from "@/lib/prisma";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Academics | SS40 NETWORK PRIVATE LIMITED",
    description: "Accelerate tech careers with industry-grade software engineering training, AI development, and live capstone projects at SS40 NETWORK PRIVATE LIMITED.",
    alternates: {
        canonical: "https://www.ss40network.com/academics",
    },
    openGraph: {
        title: "Academics | SS40 NETWORK PRIVATE LIMITED",
        description: "Accelerate tech careers with industry-grade software engineering training, AI development, and live capstone projects at SS40 NETWORK PRIVATE LIMITED.",
        url: "https://www.ss40network.com/academics",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Academics — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Academics | SS40 NETWORK PRIVATE LIMITED",
        description: "Accelerate tech careers with industry-grade software engineering training, AI development, and live capstone projects at SS40 NETWORK PRIVATE LIMITED.",
        images: ["https://www.ss40network.com/og-image.jpg"],
    },
};

// Sub-15ms TTFB: ISR memory caching with 60s background revalidation
export const revalidate = 60;

export default async function AcademicsPage() {
    const studentProjects = await prisma.studentProject.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    const studentImpactRecords = await prisma.studentImpact.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    const academicLogos = await prisma.organizationLogo.findMany({
        where: { pageScope: 'ACADEMICS', isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

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
                        "name": "Academics",
                        "item": "https://www.ss40network.com/academics"
                    }
                ]
            },
            {
                "@type": "EducationalOrganization",
                "@id": "https://www.ss40network.com/academics#organization",
                "name": "SS40 NETWORK PRIVATE LIMITED Academics",
                "parentOrganization": {
                    "@type": "Organization",
                    "name": "SS40 NETWORK PRIVATE LIMITED",
                    "url": "https://www.ss40network.com"
                },
                "description": "Industry-aligned software development and AI engineering practical training and academic capstone project development programs."
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
            <StudentImpacts impacts={studentImpactRecords} />

            {/* Below the fold */}
            <BestProjects projects={studentProjects} />
            <Placements />
            <Collaborations logos={academicLogos} />
            <Collaborate />
        </div>
    );
}
