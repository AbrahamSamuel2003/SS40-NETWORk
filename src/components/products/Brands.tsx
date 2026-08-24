"use client";

import * as React from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";
import { shuffleArray } from "@/utils/shuffle";
import { LogoMarqueeSkeleton } from "@/components/ui/Skeleton";

export function Brands() {
    const [logos, setLogos] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/organization-logos?pageScope=PRODUCTS')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setLogos(data.data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const ROW_1 = React.useMemo(() => shuffleArray(logos), [logos]);
    const ROW_2 = React.useMemo(() => shuffleArray(logos), [logos]);
    const showRow2 = ROW_2.length > 0;

    if (isLoading || logos.length === 0) {
        return (
            <SectionWrapper id="brands" className="bg-[#EDF5F2] relative overflow-hidden pb-8 md:pb-12">
                <Container className="relative z-10">
                    <SectionHeading
                        badge="TRUSTED BY BUSINESSES"
                        title="Growing with Organizations Across Industries"
                        description="Businesses choose SS40 NETWORK products to improve efficiency, simplify operations, and support sustainable growth."
                        className="mb-12 lg:mb-20"
                    />
                    <LogoMarqueeSkeleton count={6} title="" />
                </Container>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper id="brands" className="bg-[#EDF5F2] relative overflow-hidden">

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
                    badge="TRUSTED BY BUSINESSES"
                    title="Growing with Organizations Across Industries"
                    description="Businesses choose SS40 NETWORK products to improve efficiency, simplify operations, and support sustainable growth."
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
                {ROW_1.length > 0 && <MarqueeRow items={ROW_1} direction="left" speed={35} />}

                {/* ROW 2: Scroll Right (Visible on all screen sizes) */}
                {showRow2 && <MarqueeRow items={ROW_2} direction="right" speed={40} />}
            </div>

        </SectionWrapper>
    );
}

interface MarqueeRowProps {
    items: any[];
    direction: "left" | "right";
    speed: number;
}

function MarqueeRow({ items, direction, speed }: MarqueeRowProps) {
    // Duplicate exactly to fit -50% perfectly. Note: must have a robust amount of duplicates if the initial array is small
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
                                    <Image 
                                        src={item.logoUrl} 
                                        alt={item.showTextOnCard ? item.name : (item.name || 'Brand Logo')} 
                                        width={160}
                                        height={80}
                                        loading="lazy"
                                        decoding="async"
                                        sizes="(max-width: 768px) 120px, 160px"
                                        className={`object-contain ${
                                            item.showTextOnCard 
                                                ? 'w-full h-full' 
                                                : 'w-auto h-full max-w-[160px] sm:max-w-[200px] md:max-w-[240px]'
                                        }`} 
                                    />
                                ) : (
                                    <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#6B9F91]" />
                                )}
                            </div>

                            {item.showTextOnCard && (
                                <div className="flex flex-col overflow-hidden max-w-[150px] pr-2">
                                    <span className="font-bold text-gray-800 text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis w-full text-left">
                                        {item.name}
                                    </span>
                                    {item.category && (
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider overflow-hidden text-ellipsis whitespace-nowrap">
                                            {item.category}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
