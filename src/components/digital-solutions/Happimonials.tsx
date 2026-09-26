"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, ArrowRight, Video, X } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { YouTubeResumeThumbnailPlayer } from "@/components/ui/YouTubeResumeThumbnailPlayer";
import { slideUp, staggerContainer, hoverLift } from "@/lib/animations";
import { scrollChildIntoContainer } from "@/utils/scroll";
import { CardGridSkeleton } from "@/components/ui/Skeleton";

const HAPPIMONIALS_DATA = []; // Removed: using dynamic API data now

function getYouTubeEmbedUrl(url: string) {
    if (!url) return '';
    try {
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1]?.split('&')[0];
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        } else if (url.includes('shorts/')) {
            videoId = url.split('shorts/')[1]?.split('?')[0];
        }

        // Strip any remaining hashes or parameters that might have bypassed the split
        if (videoId) {
            videoId = videoId.split('#')[0];
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
        return url;
    }
}


interface HappimonialsProps {
    initialData?: any[];
}

export function Happimonials({ initialData }: HappimonialsProps = {}) {
    const [happimonials, setHappimonials] = React.useState<any[]>(Array.isArray(initialData) ? initialData : []);
    const [isLoading, setIsLoading] = React.useState(!initialData || (Array.isArray(initialData) && initialData.length === 0));
    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const [activeModalStory, setActiveModalStory] = React.useState<any | null>(null);

    const mobileScrollRef = React.useRef<HTMLDivElement>(null);
    
    // Adaptive layout: determine layout type based on content count and featured status
    const layoutConfig = React.useMemo(() => {
        const safeHappimonials = Array.isArray(happimonials) ? happimonials : [];
        if (safeHappimonials.length === 0) return { type: 'empty', featured: null, grid: [] };
        
        // If there's a featured item, use featured-grid layout regardless of count
        const featuredItem = safeHappimonials.find(h => h && h.isFeatured);
        if (featuredItem) {
            const gridItems = safeHappimonials.filter(h => h && h.id !== featuredItem.id);
            return { type: 'featured-grid', featured: featuredItem, grid: gridItems };
        }
        
        // No featured item - use count-based layouts
        if (safeHappimonials.length === 1) return { type: 'single', featured: safeHappimonials[0], grid: [] };
        if (safeHappimonials.length === 2) return { type: 'two-grid', featured: null, grid: safeHappimonials };
        if (safeHappimonials.length === 3) return { type: 'three-grid', featured: null, grid: safeHappimonials };
        
        // 4+ items with no featured: use first item as featured
        const defaultFeatured = safeHappimonials[0];
        const gridItems = safeHappimonials.slice(1);
        return { type: 'featured-grid', featured: defaultFeatured, grid: gridItems };
    }, [happimonials]);

    const displayedHappimonials = React.useMemo(() => {
        if (layoutConfig.type === 'featured-grid') {
            return [layoutConfig.featured, ...(layoutConfig.grid || []).slice(0, 3)].filter(Boolean);
        }
        return (layoutConfig.grid && layoutConfig.grid.length > 0) ? layoutConfig.grid : [layoutConfig.featured].filter(Boolean);
    }, [layoutConfig]);

    const scrollToMobileTestimonial = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".happimonial-mobile-card");
        const card = mobileCards[idx];
        if (!card) return;

        scrollChildIntoContainer(mobileScrollRef.current, card, "smooth");
    };

    React.useEffect(() => {
        if (initialData && Array.isArray(initialData) && initialData.length > 0) {
            setHappimonials(initialData);
            setIsLoading(false);
            return;
        }

        fetch('/api/happimonials?pageScope=DIGITAL_SOLUTIONS')
            .then(res => res.json())
            .then(data => {
                if (data && data.success && Array.isArray(data.data)) setHappimonials(data.data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [initialData]);

    React.useEffect(() => {
        if (isLoading || displayedHappimonials.length === 0) return;
        if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;

        setActiveMobileIdx(0);

        const mobileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry && entry.isIntersecting) {
                    const id = entry.target.getAttribute("data-mobile-id");
                    if (id !== null) {
                        setActiveMobileIdx(Number(id));
                    }
                }
            });
        }, { root: mobileScrollRef.current, threshold: 0.6 });

        if (mobileScrollRef.current) {
            const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".happimonial-mobile-card");
            mobileCards.forEach(c => {
                if (c) mobileObserver.observe(c);
            });
            mobileScrollRef.current.scrollLeft = 0;
        }

        return () => {
            mobileObserver.disconnect();
        };
    }, [isLoading, displayedHappimonials.length]);

    React.useEffect(() => {
        const scrollToTarget = () => {
            if (typeof window !== 'undefined') {
                const hash = window.location.hash;
                if (hash === '#happimonials' || hash === '#view-all-happimonials') {
                    const hashId = hash.substring(1);
                    const el = document.getElementById(hashId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        };

        if (!isLoading) {
            scrollToTarget();
            const t1 = setTimeout(scrollToTarget, 100);
            const t2 = setTimeout(scrollToTarget, 350);
            const t3 = setTimeout(scrollToTarget, 700);
            const t4 = setTimeout(scrollToTarget, 1200);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
                clearTimeout(t4);
            };
        }
    }, [isLoading]);

    return (
        <SectionWrapper id="happimonials" className="bg-white !pb-0 md:!pb-0 lg:!pb-0 scroll-mt-24">
            <Container>

                {/* Section Header */}
                <SectionHeading
                    badge="Happimonials"
                    title="Real Businesses. Real Success Stories."
                    description="Discover how organizations have transformed their businesses through tailored digital solutions delivered by SS40 NETWORK."
                    className="mb-12 lg:mb-16"
                />

                {/* Loading / Empty State */}
                {isLoading || happimonials.length === 0 ? (
                    <CardGridSkeleton count={3} columns={3} />
                ) : (
                    <>
                        {layoutConfig.type === 'featured-grid' && layoutConfig.featured && (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={slideUp}
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                    if ((e.target as HTMLElement).closest("[data-video-player]")) return;
                                    setActiveModalStory(layoutConfig.featured);
                                }}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter' || e.key === 'Space') {
                                        e.preventDefault();
                                        setActiveModalStory(layoutConfig.featured);
                                    }
                                }}
                                className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 w-full bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col lg:flex-row group mb-6 lg:mb-8"
                            >
                                {/* Featured Happimonial Video/Thumbnail */}
                                <div className="w-full lg:w-7/12 aspect-video lg:aspect-auto bg-gray-900 relative overflow-hidden shrink-0 min-h-[260px]">
                                    {layoutConfig.featured.youtubeUrl ? (
                                        <div data-video-player className="w-full h-full">
                                            <YouTubeResumeThumbnailPlayer
                                                youtubeUrl={layoutConfig.featured.youtubeUrl}
                                                title={layoutConfig.featured.clientName}
                                                className="w-full h-full"
                                                iframeClassName="absolute inset-0 w-full h-full border-0 z-0"
                                            />
                                        </div>
                                    ) : layoutConfig.featured.thumbnailUrl ? (
                                        <img src={layoutConfig.featured.thumbnailUrl} alt={layoutConfig.featured.clientName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 flex items-center justify-center">
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Featured Happimonial Content */}
                                <div className="w-full lg:w-5/12 p-6 lg:p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        {layoutConfig.featured.thumbnailUrl && !layoutConfig.featured.youtubeUrl && (
                                            <img src={layoutConfig.featured.thumbnailUrl} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-[#6B9F91]/20" />
                                        )}
                                        <div>
                                            <h3 className="text-lg lg:text-xl font-bold text-[var(--color-heading)]">{layoutConfig.featured.clientName}</h3>
                                            <p className="text-sm text-[var(--color-body-text)]">{layoutConfig.featured.companyName}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm lg:text-base text-[var(--color-body-text)] line-clamp-4 leading-relaxed mb-6 flex-1">
                                        "{layoutConfig.featured.testimonial}"
                                    </p>
                                    <div className="mt-auto flex items-center gap-2 text-[#6B9F91] font-bold text-sm group-hover:text-[#588478]">
                                        Read Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Grid */}
                        {layoutConfig.grid.length > 0 && (
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                className={`hidden md:grid gap-6 lg:gap-8 ${
                                    layoutConfig.grid.length === 1 
                                        ? 'md:grid-cols-1' 
                                        : layoutConfig.grid.length === 2 
                                        ? 'md:grid-cols-2 lg:grid-cols-3 justify-center' 
                                        : 'md:grid-cols-2 lg:grid-cols-3'
                                }`}
                            >
                                {layoutConfig.grid.slice(0, 3).map((item) => (
                                <motion.div
                                    key={item.id}
                                    variants={slideUp}
                                    whileHover={{ y: -6, scale: 1.015, boxShadow: "0 20px 40px -8px rgba(107,159,145,0.18), 0 8px 16px -4px rgba(107,159,145,0.10)" }}
                                    whileTap={{ scale: 0.98, y: -2 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest("[data-video-player]")) return;
                                        setActiveModalStory(item);
                                    }}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' || e.key === 'Space') {
                                            e.preventDefault();
                                            setActiveModalStory(item);
                                        }
                                    }}
                                    className="cursor-pointer bg-white rounded-2xl flex flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/40 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 overflow-hidden"
                                >
                                    {/* Video: flushed to top/left/right of card with matching rounded corners */}
                                    <div className="relative w-full aspect-video bg-gray-900 shrink-0">
                                        {item.youtubeUrl ? (
                                            <div data-video-player className="w-full h-full">
                                                <YouTubeResumeThumbnailPlayer
                                                    youtubeUrl={item.youtubeUrl}
                                                    title={item.clientName}
                                                    className="w-full h-full"
                                                    iframeClassName="absolute inset-0 w-full h-full border-0 z-0"
                                                />
                                            </div>
                                        ) : item.thumbnailUrl ? (
                                            <>
                                                <img src={item.thumbnailUrl} alt={item.clientName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/10 group-hover:bg-gray-900/30 transition-colors duration-300">
                                                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-[#6B9F91] group-hover:scale-110 group-hover:bg-[#6B9F91] group-hover:text-white transition-all duration-300 ease-out z-10">
                                                        <Play className="w-6 h-6 ml-1 fill-current" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 flex items-center justify-center">
                                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5 md:p-6 flex flex-col flex-1">
                                        {/* Large quote mark */}
                                        <span className="text-5xl font-serif leading-none text-[#6B9F91]/20 select-none mb-1">&ldquo;</span>

                                        <p className="text-[var(--color-body-text)] text-sm italic flex-1 leading-relaxed line-clamp-3 mb-5 text-gray-600 -mt-2">
                                            {item.testimonial}
                                        </p>

                                        {/* Client signature row */}
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                {item.thumbnailUrl && (
                                                    <img src={item.thumbnailUrl} alt={item.clientName} className="w-8 h-8 rounded-full object-cover border border-gray-100 shadow-sm shrink-0" />
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-[var(--color-heading)] leading-tight truncate">{item.clientName}</p>
                                                    <p className="text-[11px] font-medium text-gray-400 truncate">{item.companyName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="px-2 py-0.5 bg-[#6B9F91]/10 text-[#6B9F91] text-[9px] font-bold uppercase tracking-wider rounded whitespace-nowrap">
                                                    {item.industry}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveModalStory(item);
                                                    }}
                                                    className="flex items-center text-xs font-bold text-[#6B9F91] hover:text-[#588478] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] rounded-sm"
                                                >
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                        )}

                        {/* Mobile Native Horizontal Swipe Deck */}
                        <div className="flex flex-col md:hidden relative overflow-visible -mx-6 mt-2">
                            <div
                                ref={mobileScrollRef}
                                className="flex w-full overflow-x-auto snap-x snap-mandatory pb-8 gap-5 items-stretch [&::-webkit-scrollbar]:hidden px-6"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {!isLoading && displayedHappimonials.map((item, idx) => (
                                    <div
                                        key={`mobile-${item.id}`}
                                        data-mobile-id={idx}
                                        role="button"
                                        tabIndex={0}
                                        onClick={(e) => {
                                            if ((e.target as HTMLElement).closest("[data-video-player]")) return;
                                            setActiveModalStory(item);
                                        }}
                                        onKeyDown={(e: React.KeyboardEvent) => {
                                            if (e.key === 'Enter' || e.key === 'Space') {
                                                e.preventDefault();
                                                setActiveModalStory(item);
                                            }
                                        }}
                                        className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 happimonial-mobile-card w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white overflow-hidden rounded-3xl snap-center relative scroll-ml-6 border border-[var(--color-border)] shadow-xl shadow-gray-200/50"
                                    >
                                        {/* Video Area (Optimized spacing: taller 4:3 fit) */}
                                        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
                                            {item.youtubeUrl ? (
                                                <div data-video-player className="w-full h-full">
                                                    <YouTubeResumeThumbnailPlayer
                                                        youtubeUrl={item.youtubeUrl}
                                                        title={item.clientName}
                                                        className="w-full h-full"
                                                        iframeClassName="absolute inset-0 w-full h-full border-0 z-0"
                                                    />
                                                </div>
                                            ) : item.thumbnailUrl ? (
                                                <>
                                                    <img src={item.thumbnailUrl} alt={item.clientName} className="absolute inset-0 w-full h-full object-cover" />
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/10">
                                                        <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#6B9F91] mb-3">
                                                            <Play className="w-5 h-5 ml-1 fill-current" />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-gray-900 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full inline-block shadow-sm uppercase tracking-wider">
                                                            Watch Story
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 flex items-center justify-center">
                                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Area (Reduced padding) */}
                                        <div className="p-5 flex flex-col flex-1 text-left relative z-10 bg-white">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    {item.thumbnailUrl && (
                                                        <img src={item.thumbnailUrl} alt={item.clientName} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm shrink-0" />
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold text-lg text-[var(--color-heading)] leading-tight tracking-tight">{item.clientName}</h3>
                                                        <p className="text-xs font-medium text-gray-500 mt-0.5">{item.companyName}</p>
                                                    </div>
                                                </div>
                                                <span className="w-max px-2.5 py-1 bg-[#6B9F91]/10 text-[#6B9F91] text-[9px] font-bold uppercase tracking-wider rounded whitespace-nowrap">
                                                    {item.industry}
                                                </span>
                                            </div>
                                            <p className="text-[var(--color-body-text)] text-sm italic leading-relaxed line-clamp-3 mb-4 text-gray-600">
                                                "{item.testimonial}"
                                            </p>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveModalStory(item);
                                                }}
                                                className="mt-auto flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] rounded-sm w-max"
                                            >
                                                Read More
                                                <ArrowRight className="w-4 h-4 ml-1.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="w-[4vw] shrink-0" />
                            </div>

                            {/* Pagination Dots */}
                            {!isLoading && displayedHappimonials.length > 1 && (
                                <div className="w-full flex justify-center items-center gap-3 mt-2 mb-8 z-10 relative">
                                    {displayedHappimonials.map((_, i) => (
                                        <button
                                            key={`mob-dot-${i}`}
                                            onClick={() => scrollToMobileTestimonial(i)}
                                            aria-label={`View testimonial ${i + 1}`}
                                            className={`h-2.5 rounded-full transition-all duration-400 ease-out ${activeMobileIdx === i ? 'bg-[#6B9F91] w-8 shadow-sm scale-100' : 'bg-gray-300 w-2.5 hover:bg-gray-400 scale-90'} border-none cursor-pointer`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* View All Button */}
                        {!isLoading && happimonials.length > 3 && (
                            <div id="view-all-happimonials" className="w-full flex justify-center mt-8 md:mt-12 md:mb-6 mb-4 scroll-mt-24">
                                <Link href="/happimonials" className="inline-flex items-center justify-center font-bold text-lg text-[#6B9F91] hover:text-[#588478] transition-colors group">
                                    View All Stories
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </>
                )}

            </Container>

            {/* Read More Modal */}
            <AnimatePresence>
                {activeModalStory && (
                    <HappimonialModal story={activeModalStory} onClose={() => setActiveModalStory(null)} />
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
}

// ============================================================================
// MODAL COMPONENT (Follows exact SuccessStories interaction pattern)
// ============================================================================
function HappimonialModal({ story, onClose }: { story: any, onClose: () => void }) {
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
                    className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center transition-colors z-10 focus-visible:outline-none"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content Area */}
                <div
                    className="overflow-y-auto px-6 py-8 md:px-10 md:py-10 flex flex-col h-full [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {/* Header info */}
                    <div className="flex items-center gap-4 mb-8 shrink-0 pb-6 border-b border-gray-100">
                        {story.thumbnailUrl ? (
                            <img src={story.thumbnailUrl} alt={story.clientName} className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm shrink-0" />
                        ) : (
                            <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 p-[2px]">
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                    <span className="text-gray-500 font-bold text-lg">{story.clientName.charAt(0)}</span>
                                </div>
                            </div>
                        )}
                        <div className="pr-12">
                            <h3 className="font-bold text-xl text-[#111827]">{story.clientName}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="font-semibold text-gray-600 text-sm">
                                    {story.companyName}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="px-2 py-0.5 bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-wider rounded">
                                    {story.industry}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial body */}
                    <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
                        {story.youtubeUrl && (
                            <div className="relative w-full aspect-[16/9] mb-6 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                                <YouTubeResumeThumbnailPlayer
                                    youtubeUrl={story.youtubeUrl}
                                    title={story.clientName}
                                    className="w-full h-full"
                                    iframeClassName="absolute inset-0 w-full h-full border-0 z-0"
                                />
                            </div>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap italic">
                            "{story.testimonial}"
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

