import * as React from "react";
import Image from "next/image";
import { ShieldCheck, Building2, Award } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";
import { SynchronizedWingHero } from "./SynchronizedWingHero";

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-white py-6 sm:py-8 lg:py-10", HERO_SPACING_CLASSES)}>
            {/* Ambient Background Grid & Subtle Lighting matching Digital Solutions */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <Image
                    src="/images/hero/digital-hero-bg.jpg"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center opacity-30 sm:opacity-40 mix-blend-multiply"
                    quality={85}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.85) 65%, #ffffff 100%)' }}
                />
                {/* Subtle Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.035] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                />
            </div>

            <Container className="relative z-10">
                {/* Center Focused Narrative Header */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    {/* Headline strictly in 2 lines across all viewports */}
                    <h1 className="text-[clamp(30px,4.2vw,52px)] font-bold text-[var(--color-heading)] leading-[1.1] tracking-tight mb-2 font-serif">
                        One Company. Three Wings.<br />
                        <span className="text-[#6B9F91]">
                            Endless Possibilities.
                        </span>
                    </h1>
                </div>

                {/* Main Visual Centerpiece: Synchronized Automated 3-Wing Hero */}
                <SynchronizedWingHero />

                {/* Trust Floor */}
                <div className="w-full mt-6 pt-3.5 border-t border-gray-200/80 flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-1.5 text-[11px] sm:text-xs font-semibold text-[var(--color-body-text)]">
                    <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#6B9F91] shrink-0" />
                        <span><strong>MCA Registered</strong> • CIN Ready</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span><strong>100% Fixed-Scope</strong> and SLA Warranty</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span><strong>Tirunelveli HQ</strong> • Pan-India Reach</span>
                    </div>
                </div>

            </Container>
        </section>
    );
}
