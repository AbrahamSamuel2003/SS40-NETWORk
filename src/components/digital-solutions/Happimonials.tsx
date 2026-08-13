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
import { slideUp, staggerContainer, hoverLift } from "@/lib/animations";

import { Loader2 } from "lucide-react";

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


export function Happimonials() {
    const [happimonials, setHappimonials] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const [activeModalStory, setActiveModalStory] = React.useState<any | null>(null);

    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    const scrollToMobileTestimonial = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".happimonial-mobile-card");
        const card = mobileCards[idx];
        if (!card) return;

        card.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
        });
    };

    React.useEffect(() => {
        fetch('/api/happimonials?pageScope=DIGITAL_SOLUTIONS')
            .then(res => res.json())
            .then(data => {
                if (data.success) setHappimonials(data.data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));

        const mobileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveMobileIdx(Number(entry.target.getAttribute("data-mobile-id")));
                }
            });
        }, { root: mobileScrollRef.current, threshold: 0.6 });

        if (mobileScrollRef.current) {
            const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".happimonial-mobile-card");
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
        <SectionWrapper id="happimonials" className="bg-white !pb-0 md:!pb-0 lg:!pb-0">
            <Container>

                {/* Section Header */}
                <SectionHeading
                    badge="Happimonials"
                    title="Real Businesses. Real Success Stories."
                    description="Discover how organizations have transformed their businesses through tailored digital solutions delivered by SS40 NETWORK."
                    className="mb-12 lg:mb-16"
                />

                {/* Loading / Empty State */}
                {isLoading ? (
                    <div className="py-20 flex justify-center items-center opacity-50">
                        <Loader2 className="w-8 h-8 animate-spin text-[#6B9F91]" />
                    </div>
                ) : happimonials.length === 0 ? (
                    <div className="py-20 flex justify-center items-center">
                        <p className="text-gray-500">No client stories available yet.</p>
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                        >
                            {happimonials.slice(0, 3).map((item) => (
                                <CardMotion
                                    key={item.id}
                                    variants={slideUp}
                                    {...hoverLift}
                                    className="bg-white overflow-hidden rounded-2xl flex flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/30 transition-all duration-300"
                                >
                                    {/* Video / Thumbnail Area (Optimized Spacing: full width, no padding, taller 4:3 fit) */}
                                    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shrink-0 cursor-pointer">
                                        {item.youtubeUrl ? (
                                            <iframe
                                                src={getYouTubeEmbedUrl(item.youtubeUrl)}
                                                className="absolute inset-0 w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : item.thumbnailUrl ? (
                                            <>
                                                <img src={item.thumbnailUrl} alt={item.clientName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/10 group-hover:bg-gray-900/30 transition-colors duration-300">
                                                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-[#6B9F91] group-hover:scale-110 group-hover:bg-[#6B9F91] group-hover:text-white transition-all duration-300 ease-out z-10 mb-4">
                                                        <Play className="w-6 h-6 ml-1 fill-current" />
                                                    </div>
                                                    <div className="text-center z-10">
                                                        <p className="text-xs font-bold text-gray-900 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full inline-block shadow-md uppercase tracking-wider">
                                                            Client Story
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center">
                                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Area (Reduced padding, tight spacing) */}
                                    <div className="p-5 md:p-6 flex flex-col flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {item.thumbnailUrl && (
                                                    <img src={item.thumbnailUrl} alt={item.clientName} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm shrink-0" />
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-lg text-[var(--color-heading)] leading-tight tracking-tight">{item.clientName}</h3>
                                                    <p className="text-sm font-medium text-gray-500 mt-0.5">{item.companyName}</p>
                                                </div>
                                            </div>
                                            <span className="px-2.5 py-1 bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap">
                                                {item.industry}
                                            </span>
                                        </div>

                                        <p className="text-[var(--color-body-text)] text-sm italic flex-1 leading-relaxed line-clamp-3 mb-4 text-gray-600">
                                            "{item.testimonial}"
                                        </p>

                                        <button
                                            onClick={() => setActiveModalStory(item)}
                                            className="mt-auto flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] rounded-sm w-max"
                                        >
                                            Read More
                                            <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </CardMotion>
                            ))}
                        </motion.div>

                        {/* Mobile Native Horizontal Swipe Deck */}
                        <div className="flex flex-col md:hidden relative overflow-visible -mx-6 mt-2">
                            <div
                                ref={mobileScrollRef}
                                className="flex w-full overflow-x-auto snap-x snap-mandatory pb-8 gap-5 items-stretch [&::-webkit-scrollbar]:hidden px-6"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {!isLoading && happimonials.slice(0, 3).map((item, idx) => (
                                    <div
                                        key={`mobile-${item.id}`}
                                        data-mobile-id={idx}
                                        className="happimonial-mobile-card w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white overflow-hidden rounded-3xl snap-center relative scroll-ml-6 border border-[var(--color-border)] shadow-xl shadow-gray-200/50"
                                    >
                                        {/* Video Area (Optimized spacing: taller 4:3 fit) */}
                                        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
                                            {item.youtubeUrl ? (
                                                <iframe
                                                    src={getYouTubeEmbedUrl(item.youtubeUrl)}
                                                    className="absolute inset-0 w-full h-full border-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
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
                                                onClick={() => setActiveModalStory(item)}
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
                            {!isLoading && happimonials.length > 0 && (
                                <div className="w-full flex justify-center items-center gap-3 mt-2 mb-8 z-10 relative">
                                    {happimonials.map((_, i) => (
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
                            <div className="w-full flex justify-center mt-2 mb-10">
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
                                <iframe
                                    src={getYouTubeEmbedUrl(story.youtubeUrl)}
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
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
