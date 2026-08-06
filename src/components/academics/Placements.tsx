"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Blocks, Users, Briefcase, TrendingUp, ChevronRight, User } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";

const TABS = [
    {
        id: "tab-1",
        label: "Practical Learning",
        nodeRef: "Practical Learning",
        icon: BookOpen,
        title: "Practical Learning",
        description: "Learn through hands-on sessions focused on solving real problems. We replace traditional lectures with interactive coding and architectural planning.",
        tags: ["Interactive", "Hands-on", "Architecture"]
    },
    {
        id: "tab-2",
        label: "Build Real Projects",
        nodeRef: "Live Projects",
        icon: Blocks,
        title: "Build Real Projects",
        description: "Develop portfolio-ready applications that demonstrate practical skills. Every line of code contributes directly to your professional portfolio.",
        tags: ["Portfolio", "Real-World", "Coding"]
    },
    {
        id: "tab-3",
        label: "Industry Mentorship",
        nodeRef: "Mentorship",
        icon: Users,
        title: "Industry Mentorship",
        description: "Receive guidance from experienced professionals throughout your learning journey, helping you navigate complex system constraints.",
        tags: ["Guidance", "Expertise", "Support"]
    },
    {
        id: "tab-4",
        label: "Career Readiness",
        nodeRef: "Career Opportunities",
        icon: Briefcase,
        title: "Career Readiness",
        description: "Strengthen interview skills, professional confidence, and industry preparedness before you ever step into your first technical round.",
        tags: ["Interviews", "Confidence", "Growth"]
    }
];

const HUB_NODES = [
    { id: "Student", label: "Student", x: -120, y: 0 },
    { id: "Practical Learning", label: "Practical Learning", x: -72, y: -108 },
    { id: "Live Projects", label: "Live Projects", x: 72, y: -108 },
    { id: "Mentorship", label: "Mentorship", x: 120, y: 0 },
    { id: "Career Opportunities", label: "Career Opportunities", x: 0, y: 120 },
];

