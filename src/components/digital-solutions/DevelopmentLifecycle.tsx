"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Compass,
    PenTool,
    Code2,
    ShieldCheck,
    Rocket,
    Headphones,
    CheckCircle2,
    Palette,
    Terminal,
    Search,
    ArrowRight
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { hoverLift, staggerContainer, slideUp } from "@/lib/animations";
import { cn } from "@/utils/cn";

const STAGES = [
    {
        id: "discovery",
        title: "Discovery",
        icon: Compass,
        description: "Understanding your business goals, target audience, and functional requirements to blueprint scalable solutions.",
        deliverables: ["Research", "Requirements", "Roadmap"],
    },
    {
        id: "design",
        title: "UI / UX Design",
        icon: PenTool,
        description: "Crafting intuitive user interfaces and logical workflows that maximize engagement and reduce friction.",
        deliverables: ["Wireframes", "Prototypes", "Design System"],
    },
    {
        id: "development",
        title: "Development",
        icon: Code2,
        description: "Writing clean, efficient, and scalable code architecture utilizing modern full-stack web and mobile frameworks.",
        deliverables: ["Frontend", "Backend", "APIs"],
    },
    {
        id: "testing",
        title: "Testing",
        icon: ShieldCheck,
        description: "Executing rigorous quality assurance, automated unit testing, and critical security vulnerability audits.",
        deliverables: ["QA", "Performance", "Security"],
    },
    {
        id: "deployment",
        title: "Deployment",
        icon: Rocket,
        description: "Configuring robust cloud infrastructures and establishing CI/CD pipelines for zero-downtime production releases.",
        deliverables: ["Cloud Deployment", "CI/CD", "Monitoring"],
    },
    {
        id: "support",
        title: "Support",
        icon: Headphones,
        description: "Providing continuous maintenance, applying security patches, and iterative feature scaling post-launch.",
        deliverables: ["Maintenance", "Updates", "Improvements"],
    }
];

