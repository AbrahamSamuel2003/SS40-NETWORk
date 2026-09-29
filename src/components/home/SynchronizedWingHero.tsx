"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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

const WING_INTERVAL = 3000; // 3.0s cycle cadence

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_EASE = [0.4, 0, 0.2, 1] as const;

const contentVariants: Variants = {
    initial: {
        opacity: 0,
        y: 16,
        filter: "blur(6px)"
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: SMOOTH_EASE,
            staggerChildren: 0.05,
            delayChildren: 0.04
        }
    },
    exit: {
        opacity: 0,
        y: -12,
        filter: "blur(6px)",
        transition: {
            duration: 0.4,
            ease: EXIT_EASE
        }
    }
};

const itemVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.45, ease: SMOOTH_EASE } 
    },
    exit: { 
        opacity: 0, 
        y: -6, 
        transition: { duration: 0.25, ease: EXIT_EASE } 
    }
};

const imageVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.94,
        filter: "blur(8px)"
    },
    animate: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.7,
            ease: SMOOTH_EASE
        }
    },
    exit: {
        opacity: 0,
        scale: 1.04,
        filter: "blur(8px)",
        transition: {
            duration: 0.45,
            ease: EXIT_EASE
        }
    }
};

export function SynchronizedWingHero() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isDocumentHidden, setIsDocumentHidden] = React.useState(false);

    // 1. Permanent visibilitychange listener (never detached when tab is hidden)
    React.useEffect(() => {
        const handleVisibility = () => {
            setIsDocumentHidden(document.hidden);
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    // 2. Interval timer strictly controlled by hover and visibility state
    React.useEffect(() => {
        if (isHovered || isDocumentHidden) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % WINGS.length);
        }, WING_INTERVAL);

        return () => {
            clearInterval(timer);
        };
    }, [isHovered, isDocumentHidden]);

    const activeWing = WINGS[activeIndex];

    return (
        <div 
            className="w-full relative mt-3 sm:mt-4 lg:mt-0 select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Compact 2-Column Synchronized Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
                
                {/* Left Column: Wing Narrative with Silky Smooth AnimatePresence */}
                <div className="lg:col-span-6 relative flex flex-col justify-center items-center lg:items-start text-center lg:text-left min-h-[250px] sm:min-h-[260px] w-full overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={activeWing.id}
                            variants={contentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="w-full space-y-3 flex flex-col items-center lg:items-start text-center lg:text-left will-change-[opacity,transform,filter]"
                        >
                            {/* Wing Badge */}
                            <motion.div 
                                variants={itemVariants}
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px] font-bold border shadow-2xs w-fit",
                                    activeWing.badgeStyle
                                )}
                            >
                                {activeWing.icon}
                                <span>{activeWing.badge}</span>
                            </motion.div>

                            {/* Wing Title */}
                            <motion.h2 
                                variants={itemVariants}
                                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-heading)] leading-[1.18] tracking-tight font-serif"
                            >
                                {activeWing.title} <br className="hidden sm:inline" />
                                <span className="text-[#0F766E]">{activeWing.highlight}</span>
                            </motion.h2>

                            {/* Wing Description */}
                            <motion.p 
                                variants={itemVariants}
                                className="text-xs sm:text-sm text-[var(--color-body-text)] leading-relaxed font-normal max-w-lg lg:max-w-none"
                            >
                                {activeWing.description}
                            </motion.p>

                            {/* Feature Chips */}
                            <motion.div 
                                variants={itemVariants}
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-0.5"
                            >
                                {activeWing.chips.map((chip, chipIdx) => (
                                    <span 
                                        key={chipIdx} 
                                        className="px-2.5 py-0.5 bg-white border border-gray-200 text-gray-700 rounded text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider shadow-2xs whitespace-nowrap"
                                    >
                                        {chip}
                                    </span>
                                ))}
                            </motion.div>

                            {/* Action Button */}
                            <motion.div 
                                variants={itemVariants}
                                className="pt-1.5 flex items-center justify-center lg:justify-start w-full sm:w-auto"
                            >
                                <Button asChild size="md" className={cn("px-5 py-2.5 rounded-xl transition-all duration-200 group font-bold text-xs sm:text-sm", activeWing.buttonClass)}>
                                    <Link href={activeWing.ctaHref} className="inline-flex items-center justify-center whitespace-nowrap">
                                        {activeWing.ctaText}
                                        <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Column: Clean Vector Illustration with Cinematic Depth-of-Field Cross-Dissolve */}
                <div className="lg:col-span-6 relative flex items-center justify-center w-full">
                    <div className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[440px] aspect-square flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={activeWing.id}
                                variants={imageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="absolute inset-0 flex items-center justify-center will-change-[opacity,transform,filter]"
                            >
                                <Image
                                    src={activeWing.imageSrc}
                                    alt={activeWing.imageAlt}
                                    fill
                                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 440px"
                                    className="object-contain object-center select-none"
                                    priority={true}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}
