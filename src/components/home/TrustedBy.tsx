"use client";

import * as React from "react";
import Image from "next/image";
import {
    Building2, Store, Factory, Plane, Landmark,
    Stethoscope, GraduationCap, Code2, Cpu, Globe, Library, Rocket
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";
import { shuffleArray } from "@/utils/shuffle";
import { LogoMarqueeSkeleton } from "@/components/ui/Skeleton";

export function TrustedBy({ data }: { data?: any[] }) {
    if (!data || data.length === 0) {
        return (
            <SectionWrapper id="trusted-by" className="bg-[#D8E8E2] lg:bg-white relative overflow-hidden pb-8 md:pb-12">
                <Container className="relative z-10">
                    <SectionHeading
                        badge="Our Partners and Clients"
                        title="Trusted by Businesses, Institutions and Partners"
                        description="Organizations that trust SS40 NETWORK across digital solutions, products, and industry-focused academics."
                        className="mb-12 lg:mb-20"
                    />
                    <LogoMarqueeSkeleton count={6} title="" />
                </Container>
            </SectionWrapper>
        );
    }

    const rows = {
        row1: data,
        row2: data.length > 3 ? [...data].reverse() : data,
    };

    return (
        <SectionWrapper id="trusted-by" className="bg-[#D8E8E2] lg:bg-white relative overflow-hidden">
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
                    badge="Our Partners and Clients"
                    title="Trusted by Businesses, Institutions and Partners"
                    description="Organizations that trust SS40 NETWORK across digital solutions, products, and industry-focused academics."
                    className="mb-12 lg:mb-20"
                />
            </Container>

            {/* Inline styles for seamless infinite CSS Marquee */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                @keyframes scroll-right {
                    0% { transform: translate3d(-50%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }
                .animate-marquee-left {
                    animation: scroll-left var(--duration, 40s) linear infinite;
                    will-change: transform;
                    transform: translate3d(0, 0, 0);
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .animate-marquee-right {
                    animation: scroll-right var(--duration, 40s) linear infinite;
                    will-change: transform;
                    transform: translate3d(0, 0, 0);
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
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
                <div className="absolute top-0 bottom-0 left-0 w-14 md:w-28 bg-gradient-to-r from-[#D8E8E2] lg:from-white via-[#D8E8E2]/40 lg:via-white/40 to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-14 md:w-28 bg-gradient-to-l from-[#D8E8E2] lg:from-white via-[#D8E8E2]/40 lg:via-white/40 to-transparent z-20 pointer-events-none" />

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
    // Dynamic duplication ensuring at least 10 items in track for seamless -50% loop on 4K/Ultrawide displays
    const baseItems = React.useMemo(() => {
        if (!items || items.length === 0) return [];
        let list = [...items];
        while (list.length < 8) {
            list = [...list, ...items];
        }
        return list;
    }, [items]);

    const duplicatedItems = React.useMemo(() => [...baseItems, ...baseItems], [baseItems]);

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
                    "flex items-center gap-4 sm:gap-6 pr-4 sm:pr-6 w-max transform-gpu",
                    direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
                )}
                style={{ "--duration": `${speed}s` } as React.CSSProperties}
            >
                {duplicatedItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={`${item.id}-${idx}`}
                            style={{ contain: 'paint layout' }}
                            className={`marquee-logo-card bg-white border border-gray-100 rounded-2xl flex items-center shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer overflow-hidden group shrink-0 transform-gpu ${item.showTextOnCard
                                    ? 'p-3 sm:p-4 gap-3 sm:gap-4 w-max h-[64px] sm:h-[72px] md:h-[80px] justify-start'
                                    : 'px-4 py-2 sm:px-5 sm:py-2.5 h-[64px] sm:h-[72px] md:h-[80px] w-auto justify-center'
                                }`}
                            title={item.name}
                        >
                            <div className={`flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${item.showTextOnCard
                                    ? 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12'
                                    : 'h-11 sm:h-12 md:h-14 w-auto min-w-[36px]'
                                }`}>
                                {item.logoUrl ? (
                                    <Image
                                        src={item.logoUrl}
                                        alt={item.showTextOnCard ? item.name : (item.name || 'Partner Logo')}
                                        width={160}
                                        height={80}
                                        decoding="async"
                                        sizes="(max-width: 768px) 120px, 160px"
                                        className={`object-contain ${item.showTextOnCard
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
