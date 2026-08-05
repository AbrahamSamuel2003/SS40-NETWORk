"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Box, GraduationCap, Sparkles, Building2 } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CardMotion } from "@/components/ui/Card";
import { hoverLift, staggerContainer, slideUp } from "@/lib/animations";
import { cn } from "@/utils/cn";

const WINGS = [
    {
        id: "digital",
        title: "Digital Solutions",
        description: "Modern digital solutions for growing businesses.",
        icon: <Code2 className="w-6 h-6" />,
        link: "/digital-solutions",
        cta: "Explore Digital Solutions",
        chips: ["Web Apps", "Mobile Apps", "AI Automation"],
        colorHover: "group-hover:text-blue-600 group-hover:bg-blue-50",
        glowHover: "hover:border-blue-400 hover:shadow-blue-500/20",
    },
    {
        id: "products",
        title: "Products",
        description: "Scalable software products built for real business needs.",
        icon: <Box className="w-6 h-6" />,
        link: "/products",
        cta: "Explore Products",
        chips: ["ClearInvoice", "SaaS Tools", "Business Software"],
        colorHover: "group-hover:text-purple-600 group-hover:bg-purple-50",
        glowHover: "hover:border-purple-400 hover:shadow-purple-500/20",
    },
    {
        id: "academics",
        title: "Academics",
        description: "Practical learning programs designed for future professionals.",
        icon: <GraduationCap className="w-6 h-6" />,
        link: "/academics",
        cta: "Explore Academics",
        chips: ["Training", "Workshops", "Career Growth"],
        colorHover: "group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/10",
        glowHover: "hover:border-[var(--color-primary)] hover:shadow-[var(--color-primary)]/20",
    },
];

