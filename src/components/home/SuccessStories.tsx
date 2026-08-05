"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import Link from "next/link";
import { Play, Star, ArrowRight, Quote } from "lucide-react";
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
        <SectionWrapper id="success-stories" className="bg-[#F2F7F5] overflow-hidden">
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
                    <div className="lg:col-span-2 flex flex-col relative z-20">
                        <FeaturedVideoArea />
                        <FeaturedContentArea />
                    </div>

                    {/* === RIGHT COLUMN (Secondary Stories) === */}
                    <div className="lg:col-span-1 flex flex-col gap-6 lg:pt-8 relative z-10">
                        {SECONDARY_STORIES.map((story, idx) => (
                            <SecondaryStoryCard key={idx} story={story} />
                        ))}
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
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth physics for subtle 3D tilt
    const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [2, -2]); // Very minimal tilt
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-2, 2]);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
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
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full aspect-video bg-gray-100 rounded-t-2xl lg:rounded-2xl overflow-hidden flex items-center justify-center group shadow-[0_4px_20px_rgb(0,0,0,0.05)] cursor-pointer"
        >
            {/* Ambient Background with subtle animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 via-gray-100 to-[#E8F0EE]" />
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
            />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,...')] mix-blend-multiply pointer-events-none" />

            {/* Premium Play Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ translateZ: 20 }} // Pops out during 3D tilt
                className="relative z-10 w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_8px_30px_rgb(107,159,145,0.2)] flex items-center justify-center text-[#6B9F91] transition-all duration-500 ease-out border border-white focus-visible:outline-none"
                aria-label="Play testimonial video"
            >
                <Play className="w-8 h-8 ml-1 fill-current drop-shadow-sm" />

                {/* Slow breathing pulse */}
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border border-white"
                />
            </motion.button>
        </motion.div>
    );
}

function FeaturedContentArea() {
    return (
        <motion.div
            variants={fadeUpAnim}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="group relative z-20 w-full flex flex-col bg-white border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(107,159,145,0.08)] hover:border-[#6B9F91]/20 rounded-b-2xl lg:rounded-2xl p-8 md:p-10 mt-0 lg:-mt-12 lg:ml-8 lg:w-[calc(100%-64px)] transition-all"
        >
            {/* Background Decorative Quote */}
            <Quote className="absolute top-6 right-8 w-24 h-24 text-gray-50 opacity-[0.4] group-hover:opacity-[0.6] group-hover:scale-110 transition-all duration-700 ease-out pointer-events-none rotate-12" />

            <span className="text-[10px] font-bold text-[#6B9F91] uppercase tracking-widest mb-4 inline-block">
                Digital Solutions
            </span>

            {/* Sequential Stars Hover */}
            <div className="flex gap-1 mb-6 text-yellow-400 group-hover:text-yellow-500 transition-colors">
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div key={i} whileHover={{ y: -2, scale: 1.2 }} transition={{ type: "spring", stiffness: 400 }}>
                        <Star className="w-5 h-5 fill-current" />
                    </motion.div>
                ))}
            </div>

            <p className="relative z-10 text-lg md:text-xl font-medium text-[#111827] italic leading-relaxed mb-8">
                "{FEATURED_STORY.quote}"
            </p>

            <div className="flex items-center gap-4 mb-8">
                {/* Premium Gradient Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6B9F91] to-teal-400 p-[2px] shadow-sm group-hover:shadow-[0_0_15px_rgba(107,159,145,0.4)] transition-shadow duration-500">
                    <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden flex items-center justify-center">
                        <span className="text-[#6B9F91] font-bold text-sm">SJ</span>
                    </div>
                </div>
                <div>
                    <p className="font-bold text-[#111827]">{FEATURED_STORY.clientName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{FEATURED_STORY.company}</p>
                </div>
            </div>

            <Link href={FEATURED_STORY.link} className="inline-flex items-center text-[#6B9F91] hover:text-[#5C8C80] font-bold focus-visible:outline-none group/link border-t border-gray-100 group-hover:border-gray-200 pt-6 mt-auto transition-colors">
                Read Full Story
                <motion.span className="ml-2 inline-block group-hover/link:translate-x-1" transition={{ type: "spring", stiffness: 300 }}>
                    <ArrowRight className="w-4 h-4" />
                </motion.span>
            </Link>
        </motion.div>
    );
}

function SecondaryStoryCard({ story }: { story: typeof SECONDARY_STORIES[0] }) {
    return (
        <motion.div
            variants={fadeUpAnim}
            whileHover={{ y: -4, rotate: -0.5 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="group flex-1 bg-white border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgb(107,159,145,0.06)] hover:border-[#6B9F91]/20 rounded-2xl p-6 lg:p-8 flex flex-col relative overflow-hidden"
        >
            {/* Subtle highlight glow on hover */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#6B9F91]/0 to-transparent group-hover:via-[#6B9F91]/40 transition-all duration-700 ease-out" />

            <div className="flex gap-1 mb-4 text-yellow-400 group-hover:text-yellow-500 transition-colors">
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div key={i} whileHover={{ y: -2, scale: 1.2 }}>
                        <Star className="w-3.5 h-3.5 fill-current" />
                    </motion.div>
                ))}
            </div>

            <p className="relative z-10 text-base text-gray-600 leading-relaxed mb-6 flex-1">
                "{story.quote}"
            </p>

            <div className="flex items-center gap-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors pt-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 p-[2px] group-hover:from-[#6B9F91] group-hover:to-teal-300 transition-all duration-500">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-bold group-hover:text-[#6B9F91]">{story.clientName.charAt(0)}</span>
                    </div>
                </div>
                <div>
                    <p className="font-bold text-sm text-[#111827]">{story.clientName}</p>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5 group-hover:text-[#6B9F91] transition-colors">{story.route.replace('/', '')}</p>
                </div>
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