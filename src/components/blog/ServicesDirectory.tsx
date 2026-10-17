"use client";

import React from "react";
import Link from "next/link";
import {
    MapPin,
    ArrowRight,
    AppWindow,
    Globe,
    Smartphone,
    Cpu,
    Cloud,
    Workflow,
    Building2,
    CheckCircle2,
    ShieldCheck,
    Briefcase,
    Scaling,
    Handshake,
    MessageSquare,
    Clock
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { SEOServiceItem } from "@/data/seo-services";

interface ServicesDirectoryProps {
    services: SEOServiceItem[];
}

interface DomainSection {
    id: string;
    title: string;
    category: string;
    icon: any;
    description: string;
}

const DOMAIN_SECTIONS: DomainSection[] = [
    {
        id: "enterprise",
        title: "Custom Software",
        category: "Custom Software",
        icon: AppWindow,
        description: "Bespoke business operating platforms, GST billing software, and custom ERP systems engineered for regional enterprises.",
    },
    {
        id: "web",
        title: "Web Applications",
        category: "Web Applications",
        icon: Globe,
        description: "Next.js 16 high-performance corporate websites, e-commerce shopping portals, and complete UI/UX modernization.",
    },
    {
        id: "mobile",
        title: "Mobile Applications",
        category: "Mobile Applications",
        icon: Smartphone,
        description: "Cross-platform Flutter apps, native Android solutions, and premium iOS applications published to app stores.",
    },
    {
        id: "ai",
        title: "AI Solutions",
        category: "AI Solutions",
        icon: Cpu,
        description: "State-of-the-art neural RAG knowledge assistants, autonomous AI agents, and custom generative AI copilots.",
    },
    {
        id: "cloud",
        title: "Cloud Platforms",
        category: "Cloud Platforms",
        icon: Cloud,
        description: "Hardened Linux server management, 24/7 uptime monitoring, AWS DevOps pipelines, and zero-downtime cloud migration.",
    },
    {
        id: "automation",
        title: "Business Automation",
        category: "Business Automation",
        icon: Workflow,
        description: "Official WhatsApp Business API bots, robotic process automation (RPA), and automated customer workflow pipelines.",
    },
];

export function ServicesDirectory({ services }: ServicesDirectoryProps) {
    return (
        <section className="min-h-screen bg-[#FBFDFD] text-[#1F2937] pb-24">
            {/* 1. HERO HEADER (Safe Navbar Clearance) */}
            <header className="relative overflow-hidden bg-gradient-to-b from-[#F0FDF4]/50 via-white to-[#FBFDFD] pt-28 pb-12 lg:pt-36 lg:pb-16 border-b border-gray-100">
                <div className="absolute inset-0 bg-[radial-gradient(#0F766E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

                <Container className="relative z-10 text-center">
                    <div className="max-w-3xl mx-auto flex flex-col items-center">
                        {/* Top Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E] text-xs font-semibold mb-5 shadow-xs">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>SS40 NETWORK • Solutions & Regional Directory</span>
                        </div>

                        {/* H1 Headline with Crisp Gradient (No text-clip mask artifact) */}
                        <h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.18] mb-5 font-serif"
                            style={{ fontFamily: "var(--font-crimson-pro), Georgia, serif" }}
                        >
                            Specialized Technology Services Across{" "}
                            <span className="text-[#0F766E]">
                                Tamil Nadu
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed mb-8">
                            Explore our dedicated software engineering capabilities, localized digital solutions, and cloud automation platforms engineered for Tirunelveli, Coimbatore, Madurai, and beyond.
                        </p>

                        {/* Quick Jump Navigation Pill Bar */}
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            {DOMAIN_SECTIONS.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#0F766E]/10 border border-gray-200/90 hover:border-[#0F766E]/40 text-gray-700 hover:text-[#0F766E] text-xs font-semibold shadow-2xs transition-all"
                                    >
                                        <Icon className="w-3.5 h-3.5 text-[#0F766E]" />
                                        <span>{section.title}</span>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </Container>
            </header>

            {/* 2. GROUPED SERVICE SECTIONS (Alternating background colors matching Digital Solutions page) */}
            <div className="w-full">
                {DOMAIN_SECTIONS.map((section, sIdx) => {
                    const sectionServices = services.filter((s) => s.category === section.category);
                    const SectionIcon = section.icon;
                    const isEven = sIdx % 2 === 0;

                    return (
                        <section
                            key={section.id}
                            id={section.id}
                            className={`scroll-mt-24 py-14 lg:py-20 border-b ${
                                isEven
                                    ? "bg-[#D8E8E2] border-[#c4ded3]/80"
                                    : "bg-white border-gray-100"
                            }`}
                        >
                            <Container>
                                {/* Section Header */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                                    <div className="max-w-2xl">
                                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-1.5">
                                            <SectionIcon className="w-4 h-4" />
                                            <span>Service 0{sIdx + 1}</span>
                                        </div>
                                        <h2
                                            className="text-2xl sm:text-3xl font-bold text-gray-900"
                                            style={{ fontFamily: "var(--font-crimson-pro), Georgia, serif" }}
                                        >
                                            {section.title}
                                        </h2>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {section.description}
                                        </p>
                                    </div>
                                </div>

                                {/* 3 Cards Grid for this Domain */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sectionServices.map((service) => (
                                        <Link
                                            key={service.slug}
                                            href={`/${service.slug}`}
                                            className={`group relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
                                                isEven
                                                    ? "bg-white border border-white/80 shadow-sm hover:shadow-xl hover:shadow-[#0F766E]/10"
                                                    : "bg-[#F9FBFA] hover:bg-white border border-gray-200/80 hover:border-[#0F766E]/40 shadow-2xs hover:shadow-xl hover:shadow-[#0F766E]/5"
                                            }`}
                                        >
                                            <div>
                                                {/* Top Meta Bar */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0FDF4] border border-[#0F766E]/20 text-[#0F766E]">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {service.city}
                                                    </span>
                                                </div>

                                                {/* Card Title */}
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0F766E] transition-colors leading-snug mb-3">
                                                    {service.title}
                                                </h3>

                                                {/* Summary */}
                                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                                                    {service.summary}
                                                </p>

                                                {/* Deliverables Highlights (Top 2) */}
                                                <div className="space-y-1.5 mb-5 pt-3 border-t border-gray-100">
                                                    {service.deliverables.slice(0, 2).map((del, dIdx) => (
                                                        <div key={dIdx} className="flex items-start gap-2 text-xs text-gray-700">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                                                            <span className="truncate">{del.title}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Tech Chips & Action CTA */}
                                            <div>
                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {service.techStack.slice(0, 3).map((tech, tIdx) => (
                                                        <span
                                                            key={tIdx}
                                                            className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200/60 text-[10px] font-semibold text-gray-600"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {service.techStack.length > 3 && (
                                                        <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
                                                            +{service.techStack.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0F766E] group-hover:text-[#115E59]">
                                                    <span>Explore Service Capabilities</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </Container>
                        </section>
                    );
                })}
            </div>

            {/* 3. LIGHT-THEMED HARMONIZED CTA SECTION */}
            <section className="relative overflow-hidden bg-white border-t border-gray-200/80 py-16 lg:py-20 mt-12">
                {/* Ambient Subtle Glows */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                    />
                    <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#0F766E]/5 blur-[120px] rounded-full -translate-x-1/3 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#14B8A6]/5 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3" />
                </div>

                <Container className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Left Column (55%) */}
                        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E] text-xs font-semibold mb-5 shadow-xs">
                                <span>Custom Projects</span>
                            </div>

                            <h2
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.2] tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-crimson-pro), Georgia, serif" }}
                            >
                                Need a Custom Solution{" "}
                                <span className="text-[#0F766E]">Not Listed Here?</span>
                            </h2>

                            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                                Our software engineering team builds custom web applications, AI tools, and business software tailored specifically to your needs.
                            </p>

                            {/* Trust Indicators Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl">
                                <div className="bg-[#F9FBFA] border border-gray-200/70 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                                    <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">Tailored Business Solutions</span>
                                </div>
                                <div className="bg-[#F9FBFA] border border-gray-200/70 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                                    <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">Transparent Agile Sprints</span>
                                </div>
                                <div className="bg-[#F9FBFA] border border-gray-200/70 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                                    <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <Scaling className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">Scalable Cloud & AI Stacks</span>
                                </div>
                                <div className="bg-[#F9FBFA] border border-gray-200/70 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                                    <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <Handshake className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">Long-Term Regional Support</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (45%) - Floating White Card */}
                        <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
                            <div className="w-full max-w-[460px] bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/70 border border-gray-200/80 relative overflow-hidden flex flex-col items-center text-center">
                                {/* Top Accent Bar */}
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F766E] to-[#14B8A6]" />

                                <div className="w-14 h-14 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E] mb-5 shadow-inner">
                                    <MessageSquare className="w-7 h-7" />
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    Request a Proposal
                                </h3>
                                <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-xs">
                                    Discuss technical specs and project timelines directly with our engineering team.
                                </p>

                                <div className="w-full flex flex-col gap-3">
                                    <Button asChild size="lg" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#0F766E]/20">
                                        <Link href="/contact?source=SERVICES_DIRECTORY_CTA">
                                            Get a Free Quote
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>

                                    <a
                                        href="https://wa.me/918300591750?text=Hello%20SS40%20NETWORK!%20I%20would%20like%20to%20discuss%20a%20custom%20software%20requirement."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-semibold text-xs transition-all"
                                    >
                                        <MessageSquare className="w-4 h-4 text-[#25D366]" />
                                        Chat on WhatsApp Support
                                    </a>
                                </div>

                                <div className="mt-5 flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                                    <span>Average response time: &lt; 2 hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </section>
    );
}
