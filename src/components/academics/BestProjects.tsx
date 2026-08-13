"use client";

import * as React from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight, Lightbulb, Blocks, Target, Box, Sparkles, Sprout, HeartPulse, Building2, Monitor, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { X } from "lucide-react";
import Link from "next/link";

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
        <div className="w-full h-full flex flex-col bg-[#EDF5F2] group-hover:bg-white transition-colors duration-500">
            {/* Browser Header */}
            <div className="h-8 bg-white border-b border-gray-100 flex items-center px-4 gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
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
    Sparkles,
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

    // Limit to 4 maximum for the Academics page layout
    const displayedProjects = activeProjects.slice(0, 4);
    const featuredProject = displayedProjects[0];
    const secondaryProjects = displayedProjects.slice(1);

    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    const scrollToMobileProject = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".project-mobile-card");
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
            const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".project-mobile-card");
            mobileCards.forEach(c => mobileObserver.observe(c));
        }

        return () => {
            mobileObserver.disconnect();
        };
    }, []);

    return (
        <SectionWrapper id="best-projects" className="bg-white relative overflow-hidden">
            {activeProjects.length === 0 ? null : (
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
                            {/* TOP: Featured Project (Dominant) */}
                            <motion.div variants={itemVariants} className="w-full bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row group">
                                {/* Project Preview */}
                                <div className="w-full lg:w-7/12 aspect-video lg:aspect-auto lg:h-[450px] relative overflow-hidden bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100">
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
                                <div className="w-full lg:w-5/12 p-8 lg:p-12 flex flex-col bg-white">
                                    <div className="mb-6 flex justify-between items-start gap-4">
                                        {featuredProject.badge && (
                                            <Badge className="bg-[#6B9F91]/10 text-[#6B9F91] hover:bg-[#6B9F91]/20 border-none font-bold uppercase tracking-wider text-[10px]">
                                                {featuredProject.badge}
                                            </Badge>
                                        )}
                                        <Blocks className="w-6 h-6 text-gray-300 ml-auto" />
                                    </div>

                                    <h3 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{featuredProject.title}</h3>
                                    <p className="text-sm font-semibold text-[#FFC900] uppercase tracking-widest mb-4">{featuredProject.category}</p>

                                    <p className="text-gray-600 text-base leading-relaxed mb-8 flex-grow">
                                        {featuredProject.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {Array.isArray(featuredProject.tags) && featuredProject.tags.map((tag: any, i: number) => {
                                            const TagIcon = getIcon(tag.icon);
                                            return (
                                                <span key={i} className={`text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap border ${tag.colorClass}`}>
                                                    <TagIcon className="w-3 h-3" /> {tag.label}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    <Button onClick={() => setActiveModalProject(featuredProject)} className="w-full sm:w-auto bg-[#111827] text-white hover:bg-gray-800 font-bold group/btn">
                                        Explore Project <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>

                            {/* BOTTOM: 3 Project Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {secondaryProjects.map((project, idx) => (
                                    <motion.div
                                        key={project.id}
                                        variants={itemVariants}
                                        onClick={() => setActiveModalProject(project)}
                                        className={`bg-white rounded-3xl shadow-lg shadow-gray-200/40 border border-gray-100 overflow-hidden flex-col group cursor-pointer hover:-translate-y-1 transition-transform duration-300 md:last:col-span-2 lg:last:col-span-1 ${idx === 2 ? 'hidden md:flex' : 'flex'}`}
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
                                                {Array.isArray(project.tags) && project.tags.map((tag: any, i: number) => {
                                                    const TagIcon = getIcon(tag.icon);
                                                    return (
                                                        <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-transparent ${tag.colorClass}`}>
                                                            <TagIcon className="w-3 h-3" /> {tag.label}
                                                        </span>
                                                    );
                                                })}
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
                                        onClick={() => setActiveModalProject(project)}
                                        className="project-mobile-card w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-[var(--color-border)] snap-center relative scroll-ml-6 group cursor-pointer"
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
                                                {Array.isArray(project.tags) && project.tags.map((tag: any, i: number) => {
                                                    const TagIcon = getIcon(tag.icon);
                                                    return (
                                                        <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-transparent ${tag.colorClass}`}>
                                                            <TagIcon className="w-3 h-3" /> <span className="truncate">{tag.label}</span>
                                                        </span>
                                                    );
                                                })}
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
                            <div className="w-full flex justify-center mt-12 mb-4 relative z-20">
                                <Link href="/academics/student-projects" className="inline-flex items-center justify-center font-bold text-lg text-[#6B9F91] hover:text-[#588478] transition-colors group">
                                    View All Projects
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}

                    </Container>
                </>
            )}

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
                transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative w-full max-w-3xl bg-white backdrop-blur-xl border border-gray-100 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center transition-colors z-20 focus-visible:outline-none"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content Area */}
                <div
                    className="overflow-y-auto flex flex-col h-full [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {/* Header Image */}
                    <div className="w-full h-64 md:h-80 relative overflow-hidden bg-gray-50 shrink-0">
                        {project.image || project.imageUrl ? (
                            <Image
                                src={project.image || project.imageUrl}
                                alt={project.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <ProjectPreviewPlaceholder />
                        )}
                        {/* Gradient overlay for text legibility if needed, but we keep content below */}
                    </div>

                    <div className="p-6 md:p-10 flex flex-col flex-grow">
                        {/* Modal Header */}
                        <div className="mb-6 flex justify-between items-start gap-4">
                            {project.badge && (
                                <Badge className="bg-[#6B9F91]/10 text-[#6B9F91] hover:bg-[#6B9F91]/20 border-none font-bold uppercase tracking-wider text-[10px]">
                                    {project.badge}
                                </Badge>
                            )}
                        </div>

                        {/* Project Title */}
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                            {project.title}
                        </h2>

                        <p className="text-sm font-semibold text-[#FFC900] uppercase tracking-widest mb-6">
                            {project.category}
                        </p>

                        {/* Description */}
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 flex-grow whitespace-pre-wrap">
                            {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                            {parsedTags.map((tag: any, i: number) => {
                                const TagIcon = getIcon(tag.icon);
                                return (
                                    <span key={i} className={`text-xs md:text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${tag.colorClass}`}>
                                        <TagIcon className="w-3.5 h-3.5" /> {tag.label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
