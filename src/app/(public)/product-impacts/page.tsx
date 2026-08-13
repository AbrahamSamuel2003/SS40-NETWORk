import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { HappimonialsList } from "../happimonials/HappimonialsList";

export const metadata: Metadata = {
    title: "Product Impacts & Success Stories | SS40 NETWORK",
    description: "Read comprehensive success stories from organizations leveraging SS40 NETWORK products.",
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

    return (
        <div className="w-full flex-col flex bg-white min-h-screen">
            {/* Hero / Header Section designed natively for SS40 NETWORK */}
            <div className="w-full relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC900]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />

                <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                    <div className="w-full flex justify-center mb-8">
                        <Link href="/products" className="flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Products
                        </Link>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                        <span className="px-5 py-2 bg-white text-[#6B9F91] text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-[#6B9F91]/10">
                            Product Impacts
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl border-transparent lg:text-5xl font-bold text-[var(--color-heading)] mb-6 leading-tight tracking-tight">
                        Real Businesses. Real Product Success.
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--color-body-text)] max-w-2xl mx-auto leading-relaxed">
                        Discover how organizations across various industries have transformed their operations and achieved incredible results using SS40 NETWORK products.
                    </p>
                </Container>
            </div>

            {/* List Section */}
            <Container className="py-16 lg:py-24 max-w-7xl">
                <HappimonialsList initialStories={stories} />
            </Container>
        </div>
    );
}
