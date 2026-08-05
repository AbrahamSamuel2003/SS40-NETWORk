"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    Target,
    Workflow,
    Activity,
    TerminalSquare,
    Bot,
    GitBranch,
    Globe,
    Rocket,
    Shield,
    Users,
    BookOpen,
    LayoutDashboard,
    MessageSquare,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";

export function Hero() {
    return (
        <section className="relative w-full overflow-hidden bg-white pt-12 pb-16 lg:pt-16 lg:pb-32 lg:min-h-[min(85vh,900px)] flex items-center border-b border-gray-100">

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                    style={{ backgroundImage: 'radial-gradient(#6B9F91 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFC900]/10 blur-[130px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6B9F91]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

                {/* Glowing Particles */}
                <motion.div animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-[20%] left-[20%] w-2 h-2 bg-[#FFC900] rounded-full shadow-[0_0_10px_#FFC900]" />
                <motion.div animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }} className="absolute bottom-[30%] right-[30%] w-3 h-3 bg-[#6B9F91] rounded-full shadow-[0_0_15px_#6B9F91]" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4], y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-[40%] right-[15%] w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#60A5FA]" />
            </div>

            <Container className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12 w-full">

                    {/* Left Column: Content */}
                    <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col items-center lg:items-start w-full"
                        >
                            <Badge className="mb-6 rounded-md uppercase tracking-widest text-[10px] font-bold bg-[#F59E0B]/15 text-[#D97706] hover:bg-[#F59E0B]/25 border border-[#F59E0B]/20 shadow-sm">
                                SS40 ACADEMICS
                            </Badge>

                            <h1 className="text-[clamp(44px,5vw,72px)] font-bold text-[#111827] leading-[1.1] tracking-tight mb-6">
                                Learn. <br className="hidden md:block" />
                                Build. <br className="hidden md:block" />
                                <span className="text-[#6B9F91]">Grow.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-[#6B7280] mb-10 max-w-lg leading-relaxed">
                                We empower the next generation of engineers with real-world technical skills, deep industry project experience, and career-accelerating placements.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-4">
                                <Button asChild size="lg" className="w-full sm:w-auto bg-[#6B9F91] hover:bg-[#5C8C80] text-white shadow-lg shadow-[#6B9F91]/20 group">
                                    <a href="#student-impacts">
                                        Explore Programs
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white text-gray-700">
                                    <a href="#collaborate">
                                        Partner with Us
                                    </a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Career Launch Pad Visual */}
                    {/* Hidden on mobile completely for a cleaner layout */}
                    <div className="w-full lg:w-[55%] relative hidden lg:flex justify-center items-center min-h-[500px] lg:min-h-[600px] pt-12 pb-8 perspective-1000">
                        <div className="relative w-full max-w-[550px] aspect-square">

                            {/* SVG Connection Lines for Progression Sequence */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Flow path connecting exactly through the mathematical centers of each node */}
                                <motion.path
                                    d="M 20,25 C 15,35 12,40 12,50 C 12,65 20,73 30,78 C 45,83 55,83 70,78 C 80,73 88,65 88,50 C 88,40 85,35 80,25"
                                    fill="transparent"
                                    stroke="#6B9F91"
                                    strokeWidth="0.8"
                                    strokeDasharray="2 2"
                                    opacity="0.5"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
                                />
                                {/* Pulsing progress ball along the exact path */}
                                <motion.circle r="1.5" fill="#C8A24A" opacity="0.9">
                                    <animateMotion
                                        path="M 20,25 C 15,35 12,40 12,50 C 12,65 20,73 30,78 C 45,83 55,83 70,78 C 80,73 88,65 88,50 C 88,40 85,35 80,25"
                                        dur="6s" repeatCount="indefinite" rotate="auto"
                                    />
                                </motion.circle>

                                {/* Soft glowing ring around center */}
                                <motion.circle cx="50" cy="50" r="25" fill="transparent" stroke="#F2F7F5" strokeWidth="0.5" opacity="0.6" />
                                <motion.circle cx="50" cy="50" r="35" fill="transparent" stroke="#F2F7F5" strokeWidth="0.5" opacity="0.4" strokeDasharray="1 2" />
                            </svg>

                            {/* Ambient Glow */}
                            <motion.div animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#6B9F91]/5 rounded-full blur-2xl z-0" />

                            {/* CENTER: Career Launch Pad Platform */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, type: "spring" }}
                                className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10 w-44 h-44 bg-white/80 backdrop-blur-xl rounded-full border border-white shadow-2xl flex flex-col items-center justify-center p-6 text-center ring-8 ring-[#F2F7F5]/50"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-[#6B9F91]/5 to-transparent pointer-events-none" />
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#111827] to-gray-800 flex items-center justify-center shadow-lg border border-gray-700 mb-3 group">
                                    <Rocket className="w-5 h-5 text-white transform group-hover:-translate-y-1 transition-transform" />
                                </div>
                                <span className="text-[9px] uppercase tracking-widest text-[#6B9F91] font-bold mb-1">SS40 Network</span>
                                <h3 className="text-sm font-black text-[#111827] leading-tight">Career<br />Launch Pad</h3>
                            </motion.div>

                            {/* NODE 1: Learn - Center: (20, 25) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                                className="absolute top-[25%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-20"
                            >
                                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[var(--color-border)] flex items-center gap-3 w-32 cursor-default hover:shadow-xl hover:border-gray-300 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                        <BookOpen className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-800">Learn</span>
                                </div>
                            </motion.div>

                            {/* NODE 2: Build - Center: (12, 50) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                                className="absolute top-[50%] left-[12%] -translate-x-1/2 -translate-y-1/2 z-20"
                            >
                                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-[var(--color-border)] flex flex-col gap-2 w-32 cursor-default hover:border-[#6B9F91]/40 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#6B9F91]/10 flex items-center justify-center border border-[#6B9F91]/20">
                                            <TerminalSquare className="w-4 h-4 text-[#6B9F91]" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-800">Build</span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1">
                                        <motion.div className="h-full bg-[#6B9F91]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} />
                                    </div>
                                </div>
                            </motion.div>

                            {/* NODE 3: GitHub - Center: (30, 78) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
                                className="absolute top-[78%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-20"
                            >
                                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[var(--color-border)] flex items-center gap-3 w-32 cursor-default hover:shadow-xl hover:border-gray-300 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                        <GitBranch className="w-4 h-4 text-gray-700" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-800">GitHub</span>
                                </div>
                            </motion.div>

                            {/* NODE 4: Portfolio - Center: (70, 78) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
                                className="absolute top-[78%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-20"
                            >
                                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[var(--color-border)] flex items-center gap-3 w-36 cursor-default hover:border-[#6B9F91]/30 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-[#6B9F91] flex items-center justify-center shrink-0 shadow-sm shadow-[#6B9F91]/40 border border-[#6B9F91]">
                                        <LayoutDashboard className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-800">Portfolio</span>
                                </div>
                            </motion.div>

                            {/* NODE 5: Interview - Center: (88, 50) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0 }}
                                className="absolute top-[50%] left-[88%] -translate-x-1/2 -translate-y-1/2 z-20"
                            >
                                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[var(--color-border)] flex items-center gap-3 w-32 cursor-default hover:border-gray-300 transition-all">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                                        <MessageSquare className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-800">Interview</span>
                                </div>
                            </motion.div>

                            {/* NODE 6: Career (Apex / Target) - Center: (80, 25) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: [1, 1.05, 1] }} transition={{ delay: 1.2, scale: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                                className="absolute top-[25%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-30"
                            >
                                <div className="bg-[#111827] backdrop-blur-md rounded-2xl p-4 shadow-2xl shadow-[#C8A24A]/20 border border-[#C8A24A]/40 flex items-center gap-3 w-40 transform hover:scale-105 transition-transform cursor-default">
                                    <div className="w-10 h-10 rounded-full bg-[#C8A24A]/10 flex items-center justify-center shrink-0 border border-[#C8A24A]/20 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#C8A24A]/20 to-transparent" />
                                        <Briefcase className="w-5 h-5 text-[#C8A24A] relative z-10" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white">Career</span>
                                        <span className="text-[9px] font-bold text-[#C8A24A] uppercase tracking-wider">Industry Ready</span>
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
