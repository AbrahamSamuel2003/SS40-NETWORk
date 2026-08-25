import * as React from "react";
import Link from "next/link";
import { ArrowRight, Code2, Box, GraduationCap } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

const WINGS = [
    {
        id: "digital",
        title: "SS40 Digital Solutions",
        description: "Modern digital solutions for growing businesses.",
        icon: <Code2 className="w-6 h-6" />,
        link: "/digital-solutions",
        cta: "Explore Digital Solutions",
        chips: ["Web Apps", "Mobile Apps", "AI Automation"],
        colorHover: "group-hover:text-blue-600 group-hover:bg-blue-50",
        glowHover: "hover:border-blue-400 hover:shadow-blue-500/20",
    },
    {
        id: "products",
        title: "SS40 Products",
        description: "Scalable software products built for real business needs.",
        icon: <Box className="w-6 h-6" />,
        link: "/products",
        cta: "Explore Products",
        chips: ["ClearInvoice", "SaaS Tools", "Business Software"],
        colorHover: "group-hover:text-purple-600 group-hover:bg-purple-50",
        glowHover: "hover:border-purple-400 hover:shadow-purple-500/20",
    },
    {
        id: "academics",
        title: "SS40 Academics",
        description: "Practical learning programs designed for future professionals.",
        icon: <GraduationCap className="w-6 h-6" />,
        link: "/academics",
        cta: "Explore Academics",
        chips: ["Training", "Workshops", "Career Growth"],
        colorHover: "group-hover:text-[var(--color-primary)] group-hover:bg-[var(--color-primary)]/10",
        glowHover: "hover:border-[var(--color-primary)] hover:shadow-[var(--color-primary)]/20",
    },
];

