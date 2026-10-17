"use client";

import * as React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

function parseProjectTags(tags: any): string[] {
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
            return tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
    }
    return [];
}

function ClientPreviewPlaceholder({ title }: { title?: string }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#D8E8E2]/60 text-[#0F766E] p-4 text-center">
            <Cpu className="w-10 h-10 mb-2 opacity-80" />
            <span className="font-bold text-xs">Production System</span>
            {title && <span className="text-[10px] text-gray-600 mt-0.5 line-clamp-1">{title}</span>}
        </div>
    );
}

function ConfidentialPreviewPlaceholder() {
    return (
        <div className="w-full h-full bg-gradient-to-br from-gray-950 via-slate-900 to-teal-950 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2.5 text-[#2DD4BF]">
                <Lock className="w-6 h-6" />
            </div>
            <span className="font-bold text-white text-xs">Enterprise Confidential</span>
            <span className="text-[10px] text-gray-300 mt-0.5">NDA Protected Architecture</span>
        </div>
    );
}

interface ClientProjectsProps {
    initialData?: any[];
}

export function ClientProjects({ initialData }: ClientProjectsProps = {}) {
    const [projects, setProjects] = React.useState<any[]>(Array.isArray(initialData) ? initialData : []);
    const [isLoading, setIsLoading] = React.useState(!initialData || (Array.isArray(initialData) && initialData.length === 0));
    const [activeTab, setActiveTab] = React.useState(0);
    const [spotlightId, setSpotlightId] = React.useState<string | null>(null);
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

    const [loadedImages, setLoadedImages] = React.useState<Record<string, boolean>>({});

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

    // Proactive background pre-caching: fetches all project images into memory immediately
    // so switching tabs (e.g. Jalsa Restaurant) loads instantly with zero delay
    React.useEffect(() => {
        if (!displayedProjects || displayedProjects.length === 0) return;
        if (typeof window === "undefined") return;

        displayedProjects.forEach(p => {
            if (p?.imageUrl) {
                const img = new window.Image();
                img.src = p.imageUrl;
                img.onload = () => {
                    const key = p.id || p.imageUrl;
                    setLoadedImages(prev => ({ ...prev, [key]: true }));
                };
            }
        });
    }, [displayedProjects]);

    const handleMobileScroll = () => {
        if (!mobileScrollRef.current) return;
        const container = mobileScrollRef.current;
        const children = Array.from(container.children) as HTMLElement[];
        if (!children.length) return;

        const scrollCenter = container.scrollLeft + container.clientWidth / 2;
        let closestIdx = 0;
        let closestDist = Infinity;

        children.forEach((child, idx) => {
            const childCenter = child.offsetLeft + child.offsetWidth / 2;
            const dist = Math.abs(scrollCenter - childCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closestIdx = idx;
            }
        });

        if (closestIdx !== activeMobileIdx) {
            setActiveMobileIdx(closestIdx);
        }
    };

    const scrollToMobileProject = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const container = mobileScrollRef.current;
        const targetChild = container.children[idx] as HTMLElement | undefined;
        if (targetChild) {
            targetChild.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
        }
        setActiveMobileIdx(idx);
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

    const displayProjects = displayedProjects.slice(0, 3);
    const toggleSpotlight = (id: string) => {
        setSpotlightId(prev => (prev === id ? null : id));
    };

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

                {/* 2. DESKTOP VIEW: Adaptive Google Meet Stage & Filmstrip Dock (sm & up) */}
                <div className="hidden sm:block w-full">
                    <LayoutGroup id="client-projects-spotlight-group">
                        {!spotlightId ? (
                            /* State A: Single Row (3 Clean Minimalist Cards matching Academics BestProjects) */
                            <motion.div
                                key="default-grid"
                                layout
                                className="grid grid-cols-3 gap-6 items-stretch"
                            >
                                {displayProjects.map((project, idx) => {
                                    const key = project.id || `client-${idx}`;
                                    return (
                                        <motion.div
                                            key={key}
                                            layout
                                            layoutId={`client-card-container-${key}`}
                                            transition={{ duration: 0.48, ease: SMOOTH_EASE }}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => toggleSpotlight(key)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    toggleSpotlight(key);
                                                }
                                            }}
                                            className="bg-white rounded-3xl border border-gray-200/90 hover:border-[#0F766E]/50 hover:shadow-xl hover:shadow-[#0F766E]/8 transition-colors duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                                        >
                                            {/* Flushed Top Preview Image */}
                                            <motion.div
                                                layout
                                                layoutId={`client-img-wrapper-${key}`}
                                                transition={{ duration: 0.48, ease: SMOOTH_EASE }}
                                                className="relative w-full aspect-video bg-slate-900 overflow-hidden shrink-0 border-b border-gray-100"
                                            >
                                                {project.isConfidential ? (
                                                    <ConfidentialPreviewPlaceholder />
                                                ) : project.imageUrl ? (
                                                    <Image
                                                        src={project.imageUrl}
                                                        alt={project.title}
                                                        fill
                                                        sizes="(max-width: 1024px) 33vw, 400px"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out transform-gpu will-change-transform"
                                                    />
                                                ) : (
                                                    <ClientPreviewPlaceholder title={project.title} />
                                                )}
                                            </motion.div>

                                            {/* Content Body */}
                                            <motion.div
                                                layout
                                                layoutId={`client-body-wrapper-${key}`}
                                                transition={{ duration: 0.48, ease: SMOOTH_EASE }}
                                                className="p-5 sm:p-6 flex flex-col flex-1 justify-between text-left"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2.5">
                                                        <span className="font-mono text-xs font-bold text-gray-400">
                                                            {String(idx + 1).padStart(2, "0")}
                                                        </span>
                                                        <span className="h-3 w-px bg-gray-200" />
                                                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#D8E8E2] text-[#0F766E] border border-[#2DD4BF]/40">
                                                            {project.industry || "Custom Software"}
                                                        </span>
                                                        {project.status && (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 truncate max-w-[120px]">
                                                                {project.status}
                                                            </span>
                                                        )}
                                                        {project.isConfidential && (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/70">
                                                                NDA
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="font-bold text-lg lg:text-xl text-gray-900 leading-snug font-serif group-hover:text-[#0F766E] transition-colors line-clamp-2">
                                                        {project.title}
                                                    </h3>
                                                </div>

                                                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSpotlight(key);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] group-hover:text-[#115E59] group-hover:translate-x-0.5 transition-all cursor-pointer"
                                                    >
                                                        <span>View Details</span>
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            /* State B: Adaptive Spotlight Stage (Hero Stage + Bottom Dock Cards) */
                            <motion.div layout className="flex flex-col gap-6">
                                {(() => {
                                    const spotlightProject = displayProjects.find((p, idx) => (p.id || `client-${idx}`) === spotlightId) || displayProjects[0];
                                    const spotlightKey = spotlightProject.id || `client-${displayProjects.indexOf(spotlightProject)}`;
                                    const dockProjects = displayProjects.filter((p, idx) => (p.id || `client-${idx}`) !== spotlightKey);
                                    const spotlightIdx = displayProjects.indexOf(spotlightProject);
                                    const tags = parseProjectTags(spotlightProject.tags);

                                    return (
                                        <>
                                            {/* PRIMARY STAGE: Morphing Hero Frame with GPU FLIP Transition */}
                                            <motion.div
                                                key={spotlightKey}
                                                layout
                                                layoutId={`client-card-container-${spotlightKey}`}
                                                transition={{ duration: 0.48, ease: SMOOTH_EASE }}
                                                className="w-full bg-white rounded-3xl border border-[#0F766E]/40 shadow-2xl shadow-[#0F766E]/10 ring-1 ring-[#0F766E]/20 overflow-hidden flex flex-col lg:flex-row group"
                                            >
                                                {/* Left: Cinematic Preview Image */}
                                                <motion.div
                                                    layout
                                                    layoutId={`client-img-wrapper-${spotlightKey}`}
                                                    transition={{ duration: 0.48, ease: SMOOTH_EASE }}
                                                    className="w-full lg:w-7/12 aspect-video lg:aspect-auto min-h-[300px] lg:min-h-[360px] relative bg-slate-900 overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100"
                                                >
                                                    {spotlightProject.isConfidential ? (
                                                        <div className="w-full h-full min-h-[300px] lg:min-h-[360px] bg-gradient-to-br from-gray-950 via-slate-900 to-teal-950 p-8 flex flex-col items-center justify-center text-center text-white shadow-2xl relative overflow-hidden">
                                                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 shadow-inner text-[#2DD4BF]">
                                                                <Lock className="w-8 h-8" />
                                                            </div>
                                                            <h4 className="font-bold text-base text-white mb-1">
                                                                Enterprise Confidential Project
                                                            </h4>
                                                            <p className="text-xs text-gray-300 max-w-xs leading-relaxed">
                                                                Architectural schematics, proprietary data pipelines, and live codebase protected under client non-disclosure agreement.
                                                            </p>
                                                        </div>
                                                    ) : spotlightProject.imageUrl ? (
                                                        <Image
                                                            src={spotlightProject.imageUrl}
                                                            alt={spotlightProject.title}
                                                            fill
                                                            sizes="(max-width: 1200px) 60vw, 700px"
                                                            className="object-cover transform-gpu will-change-transform"
                                                        />
                                                    ) : (
                                                        <ClientPreviewPlaceholder title={spotlightProject.title} />
                                                    )}
                                                </motion.div>

                                                {/* Right: Content Area */}
                                                <motion.div
                                                    layout
                                                    layoutId={`client-body-wrapper-${spotlightKey}`}
                                                    transition={{ duration: 0.48, ease: SMOOTH_EASE }}
                                                    className="w-full lg:w-5/12 p-6 lg:p-8 flex flex-col justify-between text-left min-h-[300px]"
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.35, delay: 0.1, ease: SMOOTH_EASE }}
                                                        className="space-y-4 w-full"
                                                    >
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-xs sm:text-sm font-bold text-gray-400">
                                                                    {String(spotlightIdx + 1).padStart(2, "0")}
                                                                </span>
                                                                <span className="h-3 w-px bg-gray-200" />
                                                                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#D8E8E2] text-[#0F766E] border border-[#2DD4BF]/40">
                                                                    {spotlightProject.industry || "Custom Software"}
                                                                </span>
                                                                {spotlightProject.status && (
                                                                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                                                        {spotlightProject.status}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Minimize Control */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setSpotlightId(null)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                                                                title="Return to grid view"
                                                            >
                                                                <span>Minimize</span>
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>

                                                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 font-serif leading-tight">
                                                            {spotlightProject.title}
                                                        </h3>

                                                        <p className="text-sm text-gray-700 leading-relaxed font-normal">
                                                            {spotlightProject.description}
                                                        </p>

                                                        {/* Technology Stack Tags */}
                                                        {tags.length > 0 && (
                                                            <div className="space-y-1.5 pt-1">
                                                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                                                                    Technology Stack
                                                                </h4>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {tags.map((tag, tIdx) => (
                                                                        <span
                                                                            key={tIdx}
                                                                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/20"
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Action Buttons */}
                                                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3">
                                                            <Button
                                                                onClick={() => setActiveModalProject(spotlightProject)}
                                                                size="sm"
                                                                className="bg-[#0F766E] hover:bg-[#115E59] text-white shadow-md shadow-[#0F766E]/20 rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer"
                                                            >
                                                                View Full Case Study
                                                                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                                                            </Button>

                                                            {spotlightProject.projectUrl && (
                                                                <a
                                                                    href={spotlightProject.projectUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#0F766E] hover:text-[#115E59] hover:underline cursor-pointer"
                                                                >
                                                                    <span>Live Application</span>
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            </motion.div>

                                            {/* BOTTOM DOCK: Filmstrip of Other Projects (Morphing Cards) */}
                                            <motion.div layout className="grid grid-cols-2 gap-5 pt-1">
                                                {dockProjects.map((project, dIdx) => {
                                                    const dockKey = project.id || `client-dock-${dIdx}`;
                                                    const origIdx = displayProjects.indexOf(project);
                                                    return (
                                                        <motion.div
                                                            key={dockKey}
                                                            layout
                                                            layoutId={`client-card-container-${dockKey}`}
                                                            transition={{ duration: 0.48, ease: SMOOTH_EASE }}
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={() => setSpotlightId(dockKey)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" || e.key === " ") {
                                                                    e.preventDefault();
                                                                    setSpotlightId(dockKey);
                                                                }
                                                            }}
                                                            className="bg-white rounded-2xl border border-gray-200/90 hover:border-[#0F766E]/50 hover:shadow-lg hover:shadow-[#0F766E]/5 overflow-hidden flex items-stretch cursor-pointer transition-colors duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                                                        >
                                                            {/* Flushed Left Thumbnail */}
                                                            <motion.div
                                                                layout
                                                                layoutId={`client-img-wrapper-${dockKey}`}
                                                                transition={{ duration: 0.48, ease: SMOOTH_EASE }}
                                                                className="w-40 sm:w-48 aspect-video relative bg-slate-900 shrink-0 overflow-hidden border-r border-gray-100"
                                                            >
                                                                {project.isConfidential ? (
                                                                    <div className="w-full h-full bg-gradient-to-br from-gray-950 to-slate-900 flex flex-col items-center justify-center p-2 text-center">
                                                                        <Lock className="w-5 h-5 text-[#2DD4BF] mb-1" />
                                                                        <span className="text-[10px] text-gray-300 font-bold">Confidential</span>
                                                                    </div>
                                                                ) : project.imageUrl ? (
                                                                    <Image
                                                                        src={project.imageUrl}
                                                                        alt={project.title}
                                                                        fill
                                                                        sizes="192px"
                                                                        className="object-cover group-hover:scale-105 transition-transform duration-300 transform-gpu will-change-transform"
                                                                    />
                                                                ) : (
                                                                    <ClientPreviewPlaceholder title={project.title} />
                                                                )}
                                                            </motion.div>

                                                            {/* Summary Info */}
                                                            <motion.div
                                                                layout
                                                                layoutId={`client-body-wrapper-${dockKey}`}
                                                                transition={{ duration: 0.48, ease: SMOOTH_EASE }}
                                                                className="p-4 flex flex-col justify-between flex-1 min-w-0 text-left"
                                                            >
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="font-mono text-xs font-bold text-gray-400">
                                                                            {String(origIdx + 1).padStart(2, "0")}
                                                                        </span>
                                                                        <span className="h-3 w-px bg-gray-200" />
                                                                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D8E8E2] text-[#0F766E]">
                                                                            {project.industry || "Software"}
                                                                        </span>
                                                                    </div>
                                                                    <h3 className="font-bold text-base text-gray-900 font-serif truncate group-hover:text-[#0F766E] transition-colors">
                                                                        {project.title}
                                                                    </h3>
                                                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                                                        {project.description}
                                                                    </p>
                                                                </div>
                                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0F766E] mt-2 group-hover:underline">
                                                                    <span>Switch to Stage</span>
                                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                                </span>
                                                            </motion.div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </motion.div>
                                        </>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </LayoutGroup>
                </div>

                {/* 4. Mobile Native Swipe Carousel */}
                <div className="block sm:hidden w-full">
                    <div
                        ref={mobileScrollRef}
                        onScroll={handleMobileScroll}
                        className="flex w-full overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-1 [&::-webkit-scrollbar]:hidden"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {displayedProjects.map((project, idx) => {
                            const tags = parseProjectTags(project.tags);
                            return (
                                <div
                                    key={project.id || idx}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setActiveModalProject(project)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setActiveModalProject(project);
                                        }
                                    }}
                                    className="w-[85vw] shrink-0 snap-center bg-white rounded-2xl p-4 border border-gray-100 shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex flex-col justify-between cursor-pointer text-left select-none group"
                                >
                                    <div>
                                        {/* Header Row: Small Square Image + Title & Industry */}
                                        <div className="flex items-start gap-3 mb-2.5">
                                            {/* Square Image Thumbnail */}
                                            <div className="w-14 h-14 rounded-xl relative overflow-hidden bg-slate-900 border border-gray-100 shrink-0 shadow-sm flex items-center justify-center">
                                                {project.isConfidential ? (
                                                    <div className="w-full h-full bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col items-center justify-center p-1 text-center">
                                                        <Lock className="w-4 h-4 text-[#2DD4BF]" />
                                                        <span className="text-[8px] text-gray-300 font-bold mt-0.5">NDA</span>
                                                    </div>
                                                ) : project.imageUrl ? (
                                                    <Image
                                                        src={project.imageUrl}
                                                        alt={project.title}
                                                        fill
                                                        sizes="56px"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-[#D8E8E2] flex items-center justify-center text-[#0F766E] font-bold text-xs">
                                                        {project.title ? project.title.slice(0, 2).toUpperCase() : "SS"}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title & Badges */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-1.5 mb-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D8E8E2] text-[#0F766E] truncate">
                                                        {project.industry || "Software"}
                                                    </span>
                                                    {project.status && (
                                                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                                                            {project.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900 font-serif line-clamp-2 leading-snug group-hover:text-[#0F766E] transition-colors">
                                                    {project.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                                            {project.description}
                                        </p>

                                        {/* Tech Stack Preview */}
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {tags.slice(0, 3).map((tag, tIdx) => (
                                                    <span
                                                        key={tIdx}
                                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/15"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {tags.length > 3 && (
                                                    <span className="text-[10px] text-gray-400 font-medium self-center pl-0.5">
                                                        +{tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0F766E]">
                                        <span>View Case Study</span>
                                        <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile Indicators */}
                    {displayedProjects.length > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-2">
                            {displayedProjects.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => scrollToMobileProject(i)}
                                    aria-label={`Go to project ${i + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                        activeMobileIdx === i ? "w-6 bg-[#0F766E]" : "w-2 bg-gray-300 hover:bg-gray-400"
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
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 800px"
                            decoding="async"
                            className="object-cover"
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