export function Placements() {
    const [activeTab, setActiveTab] = React.useState(0);
    const activeNodeRef = TABS[activeTab].nodeRef;

    const handleInteract = (idx: number, type: 'click' | 'hover') => {
        if (type === 'hover' && typeof window !== 'undefined' && window.innerWidth < 1024) return;
        setActiveTab(idx);
    };

    return (
        <SectionWrapper id="placements" className="bg-[#EDF5F2] relative overflow-hidden">

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-[#6B9F91]/5 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-20 flex flex-col items-center">

                {/* Header */}
                <div className="text-center mb-16 lg:mb-20">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-widest mb-4">
                        CAREER JOURNEYS
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-4">
                        Turning Learning Into <span className="text-[#6B9F91]">Careers.</span>
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Through practical learning, mentorship, and real-world projects, students gain the confidence and experience needed for successful professional careers.
                    </p>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 w-full max-w-6xl mx-auto relative items-center">

                    {/* Left Column: The Interactive Career Growth Hub */}
                    <div className="relative w-full max-w-[450px] md:max-w-[540px] aspect-[4/3] mx-auto flex items-center justify-center isolate z-30 lg:order-1">

                        {/* SVG Connection Lines */}
                        <svg className="absolute inset-0 w-full h-full -z-10" viewBox="-180 -180 360 360">
                            {HUB_NODES.map((node) => {
                                const isActive = node.id === activeNodeRef;
                                return (
                                    <g key={node.id}>
                                        {/* Background dashed line */}
                                        <line
                                            x1="0" y1="0" x2={node.x} y2={node.y}
                                            stroke="#6B9F91"
                                            strokeWidth="1.5"
                                            strokeOpacity="0.15"
                                            strokeDasharray="4 4"
                                        />
                                        {/* Animated active line */}
                                        {isActive && (
                                            <motion.line
                                                x1="0" y1="0" x2={node.x} y2={node.y}
                                                stroke="#6B9F91"
                                                strokeWidth="2.5"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: 0.8 }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                            />
                                        )}
                                    </g>
                                )
                            })}
                        </svg>

                        {/* Center Node */}
                        <motion.div
                            className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-[0_10px_40px_rgba(107,159,145,0.15)] border-4 border-[#EDF5F2] flex flex-col items-center justify-center relative z-20"
                        >
                            <div className="absolute inset-0 bg-[#6B9F91]/5 rounded-full animate-pulse z-0 hidden md:block" />
                            <TrendingUp className="w-8 h-8 text-[#6B9F91] mb-2 relative z-10" />
                            <span className="text-xs md:text-sm font-extrabold text-[#111827] uppercase tracking-wider text-center leading-tight relative z-10">Career<br />Growth</span>
                        </motion.div>

                        {/* Orbiting Nodes */}
                        {HUB_NODES.map((node) => {
                            const isActive = node.id === activeNodeRef;
                            const tabIndex = TABS.findIndex(t => t.nodeRef === node.id);

                            return (
                                <motion.button
                                    key={node.id}
                                    onMouseEnter={() => tabIndex !== -1 && handleInteract(tabIndex, 'hover')}
                                    onClick={() => tabIndex !== -1 && handleInteract(tabIndex, 'click')}
                                    disabled={tabIndex === -1}
                                    className={`absolute px-4 py-2 rounded-full transition-all duration-300 ease-out flex items-center justify-center flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91]
                                        ${isActive ? 'bg-[#6B9F91] border border-[#5C8C80] z-30 shadow-[0_4px_15px_rgba(107,159,145,0.4)] scale-[1.05]' : 'bg-white border border-gray-100 z-10 opacity-70 shadow-md hover:opacity-100 hover:scale-[1.03] hover:shadow-lg lg:hover:bg-[#EDF5F2]/50'}
                                        ${node.id === "Student" && !isActive ? 'opacity-40 cursor-default hover:scale-100' : 'cursor-pointer'}
                                    `}
                                    style={{ x: node.x, y: node.y }}
                                    animate={{
                                        y: isActive ? [node.y - 4, node.y + 4, node.y - 4] : node.y
                                    }}
                                    transition={{
                                        y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                                    }}
                                >
                                    <span className={`text-[9px] md:text-[10px] font-bold tracking-wide text-center whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                        {node.label}
                                    </span>
                                </motion.button>
                            )
                        })}
                    </div>

                    {/* Right Column: Unified Content Container */}
                    <div className="w-full flex flex-col relative z-40 lg:order-2 lg:bg-white lg:border lg:border-gray-100 lg:rounded-[2.5rem] lg:p-10 lg:shadow-[0_8px_40px_rgb(0,0,0,0.04)] overflow-hidden">

                        {/* Tab Buttons (Responsive) */}
                        <div className="w-full flex flex-col lg:flex-row gap-2 lg:gap-2.5 lg:border-b lg:border-gray-100 mb-8 lg:mb-10 px-4 lg:px-0 lg:pb-3">
                            {TABS.map((tab, idx) => {
                                const isActive = idx === activeTab;
                                return (
                                    <button
                                        key={tab.id}
                                        onMouseEnter={() => handleInteract(idx, 'hover')}
                                        onClick={() => handleInteract(idx, 'click')}
                                        className={`
                                            w-full lg:w-auto py-3 px-4 rounded-xl lg:rounded-xl text-[11px] lg:text-[13px] font-extrabold uppercase tracking-wide transition-all duration-300 ease-out text-center relative focus-visible:outline-none
                                            ${isActive
                                                ? 'bg-[#6B9F91] border border-[#5C8C80] text-white shadow-[0_4px_15px_rgba(107,159,145,0.4)] scale-[1.03] lg:scale-[1.05]'
                                                : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300 lg:bg-transparent lg:border-transparent lg:text-gray-400 hover:text-gray-900 lg:hover:bg-gray-50/50 lg:hover:scale-[1.02]'}
                                            lg:flex-1 lg:py-3.5 lg:px-2 lg:min-w-[120px]
                                        `}
                                    >
                                        <span className="relative z-10 transition-colors duration-300">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Content Area */}
                        <div className="w-full relative px-4 lg:px-0">
                            <AnimatePresence mode="wait">
                                {TABS.map((tab, idx) => {
                                    if (idx !== activeTab) return null;
                                    const Icon = tab.icon;

                                    return (
                                        <motion.div
                                            key={tab.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -15 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full bg-white lg:bg-transparent border border-gray-100 lg:border-none rounded-3xl lg:rounded-none p-8 md:p-12 lg:p-0 shadow-xl shadow-gray-200/50 lg:shadow-none flex flex-col md:flex-row lg:flex-col xl:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-[#6B9F91]/5 border border-[#6B9F91]/10 flex items-center justify-center shrink-0">
                                                <Icon className="w-8 h-8 text-[#6B9F91]" />
                                            </div>
                                            <div className="flex flex-col flex-1 w-full text-center md:text-left">
                                                <h3 className="text-2xl font-extrabold text-[#111827] mb-3">{tab.title}</h3>
                                                <p className="text-gray-500 text-sm xl:text-base leading-relaxed mb-6">
                                                    {tab.description}
                                                </p>

                                                {/* Tags */}
                                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                                                    {tab.tags?.map(tag => (
                                                        <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] sm:text-[11px] font-bold text-gray-500 tracking-wider uppercase">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <button className="flex items-center justify-center md:justify-start gap-2 text-[#6B9F91] font-bold text-sm tracking-wide group hover:text-[#5C8C80] transition-colors w-full md:w-auto">
                                                    Learn More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </Container>
        </SectionWrapper>
    );
}
