"use client";

import * as React from "react";
import {
    Building2, Store, Factory, Plane, Landmark,
    Stethoscope, GraduationCap, Code2, Cpu, Globe
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";

// Placeholder Companies array exactly as requested.
const ROW_1 = [
    { id: "1", name: "Client Organization", icon: Building2 },
    { id: "2", name: "Global Enterprise", icon: Globe },
    { id: "3", name: "Retail Solutions", icon: Store },
    { id: "4", name: "Healthcare Partners", icon: Stethoscope },
    { id: "5", name: "Tech Innovators", icon: Code2 },
];

const ROW_2 = [
    { id: "6", name: "Logistics Hub", icon: Plane },
    { id: "7", name: "Financial Systems", icon: Landmark },
    { id: "8", name: "Manufacturing Co", icon: Factory },
    { id: "9", name: "Academic Institute", icon: GraduationCap },
    { id: "10", name: "Cloud Networks", icon: Cpu },
];

export function TrustedClients() {
    return (
        <SectionWrapper id="trusted-clients" className="bg-[#EDF5F2] relative overflow-hidden">
            {/* Soft Ambient Background Enhancements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div
                    className="absolute inset-0 opacity-[0.02] mix-blend-multiply"
                    style={{ backgroundImage: 'linear-gradient(#6B9F91 1px, transparent 1px), linear-gradient(90deg, #6B9F91 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#6B9F91]/5 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                <SectionHeading
                    badge="OUR PARTNERS"
                    title="Trusted by Our Clients"
                    description="We're proud to have partnered with organizations across multiple industries to design, develop, and deliver reliable digital solutions."
                    className="mb-12 lg:mb-20"
                />
            </Container>

            {/* Inline styles for seamless infinite CSS Marquee */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-50% - 12px)); }
                }
                @keyframes scroll-right {
                    0% { transform: translateX(calc(-50% - 12px)); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee-left {
                    animation: scroll-left var(--duration, 40s) linear infinite;
                }
                .animate-marquee-right {
                    animation: scroll-right var(--duration, 40s) linear infinite;
                }
                .group:hover .animate-marquee-left,
                .group:hover .animate-marquee-right {
                    animation-play-state: paused !important;
                }
            `}} />

            {/* Marquee Section (Full Bleed) */}
            <div className="relative z-10 w-full flex flex-col gap-6 md:gap-8 overflow-hidden py-4">

                {/* Left/Right Fade Gradients for visual smoothness */}
                {/* Updated gradient from White to #[#EDF5F2] to match section background */}
                <div className="absolute top-0 bottom-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[#EDF5F2] to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-24 md:w-32 bg-gradient-to-l from-[#EDF5F2] to-transparent z-20 pointer-events-none" />

                {/* ROW 1: Scroll Left */}
                <MarqueeRow items={ROW_1} direction="left" speed={30} />

                {/* ROW 2: Scroll Right (Hidden on Mobile as per standard behavior for cleaner layout) */}
                <div className="hidden md:block">
                    <MarqueeRow items={ROW_2} direction="right" speed={35} />
                </div>
            </div>

        </SectionWrapper>
    );
}

interface MarqueeRowProps {
    items: { id: string; name: string; icon: React.ElementType }[];
    direction: "left" | "right";
    speed: number;
}

function MarqueeRow({ items, direction, speed }: MarqueeRowProps) {
    // Duplicate exactly to fit -50% perfectly.
    const half = [...items, ...items, ...items];
    const duplicatedItems = [...half, ...half];

    return (
        <div className="flex w-max relative group">
            <div
                className={cn(
                    "flex items-center gap-6 px-3 w-max",
                    direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
                )}
                style={{ "--duration": `${speed}s` } as React.CSSProperties}
            >
                {duplicatedItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={`${item.id}-${idx}`}
                            className="bg-white border border-gray-100 rounded-2xl p-4 md:p-5 w-[220px] md:w-[260px] h-[80px] md:h-[90px] flex items-center justify-start gap-4 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-[#6B9F91]/20 hover:border-[#6B9F91] transition-all duration-300 cursor-pointer overflow-hidden"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#EDF5F2] text-[#6B9F91] flex items-center justify-center shrink-0 transition-colors">
                                <Icon className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <span className="font-bold text-gray-800 text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis w-full text-left">
                                {item.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
