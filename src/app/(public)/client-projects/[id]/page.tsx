import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";

export const revalidate = 0; // Dynamic route to ensure fresh CMS data

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ClientProjectCaseStudyPage({ params }: PageProps) {
    const { id } = await params;

    const project = await prisma.clientProject.findUnique({
        where: {
            id: id,
            isActive: true
        }
    });

    if (!project) {
        notFound();
    }

    // Parse tags since it's stored as JSON string from admin array
    let parsedTags: string[] = [];
    try {
        if (project.tags && typeof project.tags === 'string') {
            parsedTags = JSON.parse(project.tags);
        } else if (Array.isArray(project.tags)) {
            parsedTags = project.tags as string[];
        }
    } catch {
        parsedTags = [];
    }

    return (
        <div className="w-full flex-col flex bg-white min-h-screen">
            {/* Hero Section */}
            <div className="w-full relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-[#EDF5F2]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B9F91]/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFC900]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />

                <Container className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                    <div className="w-full flex justify-center mb-8">
                        <Link href="/digital-solutions" className="flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Digital Solutions
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-white text-gray-700 text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
                            {project.industry}
                        </span>
                        {project.isConfidential && (
                            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Confidential
                            </span>
                        )}
                        {project.status && (
                            <div className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#6B9F91] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {project.status}
                            </div>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-heading)] mb-6 leading-tight tracking-tight">
                        {project.title}
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--color-body-text)] max-w-3xl leading-relaxed mb-10">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {parsedTags.map((tag, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-[#6B9F91]/10 text-[#6B9F91] rounded-lg text-xs font-semibold">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {project.projectUrl && (
                        <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#6B9F91] text-white font-bold shadow-lg shadow-[#6B9F91]/20 hover:bg-[#588478] transition-all hover:scale-105 active:scale-95"
                        >
                            View Live Project
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    )}
                </Container>
            </div>

            {/* Main Content Area */}
            <Container className="py-16 lg:py-24 max-w-5xl">
                {/* Visual Header */}
                {!project.isConfidential && project.imageUrl && (
                    <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-16 lg:mb-24 relative border border-gray-100 bg-gray-50">
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {project.isConfidential && !project.imageUrl && (
                    <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-xl mb-16 lg:mb-24 relative border border-gray-100 bg-gray-50 flex flex-col items-center justify-center">
                        <ShieldCheck className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">Visuals protected under corporate NDA.</p>
                    </div>
                )}

                {/* Case Study Body */}
                {project.caseStudy ? (
                    <div className="w-full max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-[var(--color-heading)] mb-8">
                            Case Study Overview
                        </h2>
                        <div className="prose prose-lg prose-[#6B9F91] max-w-none text-[var(--color-body-text)]">
                            {/* Render case study text with preserved whitespace for newlines */}
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {project.caseStudy}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl mx-auto text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <ShieldCheck className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Detailed Case Study Restricted</h3>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto">
                            The full implementation details and case study for this project are currently unavailable or protected.
                        </p>
                    </div>
                )}
            </Container>

            {/* CTA Section */}
            <div className="w-full bg-[#111] py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                <Container className="relative z-10 flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to build your solution?
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg">
                        Let's collaborate to solve your most complex operational and digital challenges using proven technologies.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-gray-900 font-bold shadow-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
                    >
                        Schedule a Consultation
                        <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                    </Link>
                </Container>
            </div>
        </div>
    );
}
