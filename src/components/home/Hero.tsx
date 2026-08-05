"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Activity, Users, Box, BarChart3, LayoutDashboard, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";

export function Hero() {
    return (
        <section className="relative w-full overflow-hidden bg-white pt-12 pb-16 lg:pt-16 lg:pb-24">

            {/* Background Blur Shapes */}
            <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--color-hero)]/40 blur-[100px] mix-blend-multiply opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute top-[20%] right-[-20%] w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/10 blur-[100px] mix-blend-multiply opacity-80" />
                <div className="absolute bottom-[-30%] left-[20%] w-[700px] h-[700px] rounded-full bg-[var(--color-soft)]/20 blur-[120px] mix-blend-multiply opacity-60" />
            </div>

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-10">

                    {/* Left Column - Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="mb-8"
                        >
                            <Badge variant="primary" className="py-1.5 px-4 rounded-full flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>The Future of Enterprise Tech</span>
                            </Badge>
                        </motion.div>

                        <h1 className="text-[clamp(40px,5vw,56px)] font-bold text-[var(--color-heading)] leading-[1.1] tracking-tight mb-6">
                            One Company.<br />
                            Three Business Wings.<br />
                            <span className="text-[var(--color-primary)]">Endless Possibilities.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-[var(--color-body-text)] mb-10 max-w-xl leading-relaxed">
                            Driving the modern era forward with world-class digital solutions, innovative SaaS products, and elite academic empowerment.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-[var(--color-primary)]/20 group">
                                <Link href="/digital-solutions">
                                    Explore Solutions
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm">
                                <Link href="/contact">
                                    Contact Us
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right Column - Dashboard Mockup & Floating Cards */}
                    {/* Hidden on mobile completely for a cleaner layout */}
                    <div className="w-full lg:w-[45%] relative mt-10 lg:mt-0 hidden lg:flex justify-center lg:justify-end">

                        {/* Main Dashboard Mockup */}
                        <motion.div
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="relative w-full max-w-[500px] h-[400px] bg-white rounded-2xl shadow-[var(--shadow-hover)] border border-[var(--color-border)] overflow-hidden flex flex-col z-10"
                        >
                            {/* Browser Header */}
                            <div className="h-10 bg-gray-50 border-b border-[var(--color-border)] flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="ml-4 w-48 h-5 bg-white rounded-md border border-[var(--color-border)] flex items-center px-2">
                                    <div className="w-32 h-2 bg-gray-200 rounded-sm" />
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Sidebar */}
                                <div className="w-16 border-r border-[var(--color-border)] bg-gray-50/50 flex flex-col items-center py-4 gap-6">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                                        <div className="w-4 h-4 bg-[var(--color-primary)] rounded-sm" />
                                    </div>
                                    <div className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center hover:bg-gray-100"><LayoutDashboard className="w-5 h-5" /></div>
                                    <div className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center hover:bg-gray-100"><Users className="w-5 h-5" /></div>
                                    <div className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center hover:bg-gray-100"><Activity className="w-5 h-5" /></div>
                                </div>

                                {/* Main Area */}
                                <div className="flex-1 p-5 flex flex-col gap-5 bg-gray-50/30">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-2">
                                            <div className="w-32 h-4 bg-gray-200 rounded-md" />
                                            <div className="w-20 h-3 bg-gray-100 rounded-md" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-[var(--color-border)] space-y-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                <BarChart3 className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="w-16 h-3 bg-gray-100 rounded-md" />
                                            <div className="w-24 h-5 bg-gray-200 rounded-md" />
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-[var(--color-border)] space-y-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                                <Box className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div className="w-16 h-3 bg-gray-100 rounded-md" />
                                            <div className="w-24 h-5 bg-gray-200 rounded-md" />
                                        </div>
                                    </div>

                                    <div className="bg-white flex-1 rounded-xl shadow-sm border border-[var(--color-border)] p-4 space-y-4">
                                        <div className="w-32 h-3 bg-gray-200 rounded-md" />
                                        <div className="space-y-2">
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-[var(--color-primary)] rounded-full" />
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="w-1/2 h-full bg-[var(--color-alternate)] rounded-full" />
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="w-5/6 h-full bg-[var(--color-accent)] rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Feature Cards */}
                        <motion.div
                            animate={{ y: [-15, 10, -15], rotate: [-2, 2, -2] }}
                            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                            className="absolute -left-6 top-12 z-20 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-[var(--color-border)] flex items-center gap-3 hidden md:flex"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div className="pr-2">
                                <p className="text-sm font-bold text-[var(--color-heading)]">Digital Services</p>
                                <p className="text-xs text-[var(--color-body-text)]">Premium IT Solutions</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [10, -15, 10], x: [-5, 5, -5] }}
                            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                            className="absolute -right-8 bottom-24 z-20 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-[var(--color-border)] flex items-center gap-3 hidden sm:flex"
                        >
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="pr-2">
                                <p className="text-sm font-bold text-[var(--color-heading)]">AI Solutions</p>
                                <p className="text-xs text-[var(--color-body-text)]">Next-gen intelligence</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [-8, 12, -8], rotate: [1, -1, 1] }}
                            transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
                            className="absolute left-10 -bottom-8 z-20 bg-[var(--color-primary)] text-white p-3 rounded-xl shadow-lg shadow-[var(--color-primary)]/20 flex items-center gap-3"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <div className="pr-4">
                                <p className="text-sm font-bold">Products & Academics</p>
                                <p className="text-xs text-white/80">World-class education</p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </Container>
        </section>
    );
}
