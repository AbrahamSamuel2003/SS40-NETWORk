"use client";

import * as React from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ExternalLink, Target, Box, LayoutDashboard, X } from "lucide-react";
import Image from "next/image";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { CardGridSkeleton } from "@/components/ui/Skeleton";
import { scrollChildIntoContainer } from "@/utils/scroll";

// Stagger animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
};

// Premium Browser Mockup Placeholder
function ProjectPreviewPlaceholder() {
    return (
        <div className="w-full h-full flex flex-col bg-[#D8E8E2] group-hover:bg-white transition-colors duration-500">
            {/* Browser Header */}
            <div className="h-6 sm:h-8 bg-white border-b border-gray-100 flex items-center px-3 sm:px-4 shrink-0">
                <div className="mx-auto w-1/3 h-2 sm:h-3 bg-gray-50 rounded-full border border-gray-100" />
            </div>

            {/* Inner Content */}
            <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 text-center border-t-2 border-[#6B9F91]/20">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#6B9F91]/10 rounded-2xl flex items-center justify-center mb-2.5 text-[#0F766E]">
                    <LayoutDashboard className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h5 className="font-bold text-gray-900 text-xs sm:text-sm mb-0.5">Project Preview</h5>
                <p className="text-[10px] sm:text-xs text-gray-500">Capstone architecture showcase</p>
            </div>
        </div>
    );
}

function parseTags(tags: any): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) {
        return tags.map(t => typeof t === 'string' ? t : (t?.label || '')).filter(Boolean);
    }
    if (typeof tags === 'string') {
        try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) {
                return parsed.map(t => typeof t === 'string' ? t : (t?.label || '')).filter(Boolean);
            }
        } catch {
            return [];
        }
    }
    return [];
}

interface BestProjectsProps {
    projects?: any[];
}

