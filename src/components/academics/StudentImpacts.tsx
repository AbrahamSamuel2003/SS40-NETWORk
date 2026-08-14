"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, Star, ArrowRight, Quote, ChevronUp, ChevronLeft, ChevronRight, X } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

interface StudentImpactsProps {
    impacts?: any[];
}

export function StudentImpacts({ impacts = [] }: StudentImpactsProps) {
    if (!impacts || impacts.length === 0) return null;

    const featuredStoryRaw = impacts.find(imp => imp.youtubeUrl) || impacts.find(imp => imp.isFeatured) || impacts[0];
    const secondaryStoriesRaw = impacts.filter(imp => imp.id !== featuredStoryRaw.id && !imp.youtubeUrl);

    const featuredStory = {
        clientName: featuredStoryRaw.studentName,
        company: featuredStoryRaw.designation,
        quote: featuredStoryRaw.quote,
        link: "/academics/apply",
        videoUrl: featuredStoryRaw.videoUrl,
        youtubeUrl: featuredStoryRaw.youtubeUrl
    };

    const secondaryStories = secondaryStoriesRaw.map(imp => ({
        clientName: imp.studentName,
        company: imp.designation,
        quote: imp.quote,
        route: imp.academicRoute
    }));

    // Modal state lifted here to avoid CSS perspective trapping fixed elements
    const [activeModalStory, setActiveModalStory] = useState<{
        clientName: string;
        company: string;
        quote: string;
        route: string;
    } | null>(null);

    return (
        <SectionWrapper id="student-impact" className="bg-[#EDF5F2] overflow-hidden">
            <Container className="space-y-12 lg:space-y-16">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <SectionHeading
                        badge="Student Impact"
                        title="From Learning to Professional Success."
                        description="Discover how our students build practical skills, complete real-world projects, and prepare for successful careers through hands-on architecture."
                    />
                </motion.div>

                {/* Main Grid Layout */}
                <motion.div
                    variants={entranceStagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto perspective-1000"
                >
                    {/* === LEFT COLUMN (Featured Story) === */}
                    <div className="lg:col-span-2 flex flex-col relative z-20 h-full">
                        <FeaturedVideoArea videoUrl={featuredStory.videoUrl} featuredStory={featuredStory} />
                    </div>

                    {/* === RIGHT COLUMN (Secondary Stories Carousel) === */}
                    <div className="lg:col-span-1 flex flex-col relative z-10 h-full">
                        {secondaryStories.length > 0 && (
                            <SecondaryStoryCarousel stories={secondaryStories} onOpenModal={(story: any) => setActiveModalStory(story)} />
                        )}
                    </div>
                </motion.div>

                {/* Bottom CTA Block */}
                <BottomCTA />

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

// Elegant stagger entrance sequence
const entranceStagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        }
    }
};

const fadeUpAnim: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } }
};

// ============================================================================
// MICRO-INTERACTION COMPONENTS
// ============================================================================

