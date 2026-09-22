import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { BlogsList } from "./BlogsList";

export const metadata: Metadata = {
    title: "Blogs and Field Updates | SS40 NETWORK PRIVATE LIMITED",
    description: "Explore government official dialogues, academic MoUs, industry visits, conclaves, and founder activities by SS40 NETWORK PRIVATE LIMITED.",
    alternates: {
        canonical: "https://www.ss40network.com/blogs",
    },
    openGraph: {
        title: "Blogs and Field Updates | SS40 NETWORK PRIVATE LIMITED",
        description: "Explore government official dialogues, academic MoUs, industry visits, conclaves, and founder activities by SS40 NETWORK PRIVATE LIMITED.",
        url: "https://www.ss40network.com/blogs",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Blogs and Field Updates — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blogs and Field Updates | SS40 NETWORK PRIVATE LIMITED",
        description: "Explore government official dialogues, academic MoUs, industry visits, conclaves, and founder activities by SS40 NETWORK PRIVATE LIMITED.",
        images: ["https://www.ss40network.com/og-image.jpg"],
    },
};

export const revalidate = 0; // Dynamic route

export default async function AllBlogsPage() {
    // Fetch all active activity posts with safe fallback
    const activities = await prisma.activityPost.findMany({
        where: {
            isActive: true
        },
        orderBy: [{ sortOrder: 'asc' }, { activityDate: 'desc' }, { createdAt: 'desc' }]
    }).catch(() => []);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Blogs and Field Updates",
        "description": "Explore government official dialogues, academic MoUs, industry visits, conclaves, and founder activities by SS40 NETWORK PRIVATE LIMITED.",
        "url": "https://www.ss40network.com/blogs",
        "publisher": {
            "@type": "Organization",
            "name": "SS40 NETWORK PRIVATE LIMITED"
        }
    };

    return (
        <div className="w-full bg-[#FAFAF9] min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Premium Header Banner */}
            <div className="w-full bg-[#D8E8E2] pt-28 pb-12 md:pt-36 md:pb-16 relative overflow-hidden border-b border-gray-200/80">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
                />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />

                <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                    <div className="w-full flex justify-center mb-6">
                        <Link href="/#activities" className="flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                        <span className="px-5 py-1.5 bg-white text-[#6B9F91] text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-[#6B9F91]/10 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Blogs and Field Updates
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111827] mb-4 leading-tight tracking-tight font-serif">
                        Moments That Shape Our Impact
                    </h1>

                    <p className="text-base md:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
                        Discover the field visits, official dialogues, institutional partnerships, and founder initiatives driving technology empowerment in southern districts.
                    </p>
                </Container>
            </div>

            {/* Blogs List Section */}
            <Container className="pt-8 pb-16 lg:pt-12 lg:pb-24 max-w-7xl">
                <BlogsList initialActivities={activities} />
            </Container>
        </div>
    );
}
