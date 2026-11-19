"use client";

import * as React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
    Stethoscope,
    TrendingUp,
    Target,
    Users,
    Workflow,
    Cpu,
    Rocket,
    Clock,
    MapPin,
    Calendar,
    CheckCircle2,
    ArrowUpRight,
    ChevronRight
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";

const DIAGNOSTIC_PILLARS = [
    {
        id: "01",
        icon: TrendingUp,
        title: "Sales & Revenue",
        description: "Identify sales bottlenecks, missed pipeline opportunities, and ineffective closing steps."
    },
    {
        id: "02",
        icon: Target,
        title: "Marketing Performance",
        description: "Evaluate customer acquisition channels, conversion efficacy, and return on marketing spend."
    },
    {
        id: "03",
        icon: Users,
        title: "Customer Experience",
        description: "Discover friction points in customer onboarding, buying journeys, and retention."
    },
    {
        id: "04",
        icon: Workflow,
        title: "Operational Efficiency",
        description: "Uncover repetitive manual tasks, workflow drags, and unnecessary operational costs."
    },
    {
        id: "05",
        icon: Cpu,
        title: "Technology & Automation",
        description: "Assess existing software systems and identify high-leverage digital transformation gaps."
    },
    {
        id: "06",
        icon: Rocket,
        title: "Scalability & Growth",
        description: "Spot structural capacity limits and engineer paths for sustainable, high-volume growth."
    }
];

const PROCESS_STEPS = [
    {
        step: "01",
        title: "Book Consultation",
        description: "Reserve your private, appointment-only diagnostic slot at the SS40 office."
    },
    {
        step: "02",
        title: "Deep-Dive Audit",
        description: "We analyze your operations, customer journeys, unit economics, and tech stack."
    },
    {
        step: "03",
        title: "Business Prescription",
        description: "Receive practical recommendations and your personalized Digital Business Health Report."
    },
    {
        step: "04",
        title: "Implement Solutions",
        description: "SS40 NETWORK engineers can build the custom software, AI, or automation required."
    }
];

const DELIVERABLES = [
    "One-to-one private business consultation",
    "Comprehensive Business Health Assessment",
    "Identification of key revenue & operational bottlenecks",
    "Technology and AI automation opportunity analysis",
    "Practical, phased improvement roadmap",
    "Official Digital Business Health Report"
];

const STEP_ORDER_CLASSES = [
    "order-1 lg:order-1",
    "order-2 lg:order-2",
    "order-4 lg:order-3",
    "order-3 lg:order-4"
];

// One-time sequential in-view drawing variants for connecting arrows
const ARROW_VARIANTS: Variants[] = [
    // Arrow 1: Card 01 -> Card 02 (delay: 0.2s)
    {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 0.5, ease: "easeInOut", delay: 0.2 },
                opacity: { duration: 0.05, delay: 0.2 }
            }
        }
    },
    // Arrow 2: Card 02 -> Card 03 (delay: 0.75s)
    {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 0.5, ease: "easeInOut", delay: 0.75 },
                opacity: { duration: 0.05, delay: 0.75 }
            }
        }
    },
    // Arrow 3: Card 03 -> Card 04 (delay: 1.3s)
    {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 0.5, ease: "easeInOut", delay: 1.3 },
                opacity: { duration: 0.05, delay: 1.3 }
            }
        }
    }
];

