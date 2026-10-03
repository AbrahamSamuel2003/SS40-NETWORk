"use client";

import * as React from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight, Lightbulb, Blocks, Target, Box, Cpu, Sprout, HeartPulse, Building2, Monitor, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { X } from "lucide-react";
import Link from "next/link";
import { scrollChildIntoContainer } from "@/utils/scroll";
import { CardGridSkeleton } from "@/components/ui/Skeleton";

// Stagger animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

// Premium Browser Mockup Placeholder
function ProjectPreviewPlaceholder() {
    return (
        <div className="w-full h-full flex flex-col bg-[#D8E8E2] group-hover:bg-white transition-colors duration-500">
            {/* Browser Header */}
            <div className="h-8 bg-white border-b border-gray-100 flex items-center px-4 shrink-0">
                <div className="mx-auto w-1/3 h-3 bg-gray-50 rounded-full border border-gray-100" />
            </div>

            {/* Inner Content */}
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center border-t-2 border-[#6B9F91]/20">
                <div className="w-16 h-16 bg-[#6B9F91]/10 rounded-2xl flex items-center justify-center mb-4 text-[#6B9F91]">
                    <LayoutDashboard className="w-8 h-8" />
                </div>
                <h5 className="font-bold text-gray-900 text-sm md:text-base mb-1">Student Project Preview</h5>
                <p className="text-[10px] md:text-xs text-gray-500 font-medium max-w-[80%] leading-relaxed">
                    Actual student project screenshots will appear here.
                </p>
            </div>
        </div>
    );
}


const IconMap: Record<string, React.ElementType> = {
    Building2,
    Cpu,
    Lightbulb,
    Target,
    HeartPulse,
    Sprout,
    Blocks,
    Monitor,
    LayoutDashboard,
    Box
};

function getIcon(name: string): React.ElementType {
    return IconMap[name] || Box; // Fallback to Box if unknown
}

interface BestProjectsProps {
    projects?: any[];
}

export function BestProjects({ projects = [] }: BestProjectsProps) {
    const [activeModalProject, setActiveModalProject] = React.useState<any | null>(null);

    // Filter active projects natively inside component if not done already
    const activeProjects = projects.filter(p => p.isActive !== false);

    // Look for an explicitly featured project (only when isFeatured === true)
    const featuredProject = activeProjects.find(p => p.isFeatured === true) || null;

    // When a project is featured, exclude it from the secondary grid and show up to 3 below it.
    // When NO project is featured (toggle is off in admin), show the top 3 projects in the same row!
    const secondaryProjects = featuredProject
        ? activeProjects.filter(p => p.id !== featuredProject.id).slice(0, 3)
        : activeProjects.slice(0, 3);

    // For mobile swipe carousel: include featured project if one exists, otherwise the 3 row projects
    const displayedProjects = featuredProject ? [featuredProject, ...secondaryProjects] : secondaryProjects;

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
                        title={<>Ideas Built Into <span className="text-[#6B9F91]">Reality.</span></>}
                        description="Explore innovative projects created by students through hands-on learning, mentorship, and real-world challenges."
                        align="center"
                        className="mb-16 lg:mb-20"
                    />
                    <CardGridSkeleton count={3} columns={3} />
                </Container>
            </SectionWrapper>
        );
    }

    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    const scrollToMobileProject = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".project-mobile-card");
        const card = mobileCards[idx];
        if (!card) return;

        scrollChildIntoContainer(mobileScrollRef.current, card, "smooth");
    };

    // Scroll-based active index tracking: reliably determines which card is closest
    // to the horizontal center of the scroll container. This is more robust than
    // IntersectionObserver with a high threshold, because during scroll the user
    // passes through a gap where neither card reaches the threshold.
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

        // Set initial active index immediately after mount
        updateActiveMobileIdx();

        // Use scroll event for reliable, real-time dot updates
        container.addEventListener("scroll", updateActiveMobileIdx, { passive: true });

        return () => {
            container.removeEventListener("scroll", updateActiveMobileIdx);
        };
    }, [updateActiveMobileIdx]);

    React.useEffect(() => {
        if (typeof window !== 'undefined' && (window.location.hash === '#best-projects' || window.location.hash === '#view-all-student-projects')) {
            const hashId = window.location.hash.substring(1);
            const el = document.getElementById(hashId);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, []);

    return (
        <SectionWrapper id="best-projects" className="bg-white relative overflow-hidden scroll-mt-24">
            <>

                {/* Ambient Background & Floating Geometry */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                        style={{ backgroundImage: 'radial-gradient(#6B9F91 2px, transparent 2px)', backgroundSize: '40px 40px' }}
                    />

                    <motion.div
                        animate={{ rotate: -360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[20%] -right-[15%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full"
                    />

                    {/* Floating Abstract Elements */}
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

                <Container className="relative z-20">
                    <SectionHeading
                        badge="BEST STUDENT PROJECTS"
                        title={<>Ideas Built Into <span className="text-[#6B9F91]">Reality.</span></>}
                        description="Explore innovative projects created by students through hands-on learning, mentorship, and real-world challenges."
                        align="center"
                        className="mb-16 lg:mb-20"
                    />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="hidden md:flex flex-col gap-8 lg:gap-10"
                    >
                        {/* TOP: Featured Project (Dominant Banner) - Rendered ONLY if a project is explicitly marked as featured */}
                        {featuredProject && (
                            <motion.div
                                variants={itemVariants}
                                role="button"
                                tabIndex={0}
                                onClick={() => setActiveModalProject(featuredProject)}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setActiveModalProject(featuredProject);
                                    }
                                }}
                                className="cursor-pointer w-full bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2"
                            >
                                {/* Project Preview */}
                                <div className="w-full lg:w-7/12 aspect-video lg:aspect-auto min-h-[350px] relative overflow-hidden bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100 flex-grow">
                                    {featuredProject.image || featuredProject.imageUrl ? (
                                        <Image
                                            src={featuredProject.image || featuredProject.imageUrl}
                                            alt={featuredProject.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                        />
                                    ) : (
                                        <ProjectPreviewPlaceholder />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="w-full lg:w-5/12 p-6 lg:p-8 flex flex-col bg-white">
                                    <div className="mb-4 flex justify-between items-start gap-4">
                                        {featuredProject.badge && (
                                            <Badge className="bg-[#6B9F91]/10 text-[#6B9F91] hover:bg-[#6B9F91]/20 border-none font-bold uppercase tracking-wider text-[10px]">
                                                {featuredProject.badge}
                                            </Badge>
                                        )}
                                        <Blocks className="w-6 h-6 text-gray-300 ml-auto shrink-0" />
                                    </div>

                                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">{featuredProject.title}</h3>
                                    <p className="text-xs font-semibold text-[#FFC900] uppercase tracking-widest mb-3">{featuredProject.category}</p>

                                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-5 overflow-hidden line-clamp-3">
                                        {featuredProject.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                                        {Array.isArray(featuredProject.tags) ? featuredProject.tags.map((tag: any, i: number) => (
                                            <span key={i} className="text-[10px] lg:text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap border bg-[#D8E8E2] text-[#0F766E] border-[#6B9F91]/20">
                                                {typeof tag === 'string' ? tag : (tag?.label || '')}
                                            </span>
                                        )) : typeof featuredProject.tags === 'string' ? (() => {
                                            try {
                                                const parsed = JSON.parse(featuredProject.tags);
                                                return Array.isArray(parsed) ? parsed.map((tag: any, i: number) => (
                                                    <span key={i} className="text-[10px] lg:text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap border bg-[#D8E8E2] text-[#0F766E] border-[#6B9F91]/20">
                                                        {typeof tag === 'string' ? tag : (tag?.label || '')}
                                                    </span>
                                                )) : null;
                                            } catch { return null; }
                                        })() : null}
                                    </div>

                                    {featuredProject.projectUrl ? (
                                        <a href={featuredProject.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
                                            <Button className="w-full sm:w-auto bg-[#111827] text-white hover:bg-gray-800 font-bold group/btn">
                                                Explore Project <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </a>
                                    ) : (
                                        <Button onClick={(e: React.MouseEvent) => { e.stopPropagation(); setActiveModalProject(featuredProject); }} className="w-full sm:w-auto bg-[#111827] text-white hover:bg-gray-800 font-bold group/btn mt-auto">
                                            Explore Project <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* 3 Project Cards Grid (renders in same row on desktop!) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {secondaryProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    variants={itemVariants}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setActiveModalProject(project)}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setActiveModalProject(project);
                                        }
                                    }}
                                    className="bg-white rounded-3xl shadow-lg shadow-gray-200/40 border border-gray-100 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2"
                                >

                                    {/* Image / Placeholder */}
                                    <div className="w-full aspect-video relative overflow-hidden bg-gray-50 border-b border-gray-100">
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

                                    <div className="p-6 flex flex-col flex-grow">
                                        <h4 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-[#6B9F91] transition-colors">{project.title}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{project.category}</span>
                                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-5 flex-grow">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {Array.isArray(project.tags) ? project.tags.map((tag: any, i: number) => {
                                                const label = typeof tag === 'string' ? tag : (tag?.label || '');
                                                const TagIcon = (typeof tag === 'object' && tag?.icon) ? getIcon(tag.icon) : null;
                                                const colorClass = (typeof tag === 'object' && tag?.colorClass) ? tag.colorClass : 'bg-[#D8E8E2] text-[#0F766E] border-[#6B9F91]/20';
                                                return (
                                                    <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-transparent ${colorClass}`}>
                                                        {TagIcon && <TagIcon className="w-3 h-3" />} {label}
                                                    </span>
                                                );
                                            }) : typeof project.tags === 'string' ? (() => {
                                                try {
                                                    const parsed = JSON.parse(project.tags);
                                                    if (Array.isArray(parsed)) {
                                                        return parsed.map((tag: any, i: number) => (
                                                            <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-transparent bg-[#D8E8E2] text-[#0F766E] border-[#6B9F91]/20">
                                                                {typeof tag === 'string' ? tag : (tag?.label || '')}
                                                            </span>
                                                        ));
                                                    }
                                                } catch { return null; }
                                            })() : null}
                                        </div>

                                        <button onClick={(e) => { e.stopPropagation(); setActiveModalProject(project); }} className="mt-auto border-t border-gray-100 pt-4 flex items-center text-[#6B9F91] font-bold text-sm group-hover:text-[#5C8C80] w-full text-left focus:outline-none">
                                            View Details <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>



                    </motion.div>

                    {/* Mobile Native Horizontal Swipe Deck */}
                    <div className="flex flex-col md:hidden relative overflow-visible -mx-6 mt-2">
                        <div
                            ref={mobileScrollRef}
                            className="flex w-full overflow-x-auto snap-x snap-mandatory pb-4 gap-5 items-stretch [&::-webkit-scrollbar]:hidden px-6"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {displayedProjects.map((project: any, idx: number) => (
                                <div
                                    key={`mobile-proj-${project.id}`}
                                    data-mobile-id={idx}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setActiveModalProject(project)}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setActiveModalProject(project);
                                        }
                                    }}
                                    className="project-mobile-card cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 w-[clamp(280px,85vw,350px)] flex-shrink-0 flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-[var(--color-border)] snap-center relative scroll-ml-6 group"
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

                                    <div className="p-6 flex flex-col flex-1 relative z-10 text-left">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 pr-2">
                                                <h4 className="font-bold text-xl text-gray-900 leading-tight tracking-tight mb-1">{project.title}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{project.category}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 min-h-0 relative mb-5">
                                            <p className="text-[var(--color-body-text)] text-sm leading-relaxed overflow-hidden line-clamp-4">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {Array.isArray(project.tags) && project.tags.map((tag: any, i: number) => (
                                                <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-transparent bg-[#D8E8E2] text-[#0F766E] border-[#6B9F91]/20">
                                                    <span className="truncate">{typeof tag === 'string' ? tag : tag.label}</span>
                                                </span>
                                            ))}
                                        </div>

                                        <button onClick={(e) => { e.stopPropagation(); setActiveModalProject(project); }} className="mt-auto border-t border-gray-100 pt-4 flex items-center text-[#6B9F91] font-bold text-sm group-hover:text-[#5C8C80] w-full text-left focus:outline-none">
                                            View Details <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
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
                                    className={`h-2.5 rounded-full transition-all duration-400 ease-out ${activeMobileIdx === i ? 'bg-[#6B9F91] w-8 shadow-sm scale-100' : 'bg-gray-300 w-2.5 hover:bg-gray-400 scale-90'} border-none cursor-pointer focus:outline-none`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Read More Button if more than 4 projects exist */}
                    {activeProjects.length > 4 && (
                        <div id="view-all-student-projects" className="w-full flex justify-center mt-12 mb-4 relative z-20 scroll-mt-24">
                            <Link href="/academics/student-projects" className="inline-flex items-center justify-center font-bold text-lg text-[#6B9F91] hover:text-[#588478] transition-colors group">
                                View All Projects
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}

                </Container>
            </>

            {/* Read Details Modal overlay */}
            <AnimatePresence>
                {activeModalProject && (
                    <StudentProjectModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
}

// ============================================================================
// STUDENT PROJECT MODAL (Matches Academics look & feel)
// ============================================================================

export function StudentProjectModal({ project, onClose }: { project: any, onClose: () => void }) {
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
    let parsedTags: any[] = [];
    try {
        if (project.tags && typeof project.tags === 'string') {
            parsedTags = JSON.parse(project.tags);
        } else if (Array.isArray(project.tags)) {
            parsedTags = project.tags;
        }
    } catch {
        parsedTags = [];
    }

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
                    {/* Modal Header */}
                    <div className="flex justify-between items-start gap-4">
                        {project.badge && (
                            <Badge className="bg-[#D8E8E2] text-[#0F766E] hover:bg-[#D8E8E2]/80 border-none font-bold uppercase tracking-wider text-[10px]">
                                {project.badge}
                            </Badge>
                        )}
                    </div>

                    {/* Project Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight font-serif">
                        {project.title}
                    </h2>

                    <p className="text-xs font-semibold text-[#0F766E] uppercase tracking-widest">
                        {project.category}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {parsedTags.map((tag: any, i: number) => (
                            <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border bg-[#D8E8E2] text-[#0F766E] border-[#0F766E]/20">
                                {typeof tag === 'string' ? tag : tag.label}
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
