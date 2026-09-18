import * as React from "react";
import {
    Calendar,
    Building2,
    Landmark,
    Globe2,
    Eye,
    Target,
    Heart,
    ShieldCheck,
    CheckCircle2,
    Lock,
    Sparkles,
    ArrowUpRight,
    MapPin,
    Cpu,
    Zap,
    Scale
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

export function About() {
    return (
        <SectionWrapper id="about" className="bg-[#EBF4F0] relative overflow-hidden">
            {/* Ambient Background Decorative Grid Elements */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-30">
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(rgba(15,118,110,0.15) 1px, transparent 1px)`,
                        backgroundSize: '28px 28px'
                    }}
                />
            </div>

            <Container className="relative z-10 space-y-10 lg:space-y-12">
                
                {/* 1. Refined Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[rgba(15,118,110,0.12)]">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary-hover)] text-xs font-bold uppercase tracking-wider mb-3">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>About SS40 NETWORK</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-heading)] tracking-tight leading-tight">
                            Engineered in India. <br />
                            <span className="text-[var(--color-primary-hover)]">Built for Global Enterprise Impact.</span>
                        </h2>
                    </div>
                    <p className="text-sm sm:text-base text-[var(--color-body-text)] max-w-md leading-relaxed font-normal">
                        Founded in 2023, SS40 NETWORK PRIVATE LIMITED is a multi-disciplinary technology powerhouse delivering enterprise software, innovative SaaS products, and elite career acceleration.
                    </p>
                </div>

                {/* 2. Asymmetric 2x2 Bento Architecture */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Bento Tile 1: Corporate DNA & Provenance (7 Cols / 60% Width) */}
                    <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] shadow-xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                        {/* Subtle Abstract Geo SVG Accent in Background */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[var(--color-primary)]/10 via-[#DFE9D4]/30 to-transparent rounded-bl-full pointer-events-none -z-0" />

                        <div className="relative z-10">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-bold">
                                    <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>MCA Registered Private Limited</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-body-text)] bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                                    <MapPin className="w-3.5 h-3.5 text-[var(--color-primary-hover)]" />
                                    <span>HQ: Tirunelveli, Tamil Nadu</span>
                                </div>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-heading)] mb-3">
                                High-velocity engineering with zero compromises on stability.
                            </h3>
                            <p className="text-sm text-[var(--color-body-text)] leading-relaxed mb-6 font-normal">
                                We combine the speed and innovation of a modern product studio with the rigorous compliance, governance, and SLA accountability of an enterprise IT consultancy.
                            </p>
                        </div>

                        {/* Provenance Stat Strip */}
                        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 relative z-10">
                            <div className="bg-[#F8FAF9] p-3 rounded-xl border border-gray-100">
                                <p className="text-[11px] font-medium text-gray-500">Established</p>
                                <p className="text-base sm:text-lg font-bold text-[var(--color-heading)]">2023</p>
                            </div>
                            <div className="bg-[#F8FAF9] p-3 rounded-xl border border-gray-100">
                                <p className="text-[11px] font-medium text-gray-500">Compliance</p>
                                <p className="text-base sm:text-lg font-bold text-[var(--color-heading)]">100% MCA</p>
                            </div>
                            <div className="bg-[#F8FAF9] p-3 rounded-xl border border-gray-100">
                                <p className="text-[11px] font-medium text-gray-500">Footprint</p>
                                <p className="text-base sm:text-lg font-bold text-[var(--color-heading)]">Pan-India</p>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 2: Dual Compass - Vision & Mission (5 Cols / 40% Width) */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[var(--color-primary)]/10 rounded-full blur-2xl" />

                        <div className="space-y-6 relative z-10">
                            {/* Vision Block */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-teal-400/30 transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider">Our Vision</h4>
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                                    To become the most reliable, transformative digital solutions and tech talent engine in South India and beyond.
                                </p>
                            </div>

                            {/* Mission Block */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-400/30 transition-colors">
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-yellow-400/20 text-yellow-300 flex items-center justify-center">
                                        <Target className="w-4 h-4" />
                                    </div>
                                    <h4 className="text-sm font-bold text-yellow-300 uppercase tracking-wider">Our Mission</h4>
                                </div>
                                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                                    Ship production-grade systems, solve complex institutional pain-points, and empower the next generation of engineers with real skills.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 mt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 relative z-10">
                            <span>Excellence in Execution</span>
                            <span className="text-teal-400 font-semibold">SS40 Standard</span>
                        </div>
                    </div>

                    {/* Bento Tile 3: Cultural Core & Values (5 Cols / 40% Width) */}
                    <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] shadow-xs flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary-hover)] uppercase tracking-wider mb-2">
                                <Heart className="w-4 h-4" />
                                <span>Core Values</span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-heading)] mb-2">
                                How We Think & Deliver
                            </h3>
                            <p className="text-xs sm:text-sm text-[var(--color-body-text)] mb-6 leading-relaxed">
                                Our principles define every line of code written and every client partnership nurtured.
                            </p>

                            {/* Interactive Ethos Tag Cascade */}
                            <div className="space-y-3">
                                <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 flex items-center justify-between hover:bg-teal-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Scale className="w-4 h-4 text-[var(--color-primary-hover)]" />
                                        <div>
                                            <p className="text-xs font-bold text-[var(--color-heading)]">Radical Integrity</p>
                                            <p className="text-[11px] text-[var(--color-body-text)]">Fixed-scope clarity. Never any hidden fees.</p>
                                        </div>
                                    </div>
                                    <span className="text-teal-700 font-mono text-xs font-bold">01</span>
                                </div>

                                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between hover:bg-amber-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-4 h-4 text-amber-700" />
                                        <div>
                                            <p className="text-xs font-bold text-[var(--color-heading)]">Continuous Curiosity</p>
                                            <p className="text-[11px] text-[var(--color-body-text)]">Adopting modern AI and high-efficiency tools.</p>
                                        </div>
                                    </div>
                                    <span className="text-amber-700 font-mono text-xs font-bold">02</span>
                                </div>

                                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between hover:bg-emerald-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                                        <div>
                                            <p className="text-xs font-bold text-[var(--color-heading)]">True Partnership</p>
                                            <p className="text-[11px] text-[var(--color-body-text)]">We build with an owner’s mindset.</p>
                                        </div>
                                    </div>
                                    <span className="text-emerald-700 font-mono text-xs font-bold">03</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 4: Enterprise Trust & SLA Commitments (7 Cols / 60% Width) */}
                    <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] shadow-xs flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Enterprise Trust Matrix</span>
                                </div>
                                <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                                    Standard On All Contracts
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-[var(--color-heading)] mb-6">
                                Three Pillars of Client Certainty
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-[#F8FAF9] border border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-[var(--color-primary-hover)] flex items-center justify-center mb-3">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <h5 className="text-sm font-bold text-[var(--color-heading)] mb-1">Fixed-Scope Delivery</h5>
                                        <p className="text-xs text-[var(--color-body-text)] leading-relaxed">
                                            Explicit milestones and deliverables. You only pay for agreed results.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-[#F8FAF9] border border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <h5 className="text-sm font-bold text-[var(--color-heading)] mb-1">30-Day SLA Support</h5>
                                        <p className="text-xs text-[var(--color-body-text)] leading-relaxed">
                                            Complimentary post-launch warranty with dedicated rapid-response support.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-[#F8FAF9] border border-gray-100 flex flex-col justify-between">
                                    <div>
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <h5 className="text-sm font-bold text-[var(--color-heading)] mb-1">Enterprise Security</h5>
                                        <p className="text-xs text-[var(--color-body-text)] leading-relaxed">
                                            OWASP-compliant code, encrypted environments, and strict data governance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <span>Ready to scale your systems?</span>
                            <a href="/contact" className="font-bold text-[var(--color-primary-hover)] hover:underline inline-flex items-center gap-1">
                                Talk with our Architects <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                </div>

            </Container>
        </SectionWrapper>
    );
}
