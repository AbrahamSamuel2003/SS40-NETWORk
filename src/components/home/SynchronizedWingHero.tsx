"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Code2, 
    Box, 
    GraduationCap, 
    ArrowRight, 
    CheckCircle2, 
    Sparkles, 
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface WingData {
    id: string;
    wingName: string;
    badge: string;
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    imageSrc: string;
    imageAlt: string;
    icon: React.ReactNode;
    keyPoints: string[];
    accentColor: string;
    glowColor: string;
}

const WINGS: WingData[] = [
    {
        id: "solutions",
        wingName: "Digital Solutions",
        badge: "Custom Software & Web",
        title: "Digital Solutions for Growing Businesses",
        description: "We engineer high-performance web applications, mobile apps, and custom software systems with modern technologies and transparent fixed pricing.",
        ctaText: "Explore Digital Solutions",
        ctaHref: "/digital-solutions",
        imageSrc: "/images/hero/digital-solutions-showcase.jpg",
        imageAlt: "SS40 Digital Solutions Software Dashboard",
        icon: <Code2 className="w-4 h-4 text-teal-700" />,
        keyPoints: ["Custom Web & Mobile Apps", "Cloud Native Architecture", "30-Day Support Warranty"],
        accentColor: "text-[#0F766E]",
        glowColor: "from-teal-400/25 via-emerald-300/15 to-transparent"
    },
    {
        id: "products",
        wingName: "SaaS Products",
        badge: "Business Software & ERP",
        title: "Intelligent Products Built for Real Needs",
        description: "Ready-to-use software products like ClearInvoice that automate billing, GST compliance, and everyday business workflows effortlessly.",
        ctaText: "Explore SaaS Products",
        ctaHref: "/products",
        imageSrc: "/images/hero/saas-products-showcase.jpg",
        imageAlt: "SS40 SaaS Products Invoicing Interface",
        icon: <Box className="w-4 h-4 text-purple-700" />,
        keyPoints: ["ClearInvoice Billing & GST", "Fast Multi-Tenant Cloud", "Simple & Secure Operations"],
        accentColor: "text-[#0F766E]",
        glowColor: "from-purple-400/25 via-teal-300/15 to-transparent"
    },
    {
        id: "academics",
        wingName: "Tech Academics",
        badge: "Practical Career Training",
        title: "Hands-on Software Training & Mentorship",
        description: "Career-launching tech programs with real client capstone projects, production code reviews, and direct 1-on-1 mentorship from senior engineers.",
        ctaText: "Explore Academics",
        ctaHref: "/academics",
        imageSrc: "/images/hero/tech-academics-showcase.jpg",
        imageAlt: "SS40 Tech Academics Learning Platform",
        icon: <GraduationCap className="w-4 h-4 text-amber-700" />,
        keyPoints: ["Live Client Projects", "1-on-1 Senior Mentorship", "Production-Grade Skills"],
        accentColor: "text-amber-800",
        glowColor: "from-amber-400/25 via-teal-300/15 to-transparent"
    }
];

const AUTOPLAY_DURATION = 5500; // 5.5s per wing

