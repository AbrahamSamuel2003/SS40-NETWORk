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
        badgeStyle: "bg-[#FFC900]/15 text-[#92400E] hover:bg-[#FFC900]/25 border border-[#FFC900]/30",
        title: "Custom Software Engineering",
        highlight: "Built to Scale.",
        description: "We build high-performance web applications, mobile platforms, and AI automation tailored to your business.",
        ctaText: "Explore Digital Solutions",
        ctaHref: "/digital-solutions",
        imageSrc: "/images/hero/wing-digital-solutions.jpg",
        imageAlt: "SS40 Digital Solutions — Custom Software Development and Cloud Architecture in Tirunelveli",
        icon: <Code2 className="w-3.5 h-3.5 text-[#B45309]" />,
        chips: ["Web Apps", "Mobile Apps", "Cloud and AI"],
        buttonClass: "bg-[#0F766E] hover:bg-[#115E59] text-white shadow-lg shadow-[#0F766E]/20",
        accentColor: "#0F766E"
    },
    {
        id: "products",
        wingName: "SS40 Products",
        badge: "SS40 PRODUCTS",
        badgeStyle: "bg-[#FFC900]/15 text-[#92400E] hover:bg-[#FFC900]/25 border border-[#FFC900]/30",
        title: "Intelligent SaaS Tools",
        highlight: "For Real Business.",
        description: "Ready-to-deploy software tools that automate invoicing, daily workflows, and enterprise operations.",
        ctaText: "Explore Products",
        ctaHref: "/products",
        imageSrc: "/images/hero/wing-products.jpg",
        imageAlt: "SS40 Products — Enterprise Business Growth and Automated SaaS Software Solutions",
        icon: <Box className="w-3.5 h-3.5 text-[#B45309]" />,
        chips: ["ClearInvoice", "GTC Suite", "AI Email Agent"],
        buttonClass: "bg-[#0F766E] hover:bg-[#115E59] text-white shadow-lg shadow-[#0F766E]/20",
        accentColor: "#0F766E"
    },
    {
        id: "academics",
        wingName: "SS40 Academics",
        badge: "SS40 ACADEMICS",
        badgeStyle: "bg-[#FFC900]/15 text-[#92400E] hover:bg-[#FFC900]/25 border border-[#FFC900]/30",
        title: "Hands-on Tech Training",
        highlight: "Career Launch Pad.",
        description: "Project-based training that prepares students and freshers for top tech careers with real client sprint experience.",
        ctaText: "Explore Academics",
        ctaHref: "/academics",
        imageSrc: "/images/hero/wing-academics.jpg",
        imageAlt: "SS40 Academics — Student Tech Career Launch and Placement Success in Tirunelveli",
        icon: <GraduationCap className="w-3.5 h-3.5 text-[#B45309]" />,
        chips: ["Live Client Projects", "Career Launch"],
        buttonClass: "bg-[#0F766E] hover:bg-[#115E59] text-white shadow-lg shadow-[#0F766E]/20",
        accentColor: "#0F766E"
    }
];

const WING_INTERVAL = 3000; // 5.5s comfortable reading cadence

export function SynchronizedWingHero() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isPaused, setIsPaused] = React.useState(false);

    React.useEffect(() => {
        if (isPaused) return;

        const handleVisibility = () => {
            if (document.hidden) {
                setIsPaused(true);
            } else {
                setIsPaused(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % WINGS.length);
        }, WING_INTERVAL);

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [isPaused]);

    const activeWing = WINGS[activeIndex];

    return (
        <div 
            className="w-full relative mt-3 sm:mt-4 lg:mt-0 select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Compact 2-Column Synchronized Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
                
                {/* Left Column: Wing Narrative */}
                <div className="lg:col-span-6 relative flex flex-col justify-center items-center lg:items-start text-center lg:text-left min-h-[230px] sm:min-h-[240px] w-full">
                    {WINGS.map((w, idx) => {
                        const isActive = activeIndex === idx;
                        return (
                            <div
                                key={w.id}
                                style={{
                                    transition: "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1)"
                                }}
                                className={cn(
                                    "w-full space-y-3 flex flex-col items-center lg:items-start text-center lg:text-left will-change-[opacity,transform]",
                                    isActive
                                        ? "opacity-100 translate-y-0 relative z-10 pointer-events-auto"
                                        : "opacity-0 translate-y-3 absolute inset-0 z-0 pointer-events-none"
                                )}
                            >
                                {/* Wing Badge */}
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px] font-bold border shadow-2xs w-fit",
                                    w.badgeStyle
                                )}>
                                    {w.icon}
                                    <span>{w.badge}</span>
                                </div>

                                {/* Wing Title */}
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-heading)] leading-[1.18] tracking-tight font-serif">
                                    {w.title} <br className="hidden sm:inline" />
                                    <span className="text-[#0F766E]">{w.highlight}</span>
                                </h2>

                                {/* Wing Description */}
                                <p className="text-xs sm:text-sm text-[var(--color-body-text)] leading-relaxed font-normal max-w-lg lg:max-w-none">
                                    {w.description}
                                </p>

                                {/* Feature Chips */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-0.5">
                                    {w.chips.map((chip, chipIdx) => (
                                        <span 
                                            key={chipIdx} 
                                            className="px-2.5 py-0.5 bg-white border border-gray-200 text-gray-700 rounded text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider shadow-2xs whitespace-nowrap"
                                        >
                                            {chip}
                                        </span>
                                    ))}
                                </div>

                                {/* Action Button */}
                                <div className="pt-1.5 flex items-center justify-center lg:justify-start w-full sm:w-auto">
                                    <Button asChild size="md" className={cn("px-5 py-2.5 rounded-xl transition-all duration-200 group font-bold text-xs sm:text-sm", w.buttonClass)}>
                                        <Link href={w.ctaHref} className="inline-flex items-center justify-center whitespace-nowrap">
                                            {w.ctaText}
                                            <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Column: Clean Unboxed Vector Illustration with Seamless Cross-Fade */}
                <div className="lg:col-span-6 relative flex items-center justify-center w-full">
                    <div className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px] aspect-square flex items-center justify-center">
                        {WINGS.map((w, idx) => {
                            const isActive = activeIndex === idx;
                            return (
                                <div
                                    key={w.id}
                                    style={{
                                        transition: "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1), transform 900ms cubic-bezier(0.22, 1, 0.36, 1)"
                                    }}
                                    className={cn(
                                        "absolute inset-0 will-change-[opacity,transform] flex items-center justify-center",
                                        isActive
                                            ? "opacity-100 scale-100 z-10 pointer-events-auto"
                                            : "opacity-0 scale-[0.96] z-0 pointer-events-none"
                                    )}
                                >
                                    <Image
                                        src={w.imageSrc}
                                        alt={w.imageAlt}
                                        fill
                                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 440px"
                                        className="object-contain object-center select-none"
                                        priority={true}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