export function BusinessWings() {
    return (
        <SectionWrapper id="business-wings" className="bg-white relative overflow-hidden">

            {/* Subtle Grid Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

            <Container className="relative z-10 space-y-12 lg:space-y-16">

                {/* Section Header */}
                <SectionHeading
                    badge="Our Ecosystem"
                    title="Three Business Wings. One Unified Vision."
                    description="Helping businesses innovate, build products, and empower people through one connected ecosystem."
                />

                <div className="relative flex flex-col items-center">

                    {/* SVG Connectors (Desktop Only) */}
                    <div className="absolute top-[200px] w-full h-[100px] hidden lg:block pointer-events-none z-0">
                        <svg width="100%" height="100%" viewBox="0 0 1200 100" fill="none" preserveAspectRatio="none">
                            {/* Left Line */}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.2 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                                d="M 600,0 C 600,60 200,40 200,100"
                                stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-[var(--color-primary)]"
                            />
                            {/* Center Line */}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.2 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                                d="M 600,0 L 600,100"
                                stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-[var(--color-primary)]"
                            />
                            {/* Right Line */}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.2 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
                                d="M 600,0 C 600,60 1000,40 1000,100"
                                stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-[var(--color-primary)]"
                            />
                        </svg>
                    </div>

                    {/* Central Hub: Modern Corporate Headquarters Visual */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-20 flex flex-col items-center justify-center mb-10 lg:mb-[130px] w-full max-w-[320px] mx-auto h-[220px]"
                    >
                        {/* Ambient Glow */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[var(--color-primary)]/10 blur-[60px] rounded-full z-0 pointer-events-none"
                        />

                        {/* HQ Architecture Wrapper */}
                        <div className="relative z-10 w-full h-full flex items-end justify-center perspective-[1000px]">

                            {/* Background Tall Building (Left) */}
                            <motion.div
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                className="absolute left-[15%] bottom-[8px] w-[22%] h-[120px] bg-gradient-to-t from-gray-50 to-white/95 rounded-tl-[1rem] rounded-tr-sm shadow-lg border border-white/80 backdrop-blur-sm z-10 overflow-hidden flex flex-col p-1.5 gap-1"
                            >
                                {/* Minimal vertical window structures */}
                                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white to-transparent" />
                                {[...Array(3)].map((_, i) => (
                                    <div key={`l-row-${i}`} className="flex-1 flex gap-1 z-10">
                                        {[...Array(3)].map((_, j) => (
                                            <div key={`l-col-${j}`} className="flex-1 bg-[var(--color-primary)]/5 rounded-[2px] border border-[var(--color-primary)]/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/90 to-transparent" />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </motion.div>

                            {/* Background Tall Building (Right) */}
                            <motion.div
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute right-[15%] bottom-[8px] w-[26%] h-[140px] bg-gradient-to-tl from-gray-100 to-white/90 rounded-tr-[1.25rem] rounded-tl-sm shadow-lg border border-white/80 backdrop-blur-sm z-10 flex flex-col p-1.5 gap-1.5 overflow-hidden"
                            >
                                <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-white to-transparent z-0" />
                                {/* Horizontal Ribbon Windows */}
                                {[...Array(6)].map((_, i) => (
                                    <div key={`hline-${i}`} className="w-full flex-1 bg-[var(--color-primary)]/5 rounded-[2px] border border-[var(--color-primary)]/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden z-10">
                                        <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-b from-white/90 to-transparent" />
                                    </div>
                                ))}
                            </motion.div>

                            {/* Main Center Building */}
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-20 w-[140px] h-[180px] bg-white rounded-t-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col items-center justify-start pt-5 overflow-hidden"
                            >
                                {/* Inner Glass Pillar / Grid Facade */}
                                <div className="w-[104px] h-[110px] bg-gradient-to-b from-[#F2F7F5] to-white rounded-t-xl border-t-2 border-x border-[var(--color-primary)]/20 relative overflow-hidden flex flex-col p-1.5 shadow-inner">

                                    {/* Sub-structure: premium window grid */}
                                    <div className="w-full flex-1 grid grid-cols-4 gap-[3px] relative z-10">
                                        {[...Array(16)].map((_, i) => {
                                            const isGlowing = i === 5 || i === 10 || i === 14;
                                            return (
                                                <motion.div
                                                    key={`m-grid-${i}`}
                                                    animate={{
                                                        opacity: isGlowing ? [0.8, 1, 0.8] : 1,
                                                        backgroundColor: isGlowing
                                                            ? ["rgba(107, 159, 145, 0.15)", "rgba(107, 159, 145, 0.3)", "rgba(107, 159, 145, 0.15)"]
                                                            : "rgba(107, 159, 145, 0.05)"
                                                    }}
                                                    transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                                                    className="w-full h-full rounded-[1px] border border-[var(--color-primary)]/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] overflow-hidden relative"
                                                >
                                                    {/* Soft glass reflection on each panel */}
                                                    <div className="absolute top-0 right-0 w-full h-[70%] bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
                                                </motion.div>
                                            )
                                        })}
                                    </div>

                                    {/* Minimal Entrance / Lobby indication */}
                                    <div className="w-full h-5 mt-[3px] flex gap-[3px] relative z-10">
                                        <div className="flex-1 bg-white rounded-[1px] border border-[var(--color-primary)]/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
                                        {/* Glowing Lobby entrance */}
                                        <motion.div
                                            animate={{ opacity: [0.8, 1, 0.8] }}
                                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-[35%] h-full bg-gradient-to-t from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-[1px] relative overflow-hidden"
                                        >
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-white rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(255,255,255,1)]" />
                                        </motion.div>
                                        <div className="flex-1 bg-white rounded-[1px] border border-[var(--color-primary)]/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
                                    </div>

                                    {/* Top glass highlight curve */}
                                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/90 to-transparent z-20 pointer-events-none" />

                                    {/* Animated light sweep reflection across the entire glass facade */}
                                    <motion.div
                                        animate={{ x: ["-250%", "350%"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 z-20 pointer-events-none"
                                    />
                                </div>

                                {/* Main Company Signboard */}
                                <div className="absolute bottom-6 w-[124px] bg-white border border-gray-100 shadow-sm rounded-xl py-3 px-2 flex flex-col items-center justify-center z-30">
                                    <span className="text-base font-black tracking-widest text-[#111827] leading-none mb-1">
                                        SS40
                                    </span>
                                    <span className="text-[9px] font-bold tracking-[0.1em] text-[var(--color-primary)] uppercase leading-none">
                                        Network
                                    </span>
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 w-full h-1.5 bg-[var(--color-primary)] opacity-90" />
                            </motion.div>

                            {/* Ground Base / Foundation */}
                            <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[260px] h-[24px] bg-gray-50 rounded-[100%] shadow-inner border border-gray-100 z-0" />
                            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[220px] h-[30px] bg-[var(--color-primary)]/5 rounded-[100%] blur-md z-[-1]" />

                            {/* Floating Particles */}
                            <motion.div animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[20%] left-[8%] w-2 h-2 rounded-full bg-[var(--color-primary)] z-30 blur-[1px]" />
                            <motion.div animate={{ y: [20, -20, 20], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-[30%] right-[8%] w-3 h-3 rounded-full bg-[#FFC900] z-30 blur-[1px]" />
                            <motion.div animate={{ y: [10, -10, 10], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-[40%] left-[25%] w-1.5 h-1.5 rounded-full bg-white z-30 shadow-sm" />
                        </div>
                    </motion.div>

                    {/* Business Wings Cards */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
                    >
                        {WINGS.map((wing) => (
                            <CardMotion
                                key={wing.id}
                                variants={slideUp}
                                className={cn(
                                    "group relative overflow-hidden flex flex-col bg-white border border-[var(--color-border)] shadow-sm transition-all duration-300 ease-out",
                                    wing.glowHover
                                )}
                                {...hoverLift}
                            >
                                {/* Accent Top Bar */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent group-hover:via-[var(--color-primary)] transition-all duration-500 opacity-50 group-hover:opacity-100" />

                                <div className="mb-6">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 bg-gray-50 text-gray-500", wing.colorHover)}>
                                        <div className="group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                            {wing.icon}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-[var(--color-heading)] mb-3">{wing.title}</h3>
                                <p className="text-[var(--color-body-text)] text-base mb-8 flex-1">{wing.description}</p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {wing.chips.map((chip, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                                            {chip}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
                                    <Link href={wing.link} className="inline-flex items-center text-sm font-bold text-[var(--color-heading)] group/btn focus-visible:outline-none rounded-md px-1 py-1">
                                        {wing.cta}
                                        <ArrowRight className="ml-2 w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover/btn:text-[var(--color-primary)] transition-all duration-300" />
                                    </Link>
                                </div>
                            </CardMotion>
                        ))}
                    </motion.div>

                </div>
            </Container>
        </SectionWrapper>
    );
}