export function BusinessDoctor() {
    return (
        <SectionWrapper id="business-doctor" className="bg-white relative overflow-hidden border-t border-[var(--color-border)]">
            <Container className="relative z-10 space-y-8 lg:space-y-10">
                {/* 1. Section Header: Centered Eyebrow, Content Row Below */}
                <div className="space-y-4 sm:space-y-5 max-w-5xl mx-auto">
                    {/* Centered Eyebrow Badge (Optimized for clean single-line display on mobile) */}
                    <div className="flex justify-center px-2">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/90 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider sm:tracking-widest text-[#0F766E] border border-[#0F766E]/20 shadow-xs whitespace-nowrap">
                            <Stethoscope className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                            <span className="sm:hidden">Business Health &amp; Tech Consulting</span>
                            <span className="hidden sm:inline">Business Health Assessment &amp; Technology Consulting</span>
                        </div>
                    </div>

                    {/* Content Row: Headline & Description Left, Clean Emblem Right on Desktop, Left on Mobile */}
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 lg:gap-10">
                        <div className="flex-1 text-left">
                            {/* Headline Lockup: Mobile shows emblem on the left of the title */}
                            <div className="flex items-center md:block gap-3.5 sm:gap-4 mb-2 md:mb-0">
                                {/* Mobile-only Emblem on the left */}
                                <div className="shrink-0 md:hidden">
                                    <Image
                                        src="/images/home/business-doctor.png"
                                        alt="Business Doctor"
                                        width={80}
                                        height={80}
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain select-none pointer-events-none drop-shadow-xs"
                                        priority
                                    />
                                </div>

                                <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-bold tracking-tight leading-[1.18] text-[#0F172A] font-serif">
                                    <span>Business Doctor. </span>
                                    <span className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#14B8A6] bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                                        Check your business health.
                                    </span>
                                </h2>
                            </div>

                            <p className="mt-3 sm:mt-3.5 text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl font-normal">
                                Every business faces silent challenges—stagnant sales, inefficient workflows, or underutilized tools. Business Doctor by SS40 NETWORK is an in-person, 1-to-1 diagnosis that pinpoints what is holding you back and prescribes smart technology to scale.
                            </p>
                        </div>

                        {/* Desktop-only Right Emblem */}
                        <div className="hidden md:flex shrink-0 items-center justify-center md:-mt-4 lg:-mt-11">
                            <Image
                                src="/images/home/business-doctor.png"
                                alt="Business Doctor by SS40 NETWORK"
                                width={192}
                                height={192}
                                className="w-36 h-36 lg:w-50 lg:h-50 object-contain select-none pointer-events-none"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Top Tier: What We Diagnose (Left) + Prescription Pass (Right) Flush Alignment */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                    {/* Left Column (7 Cols): What We Diagnose (6 Pillar Grid) */}
                    <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-7 border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="mb-5 pb-3 border-b border-gray-100">
                                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">
                                    Clinical Focus
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] font-serif">
                                    What We Diagnose
                                </h3>
                            </div>

                            {/* Interactive 6-Pillar Grid with "Direct the eye to one thing at a time" focus */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 group/pillars relative">
                                {DIAGNOSTIC_PILLARS.map((pillar) => {
                                    const IconComponent = pillar.icon;
                                    return (
                                        <div
                                            key={pillar.title}
                                            tabIndex={0}
                                            className="group/card relative p-3.5 sm:p-4 rounded-xl bg-[#F8FAF9] border border-gray-100/90 transition-all duration-300 ease-out group-hover/pillars:opacity-35 hover:!opacity-100 hover:scale-[1.03] hover:z-20 hover:bg-white hover:border-[#0F766E]/40 hover:shadow-xl hover:shadow-[#0F766E]/10 focus-visible:!opacity-100 focus-visible:scale-[1.03] focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:outline-hidden cursor-pointer flex flex-col justify-between"
                                        >
                                            <div className="flex items-start gap-3.5">
                                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EDF5F2] border border-[#0F766E]/15 flex items-center justify-center shrink-0 mt-0.5 group-hover/card:bg-[#0F766E] group-hover/card:border-[#0F766E] group-hover/card:shadow-sm transition-all duration-300">
                                                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E] group-hover/card:text-white transition-colors duration-300" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-1.5">
                                                        <h4 className="text-sm font-bold text-[#0F172A] leading-snug group-hover/card:text-[#0F766E] transition-colors duration-300">
                                                            {pillar.title}
                                                        </h4>
                                                        <span className="text-[10px] font-mono font-bold text-gray-400 group-hover/card:text-[#0F766E]/80 transition-colors duration-300">
                                                            {pillar.id}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed group-hover/card:text-[#334155] transition-colors duration-300">
                                                        {pillar.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Subtle reassurance footer on Left Card */}
                        <div className="mt-5 pt-3.5 border-t border-gray-100 text-xs text-[#64748B]">
                            <span>Tailored diagnostic assessment per business model</span>
                        </div>
                    </div>

                    {/* Right Column (5 Cols): The Prescription Booking Card */}
                    <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border-2 border-[#0F766E]/25 shadow-lg shadow-[#0F766E]/5 relative flex flex-col justify-between">
                        <div>
                            {/* Badge row - Dot removed as requested */}
                            <div className="flex items-center justify-between gap-2 mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#EDF5F2] border border-[#0F766E]/20 text-[11px] font-bold text-[#0F766E]">
                                    By Appointment Only
                                </span>
                                <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                                    In-Person
                                </span>
                            </div>

                            {/* Session Header with Emblem */}
                            <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#0F766E]">
                                        Strategic Session
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                                            1-on-1 Consultation
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#0F766E] font-medium pt-0.5">
                                        One-to-one business consultation session
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-xl bg-[#EDF5F2] border border-[#0F766E]/15 p-1.5 shrink-0 flex items-center justify-center">
                                    <Image
                                        src="/images/home/business-doctor.png"
                                        alt="Business Doctor Seal"
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* Session Parameters */}
                            <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-2.5 text-xs text-[#0F172A]">
                                    <Clock className="w-4 h-4 text-[#0F766E] shrink-0" />
                                    <span><strong>Duration:</strong> 45–60 minutes focused session</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-[#0F172A]">
                                    <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
                                    <span><strong>Location:</strong> SS40 NETWORK Office, Tirunelveli</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-[#0F172A]">
                                    <Calendar className="w-4 h-4 text-[#0F766E] shrink-0" />
                                    <span><strong>Format:</strong> Private, 1-on-1 In-Person Consultation</span>
                                </div>
                            </div>

                            {/* Deliverables Checklist */}
                            <div className="space-y-2 mb-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                                    What You Receive:
                                </p>
                                {DELIVERABLES.map((item) => (
                                    <div key={item} className="flex items-start gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                                        <span className="text-xs text-[#475569] leading-snug">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom CTA Block */}
                        <div className="pt-2">
                            <a
                                href="https://bdr.ss40network.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-sm shadow-lg shadow-[#0F766E]/20 hover:shadow-xl hover:shadow-[#0F766E]/30 active:scale-[0.98] transition-all duration-300 group cursor-pointer"
                            >
                                <span>Book Your Business Health Checkup</span>
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>

                            <p className="mt-2.5 text-center text-[11px] text-gray-500 leading-relaxed">
                                Instant slot confirmation • Powered by SS40 NETWORK PRIVATE LIMITED
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Tier: Single-Line "How It Works" + Embedded "Who Is It For?" Card */}
                <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
                    {/* Header */}
                    <div className="pb-3 border-b border-gray-100">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0F766E]">
                            Consultation Flow
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] font-serif">
                            How It Works
                        </h3>
                    </div>

                    {/* Consultation Flow: 2x2 on Mobile, 4-in-a-row on Desktop */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.25 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-7 relative"
                    >
                        {PROCESS_STEPS.map((item, index) => (
                            <div
                                key={item.step}
                                style={{ zIndex: 10 - index }}
                                className={`p-3.5 sm:p-5 rounded-xl bg-[#F8FAF9] border border-gray-100 hover:border-[#0F766E]/25 transition-colors flex flex-col justify-between relative ${STEP_ORDER_CLASSES[index]}`}
                            >
                                <div>
                                    <div className="flex items-center gap-1.5 sm:gap-2.5 mb-1.5 sm:mb-2.5">
                                        <span className="text-[10px] sm:text-xs font-mono font-extrabold text-[#0F766E] bg-[#EDF5F2] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shrink-0 border border-[#0F766E]/15">
                                            {item.step}
                                        </span>
                                        <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight sm:leading-snug">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                {/* CONNECTORS: One-Time In-View Sequential Drawing (No Dim Placeholders) */}
                                {/* 1. Step 01 -> Step 02: Horizontal Right Arrow */}
                                {index === 0 && (
                                    <div className="flex items-center justify-center absolute z-30 pointer-events-none -right-3 sm:-right-6 lg:-right-7 top-1/2 -translate-y-1/2 w-3 sm:w-6 lg:w-7">
                                        <svg
                                            className="w-full h-3.5 sm:h-4 text-[#0F766E]"
                                            viewBox="0 0 28 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <motion.path
                                                d="M2 8H22M22 8L15 3M22 8L15 13"
                                                stroke="currentColor"
                                                strokeWidth="2.4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                variants={ARROW_VARIANTS[0]}
                                            />
                                        </svg>
                                    </div>
                                )}

                                {/* 2. Step 02 -> Step 03 */}
                                {index === 1 && (
                                    <>
                                        {/* Mobile: Vertical Down Arrow into Step 03 */}
                                        <div className="lg:hidden flex items-center justify-center absolute z-30 pointer-events-none -bottom-3 sm:-bottom-6 left-1/2 -translate-x-1/2 h-3 sm:h-6 w-4">
                                            <svg
                                                className="h-full w-4 text-[#0F766E]"
                                                viewBox="0 0 16 28"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <motion.path
                                                    d="M8 2V22M8 22L3 15M8 22L13 15"
                                                    stroke="currentColor"
                                                    strokeWidth="2.4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    variants={ARROW_VARIANTS[1]}
                                                />
                                            </svg>
                                        </div>

                                        {/* Desktop: Horizontal Right Arrow into Step 03 */}
                                        <div className="hidden lg:flex items-center justify-center absolute z-30 pointer-events-none -right-7 top-1/2 -translate-y-1/2 w-7">
                                            <svg
                                                className="w-full h-4 text-[#0F766E]"
                                                viewBox="0 0 28 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <motion.path
                                                    d="M2 8H22M22 8L15 3M22 8L15 13"
                                                    stroke="currentColor"
                                                    strokeWidth="2.4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    variants={ARROW_VARIANTS[1]}
                                                />
                                            </svg>
                                        </div>
                                    </>
                                )}

                                {/* 3. Step 03 -> Step 04 */}
                                {index === 2 && (
                                    <>
                                        {/* Mobile: Horizontal Left Arrow into Step 04 */}
                                        <div className="lg:hidden flex items-center justify-center absolute z-30 pointer-events-none -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-3 sm:w-6">
                                            <svg
                                                className="w-full h-3.5 sm:h-4 text-[#0F766E]"
                                                viewBox="0 0 28 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <motion.path
                                                    d="M26 8H6M6 8L13 3M6 8L13 13"
                                                    stroke="currentColor"
                                                    strokeWidth="2.4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    variants={ARROW_VARIANTS[2]}
                                                />
                                            </svg>
                                        </div>

                                        {/* Desktop: Horizontal Right Arrow into Step 04 */}
                                        <div className="hidden lg:flex items-center justify-center absolute z-30 pointer-events-none -right-7 top-1/2 -translate-y-1/2 w-7">
                                            <svg
                                                className="w-full h-4 text-[#0F766E]"
                                                viewBox="0 0 28 16"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <motion.path
                                                    d="M2 8H22M22 8L15 3M22 8L15 13"
                                                    stroke="currentColor"
                                                    strokeWidth="2.4"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    variants={ARROW_VARIANTS[2]}
                                                />
                                            </svg>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </motion.div>

                    {/* Integrated "Who Is It For?" Bar inside this card */}
                    <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3">
                        <span className="px-2.5 py-1 rounded-md bg-[#EDF5F2] text-[#0F766E] font-bold text-[11px] uppercase tracking-wider shrink-0 border border-[#0F766E]/15">
                            Who Is It For?
                        </span>
                        <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                            Designed for entrepreneurs, startups, small &amp; medium business owners, retailers, and service providers looking to improve operations and unlock growth.
                        </p>
                    </div>
                </div>
            </Container>
        </SectionWrapper>
    );
}
