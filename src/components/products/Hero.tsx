"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    Box,
    Sparkles,
    Database,
    Shield,
    Cloud,
    Cpu
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-white", HERO_SPACING_CLASSES)}>

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Soft Grid Texture */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply"
                    style={{ backgroundImage: 'radial-gradient(#6B9F91 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                />

                {/* Soft Teal Radial Glows */}
                <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#6B9F91]/10 blur-[130px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6B9F91]/5 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
            </div>

            <Container className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

                    {/* Left Column - Content (50%) */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="flex flex-col items-center lg:items-start w-full"
                        >
                            <Badge className="mb-6 rounded-md uppercase tracking-widest text-[10px] font-bold bg-[#F59E0B]/15 text-[#D97706] hover:bg-[#F59E0B]/25 border border-[#F59E0B]/20 shadow-sm">
                                SS40 PRODUCTS
                            </Badge>

                            <h1 className="text-[clamp(40px,5vw,56px)] font-bold text-[#111827] leading-[1.1] tracking-tight mb-6 max-w-2xl">
                                Products Built<br />
                                for Real Business <span className="text-[#6B9F91]">Challenges.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-[#6B7280] mb-10 max-w-xl leading-relaxed">
                                Discover business-ready software products designed to simplify workflows, improve efficiency, and help organizations grow with confidence.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-4">
                                <Button asChild size="lg" className="w-full sm:w-auto bg-[#6B9F91] hover:bg-[#5C8C80] text-white shadow-lg shadow-[#6B9F91]/20 group">
                                    <a href="#featured-product">
                                        Explore Products
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm border-gray-200 hover:bg-white text-gray-700">
                                    <Link href="/contact">
                                        Book a Demo
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - The Constellation (50%) */}
                    <div className="w-full lg:w-1/2 relative flex justify-center items-center min-h-[450px] lg:min-h-[500px]">

                        {/* Connecting SVG Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                            <motion.line
                                x1="50%" y1="50%" x2="25%" y2="25%"
                                stroke="#6B9F91" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"
                                initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 0 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            />
                            <motion.line
                                x1="50%" y1="50%" x2="75%" y2="25%"
                                stroke="#6B9F91" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"
                                initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 0 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            />
                            <motion.line
                                x1="50%" y1="50%" x2="20%" y2="70%"
                                stroke="#FFC900" strokeWidth="2" strokeDasharray="4 4" opacity="0.4"
                                initial={{ strokeDashoffset: -100 }} animate={{ strokeDashoffset: 0 }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                            />
                            <motion.line
                                x1="50%" y1="50%" x2="80%" y2="75%"
                                stroke="#6B9F91" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"
                                initial={{ strokeDashoffset: -100 }} animate={{ strokeDashoffset: 0 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            />
                        </svg>

                        {/* Central Core Sphere */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
                            className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-[0_0_60px_-15px_rgba(107,159,145,0.4)] border-4 border-[#6B9F91]/20 flex flex-col items-center justify-center group"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6B9F91]/10 to-transparent group-hover:rotate-180 transition-transform duration-1000" />
                            <Box className="w-10 h-10 text-[#6B9F91] mb-2" />
                            <span className="text-xs font-bold text-gray-800 tracking-widest uppercase">SS40 Product</span>
                        </motion.div>

                        {/* Node 1: Intelligence (Top Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, y: 50 }}
                            animate={{ opacity: 1, x: 0, y: [-5, 5, -5] }}
                            transition={{
                                opacity: { duration: 0.8, delay: 0.2 },
                                x: { duration: 0.8, delay: 0.2 },
                                y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.2 }
                            }}
                            className="absolute top-[10%] left-[10%] md:top-[15%] md:left-[15%] z-20"
                        >
                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#FFC900]/10 flex items-center justify-center text-[#FFC900]">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">Intelligence</p>
                                    <p className="text-[10px] text-gray-500 font-medium">AI Automation</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Node 2: Data (Top Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50, y: 50 }}
                            animate={{ opacity: 1, x: 0, y: [5, -5, 5] }}
                            transition={{
                                opacity: { duration: 0.8, delay: 0.4 },
                                x: { duration: 0.8, delay: 0.4 },
                                y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.4 }
                            }}
                            className="absolute top-[15%] right-[5%] md:top-[20%] md:right-[10%] z-20"
                        >
                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                    <Database className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">Data Sync</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Zero Latency</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Node 3: Infrastructure (Bottom Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, y: -50 }}
                            animate={{ opacity: 1, x: 0, y: [-4, 4, -4] }}
                            transition={{
                                opacity: { duration: 0.8, delay: 0.6 },
                                x: { duration: 0.8, delay: 0.6 },
                                y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.6 }
                            }}
                            className="absolute bottom-[20%] left-[5%] md:bottom-[25%] md:left-[5%] z-20"
                        >
                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#6B9F91]/10 flex items-center justify-center text-[#6B9F91]">
                                    <Cloud className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">Cloud Native</p>
                                    <p className="text-[10px] text-gray-500 font-medium">99.9% Uptime</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Node 4: Security (Bottom Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50, y: -50 }}
                            animate={{ opacity: 1, x: 0, y: [4, -4, 4] }}
                            transition={{
                                opacity: { duration: 0.8, delay: 0.8 },
                                x: { duration: 0.8, delay: 0.8 },
                                y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.8 }
                            }}
                            className="absolute bottom-[15%] right-[5%] md:bottom-[15%] md:right-[15%] z-20"
                        >
                            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">Enterprise</p>
                                    <p className="text-[10px] text-gray-500 font-medium">End-to-End Secure</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Micro Nodes */}
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-[30%] right-[30%] w-3 h-3 bg-[#FFC900] rounded-full shadow-[0_0_10px_#FFC900]" />
                            <div className="absolute bottom-[30%] left-[30%] w-2 h-2 bg-[#6B9F91] rounded-full shadow-[0_0_10px_#6B9F91]" />
                            <div className="absolute top-[40%] left-[40%] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60A5FA]" />
                        </motion.div>

                    </div>
                </div>
            </Container>
        </section>
    );
}
