import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, ExternalLink, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";

export const revalidate = 0;

interface ClientProjectPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ClientProjectPageProps): Promise<Metadata> {
    const { id } = await params;
    const project = await prisma.clientProject.findUnique({
        where: { id }
    }).catch(() => null);

    if (!project) {
        return {
            title: "Project Not Found | SS40 NETWORK PRIVATE LIMITED",
        };
    }

    return {
        title: `${project.title} | SS40 NETWORK PRIVATE LIMITED`,
        description: project.description || `Enterprise software and digital solutions delivered by SS40 NETWORK PRIVATE LIMITED in ${project.industry || 'technology'}.`,
        alternates: {
            canonical: `https://ss40network.com/client-projects/${id}`,
        },
    };
}

export default async function ClientProjectDetailPage({ params }: ClientProjectPageProps) {
    const { id } = await params;
    const project = await prisma.clientProject.findUnique({
        where: { id }
    }).catch(() => null);

    if (!project || !project.isActive) {
        notFound();
    }

    const tags = Array.isArray(project.tags)
        ? (project.tags as string[])
        : typeof project.tags === "string"
        ? JSON.parse(project.tags || "[]")
        : [];

    return (
        <div className="w-full flex-col flex bg-white min-h-screen">
            {/* Header Hero */}
            <div className="w-full relative pt-24 pb-12 lg:pt-28 lg:pb-16 overflow-hidden bg-[#D8E8E2]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />

                <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                    <div className="w-full flex justify-center mb-6">
                        <Link
                            href="/client-projects"
                            className="flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to All Projects
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-4 py-1 bg-white text-[#6B9F91] text-xs font-bold uppercase tracking-widest rounded-full shadow-sm border border-[#6B9F91]/10">
                            {project.industry}
                        </span>
                        {project.isConfidential && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full flex items-center gap-1">
                                <Lock className="w-3 h-3 text-gray-500" />
                                NDA Protected
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111827] mb-4 leading-tight tracking-tight">
                        {project.title}
                    </h1>

                    <p className="text-base md:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
                        {project.description}
                    </p>
                </Container>
            </div>

            {/* Project Content Body */}
            <Container className="py-12 lg:py-16 max-w-5xl">
                <div className="bg-white rounded-3xl border border-gray-200/80 shadow-lg overflow-hidden">
                    {/* Visual Media */}
                    <div className="relative w-full aspect-video sm:aspect-[21/9] bg-gray-900 overflow-hidden flex items-center justify-center">
                        {project.imageUrl && !project.isConfidential ? (
                            <Image
                                src={project.imageUrl}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-8">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white mb-3">
                                    <Building2 className="w-8 h-8 text-[#6B9F91]" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                                <p className="text-sm text-gray-300 max-w-md">
                                    {project.isConfidential
                                        ? "Enterprise Proprietary Architecture (NDA Protected)"
                                        : project.industry}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Metadata & Case Study */}
                    <div className="p-6 sm:p-8 lg:p-12 space-y-8">
                        {tags.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Technologies & Domains
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-[#D8E8E2] text-[#1F3D35] text-xs font-semibold rounded-lg border border-[#6B9F91]/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {project.caseStudy && (
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                    Case Study & Impact
                                </h4>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-[#4B5563] leading-relaxed whitespace-pre-line">
                                    {project.caseStudy}
                                </div>
                            </div>
                        )}

                        {project.projectUrl && !project.isConfidential && (
                            <div className="pt-4 border-t border-gray-100">
                                <a
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#6B9F91] hover:bg-[#588478] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg"
                                >
                                    Visit Live Solution
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}
