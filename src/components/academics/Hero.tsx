"use client";

import * as React from "react";
import Link from "next/link";
import {
    ArrowRight,
    TerminalSquare,
    GitBranch,
    Rocket,
    BookOpen,
    LayoutDashboard,
    MessageSquare,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-white border-b border-gray-100", HERO_SPACING_CLASSES)}>

            {/* Ambient Background & Gradients (Clean Stacking Context) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.85) 65%, #ffffff 100%)' }}
                />
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                    style={{ backgroundImage: 'radial-gradient(#6B9F91 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                />
            </div>

            <Container className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12 w-full">

                    {/* Left Column: Content (Static SSR for instant zero-delay LCP paint) */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="flex flex-col items-center lg:items-start w-full">
                            <Badge className="mb-6 rounded-md uppercase tracking-widest text-[10px] font-bold bg-[#FFC900]/15 text-[#92400E] hover:bg-[#FFC900]/25 border border-[#FFC900]/30 shadow-2xs">
                                SS40 ACADEMICS
                            </Badge>

                            <h1 className="text-[clamp(40px,5vw,56px)] font-bold text-[#111827] leading-[1.1] tracking-tight mb-6 max-w-2xl font-serif">
                                Learn by Doing.<br />
                                Build Fast.<br />
                                <span className="text-[#0F766E]">Grow Beyond.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-[#6B7280] mb-10 max-w-xl leading-relaxed">
                                We empower the next generation of engineers with real-world technical skills, deep industry project experience, and career-accelerating placements.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-4">
                                <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-[var(--color-primary)]/20 group">
                                    <a href="#placements" className="inline-flex items-center justify-center whitespace-nowrap">
                                        Explore Programs
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/70 backdrop-blur-sm border-gray-300 hover:bg-white text-gray-800">
                                    <a href="#collaborate" className="inline-flex items-center justify-center whitespace-nowrap">
                                        Partner with Us
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Career Launch Pad Visual (Full Mobile & Desktop Responsiveness) */}
                    <div className="w-full lg:w-1/2 relative flex justify-center items-center min-h-[310px] sm:min-h-[350px] lg:min-h-[380px] py-4 sm:py-0 select-none transform-gpu">
                        <div className="relative w-full max-w-[310px] sm:max-w-[400px] lg:max-w-[440px] aspect-square">

                            {/* SVG Connection Lines for Progression Sequence */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Flow path connecting exactly through the mathematical centers of each node */}
                                <path
                                    d="M 20,25 C 15,35 12,40 12,50 C 12,65 20,73 30,78 C 45,83 55,83 70,78 C 80,73 88,65 88,50 C 88,40 85,35 80,25"
                                    fill="transparent"
                                    stroke="#6B9F91"
                                    strokeWidth="0.8"
                                    strokeDasharray="2 2"
                                    opacity="0.5"
                                />
                                {/* Pulsing progress ball along the exact path */}
                                <circle r="1.5" fill="#C8A24A" opacity="0.9">
                                    <animateMotion
                                        path="M 20,25 C 15,35 12,40 12,50 C 12,65 20,73 30,78 C 45,83 55,83 70,78 C 80,73 88,65 88,50 C 88,40 85,35 80,25"
                                        dur="6s" repeatCount="indefinite" rotate="auto"
                                    />
                                </circle>

                                {/* Soft glowing ring around center */}
                                <circle cx="50" cy="50" r="25" fill="transparent" stroke="#D8E8E2" strokeWidth="0.5" opacity="0.6" />
                                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#D8E8E2" strokeWidth="0.5" opacity="0.4" strokeDasharray="1 2" />
                            </svg>

                            {/* Ambient Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#6B9F91]/5 rounded-full blur-2xl z-0 pointer-events-none" />

                            {/* CENTER: Career Launch Pad Platform */}
                            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 bg-white/90 backdrop-blur-xl rounded-full border border-white shadow-xl flex flex-col items-center justify-center p-2 sm:p-4 text-center ring-4 sm:ring-6 ring-[#D8E8E2]/50 transition-transform duration-300">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#6B9F91]/5 to-transparent pointer-events-none" />
                                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#111827] to-gray-800 flex items-center justify-center shadow-md border border-gray-700 mb-1 sm:mb-2 group">
                                    <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transform group-hover:-translate-y-1 transition-transform" />
                                </div>
                                <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-[#6B9F91] font-bold">SS40 NETWORK</span>
                                <span className="text-[10px] sm:text-xs font-black text-[#111827] leading-tight block">Career<br className="hidden sm:inline" /> Launch Pad</span>
                            </div>

                            {/* NODE 1: Learn - Center: (20, 25) */}
                            <div className="absolute top-[25%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-1.5 sm:p-3 shadow-lg border border-[var(--color-border)] flex items-center gap-1.5 sm:gap-3 w-22 sm:w-32 cursor-default hover:shadow-xl hover:border-gray-300 transition-all">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold text-gray-800">Learn</span>
                                </div>
                            </div>

                            {/* NODE 2: Build - Center: (12, 50) */}
                            <div className="absolute top-[50%] left-[12%] -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-1.5 sm:p-3 shadow-xl border border-[var(--color-border)] flex flex-col gap-1 sm:gap-2 w-22 sm:w-32 cursor-default hover:border-[#6B9F91]/40 transition-colors">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#6B9F91]/10 flex items-center justify-center border border-[#6B9F91]/20">
                                            <TerminalSquare className="w-3 h-3 sm:w-4 sm:h-4 text-[#6B9F91]" />
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-bold text-gray-800">Build</span>
                                    </div>
                                    <div className="w-full h-0.5 sm:h-1 bg-gray-100 rounded-full overflow-hidden mt-0.5 sm:mt-1">
                                        <div className="h-full bg-[#6B9F91] w-full animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* NODE 3: GitHub - Center: (30, 78) */}
                            <div className="absolute top-[78%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-1.5 sm:p-3 shadow-lg border border-[var(--color-border)] flex items-center gap-1.5 sm:gap-3 w-22 sm:w-32 cursor-default hover:shadow-xl hover:border-gray-300 transition-all">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                        <GitBranch className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold text-gray-800">GitHub</span>
                                </div>
                            </div>

                            {/* NODE 4: Portfolio - Center: (70, 78) */}
                            <div className="absolute top-[78%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-1.5 sm:p-3 shadow-lg border border-[var(--color-border)] flex items-center gap-1.5 sm:gap-3 w-24 sm:w-36 cursor-default hover:border-[#6B9F91]/30 transition-all">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#6B9F91] flex items-center justify-center shrink-0 shadow-sm shadow-[#6B9F91]/40 border border-[#6B9F91]">
                                        <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold text-gray-800">Portfolio</span>
                                </div>
                            </div>

                            {/* NODE 5: Interview - Center: (88, 50) */}
                            <div className="absolute top-[50%] left-[88%] -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-1.5 sm:p-3 shadow-lg border border-[var(--color-border)] flex items-center gap-1.5 sm:gap-3 w-22 sm:w-32 cursor-default hover:border-gray-300 transition-all">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold text-gray-800">Interview</span>
                                </div>
                            </div>

                            {/* NODE 6: Career (Apex / Target) - Center: (80, 25) */}
                            <div className="absolute top-[25%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-30">
                                <div className="bg-[#111827] backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-2xl shadow-[#C8A24A]/20 border border-[#C8A24A]/40 flex items-center gap-1.5 sm:gap-3 w-28 sm:w-40 transform hover:scale-105 transition-transform cursor-default">
                                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#C8A24A]/10 flex items-center justify-center shrink-0 border border-[#C8A24A]/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#C8A24A]/20 to-transparent" />
                                        <Briefcase className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#C8A24A] relative z-10" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] sm:text-xs font-bold text-white">Career</span>
                                        <span className="text-[7px] sm:text-[9px] font-bold text-[#C8A24A] uppercase tracking-wider">Industry Ready</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
