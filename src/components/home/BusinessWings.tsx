import * as React from "react";
import Link from "next/link";
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

            {/* Subtle Grid Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

            <Container className="relative z-10 space-y-4 sm:space-y-6 lg:space-y-8">

                {/* Section Header */}
                <SectionHeading
                    badge="Our Ecosystem"
                    title="Three Business Wings. One Unified Vision."
                    description="Helping businesses innovate, build products, and empower people through one connected ecosystem."
                />

                <div className="relative flex flex-col items-center w-full">

                    {/* Central Hub: Modern Light-Themed Architectural Corporate Headquarters Visual */}
                    <div
                        className="relative z-20 flex flex-col items-center justify-center w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px] mx-auto h-[135px] sm:h-[165px] lg:h-[195px] transform-gpu"
                        style={{ contain: 'paint' }}
                    >
                        {/* Soft Mint Ambient Glow */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] sm:w-[240px] lg:w-[280px] h-[180px] sm:h-[240px] lg:h-[280px] bg-radial from-[#0F766E]/10 via-[#D8E8E2]/30 to-transparent rounded-full z-0 pointer-events-none"
                        />

                        {/* Architectural HQ Campus Visual (Light Company Theme) */}
                        <div className="relative z-10 w-full h-full flex items-end justify-center transform-gpu">

                            {/* West Wing (Left Tiered Glass Pavilion) */}
                            <div
                                className="transform-gpu absolute left-[8%] sm:left-[10%] bottom-[6px] sm:bottom-[8px] w-[26%] h-[85px] sm:h-[108px] lg:h-[128px] bg-gradient-to-t from-[#EDF5F2] via-white to-[#F2F8F5] rounded-tl-xl rounded-tr-xs shadow-md border border-[#0F766E]/20 z-10 overflow-hidden flex flex-col p-1 gap-1"
                            >
                                {/* Top Roof Accent */}
                                <div className="w-full h-1 bg-gradient-to-r from-[#0F766E]/40 to-[#6B9F91]/30 rounded-xs" />
                                {[...Array(4)].map((_, i) => (
                                    <div key={`west-floor-${i}`} className="flex-1 flex gap-1 z-10">
                                        <div className="flex-1 bg-[#D8E8E2]/50 rounded-[2px] border border-[#0F766E]/15 flex items-center justify-center">
                                            <div className="w-full h-[1px] bg-white/80" />
                                        </div>
                                        <div className="flex-1 bg-[#D8E8E2]/50 rounded-[2px] border border-[#0F766E]/15 flex items-center justify-center">
                                            <div className="w-full h-[1px] bg-white/80" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* East Wing (Right Tiered Glass Pavilion) */}
                            <div
                                className="transform-gpu absolute right-[8%] sm:right-[10%] bottom-[6px] sm:bottom-[8px] w-[26%] h-[80px] sm:h-[102px] lg:h-[120px] bg-gradient-to-t from-[#EDF5F2] via-white to-[#F2F8F5] rounded-tr-xl rounded-tl-xs shadow-md border border-[#0F766E]/20 z-10 overflow-hidden flex flex-col p-1 gap-1"
                            >
                                {/* Top Roof Accent */}
                                <div className="w-full h-1 bg-gradient-to-r from-[#6B9F91]/30 to-[#0F766E]/40 rounded-xs" />
                                {[...Array(4)].map((_, i) => (
                                    <div key={`east-floor-${i}`} className="flex-1 flex gap-1 z-10">
                                        <div className="flex-1 bg-[#D8E8E2]/50 rounded-[2px] border border-[#0F766E]/15 flex items-center justify-center">
                                            <div className="w-full h-[1px] bg-white/80" />
                                        </div>
                                        <div className="flex-1 bg-[#D8E8E2]/50 rounded-[2px] border border-[#0F766E]/15 flex items-center justify-center">
                                            <div className="w-full h-[1px] bg-white/80" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Center HQ Skyscraper Tower */}
                            <div
                                className="transform-gpu relative w-[52%] h-[125px] sm:h-[155px] lg:h-[185px] bg-gradient-to-b from-white via-[#FAFCFB] to-[#EDF5F2] rounded-t-2xl shadow-xl border-2 border-[#0F766E]/30 z-20 flex flex-col items-center p-2 sm:p-2.5 overflow-hidden"
                            >
                                {/* Rooftop Architectural Crown & Parapet (No blinking dot) */}
                                <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-[#0F766E]/15 to-transparent flex items-center justify-center">
                                    <div className="w-10 h-0.5 bg-[#0F766E]/40 rounded-full" />
                                </div>

                                {/* Modern Window Grid / Glass Facade Matrix */}
                                <div className="w-full flex-1 grid grid-cols-3 gap-1 sm:gap-1.5 p-1.5 mt-2 bg-[#EDF5F2]/60 rounded-xl border border-[#0F766E]/15 relative">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={`main-win-${i}`}
                                            className="bg-white/90 rounded-[3px] border border-[#0F766E]/20 flex items-center justify-center relative overflow-hidden shadow-2xs"
                                        >
                                            <div className="w-full h-[1px] bg-[#0F766E]/10" />
                                        </div>
                                    ))}

                                    {/* Double-Height Grand Canopy Entrance */}
                                    <div className="col-span-3 h-4 sm:h-5 mt-0.5 bg-gradient-to-t from-[#D8E8E2] to-white rounded-md border border-[#0F766E]/25 flex items-center justify-center px-1">
                                        <div className="w-1/3 h-full bg-[#0F766E]/15 rounded-xs border-x border-[#0F766E]/20" />
                                    </div>
                                </div>

                                {/* Main Company Signboard Canopy */}
                                <div className="absolute bottom-2.5 sm:bottom-3 w-[88px] sm:w-[105px] lg:w-[120px] bg-white border border-[#0F766E]/25 shadow-md rounded-lg py-1 px-1.5 flex flex-col items-center justify-center z-30">
                                    <span className="text-xs sm:text-sm font-black tracking-widest text-[#0F172A] leading-none mb-0.5">
                                        SS40
                                    </span>
                                    <span className="text-[7.5px] sm:text-[8.5px] font-extrabold tracking-[0.12em] text-[#0F766E] uppercase leading-none">
                                        NETWORK
                                    </span>
                                </div>

                                {/* Bottom Teal Power Rail */}
                                <div className="absolute bottom-0 w-full h-1 bg-[#0F766E] opacity-90" />
                            </div>

                            {/* Plaza Podium Base */}
                            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-[220px] sm:w-[260px] lg:w-[290px] h-[16px] bg-gradient-to-r from-[#E2EFEB] via-[#EDF5F2] to-[#E2EFEB] rounded-[100%] shadow-inner border border-[#0F766E]/20 z-0" />
                        </div>
                    </div>

                    {/* Tree Branching SVG Connector Lines */}
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
