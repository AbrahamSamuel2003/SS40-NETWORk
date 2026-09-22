import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { HappimonialsList } from "./HappimonialsList";

export const metadata: Metadata = {
    title: "Happimonials | SS40 NETWORK PRIVATE LIMITED",
    description: "Read verified client testimonials and software development success stories delivered by SS40 NETWORK PRIVATE LIMITED.",
    alternates: {
        canonical: "https://www.ss40network.com/happimonials",
    },
    openGraph: {
        title: "Happimonials | SS40 NETWORK PRIVATE LIMITED",
        description: "Read verified client testimonials and software development success stories delivered by SS40 NETWORK PRIVATE LIMITED.",
        url: "https://www.ss40network.com/happimonials",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Happimonials — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Happimonials | SS40 NETWORK PRIVATE LIMITED",
        description: "Read verified client testimonials and software development success stories delivered by SS40 NETWORK PRIVATE LIMITED.",
        images: ["https://www.ss40network.com/og-image.jpg"],
    },
};

export const revalidate = 0; // Dynamic route

export default async function AllHappimonialsPage() {
    // Fetch Server-Side using Prisma securely
    const stories = await prisma.happimonial.findMany({
        where: {
            isActive: true,
            pageScope: 'DIGITAL_SOLUTIONS'
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    }).catch(() => []);

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
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Happimonials",
                        "item": "https://www.ss40network.com/happimonials"
                    }
                ]
            }
        ]
    };

    return (
        <div className="w-full flex-col flex bg-white min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero / Header Section designed natively for SS40 NETWORK */}
            <div className="w-full relative pt-24 pb-8 lg:pt-28 lg:pb-10 overflow-hidden bg-[#D8E8E2]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC900]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />

                <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                    <div className="w-full flex justify-center mb-6">
                        <Link href="/digital-solutions#happimonials" className="flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Digital Solutions
                        </Link>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                        <span className="px-5 py-1.5 bg-white text-[#6B9F91] text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-[#6B9F91]/10">
                            Happimonials
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl border-transparent lg:text-5xl font-bold text-[var(--color-heading)] mb-4 leading-tight tracking-tight font-serif">
                        Real Businesses. Real Success Stories.
                    </h1>

                    <p className="text-base md:text-lg text-[var(--color-body-text)] max-w-2xl mx-auto leading-relaxed">
                        Read verified feedback and success stories from companies that built their future with SS40 NETWORK.
                    </p>
                </Container>
            </div>

            {/* List and Tabs Section */}
            <Container className="pt-8 pb-16 lg:pt-12 lg:pb-24 max-w-7xl">
                <HappimonialsList initialStories={stories} />
            </Container>
        </div>
    );
}
