"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play, Star, ArrowRight, Quote, ChevronLeft, ChevronRight, X, Sparkles, CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from "@/components/ui/YouTubeResumeThumbnailPlayer";
import { StoryGridSkeleton } from "@/components/ui/Skeleton";

// Elegant stagger entrance sequence
const entranceStagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.08,
        }
    }
};

const fadeUpAnim: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } }
};

export function SuccessStories({ data = [] }: { data?: any[] }) {
    if (!data || data.length === 0) {
        return (
            <SectionWrapper id="success-stories" className="bg-[#D8E8E2] overflow-hidden">
                <Container className="space-y-12 lg:space-y-16">
                    <div>
                        <SectionHeading
                            badge="Success Stories"
                            title="Built on trust. Driven by results."
                            description="Real partnerships. Real outcomes. Discover how SS40 NETWORK helps businesses and learners grow through technology, products, and education."
                        />
                    </div>
                    <StoryGridSkeleton />
                </Container>
            </SectionWrapper>
        );
    }

    // Featured = story that has youtubeUrl or videoUrl
    const featuredStoryRaw = data.find((s: any) => s.youtubeUrl || s.videoUrl);
    const secondaryStoriesRaw = featuredStoryRaw 
        ? data.filter((s: any) => s.id !== featuredStoryRaw.id) 
        : data;

    const finalFeaturedStory = featuredStoryRaw ? {
        clientName: featuredStoryRaw.clientName,
        company: featuredStoryRaw.companyName,
        quote: featuredStoryRaw.testimonial,
        link: "/digital-solutions",
        youtubeUrl: featuredStoryRaw.youtubeUrl || null,
        videoUrl: featuredStoryRaw.videoUrl || null,
        thumbnailUrl: featuredStoryRaw.thumbnailUrl || null
    } : null;

    const secondaryStories = secondaryStoriesRaw.map((s: any) => ({
        id: s.id,
        clientName: s.clientName,
        company: s.companyName,
        quote: s.testimonial,
        route: s.route || "/digital-solutions",
        thumbnailUrl: s.thumbnailUrl || null
    }));

    // Modal state lifted here to avoid CSS perspective trapping fixed elements
    const [activeModalStory, setActiveModalStory] = useState<{
        clientName: string;
        company: string;
        quote: string;
        route: string;
    } | null>(null);

    return (
        <SectionWrapper id="success-stories" className="bg-[#D8E8E2] overflow-hidden relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#6B9F91]/10 rounded-full blur-3xl pointer-events-none" />

            <Container className="space-y-12 lg:space-y-16 relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <SectionHeading
                        badge="Success Stories"
                        title="Built on trust. Driven by results."
                        description="Real partnerships. Real outcomes. Discover how SS40 NETWORK helps businesses and learners grow through technology, products, and education."
                    />
                </motion.div>

                {/* Main Dynamic Layout */}
                {finalFeaturedStory ? (
                    /* === LAYOUT A: Featured Video Story === */
                    secondaryStories.length === 0 ? (
                        /* Single Compact Video Centerpiece (~75% screen height budget) */
                        <motion.div
                            variants={entranceStagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="w-full max-w-3xl mx-auto flex flex-col relative z-20"
                        >
                            <FeaturedVideoArea story={finalFeaturedStory} onOpenModal={(story) => setActiveModalStory(story)} />
                        </motion.div>
                    ) : (
                        /* Video + Adjacent Carousel */
                        <motion.div
                            variants={entranceStagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch"
                        >
                            <div className="lg:col-span-2 flex flex-col relative z-20 h-full">
                                <FeaturedVideoArea story={finalFeaturedStory} onOpenModal={(story) => setActiveModalStory(story)} />
                            </div>

                            <div className="lg:col-span-1 flex flex-col relative z-10 h-full">
                                <SecondaryStoryCarousel stories={secondaryStories} onOpenModal={(story) => setActiveModalStory(story)} />
                            </div>
                        </motion.div>
                    )
                ) : (
                    /* === LAYOUT B: Text Testimonials Multi-Card Showcase (Grid / Carousel) === */
                    <motion.div
                        variants={entranceStagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="w-full max-w-6xl mx-auto"
                    >
                        <TestimonialsShowcase stories={secondaryStories} onOpenModal={(story) => setActiveModalStory(story)} />
                    </motion.div>
                )}

            </Container>

            {/* Reading Modal */}
            <AnimatePresence>
                {activeModalStory && (
                    <StoryModal story={activeModalStory} onClose={() => setActiveModalStory(null)} />
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
}

// ============================================================================
// FEATURED VIDEO STORY COMPONENT
// ============================================================================

function FeaturedVideoArea({ story, onOpenModal }: {
    story: {
        clientName: string;
        company: string;
        quote: string;
        link: string;
        youtubeUrl: string | null;
        videoUrl: string | null;
        thumbnailUrl: string | null;
    };
    onOpenModal?: (story: any) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics for subtle 3D tilt
    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [2, -2]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-2, 2]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const videoId = story.youtubeUrl ? getYouTubeVideoId(story.youtubeUrl) : null;
    const resolvedThumbnail = getYouTubeThumbnailUrl(story.youtubeUrl || "", null);

    function postPlayerCommand(func: string) {
        try {
            iframeRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func, args: [] }),
                '*'
            );
        } catch { }
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current || isPlaying) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;
        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    // YouTube IFrame API state listener
    useEffect(() => {
        if (!story.youtubeUrl) return;

        function onMessage(event: MessageEvent) {
            try {
                if (!event.data || (event.origin !== 'https://www.youtube.com' && event.origin !== 'https://www.youtube-nocookie.com')) return;

                const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

                if (msg?.event === 'onStateChange' && typeof msg.info === 'number') {
                    setIsPlaying(msg.info === 1 || msg.info === 3);
                } else if (msg?.event === 'infoDelivery' && msg?.info?.playerState !== undefined) {
                    setIsPlaying(msg.info.playerState === 1 || msg.info.playerState === 3);
                }
            } catch { }
        }

        window.addEventListener('message', onMessage);
        return () => window.removeEventListener('message', onMessage);
    }, [story.youtubeUrl]);

    const handleTogglePlay = () => {
        if (story.youtubeUrl) {
            if (!isPlaying) {
                postPlayerCommand('playVideo');
                setIsPlaying(true);
            }
        } else if (videoRef.current) {
            if (!isPlaying) {
                videoRef.current.play().catch((error) => {
                    console.warn("Video playback was intercepted or failed to load source:", error);
                    setIsPlaying(true);
                });
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <motion.div
            variants={fadeUpAnim}
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: isPlaying ? 0 : rotateX,
                rotateY: isPlaying ? 0 : rotateY,
                transformStyle: "preserve-3d"
            }}
            onClick={handleTogglePlay}
            className={`relative w-full aspect-video bg-gray-950 rounded-3xl overflow-hidden flex flex-col items-center justify-center group shadow-2xl shadow-gray-400/30 border border-white/80 ${isPlaying ? 'cursor-auto' : 'cursor-pointer'}`}
        >
            {/* Native HTML5 Video Element */}
            {!story.youtubeUrl && (
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    controls={isPlaying}
                    playsInline
                    preload="metadata"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    src={story.videoUrl ?? undefined}
                />
            )}

            {/* YouTube iframe embed */}
            {story.youtubeUrl && videoId && (
                <iframe
                    ref={iframeRef}
                    className="absolute inset-0 w-full h-full z-0"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&playsinline=1`}
                    title="Success story video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    onLoad={(e) => {
                        try {
                            e.currentTarget.contentWindow?.postMessage(
                                JSON.stringify({ event: 'listening', id: 1 }),
                                '*'
                            );
                        } catch { }
                    }}
                />
            )}

            {/* Thumbnail Overlay */}
            <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t from-black/75 via-black/25 to-black/30 z-10 transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-65'}`} />
            {resolvedThumbnail && (
                <div className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-500 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <Image
                        src={resolvedThumbnail}
                        alt={story.clientName || ""}
                        fill
                        sizes="(max-width: 1024px) 100vw, 768px"
                        className="object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            )}

            {/* Premium Play Button */}
            <motion.button
                animate={{
                    opacity: isPlaying ? 0 : 1,
                    scale: isPlaying ? 0.8 : 1,
                    pointerEvents: isPlaying ? "none" : "auto"
                }}
                style={{ translateZ: 20 }}
                className="relative z-20 w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full bg-white/95 backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#1F3D35] group-hover:scale-110 group-hover:text-[#0F766E] transition-all duration-300 border-2 border-white -translate-y-2 md:translate-y-0"
                aria-label="Play testimonial video"
            >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-0.5 md:ml-1 fill-current drop-shadow-sm" />
                <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"
                />
            </motion.button>

            {/* Floating Glassmorphic Teaser Panel (Click to view full story overlay) */}
            <motion.div
                onClick={(e) => {
                    e.stopPropagation(); // Prevents video play/pause
                    if (onOpenModal) {
                        onOpenModal({
                            clientName: story.clientName,
                            company: story.company,
                            quote: story.quote,
                            link: story.link,
                            thumbnailUrl: story.thumbnailUrl
                        });
                    }
                }}
                animate={{
                    opacity: isPlaying ? 0 : 1,
                    y: isPlaying ? 20 : 0,
                    pointerEvents: isPlaying ? "none" : "auto"
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 md:inset-x-5 md:bottom-5 z-20 rounded-xl md:rounded-2xl overflow-hidden border border-white/60 shadow-xl bg-white/95 backdrop-blur-xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:p-5 text-left max-h-[22%] md:max-h-none flex flex-col justify-center cursor-pointer hover:bg-white hover:border-[#6B9F91]/40 hover:shadow-2xl transition-all duration-200 group/teaser"
            >
                {/* Header: Stars & Badge */}
                <div className="flex items-center justify-between gap-1.5 md:gap-2 mb-0.5 md:mb-2">
                    <div className="flex gap-0.5 md:gap-1 text-[#FFC900]">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 fill-current drop-shadow-xs" />
                        ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] md:text-[11px] font-bold text-[#0F766E] bg-[#D8E8E2] px-2 py-0.5 md:px-3 rounded-full uppercase tracking-wider truncate max-w-[150px] sm:max-w-none">
                        <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#0F766E] shrink-0" />
                        <span className="truncate">{story.company || story.clientName || "Client Story"}</span>
                    </span>
                </div>

                {/* Quote */}
                <p className="font-bold text-[#111827] italic leading-tight text-[11px] sm:text-xs md:text-base line-clamp-1 md:line-clamp-2">
                    &ldquo;{story.quote}&rdquo;
                </p>

                {/* Author attribution */}
                <p className="hidden md:block text-xs font-semibold text-[#4B5563] mt-1.5">
                    — {story.clientName}
                </p>
            </motion.div>
        </motion.div>
    );
}

// ============================================================================
// SECONDARY STORY CAROUSEL (When video is present)
// ============================================================================

function SecondaryStoryCarousel({ stories, onOpenModal }: { stories: any[], onOpenModal: (story: any) => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!stories || stories.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
        }, 4500);
        return () => clearInterval(timer);
    }, [stories]);

    if (!stories || stories.length === 0) return null;
    const story = stories[currentIndex];
    const quote = story.testimonial || story.quote;
    const company = story.companyName || story.company;
    const route = story.route || "/digital-solutions";

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
    };

    return (
        <motion.div
            variants={fadeUpAnim}
            onClick={() => onOpenModal({ clientName: story.clientName, company, quote, route })}
            className="cursor-pointer bg-white rounded-3xl border border-gray-100/90 shadow-xl shadow-gray-300/40 hover:shadow-2xl hover:border-[#6B9F91]/50 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden h-full min-h-[380px] group"
        >
            {/* Top Bar with Stars & Chevrons */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-1 text-[#FFC900]">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-4 h-4 fill-current drop-shadow-xs" />
                        ))}
                    </div>
                    {stories.length > 1 && (
                        <div className="flex items-center gap-1.5 z-10" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={prevSlide}
                                aria-label="Previous story"
                                className="w-8 h-8 rounded-full bg-[#D8E8E2]/60 hover:bg-[#D8E8E2] text-[#1F3D35] flex items-center justify-center transition-colors shadow-xs"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={nextSlide}
                                aria-label="Next story"
                                className="w-8 h-8 rounded-full bg-[#D8E8E2]/60 hover:bg-[#D8E8E2] text-[#1F3D35] flex items-center justify-center transition-colors shadow-xs"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Quote Content */}
                <div className="relative mb-5">
                    <Quote className="w-9 h-9 text-[#6B9F91]/25 mb-3 -scale-x-100" />
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentIndex}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                            className="text-base sm:text-lg text-[#111827] font-semibold italic leading-relaxed line-clamp-4"
                        >
                            &ldquo;{quote}&rdquo;
                        </motion.p>
                    </AnimatePresence>
                </div>

                <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3D35] bg-[#D8E8E2]/60 group-hover:bg-[#D8E8E2] group-hover:text-[#0F766E] px-3 py-1.5 rounded-lg transition-all">
                        Read Full Story
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </div>
            </div>

            {/* Author Footer */}
            <div className="flex items-center gap-4 pt-5 border-t border-gray-100 mt-6">
                <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-[#6B9F91] to-[#D8E8E2] p-0.5 shadow-sm">
                    {story.thumbnailUrl ? (
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                            <Image src={story.thumbnailUrl} alt={story.clientName} fill sizes="48px" className="object-cover" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#1F3D35] font-extrabold text-base">
                            {story.clientName?.charAt(0) || "C"}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#111827] text-base truncate">{story.clientName}</p>
                    <p className="text-xs font-bold text-[#0F766E] truncate uppercase tracking-wider">
                        {company || "Partner Client"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// TESTIMONIALS SHOWCASE (When NO video exists - Dynamic Multi-Card Grid / Carousel)
// ============================================================================

function TestimonialsShowcase({ stories, onOpenModal }: { stories: any[], onOpenModal: (story: any) => void }) {
    const [pageIndex, setPageIndex] = useState(0);
    const isMultiPage = stories.length > 3;
    const itemsPerPage = 3;
    const totalPages = Math.ceil(stories.length / itemsPerPage);

    const displayedStories = isMultiPage 
        ? stories.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
        : stories;

    const gridCols = stories.length === 1 
        ? 'grid-cols-1 max-w-xl mx-auto' 
        : stories.length === 2 
        ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
        <div className="space-y-8">
            <div className={`grid ${gridCols} gap-6 sm:gap-7`}>
                <AnimatePresence mode="wait">
                    {displayedStories.map((story, idx) => (
                        <motion.div
                            key={story.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                            onClick={() => onOpenModal({
                                clientName: story.clientName,
                                company: story.company,
                                quote: story.quote,
                                route: story.route
                            })}
                            className="cursor-pointer bg-white rounded-3xl p-7 sm:p-8 border border-gray-100/90 shadow-lg shadow-gray-200/60 hover:shadow-2xl hover:border-[#6B9F91]/50 transition-all duration-300 flex flex-col justify-between group transform-gpu hover:-translate-y-1.5"
                        >
                            <div>
                                {/* Rating Stars & Verified Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex gap-1 text-[#FFC900]">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-4 h-4 fill-current drop-shadow-xs" />
                                        ))}
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#0F766E] bg-[#D8E8E2] px-3 py-0.5 rounded-full shadow-xs">
                                        <CheckCircle2 className="w-3 h-3 text-[#0F766E]" />
                                        Verified
                                    </span>
                                </div>

                                <Quote className="w-8 h-8 text-[#6B9F91]/25 mb-3 -scale-x-100" />

                                <p className="text-base sm:text-lg text-[#111827] font-semibold italic leading-relaxed line-clamp-4 mb-5">
                                    &ldquo;{story.quote}&rdquo;
                                </p>

                                <div className="mb-6">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3D35] bg-[#D8E8E2]/60 group-hover:bg-[#D8E8E2] group-hover:text-[#0F766E] px-3 py-1.5 rounded-lg transition-all">
                                        Read Full Story
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>

                            {/* Author Row */}
                            <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
                                <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-[#6B9F91] to-[#D8E8E2] p-0.5 shadow-sm">
                                    {story.thumbnailUrl ? (
                                        <div className="relative w-full h-full rounded-full overflow-hidden">
                                            <Image src={story.thumbnailUrl} alt={story.clientName} fill sizes="48px" className="object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#1F3D35] font-extrabold text-base">
                                            {story.clientName?.charAt(0) || "C"}
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-[#111827] text-base truncate">{story.clientName}</p>
                                    <p className="text-xs font-bold text-[#0F766E] truncate uppercase tracking-wider">
                                        {story.company || "Client Partner"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Pagination Controls for > 3 stories */}
            {isMultiPage && (
                <div className="flex items-center justify-center gap-3 pt-4">
                    <button
                        onClick={() => setPageIndex((prev) => Math.max(0, prev - 1))}
                        disabled={pageIndex === 0}
                        className="p-3 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 disabled:opacity-30 hover:bg-[#D8E8E2] transition-colors"
                        aria-label="Previous testimonials"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPageIndex(i)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    pageIndex === i ? 'w-8 bg-[#0F766E]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Go to page ${i + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setPageIndex((prev) => Math.min(totalPages - 1, prev + 1))}
                        disabled={pageIndex === totalPages - 1}
                        className="p-3 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 disabled:opacity-30 hover:bg-[#D8E8E2] transition-colors"
                        aria-label="Next testimonials"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// READING MODAL COMPONENT
// ============================================================================

function StoryModal({ story, onClose }: { story: any, onClose: () => void }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-950/65 backdrop-blur-md transition-opacity"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 15 }}
                transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-white border border-gray-100 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-5 md:right-5 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 rounded-full flex items-center justify-center transition-colors z-20 focus-visible:outline-none"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div
                    className="overflow-y-auto p-6 sm:p-8 md:p-10 flex flex-col h-full [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <div className="flex items-center gap-1.5 text-[#FFC900] mb-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-5 h-5 fill-current drop-shadow-xs" />
                        ))}
                    </div>

                    <div className="relative mb-8">
                        <Quote className="w-10 h-10 text-[#6B9F91]/20 mb-3 -scale-x-100" />
                        <p className="relative z-10 text-lg sm:text-xl md:text-2xl text-[#111827] font-semibold italic leading-relaxed">
                            &ldquo;{story.quote}&rdquo;
                        </p>
                    </div>

                    <div className="flex items-center gap-4 border-t border-gray-100 pt-6 mt-auto shrink-0">
                        <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-tr from-[#6B9F91] to-[#D8E8E2] p-0.5 shadow-sm">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#1F3D35] font-extrabold text-lg">
                                {story.clientName?.charAt(0) || "C"}
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-[#111827] text-lg">{story.clientName}</p>
                            <p className="text-xs font-bold text-[#0F766E] uppercase tracking-wider mt-0.5">
                                {story.company || "Client Partner"}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
