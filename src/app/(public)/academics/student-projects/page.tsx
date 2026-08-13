import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { StudentProjectsList } from "./StudentProjectsList";

export const revalidate = 0; // Dynamic route

export default async function AllStudentProjectsPage() {
    // We already fetch Server-Side using Prisma securely and quickly! No empty API needed.
    const projects = await prisma.studentProject.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });

    return (
        <div className="w-full flex-col flex bg-white min-h-screen">
            {/* Hero / Header Section designed natively for SS40 NETWORK Academics */}
            <div className="w-full relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC900]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                    style={{ backgroundImage: 'radial-gradient(#6B9F91 2px, transparent 2px)', backgroundSize: '40px 40px' }}
                />

                <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                    <div className="w-full flex justify-center mb-8">
                        <Link href="/academics" className="flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Academics
                        </Link>
                    </div>

                    <div className="flex items-center justify-center mb-6">
                        <span className="px-5 py-2 bg-gray-50 text-[#6B9F91] text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-gray-100">
                            BEST STUDENT PROJECTS
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl border-transparent lg:text-5xl font-bold text-[var(--color-heading)] mb-6 leading-tight tracking-tight">
                        Ideas Built Into <span className="text-[#6B9F91]">Reality.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--color-body-text)] max-w-2xl mx-auto leading-relaxed">
                        Explore innovative projects created by students through hands-on learning, mentorship, and real-world challenges.
                    </p>
                </Container>
            </div>

            {/* List and Tabs Section */}
            <div className="bg-[#EDF5F2] w-full pt-12 pb-24">
                <Container className="max-w-7xl">
                    <StudentProjectsList initialProjects={projects} />
                </Container>
            </div>
        </div>
    );
}
