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

            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                />

                {/* Soft Teal Radial Glows */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)]/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6B9F91]/10 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-[var(--color-accent)]/5 blur-[120px] rounded-[100%] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
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
                                Digital Solutions
                            </Badge>

                            <h1 className="text-[clamp(40px,5vw,56px)] font-bold text-[var(--color-heading)] leading-[1.1] tracking-tight mb-6 max-w-2xl">
                                Engineering Digital<br />
                                Experiences <span className="text-[var(--color-primary)]">That Scale.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-[var(--color-body-text)] mb-10 max-w-xl leading-relaxed">
                                We design, develop, and deploy scalable digital products that help businesses innovate, automate, and grow.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto gap-4">
                                <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-[var(--color-primary)]/20 group">
                                    <Link href="/contact">
                                        Start Your Project
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm">
                                    <a href="#featured-projects">
                                        View Our Work
                                    </a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Mockup (50%) */}
                    <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end min-h-[450px] px-6 md:px-12 lg:px-0">

                        {/* Main Application Mockup */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="relative w-full max-w-[550px] aspect-[4/3] bg-white rounded-2xl shadow-[var(--shadow-hover)] border border-[var(--color-border)] overflow-hidden flex flex-col z-10"
                        >
                            {/* Browser Header */}
                            <div className="h-10 bg-gray-50 border-b border-[var(--color-border)] flex items-center px-4 gap-2 shrink-0">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="ml-4 w-48 h-5 bg-white rounded-md border border-[var(--color-border)] flex items-center px-2">
                                    <div className="w-32 h-2.5 bg-gray-100 rounded-sm" />
                                </div>
                            </div>

                            {/* App Interface */}
                            <div className="flex flex-1 overflow-hidden bg-gray-50/30">
                                {/* Sidebar */}
                                <div className="w-16 md:w-48 border-r border-[var(--color-border)] bg-gray-50/80 flex flex-col py-4 shrink-0">
                                    <div className="w-8 h-8 md:w-auto md:h-auto mx-auto md:mx-4 mb-8 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg md:rounded-xl flex items-center md:items-start justify-center md:px-3 md:py-2 gap-2">
                                        <Code2 className="w-5 h-5 shrink-0" />
                                        <span className="hidden md:block font-bold text-sm">Dashboard</span>
                                    </div>
                                    <div className="flex flex-col gap-2 px-2 md:px-4">
                                        <div className="w-full h-8 md:h-10 rounded-md bg-white border border-[var(--color-border)] flex items-center justify-center md:justify-start md:px-3">
                                            <LayoutDashboard className="w-4 h-4 text-[var(--color-primary)]" />
                                            <span className="hidden md:block ml-2 text-xs font-semibold text-[var(--color-heading)]">Overview</span>
                                        </div>
                                        <div className="w-full h-8 md:h-10 rounded-md flex items-center justify-center md:justify-start md:px-3 text-gray-400 hover:bg-gray-100">
                                            <Database className="w-4 h-4" />
                                            <span className="hidden md:block ml-2 text-xs font-medium">Servers</span>
                                        </div>
                                        <div className="w-full h-8 md:h-10 rounded-md flex items-center justify-center md:justify-start md:px-3 text-gray-400 hover:bg-gray-100">
                                            <Shield className="w-4 h-4" />
                                            <span className="hidden md:block ml-2 text-xs font-medium">Security</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Area */}
                                <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-hidden relative">

                                    {/* Abstract Charts */}
                                    <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm p-4 w-full h-1/2 flex flex-col">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="space-y-1">
                                                <div className="w-24 h-3 bg-gray-200 rounded-sm" />
                                                <div className="w-16 h-2 bg-gray-100 rounded-sm" />
                                            </div>
                                            <LineChart className="w-4 h-4 text-gray-300" />
                                        </div>
                                        <div className="flex-1 flex items-end gap-2 md:gap-3 px-2">
                                            {[30, 50, 40, 70, 50, 90, 60].map((height, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: "0%" }}
                                                    animate={{ height: `${height}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                    className="flex-1 bg-gradient-to-t from-[var(--color-primary)]/20 to-[var(--color-primary)] rounded-t-sm"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Data Blocks */}
                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                        <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm p-3 h-full flex flex-col justify-between">
                                            <div className="w-6 h-6 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] flex items-center justify-center">
                                                <Sparkles className="w-3 h-3" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="w-10 h-4 bg-gray-200 rounded-sm" />
                                                <div className="w-20 h-2 bg-gray-100 rounded-sm" />
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm p-3 h-full flex flex-col justify-between">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
                                                <LayoutDashboard className="w-3 h-3" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="w-14 h-4 bg-gray-200 rounded-sm" />
                                                <div className="w-16 h-2 bg-gray-100 rounded-sm" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Element 1: Mobile App Preview */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute -right-4 md:-right-8 bottom-10 z-20 w-24 md:w-32 h-48 md:h-64 bg-white rounded-[24px] md:rounded-[32px] shadow-2xl border-4 border-gray-900 flex flex-col overflow-hidden hidden sm:flex"
                        >
                            <div className="w-full h-4 bg-gray-900 rounded-b-xl flex items-center justify-center shrink-0">
                                <div className="w-8 h-1 rounded-full bg-gray-700" />
                            </div>
                            <div className="flex-1 bg-gray-50 p-2 md:p-3 flex flex-col gap-2">
                                <div className="w-full h-1/3 bg-white rounded-lg shadow-sm border border-[var(--color-border)] p-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-500 flex flex-col items-center justify-center mb-1"><Smartphone className="w-3 h-3" /></div>
                                    <div className="w-10 h-1 bg-gray-200 rounded-full" />
                                </div>
                                <div className="flex-1 flex gap-2">
                                    <div className="w-1/2 h-full bg-white rounded-lg border border-[var(--color-border)] shadow-sm" />
                                    <div className="w-1/2 h-full bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20 shadow-sm" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Element 2: Notification Card */}
                        <motion.div
                            animate={{ y: [10, -10, 10] }}
                            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                            className="absolute -left-6 md:-left-12 top-20 z-20 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-xl shadow-xl border border-[var(--color-border)] flex items-start gap-3 w-[200px] md:w-[240px]"
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex flex-col shrink-0 items-center justify-center text-green-600">
                                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs md:text-sm font-bold text-[var(--color-heading)] leading-tight">Deployment Successful</p>
                                <p className="text-[10px] md:text-xs text-[var(--color-body-text)] mt-1">Production build v2.4.1 is live globally.</p>
                            </div>
                        </motion.div>

                        {/* Floating Element 3: AI Assistant Widget */}
                        <motion.div
                            animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute left-1/4 -bottom-6 z-30 bg-gray-900 text-white p-2.5 px-4 rounded-full shadow-lg flex items-center gap-2 border border-gray-700 hidden lg:flex"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <p className="text-xs font-bold font-mono">AI analyzing metrics...</p>
                        </motion.div>

                    </div>
                </div>
            </Container>
        </section>
    );
}
