"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Lock, ShieldCheck, CheckCircle2, X } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { slideUp, staggerContainer, hoverLift } from "@/lib/animations";

// Mock structural classes deleted: dynamic API is now the source of truth
import { Loader2 } from "lucide-react";

export function ClientProjects() {
    const [projects, setProjects] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [activeModalProject, setActiveModalProject] = React.useState<any | null>(null);

    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        fetch('/api/client-projects')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProjects(data.data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const scrollToMobileProject = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".client-project-mobile-card");
        const card = mobileCards[idx];
        if (!card) return;

        card.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
        });
    };

    React.useEffect(() => {
        const mobileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveMobileIdx(Number(entry.target.getAttribute("data-mobile-id")));
                }
            });
        }, { root: mobileScrollRef.current, threshold: 0.6 });

        if (mobileScrollRef.current) {
            const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".client-project-mobile-card");
            mobileCards.forEach(c => mobileObserver.observe(c));
            requestAnimationFrame(() => {
                mobileCards[0]?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
            });
        }

        return () => {
            mobileObserver.disconnect();
        };
    }, []);

    return (
        <SectionWrapper id="featured-projects" className="bg-[#EDF5F2] overflow-visible">
            <Container className="space-y-12 lg:space-y-16">

                {/* Section Header */}
                <SectionHeading
                    badge="Client Projects"
                    title="Solutions That Drive Business Growth"
                    description="Explore a selection of digital solutions developed to solve real business challenges across different industries."
                />

                <div className="hidden lg:flex flex-col gap-8 lg:gap-12">
                    {isLoading ? (
                        <div className="py-20 flex justify-center items-center opacity-50">
                            <Loader2 className="w-8 h-8 animate-spin text-[#6B9F91]" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="py-20 flex justify-center items-center">
                            <p className="text-gray-500">No client projects available at this time.</p>
                        </div>
                    ) : (
                        <>
                            {(() => {
                                const displayedProjects = projects.slice(0, 4);
                                const featuredProject = displayedProjects[0];
                                const additionalProjects = displayedProjects.slice(1);

                                return (
                                    <>
                                        {/* Featured Project */}
                                        <motion.div
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-100px" }}
                                            variants={slideUp}
                                            className="w-full bg-white border border-[var(--color-border)] rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col lg:flex-row group"
                                        >
                                            {/* Featured Visual */}
                                            <div className="w-full lg:w-3/5 aspect-video lg:aspect-auto bg-gray-100 relative overflow-hidden flex items-center justify-center shrink-0 min-h-[300px]">
                                                {featuredProject.isConfidential ? (
                                                    <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-6 select-none opacity-80 backdrop-blur-md">
                                                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-4">
                                                            <Lock className="w-8 h-8" />
                                                        </div>
                                                        <h4 className="font-bold text-gray-700 text-sm mb-1 uppercase tracking-wider">Confidential Project</h4>
                                                        <p className="text-xs text-gray-500">Visuals protected under corporate NDA.</p>
                                                    </div>
                                                ) : featuredProject.imageUrl ? (
                                                    <img src={featuredProject.imageUrl} alt={featuredProject.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-[#6B9F91]/5 flex flex-col p-6 lg:p-10 gap-4 group-hover:scale-105 transition-transform duration-700 ease-out">
                                                        <div className="w-full flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-sm">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-[#6B9F91]/20" />
                                                                <div className="w-32 h-3 bg-gray-200 rounded-full" />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4 flex-1">
                                                            <div className="w-1/4 h-full bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
                                                                <div className="w-full h-8 bg-gray-100 rounded-md" />
                                                                <div className="w-2/3 h-8 bg-gray-100 rounded-md" />
                                                            </div>
                                                            <div className="flex-1 h-full bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm p-4 grid grid-cols-2 gap-4">
                                                                <div className="bg-[#6B9F91]/10 rounded-lg" />
                                                                <div className="bg-gray-100 rounded-lg" />
                                                                <div className="bg-gray-100 rounded-lg col-span-2" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold text-gray-800 shadow-xl flex items-center gap-2">
                                                        <ImageIcon className="w-4 h-4 text-gray-500" />
                                                        Project Visual Preview
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Featured Content Area */}
                                            <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-white relative z-10 border-l border-gray-100">
                                                <div className="flex items-center justify-between gap-4 mb-4">
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap">
                                                        {featuredProject.industry}
                                                    </span>
                                                    {featuredProject.status && (
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            {featuredProject.status}
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)] mb-4 leading-tight">
                                                    {featuredProject.title}
                                                </h3>

                                                <p className="text-[var(--color-body-text)] mb-8 leading-relaxed line-clamp-4">
                                                    {featuredProject.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mb-10">
                                                    {Array.isArray(featuredProject.tags) && featuredProject.tags.slice(0, 4).map((tag: any, idx: number) => (
                                                        <span key={idx} className="px-3 py-1.5 bg-[#6B9F91]/10 text-[#6B9F91] rounded-lg text-xs font-semibold">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="mt-auto pt-4">
                                                    <Button onClick={() => setActiveModalProject(featuredProject)} size="lg" className="w-full sm:w-auto bg-[#6B9F91] hover:bg-[#588478] text-white shadow-lg shadow-[#6B9F91]/20">
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                        {/* Additional Projects Grid */}
                                        {
                                            additionalProjects.length > 0 && (
                                                <motion.div
                                                    variants={staggerContainer}
                                                    initial="hidden"
                                                    whileInView="visible"
                                                    viewport={{ once: true, margin: "-100px" }}
                                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-2"
                                                >
                                                    {additionalProjects.map((project: any) => (
                                                        <CardMotion
                                                            key={project.id}
                                                            variants={slideUp}
                                                            {...hoverLift}
                                                            className="bg-white overflow-hidden rounded-2xl flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/30 transition-all duration-300 flex"
                                                        >
                                                            {/* Grid Visual Placeholder */}
                                                            <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center border-b border-gray-100">
                                                                {project.isConfidential ? (
                                                                    <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-6 select-none opacity-80 backdrop-blur-md">
                                                                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-4">
                                                                            <Lock className="w-8 h-8" />
                                                                        </div>
                                                                        <h4 className="font-bold text-gray-700 text-sm mb-1 uppercase tracking-wider">Confidential Project</h4>
                                                                        <p className="text-xs text-gray-500">Visuals protected under corporate NDA.</p>
                                                                    </div>
                                                                ) : project.imageUrl ? (
                                                                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col p-4 gap-3 bg-[#6B9F91]/5 group-hover:scale-105 transition-transform duration-500">
                                                                        <div className="w-full h-1/2 flex gap-3">
                                                                            <div className="w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm" />
                                                                            <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm" />
                                                                        </div>
                                                                        <div className="w-full h-1/2 bg-white border border-gray-200 rounded-lg shadow-sm" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Grid Content Area */}
                                                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                                                <div className="flex items-center justify-between gap-4 mb-4">
                                                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap overflow-hidden text-ellipsis">
                                                                        {project.industry}
                                                                    </span>
                                                                    {project.status && (
                                                                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                                                                            {project.status}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <h3 className="font-bold text-xl text-[var(--color-heading)] leading-tight mb-3">
                                                                    {project.title}
                                                                </h3>

                                                                <p className="text-[var(--color-body-text)] text-sm mb-6 flex-1 line-clamp-3">
                                                                    {project.description}
                                                                </p>

                                                                <div className="flex flex-wrap gap-1.5 mb-8">
                                                                    {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tag: any, idx: number) => (
                                                                        <span key={idx} className="px-2 py-1 bg-[#6B9F91]/10 text-[#6B9F91] rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                    {Array.isArray(project.tags) && project.tags.length > 3 && (
                                                                        <span className="px-2 py-1 bg-[#6B9F91]/5 text-gray-500 rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                                                                            +{project.tags.length - 3}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <button
                                                                    onClick={() => setActiveModalProject(project)}
                                                                    className="mt-auto flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] rounded-sm"
                                                                >
                                                                    View Details
                                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                                </button>
                                                            </div>
                                                        </CardMotion>
                                                    ))}
                                                </motion.div>
                                            )
                                        }

                                        {/* The View All Projects button is now unified below the desktop/mobile structures */}
                                    </>
                                );
                            })()}
                        </>
                    )}
                </div>

                {/* Mobile Native Horizontal Swipe Deck */}
                <div className="flex flex-col lg:hidden relative overflow-visible -mx-6">
                    <div
                        ref={mobileScrollRef}
                        className="flex w-full overflow-x-auto snap-x snap-mandatory pb-8 gap-5 items-stretch [&::-webkit-scrollbar]:hidden px-6"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {(!isLoading && projects.length > 0) && (() => {
                            const displayedProjects = projects.slice(0, 4);
                            return displayedProjects.map((project: any, idx: number) => (
                                <div
                                    key={`mobile-proj-${project.id}`}
                                    data-mobile-id={idx}
                                    className="client-project-mobile-card w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 snap-center relative scroll-ml-6"
                                >
                                    {/* Visual Placeholder Area */}
                                    <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center border-b border-gray-100">
                                        {project.isConfidential ? (
                                            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-6 select-none opacity-80 backdrop-blur-md">
                                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-3">
                                                    <Lock className="w-6 h-6" />
                                                </div>
                                                <h4 className="font-bold text-gray-700 text-xs mb-1 uppercase tracking-wider">Confidential</h4>
                                            </div>
                                        ) : project.imageUrl ? (
                                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col p-4 gap-3 bg-[#6B9F91]/5">
                                                <div className="w-full h-1/2 flex gap-3">
                                                    <div className="w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm" />
                                                    <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm" />
                                                </div>
                                                <div className="w-full h-1/2 bg-white border border-gray-200 rounded-lg shadow-sm" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Card Content */}
                                    <div className="p-6 flex flex-col flex-1 text-left relative z-10">
                                        <span className="w-max px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap mb-4">
                                            {project.industry}
                                        </span>

                                        <h3 className="font-bold text-xl text-[var(--color-heading)] leading-tight mb-2 tracking-tight">
                                            {project.title}
                                        </h3>

                                        <div className="flex-1 min-h-0 relative mb-5">
                                            <p className="text-[var(--color-body-text)] text-sm leading-relaxed overflow-hidden line-clamp-3">
                                                {project.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setActiveModalProject(project)}
                                            className="mt-auto flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] rounded-sm"
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </button>
                                    </div>
                                </div>
                            ));
                        })()}
                        {/* End spacer so the last card doesn't hit the right screen edge */}
                        <div className="w-[4vw] shrink-0" />
                    </div>

                    {/* Pagination Dots representation */}
                    <div className="w-full flex justify-center items-center gap-3 mt-2 mb-8 z-10 relative">
                        {(!isLoading && projects.length > 0) && projects.slice(0, 4).map((_, i) => (
                            <button
                                key={`dot-${i}`}
                                onClick={() => scrollToMobileProject(i)}
                                aria-label={`Scroll to project ${i + 1}`}
                                className={`h-2.5 rounded-full transition-all duration-400 ease-out ${activeMobileIdx === i ? 'bg-[#6B9F91] w-8 shadow-sm scale-100' : 'bg-gray-300 w-2.5 hover:bg-gray-400 scale-90'} border-none cursor-pointer focus:outline-none`}
                            />
                        ))}
                    </div>
                </div>

                {/* View All Projects Button */}
                {projects.length > 0 && (
                    <div className="w-full flex justify-center mt-2 mb-10">
                        <Link href="/client-projects" className="inline-flex items-center justify-center font-bold text-lg text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            View All Projects
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}

                {/* Bottom CTA Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex justify-center mt-12"
                >
                    <div className="w-full max-w-4xl bg-gray-50 border border-[var(--color-border)] rounded-3xl p-10 md:p-14 text-center relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6B9F91]/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFC900]/10 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />

                        <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)] mb-3 relative z-10 tracking-tight">
                            Have a project in mind?
                        </h3>
                        <p className="text-[var(--color-body-text)] mb-8 relative z-10 max-w-lg">
                            Let's create a digital solution tailored to your business.
                        </p>
                        <Button asChild size="lg" className="relative z-10 shadow-lg shadow-[#6B9F91]/20 bg-[#6B9F91] hover:bg-[#588478] text-white">
                            <Link href="/contact">
                                Start Your Project
                            </Link>
                        </Button>
                    </div>
                </motion.div>

            </Container>

            {/* View Details Reading Modal overlay */}
            <AnimatePresence>
                {activeModalProject && (
                    <ProjectModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
                )}
            </AnimatePresence>
        </SectionWrapper >
    );
}

// ============================================================================
// MODAL COMPONENT (Reuses SuccessStories interaction pattern)
// ============================================================================

function ProjectModal({ project, onClose }: { project: any, onClose: () => void }) {
    // Lock body scroll when modal is open
    React.useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalStyle;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Parse tags safely from CMS JSON payload
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh] md:max-h-[85vh]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center transition-colors z-10 focus-visible:outline-none"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content Area */}
                <div
                    className="overflow-y-auto px-6 py-8 md:px-10 md:py-10 flex flex-col h-full [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >

                    {/* 1. Industry */}
                    <div className="flex items-center gap-2 pr-12 mb-4">
                        <span className="px-3 py-1 bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md whitespace-nowrap">
                            {project.industry}
                        </span>
                        {project.status && (
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#6B9F91] uppercase tracking-wider whitespace-nowrap">
                                <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                {project.status}
                            </span>
                        )}
                    </div>

                    {/* 2. Project Title */}
                    <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[var(--color-heading)] leading-tight tracking-tight mb-4 pr-6">
                        {project.title}
                    </h2>

                    {/* 3. Short Description */}
                    <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed mb-6">
                        {project.description}
                    </p>

                    {/* 4. Technologies / Tags */}
                    {parsedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {parsedTags.map((tag, idx) => (
                                <span key={idx} className="px-2.5 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 5. Visit Live Project (Primary CTA, top level before scroll needs) */}
                    {project.projectUrl ? (
                        <div className="mb-10 shrink-0">
                            <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#6B9F91] text-white font-bold shadow-lg shadow-[#6B9F91]/20 hover:bg-[#588478] transition-all hover:scale-105 active:scale-95"
                            >
                                Visit Live Project
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                        </div>
                    ) : (
                        <div className="mb-10 shrink-0" /> // Spacer if no URL
                    )}

                    {/* 6. Case Study */}
                    {project.caseStudy && (
                        <div className="border-t border-gray-100 pt-8 mt-2 flex-grow">
                            <h3 className="text-xl font-bold text-[var(--color-heading)] mb-6">
                                Case Study Overview
                            </h3>
                            <div className="prose prose-sm md:prose-base prose-[#6B9F91] max-w-none text-[var(--color-body-text)]">
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {project.caseStudy}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
