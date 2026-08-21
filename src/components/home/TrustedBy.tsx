"use client";

import * as React from "react";
import {
    Building2, Store, Factory, Plane, Landmark,
    Stethoscope, GraduationCap, Code2, Cpu, Globe, Library, Rocket
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { cn } from "@/utils/cn";
import { shuffleArray } from "@/utils/shuffle";
import { LogoMarqueeSkeleton } from "@/components/ui/Skeleton";

const MIXED_ROW_1 = [
    { id: "1", name: "Global Enterprise", icon: Globe },
    { id: "2", name: "Apex Logistics", icon: Plane },
    { id: "3", name: "Tech Institute of Excellence", icon: Library },
    { id: "4", name: "Nova Healthcare", icon: Stethoscope },
    { id: "5", name: "Stellar Fabrication", icon: Factory },
    { id: "6", name: "Pioneer Engineering Academy", icon: GraduationCap },
];

const MIXED_ROW_2 = [
    { id: "7", name: "Vertex Tech", icon: Code2 },
    { id: "8", name: "Global Management College", icon: Building2 },
    { id: "9", name: "Horizon Retail", icon: Store },
    { id: "10", name: "Future Innovators University", icon: Rocket },
    { id: "11", name: "Oasis Financial", icon: Landmark },
    { id: "12", name: "Nexus Systems", icon: Cpu },
];

export function TrustedBy({ data }: { data?: any[] }) {
    const hasAdminLogos = Boolean(data && data.length > 0);

    const [rows, setRows] = React.useState(() => ({
        row1: hasAdminLogos ? data! : MIXED_ROW_1,
        row2: hasAdminLogos ? data! : MIXED_ROW_2,
    }));

    React.useEffect(() => {
        if (hasAdminLogos) {
            setRows({
                row1: shuffleArray(data!),
                row2: shuffleArray(data!),
            });
        } else {
            setRows({
                row1: MIXED_ROW_1,
                row2: MIXED_ROW_2,
            });
        }
    }, [data, hasAdminLogos]);

    if (data && data.length === 0) {
        return (
            <SectionWrapper id="trusted-by" className="bg-[#EDF5F2] relative overflow-hidden">
                {/* Soft Ambient Background Enhancements */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div
                        className="absolute inset-0 opacity-[0.02] mix-blend-multiply"
                        style={{ backgroundImage: 'linear-gradient(#6B9F91 1px, transparent 1px), linear-gradient(90deg, #6B9F91 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#6B9F91]/5 blur-[120px] rounded-full" />
                </div>

                <Container className="relative z-10">
                    <div className="text-center mb-12 lg:mb-20">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-widest mb-4">
                            OUR PARTNERS & CLIENTS
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-4">
                            Trusted by Businesses, Institutions & Partners
                        </h2>
                        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                            Organizations that trust SS40 NETWORK across digital solutions, products, and industry-focused academics.
                        </p>
                    </div>
                    <LogoMarqueeSkeleton count={6} title="" />
                </Container>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper id="trusted-by" className="bg-[#EDF5F2] relative overflow-hidden">
            {/* Soft Ambient Background Enhancements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div
                    className="absolute inset-0 opacity-[0.02] mix-blend-multiply"
                    style={{ backgroundImage: 'linear-gradient(#6B9F91 1px, transparent 1px), linear-gradient(90deg, #6B9F91 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#6B9F91]/5 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                <div className="text-center mb-12 lg:mb-20">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-widest mb-4">
                        OUR PARTNERS & CLIENTS
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-4">
                        Trusted by Businesses, Institutions & Partners
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Organizations that trust SS40 NETWORK across digital solutions, products, and industry-focused academics.
                    </p>
                </div>
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
                    will-change: transform;
                    transform: translateZ(0);
                }
                .animate-marquee-right {
                    animation: scroll-right var(--duration, 40s) linear infinite;
                    will-change: transform;
                    transform: translateZ(0);
                }
                @media (hover: hover) and (pointer: fine) {
                    .group:hover .animate-marquee-left,
                    .group:hover .animate-marquee-right {
                        animation-play-state: paused !important;
                    }
                    .marquee-logo-card:hover {
                        transform: translateY(-0.25rem);
                        border-color: #6B9F91;
                        box-shadow: 0 10px 15px -3px rgb(107 159 145 / 0.2), 0 4px 6px -4px rgb(107 159 145 / 0.2);
                    }
                    .group:hover .marquee-logo-icon {
                        transform: scale(1.1);
                    }
                }
                @media (hover: none), (pointer: coarse) {
                    .marquee-touch-paused .animate-marquee-left,
                    .marquee-touch-paused .animate-marquee-right {
                        animation-play-state: paused !important;
                    }
                }
            `}} />

            {/* Marquee Section (Full Bleed) */}
            <div className="relative z-10 w-full flex flex-col gap-6 md:gap-8 overflow-hidden py-4">

                {/* Left/Right Fade Gradients for visual smoothness */}
                <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#EDF5F2] to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#EDF5F2] to-transparent z-20 pointer-events-none" />

                {/* ROW 1: Scroll Left */}
                <MarqueeRow items={rows.row1} direction="left" speed={35} />

                {/* ROW 2: Scroll Right (Visible on all screens) */}
                <MarqueeRow items={rows.row2} direction="right" speed={40} />
            </div>

        </SectionWrapper>
    );
}

interface MarqueeRowProps {
    items: { id: string; name: string; icon?: React.ElementType; logoUrl?: string; showTextOnCard?: boolean }[];
    direction: "left" | "right";
    speed: number;
}

function MarqueeRow({ items, direction, speed }: MarqueeRowProps) {
    // Duplicate exactly to fit -50% perfectly.
    const expandedItems = items.length < 5 ? [...items, ...items, ...items, ...items] : items;
    const half = [...expandedItems, ...expandedItems, ...expandedItems];
    const duplicatedItems = [...half, ...half];
    const pauseMarquee = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "touch") {
            event.currentTarget.classList.add("marquee-touch-paused");
            event.currentTarget.setPointerCapture(event.pointerId);
        }
    };
    const resumeMarquee = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "touch") {
            event.currentTarget.classList.remove("marquee-touch-paused");
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
            }
        }
    };

    return (
        <div
            className="flex w-max relative group touch-pan-y select-none"
            onPointerDown={pauseMarquee}
            onPointerUp={resumeMarquee}
            onPointerCancel={resumeMarquee}
            onLostPointerCapture={(e) => e.currentTarget.classList.remove("marquee-touch-paused")}
        >
            <div
                className={cn(
                    "flex items-center gap-4 sm:gap-6 px-3 w-max",
                    direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
                )}
                style={{ "--duration": `${speed}s` } as React.CSSProperties}
            >
                {duplicatedItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={`${item.id}-${idx}`}
                            className={`marquee-logo-card bg-white border border-gray-100 rounded-2xl flex items-center shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer overflow-hidden group shrink-0 ${
                                item.showTextOnCard
                                    ? 'p-3 sm:p-4 gap-3 sm:gap-4 w-max h-[64px] sm:h-[72px] md:h-[80px] justify-start'
                                    : 'px-4 py-2 sm:px-5 sm:py-2.5 h-[64px] sm:h-[72px] md:h-[80px] w-auto justify-center'
                            }`}
                            title={item.name}
                        >
                            <div className={`flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                                item.showTextOnCard 
                                    ? 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12' 
                                    : 'h-11 sm:h-12 md:h-14 w-auto min-w-[36px]'
                            }`}>
                                {item.logoUrl ? (
                                    <img 
                                        src={item.logoUrl} 
                                        alt={item.showTextOnCard ? item.name : (item.name || 'Partner Logo')} 
                                        className={`object-contain ${
                                            item.showTextOnCard 
                                                ? 'w-full h-full' 
                                                : 'w-auto h-full max-w-[160px] sm:max-w-[200px] md:max-w-[240px]'
                                        }`} 
                                    />
                                ) : Icon ? (
                                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#6B9F91]" />
                                ) : (
                                    <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#6B9F91]" />
                                )}
                            </div>

                            {item.showTextOnCard && (
                                <span className="font-bold text-gray-800 text-sm sm:text-base whitespace-nowrap text-left pr-2">
                                    {item.name}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
