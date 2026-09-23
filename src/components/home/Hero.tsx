import * as React from "react";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";
import { SynchronizedWingHero } from "./SynchronizedWingHero";

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-white py-6 sm:py-8 lg:py-10", HERO_SPACING_CLASSES)}>

            <Container className="relative z-10">
                {/* Center Focused Narrative Header */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    {/* Compact Eyebrow Tag */}
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-widest bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#0F766E] mb-2.5 shadow-2xs font-crimson">
                        &ldquo;A LITTLE BIT MORE&rdquo;
                    </div>

                    {/* Headline strictly in 2 lines across all viewports */}
                    <h1 className="text-[clamp(30px,4.2vw,52px)] font-bold text-[var(--color-heading)] leading-[1.1] tracking-tight mb-2 font-serif font-crimson">
                        One Company. Three Wings.<br />
                        <span className="text-[#0F766E]">
                            Endless Possibilities.
                        </span>
                    </h1>
                </div>

                {/* Main Visual Centerpiece: Synchronized Automated 3-Wing Hero */}
                <SynchronizedWingHero />
            </Container>
        </section>
    );
}
