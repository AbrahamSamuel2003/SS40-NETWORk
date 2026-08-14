"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, ArrowRight, Video, X, Loader2 } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { slideUp, staggerContainer, hoverLift } from "@/lib/animations";

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

export function ProductImpacts() {
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
        fetch('/api/happimonials?pageScope=PRODUCTS')
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
        <SectionWrapper id="product-impacts" className="bg-white border-t border-gray-100 !pb-0 md:!pb-0 lg:!pb-0">
            <Container className="space-y-16">

                {/* Section Header */}
                <SectionHeading
                    badge="PRODUCT IMPACTS"
                    title={
                        <>
                            Real Businesses.<br />
                            Real Product <span className="text-[#6B9F91]">Success.</span>
                        </>
                    }
                    description="See how organizations use SS40 NETWORK products to simplify operations, improve productivity, and achieve better business outcomes."
                    align="center"
                    className="mb-12 lg:mb-16"
                />

                {/* Loading / Empty State */}
                {isLoading ? (
                    <div className="py-20 flex justify-center items-center opacity-50">
                        <Loader2 className="w-8 h-8 animate-spin text-[#6B9F91]" />
                    </div>
                ) : happimonials.length === 0 ? (
                    <div className="py-20 flex justify-center items-center">
                        <p className="text-gray-500">No product impact stories available yet.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Grid */}
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
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setActiveModalStory(item)}
                                    onKeyDown={(e: React.KeyboardEvent) => {
                                        if (e.key === 'Enter' || e.key === 'Space') {
                                            e.preventDefault();
                                            setActiveModalStory(item);
                                        }
                                    }}
                                    className="cursor-pointer bg-white overflow-hidden rounded-2xl flex flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2"
                                >
                                    <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
                                        {item.youtubeUrl ? (
                                            <iframe
                                                src={getYouTubeEmbedUrl(item.youtubeUrl)}
                                                className="absolute inset-0 w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 flex items-center justify-center">
                                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                            </div>
                                        )}
                                    </div>

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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveModalStory(item);
                                            }}
                                            className="mt-auto flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] rounded-sm w-max"
                                        >
                                            Read More
                                            <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </CardMotion>
                            ))}
                        </motion.div>

                        {/* Mobile Swipe Deck */}
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
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setActiveModalStory(item)}
                                        onKeyDown={(e: React.KeyboardEvent) => {
                                            if (e.key === 'Enter' || e.key === 'Space') {
                                                e.preventDefault();
                                                setActiveModalStory(item);
                                            }
                                        }}
                                        className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2 happimonial-mobile-card w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white overflow-hidden rounded-3xl snap-center relative scroll-ml-6 border border-[var(--color-border)] shadow-xl shadow-gray-200/50"
                                    >
                                        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shrink-0">
                                            {item.youtubeUrl ? (
                                                <iframe
                                                    src={getYouTubeEmbedUrl(item.youtubeUrl)}
                                                    className="absolute inset-0 w-full h-full border-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 flex items-center justify-center">
                                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                                </div>
                                            )}
                                        </div>
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
                            <div className="w-full flex justify-center mt-8 md:mt-12 md:mb-6 mb-4">
                                <Link href="/product-impacts" className="inline-flex items-center justify-center font-bold text-lg text-[#6B9F91] hover:text-[#588478] transition-colors group">
                                    View All Stories
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Container>

            {/* Read More Modal Wrapper via AnimatePresence */}
            <AnimatePresence>
                {activeModalStory && (
                    <ProductImpactModal story={activeModalStory} onClose={() => setActiveModalStory(null)} />
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
}

// --------------------------------------------------------------------------------------
// MODAL COMPONENT (Copied structurally from Happimonials Modal logic with Products styling)
// --------------------------------------------------------------------------------------

function ProductImpactModal({ story, onClose }: { story: any; onClose: () => void }) {
    React.useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = originalStyle; };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-6 md:p-8 flex-1 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            {story.thumbnailUrl && (
                                <img src={story.thumbnailUrl} alt={story.clientName} className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm shrink-0" />
                            )}
                            <div>
                                <span className="inline-block px-3 py-1 bg-[#6B9F91]/10 text-[#6B9F91] text-xs font-bold uppercase tracking-wider rounded-md mb-2">
                                    {story.industry}
                                </span>
                                <h3 className="text-xl md:text-2xl font-bold text-[var(--color-heading)] leading-tight">{story.clientName}</h3>
                                <p className="text-sm md:text-base text-gray-500 font-medium mt-1">{story.companyName}</p>
                            </div>
                        </div>
                        <button onClick={onClose} aria-label="Close modal" className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91]">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="prose prose-sm md:prose-base prose-gray max-w-none flex-1 overflow-y-auto mb-8 pr-2">
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
                        <blockquote className="border-l-4 border-[#6B9F91] pl-4 italic text-gray-700 text-lg md:text-xl font-medium leading-relaxed my-0">
                            "{story.testimonial}"
                        </blockquote>
                    </div>

                    <div className="pt-6 border-t border-gray-100 mt-auto flex justify-end">
                        <Button variant="outline" onClick={onClose} className="rounded-xl font-semibold">
                            Close Story
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
