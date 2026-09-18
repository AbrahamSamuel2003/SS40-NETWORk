"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Code2, 
    Box, 
    GraduationCap, 
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface WingData {
    id: string;
    wingName: string;
    badge: string;
    badgeStyle: string;
    title: string;
    highlight: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    imageSrc: string;
    imageAlt: string;
    icon: React.ReactNode;
    chips: string[];
    buttonClass: string;
    accentColor: string;
}

const WINGS: WingData[] = [
    {
        id: "solutions",
        wingName: "SS40 Digital Solutions",
        badge: "SS40 DIGITAL SOLUTIONS",
        badgeStyle: "bg-[#F59E0B]/15 text-[#D97706] hover:bg-[#F59E0B]/25 border border-[#F59E0B]/20",
        title: "Custom Software Engineering",
        highlight: "Built to Scale.",
        description: "We build high-performance web applications, mobile platforms, and AI automation tailored to your business.",
        ctaText: "Explore Digital Solutions",
        ctaHref: "/digital-solutions",
        imageSrc: "/images/hero/digital-solutions-illustration.jpg",
        imageAlt: "SS40 Digital Solutions Custom Software and Cloud Architecture",
        icon: <Code2 className="w-3.5 h-3.5 text-[#D97706]" />,
        chips: ["Web Apps", "Mobile Apps", "Cloud & AI"],
        buttonClass: "bg-[#0F766E] hover:bg-[#115E59] text-white shadow-lg shadow-[#0F766E]/20",
        accentColor: "#0F766E"
    },
    {
        id: "products",
        wingName: "SS40 Products",
        badge: "SS40 PRODUCTS",
        badgeStyle: "bg-[#F59E0B]/15 text-[#D97706] hover:bg-[#F59E0B]/25 border border-[#F59E0B]/20",
        title: "Intelligent SaaS Tools",
        highlight: "For Real Business.",
        description: "Ready-to-deploy software tools that automate invoicing, daily workflows, and enterprise operations.",
        ctaText: "Explore Products",
        ctaHref: "/products",
        imageSrc: "/images/hero/saas-products-illustration.jpg",
        imageAlt: "SS40 Products SaaS Invoicing and ERP Workflows",
        icon: <Box className="w-3.5 h-3.5 text-[#D97706]" />,
        chips: ["ClearInvoice", "GTC Suite", "AI Email Agent"],
        buttonClass: "bg-[#0F766E] hover:bg-[#115E59] text-white shadow-lg shadow-[#0F766E]/20",
        accentColor: "#0F766E"
    },
    {
        id: "academics",
        wingName: "SS40 Academics",
        badge: "SS40 ACADEMICS",
        badgeStyle: "bg-[#F59E0B]/15 text-[#D97706] hover:bg-[#F59E0B]/25 border border-[#F59E0B]/20",
        title: "Hands-on Tech Training",
        highlight: "& Career Launch.",
        description: "Production-grade software training with real client projects, code reviews, and career acceleration.",
        ctaText: "Explore Academics",
        ctaHref: "/academics",
        imageSrc: "/images/hero/tech-academics-illustration.jpg",
        imageAlt: "SS40 Academics Software Engineering and Mentorship Hub",
        icon: <GraduationCap className="w-3.5 h-3.5 text-[#D97706]" />,
        chips: ["Live Client Projects", "Career Launch"],
        buttonClass: "bg-[#0F766E] hover:bg-[#115E59] text-white shadow-lg shadow-[#0F766E]/20",
        accentColor: "#0F766E"
    }
];

// Node Coordinates within SVG viewBox
const NODE_Y_POSITIONS = [24, 140, 256]; // Desktop Vertical (viewBox 0 0 32 280)
const NODE_X_POSITIONS = [24, 140, 256]; // Mobile Horizontal (viewBox 0 0 280 32)
const WING_INTERVAL = 5000; // 5s per wing

