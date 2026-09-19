"use client";

import * as React from "react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Link from "next/link";
import {
    Cloud,
    Smartphone,
    Shield,
    Database,
    Brain,
    Globe,
    BarChart3,
    Users,
    DollarSign,
    ArrowRight,
    Cpu,
    Briefcase,
    GraduationCap,
    TrendingUp,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Rocket,
    BookOpen,
    TerminalSquare,
    GitBranch,
    LayoutDashboard
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const SCENES = [
    {
        id: "digital",
        wingNumber: "01",
        wingTag: "WING 01 • SS40 DIGITAL SOLUTIONS",
        title: "Transforming Business Through Intelligent Software",
        mobileTitle: "SS40 Digital Solutions",
        shortTitle: "Digital Solutions",
        description: "We help modern enterprises automate operations, streamline data pipelines, and scale with custom cloud architecture and high-performance digital systems.",
        href: "/digital-solutions",
        ctaText: "Explore Digital Solutions",
        accentColor: "#0F766E",
        capabilities: [
            { icon: Globe, label: "Custom Cloud and Web Apps" },
            { icon: Brain, label: "AI and Process Automation" },
            { icon: Shield, label: "Enterprise Security Architecture" }
        ],
        cards: [
            { title: "Enterprise Software", text: "Custom-built solutions tailored to business operations." },
            { title: "AI and Automation", text: "Improve efficiency with intelligent workflows." }
        ]
    },
    {
        id: "products",
        wingNumber: "02",
        wingTag: "WING 02 • SS40 PRODUCTS",
        title: "Scalable Digital Products Engineered for Growth",
        mobileTitle: "SS40 Products",
        shortTitle: "Products",
        description: "Bespoke SaaS platforms engineered to eliminate manual bottlenecks, optimize billing workflows, and empower businesses with real-time operational intelligence.",
        href: "/products",
        ctaText: "Explore Products",
        accentColor: "#0D9488",
        capabilities: [
            { icon: BarChart3, label: "ClearInvoice Billing Engine" },
            { icon: TrendingUp, label: "GTC Suite Operations" },
            { icon: Brain, label: "AI Email Agent Automation" }
        ],
        cards: [
            { title: "ClearInvoice and GTC Suite", text: "Automated billing, invoicing, and full enterprise workflows." },
            { title: "AI Email Agent", text: "Smart automated customer and client communications." }
        ]
    },
    {
        id: "academics",
        wingNumber: "03",
        wingTag: "WING 03 • SS40 ACADEMICS",
        title: "Bridging Education and Real-World Industry Practice",
        mobileTitle: "SS40 Academics",
        shortTitle: "Academics",
        description: "Empowering students and institutions through immersive hands-on technology training, industry mentorship, sprint projects, and direct placement pipelines.",
        href: "/academics",
        ctaText: "Explore Academics",
        accentColor: "#0F766E",
        capabilities: [
            { icon: Cpu, label: "Live Client Projects" },
            { icon: Briefcase, label: "Career Launch and Placement" }
        ],
        cards: [
            { title: "Hands-on Learning", text: "Build practical skills through real-world projects." },
            { title: "Career Readiness", text: "Develop confidence for interviews and professional growth." }
        ]
    }
];

const GlowingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transform-gpu" style={{ willChange: "transform" }}>
        <div 
            className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full pointer-events-none transform-gpu opacity-35"
            style={{ 
                background: 'radial-gradient(circle, rgba(107,159,145,0.35) 0%, rgba(107,159,145,0) 70%)',
                willChange: "transform"
            }} 
        />
        <div 
            className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none transform-gpu opacity-25"
            style={{ 
                background: 'radial-gradient(circle, rgba(166,203,190,0.35) 0%, rgba(166,203,190,0) 70%)',
                willChange: "transform"
            }} 
        />
    </div>
);

