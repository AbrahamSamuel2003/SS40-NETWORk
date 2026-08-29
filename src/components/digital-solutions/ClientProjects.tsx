"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Lock, ShieldCheck, CheckCircle2, X } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { slideUp, staggerContainer } from "@/lib/animations";
import { scrollChildIntoContainer } from "@/utils/scroll";

// Mock structural classes deleted: dynamic API is now the source of truth
import { CardGridSkeleton } from "@/components/ui/Skeleton";

// Helper components for card rendering
function SingleProjectCard({ project }: { project: any }) {
    return (
        <>
            {/* Featured Visual */}
            <div className="w-full lg:w-7/12 aspect-video lg:aspect-auto bg-gray-100 relative overflow-hidden flex items-center justify-center shrink-0 min-h-[260px]">
                {project.isConfidential ? (
                    <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-6 select-none opacity-80 backdrop-blur-md">
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-3">
                            <Lock className="w-7 h-7" />
                        </div>
                        <h4 className="font-bold text-gray-700 text-xs mb-1 uppercase tracking-wider">Confidential Project</h4>
                        <p className="text-[11px] text-gray-500">Visuals protected under corporate NDA.</p>
                    </div>
                ) : project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                    <div className="absolute inset-0 bg-[#6B9F91]/5 flex flex-col p-6 gap-3 group-hover:scale-105 transition-transform duration-700 ease-out">
                        <div className="w-full flex justify-between items-center bg-white/80 backdrop-blur-md p-3 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#6B9F91]/20" />
                                <div className="w-24 h-2.5 bg-gray-200 rounded-full" />
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-gray-200" />
                                <div className="w-6 h-6 rounded-full bg-gray-200" />
                            </div>
                        </div>
                        <div className="flex gap-3 flex-1">
                            <div className="w-1/4 h-full bg-white/80 backdrop-blur-md rounded-lg border border-gray-200 shadow-sm p-3 flex flex-col gap-2">
                                <div className="w-full h-6 bg-gray-100 rounded" />
                                <div className="w-2/3 h-6 bg-gray-100 rounded" />
                            </div>
                            <div className="flex-1 h-full bg-white/80 backdrop-blur-md rounded-lg border border-gray-200 shadow-sm p-3 grid grid-cols-2 gap-3">
                                <div className="bg-[#6B9F91]/10 rounded" />
                                <div className="bg-gray-100 rounded" />
                                <div className="bg-gray-100 rounded col-span-2" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full text-xs font-bold text-gray-800 shadow-xl flex items-center gap-2">
                        <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                        Project Visual Preview
                    </div>
                </div>
            </div>

            {/* Featured Content Area */}
            <div className="w-full lg:w-5/12 p-6 lg:p-8 flex flex-col justify-center bg-white relative z-10 border-l border-gray-100">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap">
                        {project.industry}
                    </span>
                    {project.status && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3" />
                            {project.status}
                        </div>
                    )}
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-[var(--color-heading)] mb-2.5 leading-tight group-hover:text-[#6B9F91] transition-colors">
                    {project.title}
                </h3>

                <p className="text-[var(--color-body-text)] text-sm mb-4 leading-relaxed line-clamp-3 text-gray-600">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                    {Array.isArray(project.tags) && project.tags.slice(0, 4).map((tag: any, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#6B9F91]/10 text-[#6B9F91] rounded-md text-xs font-semibold">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto">
                    <Button
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                        }}
                        size="sm"
                        className="w-full sm:w-auto bg-[#6B9F91] hover:bg-[#588478] text-white shadow-md shadow-[#6B9F91]/20 font-semibold"
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </>
    );
}

function GridProjectCard({ project }: { project: any }) {
    return (
        <>
            {/* Grid Visual Placeholder */}
            <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center border-b border-gray-100">
                {project.isConfidential ? (
                    <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-4 select-none opacity-80 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-2">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-gray-700 text-xs mb-0.5 uppercase tracking-wider">Confidential Project</h4>
                        <p className="text-[11px] text-gray-500">Visuals protected under corporate NDA.</p>
                    </div>
                ) : project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                    <div className="w-full h-full flex flex-col p-4 gap-2.5 bg-[#6B9F91]/5 group-hover:scale-105 transition-transform duration-700 ease-out">
                        <div className="w-full h-1/2 flex gap-2.5">
                            <div className="w-1/3 bg-white border border-gray-200 rounded-md shadow-sm" />
                            <div className="flex-1 bg-white border border-gray-200 rounded-md shadow-sm" />
                        </div>
                        <div className="w-full h-1/2 bg-white border border-gray-200 rounded-md shadow-sm" />
                    </div>
                )}
            </div>

            {/* Grid Content Area */}
            <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap overflow-hidden text-ellipsis">
                        {project.industry}
                    </span>
                    {project.status && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                            {project.status}
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-base md:text-lg text-[var(--color-heading)] leading-snug mb-2 group-hover:text-[#6B9F91] transition-colors">
                    {project.title}
                </h3>

                <p className="text-[var(--color-body-text)] text-xs sm:text-sm mb-4 flex-1 line-clamp-3 text-gray-600 leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                    {Array.isArray(project.tags) && project.tags.slice(0, 3).map((tag: any, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#6B9F91]/10 text-[#6B9F91] rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                            {tag}
                        </span>
                    ))}
                    {Array.isArray(project.tags) && project.tags.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                            +{project.tags.length - 3}
                        </span>
                    )}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B9F91] group-hover:text-[#588478] transition-colors inline-flex items-center gap-1.5">
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </div>
            </div>
        </>
    );
}

