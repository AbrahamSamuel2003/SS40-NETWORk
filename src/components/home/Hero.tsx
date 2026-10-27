import * as React from "react";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";
import { SynchronizedWingHero } from "./SynchronizedWingHero";

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-white py-6 sm:py-8 lg:py-10", HERO_SPACING_CLASSES)}>

            {/* 1. Minimalist Flowing Wave Gradients with Soft Top Border Fade */}
            <div 
                className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
                style={{
                    maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 100%)"
                }}
            >
                {/* Soft Ambient Radial Lighting */}
                <div className="absolute -top-32 left-1/4 w-[700px] h-[450px] bg-gradient-to-br from-[#2DD4BF]/15 via-[#0F766E]/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-24 right-5 w-[750px] h-[500px] bg-gradient-to-tl from-[#2DD4BF]/12 via-[#D8E8E2]/35 to-transparent rounded-full blur-3xl" />

                {/* Smooth Flowing Wave Curves with Soft Feathered Contour */}
                <svg
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    viewBox="0 0 1440 650"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <defs>
                        {/* Soft Feather Filter to eliminate sharp vector edges along the wave crests */}
                        <filter id="heroWaveFeather" x="-10%" y="-10%" width="120%" height="120%">
                            <feGaussianBlur stdDeviation="3.5" />
                        </filter>
                        <linearGradient id="heroWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.22" />
                            <stop offset="45%" stopColor="#0F766E" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#D8E8E2" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="heroWaveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0F766E" stopOpacity="0.10" />
                            <stop offset="55%" stopColor="#2DD4BF" stopOpacity="0.06" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Minimalist Top/Center Wave with Feather Filter */}
                    <path
                        d="M -100 240 C 260 150, 480 340, 880 210 C 1180 120, 1380 250, 1600 190 L 1600 650 L -100 650 Z"
                        fill="url(#heroWaveGrad1)"
                        filter="url(#heroWaveFeather)"
                    />

                    {/* Minimalist Base Layer Wave with Feather Filter */}
                    <path
                        d="M -50 380 C 340 270, 680 430, 1080 310 C 1340 240, 1490 330, 1650 290 L 1650 650 L -50 650 Z"
                        fill="url(#heroWaveGrad2)"
                        filter="url(#heroWaveFeather)"
                    />
                </svg>

                {/* Soft Top Border Dissolve into Navbar */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
            </div>

            <Container className="relative z-20">
                {/* Center Focused Narrative Header */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8 sm:mb-6 lg:mb-1">
                    {/* Compact Eyebrow Tag */}
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-widest bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#0F766E] mb-2.5 shadow-2xs font-crimson">
                        &ldquo;A LITTLE BIT MORE&rdquo;
                    </div>

                    {/* Headline strictly in 2 lines across all viewports */}
                    <h1 className="text-[clamp(30px,4.2vw,52px)] font-bold text-[var(--color-heading)] leading-[1.1] tracking-tight mb-2 font-serif font-crimson">
                        One Company. Three Wings.<br />
                        <span className="text-[#0F766E]">
                            Endless Possibilities.
                        </span>
                    </h1>
                </div>

                {/* Main Visual Centerpiece: Synchronized Automated 3-Wing Hero */}
                <SynchronizedWingHero />
            </Container>
        </section>
    );
}
