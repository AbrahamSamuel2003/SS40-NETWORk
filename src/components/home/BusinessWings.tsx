"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

const WINGS = [
    {
        id: "digital",
        name: "Digital Solutions",
        description: "Modern digital solutions for growing businesses.",
        link: "/digital-solutions",
        cta: "Explore Solutions",
        mobileCta: "Explore",
        chips: ["Web Apps", "Mobile Apps", "Cloud and AI"],
        accentColor: "#0F766E",
        glowHover: "hover:border-[#0F766E]/40 hover:shadow-[#0F766E]/15",
    },
    {
        id: "products",
        name: "Products",
        description: "Scalable software products built for real business needs.",
        link: "/products",
        cta: "Explore Products",
        mobileCta: "Explore",
        chips: ["ClearInvoice", "GTC Suite", "AI Email Agent"],
        accentColor: "#0F766E",
        glowHover: "hover:border-[#0F766E]/40 hover:shadow-[#0F766E]/15",
    },
    {
        id: "academics",
        name: "Academics",
        description: "Practical learning programs designed for future professionals.",
        link: "/academics",
        cta: "Explore Academics",
        mobileCta: "Explore",
        chips: ["Live Projects", "Career Launch"],
        accentColor: "#0F766E",
        glowHover: "hover:border-[#0F766E]/40 hover:shadow-[#0F766E]/15",
    },
];

