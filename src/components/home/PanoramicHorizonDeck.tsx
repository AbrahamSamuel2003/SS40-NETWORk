"use client";

import * as React from "react";
import Link from "next/link";
import { 
    Code2, 
    Layers, 
    GraduationCap, 
    ArrowUpRight, 
    ShieldCheck, 
    Sparkles, 
    Activity, 
    Cpu,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/utils/cn";

interface Pillar {
    id: string;
    title: string;
    badge: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    theme: {
        accent: string;
        bg: string;
        border: string;
        glow: string;
        badgeBg: string;
    };
    stats: { label: string; value: string }[];
    highlightTag: string;
}

const PILLARS: Pillar[] = [
    {
        id: "solutions",
        title: "Digital Solutions",
        badge: "Enterprise Engineering",
        description: "Custom cloud systems, web apps & AI automation.",
        icon: <Code2 className="w-5 h-5" />,
        href: "/digital-solutions",
        theme: {
            accent: "text-[var(--color-primary-hover)]",
            bg: "hover:bg-gradient-to-b hover:from-white hover:to-teal-50/30",
            border: "hover:border-[var(--color-primary)]",
            glow: "hover:shadow-[0_20px_40px_-15px_rgba(45,212,191,0.25)]",
            badgeBg: "bg-teal-50 text-teal-800 border-teal-200/60"
        },
        stats: [
            { label: "Cloud SLA", value: "99.99%" },
            { label: "Latency", value: "< 24ms" }
        ],
        highlightTag: "Ultra-Fast Speed"
    },
    {
        id: "products",
        title: "SaaS Products",
        badge: "Proprietary Platforms",
        description: "Scalable business software & automated ERP tools.",
        icon: <Layers className="w-5 h-5" />,
        href: "/products",
        theme: {
            accent: "text-[#0F766E]",
            bg: "hover:bg-gradient-to-b hover:from-white hover:to-slate-50/50",
            border: "hover:border-[#0F766E]",
            glow: "hover:shadow-[0_20px_40px_-15px_rgba(15,118,110,0.25)]",
            badgeBg: "bg-slate-100 text-slate-800 border-slate-200"
        },
        stats: [
            { label: "ClearInvoice", value: "Ready" },
            { label: "Security", value: "AES-256" }
        ],
        highlightTag: "Multi-Tenant Cloud"
    },
    {
        id: "academics",
        title: "Tech Academics",
        badge: "Career Acceleration",
        description: "Industry-grade training & real client capstones.",
        icon: <GraduationCap className="w-5 h-5" />,
        href: "/academics",
        theme: {
            accent: "text-amber-600",
            bg: "hover:bg-gradient-to-b hover:from-white hover:to-amber-50/30",
            border: "hover:border-amber-400",
            glow: "hover:shadow-[0_20px_40px_-15px_rgba(255,201,0,0.25)]",
            badgeBg: "bg-amber-50 text-amber-800 border-amber-200/60"
        },
        stats: [
            { label: "Mentorship", value: "1-on-1" },
            { label: "Code Reviews", value: "Production" }
        ],
        highlightTag: "Real-World Projects"
    }
];

export function PanoramicHorizonDeck() {
    const [hoveredPillar, setHoveredPillar] = React.useState<string | null>("solutions");

    return (
        <div className="w-full relative mt-10 lg:mt-12">
            
            {/* Ambient Connecting Beam */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-gradient-to-r from-[var(--color-primary)]/10 via-[#DFE9D4]/40 to-[var(--color-soft)]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* 3-Pillar Horizon Stage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 relative z-10">
                {PILLARS.map((pillar) => {
                    const isHovered = hoveredPillar === pillar.id;

                    return (
                        <div
                            key={pillar.id}
                            onMouseEnter={() => setHoveredPillar(pillar.id)}
                            className={cn(
                                "group relative rounded-2xl bg-white/90 backdrop-blur-md p-6 border transition-all duration-300 ease-out flex flex-col justify-between shadow-xs",
                                "border-[var(--color-border)]",
                                pillar.theme.bg,
                                pillar.theme.border,
                                pillar.theme.glow,
                                isHovered ? "-translate-y-1.5 shadow-lg" : "hover:-translate-y-1"
                            )}
                        >
                            {/* Top Ambient Glow Pill */}
                            <div className="flex items-center justify-between gap-2 mb-5">
                                <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center transition-colors duration-300 group-hover:bg-white shadow-2xs", pillar.theme.accent)}>
                                    {pillar.icon}
                                </div>
                                <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full border", pillar.theme.badgeBg)}>
                                    {pillar.badge}
                                </span>
                            </div>

                            {/* Core Content */}
                            <div>
                                <h3 className="text-xl font-bold text-[var(--color-heading)] mb-1.5 flex items-center justify-between">
                                    <span>{pillar.title}</span>
                                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-heading)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </h3>
                                <p className="text-sm text-[var(--color-body-text)] leading-relaxed mb-6 font-normal">
                                    {pillar.description}
                                </p>
                            </div>

                            {/* Live Telemetry Mini-Strip */}
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    {pillar.stats.map((s, idx) => (
                                        <div key={idx} className="bg-gray-50/80 group-hover:bg-white p-2 rounded-lg border border-gray-100 transition-colors">
                                            <span className="text-[10px] text-gray-500 font-medium block">{s.label}</span>
                                            <span className="text-xs font-bold text-[var(--color-heading)]">{s.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                                    <span className="flex items-center gap-1 font-medium text-emerald-700">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        {pillar.highlightTag}
                                    </span>
                                    <Link 
                                        href={pillar.href}
                                        className={cn("font-bold hover:underline", pillar.theme.accent)}
                                    >
                                        Explore →
                                    </Link>
                                </div>
                            </div>

                            {/* Accent Glow Top Border on Hover */}
                            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