export function SynchronizedWingHero() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);

    // Optimized 5000ms timer without main-thread 60fps React state thrashing
    React.useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % WINGS.length);
        }, WING_INTERVAL);

        return () => clearInterval(timer);
    }, [isPaused]);

    const activeWing = WINGS[activeIndex];
    const currentY = NODE_Y_POSITIONS[activeIndex];
    const currentX = NODE_X_POSITIONS[activeIndex];

    const handleNodeClick = (idx: number) => {
        setActiveIndex(idx);
    };

    return (
        <div 
            className="w-full relative mt-4 lg:mt-6 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Seamless Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
                
                {/* Left Column: Wing Narrative */}
                <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeWing.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="space-y-4 flex flex-col items-center lg:items-start w-full"
                        >
                            {/* Wing Badge (All Gold/Yellow Design Matching SS40 DS) */}
                            <div className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-md uppercase tracking-widest text-[10px] font-bold border shadow-2xs w-fit",
                                activeWing.badgeStyle
                            )}>
                                {activeWing.icon}
                                <span>{activeWing.badge}</span>
                            </div>

                            {/* Wing Title (Hidden on mobile for compact view, shown on sm+) */}
                            <h3 className="hidden sm:block text-2xl sm:text-3xl font-bold text-[var(--color-heading)] leading-[1.15] tracking-tight">
                                {activeWing.title} <br className="hidden sm:inline" />
                                <span className="text-[#6B9F91]">{activeWing.highlight}</span>
                            </h3>

                            {/* Wing Description */}
                            <p className="text-sm sm:text-base text-[var(--color-body-text)] leading-relaxed font-normal max-w-lg lg:max-w-none">
                                {activeWing.description}
                            </p>

                            {/* Feature Chips */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5">
                                {activeWing.chips.map((chip, idx) => (
                                    <span 
                                        key={idx} 
                                        className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 rounded-md text-[10px] sm:text-xs font-semibold uppercase tracking-wider shadow-2xs whitespace-nowrap"
                                    >
                                        {chip}
                                    </span>
                                ))}
                            </div>

                            {/* Action Button (Explore Products Teal Tone) */}
                            <div className="pt-3 flex items-center justify-center lg:justify-start w-full sm:w-auto">
                                <Button asChild size="lg" className={cn("px-6 py-3 rounded-xl transition-all duration-200 group font-bold text-xs sm:text-sm", activeWing.buttonClass)}>
                                    <Link href={activeWing.ctaHref} className="inline-flex items-center justify-center whitespace-nowrap">
                                        {activeWing.ctaText}
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mobile Horizontal Laser Line Connector (Positioned between Content & Bottom Mockup Box) */}
                <div className="flex lg:hidden flex-col items-center justify-center w-full my-1">
                    <svg className="w-full max-w-[280px] sm:max-w-[340px] h-7 overflow-visible" viewBox="0 0 280 32" fill="none">
                        <defs>
                            <linearGradient id="laserBeamGradH" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0F766E" stopOpacity="0.4" />
                                <stop offset="85%" stopColor="#2DD4BF" stopOpacity="1" />
                                <stop offset="100%" stopColor="#5EEAD4" stopOpacity="1" />
                            </linearGradient>

                            <filter id="laserGlowFilterH" x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background Track */}
                        <line 
                            x1={NODE_X_POSITIONS[0]} 
                            y1="16" 
                            x2={NODE_X_POSITIONS[2]} 
                            y2="16" 
                            stroke="#CBD5E1" 
                            strokeWidth="2" 
                            strokeDasharray="3 3"
                            strokeOpacity="0.8" 
                        />

                        {/* Active Laser Line */}
                        <line 
                            x1={NODE_X_POSITIONS[0]} 
                            y1="16" 
                            x2={currentX} 
                            y2="16" 
                            stroke="url(#laserBeamGradH)" 
                            strokeWidth="3" 
                            strokeLinecap="round"
                            filter="url(#laserGlowFilterH)" 
                            className="transition-all duration-400 ease-out"
                        />

                        {/* Traveling Pulse Laser Head */}
                        <g transform={`translate(${currentX}, 16)`} className="transition-transform duration-400 ease-out">
                            <circle r="6" fill="#2DD4BF" opacity="0.4" className="animate-ping" />
                            <circle r="4" fill="#0F766E" />
                            <circle r="2" fill="#FFFFFF" />
                        </g>

                        {/* 3 Step Interactive Nodes */}
                        {NODE_X_POSITIONS.map((xPos, idx) => {
                            const isCurrent = activeIndex === idx;
                            const isReached = currentX >= xPos;

                            return (
                                <g 
                                    key={idx} 
                                    transform={`translate(${xPos}, 16)`} 
                                    onClick={() => handleNodeClick(idx)}
                                    className="cursor-pointer group/node"
                                >
                                    {isCurrent && (
                                        <circle 
                                            r="9" 
                                            fill="#0F766E" 
                                            fillOpacity="0.2" 
                                            className="animate-pulse" 
                                        />
                                    )}

                                    <circle 
                                        r="5.5" 
                                        fill={isReached ? "#0F766E" : "#FFFFFF"} 
                                        stroke={isReached ? "#2DD4BF" : "#94A3B8"} 
                                        strokeWidth="2"
                                        className="transition-all duration-300"
                                    />

                                    <circle 
                                        r="2.5" 
                                        fill={isReached ? "#FFFFFF" : "#CBD5E1"} 
                                    />
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Center Column: Precision SVG Vertical Line */}
                <div className="hidden lg:flex lg:col-span-1 justify-center items-center h-full min-h-[360px] relative">
                    <svg className="w-10 h-[280px] overflow-visible" viewBox="0 0 32 280" fill="none">
                        <defs>
                            <linearGradient id="laserBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#0F766E" stopOpacity="0.4" />
                                <stop offset="85%" stopColor="#2DD4BF" stopOpacity="1" />
                                <stop offset="100%" stopColor="#5EEAD4" stopOpacity="1" />
                            </linearGradient>

                            <filter id="laserGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background Straight Reference Track */}
                        <line 
                            x1="16" 
                            y1={NODE_Y_POSITIONS[0]} 
                            x2="16" 
                            y2={NODE_Y_POSITIONS[2]} 
                            stroke="#CBD5E1" 
                            strokeWidth="2" 
                            strokeDasharray="3 3"
                            strokeOpacity="0.8" 
                        />

                        {/* Active Laser Line */}
                        <line 
                            x1="16" 
                            y1={NODE_Y_POSITIONS[0]} 
                            x2="16" 
                            y2={currentY} 
                            stroke="url(#laserBeamGrad)" 
                            strokeWidth="3" 
                            strokeLinecap="round"
                            filter="url(#laserGlowFilter)" 
                            className="transition-all duration-400 ease-out"
                        />

                        {/* Traveling Pulse Laser Head */}
                        <g transform={`translate(16, ${currentY})`} className="transition-transform duration-400 ease-out">
                            <circle r="6" fill="#2DD4BF" opacity="0.4" className="animate-ping" />
                            <circle r="4" fill="#0F766E" />
                            <circle r="2" fill="#FFFFFF" />
                        </g>

                        {/* 3 Step Interactive Nodes */}
                        {NODE_Y_POSITIONS.map((yPos, idx) => {
                            const isCurrent = activeIndex === idx;
                            const isReached = currentY >= yPos;

                            return (
                                <g 
                                    key={idx} 
                                    transform={`translate(16, ${yPos})`} 
                                    onClick={() => handleNodeClick(idx)}
                                    className="cursor-pointer group/node"
                                >
                                    {isCurrent && (
                                        <circle 
                                            r="10" 
                                            fill="#0F766E" 
                                            fillOpacity="0.2" 
                                            className="animate-pulse" 
                                        />
                                    )}

                                    <circle 
                                        r="6" 
                                        fill={isReached ? "#0F766E" : "#FFFFFF"} 
                                        stroke={isReached ? "#2DD4BF" : "#94A3B8"} 
                                        strokeWidth="2"
                                        className="transition-all duration-300"
                                    />

                                    <circle 
                                        r="2.5" 
                                        fill={isReached ? "#FFFFFF" : "#CBD5E1"} 
                                    />
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Right Column: Application Mockup Box */}
                <div className="lg:col-span-6 relative flex justify-center">
                    <div className="animate-float-slow relative w-full max-w-[540px] aspect-[4/3] bg-white rounded-2xl shadow-[var(--shadow-hover)] border border-[var(--color-border)] overflow-hidden flex flex-col z-10">
                        
                        {/* Browser Header Bar */}
                        <div className="h-9 bg-gray-50 border-b border-[var(--color-border)] flex items-center px-4 gap-2 shrink-0 z-20">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                            <div className="ml-3 w-32 sm:w-48 h-5 bg-white rounded-md border border-[var(--color-border)] flex items-center px-2">
                                <div className="w-20 sm:w-32 h-2 bg-gray-100 rounded-sm" />
                            </div>
                            <span className="ml-auto text-[10px] font-mono text-gray-400 font-medium">
                                ss40.io/{activeWing.id}
                            </span>
                        </div>

                        {/* Image Showcase inside Browser Mockup Frame */}
                        <div className="relative flex-1 bg-slate-950 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeWing.id}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={activeWing.imageSrc}
                                        alt={activeWing.imageAlt}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 540px"
                                        className="object-cover object-center"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent pointer-events-none" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Preload other images in background for 0 latency switching */}
                            <div className="hidden" aria-hidden="true">
                                {WINGS.map((w) => (
                                    <Image
                                        key={w.id}
                                        src={w.imageSrc}
                                        alt=""
                                        width={540}
                                        height={405}
                                        priority
                                    />
                                ))}
                            </div>

                            {/* Live Badge in Bottom Left of Frame */}
                            <div className="absolute bottom-3 left-3 z-20 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span>{activeWing.wingName}</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