export function BusinessWings() {
    return (
        <SectionWrapper id="business-wings" className="bg-white relative overflow-hidden py-10 sm:py-14 lg:py-16">

            {/* 1. Minimalist Flowing Wave Gradients with Soft Top Border Fade */}
            <div 
                className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
                style={{
                    maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 100%)"
                }}
            >
                {/* Soft Ambient Radial Lights */}
                <div className="absolute top-1/4 -left-20 w-[600px] h-[400px] bg-gradient-to-tr from-[#2DD4BF]/15 via-[#0F766E]/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute top-1/3 -right-20 w-[650px] h-[450px] bg-gradient-to-tl from-[#2DD4BF]/12 via-[#D8E8E2]/25 to-transparent rounded-full blur-3xl" />
                <div className="absolute -bottom-20 left-1/3 w-[500px] h-[350px] bg-gradient-to-b from-[#0F766E]/8 to-transparent rounded-full blur-2xl" />

                {/* Smooth Flowing Wave SVG with Soft Feathered Contour */}
                <svg
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    viewBox="0 0 1440 700"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                >
                    <defs>
                        {/* Soft Feather Filter to eliminate sharp vector edges along the wave crests */}
                        <filter id="wingsWaveFeather" x="-10%" y="-10%" width="120%" height="120%">
                            <feGaussianBlur stdDeviation="3.5" />
                        </filter>
                        <linearGradient id="wingsWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.22" />
                            <stop offset="50%" stopColor="#0F766E" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#D8E8E2" stopOpacity="0.02" />
                        </linearGradient>
                        <linearGradient id="wingsWaveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0F766E" stopOpacity="0.10" />
                            <stop offset="60%" stopColor="#2DD4BF" stopOpacity="0.06" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Smooth Wave Path 1 with Feather Filter */}
                    <path
                        d="M -100 200 C 300 280, 600 120, 1000 240 C 1250 310, 1450 180, 1600 220 L 1600 700 L -100 700 Z"
                        fill="url(#wingsWaveGrad1)"
                        filter="url(#wingsWaveFeather)"
                    />

                    {/* Smooth Wave Path 2 with Feather Filter */}
                    <path
                        d="M -50 350 C 350 450, 750 280, 1150 400 C 1350 460, 1500 350, 1650 380 L 1650 700 L -50 700 Z"
                        fill="url(#wingsWaveGrad2)"
                        filter="url(#wingsWaveFeather)"
                    />
                </svg>

                {/* Soft Top Border Dissolve from Hero */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />
            </div>


            <Container className="relative z-10 space-y-4 sm:space-y-6 lg:space-y-8">

                {/* Section Header */}
                <SectionHeading
                    badge="Our Ecosystem"
                    title="Three Business Wings. One Unified Vision."
                    description="Helping businesses innovate, build products, and empower people through one connected ecosystem."
                />

                <div className="relative flex flex-col items-center w-full">

                    {/* Central Hub: Modern Architectural Corporate Headquarters Visual */}
                    <div
                        className="relative z-20 flex flex-col items-center justify-center w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[430px] mx-auto transform-gpu"
                    >
                        {/* Architectural HQ Campus Visual (Matching Reference Silhouette in SS40 Theme) */}
                        <div className="relative z-10 w-full flex flex-col items-center justify-center">
                            <Image
                                src="/images/home/ss40-hq-cluster.svg"
                                alt="SS40 NETWORK Corporate Headquarters"
                                width={430}
                                height={295}
                                priority
                                className="w-full h-auto max-h-[180px] sm:max-h-[220px] lg:max-h-[250px] object-contain drop-shadow-xs select-none pointer-events-none"
                            />
                            {/* SS40 NETWORK Title Placed Close Underneath Ground Line */}
                            <div className="mt-1 sm:mt-1.5 text-center select-none">
                                <span className="text-xs sm:text-sm font-black tracking-widest text-[#0F172A] uppercase">
                                    SS40 <span className="text-[#0F766E]">NETWORK</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tree Branching SVG Connector Lines (Clean Static Lines from Live) */}
                    <div className="w-full h-[40px] sm:h-[50px] lg:h-[60px] pointer-events-none relative z-10 flex items-center justify-center">
                        <svg className="w-full max-w-[1050px] h-full overflow-visible" viewBox="0 0 1000 60" preserveAspectRatio="none" fill="none">
                            {/* Branch to Left Wing (SS40 Digital Solutions) */}
                            <path
                                d="M 500,0 C 500,35 166,20 166,60"
                                stroke="#0F766E"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                strokeOpacity="0.8"
                                vectorEffect="non-scaling-stroke"
                            />

                            {/* Trunk to Center Lowered Wing (SS40 Products) - Extends past 60 to 95 to meet lowered card */}
                            <path
                                d="M 500,0 L 500,95"
                                stroke="#0F766E"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                strokeOpacity="0.9"
                                vectorEffect="non-scaling-stroke"
                            />

                            {/* Branch to Right Wing (SS40 Academics) */}
                            <path
                                d="M 500,0 C 500,35 834,20 834,60"
                                stroke="#0F766E"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                strokeOpacity="0.8"
                                vectorEffect="non-scaling-stroke"
                            />

                            {/* Top Root Node under HQ */}
                            <circle cx="500" cy="1" r="3.5" fill="#0F766E" />

                            {/* Left Card Top Node */}
                            <circle cx="166" cy="59" r="3.5" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.5" />

                            {/* Center Lowered Products Card Top Node (at y=95 directly on the card top edge) */}
                            <circle cx="500" cy="95" r="4" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.5" />

                            {/* Right Card Top Node */}
                            <circle cx="834" cy="59" r="3.5" fill="#2DD4BF" stroke="#0F766E" strokeWidth="1.5" />
                        </svg>
                    </div>

                    {/* 3 Compact Wing Cards Grid (Products Card Stepped Down) */}
                    <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 relative z-10 items-start">
                        {WINGS.map((wing) => {
                            const isProducts = wing.id === "products";
                            return (
                                <Card
                                    key={wing.id}
                                    className={cn(
                                        "group relative overflow-hidden flex flex-col justify-between bg-white border border-[var(--color-border)] shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out p-2 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl",
                                        isProducts ? "mt-4 sm:mt-5 lg:mt-6 border-[#0F766E]/30 shadow-sm" : "mt-0",
                                        wing.glowHover
                                    )}
                                >
                                    {/* Accent Top Bar */}
                                    <div className={cn(
                                        "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary-hover)] to-transparent transition-opacity",
                                        isProducts ? "opacity-90" : "opacity-40 group-hover:opacity-100"
                                    )} />

                                    <div>
                                        {/* Card Title with SS40 Prefix */}
                                        <h3 className="text-[11px] sm:text-base lg:text-lg font-bold text-[var(--color-heading)] mb-1 sm:mb-2 leading-tight tracking-tight text-center sm:text-left">
                                            <span className="text-[#0F766E] font-black mr-1 sm:inline">SS40</span>
                                            <span className="sm:inline">{wing.name}</span>
                                        </h3>

                                        {/* Description */}
                                        <p className="text-[var(--color-body-text)] text-[9px] sm:text-xs lg:text-sm mb-2 sm:mb-3 lg:mb-4 leading-normal font-normal text-center sm:text-left">
                                            {wing.description}
                                        </p>

                                        {/* Chips (Desktop only) */}
                                        <div className="hidden lg:flex flex-wrap gap-1.5 mb-4">
                                            {wing.chips.map((chip, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-semibold text-gray-600">
                                                    {chip}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA Link */}
                                    <div className="mt-auto pt-1.5 sm:pt-3 border-t border-gray-100 flex items-center justify-center sm:justify-between">
                                        <Link 
                                            href={wing.link} 
                                            aria-label={`${wing.cta} — SS40 ${wing.name}`}
                                            className="inline-flex items-center text-[10px] sm:text-xs font-bold text-[#0F766E] group/btn focus-visible:outline-none rounded-md hover:underline"
                                        >
                                            <span className="hidden sm:inline">{wing.cta}</span>
                                            <span className="sm:hidden">{wing.mobileCta}</span>
                                            <ArrowRight className="ml-0.5 sm:ml-1 w-2.5 sm:w-3 h-2.5 sm:h-3 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
                                        </Link>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                </div>
            </Container>
        </SectionWrapper>
    );
}
