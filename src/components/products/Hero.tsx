"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";

// Chart data points representing company growth trajectory powered by SS40 products
const CHART_DATA = [
    { label: "ClearInvoice", barH: 48, barY: 112, lineY: 96 },
    { label: "ClearInvoice", barH: 82, barY: 78, lineY: 62 },
    { label: "ClearInvoice", barH: 74, barY: 86, lineY: 70 },
    { label: "GTC", barH: 64, barY: 96, lineY: 80 },
    { label: "GTC", barH: 98, barY: 62, lineY: 48 },
    { label: "AI Email Agent", barH: 126, barY: 34, lineY: 22 },
    { label: "AI Email Agent", barH: 112, barY: 48, lineY: 36 },
    { label: "Enterprise Scale", barH: 142, barY: 18, lineY: 8 },
];

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-white", HERO_SPACING_CLASSES)}>

            {/* Ambient Background & Gradients */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.85) 65%, #ffffff 100%)' }}
                />
                {/* Soft Grid Texture */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
                    style={{ backgroundImage: 'radial-gradient(#6B9F91 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                />
            </div>

            <Container className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">

                    {/* Left Column - Content (50%) */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col items-center lg:items-start w-full"
                        >
                            <Badge className="mb-6 rounded-md uppercase tracking-widest text-[10px] font-bold bg-[#FFC900]/15 text-[#92400E] hover:bg-[#FFC900]/25 border border-[#FFC900]/30 shadow-sm">
                                SS40 PRODUCTS
                            </Badge>

                            <h1 className="text-[clamp(40px,5vw,56px)] font-bold text-[#111827] leading-[1.1] tracking-tight mb-6 max-w-2xl font-serif">
                                Products Built<br />
                                for Real Business <span className="text-[#0F766E]">Challenges.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-[#6B7280] mb-10 max-w-xl leading-relaxed">
                                Discover business-ready software products designed to simplify workflows, improve efficiency, and help organizations grow with confidence.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-4">
                                <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-[var(--color-primary)]/20 group">
                                    <a href="#featured-product" className="inline-flex items-center justify-center whitespace-nowrap">
                                        Explore Products
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/70 backdrop-blur-sm border-gray-300 hover:bg-white text-gray-800">
                                    <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap">
                                        Book a Demo
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Enterprise Product-Driven Company Growth Dashboard */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center select-none">
                        <div className="relative w-full max-w-[500px]">

                            {/* Soft Ambient Stage Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-[#2DD4BF]/20 to-[#0F766E]/10 rounded-full blur-3xl pointer-events-none -z-0" />

                            {/* MAIN GLASS TERMINAL */}
                            <motion.div
                                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="relative z-10 w-full bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden transform-gpu"
                            >
                                {/* Inner Top Sheen */}
                                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-teal-50/40 via-white/20 to-transparent pointer-events-none" />

                                {/* Header: Company Scaling Hub & Growth Pill (No dot) */}
                                <div className="flex items-center justify-between z-10 pb-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-[#0F766E]/10 border border-[#0F766E]/20 flex items-center justify-center text-[#0F766E] shadow-2xs">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">Company Growth Velocity</h4>
                                            <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">Powered by SS40 Product Ecosystem</p>
                                        </div>
                                    </div>

                                    {/* Clean Growth Badge (Dot Removed) */}
                                    <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-2xs">
                                        <span className="text-[11px] sm:text-xs font-black text-emerald-700 tracking-tight">+184.6% YoY</span>
                                    </div>
                                </div>

                                {/* Minimal Product Adoption Pipeline Chips */}
                                <div className="grid grid-cols-3 gap-1.5 pt-3 z-10">
                                    <div className="px-2 py-1 bg-gray-50/90 rounded-lg border border-gray-100 text-center">
                                        <span className="text-[10px] sm:text-[11px] font-bold text-gray-800 block truncate">ClearInvoice</span>
                                        <span className="text-[8px] sm:text-[9px] text-gray-500 block">Billing & GST</span>
                                    </div>
                                    <div className="px-2 py-1 bg-teal-50/60 rounded-lg border border-teal-100 text-center">
                                        <span className="text-[10px] sm:text-[11px] font-bold text-[#0F766E] block truncate">GTC</span>
                                        <span className="text-[8px] sm:text-[9px] text-teal-600 block">Enterprise Ops</span>
                                    </div>
                                    <div className="px-2 py-1 bg-gray-50/90 rounded-lg border border-gray-100 text-center">
                                        <span className="text-[10px] sm:text-[11px] font-bold text-gray-800 block truncate">AI Email Agent</span>
                                        <span className="text-[8px] sm:text-[9px] text-gray-500 block">Automation</span>
                                    </div>
                                </div>

                                {/* Dynamic Interactive Growth Graph Area */}
                                <div className="relative w-full my-3 min-h-[175px] sm:min-h-[195px] flex items-end">
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 460 185" preserveAspectRatio="none">
                                        <defs>
                                            {/* Bar Gradient */}
                                            <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.9" />
                                                <stop offset="60%" stopColor="#14B8A6" stopOpacity="0.8" />
                                                <stop offset="100%" stopColor="#0F766E" stopOpacity="0.95" />
                                            </linearGradient>

                                            {/* Bar Highlight Accent */}
                                            <linearGradient id="barPeakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#5EEAD4" />
                                                <stop offset="100%" stopColor="#0D9488" />
                                            </linearGradient>

                                            {/* Line Gradient */}
                                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#0D9488" />
                                                <stop offset="50%" stopColor="#0284C7" />
                                                <stop offset="100%" stopColor="#0F766E" />
                                            </linearGradient>

                                            {/* Under Area Gradient */}
                                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
                                                <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.08" />
                                                <stop offset="100%" stopColor="#0F766E" stopOpacity="0.0" />
                                            </linearGradient>

                                            {/* Arrow Marker Definition */}
                                            <marker
                                                id="arrowHead"
                                                viewBox="0 0 10 10"
                                                refX="6"
                                                refY="5"
                                                markerWidth="6"
                                                markerHeight="6"
                                                orient="auto-start-reverse"
                                            >
                                                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0F766E" />
                                            </marker>

                                            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                                <feMerge>
                                                    <feMergeNode in="blur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {/* Subtle Horizontal Guide Lines */}
                                        <line x1="15" y1="40" x2="445" y2="40" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                                        <line x1="15" y1="80" x2="445" y2="80" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                                        <line x1="15" y1="120" x2="445" y2="120" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                                        <line x1="15" y1="160" x2="445" y2="160" stroke="#E5E7EB" strokeWidth="1" />

                                        {/* Dynamic Rising Column Bars */}
                                        {CHART_DATA.map((item, idx) => {
                                            const x = 32 + idx * 52;
                                            const isPeak = idx === CHART_DATA.length - 1 || idx === 5;
                                            return (
                                                <g key={idx}>
                                                    {/* Vertical Bar Base */}
                                                    <motion.rect
                                                        x={x - 12}
                                                        y={item.barY}
                                                        width="24"
                                                        height={item.barH}
                                                        rx="6"
                                                        fill={isPeak ? "url(#barPeakGrad)" : "url(#barGrad)"}
                                                        initial={{ scaleY: 0, originY: "160px" }}
                                                        animate={{ scaleY: 1 }}
                                                        transition={{
                                                            duration: 0.6,
                                                            delay: 0.1 + idx * 0.07,
                                                            ease: "easeOut"
                                                        }}
                                                    />

                                                    {/* Soft Bar Header Highlight */}
                                                    <motion.rect
                                                        x={x - 10}
                                                        y={item.barY + 2}
                                                        width="20"
                                                        height="3"
                                                        rx="1.5"
                                                        fill="#FFFFFF"
                                                        opacity={0.5}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 0.5 }}
                                                        transition={{ delay: 0.3 + idx * 0.07 }}
                                                    />
                                                </g>
                                            );
                                        })}

                                        {/* Under-Curve Shaded Gradient Area */}
                                        <motion.path
                                            d="M 32,96 L 84,62 L 136,70 L 188,80 L 240,48 L 292,22 L 344,36 L 396,8 L 396,160 L 32,160 Z"
                                            fill="url(#areaGradient)"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                        />

                                        {/* Animated Connecting Trendline (Fluctuating with Ups & Downs) */}
                                        <motion.path
                                            d="M 32,96 L 84,62 L 136,70 L 188,80 L 240,48 L 292,22 L 344,36 L 396,8"
                                            fill="none"
                                            stroke="url(#lineGrad)"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            filter="url(#softGlow)"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
                                        />

                                        {/* Growth Trajectory Arrow at Peak End */}
                                        <motion.path
                                            d="M 396,8 L 428,-4"
                                            fill="none"
                                            stroke="#0F766E"
                                            strokeWidth="3.5"
                                            strokeLinecap="round"
                                            markerEnd="url(#arrowHead)"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.4, delay: 1.4, ease: "easeOut" }}
                                        />

                                        {/* Data Node Dots */}
                                        {CHART_DATA.map((item, idx) => {
                                            const x = 32 + idx * 52;
                                            return (
                                                <g key={`node-${idx}`}>
                                                    <motion.circle
                                                        cx={x}
                                                        cy={item.lineY}
                                                        r="4.5"
                                                        fill="#0F766E"
                                                        stroke="#FFFFFF"
                                                        strokeWidth="2.5"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            duration: 0.3,
                                                            delay: 0.3 + idx * 0.1,
                                                            ease: "backOut"
                                                        }}
                                                    />
                                                </g>
                                            );
                                        })}

                                        {/* Gliding Live Pulse Orb */}
                                        <motion.circle r="5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2">
                                            <animateMotion
                                                path="M 32,96 L 84,62 L 136,70 L 188,80 L 240,48 L 292,22 L 344,36 L 396,8"
                                                dur="4.5s"
                                                repeatCount="indefinite"
                                            />
                                        </motion.circle>
                                    </svg>
                                </div>

                                {/* Bottom Product Impact Bar */}
                                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center z-10">
                                    <div className="py-1.5 px-1 bg-gray-50/80 rounded-xl border border-gray-100/90">
                                        <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold block uppercase tracking-wider">ClearInvoice</span>
                                        <span className="text-xs sm:text-sm font-black text-[#111827]">99.9% Automated</span>
                                    </div>
                                    <div className="py-1.5 px-1 bg-teal-50/50 rounded-xl border border-teal-100/80">
                                        <span className="text-[9px] sm:text-[10px] text-teal-700 font-bold block uppercase tracking-wider">
                                            GTC Suite
                                        </span>
                                        <span className="text-xs sm:text-sm font-black text-[#0F766E]">Enterprise Scale</span>
                                    </div>
                                    <div className="py-1.5 px-1 bg-gray-50/80 rounded-xl border border-gray-100/90">
                                        <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold block uppercase tracking-wider">AI Email Agent</span>
                                        <span className="text-xs sm:text-sm font-black text-[#111827]">Zero Latency</span>
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}


