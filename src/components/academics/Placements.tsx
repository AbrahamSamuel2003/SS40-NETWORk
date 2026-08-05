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
    },
    {
        id: "tab-2",
        label: "Build Real Projects",
        nodeRef: "Live Projects",
        icon: Blocks,
        title: "Build Real Projects",
        description: "Develop portfolio-ready applications that demonstrate practical skills. Every line of code contributes directly to your professional portfolio.",
    },
    {
        id: "tab-3",
        label: "Industry Mentorship",
        nodeRef: "Mentorship",
        icon: Users,
        title: "Industry Mentorship",
        description: "Receive guidance from experienced professionals throughout your learning journey, helping you navigate complex system constraints.",
    },
    {
        id: "tab-4",
        label: "Career Readiness",
        nodeRef: "Career Opportunities",
        icon: Briefcase,
        title: "Career Readiness",
        description: "Strengthen interview skills, professional confidence, and industry preparedness before you ever step into your first technical round.",
    }
];

const HUB_NODES = [
    { id: "Student", label: "Student", x: -100, y: 0 },
    { id: "Practical Learning", label: "Practical Learning", x: -60, y: -90 },
    { id: "Live Projects", label: "Live Projects", x: 60, y: -90 },
    { id: "Mentorship", label: "Mentorship", x: 100, y: 0 },
    { id: "Career Opportunities", label: "Career Opportunities", x: 0, y: 100 },
];

export function Placements() {
    const [activeTab, setActiveTab] = React.useState(0);
    const activeNodeRef = TABS[activeTab].nodeRef;

    return (
        <SectionWrapper id="placements" className="bg-[#F2F7F5] relative overflow-hidden">

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

                {/* The Interactive Career Growth Hub */}
                <div className="relative w-full max-w-[600px] aspect-[4/3] md:aspect-video lg:aspect-[2.5/1] mx-auto flex items-center justify-center isolate mb-16 z-30">

                    {/* SVG Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full -z-10" viewBox="-150 -150 300 300">
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
                        className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-[0_10px_40px_rgba(107,159,145,0.15)] border-4 border-[#F2F7F5] flex flex-col items-center justify-center relative z-20"
                    >
                        <div className="absolute inset-0 bg-[#6B9F91]/5 rounded-full animate-pulse z-0 hidden md:block" />
                        <TrendingUp className="w-8 h-8 text-[#6B9F91] mb-2 relative z-10" />
                        <span className="text-xs md:text-sm font-extrabold text-[#111827] uppercase tracking-wider text-center leading-tight relative z-10">Career<br />Growth</span>
                    </motion.div>

                    {/* Orbiting Nodes */}
                    {HUB_NODES.map((node) => {
                        const isActive = node.id === activeNodeRef;

                        return (
                            <motion.div
                                key={node.id}
                                className={`absolute px-4 py-2 rounded-full shadow-md transition-colors duration-300 flex items-center justify-center flex-col gap-1
                                    ${isActive ? 'bg-[#6B9F91] border border-[#5C8C80] z-30' : 'bg-white border border-gray-100 z-10 opacity-60'}
                                    ${node.id === "Student" && !isActive ? 'opacity-40' : ''}
                                `}
                                style={{ x: node.x, y: node.y }}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    y: isActive ? [node.y - 4, node.y + 4, node.y - 4] : node.y
                                }}
                                transition={{
                                    scale: { duration: 0.3, type: "spring", bounce: 0.5 },
                                    y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                                }}
                            >
                                <span className={`text-[9px] md:text-[10px] font-bold tracking-wide text-center whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                    {node.label}
                                </span>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Horizontal Tabs */}
                <div className="w-full max-w-4xl mx-auto relative z-40 bg-white/50 backdrop-blur-md rounded-3xl p-2 pb-0 hidden sm:flex flex-col items-center border border-gray-100 shadow-xl shadow-gray-200/40">
                    <div className="flex w-full items-end justify-between border-b border-gray-200 overflow-hidden">
                        {TABS.map((tab, idx) => {
                            const isActive = idx === activeTab;
                            return (
                                <button
                                    key={tab.id}
                                    onMouseEnter={() => setActiveTab(idx)}
                                    // Make click work for mobile/touch
                                    onClick={() => setActiveTab(idx)}
                                    className={`relative flex-1 py-4 px-2 md:px-6 text-center focus:outline-none transition-colors duration-300 min-w-[140px] ${isActive ? 'text-[#6B9F91]' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    <span className="text-[11px] md:text-[13px] font-extrabold uppercase tracking-wide">
                                        {tab.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#6B9F91]"
                                            initial={false}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Tabs Wrapper (Vertical) */}
                <div className="w-full flex flex-col gap-2 sm:hidden mb-8">
                    {TABS.map((tab, idx) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(idx)}
                            className={`w-full py-3 px-4 rounded-xl text-[11px] font-extrabold uppercase tracking-wide border transition-all ${idx === activeTab
                                ? 'bg-[#6B9F91] text-white border-[#5C8C80]'
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Shared Content Panel */}
                <div className="w-full max-w-3xl mx-auto mt-8 relative">
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
                                    className="w-full relative bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[#6B9F91]/5 border border-[#6B9F91]/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-8 h-8 text-[#6B9F91]" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-[#111827] mb-3">{tab.title}</h3>
                                        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6">
                                            {tab.description}
                                        </p>
                                        <button className="flex items-center justify-center md:justify-start gap-2 text-[#6B9F91] font-bold text-sm tracking-wide group hover:text-[#5C8C80] transition-colors w-full md:w-auto">
                                            Learn More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

            </Container>
        </SectionWrapper>
    );
}
