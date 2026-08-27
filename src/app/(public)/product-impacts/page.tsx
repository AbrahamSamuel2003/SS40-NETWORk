import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { HappimonialsList } from "../happimonials/HappimonialsList";

export const metadata: Metadata = {
    title: "Product Impacts | SS40 NETWORK PRIVATE LIMITED",
    description: "Read comprehensive client success stories and enterprise impacts from organizations leveraging products by SS40 NETWORK PRIVATE LIMITED.",
    alternates: {
        canonical: "https://www.ss40network.com/product-impacts",
    },
    openGraph: {
        title: "Product Impacts | SS40 NETWORK PRIVATE LIMITED",
        description: "Read comprehensive client success stories and enterprise impacts from organizations leveraging products by SS40 NETWORK PRIVATE LIMITED.",
        url: "https://www.ss40network.com/product-impacts",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Product Impacts — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Product Impacts | SS40 NETWORK PRIVATE LIMITED",
        description: "Read comprehensive client success stories and enterprise impacts from organizations leveraging products by SS40 NETWORK PRIVATE LIMITED.",
        images: ["https://www.ss40network.com/og-image.jpg"],
    },
};

export const revalidate = 0; // Dynamic route

export default async function ProductImpactsPage() {
    // Fetch Server-Side using Prisma securely
    const stories = await prisma.happimonial.findMany({
        where: {
            isActive: true,
            pageScope: 'PRODUCTS'
        },
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
                        "name": "Products",
                        "item": "https://www.ss40network.com/products"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Product Impacts",
                        "item": "https://www.ss40network.com/product-impacts"
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
            <div className="w-full relative pt-24 pb-8 lg:pt-28 lg:pb-10 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC900]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />

                <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                    <div className="w-full flex justify-center mb-6">
                        <Link href="/products#product-impacts" className="flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Products
                        </Link>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                        <span className="px-5 py-1.5 bg-white text-[#6B9F91] text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-[#6B9F91]/10">
                            Product Impacts
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl border-transparent lg:text-5xl font-bold text-[var(--color-heading)] mb-4 leading-tight tracking-tight">
                        Real Stories. Real Business Impact.
                    </h1>
                </Container>
            </div>

            {/* List Section */}
            <Container className="pt-8 pb-16 lg:pt-12 lg:pb-24 max-w-7xl">
                <HappimonialsList initialStories={stories} />
            </Container>
        </div>
    );
}