export function BestProjects({ projects = [] }: BestProjectsProps) {
    const [activeModalProject, setActiveModalProject] = React.useState<any | null>(null);

    // Filter active projects
    const activeProjects = projects.filter(p => p.isActive !== false);

    // For desktop: show top 3 projects in horizontal key-value accordion
    const displayProjects = activeProjects.slice(0, 3);

    // For mobile swipe deck: featured + secondary as per GitHub original
    const featuredProject = activeProjects.find(p => p.isFeatured === true) || null;
    const secondaryProjects = featuredProject
        ? activeProjects.filter(p => p.id !== featuredProject.id).slice(0, 3)
        : activeProjects.slice(0, 3);
    const displayedProjects = featuredProject ? [featuredProject, ...secondaryProjects] : secondaryProjects;

    // Desktop Accordion state: zero latency instant toggle
    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    const toggleProject = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    // Mobile scroll carousel logic from GitHub original
    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    const scrollToMobileProject = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".project-mobile-card");
        const card = mobileCards[idx];
        if (!card) return;

        scrollChildIntoContainer(mobileScrollRef.current, card, "smooth");
    };

    const updateActiveMobileIdx = React.useCallback(() => {
        if (!mobileScrollRef.current) return;
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".project-mobile-card");
        if (mobileCards.length === 0) return;

        const containerRect = mobileScrollRef.current.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestIdx = 0;
        let minDistance = Infinity;

        mobileCards.forEach((card, idx) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(containerCenter - cardCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIdx = idx;
            }
        });

        setActiveMobileIdx(closestIdx);
    }, []);

    React.useEffect(() => {
        const container = mobileScrollRef.current;
        if (!container) return;

        updateActiveMobileIdx();
        container.addEventListener("scroll", updateActiveMobileIdx, { passive: true });

        return () => {
            container.removeEventListener("scroll", updateActiveMobileIdx);
        };
    }, [updateActiveMobileIdx]);

    if (activeProjects.length === 0) {
        return (
            <SectionWrapper id="best-projects" className="bg-white relative overflow-hidden scroll-mt-24">
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                        style={{ backgroundImage: 'radial-gradient(#6B9F91 2px, transparent 2px)', backgroundSize: '40px 40px' }}
                    />
                </div>
                <Container className="relative z-20">
                    <SectionHeading
                        badge="BEST STUDENT PROJECTS"
                        title={<>Ideas Built Into <span className="text-[#0F766E]">Reality.</span></>}
                        description="Explore innovative projects created by students through hands-on learning, mentorship, and real-world challenges."
                        align="center"
                        className="mb-16 lg:mb-20"
                    />
                    <CardGridSkeleton count={3} columns={3} />
                </Container>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper id="best-projects" className="bg-white relative overflow-hidden scroll-mt-24">
            {/* Ambient Background & Geometry */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                    style={{ backgroundImage: 'radial-gradient(#6B9F91 2px, transparent 2px)', backgroundSize: '40px 40px' }}
                />

                <motion.div
                    animate={{ rotate: -360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[15%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full"
                />

                <motion.div
                    animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute top-[15%] right-[10%] w-24 h-24 border-4 border-[#FFC900]/20 rounded-2xl opacity-60 flex items-center justify-center p-2"
                >
                    <Box className="w-12 h-12 text-[#FFC900]/30" />
                </motion.div>

                <motion.div
                    animate={{ y: [15, -15, 15], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                    className="absolute bottom-[25%] left-[5%] w-32 h-32 border border-[#6B9F91]/20 rounded-full opacity-60 flex items-center justify-center"
                >
                    <Target className="w-16 h-16 text-[#6B9F91]/10" />
                </motion.div>
            </div>

            <Container className="relative z-20 max-w-6xl">
                <SectionHeading
                    badge="BEST STUDENT PROJECTS"
                    title={<>Ideas Built Into <span className="text-[#0F766E]">Reality.</span></>}
                    description="Explore innovative projects created by students through hands-on learning, mentorship, and real-world challenges."
                    align="center"
                    className="mb-12 lg:mb-16"
                />

                {/* ========================================================================= */}
                {/* DESKTOP VIEW: 3 Horizontal Key-Value Project Rows with Dropdown (md & up) */}
                {/* ========================================================================= */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="hidden md:flex flex-col gap-5 sm:gap-6"
                >
                    {displayProjects.map((project, idx) => {
                        const isExpanded = expandedId === project.id;
                        const tags = parseTags(project.tags);

                        return (
                            <motion.div
                                key={project.id}
                                variants={itemVariants}
                                className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                                    isExpanded
                                        ? "border-[#0F766E]/50 shadow-xl shadow-[#0F766E]/8 ring-1 ring-[#0F766E]/20 bg-gradient-to-b from-white to-[#F0FDFA]/25"
                                        : "border-gray-200/85 hover:border-[#0F766E]/40 hover:shadow-lg hover:shadow-gray-200/50"
                                }`}
                            >
                                <div className="p-4 sm:p-5 md:p-6 lg:p-7">
                                    {/* Responsive Flex Row: Vertically Centered (items-center) */}
                                    <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-6 lg:gap-8">
                                        {/* 1. Left Side: The ONLY Image (Smoothly enlarges when expanded, centered vertically) */}
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`Toggle details for ${project.title}`}
                                            onClick={() => toggleProject(project.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    toggleProject(project.id);
                                                }
                                            }}
                                            className={`relative rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-gray-200/90 shadow-sm shrink-0 cursor-pointer group/img transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] ${
                                                isExpanded
                                                    ? "w-full md:w-5/12 lg:w-1/2 aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] min-h-[220px] sm:min-h-[260px] lg:min-h-[300px]"
                                                    : "w-28 h-18 sm:w-44 sm:h-28 md:w-56 md:h-36"
                                            }`}
                                        >
                                            {project.image || project.imageUrl ? (
                                                <Image
                                                    src={project.image || project.imageUrl}
                                                    alt={project.title}
                                                    fill
                                                    decoding="async"
                                                    priority={idx === 0}
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 550px"
                                                    className="object-cover group-hover/img:scale-105 transition-transform duration-500 ease-out transform-gpu will-change-transform"
                                                />
                                            ) : (
                                                <ProjectPreviewPlaceholder />
                                            )}
                                        </div>

                                        {/* 2. Right Side: Text & Specifications (Centered in middle with image) */}
                                        <div className="flex-1 flex flex-col justify-center text-left min-w-0 w-full">
                                            {/* Header Bar: Spec Index + Category + Toggle Button */}
                                            <div className="flex items-center justify-between gap-3 mb-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-mono text-xs sm:text-sm font-bold text-gray-400">
                                                        {String(idx + 1).padStart(2, "0")}
                                                    </span>
                                                    <span className="h-3 w-px bg-gray-200" />
                                                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D8E8E2] text-[#0F766E] border border-[#2DD4BF]/40">
                                                        {project.category || "Capstone"}
                                                    </span>
                                                    {project.badge && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-[130px]">
                                                            {project.badge}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Dropdown Toggle Control */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleProject(project.id)}
                                                    aria-expanded={isExpanded}
                                                    className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                                                        isExpanded
                                                            ? "bg-[#0F766E] text-white shadow-xs"
                                                            : "bg-[#F0FDFA] text-[#0F766E] hover:bg-[#0F766E] hover:text-white border border-[#0F766E]/20"
                                                    }`}
                                                >
                                                    <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                                                    <ChevronDown
                                                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                                            isExpanded ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Project Title */}
                                            <h4
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => toggleProject(project.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        toggleProject(project.id);
                                                    }
                                                }}
                                                className={`font-bold text-gray-900 leading-snug cursor-pointer hover:text-[#0F766E] transition-colors select-none focus-visible:outline-none ${
                                                    isExpanded
                                                        ? "text-xl sm:text-2xl mb-2.5"
                                                        : "text-base sm:text-lg md:text-xl truncate"
                                                }`}
                                            >
                                                {project.title}
                                            </h4>

                                            {/* Smooth 0-Latency Dropdown Content Panel */}
                                            <AnimatePresence initial={false}>
                                                {isExpanded && (
                                                    <motion.div
                                                        key={`expanded-body-${project.id}`}
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1.0] }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="flex flex-col gap-3.5 pt-3 border-t border-gray-100/90 mt-1">
                                                            {/* Project Overview Narrative */}
                                                            <div>
                                                                <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 font-mono">
                                                                    Project Overview
                                                                </h5>
                                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                                    {project.description}
                                                                </p>
                                                            </div>

                                                            {/* Technology Stack Rack */}
                                                            {tags.length > 0 && (
                                                                <div>
                                                                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">
                                                                        Technology Stack
                                                                    </h5>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {tags.map((tag, tIdx) => (
                                                                            <span
                                                                                key={tIdx}
                                                                                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/15"
                                                                            >
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Direct Outbound Action */}
                                                            {project.projectUrl && (
                                                                <div className="pt-2 flex">
                                                                    <a
                                                                        href={project.projectUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
                                                                    >
                                                                        <span>Explore Live Project</span>
                                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* ========================================================================= */}
                {/* MOBILE VIEW: Horizontal Swipe Deck & Cards (Matches Product Impacts Size)  */}
                {/* ========================================================================= */}
                <div className="flex flex-col md:hidden relative overflow-visible -mx-6 mt-2">
                    <div
                        ref={mobileScrollRef}
                        className="flex w-full overflow-x-auto snap-x snap-mandatory pb-8 gap-5 items-stretch [&::-webkit-scrollbar]:hidden px-6"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {displayedProjects.map((project: any, idx: number) => (
                            <div
                                key={`mobile-proj-${project.id}`}
                                data-mobile-id={idx}
                                role="button"
                                tabIndex={0}
                                onClick={() => setActiveModalProject(project)}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        setActiveModalProject(project);
                                    }
                                }}
                                className="project-mobile-card cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-[var(--color-border)] snap-center relative scroll-ml-6 group"
                            >
                                {/* Image / Placeholder */}
                                <div className="w-full aspect-video relative overflow-hidden bg-gray-50 border-b border-gray-100 shrink-0">
                                    {project.image || project.imageUrl ? (
                                        <Image
                                            src={project.image || project.imageUrl}
                                            alt={project.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                    ) : (
                                        <ProjectPreviewPlaceholder />
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1 relative z-10 text-left">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 pr-2">
                                            <h4 className="font-bold text-lg sm:text-xl text-gray-900 leading-tight tracking-tight mb-1">
                                                {project.title}
                                            </h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {project.category}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-h-0 relative mb-4">
                                        <p className="text-[var(--color-body-text)] text-sm leading-relaxed overflow-hidden line-clamp-3">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {Array.isArray(project.tags) &&
                                            project.tags.map((tag: any, i: number) => (
                                                <span
                                                    key={i}
                                                    className="text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-transparent bg-[#D8E8E2] text-[#0F766E] border-[#6B9F91]/20"
                                                >
                                                    <span className="truncate">
                                                        {typeof tag === "string" ? tag : tag.label}
                                                    </span>
                                                </span>
                                            ))}
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveModalProject(project);
                                        }}
                                        className="mt-auto border-t border-gray-100 pt-3.5 flex items-center text-[#0F766E] font-bold text-sm hover:text-[#115E59] w-full text-left focus:outline-none cursor-pointer"
                                    >
                                        View Details{" "}
                                        <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* End spacer so the last card doesn't hit the right screen edge */}
                        <div className="w-[4vw] shrink-0" />
                    </div>

                    {/* Pagination Dots representation */}
                    <div className="w-full flex justify-center items-center gap-3 mt-4 mb-2 z-10 relative">
                        {displayedProjects.map((_: any, i: number) => (
                            <button
                                key={`dot-${i}`}
                                onClick={() => scrollToMobileProject(i)}
                                aria-label={`Scroll to project ${i + 1}`}
                                className={`h-2.5 rounded-full transition-all duration-400 ease-out ${
                                    activeMobileIdx === i
                                        ? "bg-[#6B9F91] w-8 shadow-sm scale-100"
                                        : "bg-gray-300 w-2.5 hover:bg-gray-400 scale-90"
                                } border-none cursor-pointer focus:outline-none`}
                            />
                        ))}
                    </div>
                </div>

                {/* View All Projects Navigation */}
                {activeProjects.length > 3 && (
                    <div id="view-all-student-projects" className="w-full flex justify-center mt-10 mb-4 relative z-20 scroll-mt-24">
                        <Link
                            href="/academics/student-projects"
                            className="inline-flex items-center justify-center font-bold text-sm sm:text-base text-[#0F766E] hover:text-[#115E59] transition-colors group"
                        >
                            View All Projects
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </Container>

            {/* Read Details Modal Overlay (Used by Mobile View) */}
            <AnimatePresence>
                {activeModalProject && (
                    <StudentProjectModal
                        project={activeModalProject}
                        onClose={() => setActiveModalProject(null)}
                    />
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
}

// ============================================================================
// STUDENT PROJECT MODAL (Used by Mobile View & student-projects page)
// ============================================================================

export function StudentProjectModal({ project, onClose }: { project: any; onClose: () => void }) {
    React.useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalStyle;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const parsedTags = parseTags(project?.tags);

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
                className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-md transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
                data-lenis-prevent="true"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                onWheel={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-y-auto max-h-[90vh] z-10 flex flex-col my-auto custom-scrollbar"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="sticky top-4 self-end -mb-12 mr-4 z-30 w-10 h-10 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors focus-visible:outline-none cursor-pointer shadow-lg"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header Image */}
                <div className="w-full h-64 md:h-80 relative overflow-hidden bg-gray-50 shrink-0">
                    {project.image || project.imageUrl ? (
                        <Image
                            src={project.image || project.imageUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 768px"
                            className="object-cover"
                        />
                    ) : (
                        <ProjectPreviewPlaceholder />
                    )}
                </div>

                <div className="p-6 md:p-10 flex flex-col flex-grow text-left space-y-4">
                    <div className="flex justify-between items-start gap-4">
                        {project.badge && (
                            <Badge className="bg-[#D8E8E2] text-[#0F766E] hover:bg-[#D8E8E2]/80 border-none font-bold uppercase tracking-wider text-[10px]">
                                {project.badge}
                            </Badge>
                        )}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight font-serif">
                        {project.title}
                    </h2>

                    <p className="text-xs font-semibold text-[#0F766E] uppercase tracking-widest">
                        {project.category}
                    </p>

                    <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {parsedTags.map((tag: any, i: number) => (
                            <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border bg-[#D8E8E2] text-[#0F766E] border-[#0F766E]/20">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {project.projectUrl && (
                        <div className="pt-4 border-t border-gray-100">
                            <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full py-3.5 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold rounded-xl transition-colors text-sm shadow-md cursor-pointer"
                            >
                                Explore Live Project
                            </a>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
