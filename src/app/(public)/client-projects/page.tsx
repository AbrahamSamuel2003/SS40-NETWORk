import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { ClientProjectsList } from "./ClientProjectsList";

export const metadata: Metadata = {
    title: "Client Projects",
    description: "Explore real client projects and digital solutions delivered by SS40 NETWORK.",
};

export const revalidate = 0; // Dynamic route

export default async function AllClientProjectsPage() {
    // We already fetch Server-Side using Prisma securely and quickly! No empty API needed.
    const projects = await prisma.clientProject.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    return (
        <div className="w-full flex-col flex bg-white min-h-screen">
            {/* Hero / Header Section designed natively for SS40 NETWORK */}
            <div className="w-full relative pt-24 pb-8 lg:pt-28 lg:pb-10 overflow-hidden bg-[#EDF5F2]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC900]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />

                <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                    <div className="w-full flex justify-center mb-6">
                        <Link href="/digital-solutions" className="flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Digital Solutions
                        </Link>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                        <span className="px-5 py-1.5 bg-white text-[#6B9F91] text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-[#6B9F91]/10">
                            Client Projects
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl border-transparent lg:text-5xl font-bold text-[var(--color-heading)] mb-4 leading-tight tracking-tight">
                        Solutions That Drive Business Growth
                    </h1>

                    <p className="text-base md:text-lg text-[var(--color-body-text)] max-w-2xl mx-auto leading-relaxed">
                        Explore digital solutions developed for real business challenges.
                    </p>
                </Container>
            </div>

            {/* List and Tabs Section */}
            <Container className="pt-8 pb-16 lg:pt-12 lg:pb-24 max-w-7xl">
                <ClientProjectsList initialProjects={projects} />
            </Container>
        </div>
    );
}