interface ClientProjectsProps {
    initialData?: any[];
}

export function ClientProjects({ initialData }: ClientProjectsProps = {}) {
    const [projects, setProjects] = React.useState<any[]>(initialData || []);
    const [isLoading, setIsLoading] = React.useState(!initialData || initialData.length === 0);
    const [activeModalProject, setActiveModalProject] = React.useState<any | null>(null);

    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);
    
    // Adaptive layout: determine layout type based on content count and featured status
    const layoutConfig = React.useMemo(() => {
        if (projects.length === 0) return { type: 'empty', featured: null, grid: [] };
        
        // If there's a featured item, use featured-grid layout regardless of count
        const featuredItem = projects.find(p => p.isFeatured);
        if (featuredItem) {
            const gridItems = projects.filter(p => p.id !== featuredItem.id);
            return { type: 'featured-grid', featured: featuredItem, grid: gridItems };
        }
        
        // No featured item - use count-based layouts
        if (projects.length === 1) return { type: 'single', featured: projects[0], grid: [] };
        if (projects.length === 2) return { type: 'two-grid', featured: null, grid: projects };
        if (projects.length === 3) return { type: 'three-grid', featured: null, grid: projects };
        
        // 4+ items with no featured: use first item as featured
        const defaultFeatured = projects[0];
        const gridItems = projects.slice(1);
        return { type: 'featured-grid', featured: defaultFeatured, grid: gridItems };
    }, [projects]);

    const displayedProjects = React.useMemo(() => {
        if (layoutConfig.type === 'featured-grid') {
            // Show featured + up to 3 grid items
            return [layoutConfig.featured, ...layoutConfig.grid.slice(0, 3)];
        }
        return layoutConfig.grid.length > 0 ? layoutConfig.grid : [layoutConfig.featured].filter(Boolean);
    }, [layoutConfig]);

    React.useEffect(() => {
        if (initialData && initialData.length > 0) {
            setProjects(initialData);
            setIsLoading(false);
            return;
        }

        fetch('/api/client-projects')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProjects(data.data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [initialData]);

    const scrollToMobileProject = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".client-project-mobile-card");
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
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".client-project-mobile-card");
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
        if (isLoading || displayedProjects.length === 0) return;

        setActiveMobileIdx(0);

        const container = mobileScrollRef.current;
        if (!container) return;

        // Reset horizontal position only — never use scrollIntoView (it scrolls the page)
        container.scrollLeft = 0;

        // Set initial active index immediately after mount
        updateActiveMobileIdx();

        // Use scroll event for reliable, real-time dot updates
        container.addEventListener("scroll", updateActiveMobileIdx, { passive: true });

        return () => {
            container.removeEventListener("scroll", updateActiveMobileIdx);
        };
    }, [isLoading, displayedProjects.length, updateActiveMobileIdx]);

    React.useEffect(() => {
        if (!isLoading && typeof window !== 'undefined' && (window.location.hash === '#featured-projects' || window.location.hash === '#view-all-projects')) {
            const hashId = window.location.hash.substring(1);
            const el = document.getElementById(hashId);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [isLoading]);

    if (isLoading || projects.length === 0) {
        return (
            <SectionWrapper id="featured-projects" className="bg-[#D8E8E2] overflow-visible scroll-mt-24">
                <Container className="space-y-12 lg:space-y-16">
                    <SectionHeading
                        badge="Client Projects"
                        title="Solutions That Drive Business Growth"
                        highlight="Business Growth"
                        description="Explore a selection of digital solutions developed to solve real business challenges across different industries."
                    />
                    <CardGridSkeleton count={3} columns={3} />
                </Container>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper id="featured-projects" className="bg-[#D8E8E2] overflow-visible scroll-mt-24">
            <Container className="space-y-8 lg:space-y-12">

                {/* Section Header */}
                <SectionHeading
                    badge="Client Projects"
                    title="Solutions That Drive Business Growth"
                    highlight="Business Growth"
                    description="Explore a selection of digital solutions developed to solve real business challenges across different industries."
                    className="mb-8 lg:mb-12"
                />

                <div className="hidden lg:flex flex-col gap-6 lg:gap-8">
                    {(() => {
                        switch (layoutConfig.type) {
                            case 'single':
                                return (
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        variants={slideUp}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setActiveModalProject(layoutConfig.featured)}
                                        onKeyDown={(e: React.KeyboardEvent) => {
                                            if (e.key === 'Enter' || e.key === 'Space') {
                                                e.preventDefault();
                                                setActiveModalProject(layoutConfig.featured);
                                            }
                                        }}
                                        className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 w-full bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col lg:flex-row group"
                                    >
                                        <SingleProjectCard project={layoutConfig.featured} />
                                    </motion.div>
                                );
                            
                            case 'two-grid':
                                return (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        className="grid grid-cols-2 gap-6"
                                    >
                                        {layoutConfig.grid.map((project: any) => (
                                            <motion.div
                                                key={project.id}
                                                variants={slideUp}
                                                whileHover={{ y: -6, scale: 1.015, boxShadow: "0 20px 40px -8px rgba(107,159,145,0.18), 0 8px 16px -4px rgba(107,159,145,0.10)" }}
                                                whileTap={{ scale: 0.98, y: -2 }}
                                                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setActiveModalProject(project)}
                                                onKeyDown={(e: React.KeyboardEvent) => {
                                                    if (e.key === 'Enter' || e.key === 'Space') {
                                                        e.preventDefault();
                                                        setActiveModalProject(project);
                                                    }
                                                }}
                                                className="cursor-pointer bg-white rounded-2xl flex flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 overflow-hidden"
                                            >
                                                <GridProjectCard project={project} />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                );
                            
                            case 'three-grid':
                                return (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        className="grid grid-cols-3 gap-6"
                                    >
                                        {layoutConfig.grid.map((project: any) => (
                                            <motion.div
                                                key={project.id}
                                                variants={slideUp}
                                                whileHover={{ y: -6, scale: 1.015, boxShadow: "0 20px 40px -8px rgba(107,159,145,0.18), 0 8px 16px -4px rgba(107,159,145,0.10)" }}
                                                whileTap={{ scale: 0.98, y: -2 }}
                                                transition={{ type: "spring", stiffness: 350, damping: 22 }}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setActiveModalProject(project)}
                                                onKeyDown={(e: React.KeyboardEvent) => {
                                                    if (e.key === 'Enter' || e.key === 'Space') {
                                                        e.preventDefault();
                                                        setActiveModalProject(project);
                                                    }
                                                }}
                                                className="cursor-pointer bg-white rounded-2xl flex flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 overflow-hidden"
                                            >
                                                <GridProjectCard project={project} />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                );
                            
                            case 'featured-grid':
                                return (
                                    <>
                                        {/* Featured Project */}
                                        <motion.div
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-100px" }}
                                            variants={slideUp}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setActiveModalProject(layoutConfig.featured)}
                                            onKeyDown={(e: React.KeyboardEvent) => {
                                                if (e.key === 'Enter' || e.key === 'Space') {
                                                    e.preventDefault();
                                                    setActiveModalProject(layoutConfig.featured);
                                                }
                                            }}
                                            className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 w-full bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col lg:flex-row group"
                                        >
                                            <SingleProjectCard project={layoutConfig.featured} />
                                        </motion.div>

                                        {/* Additional Projects Grid */}
                                        {layoutConfig.grid.length > 0 && (
                                            <motion.div
                                                variants={staggerContainer}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={{ once: true, margin: "-100px" }}
                                                className={`grid gap-6 mt-1 ${
                                                    layoutConfig.grid.length === 1 
                                                        ? 'grid-cols-1' 
                                                        : layoutConfig.grid.length === 2 
                                                        ? 'grid-cols-3 justify-center' 
                                                        : 'grid-cols-3'
                                                }`}
                                            >
                                                {layoutConfig.grid.slice(0, 3).map((project: any) => (
                                                    <motion.div
                                                        key={project.id}
                                                        variants={slideUp}
                                                        whileHover={{ y: -6, scale: 1.015, boxShadow: "0 20px 40px -8px rgba(107,159,145,0.18), 0 8px 16px -4px rgba(107,159,145,0.10)" }}
                                                        whileTap={{ scale: 0.98, y: -2 }}
                                                        transition={{ type: "spring", stiffness: 350, damping: 22 }}
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => setActiveModalProject(project)}
                                                        onKeyDown={(e: React.KeyboardEvent) => {
                                                            if (e.key === 'Enter' || e.key === 'Space') {
                                                                e.preventDefault();
                                                                setActiveModalProject(project);
                                                            }
                                                        }}
                                                        className="cursor-pointer bg-white rounded-2xl flex flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 overflow-hidden"
                                                    >
                                                        <GridProjectCard project={project} />
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </>
                                );
                            
                            default:
                                return null;
                        }
                    })()}
                </div>

                {/* Mobile Native Horizontal Swipe Deck */}
                <div className="flex flex-col lg:hidden relative overflow-visible -mx-6">
                    <div
                        ref={mobileScrollRef}
                        className="flex w-full overflow-x-auto snap-x snap-mandatory pb-6 gap-4 items-stretch [&::-webkit-scrollbar]:hidden px-6"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {
                            displayedProjects.map((project: any, idx: number) => (
                                <div
                                    key={`mobile-proj-${project.id}`}
                                    data-mobile-id={idx}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setActiveModalProject(project)}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' || e.key === 'Space') {
                                            e.preventDefault();
                                            setActiveModalProject(project);
                                        }
                                    }}
                                    className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 client-project-mobile-card w-[clamp(270px,80vw,330px)] flex-shrink-0 flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100 snap-center relative scroll-ml-6"
                                >
                                    {/* Visual Placeholder Area (4:3, 0 gap) */}
                                    <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center border-b border-gray-100">
                                        {project.isConfidential ? (
                                            <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-4 select-none opacity-80 backdrop-blur-md">
                                                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-2">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-bold text-gray-700 text-[11px] mb-0.5 uppercase tracking-wider">Confidential</h4>
                                            </div>
                                        ) : project.imageUrl ? (
                                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col p-3 gap-2 bg-[#6B9F91]/5">
                                                <div className="w-full h-1/2 flex gap-2">
                                                    <div className="w-1/3 bg-white border border-gray-200 rounded-md shadow-sm" />
                                                    <div className="flex-1 bg-white border border-gray-200 rounded-md shadow-sm" />
                                                </div>
                                                <div className="w-full h-1/2 bg-white border border-gray-200 rounded-md shadow-sm" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile Card Content */}
                                    <div className="p-4 sm:p-5 flex flex-col flex-1 text-left relative z-10">
                                        <span className="w-max px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap mb-2.5">
                                            {project.industry}
                                        </span>

                                        <h3 className="font-bold text-base text-[var(--color-heading)] leading-snug mb-1.5 tracking-tight">
                                            {project.title}
                                        </h3>

                                        <div className="flex-1 min-h-0 relative mb-3">
                                            <p className="text-[var(--color-body-text)] text-xs sm:text-sm leading-relaxed overflow-hidden line-clamp-3 text-gray-600">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-2.5 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-xs font-bold text-[#6B9F91] inline-flex items-center gap-1.5">
                                                View Details
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        {/* End spacer so the last card doesn't hit the right screen edge */}
                        {!isLoading && projects.length > 0 && <div className="w-[4vw] shrink-0" />}
                    </div>

                    {/* Pagination Dots representation */}
                    <div className="w-full flex justify-center items-center gap-2.5 mt-1 mb-6 z-10 relative">
                        {(!isLoading && displayedProjects.length > 1) && displayedProjects.map((_, i) => (
                            <button
                                key={`dot-${i}`}
                                onClick={() => scrollToMobileProject(i)}
                                aria-label={`Scroll to project ${i + 1}`}
                                className={`h-2 rounded-full transition-all duration-400 ease-out ${activeMobileIdx === i ? 'bg-[#6B9F91] w-7 shadow-sm scale-100' : 'bg-gray-300 w-2 hover:bg-gray-400 scale-90'} border-none cursor-pointer focus:outline-none`}
                            />
                        ))}
                    </div>
                </div>

                {/* View All Projects Button */}
                {projects.length > 0 && (
                    <div id="view-all-projects" className="w-full flex justify-center mt-1 mb-6 scroll-mt-24">
                        <Link href="/client-projects" className="inline-flex items-center justify-center font-bold text-base text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            View All Projects
                            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}

                {/* Bottom CTA Card (Compact) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex justify-center mt-8"
                >
                    <div className="w-full max-w-4xl bg-gray-50 border border-[var(--color-border)] rounded-2xl p-8 md:p-10 text-center relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6B9F91]/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFC900]/10 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />

                        <h3 className="text-xl md:text-2xl font-bold text-[var(--color-heading)] mb-2 relative z-10 tracking-tight">
                            Have a project in mind?
                        </h3>
                        <p className="text-[var(--color-body-text)] text-sm mb-6 relative z-10 max-w-md">
                            Let's create a digital solution tailored to your business.
                        </p>
                        <Button asChild size="md" className="relative z-10 shadow-md shadow-[#6B9F91]/20 bg-[#6B9F91] hover:bg-[#588478] text-white">
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
