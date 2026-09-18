import * as React from "react";
import { ShieldCheck, Building2, Award, Landmark } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";
import { SynchronizedWingHero } from "./SynchronizedWingHero";

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-gradient-to-b from-[#D2E6DE] via-[#DCEDE6] to-[#CFE4DC] py-6 sm:py-8 lg:py-10", HERO_SPACING_CLASSES)}>
            {/* Ambient Background Architectural Grid & Subtle Lighting */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div 
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `radial-gradient(var(--color-heading) 1px, transparent 1px)`,
                        backgroundSize: '28px 28px'
                    }}
                />
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-white/40 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-[500px] h-[200px] bg-[var(--color-primary)]/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            <Container className="relative z-10">
                {/* Center Focused Narrative Header */}
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    
                    {/* Compliance Pill (Clean Vector Icon, No Emojis, No Initial Green Dot) */}
                    <div className="mb-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-[rgba(15,118,110,0.18)] shadow-2xs">
                        <Landmark className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span className="text-[11px] sm:text-xs font-bold text-[var(--color-heading)] tracking-wide">
                            MCA Registered Enterprise Tech
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--color-primary-hover)]">
                            Govt of India
                        </span>
                    </div>

                    {/* Headline strictly in 2 lines across all viewports */}
                    <h1 className="text-[clamp(30px,4.2vw,52px)] font-extrabold text-[var(--color-heading)] leading-[1.1] tracking-tight mb-2">
                        One Company. Three Wings.<br />
                        <span className="bg-gradient-to-r from-[var(--color-primary-hover)] via-[#0D9488] to-[#0F766E] bg-clip-text text-transparent">
                            Endless Possibilities.
                        </span>
                    </h1>
                </div>

                {/* Main Visual Centerpiece: Synchronized Automated 3-Wing Hero (Left Content + Right Image) */}
                <SynchronizedWingHero />

                {/* Trust Floor (2 clean lines on mobile, 3 columns on desktop) */}
                <div className="w-full mt-6 pt-3.5 border-t border-[rgba(15,118,110,0.15)] flex flex-wrap items-center justify-center sm:justify-between gap-x-6 gap-y-1.5 text-[11px] sm:text-xs font-semibold text-[var(--color-body-text)]">
                    <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                        <span><strong>MCA Registered</strong> • CIN Ready</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span><strong>100% Fixed-Scope</strong> & SLA Warranty</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span><strong>Tirunelveli HQ</strong> • Pan-India Reach</span>
                    </div>
                </div>

            </Container>
        </section>
    );
}
