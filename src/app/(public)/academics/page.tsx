import { Hero } from "@/components/academics/Hero";
import { StudentImpacts } from "@/components/academics/StudentImpacts";
import { BestProjects } from "@/components/academics/BestProjects";
import { Placements } from "@/components/academics/Placements";
import { Collaborations } from "@/components/academics/Collaborations";
import { Collaborate } from "@/components/academics/Collaborate";
import { prisma } from "@/lib/prisma";
import { getSiteConfig, isSectionVisible } from "@/lib/site-config";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Academics | SS40 NETWORK",
    description: "Industry-grade tech training, software engineering internships, live client sprints, and placement prep at SS40 NETWORK.",
    alternates: {
        canonical: "https://ss40network.com/academics",
    },
    openGraph: {
        title: "Academics | SS40 NETWORK",
        description: "Industry-grade tech training, software engineering internships, live client sprints, and placement prep at SS40 NETWORK.",
        url: "https://ss40network.com/academics",
        siteName: "SS40 NETWORK",
        type: "website",
        images: [
            {
                url: "https://ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Academics — SS40 NETWORK",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Academics | SS40 NETWORK",
        description: "Industry-grade tech training, software engineering internships, live client sprints, and placement prep at SS40 NETWORK.",
        images: ["https://ss40network.com/og-image.jpg"],
    },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AcademicsPage() {
    const [config, studentProjects, studentImpactRecords, academicLogos] = await Promise.all([
        getSiteConfig(),
        prisma.studentProject.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
        }).catch(() => []),
        prisma.studentImpact.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
        }).catch(() => []),
        prisma.organizationLogo.findMany({
            where: { pageScope: 'ACADEMICS', isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
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
                        "name": "Academics",
                        "item": "https://ss40network.com/academics"
                    }
                ]
            },
            {
                "@type": "EducationalOrganization",
                "@id": "https://ss40network.com/academics#organization",
                "name": "SS40 NETWORK PRIVATE LIMITED Academics",
                "parentOrganization": {
                    "@type": "Organization",
                    "name": "SS40 NETWORK PRIVATE LIMITED",
                    "url": "https://ss40network.com"
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
            {isSectionVisible(config, 'academics_studentImpacts') && (
                <StudentImpacts impacts={studentImpactRecords} />
            )}

            {/* Below the fold */}
            {isSectionVisible(config, 'academics_studentProjects') && (
                <BestProjects projects={studentProjects} />
            )}
            <Placements />
            {isSectionVisible(config, 'academics_logos') && (
                <div className="cv-auto">
                    <Collaborations logos={academicLogos} />
                </div>
            )}
            <div className="cv-auto">
                <Collaborate />
            </div>
        </div>
    );
}
