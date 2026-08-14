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
            <div className="w-full relative pt-24 pb-8 lg:pt-28 lg:pb-10 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC900]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                    style={{ backgroundImage: 'radial-gradient(#6B9F91 2px, transparent 2px)', backgroundSize: '40px 40px' }}
                />

                <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                    <div className="w-full flex justify-center mb-6">
                        <Link href="/academics" className="flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Academics
                        </Link>
                    </div>

                    <div className="flex items-center justify-center mb-4">
                        <span className="px-5 py-1.5 bg-gray-50 text-[#6B9F91] text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-gray-100">
                            Student Projects
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl border-transparent lg:text-5xl font-bold text-[var(--color-heading)] mb-4 leading-tight tracking-tight">
                        Student work built through practical learning.
                    </h1>
                </Container>
            </div>

            {/* List and Tabs Section */}
            <div className="bg-[#EDF5F2] w-full pt-8 pb-16 lg:pt-12 lg:pb-24">
                <Container className="max-w-7xl">
                    <StudentProjectsList initialProjects={projects} />
                </Container>
            </div>
        </div>
    );
}
