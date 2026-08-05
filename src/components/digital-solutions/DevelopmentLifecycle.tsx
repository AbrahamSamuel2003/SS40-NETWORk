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
    Search
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
                                                    "text-sm md:text-base font-bold transition-colors whitespace-nowrap",
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
                                        className="relative z-10 w-full max-w-[400px] h-[250px] flex items-center justify-center"
                                    >
                                        <div className="w-3/4 h-48 bg-white border border-gray-200 rounded-xl shadow-lg -rotate-6 absolute left-4 p-4 space-y-3 flex flex-col justify-end">
                                            <div className="w-full h-2 bg-gray-100 rounded-full" />
                                            <div className="w-5/6 h-2 bg-gray-100 rounded-full" />
                                        </div>
                                        <div className="w-3/4 h-48 bg-white border border-gray-200 rounded-xl shadow-xl rotate-3 absolute right-4 p-4 space-y-3">
                                            <div className="w-1/2 h-4 bg-gray-200 rounded-md mb-2" />
                                            <div className="w-full h-2 bg-gray-100 rounded-full" />
                                            <div className="w-full h-2 bg-gray-100 rounded-full" />
                                            <div className="w-3/4 h-2 bg-gray-100 rounded-full" />
                                        </div>
                                        <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-[#FFC900] shadow-xl flex items-center justify-center text-white"><Compass className="w-8 h-8" /></div>
                                    </motion.div>
                                )}

                                {/* UI/UX VISUAL */}
                                {activeIndex === 1 && (
                                    <motion.div
                                        key="design"
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                                        className="relative z-10 w-full max-w-[450px] aspect-[16/9] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col"
                                    >
                                        <div className="h-8 bg-gray-100 flex items-center px-4 gap-4 border-b border-gray-200">
                                            <Palette className="w-4 h-4 text-gray-500" />
                                            <div className="w-24 h-2 bg-gray-200 rounded" />
                                        </div>
                                        <div className="flex-1 p-6 grid grid-cols-6 grid-rows-4 gap-4 opacity-70">
                                            <div className="col-span-2 row-span-4 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
                                            <div className="col-span-4 row-span-1 bg-[#6B9F91]/20 rounded border-2 border-[#6B9F91]/40 flex items-center justify-center"><div className="w-8 h-2 bg-white rounded" /></div>
                                            <div className="col-span-4 row-span-3 bg-gray-50 rounded border-2 border-dashed border-gray-300" />
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