export function BusinessWings() {
    return (
        <SectionWrapper id="business-wings" className="bg-white relative overflow-hidden">

            {/* Subtle Grid Background */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />

            <Container className="relative z-10 space-y-12 lg:space-y-16">

                {/* Section Header */}
                <SectionHeading
                    badge="Our Ecosystem"
                    title="Three Business Wings. One Unified Vision."
                    description="Helping businesses innovate, build products, and empower people through one connected ecosystem."
                />

                <div className="relative flex flex-col items-center">

                    {/* SVG Connectors (Desktop Only) */}
                    <div className="absolute top-[200px] w-full h-[100px] hidden lg:block pointer-events-none z-0">
                        <svg width="100%" height="100%" viewBox="0 0 1200 100" fill="none" preserveAspectRatio="none">
                            <path
                                d="M 600,0 C 600,60 200,40 200,100"
                                stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-[var(--color-primary)] opacity-30"
                            />
                            <path
                                d="M 600,0 L 600,100"
                                stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-[var(--color-primary)] opacity-30"
                            />
                            <path
                                d="M 600,0 C 600,60 1000,40 1000,100"
                                stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-[var(--color-primary)] opacity-30"
                            />
                        </svg>
                    </div>

                    {/* Central Hub: Modern Corporate Headquarters Visual */}
                    <div
                        className="relative z-20 flex flex-col items-center justify-center mb-8 lg:mb-[80px] w-full max-w-[290px] mx-auto h-[190px]"
                    >
                        {/* Ambient Glow */}
                        <div
                            className="animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] bg-[var(--color-primary)]/10 blur-[50px] rounded-full z-0 pointer-events-none"
                        />

                        {/* HQ Architecture Wrapper */}
                        <div className="relative z-10 w-full h-full flex items-end justify-center perspective-[1000px]">

                            {/* Background Tall Building (Left) */}
                            <div
                                className="animate-float-delayed-1 absolute left-[15%] bottom-[8px] w-[22%] h-[120px] bg-gradient-to-t from-gray-50 to-white/95 rounded-tl-[1rem] rounded-tr-sm shadow-lg border border-white/80 backdrop-blur-sm z-10 overflow-hidden flex flex-col p-1.5 gap-1"
                            >
                                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white to-transparent" />
                                {[...Array(3)].map((_, i) => (
                                    <div key={`l-row-${i}`} className="flex-1 flex gap-1 z-10">
                                        {[...Array(3)].map((_, j) => (
                                            <div key={`l-col-${j}`} className="flex-1 bg-[var(--color-primary)]/5 rounded-[2px] border border-[var(--color-primary)]/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/90 to-transparent" />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Background Tall Building (Right) */}
                            <div
                                className="animate-float-delayed-2 absolute right-[15%] bottom-[8px] w-[22%] h-[110px] bg-gradient-to-t from-gray-50 to-white/95 rounded-tr-[1rem] rounded-tl-sm shadow-lg border border-white/80 backdrop-blur-sm z-10 overflow-hidden flex flex-col p-1.5 gap-1"
                            >
                                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white to-transparent" />
                                {[...Array(3)].map((_, i) => (
                                    <div key={`r-row-${i}`} className="flex-1 flex gap-1 z-10">
                                        {[...Array(3)].map((_, j) => (
                                            <div key={`r-col-${j}`} className="flex-1 bg-[var(--color-primary)]/5 rounded-[2px] border border-[var(--color-primary)]/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-white/90 to-transparent" />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Main Center HQ Tower */}
                            <div
                                className="animate-float-slow relative w-[48%] h-[170px] bg-white rounded-t-2xl shadow-2xl border border-gray-100/80 z-20 flex flex-col items-center p-2.5 overflow-hidden"
                            >
                                {/* Frosted Glass Window Grid */}
                                <div className="w-full flex-1 grid grid-cols-3 gap-1.5 p-1 bg-gradient-to-b from-[var(--color-primary)]/[0.04] to-transparent rounded-lg border border-[var(--color-primary)]/10 relative">
                                    {[...Array(9)].map((_, i) => (
                                        <div
                                            key={`w-${i}`}
                                            className="bg-white/80 rounded-[3px] border border-gray-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-center relative overflow-hidden group/win"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--color-primary)]/10 to-transparent opacity-0 group-hover/win:opacity-100 transition-opacity" />
                                        </div>
                                    ))}

                                    {/* Minimal Entrance / Lobby indication */}
                                    <div className="w-full h-5 mt-[3px] flex gap-[3px] relative z-10">
                                        <div className="flex-1 bg-white rounded-[1px] border border-[var(--color-primary)]/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
                                        <div
                                            className="w-[35%] h-full bg-gradient-to-t from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-[1px] relative overflow-hidden"
                                        >
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-white rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(255,255,255,1)]" />
                                        </div>
                                        <div className="flex-1 bg-white rounded-[1px] border border-[var(--color-primary)]/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]" />
                                    </div>

                                    {/* Top glass highlight curve */}
                                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/90 to-transparent z-20 pointer-events-none" />
                                </div>

                                {/* Main Company Signboard */}
                                <div className="absolute bottom-5 w-[110px] bg-white border border-gray-100 shadow-sm rounded-xl py-2 px-1.5 flex flex-col items-center justify-center z-30">
                                    <span className="text-sm font-black tracking-widest text-[#111827] leading-none mb-0.5">
                                        SS40
                                    </span>
                                    <span className="text-[8px] font-bold tracking-[0.1em] text-[var(--color-primary)] uppercase leading-none">
                                        Network
                                    </span>
                                </div>

                                {/* Bottom Accent Line */}
                                <div className="absolute bottom-0 w-full h-1.5 bg-[var(--color-primary)] opacity-90" />
                            </div>

                            {/* Ground Base / Foundation */}
                            <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[240px] h-[20px] bg-gray-50 rounded-[100%] shadow-inner border border-gray-100 z-0" />
                            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[200px] h-[26px] bg-[var(--color-primary)]/5 rounded-[100%] blur-md z-[-1]" />
                        </div>
                    </div>

                    {/* Business Wings Cards */}
                    <div
                        className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 relative z-10"
                    >
                        {WINGS.map((wing) => (
                            <Card
                                key={wing.id}
                                className={cn(
                                    "group relative overflow-hidden flex flex-col bg-white border border-[var(--color-border)] shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out p-6 lg:p-7",
                                    wing.glowHover
                                )}
                            >
                                {/* Accent Top Bar */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent group-hover:via-[var(--color-primary)] transition-all duration-500 opacity-50 group-hover:opacity-100" />

                                <div className="mb-4">
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 bg-gray-50 text-gray-500", wing.colorHover)}>
                                        <div className="group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                            {wing.icon}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl lg:text-2xl font-bold text-[var(--color-heading)] mb-2.5">{wing.title}</h3>
                                <p className="text-[var(--color-body-text)] text-sm mb-5 flex-1 leading-relaxed">{wing.description}</p>

                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {wing.chips.map((chip, idx) => (
                                        <span key={idx} className="px-2.5 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-[11px] font-semibold text-gray-600">
                                            {chip}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto pt-3.5 border-t border-[var(--color-border)]">
                                    <Link href={wing.link} className="inline-flex items-center text-xs font-bold text-[var(--color-heading)] group/btn focus-visible:outline-none rounded-md px-1 py-1">
                                        {wing.cta}
                                        <ArrowRight className="ml-1.5 w-3.5 h-3.5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover/btn:text-[var(--color-primary)] transition-all duration-300" />
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>

                </div>
            </Container>
        </SectionWrapper>
    );
}