function FeaturedVideoArea({ videoUrl, featuredStory }: { videoUrl?: string | null, featuredStory: any }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-0.5, 0.5], [2, -2]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-2, 2]);

    const videoRef = useRef<HTMLVideoElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

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

    // ── YouTube IFrame API state listener ──────────────────────────────────
    useEffect(() => {
        if (!featuredStory.youtubeUrl) return;

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
    }, [featuredStory.youtubeUrl]);

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
            onClick={() => {
                if (!featuredStory.youtubeUrl && !isPlaying && videoRef.current) {
                    videoRef.current.play().catch((error) => {
                        console.warn("Video playback was intercepted or failed to load source:", error);
                        setIsPlaying(true);
                    });
                }
            }}
            className={`relative w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden flex flex-col items-center justify-center group shadow-[0_4px_20px_rgb(0,0,0,0.05)] ${isPlaying ? 'cursor-auto' : 'cursor-pointer'}`}
        >
            {/* Native HTML5 Video Element (shown only when no YouTube URL) */}
            {!featuredStory.youtubeUrl && (
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    controls={isPlaying}
                    playsInline
                    preload="metadata"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    src={videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
                />
            )}

            {/* YouTube iframe embed (shown only when youtubeUrl exists) */}
            {featuredStory.youtubeUrl && (() => {
                const ytUrl = featuredStory.youtubeUrl as string;
                let videoId: string | null = null;
                try {
                    const parsed = new URL(ytUrl);
                    const host = parsed.hostname.replace('www.', '');
                    if (host === 'youtube.com' && parsed.pathname === '/watch') {
                        videoId = parsed.searchParams.get('v');
                    } else if (host === 'youtu.be') {
                        videoId = parsed.pathname.slice(1).split('/')[0];
                    } else if (host === 'youtube.com' && parsed.pathname.startsWith('/shorts/')) {
                        videoId = parsed.pathname.split('/shorts/')[1]?.split('/')[0] || null;
                    }
                } catch { videoId = null; }

                if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return null;

                return (
                    <iframe
                        ref={iframeRef}
                        className="absolute inset-0 w-full h-full z-10"
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`}
                        title="Student Impact video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        onLoad={(e) => {
                            try {
                                e.currentTarget.contentWindow?.postMessage(
                                    JSON.stringify({ event: 'listening', id: 1 }),
                                    '*'
                                );
                            } catch (err) { }
                        }}
                    />
                );
            })()}

            {/* Ambient Thumbnail Overlay (Mockup background before play) */}
            <div className={`absolute inset-0 pointer-events-none bg-gradient-to-tr from-gray-200/55 via-gray-100/45 to-[#E8F0EE]/55 z-0 transition-opacity duration-700 ${isPlaying ? 'opacity-0' : 'opacity-55'}`} />
            <motion.div
                className={`absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-0 transition-opacity duration-700 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
            />
            <div className={`absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwek0yMCAyMGMxMS0xMSAxMS0xMSAxMS0xMSBMMSAxWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTExODI3IiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvc3ZnPg==')] mix-blend-multiply z-0 transition-opacity duration-700 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />

            {/* Premium Play Button - Visual indicator only */}
            <motion.button
                animate={{
                    opacity: isPlaying ? 0 : 1,
                    scale: isPlaying ? 0.8 : 1,
                    pointerEvents: "none"
                }}
                style={{ translateZ: 20 }}
                className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_rgb(107,159,145,0.2)] flex items-center justify-center text-[#6B9F91] transition-all duration-500 ease-out border border-white focus-visible:outline-none"
                aria-label="Play testimonial video"
            >
                <Play className="w-6 h-6 md:w-8 md:h-8 ml-1 fill-current drop-shadow-sm" />

                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border border-white pointer-events-none"
                />
            </motion.button>

            {/* Static Teaser Panel - Extremely Compact */}
            <motion.div
                animate={{
                    opacity: isPlaying ? 0 : 1,
                    y: isPlaying ? 20 : 0,
                    pointerEvents: isPlaying ? "none" : "auto"
                }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.15 }}
                className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end overflow-hidden border-t border-white/50 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]"
            >
                <div
                    className="absolute inset-0 z-0 backdrop-blur-xl"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.42)" }}
                />

                <div className="relative z-10 flex flex-col w-full py-2 px-3 md:py-5 md:px-8 text-left">
                    {/* Stars - hidden on mobile for compact overlay */}
                    <div className="hidden md:flex gap-1 text-[#FFC900] mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                    </div>
                    <p className="font-medium text-[#111827] italic leading-tight text-[11px] md:text-sm line-clamp-1 md:line-clamp-2">
                        "{featuredStory.quote}"
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

function SecondaryStoryCarousel({ stories, onOpenModal }: { stories: any[], onOpenModal: (story: any) => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTruncated, setIsTruncated] = useState(true); // Default to assuming truncation for safety
    const quoteRef = useRef<HTMLParagraphElement>(null);

    // Automatic rotation
    React.useEffect(() => {
        if (!stories || stories.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
        }, 3500);
        return () => clearInterval(timer);
    }, [stories]);

    const story = stories[currentIndex] || stories[0];

    // Detect if content is overflowing (clamped) to conditionally show the "Read Full Story" button
    React.useEffect(() => {
        const checkTruncation = () => {
            if (quoteRef.current) {
                const { scrollHeight, clientHeight } = quoteRef.current;
                // If scrollHeight is strictly greater than client height, text was cut off
                setIsTruncated(scrollHeight > clientHeight);
            }
        };
        // Small delay to ensure DOM rendered the text
        setTimeout(checkTruncation, 50);
        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [currentIndex]);

    // Smooth horizontal slide variants
    const slideVariants: Variants = {
        initial: { x: 15, opacity: 0 },
        animate: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        },
        exit: {
            x: -15,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeIn" }
        }
    };

    return (
        <motion.div
            variants={fadeUpAnim}
            role="button"
            tabIndex={0}
            onClick={() => onOpenModal(story)}
            onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenModal(story);
                }
            }}
            className="cursor-pointer bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgb(107,159,145,0.06)] hover:border-[#6B9F91]/20 rounded-2xl p-8 lg:p-10 flex flex-col relative overflow-hidden w-full lg:h-full lg:absolute lg:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2"
            style={{ height: '380px', minHeight: '100%' }} // Safe fallback for mobile
        >
            {/* Subtle highlight glow on hover */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6B9F91]/0 to-transparent group-hover:via-[#6B9F91]/40 transition-all duration-700 ease-out" />

            <div className="flex-1 relative flex flex-col h-full min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex flex-col h-full min-h-0"
                    >
                        {/* Rating - fixed at top */}
                        <div className="flex gap-1 mb-6 text-[#FFC900] shrink-0">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                        </div>

                        {/* Quote area - permanently clamped to 4 lines */}
                        <div className="flex-1 min-h-0 relative mb-2">
                            <div className="h-full overflow-hidden">
                                <p
                                    ref={quoteRef}
                                    className="text-lg lg:text-xl text-gray-700 font-medium italic leading-relaxed line-clamp-4"
                                >
                                    &ldquo;{story.quote}&rdquo;
                                </p>
                            </div>
                        </div>

                        {/* Action Area - Conditionally visible if clamped */}
                        <div className="h-10 shrink-0 flex items-start">
                            {isTruncated && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenModal(story);
                                    }}
                                    className="text-sm font-bold text-[#6B9F91] hover:text-[#5C8C80] flex items-center group/read transition-colors focus-visible:outline-none"
                                >
                                    Read Full Story
                                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/read:translate-x-1" />
                                </button>
                            )}
                        </div>

                        {/* Profile Info block - fixed at bottom */}
                        <div className="flex items-center gap-4 border-t border-gray-100 pt-6 shrink-0 mt-auto">
                            <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 p-[2px]">
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                    <span className="text-gray-500 font-bold">{story.clientName.charAt(0)}</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-[#111827] text-base">{story.clientName}</p>
                                <p className="text-sm font-semibold text-[#6B9F91] uppercase tracking-wider mt-0.5">
                                    {story.route} | {story.company}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// ============================================================================
// READING MODAL COMPONENT
// ============================================================================

function StoryModal({ story, onClose }: { story: any, onClose: () => void }) {
    // Lock body scroll when modal opens
    React.useEffect(() => {
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
                className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
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
                    className="overflow-y-auto px-6 py-8 md:px-10 md:py-12 flex flex-col h-full [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <div className="flex gap-1 mb-8 text-[#FFC900] shrink-0">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-6 h-6 fill-current drop-shadow-sm" />
                        ))}
                    </div>

                    <div className="relative mb-12">
                        {/* Large faded quote mark decorative */}
                        <Quote className="absolute -top-4 -left-4 w-12 h-12 text-[#6B9F91]/10 transform -scale-x-100 pointer-events-none" />
                        <p className="relative z-10 text-xl md:text-2xl lg:text-[28px] text-gray-800 font-medium italic leading-relaxed md:leading-[1.6]">
                            &ldquo;{story.quote}&rdquo;
                        </p>
                    </div>

                    <div className="flex items-center gap-5 border-t border-gray-100 pt-6 mt-auto shrink-0">
                        <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 p-[2px]">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                <span className="text-gray-500 font-bold text-lg">{story.clientName.charAt(0)}</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-[#111827] text-lg">{story.clientName}</p>
                            <p className="text-sm font-bold text-[#6B9F91] uppercase tracking-wider mt-0.5">
                                {story.route} | {story.company}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function BottomCTA() {
    return (
        <motion.div
            variants={fadeUpAnim}
            className="flex flex-col items-center justify-center text-center pt-8 lg:pt-10"
        >
            <div className="relative bg-white border border-gray-100 rounded-[2rem] p-12 lg:p-16 w-full max-w-4xl mx-auto flex flex-col items-center shadow-[0_8px_40px_rgb(0,0,0,0.03)] overflow-hidden group">

                {/* Ambient Soft Glow Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#6B9F91]/5 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                {/* Very subtle floating dust particles */}
                <motion.div animate={{ y: [0, -10, 0], opacity: [0, 0.5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[20%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#6B9F91]/30 blur-[1px]" />
                <motion.div animate={{ y: [0, 10, 0], opacity: [0, 0.4, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-[20%] right-[25%] w-2 h-2 rounded-full bg-[#6B9F91]/20 blur-[1px]" />

                <h3 className="relative z-10 text-3xl md:text-4xl font-bold text-gray-900 mb-8 max-w-2xl tracking-tight">
                    Ready to Launch Your Tech Career? Become Our Next Success Story.
                </h3>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="relative z-10 w-full sm:w-auto whitespace-nowrap px-6 sm:px-8 shadow-xl shadow-[#6B9F91]/20 hover:shadow-[#6B9F91]/40 bg-[#6B9F91] text-white hover:bg-[#5C8C80] transition-all duration-300">
                        <Link href="/contact">
                            Join SS40 Academics
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}
