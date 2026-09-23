import * as React from "react";
import {
    Building2,
    Landmark,
    Eye,
    Target,
    MapPin
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";

export function About() {
    return (
        <SectionWrapper id="about" className="bg-[#D8E8E2] relative overflow-hidden">
            {/* Ambient Background Decorative Grid */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-30">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(rgba(15,118,110,0.12) 1px, transparent 1px)`,
                        backgroundSize: '28px 28px'
                    }}
                />
            </div>
            {/* Ambient Background Glow matching Success Stories */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none" />

            <Container className="relative z-10 space-y-10 lg:space-y-12">
                
                {/* 1. Refined Section Header */}
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0F766E] border border-[#0F766E]/20 shadow-xs mb-3">
                        About SS40 NETWORK
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold tracking-tight leading-[1.18] text-[#0F172A] font-serif">
                        <span>Built in India. </span>
                        <span className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#2DD4BF] bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                            Thinking Globally.
                        </span>
                    </h2>
                </div>

                {/* 2. Focused 2-Column Architecture */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    {/* Left Column: Corporate DNA & Foundation (6 Cols) */}
                    <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] shadow-xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                        {/* Subtle Abstract Geo SVG Accent in Background */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#EDF5F2] via-[#DFE9D4]/30 to-transparent rounded-bl-full pointer-events-none -z-0" />

                        <div className="relative z-10 space-y-3.5">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EDF5F2] border border-[#6B9F91]/25 text-[#0F766E] text-xs font-bold">
                                    <Landmark className="w-3.5 h-3.5 text-[#0F766E]" />
                                    <span>MCA Registered Private Limited</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-body-text)] bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                                    <span>HQ: Tirunelveli, Tamil Nadu</span>
                                </div>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-heading)] leading-snug font-serif">
                                High-velocity engineering with zero compromises on stability.
                            </h3>

                            <p className="text-sm text-[var(--color-body-text)] leading-relaxed font-normal">
                                Founded in 2023, SS40 NETWORK PRIVATE LIMITED is a multi-disciplinary technology powerhouse delivering enterprise software, innovative SaaS products, and elite career acceleration.
                            </p>
                        </div>

                        {/* Provenance & Operations 6-Card Compact Grid */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-4 mt-4 border-t border-gray-100 relative z-10">
                            <div className="bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100 text-center sm:text-left">
                                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500">Established</p>
                                <p className="text-xs sm:text-sm font-bold text-[var(--color-heading)]">2023</p>
                            </div>
                            <div className="bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100 text-center sm:text-left">
                                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500">Compliance</p>
                                <p className="text-xs sm:text-sm font-bold text-[#0F766E]">100% MCA</p>
                            </div>
                            <div className="bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100 text-center sm:text-left">
                                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500">Reach</p>
                                <p className="text-xs sm:text-sm font-bold text-[var(--color-heading)]">Serving India</p>
                            </div>
                            <div className="bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100 text-center sm:text-left">
                                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500">Delivery</p>
                                <p className="text-xs sm:text-sm font-bold text-[var(--color-heading)]">Fixed-Scope</p>
                            </div>
                            <div className="bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100 text-center sm:text-left">
                                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500">Support</p>
                                <p className="text-xs sm:text-sm font-bold text-[#0F766E]">30-Day Warranty</p>
                            </div>
                            <div className="bg-[#F8FAF9] p-2.5 rounded-xl border border-gray-100 text-center sm:text-left">
                                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500">Security</p>
                                <p className="text-xs sm:text-sm font-bold text-[var(--color-heading)]">100% Secure</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dual Compass - Vision & Mission (6 Cols) */}
                    <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#EDF5F2] via-transparent to-transparent rounded-bl-full pointer-events-none" />

                        <div className="space-y-4 relative z-10">
                            {/* Vision Block (Soft Brand Mint/Sage) */}
                            <div className="p-4 sm:p-5 rounded-xl bg-[#EDF5F2]/80 border border-[#0F766E]/20 hover:bg-[#EDF5F2] transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-white text-[#0F766E] flex items-center justify-center shadow-2xs">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">Our Vision</h4>
                                </div>
                                <p className="text-xs sm:text-sm text-[var(--color-body-text)] leading-relaxed font-normal">
                                    To become the most reliable, transformative digital solutions and tech talent engine in South India and beyond.
                                </p>
                            </div>

                            {/* Mission Block (Same Soft Brand Mint/Sage Design as Our Vision) */}
                            <div className="p-4 sm:p-5 rounded-xl bg-[#EDF5F2]/80 border border-[#0F766E]/20 hover:bg-[#EDF5F2] transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-white text-[#0F766E] flex items-center justify-center shadow-2xs">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">Our Mission</h4>
                                </div>
                                <p className="text-xs sm:text-sm text-[var(--color-body-text)] leading-relaxed font-normal">
                                    Ship production-grade systems, solve complex institutional pain-points, and empower the next generation of engineers with real skills.
                                </p>
                            </div>
                        </div>

                        {/* Sub-Footer Strip strictly matching brand tones */}
                        <div className="pt-4 mt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 relative z-10">
                            <span>Excellence in Execution</span>
                            <span className="text-[#0F766E] font-bold">SS40 Standard</span>
                        </div>
                    </div>

                </div>

            </Container>
        </SectionWrapper>
    );
}
