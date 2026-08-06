"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Play, Star, ArrowRight, Quote, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

// Data-driven placeholders specific to SS40 NETWORK wings
const FEATURED_STORY = {
    clientName: "Sarah Jenkins",
    company: "Operations Director, Apex Logistics",
    quote: "Partnering with SS40 NETWORK for our custom digital transformation was a game-changer. They modernized our entire legacy supply-chain system into a scalable, high-performance architecture.",
    link: "/digital-solutions",
};

const SECONDARY_STORIES = [
    {
        clientName: "Michael Chang",
        company: "CFO, Horizon Retail",
        quote: "ClearInvoice completely eliminated our billing discrepancies. We recovered 15% in lost revenue and automated our entire financial workflow within the first month.",
        route: "/products"
    },
    {
        clientName: "Priya Sharma",
        company: "Software Engineer, Nexus Systems",
        quote: "The hands-on practical learning and real-world projects at SS40 Academics bridged my talent gap and directly helped me secure a top-tier engineering role.",
        route: "/academics"
    },
];

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

export function SuccessStories() {
    return (
        <SectionWrapper id="success-stories" className="bg-[#EDF5F2] overflow-hidden">
            <Container className="space-y-12 lg:space-y-16">

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
                        <FeaturedVideoArea />
                    </div>

                    {/* === RIGHT COLUMN (Secondary Stories Carousel) === */}
                    <div className="lg:col-span-1 flex flex-col relative z-10 h-full">
                        <SecondaryStoryCarousel />
                    </div>
                </motion.div>

                {/* Bottom CTA Block */}
                <BottomCTA />

            </Container>
        </SectionWrapper>
    );
}

// ============================================================================
// MICRO-INTERACTION COMPONENTS
// ============================================================================

function FeaturedVideoArea() {
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
                if (!isPlaying && videoRef.current) {
                    videoRef.current.play().catch((error) => {
                        console.warn("Video playback was intercepted or failed to load source:", error);
                        // Fallback state if video fails to load (removes overlay so it still feels responsive)
                        setIsPlaying(true);
                    });
                }
            }}
            className={`relative w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden flex flex-col items-center justify-center group shadow-[0_4px_20px_rgb(0,0,0,0.05)] ${isPlaying ? 'cursor-auto' : 'cursor-pointer'}`}
        >
            {/* Native HTML5 Video Element */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover z-0"
                controls={isPlaying}
                playsInline
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            />

            {/* Ambient Thumbnail Overlay (Mockup background before play) */}
            <div className={`absolute inset-0 pointer-events-none bg-gradient-to-tr from-gray-200 via-gray-100 to-[#E8F0EE] z-0 transition-opacity duration-700 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} />
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
                    pointerEvents: "none" // Fully bypass clicks to the parent wrapper
                }}
                style={{ translateZ: 20 }}
                className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_rgb(107,159,145,0.2)] flex items-center justify-center text-[#6B9F91] transition-all duration-500 ease-out border border-white focus-visible:outline-none"
                aria-label="Play testimonial video"
            >
                <Play className="w-6 h-6 md:w-8 md:h-8 ml-1 fill-current drop-shadow-sm" />

                {/* Slow breathing pulse */}
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
                className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end overflow-hidden border-t border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]"
            >
                <div className="absolute inset-0 z-0 bg-white/95 backdrop-blur-md" />

                <div className="relative z-10 flex flex-col w-full py-3 px-4 md:py-5 md:px-8 text-left">
                    {/* Stars */}
                    <div className="flex gap-1 text-[#FFC900] mb-1.5 md:mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                        ))}
                    </div>
                    <p className="font-medium text-[#111827] italic leading-tight text-[11px] md:text-sm line-clamp-2">
                        "{FEATURED_STORY.quote}"
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

function SecondaryStoryCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Automatic rotation
    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev === SECONDARY_STORIES.length - 1 ? 0 : prev + 1));
        }, 3000); // 2s visibility + approx 1s transition
        return () => clearInterval(timer);
    }, []);

    const story = SECONDARY_STORIES[currentIndex];

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
            className="group flex-1 bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgb(107,159,145,0.06)] hover:border-[#6B9F91]/20 rounded-2xl p-8 lg:p-10 flex flex-col relative overflow-hidden h-full min-h-[340px] lg:min-h-0"
        >
            {/* Subtle highlight glow on hover */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6B9F91]/0 to-transparent group-hover:via-[#6B9F91]/40 transition-all duration-700 ease-out" />

            <div className="flex-1 relative flex flex-col h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        variants={slideVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex flex-col flex-1 h-full"
                    >
                        {/* Rating */}
                        <div className="flex gap-1 mb-6 text-[#FFC900]">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-5 h-5 fill-current" />
                            ))}
                        </div>

                        {/* Quote expands to consume middle space */}
                        <p className="text-lg lg:text-xl text-gray-700 font-medium italic leading-relaxed mb-6 flex-1">
                            "{story.quote}"
                        </p>

                        {/* Profile Info block */}
                        <div className="flex items-center gap-4 border-t border-gray-100 pt-6 mt-auto">
                            <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 p-[2px]">
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                    <span className="text-gray-500 font-bold">{story.clientName.charAt(0)}</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-[#111827] text-base">{story.clientName}</p>
                                <p className="text-sm font-semibold text-[#6B9F91] uppercase tracking-wider mt-0.5">
                                    {story.route.replace('/', '')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
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
                    Ready to build your next digital success story?
                </h3>

                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button asChild size="lg" className="relative z-10 w-full sm:w-auto shadow-xl shadow-[#6B9F91]/20 hover:shadow-[#6B9F91]/40 bg-[#6B9F91] text-white hover:bg-[#5C8C80] transition-all duration-300">
                        <Link href="/contact" className="group/btn">
                            Start Your Project
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}