// SCENE 1: DIGITAL SOLUTIONS VISUAL
const VisualDigital = React.memo(({ isActive = true }: { isActive?: boolean }) => {
    const radius = 125;
    const nodes = [
        { label: "Mobile", icon: Smartphone, angle: 0 },
        { label: "Data", icon: Database, angle: 60 },
        { label: "Security", icon: Shield, angle: 120 },
        { label: "Web", icon: Globe, angle: 180 },
        { label: "Dev", icon: Brain, angle: 240 },
        { label: "Cloud", icon: Cloud, angle: 300 },
    ].map((n) => {
        const rad = n.angle * (Math.PI / 180);
        return {
            ...n,
            pos: {
                x: Number((Math.cos(rad) * radius).toFixed(2)),
                y: Number((Math.sin(rad) * radius).toFixed(2))
            }
        };
    });

    return (
        <div className="relative w-full h-full flex items-center justify-center p-6">
            <GlowingOrbs />
            <div className="relative w-[280px] h-[280px] flex items-center justify-center z-10">
                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-140 -140 280 280">
                    {nodes.map((node, i) => (
                        <line
                            key={`line-${i}`}
                            x1="0" y1="0" x2={node.pos.x} y2={node.pos.y}
                            stroke="#6B9F91" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4"
                        />
                    ))}
                </svg>

                {/* Animated Flow Particles */}
                {nodes.map((node, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute left-[50%] top-[50%] w-2.5 h-2.5 -ml-1.25 -mt-1.25 bg-[#6B9F91] rounded-full z-10 pointer-events-none transform-gpu shadow-sm shadow-[#6B9F91]"
                        style={{ willChange: "transform, opacity" }}
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={isActive ? { opacity: [0, 1, 1, 0], x: [0, node.pos.x], y: [0, node.pos.y] } : { opacity: 0 }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                    />
                ))}

                {/* Central Hub */}
                <div className="absolute left-[50%] top-[50%] w-20 h-20 -ml-10 -mt-10 bg-white rounded-full shadow-2xl border-4 border-[#D8E8E2] flex items-center justify-center z-20">
                    <div className="text-[#111827] font-black text-xl tracking-tighter">SS40</div>
                    {isActive && (
                        <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0, 0.25, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 bg-[#6B9F91] rounded-full z-[-1]" />
                    )}
                </div>

                {/* Peripheral Nodes */}
                {nodes.map((node, i) => {
                    const Icon = node.icon;
                    return (
                        <div
                            key={i}
                            style={{
                                transform: `translate(${node.pos.x}px, ${node.pos.y}px)`
                            }}
                            className="absolute left-[50%] top-[50%] w-12 h-12 -ml-6 -mt-6 flex flex-col items-center justify-center group z-30 transition-transform duration-300 hover:scale-110"
                        >
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center group-hover:border-[#6B9F91] group-hover:bg-[#D8E8E2] transition-colors cursor-pointer relative">
                                <Icon className="w-5 h-5 text-[#6B9F91]" />
                                <div className={`absolute whitespace-nowrap px-2.5 py-1 rounded-md bg-[#111827] text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none ${node.pos.y > 0 ? 'top-[calc(100%+6px)]' : 'bottom-[calc(100%+6px)]'}`}>
                                    {node.label}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
VisualDigital.displayName = "VisualDigital";

// MOBILE VISUAL DIGITAL (RESTORED ORIGINAL)
const MobileVisualDigital = React.memo(() => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 400 360" className="w-[400px] h-auto pointer-events-none">
                <path
                    d="M 130 150 V 190 Q 130 200 140 200 H 180 Q 190 200 190 210 V 275 M 190 275 H 280"
                    fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4"
                />
                <g transform="translate(15, 15)">
                    <rect x="0" y="0" width="220" height="135" rx="8" fill="#111827" />
                    <rect x="0" y="0" width="220" height="24" rx="8" fill="#1F2937" />
                    <circle cx="15" cy="12" r="4" fill="#374151" />
                    <circle cx="28" cy="12" r="4" fill="#4B5563" />
                    <circle cx="41" cy="12" r="4" fill="#6B7280" />
                    <text x="110" y="16" fontSize="9" fill="#9CA3AF" fontFamily="monospace" textAnchor="middle">api-controller.ts</text>
                    <rect x="15" y="40" width="30" height="6" rx="3" fill="#A6CBBE" />
                    <rect x="52" y="40" width="60" height="6" rx="3" fill="#D1D5DB" />
                    <rect x="15" y="55" width="80" height="6" rx="3" fill="#D1D5DB" />
                    <rect x="15" y="70" width="45" height="6" rx="3" fill="#6B9F91" />
                    <rect x="68" y="70" width="50" height="6" rx="3" fill="#D1D5DB" />
                </g>
                <g transform="translate(195, 45)">
                    <rect x="0" y="0" width="145" height="75" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                    <circle cx="25" cy="25" r="10" fill="#EDF5F2" />
                    <rect x="42" y="18" width="50" height="6" rx="3" fill="#111827" />
                    <rect x="42" y="28" width="75" height="4" rx="2" fill="#9CA3AF" />
                </g>
                <g transform="translate(15, 170)">
                    <rect x="0" y="0" width="165" height="65" rx="10" fill="#111827" />
                    <text x="15" y="24" fontSize="10" fill="#6B9F91" fontFamily="monospace">&gt;</text>
                    <text x="26" y="24" fontSize="10" fill="#D1D5DB" fontFamily="monospace">npm run deploy</text>
                    <text x="15" y="45" fontSize="9" fill="#9CA3AF" fontFamily="monospace">✓ Built in 420ms</text>
                </g>
                <g transform="translate(130, 245)">
                    <rect x="0" y="0" width="120" height="65" rx="12" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                    <rect x="12" y="14" width="40" height="5" rx="2.5" fill="#111827" />
                    <rect x="12" y="23" width="70" height="4" rx="2" fill="#9CA3AF" />
                    <rect x="12" y="38" width="96" height="14" rx="4" fill="#EDF5F2" />
                    <text x="60" y="48" fontSize="8" fill="#6B9F91" fontWeight="bold" textAnchor="middle">Active 99.9%</text>
                </g>
                <g transform="translate(265, 175)">
                    <rect x="0" y="0" width="120" height="135" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                    <rect x="0" y="0" width="120" height="24" rx="10" fill="#F3F4F6" />
                    <rect x="12" y="38" width="55" height="10" rx="3" fill="#111827" />
                    <rect x="12" y="54" width="96" height="4" rx="2" fill="#E5E7EB" />
                    <rect x="12" y="62" width="76" height="4" rx="2" fill="#E5E7EB" />
                    <rect x="12" y="74" width="45" height="45" rx="6" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
                    <rect x="63" y="74" width="45" height="45" rx="6" fill="#EDF5F2" stroke="#6B9F91" strokeWidth="1" />
                </g>
            </svg>
        </div>
    );
});
MobileVisualDigital.displayName = "MobileVisualDigital";

// SCENE 2: PRODUCTS VISUAL
const VisualProducts = React.memo(({ isActive = true }: { isActive?: boolean }) => {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 perspective-1000">
            <GlowingOrbs />
            <div className="relative w-full max-w-[300px] aspect-square flex items-center justify-center z-10">

                {/* Main Dashboard Panel */}
                <div className="absolute w-full h-56 bg-white rounded-2xl border border-gray-100 shadow-xl flex flex-col p-5 z-10 overflow-hidden">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                        </div>
                        <div className="w-20 h-3 bg-gray-100 rounded-full" />
                    </div>

                    <div className="flex items-end justify-between gap-2.5 h-24 w-full mt-auto">
                        {[40, 70, 50, 90, 60, 100, 85].map((h, i) => (
                            <div
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`w-full rounded-t-md transition-all duration-700 ${i === 5 ? 'bg-[#6B9F91]' : 'bg-[#6B9F91]/20'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Floating Metric 1 (Revenue) */}
                <motion.div
                    animate={isActive ? { y: [-4, 4, -4] } : { y: 0 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute -top-3 -left-3 w-36 bg-white rounded-xl p-3 shadow-xl border border-gray-100 z-20 flex flex-col gap-0.5"
                >
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                        <DollarSign className="w-3.5 h-3.5 text-green-500" /> Total Revenue
                    </div>
                    <div className="text-lg font-black text-[#111827]">
                        $84,392
                    </div>
                </motion.div>

                {/* Floating Metric 2 (Active Users) */}
                <motion.div
                    animate={isActive ? { y: [4, -4, 4] } : { y: 0 }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                    className="absolute -bottom-3 -right-3 w-36 bg-white rounded-xl p-3 shadow-xl border border-gray-100 z-20 flex flex-col gap-0.5"
                >
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                        <Users className="w-3.5 h-3.5 text-blue-500" /> Active Users
                    </div>
                    <div className="flex items-end gap-1.5">
                        <div className="text-lg font-black text-[#111827]">1,204</div>
                        <div className="text-[11px] font-extrabold text-emerald-700 mb-0.5">+12%</div>
                    </div>
                </motion.div>

                {/* Floating Paid Notification */}
                <div className="absolute -bottom-1 -left-2 bg-white rounded-lg p-2 shadow-lg border border-gray-100 z-30 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-[11px] font-bold text-[#111827]">Invoice Paid</span>
                </div>
            </div>
        </div>
    );
});
VisualProducts.displayName = "VisualProducts";

// SCENE 3: ACADEMICS VISUAL (CAREER LAUNCH PAD ECOSYSTEM AS PER WEBSITE)
const VisualAcademics = React.memo(({ isActive = true }: { isActive?: boolean }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-6 bg-transparent">
            <GlowingOrbs />
            <div className="relative w-[300px] h-[300px] flex items-center justify-center z-10">

                {/* Orbit Rings Background */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-150 -150 300 300">
                    <circle cx="0" cy="0" r="105" fill="none" stroke="#6B9F91" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.45" />
                    <circle cx="0" cy="0" r="68" fill="none" stroke="#CBD5E1" strokeWidth="1" opacity="0.5" />
                </svg>

                {/* CENTER: Career Launch Pad Platform */}
                <div className="relative z-20 w-28 h-28 bg-white rounded-full border border-gray-100 shadow-xl flex flex-col items-center justify-center p-3 text-center ring-4 ring-[#D8E8E2]/80">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#111827] to-gray-800 flex items-center justify-center shadow-md border border-gray-700 mb-1">
                        <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[8px] uppercase tracking-widest text-[#0F766E] font-extrabold leading-none mb-0.5">SS40</span>
                    <h4 className="text-[11px] font-black text-[#111827] leading-tight">Career Launch</h4>
                </div>

                {/* SATELLITE 1: Learn (Top-Left) */}
                <div className="absolute top-[8%] left-[8%] z-20">
                    <div className="bg-white rounded-xl px-2.5 py-1.5 shadow-md border border-gray-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#EDF5F2] flex items-center justify-center shrink-0">
                            <BookOpen className="w-3.5 h-3.5 text-[#0F766E]" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-800">Learn</span>
                    </div>
                </div>

                {/* SATELLITE 2: Build with Progress (Bottom-Left) */}
                <div className="absolute bottom-[8%] left-[5%] z-20">
                    <div className="bg-white rounded-xl p-2.5 shadow-md border border-gray-100 flex flex-col gap-1 w-28">
                        <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-[#EDF5F2] flex items-center justify-center">
                                <TerminalSquare className="w-3.5 h-3.5 text-[#0F766E]" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-800">Build</span>
                        </div>
                        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#0F766E]"
                                initial={{ width: "20%" }}
                                animate={isActive ? { width: ["20%", "95%", "20%"] } : { width: "70%" }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* SATELLITE 3: GitHub Projects (Bottom-Right) */}
                <div className="absolute bottom-[10%] right-[8%] z-20">
                    <div className="bg-white rounded-xl px-2.5 py-1.5 shadow-md border border-gray-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                            <GitBranch className="w-3.5 h-3.5 text-gray-700" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-800">GitHub</span>
                    </div>
                </div>

                {/* SATELLITE 4: Portfolio (Top-Right) */}
                <div className="absolute top-[10%] right-[6%] z-20">
                    <div className="bg-white rounded-xl px-2.5 py-1.5 shadow-md border border-[#0F766E]/20 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#0F766E] flex items-center justify-center shrink-0 shadow-xs">
                            <LayoutDashboard className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[11px] font-bold text-[#0F172A]">Portfolio</span>
                    </div>
                </div>
            </div>
        </div>
    );
});
VisualAcademics.displayName = "VisualAcademics";

// DESKTOP 3D COVERFLOW CARD COMPONENT (FRAMER-GRADE INTERACTIVE DRAG & SPRING PHYSICS)
interface DesktopCardProps {
    scene: typeof SCENES[0];
    index: number;
    activeScene: number;
    onSelect: () => void;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

function DesktopDeckCard({ scene, index, activeScene, onSelect, onSwipeLeft, onSwipeRight }: DesktopCardProps) {
    let position = "center";
    if (index === activeScene) {
        position = "center";
    } else if (index === (activeScene - 1 + 3) % 3) {
        position = "left";
    } else {
        position = "right";
    }

    // Tightly stacked positions: secondary cards peek out snugly right beside the main card's border
    const variants = {
        center: {
            x: "0%",
            scale: 1,
            opacity: 1,
            zIndex: 30,
            rotateY: 0,
            pointerEvents: "auto" as const
        },
        left: {
            x: "-22%",
            scale: 0.91,
            opacity: 0.72,
            zIndex: 10,
            rotateY: 3,
            pointerEvents: "auto" as const
        },
        right: {
            x: "22%",
            scale: 0.91,
            opacity: 0.72,
            zIndex: 10,
            rotateY: -3,
            pointerEvents: "auto" as const
        }
    };

    const isCenter = position === "center";

    const VisualComponent = useMemo(() => {
        if (index === 1) return <VisualProducts isActive={isCenter} />;
        if (index === 2) return <VisualAcademics isActive={isCenter} />;
        return <VisualDigital isActive={isCenter} />;
    }, [index, isCenter]);

    // Handle horizontal drag gestures cleanly (like gslv.in Framer cards)
    const handleDragEnd = (_: any, info: PanInfo) => {
        if (!isCenter) return;
        if (info.offset.x < -35 || info.velocity.x < -250) {
            onSwipeRight(); // Drag left -> next card
        } else if (info.offset.x > 35 || info.velocity.x > 250) {
            onSwipeLeft(); // Drag right -> prev card
        }
    };

    return (
        <motion.div
            initial={false}
            animate={position}
            variants={variants}
            drag={isCenter ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={handleDragEnd}
            transition={{
                type: "spring",
                stiffness: 320,
                damping: 32,
                mass: 0.75
            }}
            onClick={() => {
                if (!isCenter) onSelect();
            }}
            className={`absolute top-0 left-0 right-0 bottom-0 m-auto max-w-[780px] w-[58vw] xl:max-w-[820px] h-[440px] xl:h-[465px] bg-white rounded-[26px] grid grid-cols-12 overflow-hidden transform-gpu select-none transition-shadow duration-300 ${
                isCenter
                    ? "border-2 border-[#0F766E]/30 shadow-[0_25px_60px_-15px_rgba(15,118,110,0.22),0_12px_25px_-5px_rgba(0,0,0,0.06)] ring-1 ring-[#0F766E]/20 cursor-grab active:cursor-grabbing"
                    : "border-2 border-gray-200/90 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] cursor-pointer"
            }`}
            style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
        >
            {/* LEFT SIDE: Content (6 cols / 50%) */}
            <div className="col-span-6 p-6 xl:p-8 flex flex-col justify-between h-full bg-white z-10">
                <div>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-md bg-[#F59E0B]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#D97706] border border-[#F59E0B]/20 mb-3.5">
                        <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                        {scene.wingTag}
                    </div>

                    {/* Heading */}
                    <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight leading-snug mb-2.5 font-serif">
                        {scene.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#334155] text-xs xl:text-sm leading-relaxed mb-4 font-normal line-clamp-3">
                        {scene.description}
                    </p>

                    {/* Capabilities Tags */}
                    <div className="flex flex-col gap-2">
                        {scene.capabilities.map((cap, i) => {
                            const CapIcon = cap.icon;
                            return (
                                <div
                                    key={`cap-${i}`}
                                    className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50/80 border border-gray-100 text-xs font-semibold text-[#0F172A]"
                                >
                                    <div className="w-5 h-5 rounded-lg bg-[#EDF5F2] flex items-center justify-center text-[#0F766E] shrink-0">
                                        <CapIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="truncate">{cap.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Primary CTA Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <Link
                        href={scene.href}
                        onClick={(e) => {
                            if (!isCenter) {
                                e.preventDefault();
                                onSelect();
                            }
                        }}
                        className={`inline-flex items-center gap-2 font-bold text-xs xl:text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
                            isCenter
                                ? "bg-[#0F766E] hover:bg-[#115E59] text-white shadow-md shadow-[#0F766E]/20 hover:scale-105 active:scale-95 group"
                                : "bg-gray-100 text-gray-700 pointer-events-none"
                        }`}
                    >
                        <span>{scene.ctaText}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="text-xs font-bold text-gray-400">
                        {scene.wingNumber} / 03
                    </span>
                </div>
            </div>

            {/* RIGHT SIDE: Interactive Visual Simulation (6 cols / 50%) */}
            <div className="col-span-6 bg-gradient-to-br from-[#EDF5F2]/90 via-[#E6F0EB]/70 to-[#D8E8E2]/95 border-l border-gray-100 relative overflow-hidden flex items-center justify-center pointer-events-none">
                {VisualComponent}
            </div>
        </motion.div>
    );
}

// MOBILE CARD (RESTORED ORIGINAL)
const MobileSwipeCard = ({ scene, idx }: { scene: typeof SCENES[0], idx: number }) => {
    const Visual = idx === 0 ? MobileVisualDigital : (idx === 1 ? VisualProducts : VisualAcademics);

    return (
        <div
            className="mobile-swipe-card w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 snap-center relative scroll-ml-6"
            data-mobile-id={idx}
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        >
            {/* Visual Part (Blended seamlessly into the card) */}
            <div className="h-[260px] w-full flex items-center justify-center bg-white overflow-hidden relative shrink-0 z-0">
                <div
                    className="absolute flex items-center justify-center origin-center w-[500px] h-[500px]"
                    style={{ transform: 'scale(0.55) translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
                >
                    <Visual />
                </div>
            </div>

            {/* Content Part */}
            <div className="flex-1 w-full flex flex-col px-6 pb-8 bg-white text-left relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#EDF5F2] text-[#2E544A] flex items-center justify-center font-extrabold text-base mb-4 border border-gray-100 shrink-0">
                    0{idx + 1}
                </div>
                <h3 className="text-2xl font-bold text-[#111827] tracking-tight mb-2 font-serif">{scene.mobileTitle || scene.title}</h3>
                <p className="text-gray-600 text-sm leading-snug mb-5 shrink-0 line-clamp-2">{scene.description}</p>

                <div className="flex flex-col gap-2">
                    {scene.cards.map((card: any, i: number) => (
                        <div key={i} className="flex flex-col gap-1 p-3 bg-gray-50/70 rounded-xl border border-gray-100 shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-[#EDF5F2] flex items-center justify-center shadow-xs border border-gray-100 text-[#2E544A] font-extrabold text-xs">
                                    {i + 1}
                                </div>
                                <span className="text-[#111827] font-bold text-sm tracking-wide">{card.title}</span>
                            </div>
                            <p className="text-gray-500 text-xs leading-relaxed pl-8.5">{card.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export function InteractiveImpactShowcase() {
    const [activeScene, setActiveScene] = useState(0); // 0 = Digital Solutions, 1 = Products, 2 = Academics
    const [activeMobileIdx, setActiveMobileIdx] = useState(0);
    const mobileScrollRef = useRef<HTMLDivElement>(null);
    const lastWheelTimeRef = useRef(0);

    const handleNext = useCallback(() => {
        setActiveScene((prev) => (prev + 1) % SCENES.length);
    }, []);

    const handlePrev = useCallback(() => {
        setActiveScene((prev) => (prev - 1 + SCENES.length) % SCENES.length);
    }, []);

    // ── HORIZONTAL-ONLY SCROLL WITH INERTIA FILTER (PREVENTS MULTI-CARD SKIPPING) ──
    const handleWheel = (e: React.WheelEvent) => {
        // ONLY trigger card switch when horizontal trackpad swipe or shift+wheel occurs
        if (Math.abs(e.deltaX) > 12) {
            const now = Date.now();
            // Strict 600ms momentum cooldown: isolates single swipe gestures from trailing trackpad inertia
            if (now - lastWheelTimeRef.current < 600) return;
            lastWheelTimeRef.current = now;

            if (e.deltaX > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
        // deltaY is untouched so normal page scrolling works unimpeded!
    };

    const scrollToMobileScene = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const container = mobileScrollRef.current;
        const cardWidth = container.clientWidth * 0.82 + 20;
        container.scrollTo({
            left: idx * cardWidth,
            behavior: "smooth"
        });
    };

    useEffect(() => {
        const mobileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveMobileIdx(Number(entry.target.getAttribute("data-mobile-id")));
                }
            });
        }, { root: mobileScrollRef.current, threshold: 0.6 });

        const mobileCards = document.querySelectorAll(".mobile-swipe-card");
        mobileCards.forEach(c => mobileObserver.observe(c));

        return () => {
            mobileObserver.disconnect();
        };
    }, []);

    return (
        <section className="bg-[#D8E8E2] border-t border-b border-gray-200/60 relative overflow-hidden">

            {/* Header Section */}
            <div className="w-full bg-[#D8E8E2] pt-12 md:pt-14 pb-3 md:pb-4 relative z-20">
                <Container className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-[#0F766E] border border-[#0F766E]/20 shadow-xs mb-4"
                    >
                        OUR IMPACT
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-[#0F172A] tracking-[-0.03em] leading-[1.18] mb-3 font-serif"
                    >
                        <span>How We </span>
                        <span className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#2DD4BF] bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                            Create Impact
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="text-[#334155] text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto"
                    >
                        One Vision. Three Wings Driving Real-World Transformation.
                    </motion.p>
                </Container>
            </div>

            {/* ── DESKTOP 3D COVERFLOW (COMPACT TIGHTLY STACKED CARDS) ── */}
            <div
                className="hidden lg:block relative w-full pb-14 pt-2"
                onWheel={handleWheel}
            >
                <div className="w-full flex flex-col justify-center items-center overflow-hidden">

                    {/* 3D Stack Container */}
                    <div className="relative w-full max-w-[1060px] px-6 h-[450px] xl:h-[475px] flex items-center justify-center">
                        {SCENES.map((scene, idx) => (
                            <DesktopDeckCard
                                key={`deck-card-${idx}`}
                                scene={scene}
                                index={idx}
                                activeScene={activeScene}
                                onSelect={() => setActiveScene(idx)}
                                onSwipeLeft={handlePrev}
                                onSwipeRight={handleNext}
                            />
                        ))}

                        {/* Left / Right Quick Chevron Controls */}
                        <button
                            onClick={handlePrev}
                            aria-label="Previous Slide"
                            className="absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-gray-100 flex items-center justify-center text-[#0F172A] hover:bg-[#0F766E] hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            aria-label="Next Slide"
                            className="absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-gray-100 flex items-center justify-center text-[#0F172A] hover:bg-[#0F766E] hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Bottom Indicator Dots */}
                    <div className="mt-8 flex items-center gap-3 z-40">
                        {SCENES.map((_, i) => (
                            <button
                                key={`dot-d-${i}`}
                                onClick={() => setActiveScene(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className="focus:outline-none p-2 cursor-pointer"
                            >
                                <div className={`h-2.5 rounded-full transition-all duration-300 ${
                                    activeScene === i ? "w-10 bg-[#0F766E] shadow-sm" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                                }`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MOBILE HORIZONTAL SWIPE DECK (RESTORED ORIGINAL) ── */}
            <div className="flex flex-col lg:hidden w-full bg-[#D8E8E2] pt-4 pb-16 relative">
                <div
                    ref={mobileScrollRef}
                    className="flex w-full overflow-x-auto snap-x snap-mandatory px-6 gap-5 items-stretch [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {SCENES.map((scene, idx) => (
                        <MobileSwipeCard key={`mobile-card-${idx}`} scene={scene} idx={idx} />
                    ))}
                    <div className="w-[10vw] sm:w-[4vw] shrink-0" />
                </div>

                {/* Mobile Pagination */}
                <div className="w-full flex justify-center items-center gap-3 mt-8 z-10 relative">
                    {SCENES.map((_, i) => (
                        <button
                            key={`dot-${i}`}
                            onClick={() => scrollToMobileScene(i)}
                            aria-label={`Scroll to scene ${i + 1}`}
                            className="p-3 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation cursor-pointer"
                        >
                            <div className={`h-2.5 rounded-full transition-all duration-400 ease-out ${
                                activeMobileIdx === i ? 'bg-[#0F766E] w-8 shadow-sm scale-100' : 'bg-gray-300 w-2.5 hover:bg-gray-400 scale-90'
                            }`} />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