export function DevelopmentLifecycle() {
    const [activeIndex, setActiveIndex] = React.useState<number>(0);
    const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);
    const activeStage = STAGES[activeIndex];

    const handleStepClick = (idx: number) => {
        setActiveIndex(idx);
        setExpandedIndex(prev => prev === idx ? null : idx);
    };

    return (
        <SectionWrapper id="development-lifecycle" className="bg-white">
            <Container className="space-y-12 lg:space-y-16">

                <SectionHeading
                    badge="Our Development Process"
                    title="From Idea to Deployment"
                    description="Every successful digital solution is built through a structured process focused on collaboration, quality, and continuous improvement."
                />

                <div className="flex flex-col gap-10 lg:gap-14">

                    {/* Horizontal Interactive Timeline (Desktop/Tablet) / Vertical List (Mobile) */}
                    <div className="w-full relative">
                        {/* Connecting Line Desktop */}
                        <div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-100 hidden md:block -z-10" />

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10">
                            {STAGES.map((stage, idx) => {
                                const isActive = activeIndex === idx;
                                const isExpanded = expandedIndex === idx;
                                const isPassed = activeIndex > idx;
                                const Icon = stage.icon;

                                return (
                                    <div key={stage.id} className="relative flex flex-col">

                                        {/* Mobile structural connecting line (moved to wrapper to span accordion) */}
                                        {idx !== STAGES.length - 1 && (
                                            <div className="absolute left-[2.4rem] top-14 -bottom-4 w-0.5 bg-gray-200 md:hidden z-0" />
                                        )}

                                        <button
                                            onClick={() => handleStepClick(idx)}
                                            className="relative flex md:flex-col items-center gap-4 focus-visible:outline-none group text-left md:text-center w-full bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none z-10"
                                        >
                                            <div className={cn(
                                                "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-300 relative z-10 shrink-0",
                                                isActive
                                                    ? "bg-[#6B9F91] text-white shadow-xl shadow-[#6B9F91]/20 scale-110"
                                                    : isPassed
                                                        ? "bg-[#6B9F91]/20 text-[#6B9F91]"
                                                        : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                                            )}>
                                                <Icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive && "animate-pulse")} />
                                            </div>

                                            <div className="flex flex-col md:items-center mt-0 md:mt-2">
                                                <span className={cn(
                                                    "text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 transition-colors",
                                                    isActive ? "text-[#6B9F91]" : "text-gray-400"
                                                )}>
                                                    Step 0{idx + 1}
                                                </span>
                                                <span className={cn(
                                                    "text-sm md:text-[13px] lg:text-base font-bold transition-colors leading-tight md:min-h-8 lg:min-h-0 flex items-center justify-center",
                                                    isActive ? "text-[var(--color-heading)]" : "text-gray-500"
                                                )}>
                                                    {stage.title}
                                                </span>
                                            </div>
                                        </button>

                                        {/* Mobile Content Accordion (Only visible on mobile when expanded) */}
                                        <div className={cn(
                                            "md:hidden overflow-hidden transition-all duration-300 ease-in-out z-10 ml-[4.5rem] mr-2",
                                            isExpanded ? "max-h-[500px] opacity-100 mt-2 mb-2" : "max-h-0 opacity-0 m-0"
                                        )}>
                                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-left">
                                                <h3 className="text-lg font-bold text-[var(--color-heading)] mb-2">{stage.title}</h3>
                                                <p className="text-sm text-[var(--color-body-text)] mb-4 leading-relaxed">
                                                    {stage.description}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Key Deliverables</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {stage.deliverables.map((item, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-gray-50 text-[var(--color-heading)] rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border border-gray-100">
                                                            <CheckCircle2 className="w-3 h-3 text-[#6B9F91]" />
                                                            {item}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dynamic Preview Panel (Hidden on Mobile) */}
                    <div className="hidden md:flex w-full bg-gray-50 border border-[var(--color-border)] rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 flex-col lg:flex-row relative">
                        {/* Content Area (40%) */}
                        <div className="w-full lg:w-[40%] p-8 lg:p-12 flex flex-col justify-center bg-white z-10 relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStage.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col h-full justify-center"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#6B9F91]/10 text-[#6B9F91] flex items-center justify-center mb-6">
                                        <activeStage.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)] mb-4">{activeStage.title}</h3>
                                    <p className="text-[var(--color-body-text)] mb-8 leading-relaxed">
                                        {activeStage.description}
                                    </p>

                                    <div className="mt-auto">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Key Deliverables</p>
                                        <div className="flex flex-wrap gap-2">
                                            {activeStage.deliverables.map((item, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-gray-100 text-[var(--color-heading)] rounded-lg text-xs font-semibold flex items-center gap-2">
                                                    <CheckCircle2 className="w-3 h-3 text-[#6B9F91]" />
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Interactive Visual Area (60%) */}
                        <div className="w-full lg:w-[60%] bg-[#6B9F91]/5 relative min-h-[350px] lg:min-h-auto overflow-hidden flex items-center justify-center p-8 border-l border-gray-100">
                            {/* Accent Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#6B9F91]/20 blur-[100px] rounded-full pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {/* DISCOVERY VISUAL */}
                                {activeIndex === 0 && (
                                    <motion.div
                                        key="discovery"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                                        className="relative z-10 w-full max-w-[450px] aspect-[16/11] flex items-center justify-center"
                                    >
                                        <svg className="w-full h-full absolute inset-0 z-0 overflow-visible" viewBox="0 0 450 310">
                                            {/* Pulse connection lines */}
                                            <motion.line x1="225" y1="155" x2="80" y2="80" stroke="#6B9F91" strokeWidth="2" strokeDasharray="6, 6" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -20 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                                            <motion.line x1="225" y1="155" x2="370" y2="70" stroke="#2DD4BF" strokeWidth="2" strokeDasharray="6, 6" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: 20 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                                            <motion.line x1="225" y1="155" x2="90" y2="220" stroke="#6B9F91" strokeWidth="2" strokeDasharray="6, 6" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -20 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
                                            <motion.line x1="225" y1="155" x2="350" y2="230" stroke="#2DD4BF" strokeWidth="2" strokeDasharray="6, 6" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: 20 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} />
                                        </svg>

                                        {/* Satellite Nodes */}
                                        <motion.div 
                                            animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                            className="absolute top-10 left-6 bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2"
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#6B9F91] animate-ping shrink-0" />
                                            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Market Research</span>
                                        </motion.div>

                                        <motion.div 
                                            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                                            className="absolute top-8 right-6 bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2"
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse shrink-0" />
                                            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">User Personas</span>
                                        </motion.div>

                                        <motion.div 
                                            animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                                            className="absolute bottom-12 left-10 bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2"
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shrink-0" />
                                            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Tech Architecture</span>
                                        </motion.div>

                                        <motion.div 
                                            animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                                            className="absolute bottom-10 right-10 bg-white border border-gray-200/80 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2"
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#6B9F91] shrink-0" />
                                            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">Project Backlog</span>
                                        </motion.div>

                                        {/* Central Discovery Core */}
                                        <div className="relative z-10 w-28 h-28 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-2xl">
                                            <motion.div 
                                                animate={{ scale: [1, 1.08, 1] }} 
                                                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                                                className="absolute inset-1 rounded-full bg-[#6B9F91]/5 border border-[#6B9F91]/20" 
                                            />
                                            <motion.div 
                                                animate={{ rotate: 360 }} 
                                                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                                className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6B9F91] to-[#2DD4BF] text-white flex items-center justify-center shadow-lg"
                                            >
                                                <Compass className="w-8 h-8" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* UI/UX VISUAL */}
                                {activeIndex === 1 && (
                                    <motion.div
                                        key="design"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                                        className="relative z-10 w-full max-w-[500px] aspect-[16/11] bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                                    >
                                        {/* Editor Header */}
                                        <div className="h-11 bg-gray-50 flex items-center px-5 justify-between border-b border-gray-200 shrink-0">
                                            <div className="flex items-center gap-2">
                                                <Palette className="w-4 h-4 text-[#6B9F91]" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Creative Suite / UI_UX_Layout</span>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                            </div>
                                        </div>

                                        {/* Live Layout Canvas */}
                                        <div className="flex-grow bg-[#F8FAFC] relative overflow-hidden flex items-center justify-center p-6 sm:p-10">
                                            {/* Blueprint Grid Backdrop */}
                                            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60" />

                                            {/* Stack of Floating Canvas Layers */}
                                            <div className="relative w-full h-full flex items-center justify-center">

                                                {/* LAYER 1: Wireframe / Skeleton Grid (Bottom-Left) */}
                                                <motion.div 
                                                    animate={{ y: [0, -8, 0], x: [0, 4, 0] }}
                                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                                    className="absolute w-44 bg-white/70 border-2 border-dashed border-teal-300 rounded-xl p-3 shadow-md z-10 -translate-x-16 -translate-y-10 scale-95 flex flex-col gap-2 pointer-events-none"
                                                >
                                                    <span className="text-[8px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded w-max">UX Wireframe</span>
                                                    <div className="w-full h-12 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-300 text-[10px] bg-gray-50/50">
                                                        [Image Placeholder]
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="w-2/3 h-2 bg-gray-200 rounded" />
                                                        <div className="w-full h-1.5 bg-gray-100 rounded" />
                                                        <div className="w-1/2 h-1.5 bg-gray-100 rounded" />
                                                    </div>
                                                </motion.div>

                                                {/* LAYER 2: Design Tokens & Palette (Middle-Right) */}
                                                <motion.div 
                                                    animate={{ y: [0, 8, 0], x: [0, -4, 0] }}
                                                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                                                    className="absolute w-44 bg-white/90 border border-gray-200 rounded-xl p-3 shadow-lg z-20 translate-x-16 translate-y-12 scale-95 flex flex-col gap-2.5 pointer-events-none"
                                                >
                                                    <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded w-max">Design System (UI)</span>
                                                    
                                                    {/* Color chips */}
                                                    <div className="flex gap-2">
                                                        <div className="w-5 h-5 rounded-full bg-[#0F766E] shadow-sm animate-pulse" />
                                                        <div className="w-5 h-5 rounded-full bg-[#6B9F91] shadow-sm" />
                                                        <div className="w-5 h-5 rounded-full bg-[#2DD4BF] shadow-sm" />
                                                    </div>
                                                    
                                                    {/* Typography pills */}
                                                    <div className="space-y-1">
                                                        <div className="text-[9px] font-black text-gray-800 tracking-tight">Display Bold</div>
                                                        <div className="text-[8px] font-mono text-gray-400">Inter / 700 / Medium</div>
                                                    </div>

                                                    {/* Button Component States */}
                                                    <div className="w-full bg-[#6B9F91] text-white py-1 rounded text-center text-[8px] font-bold shadow-sm shadow-[#6B9F91]/20">
                                                        Active Button
                                                    </div>
                                                </motion.div>

                                                {/* LAYER 3: Finished Prototype UI Card (Top Floating Center) */}
                                                <motion.div 
                                                    animate={{ y: [0, -12, 0] }}
                                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="absolute w-48 bg-white border border-gray-100 rounded-2xl p-3.5 shadow-2xl shadow-gray-400/40 z-30 flex flex-col gap-2.5 cursor-pointer"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[8px] font-bold text-[#6B9F91] bg-[#EDF5F2] px-1.5 py-0.5 rounded">High-Fi Prototype</span>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                                    </div>

                                                    {/* Product preview */}
                                                    <div className="w-full h-24 rounded-lg bg-gradient-to-br from-[#EDF5F2] to-gray-50 relative flex items-center justify-center overflow-hidden">
                                                        {/* Vector drawing overlay */}
                                                        <svg className="w-full h-full absolute inset-0 z-0 opacity-40" viewBox="0 0 100 100">
                                                            <path d="M 10 50 Q 50 10 90 50" fill="none" stroke="#2DD4BF" strokeWidth="2" />
                                                        </svg>
                                                        
                                                        {/* Sneaker dynamic shape */}
                                                        <motion.div
                                                            animate={{ rotate: [0, 4, 0], scale: [1, 1.05, 1] }}
                                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                                            className="w-16 h-16 text-[#6B9F91] drop-shadow-md z-10"
                                                        >
                                                            <PenTool className="w-full h-full rotate-45" />
                                                        </motion.div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="text-[10px] font-black text-gray-800">ClearVision SaaS UI</div>
                                                        <div className="text-[8px] font-semibold text-gray-400">Logical workflows • High Engagement</div>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                                                        <span className="text-[9px] font-black text-gray-800">Status: Complete</span>
                                                        <span className="text-[8px] font-bold text-teal-600 flex items-center gap-1 hover:underline">
                                                            Tap to Test <ArrowRight className="w-2.5 h-2.5" />
                                                        </span>
                                                    </div>
                                                </motion.div>

                                                {/* Drawing Bezier Path vector lines overlapping */}
                                                <svg className="absolute inset-0 w-full h-full z-40 pointer-events-none overflow-visible" viewBox="0 0 250 160">
                                                    <motion.path 
                                                        d="M 20,40 Q 125,-10 230,40 T 20,40"
                                                        fill="none"
                                                        stroke="url(#gradient-line)"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: 1 }}
                                                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                                    />
                                                    
                                                    <defs>
                                                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="100%">
                                                            <stop offset="0%" stopColor="#6B9F91" />
                                                            <stop offset="100%" stopColor="#2DD4BF" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* DEVELOPMENT VISUAL */}
                                {activeIndex === 2 && (
                                    <motion.div
                                        key="development"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                                        className="relative z-10 w-full max-w-[450px] h-[300px] bg-[#1E1E1E] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs"
                                    >
                                        <div className="h-10 bg-[#2D2D2D] flex items-center px-4 gap-2 border-b border-[#404040]">
                                            <Terminal className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-400">server.ts</span>
                                        </div>
                                        <div className="p-6 flex flex-col gap-2 text-gray-300">
                                            <p><span className="text-purple-400">import</span> <span className="text-yellow-300">{`{`}</span> Application <span className="text-yellow-300">{`}`}</span> <span className="text-purple-400">from</span> <span className="text-green-300">'@ss40/core'</span>;</p>
                                            <p className="mt-2"><span className="text-purple-400">const</span> <span className="text-blue-300">app</span> = <span className="text-purple-400">new</span> <span className="text-yellow-100">Application</span>();</p>
                                            <p className="mt-4"><span className="text-blue-300">app</span>.<span className="text-yellow-100">configure</span>(<span className="text-blue-300">options</span> <span className="text-purple-400">{`=>`}</span> {`{`}</p>
                                            <p className="pl-4"><span className="text-blue-300">options</span>.<span className="text-blue-300">cloud</span> = <span className="text-blue-300">true</span>;</p>
                                            <p className="pl-4"><span className="text-blue-300">options</span>.<span className="text-blue-300">secure</span> = <span className="text-blue-300">true</span>;</p>
                                            <p>{`});`}</p>
                                            <motion.div
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className="w-2 h-4 bg-gray-400 mt-2"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* TESTING VISUAL */}
                                {activeIndex === 3 && (
                                    <motion.div
                                        key="testing"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                                        className="relative z-10 w-full max-w-[450px] flex flex-col gap-4"
                                    >
                                        {[1, 2, 3].map((task, idx) => (
                                            <div key={idx} className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-md flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 animate-spin-slow" style={{ animationDuration: '3s' }}>
                                                        <Search className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="w-24 h-2.5 bg-gray-200 rounded mb-1" />
                                                        <div className="w-16 h-1.5 bg-gray-100 rounded" />
                                                    </div>
                                                </div>
                                                <motion.div
                                                    initial={{ width: "0%", backgroundColor: "#E5E7EB" }}
                                                    animate={{ width: "24px", backgroundColor: "#10B981" }}
                                                    transition={{ delay: 0.5 + (idx * 0.3), duration: 0.5 }}
                                                    className="h-6 rounded-full flex items-center justify-center overflow-hidden"
                                                >
                                                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                                                </motion.div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* DEPLOYMENT VISUAL */}
                                {activeIndex === 4 && (
                                    <motion.div
                                        key="deployment"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                                        className="relative z-10 w-full max-w-[400px] h-[300px] flex items-center justify-center relative"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                            <div className="w-48 h-48 border-2 border-dashed border-[#6B9F91] rounded-full animate-spin-slow" style={{ animationDuration: '20s' }} />
                                            <div className="absolute w-64 h-64 border-2 border-dashed border-[#6B9F91] rounded-full animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                                        </div>
                                        <motion.div
                                            animate={{ y: [-15, -25, -15] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                            className="w-24 h-24 bg-white border border-gray-200 shadow-2xl rounded-2xl flex items-center justify-center z-10"
                                        >
                                            <Rocket className="w-12 h-12 text-[#6B9F91]" />
                                        </motion.div>
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "100px", opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                                            className="absolute top-[60%] w-2 bg-gradient-to-b from-[#FFC900] to-transparent rounded-full"
                                        />
                                    </motion.div>
                                )}

                                {/* SUPPORT VISUAL */}
                                {activeIndex === 5 && (
                                    <motion.div
                                        key="support"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                                        className="relative z-10 w-full max-w-[450px] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex"
                                    >
                                        <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-4 space-y-3">
                                            <div className="w-full h-8 bg-gray-200 rounded-md" />
                                            <div className="w-full h-8 bg-white border border-gray-200 rounded-md shadow-sm" />
                                            <div className="w-full h-8 bg-white border border-gray-200 rounded-md shadow-sm" />
                                        </div>
                                        <div className="w-2/3 p-6 flex flex-col justify-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-sm font-bold text-gray-700">All Systems Operational</span>
                                            </div>
                                            <div className="w-full h-24 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center px-4">
                                                <svg className="w-full h-12 text-[#6B9F91]" viewBox="0 0 100 20" preserveAspectRatio="none">
                                                    <motion.polyline
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        points="0,10 20,10 30,0 40,20 50,10 100,10"
                                                        initial={{ strokeDasharray: "0 100" }}
                                                        animate={{ strokeDasharray: "100 0" }}
                                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={slideUp}
                    className="mt-12 bg-[#6B9F91]/5 border border-[#6B9F91]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="text-center md:text-left max-w-lg">
                        <h4 className="text-xl font-bold text-[var(--color-heading)] mb-2">Our Commitment</h4>
                        <p className="text-sm text-[var(--color-body-text)]">Every project follows a transparent, collaborative, and quality-focused process.</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-3">
                        <span className="px-4 py-2 bg-white shadow-sm border border-gray-200 text-[#6B9F91] text-xs font-bold rounded-lg uppercase tracking-wider">Agile Workflow</span>
                        <span className="px-4 py-2 bg-white shadow-sm border border-gray-200 text-[#6B9F91] text-xs font-bold rounded-lg uppercase tracking-wider">Transparent Communication</span>
                        <span className="px-4 py-2 bg-white shadow-sm border border-gray-200 text-[#6B9F91] text-xs font-bold rounded-lg uppercase tracking-wider">Quality Assurance</span>
                    </div>
                </motion.div>

            </Container>
        </SectionWrapper>
    );
}
