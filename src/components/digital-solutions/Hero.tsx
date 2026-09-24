"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    Sparkles,
    LayoutDashboard,
    LineChart,
    Smartphone,
    Bell,
    Code2,
    Database,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-white", HERO_SPACING_CLASSES)}>

            {/* Ambient Background & Gradients (Clean Stacking Context) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.85) 65%, #ffffff 100%)' }}
                />
                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                />
            </div>

            <Container className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

                    {/* Left Column - Content (50%) */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col items-center lg:items-start w-full"
                        >
                            <Badge className="mb-6 rounded-md uppercase tracking-widest text-[10px] font-bold bg-[#FFC900]/15 text-[#92400E] hover:bg-[#FFC900]/25 border border-[#FFC900]/30 shadow-2xs">
                                SS40 Digital Solutions
                            </Badge>

                            <h1 className="text-[clamp(40px,5vw,56px)] font-bold text-[var(--color-heading)] leading-[1.1] tracking-tight mb-6 max-w-2xl font-serif">
                                Engineering Digital<br />
                                Experiences <span className="text-[#0F766E]">That Scale.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-[var(--color-body-text)] mb-10 max-w-xl leading-relaxed">
                                We design, develop, and deploy scalable digital products that help businesses innovate, automate, and grow.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-4">
                                <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-[var(--color-primary)]/20 group">
                                    <Link href="/contact?source=DIGITAL_SOLUTIONS_START_PROJECT&sourcePage=/digital-solutions" className="inline-flex items-center justify-center whitespace-nowrap">
                                        Start Your Project
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/70 backdrop-blur-sm border-gray-300 hover:bg-white text-gray-800">
                                    <a href="#featured-projects" className="inline-flex items-center justify-center whitespace-nowrap">
                                        View Our Work
                                    </a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Mockup (50%) */}
                    <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end min-h-[260px] sm:min-h-[320px] lg:min-h-[360px]">

                        {/* Main Application Mockup */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                            className="relative w-full max-w-[420px] sm:max-w-[450px] aspect-[16/11] bg-white rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden flex flex-col z-10"
                        >
                            {/* Browser Header */}
                            <div className="h-8 sm:h-9 bg-gray-50 border-b border-[var(--color-border)] flex items-center px-3.5 gap-2 shrink-0">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                                <div className="ml-3 w-28 sm:w-36 h-4 bg-white rounded-md border border-[var(--color-border)] flex items-center px-2">
                                    <div className="w-16 sm:w-24 h-2 bg-gray-100 rounded-sm" />
                                </div>
                            </div>

                            {/* App Interface */}
                            <div className="flex flex-1 overflow-hidden bg-gray-50/30">
                                {/* Sidebar */}
                                <div className="w-12 sm:w-36 md:w-40 border-r border-[var(--color-border)] bg-gray-50/80 flex flex-col py-3 shrink-0">
                                    <div className="w-7 h-7 sm:w-auto sm:h-auto mx-auto sm:mx-3 mb-4 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg sm:rounded-xl flex items-center sm:items-start justify-center sm:px-2.5 sm:py-1.5 gap-1.5">
                                        <Code2 className="w-4 h-4 shrink-0" />
                                        <span className="hidden sm:block font-bold text-xs">Dashboard</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5 px-1.5 sm:px-3">
                                        <div className="w-full h-7 sm:h-8 rounded-md bg-white border border-[var(--color-border)] flex items-center justify-center sm:justify-start sm:px-2.5">
                                            <LayoutDashboard className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                            <span className="hidden sm:block ml-2 text-[11px] font-semibold text-[var(--color-heading)]">Overview</span>
                                        </div>
                                        <div className="w-full h-7 sm:h-8 rounded-md flex items-center justify-center sm:justify-start sm:px-2.5 text-gray-400 hover:bg-gray-100">
                                            <Database className="w-3.5 h-3.5" />
                                            <span className="hidden sm:block ml-2 text-[11px] font-medium">Servers</span>
                                        </div>
                                        <div className="w-full h-7 sm:h-8 rounded-md flex items-center justify-center sm:justify-start sm:px-2.5 text-gray-400 hover:bg-gray-100">
                                            <Shield className="w-3.5 h-3.5" />
                                            <span className="hidden sm:block ml-2 text-[11px] font-medium">Security</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Area */}
                                <div className="flex-1 p-3 sm:p-4 flex flex-col gap-3 overflow-hidden relative">

                                    {/* Abstract Charts */}
                                    <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-2xs p-3 w-full h-1/2 flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="space-y-1">
                                                <div className="w-20 h-2.5 bg-gray-200 rounded-sm" />
                                                <div className="w-12 h-1.5 bg-gray-100 rounded-sm" />
                                            </div>
                                            <LineChart className="w-3.5 h-3.5 text-gray-300" />
                                        </div>
                                        <div className="flex-1 flex items-end gap-1.5 sm:gap-2 px-1">
                                            {[30, 50, 40, 70, 50, 90, 60].map((height, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: "0%" }}
                                                    animate={{ height: `${height}%` }}
                                                    transition={{ duration: 0.8, delay: 0.3 + (i * 0.08) }}
                                                    className="flex-1 bg-gradient-to-t from-[var(--color-primary)]/20 to-[var(--color-primary)] rounded-t-xs"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Data Blocks */}
                                    <div className="grid grid-cols-2 gap-2.5 flex-1">
                                        <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-2xs p-2.5 h-full flex flex-col justify-between">
                                            <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] flex items-center justify-center">
                                                <Sparkles className="w-2.5 h-2.5" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="w-8 h-3 bg-gray-200 rounded-sm" />
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-sm" />
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-2xs p-2.5 h-full flex flex-col justify-between">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                                                <LayoutDashboard className="w-2.5 h-2.5" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="w-10 h-3 bg-gray-200 rounded-sm" />
                                                <div className="w-14 h-1.5 bg-gray-100 rounded-sm" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Element 1: Mobile App Preview */}
                        <motion.div
                            animate={{ y: [-6, 6, -6] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute -right-2 sm:-right-4 bottom-6 z-20 w-20 sm:w-24 h-40 sm:h-48 bg-white rounded-[20px] shadow-xl border-2 sm:border-3 border-gray-900 flex flex-col overflow-hidden hidden sm:flex transform-gpu"
                            style={{ willChange: "transform", transform: "translateZ(0)" }}
                        >
                            <div className="w-full h-3.5 bg-gray-900 rounded-b-lg flex items-center justify-center shrink-0">
                                <div className="w-6 h-1 rounded-full bg-gray-700" />
                            </div>
                            <div className="flex-1 bg-gray-50 p-2 flex flex-col gap-1.5">
                                <div className="w-full h-1/3 bg-white rounded-lg shadow-2xs border border-[var(--color-border)] p-1.5">
                                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-500 flex flex-col items-center justify-center mb-0.5"><Smartphone className="w-2.5 h-2.5" /></div>
                                    <div className="w-8 h-1 bg-gray-200 rounded-full" />
                                </div>
                                <div className="flex-1 flex gap-1.5">
                                    <div className="w-1/2 h-full bg-white rounded-md border border-[var(--color-border)] shadow-2xs" />
                                    <div className="w-1/2 h-full bg-[var(--color-primary)]/10 rounded-md border border-[var(--color-primary)]/20 shadow-2xs" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Element 2: Notification Card */}
                        <motion.div
                            animate={{ y: [6, -6, 6] }}
                            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                            className="absolute left-0 sm:-left-4 md:-left-6 top-6 sm:top-10 z-20 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl shadow-lg border border-[var(--color-border)] flex items-start gap-2.5 w-[180px] sm:w-[210px] transform-gpu"
                            style={{ willChange: "transform", transform: "translateZ(0)" }}
                        >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 flex flex-col shrink-0 items-center justify-center text-green-600">
                                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[11px] sm:text-xs font-bold text-[var(--color-heading)] leading-tight">Deployment Successful</p>
                                <p className="text-[9px] sm:text-[10px] text-[var(--color-body-text)] mt-0.5">Production build v2.4.1 is live globally.</p>
                            </div>
                        </motion.div>

                        {/* Floating Element 3: AI Assistant Widget */}
                        <motion.div
                            animate={{ y: [-4, 4, -4], rotate: [-1.5, 1.5, -1.5] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute left-1/4 -bottom-4 z-30 bg-gray-900 text-white py-1.5 px-3 rounded-full shadow-md flex items-center gap-1.5 border border-gray-700 hidden lg:flex transform-gpu"
                            style={{ willChange: "transform", transform: "translateZ(0)" }}
                        >
                            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                            <p className="text-[11px] font-bold font-mono">AI analyzing metrics...</p>
                        </motion.div>

                    </div>
                </div>
            </Container>
        </section>
    );
}
