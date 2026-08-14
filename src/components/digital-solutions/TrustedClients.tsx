"use client";

import * as React from "react";
import { Building2, Globe } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/utils/cn";

export function TrustedClients() {
    const [logos, setLogos] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/organization-logos?pageScope=DIGITAL_SOLUTIONS')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setLogos(data.data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    // Split logos into two rows for the marquee effect, or show empty arrays
    const row1 = logos.slice(0, Math.ceil(logos.length / 2));
    const row2 = Array.from(logos.slice(Math.ceil(logos.length / 2))); // ensure array

    if (!isLoading && logos.length === 0) {
        return null; // hide section entirely if there are no trusted clients configured for this page (fail safe)
    }

    return (
        <SectionWrapper id="trusted-clients" className={cn("bg-[#EDF5F2] relative overflow-hidden transition-opacity duration-500", isLoading ? "opacity-0" : "opacity-100", "!pt-0 md:!pt-0 lg:!pt-0")}>
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

                {/* Left/Right Fade Gradients for visual smoothness */}
                {/* Updated gradient from White to #[#EDF5F2] to match section background */}
                <div className="absolute top-0 bottom-0 left-0 w-24 md:w-32 bg-gradient-to-r from-[#EDF5F2] to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-24 md:w-32 bg-gradient-to-l from-[#EDF5F2] to-transparent z-20 pointer-events-none" />

                {/* ROW 1: Scroll Left */}
                {row1.length > 0 && <MarqueeRow items={row1} direction="left" speed={30} />}

                {/* ROW 2: Scroll Right (Hidden on Mobile as per standard behavior for cleaner layout) */}
                {row2.length > 0 && (
                    <div className="hidden md:block">
                        <MarqueeRow items={row2} direction="right" speed={35} />
                    </div>
                )}
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
    // Generate exactly enough copies so it scrolls seamlessly without breaking or changing velocity.
    // In Products Brands.tsx, 15 items scroll in 30s (2s per item).
    // We create a "half" array that has at least 10-15 items to ensure it covers screens, then duplicate it.
    const getMultipliedItems = () => {
        let copies = [];
        const requiredMinimum = 10;
        const loops = Math.max(3, Math.ceil(requiredMinimum / Math.max(1, items.length)));
        for (let i = 0; i < loops; i++) {
            copies.push(...items);
        }
        return copies;
    };

    const half = getMultipliedItems();
    const duplicatedItems = [...half, ...half]; // Total items for seamless 50% translate loop

    // Calculate a proportional duration to guarantee constant physical scrolling velocity
    // 2 seconds per item is the standard set by the Brands.tsx page
    const itemsInHalf = half.length;
    const computedSpeed = Math.max(itemsInHalf * 2.2, 20); // slightly smoother pace

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
                    "flex items-center gap-6 px-3 w-max",
                    direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
                )}
                style={{ "--duration": `${computedSpeed}s` } as React.CSSProperties}
            >
                {duplicatedItems.map((client, idx) => (
                    <div
                        key={`${client.id}-${idx}`}
                        className={`marquee-logo-card group flex items-center bg-white border border-gray-100 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.08)] shrink-0 transition-all duration-300 cursor-pointer overflow-hidden ${client.showTextOnCard ? 'justify-start p-4 md:p-5 gap-3 md:gap-4' : 'justify-center px-6 py-4 md:px-8 md:py-6 h-[72px] md:h-[88px] w-auto'}`}
                    >
                        <div className={`flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${client.showTextOnCard ? 'h-8 md:h-10 w-auto min-w-[32px] max-w-[120px]' : 'h-10 md:h-12 w-auto'}`}>
                            {client.logoUrl ? (
                                <img src={client.logoUrl} alt={client.showTextOnCard ? client.name : ''} className={`object-contain ${client.showTextOnCard ? 'w-full h-full' : 'w-auto h-full max-w-[160px] md:max-w-[200px]'}`} />
                            ) : (
                                <Building2 className="w-6 h-6 md:w-8 md:h-8 text-[#6B9F91]" />
                            )}
                        </div>
                        {client.showTextOnCard && (
                            <span className="font-bold text-gray-700 md:text-lg tracking-tight pr-2">{client.name}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
