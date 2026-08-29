"use client";

import * as React from "react";
import Image from "next/image";
import { Building2, Globe } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";
import { shuffleArray } from "@/utils/shuffle";
import { LogoMarqueeSkeleton } from "@/components/ui/Skeleton";

interface TrustedClientsProps {
    initialData?: any[];
}

export function TrustedClients({ initialData }: TrustedClientsProps = {}) {
    const [logos, setLogos] = React.useState<any[]>(initialData || []);
    const [isLoading, setIsLoading] = React.useState(!initialData || initialData.length === 0);

    React.useEffect(() => {
        if (initialData && initialData.length > 0) {
            setLogos(initialData);
            setIsLoading(false);
            return;
        }

        fetch('/api/organization-logos?pageScope=DIGITAL_SOLUTIONS')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setLogos(data.data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [initialData]);

    const row1 = React.useMemo(() => logos, [logos]);
    const row2 = React.useMemo(() => (logos.length > 3 ? [...logos].reverse() : logos), [logos]);

    if (isLoading || logos.length === 0) {
        return (
            <SectionWrapper id="trusted-clients" className="bg-[#D8E8E2] relative overflow-hidden pb-8 md:pb-12 !pt-0 md:!pt-0 lg:!pt-0">
                <Container className="relative z-10">
                    <SectionHeading
                        badge="OUR PARTNERS"
                        title="Trusted by Our Clients"
                        description="We're proud to have partnered with organizations across multiple industries to design, develop, and deliver reliable digital solutions."
                        className="mb-12 lg:mb-20"
                    />
                    <LogoMarqueeSkeleton count={6} title="" />
                </Container>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper id="trusted-clients" className={cn("bg-[#D8E8E2] relative overflow-hidden transition-opacity duration-500 opacity-100 !pt-0 md:!pt-0 lg:!pt-0")}>
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

                {/* Left/Right Fade Gradients for visual smoothness (Mint Teal Dissolve Blend) */}
                <div className="absolute top-0 bottom-0 left-0 w-14 md:w-28 bg-gradient-to-r from-[#EDF5F2] via-[#EDF5F2]/40 to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-14 md:w-28 bg-gradient-to-l from-[#EDF5F2] via-[#EDF5F2]/40 to-transparent z-20 pointer-events-none" />

                {/* ROW 1: Scroll Left */}
                {row1.length > 0 && <MarqueeRow items={row1} direction="left" speed={35} />}

                {/* ROW 2: Scroll Right (Visible on all screens) */}
                {row2.length > 0 && <MarqueeRow items={row2} direction="right" speed={40} />}
            </div>

        </SectionWrapper>
    );
}

interface MarqueeItem {
    id: string;
    name: string;
    logoUrl?: string; // added optional logoUrl
    showTextOnCard?: boolean;
}

interface MarqueeRowProps {
    items: MarqueeItem[];
    direction: "left" | "right";
    speed: number;
}
function MarqueeRow({ items, direction, speed }: MarqueeRowProps) {
    const baseItems = items.length < 4 ? [...items, ...items, ...items] : (items.length < 6 ? [...items, ...items] : items);
    const duplicatedItems = [...baseItems, ...baseItems];

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
                {duplicatedItems.map((client, idx) => (
                    <div
                        key={`${client.id}-${idx}`}
                        className={`marquee-logo-card group flex items-center bg-white border border-gray-100 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.08)] shrink-0 transition-all duration-300 cursor-pointer overflow-hidden ${client.showTextOnCard
                                ? 'p-3 sm:p-4 gap-3 sm:gap-4 w-max h-[64px] sm:h-[72px] md:h-[80px] justify-start'
                                : 'px-4 py-2 sm:px-5 sm:py-2.5 h-[64px] sm:h-[72px] md:h-[80px] w-auto justify-center'
                            }`}
                        title={client.name}
                    >
                        <div className={`flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${client.showTextOnCard
                                ? 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12'
                                : 'h-11 sm:h-12 md:h-14 w-auto min-w-[36px]'
                            }`}>
                            {client.logoUrl ? (
                                <Image
                                    src={client.logoUrl}
                                    alt={client.showTextOnCard ? client.name : (client.name || 'Client Logo')}
                                    width={160}
                                    height={80}
                                    loading="lazy"
                                    decoding="async"
                                    sizes="(max-width: 768px) 120px, 160px"
                                    className={`object-contain ${client.showTextOnCard
                                            ? 'w-full h-full'
                                            : 'w-auto h-full max-w-[160px] sm:max-w-[200px] md:max-w-[240px]'
                                        }`}
                                />
                            ) : (
                                <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#6B9F91]" />
                            )}
                        </div>
                        {client.showTextOnCard && (
                            <span className="font-bold text-gray-700 text-sm sm:text-base tracking-tight pr-2">{client.name}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
