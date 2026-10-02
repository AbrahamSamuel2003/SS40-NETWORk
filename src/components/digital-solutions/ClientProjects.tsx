"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
    ArrowRight, 
    Lock, 
    CheckCircle2, 
    X, 
    ExternalLink, 
    BadgeCheck, 
    Layers, 
    Globe, 
    ShieldCheck, 
    ChevronLeft, 
    ChevronRight,
    Cpu
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

interface ClientProjectsProps {
    initialData?: any[];
}

export function ClientProjects({ initialData }: ClientProjectsProps = {}) {
    const [projects, setProjects] = React.useState<any[]>(Array.isArray(initialData) ? initialData : []);
    const [isLoading, setIsLoading] = React.useState(!initialData || (Array.isArray(initialData) && initialData.length === 0));
    const [activeTab, setActiveTab] = React.useState(0);
    const [activeModalProject, setActiveModalProject] = React.useState<any | null>(null);
    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (initialData && Array.isArray(initialData) && initialData.length > 0) {
            setProjects(initialData);
            setIsLoading(false);
            return;
        }

        fetch('/api/client-projects')
            .then(res => res.json())
            .then(data => {
                if (data && data.success && Array.isArray(data.data)) {
                    setProjects(data.data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [initialData]);

    const displayedProjects = React.useMemo(() => {
        const safe = Array.isArray(projects) ? projects.filter(p => p && p.isActive !== false) : [];
        const seen = new Set<string>();
        return safe.filter(p => {
            const key = String(p.title || p.id).trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [projects]);

    const scrollToMobileProject = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const container = mobileScrollRef.current;
        const cardWidth = container.clientWidth * 0.85 + 16;
        container.scrollTo({
            left: idx * cardWidth,
            behavior: "smooth"
        });
    };

    if (isLoading || displayedProjects.length === 0) {
        return (
            <SectionWrapper id="client-projects" className="bg-[#D8E8E2] overflow-visible scroll-mt-24 py-8 sm:py-12 lg:py-14">
                <Container className="space-y-8 lg:space-y-12 max-w-6xl">
                    <SectionHeading
                        badge="CLIENT PROJECTS"
                        title={<>Solutions That Drive <span className="text-[#0F766E]">Business Growth.</span></>}
                        description="Explore enterprise digital solutions engineered to automate operations, scale workflows, and eliminate bottlenecks."
                        align="center"
                    />
                    <CardGridSkeleton count={3} columns={3} />
                </Container>
            </SectionWrapper>
        );
    }

    const currentProject = displayedProjects[activeTab] || displayedProjects[0];
    const tags = Array.isArray(currentProject?.tags) ? currentProject.tags : [];

    return (
        <SectionWrapper id="client-projects" className="bg-[#D8E8E2] scroll-mt-24 relative overflow-hidden py-10 sm:py-14 lg:py-16">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none -z-0" />

            <Container className="flex flex-col gap-6 sm:gap-8 lg:gap-10 relative z-10 max-w-6xl">
                
                {/* 1. Header Section */}
                <SectionHeading
                    badge="CLIENT PROJECTS"
                    title={<>Enterprise Solutions Built for <span className="text-[#0F766E]">Real Scale.</span></>}
                    description="Explore custom software architectures, automation platforms, and digital systems engineered for high-growth businesses."
                    align="center"
                />

                {/* 2. Interactive Project Switcher Tabs (Desktop & Tablet) */}
                {displayedProjects.length > 1 && (
                    <div className="hidden sm:flex w-full justify-center">
                        <div className="inline-flex flex-wrap items-center justify-center p-1 sm:p-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200/80 shadow-sm gap-1.5 max-w-full">
                            {displayedProjects.map((p, idx) => {
                                const isActive = activeTab === idx;
                                return (
                                    <button
                                        key={p.id || idx}
                                        type="button"
                                        onClick={() => setActiveTab(idx)}
                                        className={cn(
                                            "px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center gap-2 select-none cursor-pointer border",
                                            isActive
                                                ? "bg-[#0F766E] text-white border-[#0F766E] shadow-sm shadow-[#0F766E]/20 ring-1 ring-[#2DD4BF]/40"
                                                : "bg-white text-[#334155] border-transparent hover:border-[#0F766E]/30 hover:bg-white hover:text-[#0F766E]"
                                        )}
                                    >
                                        {p.isConfidential ? (
                                            <Lock className="w-3.5 h-3.5 opacity-80" />
                                        ) : (
                                            <Globe className="w-3.5 h-3.5 opacity-80" />
                                        )}
                                        <span>{p.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. Flagship Showcase Deck (Desktop View) */}
                <div className="hidden sm:block w-full bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/80 shadow-xl relative overflow-hidden">
                    {/* Inner Accent Glow */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#2DD4BF]/15 via-transparent to-transparent rounded-bl-full pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
                        
                        {/* Left Column: Narrative & Technical Specifications */}
                        <div className="lg:col-span-6 flex flex-col justify-center items-start text-left min-h-[300px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentProject?.id || activeTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.22, ease: "easeOut" }}
                                    className="flex flex-col items-start w-full space-y-3.5"
                                >
                                    {/* Industry / Status Pills */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D8E8E2] border border-[#2DD4BF]/40 text-[#0F766E] text-[11px] font-extrabold uppercase tracking-wider shadow-2xs">
                                            <Layers className="w-3 h-3 text-[#0F766E]" />
                                            {currentProject?.industry || "Custom Software"}
                                        </span>

                                        {currentProject?.status && (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                {currentProject.status}
                                            </span>
                                        )}

                                        {currentProject?.isConfidential && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                                                <ShieldCheck className="w-3 h-3 text-amber-600" />
                                                NDA Protected
                                            </span>
                                        )}
                                    </div>

                                    {/* Project Title */}
                                    <h3 className="text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight leading-snug font-serif">
                                        {currentProject?.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                                        {currentProject?.description}
                                    </p>

                                    {/* Tech Stack & Feature Chips */}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {tags.map((tag: string, tIdx: number) => (
                                                <span
                                                    key={tIdx}
                                                    className="px-2.5 py-1 bg-[#F8FAF9] border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
                                                >
                                                    <BadgeCheck className="w-3 h-3 text-[#0F766E]" />
                                                    <span>{tag}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="pt-3 flex flex-wrap items-center gap-3">
                                        <Button
                                            onClick={() => setActiveModalProject(currentProject)}
                                            size="sm"
                                            className="bg-[#0F766E] hover:bg-[#115E59] text-white shadow-md shadow-[#0F766E]/20 rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer"
                                        >
                                            View Full Case Study
                                            <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                                        </Button>

                                        {currentProject?.projectUrl && (
                                            <a
                                                href={currentProject.projectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0F766E] hover:text-[#115E59] hover:underline"
                                            >
                                                <span>Live Application</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right Column: Visual Stage (NDA Graphic or Image Preview) */}
                        <div className="lg:col-span-6 relative flex justify-center items-center min-h-[260px] lg:min-h-[320px] w-full">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentProject?.id || activeTab}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="w-full h-full flex items-center justify-center"
                                >
                                    {currentProject?.isConfidential ? (
                                        <div className="w-full max-w-md aspect-video rounded-2xl bg-gradient-to-br from-gray-900 via-slate-800 to-teal-950 p-6 flex flex-col items-center justify-center text-center text-white shadow-2xl border border-gray-700/50 relative overflow-hidden">
                                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 shadow-inner text-[#2DD4BF]">
                                                <Lock className="w-8 h-8" />
                                            </div>
                                            <h4 className="font-bold text-base text-white mb-1">
                                                Enterprise Confidential Project
                                            </h4>
                                            <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
                                                Architectural schematics and live code repository protected under client non-disclosure agreement.
                                            </p>
                                        </div>
                                    ) : currentProject?.imageUrl ? (
                                        <div 
                                            onClick={() => setActiveModalProject(currentProject)}
                                            className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-100 shadow-2xl relative group/img cursor-pointer"
                                        >
                                            <img
                                                src={currentProject.imageUrl}
                                                alt={currentProject.title}
                                                loading="eager"
                                                decoding="async"
                                                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-gray-900 shadow-lg flex items-center gap-1.5">
                                                    Expand Case Study
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full max-w-md aspect-video rounded-2xl bg-[#D8E8E2]/60 border border-[#2DD4BF]/30 flex flex-col items-center justify-center p-6 text-center text-[#0F766E]">
                                            <Cpu className="w-12 h-12 mb-2 text-[#0F766E] opacity-70" />
                                            <p className="text-xs font-bold">Production System Architecture</p>
                                            <p className="text-[11px] text-gray-600 mt-1">{currentProject?.title}</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>
                </div>

                {/* 4. Mobile Native Swipe Carousel */}
                <div className="block sm:hidden w-full">
                    <div
                        ref={mobileScrollRef}
                        className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-1 [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {displayedProjects.map((project, idx) => (
                            <div
                                key={project.id || idx}
                                className="w-[85vw] shrink-0 snap-center bg-white rounded-2xl p-5 border border-gray-100 shadow-md flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D8E8E2] text-[#0F766E]">
                                            {project.industry || "Software"}
                                        </span>
                                        {project.status && (
                                            <span className="text-[10px] font-bold text-emerald-700">
                                                {project.status}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-1">
                                        {project.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-3">
                                        {project.description}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setActiveModalProject(project)}
                                    size="sm"
                                    className="w-full bg-[#0F766E] text-white text-xs font-bold rounded-xl mt-2"
                                >
                                    Read Details
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Indicators */}
                    {displayedProjects.length > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-2">
                            {displayedProjects.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => scrollToMobileProject(i)}
                                    aria-label={`Go to project ${i + 1}`}
                                    className={`h-2 rounded-full transition-all ${
                                        activeMobileIdx === i ? "w-6 bg-[#0F766E]" : "w-2 bg-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* View All Client Projects Link */}
                <div className="flex justify-center pt-2">
                    <Link
                        href="/client-projects"
                        className="inline-flex items-center justify-center font-bold text-xs sm:text-sm text-[#0F766E] hover:text-[#115E59] transition-colors group"
                    >
                        Browse All Case Studies & Enterprise Projects
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

            </Container>

            {/* 5. Detail Modal Overlay with Lenis-Prevent Scroll Isolation */}
            <AnimatePresence>
                {activeModalProject && (
                    <ClientProjectModal
                        project={activeModalProject}
                        onClose={() => setActiveModalProject(null)}
                    />
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
}

// ============================================================================
// CLIENT PROJECT DETAIL MODAL (Desktop scrollable with Lenis isolated)
// ============================================================================

function ClientProjectModal({ project, onClose }: { project: any; onClose: () => void }) {
    React.useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const tags = Array.isArray(project?.tags) ? project.tags : [];

    return (
        <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
            onWheel={(e) => e.stopPropagation()}
        >
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-[#0F172A]/75 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
                data-lenis-prevent="true"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onWheel={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] z-10 flex flex-col my-auto border border-gray-100 custom-scrollbar"
            >
                {/* Sticky Close Button */}
                <button
                    onClick={onClose}
                    className="sticky top-4 self-end -mb-12 mr-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md transition-all shadow-xl cursor-pointer"
                    aria-label="Close dialog"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Cover Image or Confidential Banner */}
                <div className="w-full h-[220px] sm:h-[300px] bg-slate-900 shrink-0 relative overflow-hidden flex items-center justify-center">
                    {project.isConfidential ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-white">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-2 text-[#2DD4BF]">
                                <Lock className="w-7 h-7" />
                            </div>
                            <h3 className="font-bold text-lg text-white">Confidential Enterprise System</h3>
                            <p className="text-xs text-gray-300">Detailed source code & customer data protected by NDA</p>
                        </div>
                    ) : project.imageUrl ? (
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="text-center text-gray-300">
                            <Globe className="w-12 h-12 text-[#2DD4BF] mx-auto mb-2 opacity-70" />
                            <p className="text-sm font-semibold">{project.title}</p>
                        </div>
                    )}
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 md:p-10 space-y-6 flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#D8E8E2] text-[#0F766E] text-xs font-bold uppercase tracking-wider">
                            {project.industry || "Enterprise Project"}
                        </span>
                        {project.status && (
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                                {project.status}
                            </span>
                        )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight font-serif">
                        {project.title}
                    </h2>

                    <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                        <p className="font-semibold text-gray-900 bg-[#D8E8E2]/50 p-4 rounded-xl border border-[#2DD4BF]/20">
                            {project.description}
                        </p>

                        {project.challenge && (
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-1">
                                    The Challenge
                                </h4>
                                <p className="text-gray-600">{project.challenge}</p>
                            </div>
                        )}

                        {project.solution && (
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-[#0F766E] mb-1">
                                    Engineering Solution
                                </h4>
                                <p className="text-gray-600">{project.solution}</p>
                            </div>
                        )}
                    </div>

                    {tags.length > 0 && (
                        <div className="pt-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">
                                Technologies & Systems
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map((t: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                        {project.projectUrl ? (
                            <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
                            >
                                <span>Visit Live Platform</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        ) : <div />}

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
                        >
                            Close Case Study
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