export function SynchronizedWingHero() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    const activeWing = WINGS[activeIndex];

    // Smooth continuous auto-play timer with vertical progress tracker
    React.useEffect(() => {
        if (isPaused) return;

        const stepMs = 40;
        const totalSteps = AUTOPLAY_DURATION / stepMs;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    setActiveIndex((curr) => (curr + 1) % WINGS.length);
                    return 0;
                }
                return prev + (100 / totalSteps);
            });
        }, stepMs);

        return () => clearInterval(timer);
    }, [isPaused, activeIndex]);

    return (
        <div 
            className="w-full relative mt-4 lg:mt-6 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Seamless Floating Stage (No Solid Background) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
                
                {/* Left Column: Simple & Understandable Wing Narrative */}
                <div className="lg:col-span-5 flex flex-col justify-center text-left">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeWing.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="space-y-3.5"
                        >
                            {/* Wing Badge with Interactive Indicator */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[rgba(15,118,110,0.2)] shadow-2xs">
                                <div className="w-5 h-5 rounded-md bg-[#F0F7F4] flex items-center justify-center">
                                    {activeWing.icon}
                                </div>
                                <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                                    {activeWing.wingName}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="text-[11px] font-semibold text-gray-600">
                                    {activeWing.badge}
                                </span>
                            </div>

                            {/* Wing Title */}
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] leading-tight tracking-tight">
                                {activeWing.title}
                            </h3>

                            {/* Wing Description */}
                            <p className="text-sm sm:text-base text-[var(--color-body-text)] leading-relaxed font-normal">
                                {activeWing.description}
                            </p>

                            {/* 3 Clear Value Checkpoints */}
                            <div className="space-y-1.5 pt-1">
                                {activeWing.keyPoints.map((point, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--color-heading)]">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>{point}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button & Direct Indicator */}
                            <div className="pt-3 flex items-center gap-4">
                                <Button asChild size="lg" className="bg-[#0F766E] hover:bg-[#115E59] text-white shadow-lg shadow-[#0F766E]/20 transition-all duration-200 group px-6 py-3 rounded-xl">
                                    <Link href={activeWing.ctaHref} className="inline-flex items-center justify-center whitespace-nowrap font-bold text-xs sm:text-sm">
                                        {activeWing.ctaText}
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                                    </Link>
                                </Button>

                                {/* Wing Quick Step Pips */}
                                <div className="flex items-center gap-1.5">
                                    {WINGS.map((w, idx) => (
                                        <button
                                            key={w.id}
                                            type="button"
                                            onClick={() => {
                                                setActiveIndex(idx);
                                                setProgress(0);
                                            }}
                                            aria-label={`Go to ${w.wingName}`}
                                            className={cn(
                                                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                                                activeIndex === idx 
                                                    ? "w-6 bg-[#0F766E]" 
                                                    : "w-2 bg-slate-300/80 hover:bg-slate-400"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Center Column: Vertical Traveling Light Indicator (In Between Content & Image) */}
                <div className="hidden lg:flex lg:col-span-1 justify-center items-center h-full min-h-[360px] relative">
                    {/* Vertical Track Line */}
                    <div className="w-[2px] h-[300px] bg-slate-300/60 rounded-full relative overflow-hidden">
                        {/* Dynamic Traveling Beam (Fills Top to Bottom) */}
                        <div 
                            className="w-full bg-gradient-to-b from-[#0F766E] via-[var(--color-primary)] to-[#0F766E] transition-all ease-linear rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]"
                            style={{ height: `${progress}%` }}
                        />
                    </div>

                    {/* Wing Step Orbit Markers */}
                    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col justify-between h-[280px] pointer-events-none">
                        {WINGS.map((w, idx) => {
                            const isCurrent = activeIndex === idx;
                            return (
                                <div 
                                    key={w.id}
                                    className={cn(
                                        "w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300",
                                        isCurrent 
                                            ? "bg-[#0F766E] ring-4 ring-[#0F766E]/20 scale-110 shadow-sm" 
                                            : "bg-white border-2 border-slate-300"
                                    )}
                                >
                                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Floating Showcase Image (Elevated Glass & Ambient Glow) */}
                <div className="lg:col-span-6 relative flex justify-center">
                    
                    {/* Organic Ambient Glow Behind Image */}
                    <div 
                        className={cn(
                            "animate-pulse absolute -inset-6 bg-gradient-to-tr rounded-3xl blur-3xl opacity-70 pointer-events-none transition-all duration-700 -z-10",
                            activeWing.glowColor
                        )} 
                    />

                    {/* Floating Frame */}
                    <div className="animate-float-slow w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden border border-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.14)] bg-slate-950 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeWing.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.03 }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={activeWing.imageSrc}
                                    alt={activeWing.imageAlt}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 500px"
                                    className="object-cover object-center"
                                    priority
                                />
                                
                                {/* Specular Glass Border Sheen */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-white/10 pointer-events-none" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Floating Live Telemetry Badge */}
                        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{activeWing.wingName} Live</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
