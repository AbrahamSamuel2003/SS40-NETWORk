"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    AppWindow,
    Globe,
    Smartphone,
    Sparkles,
    Cloud,
    Workflow,
    ArrowRight,
    Server,
    Database,
    LineChart,
    Bot,
    TerminalSquare,
    ChevronDown,
    LayoutDashboard, Users, BarChart2, Settings, Lock, Map, LayoutTemplate, MousePointer2, Search, User, Heart, Home, Compass, Plus, ArrowRightLeft, HardDrive, Zap, CheckCircle2, CloudUpload
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const SOLUTIONS = [
    {
        id: "enterprise",
        title: "Enterprise Software",
        icon: AppWindow,
        description: "Custom platforms built for complex business operations.",
        chips: ["ERP", "CRM", "Dashboards"],
    },
    {
        id: "web",
        title: "Web Applications",
        icon: Globe,
        description: "High-performance scalable portals and frontend systems.",
        chips: ["Next.js", "React", "Admin Panels"],
    },
    {
        id: "mobile",
        title: "Mobile Applications",
        icon: Smartphone,
        description: "Native and cross-platform native experiences for users on the go.",
        chips: ["Android", "iOS", "Flutter"],
    },
    {
        id: "ai",
        title: "AI Solutions",
        icon: Sparkles,
        description: "Intelligent systems designed to automate processes and generate insights.",
        chips: ["Chatbots", "Automation", "AI Assistants"],
    },
    {
        id: "cloud",
        title: "Cloud Platforms",
        icon: Cloud,
        description: "Reliable, scalable, and secure cloud environments tailored for dynamic workloads.",
        chips: ["AWS", "Azure", "APIs"],
    },
    {
        id: "automation",
        title: "Business Automation",
        icon: Workflow,
        description: "Streamlined operational workflows eliminating manual tasks entirely.",
        chips: ["Workflows", "Integrations", "Efficiency"],
    }
];

export function WhatWeBuild() {
    const [activeId, setActiveId] = React.useState<string>(SOLUTIONS[0].id);
    const [expandedId, setExpandedId] = React.useState<string | null>(SOLUTIONS[0].id);

    const handleTopicClick = (id: string) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setActiveId(id);
            setExpandedId(id);
        }
    };

    return (
        <SectionWrapper id="what-we-build" className="bg-[#EDF5F2] !overflow-visible">
            <Container className="space-y-12 lg:space-y-16">

                {/* Section Header */}
                <SectionHeading
                    badge="What We Build"
                    title="Digital Solutions Built for Modern Businesses"
                    description="From enterprise software to AI-powered automation, we create scalable digital products that solve real business challenges."
                />

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start relative">

                    {/* Left Column - Controller Selection (40%) */}
                    <div className="w-full lg:w-[40%] flex flex-col gap-4">
                        {SOLUTIONS.map((solution) => {
                            const isActive = activeId === solution.id;
                            const isExpanded = expandedId === solution.id;
                            const Icon = solution.icon;

                            return (
                                <button
                                    key={solution.id}
                                    onClick={() => handleTopicClick(solution.id)}
                                    className={cn(
                                        "w-full text-left p-5 md:p-6 rounded-2xl border transition-all duration-300 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                                        isActive
                                            ? "bg-white border-[#6B9F91]/30 shadow-lg shadow-[#6B9F91]/10"
                                            : "bg-transparent border-transparent hover:bg-gray-100 hover:border-gray-200 opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                            isActive ? "bg-[#6B9F91]/10 text-[#6B9F91]" : "bg-gray-200 text-gray-500"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3 className={cn(
                                            "font-bold text-lg transition-colors flex-1",
                                            isActive ? "text-[var(--color-heading)]" : "text-gray-600"
                                        )}>
                                            {solution.title}
                                        </h3>
                                        <div className="shrink-0 ml-4 flex items-center justify-center">
                                            <ChevronDown className={cn(
                                                "w-5 h-5 transition-transform duration-300",
                                                isExpanded ? "rotate-180 text-[#6B9F91]" : "text-gray-400",
                                                !isExpanded && isActive ? "text-[#6B9F91]" : ""
                                            )} />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-sm text-[var(--color-body-text)] mt-4 mb-4 leading-relaxed md:pl-14">
                                                    {solution.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 md:pl-14">
                                                    {solution.chips.map((chip, idx) => (
                                                        <span key={idx} className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-md text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                                                            {chip}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            );
                        })}

                        <div className="pt-4 px-2 hidden lg:block">
                            <Button asChild size="lg" className="w-full bg-[#6B9F91] hover:bg-[#588478] text-white shadow-lg shadow-[#6B9F91]/20">
                                <Link href="/contact">
                                    Start Your Project
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Dynamic Preview Panel (60%) */}
                    <div className="hidden lg:flex w-full lg:w-[60%] flex-col pt-4 lg:sticky lg:top-28">
                        {/* 
                          The container preserves the exact grid size, padding, and alignment, 
                          but acts purely as a transparent layout scaffold to hold the illustrations. 
                        */}
                        <div className="relative w-full aspect-[4/3] min-h-[400px] md:min-h-[500px] flex items-center justify-center p-8 lg:p-12 z-0">

                            {/* Illustrations animate freely inside this transparent area */}

                            <AnimatePresence mode="wait">
                                {/* ENTERPRISE SOFTWARE PREVIEW */}
                                {activeId === "enterprise" && (
                                    <motion.div
                                        key="enterprise"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="relative z-10 w-full h-full flex flex-col gap-4"
                                    >
                                        {/* Floating Notification */}
                                        <motion.div
                                            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                                            className="absolute -top-4 -right-4 bg-white shadow-xl shadow-[#6B9F91]/10 border border-gray-100 rounded-lg px-3 py-2 flex items-center gap-2 z-20"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-gray-700">ERP Sync Complete</span>
                                        </motion.div>

                                        <div className="flex-1 w-full bg-white rounded-xl border border-gray-200 shadow-sm flex overflow-hidden">
                                            {/* Sidebar */}
                                            <div className="w-16 md:w-32 bg-gray-50 border-r border-gray-100 flex flex-col p-3 md:p-4 gap-3 items-center md:items-start shrink-0">
                                                <div className="w-8 md:w-full h-8 md:h-6 bg-gray-200 rounded-md mb-4 flex items-center justify-center font-black text-white text-[10px]"><span className="hidden md:inline text-gray-500">SS40 OS</span></div>
                                                <div className="flex items-center gap-2 text-[#6B9F91] w-full"><LayoutDashboard className="w-4 h-4 shrink-0" /><div className="hidden md:block w-full h-3 bg-[#6B9F91]/20 rounded-md" /></div>
                                                <div className="flex items-center gap-2 text-gray-400 w-full"><Users className="w-4 h-4 shrink-0" /><div className="hidden md:block w-full h-3 bg-gray-200 rounded-md" /></div>
                                                <div className="flex items-center gap-2 text-gray-400 w-full"><BarChart2 className="w-4 h-4 shrink-0" /><div className="hidden md:block w-full h-3 bg-gray-200 rounded-md" /></div>
                                                <div className="flex items-center gap-2 text-gray-400 w-full mt-auto"><Settings className="w-4 h-4 shrink-0" /><div className="hidden md:block w-full h-3 bg-gray-200 rounded-md" /></div>
                                            </div>
                                            {/* Main Content */}
                                            <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6">
                                                <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-lg p-2 md:p-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Overview</span>
                                                        <div className="w-24 h-3 bg-gray-200 rounded-md mt-1" />
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full border-[3px] border-[#6B9F91] border-r-gray-200 flex items-center justify-center relative">
                                                        <span className="text-[8px] font-bold text-gray-600">75%</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 flex flex-col justify-between">
                                                        <span className="text-[10px] font-bold text-gray-500">CRM Data</span>
                                                        <span className="text-sm font-black text-[#111827]">12,400</span>
                                                    </div>
                                                    <div className="bg-[#6B9F91]/10 rounded-lg border border-[#6B9F91]/20 p-3 flex flex-col justify-between">
                                                        <span className="text-[10px] font-bold text-[#6B9F91]">Active Tasks</span>
                                                        <span className="text-sm font-black text-[#6B9F91]">384</span>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 hidden md:flex flex-col justify-between">
                                                        <span className="text-[10px] font-bold text-gray-500">System Load</span>
                                                        <span className="text-sm font-black text-gray-700">Healthy</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 bg-gray-50/50 rounded-lg border border-gray-100 flex items-end p-4 gap-2 relative">
                                                    <span className="absolute top-3 left-3 text-[10px] font-bold text-gray-400">Monthly Revenue</span>
                                                    {[40, 70, 45, 90, 65, 30].map((h, i) => (
                                                        <div key={i} className={`flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80 ${i === 3 ? 'bg-[#6B9F91]' : 'bg-[#6B9F91]/40'}`} style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* WEB APPLICATIONS PREVIEW */}
                                {activeId === "web" && (
                                    <motion.div
                                        key="web"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="relative z-10 w-full h-full flex flex-col"
                                    >
                                        <div className="w-full h-full bg-white rounded-xl border border-[var(--color-border)] shadow-sm flex flex-col overflow-hidden group">
                                            {/* Browser Chrome Header */}
                                            <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2 shrink-0">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                                </div>
                                                <div className="ml-4 flex-1 h-6 bg-white border border-gray-200 rounded flex items-center px-3 gap-2">
                                                    <Lock className="w-3 h-3 text-green-600" /> <div className="w-32 h-2 bg-gray-200 rounded-full" />
                                                </div>
                                                <div className="w-6 h-6 rounded flex items-center justify-center text-gray-400 border border-gray-200 bg-white"><Map className="w-3 h-3" /></div>
                                            </div>

                                            {/* Page Content */}
                                            <div className="flex-1 p-6 pb-0 flex flex-col items-center relative">
                                                <span className="text-[10px] font-bold text-[#6B9F91] tracking-widest uppercase mb-2">Modern Web Apps</span>
                                                <div className="w-[80%] h-8 bg-gray-900 rounded-lg mb-3" />
                                                <div className="w-[50%] h-3 bg-gray-200 rounded-md mb-6" />
                                                <div className="flex gap-3 mb-8">
                                                    <div className="px-4 py-2 bg-[#6B9F91] rounded-md text-[10px] font-bold text-white flex items-center justify-center">Get Started</div>
                                                    <div className="px-4 py-2 border border-gray-200 rounded-md text-[10px] font-bold text-gray-600 flex items-center justify-center">Learn More</div>
                                                </div>

                                                {/* UI Grid Cards */}
                                                <div className="w-full flex-1 bg-gray-50 rounded-t-xl border-t border-x border-gray-100 flex p-4 gap-4 overflow-hidden relative">

                                                    {/* Mouse Cursor Hover Animation */}
                                                    <motion.div
                                                        initial={{ x: 100, y: 100, opacity: 0 }}
                                                        animate={{ x: [100, -20, -10], y: [100, 20, 30], opacity: [0, 1, 1] }}
                                                        transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatDelay: 1 }}
                                                        className="absolute z-20"
                                                    >
                                                        <MousePointer2 className="w-6 h-6 text-gray-900 fill-gray-900 -rotate-12" />
                                                    </motion.div>

                                                    <div className="w-1/3 space-y-3 shrink-0">
                                                        <div className="w-full h-20 bg-white rounded-lg shadow-sm border border-gray-200/50 p-2 flex flex-col transition-all duration-300 group-hover:border-[#6B9F91]/50 group-hover:shadow-md">
                                                            <div className="w-6 h-6 rounded-md bg-[#6B9F91]/10 flex items-center justify-center mb-2"><LayoutTemplate className="w-3 h-3 text-[#6B9F91]" /></div>
                                                            <div className="w-full h-2 bg-gray-200 rounded-full mb-1" />
                                                            <div className="w-2/3 h-2 bg-gray-100 rounded-full" />
                                                        </div>
                                                        <div className="w-full h-20 bg-white rounded-lg shadow-sm border border-gray-100 p-2 flex flex-col">
                                                            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center mb-2"><Globe className="w-3 h-3 text-gray-500" /></div>
                                                            <div className="w-full h-2 bg-gray-200 rounded-full mb-1" />
                                                            <div className="w-1/2 h-2 bg-gray-100 rounded-full" />
                                                        </div>
                                                    </div>

                                                    {/* Dashboard View inside Web App */}
                                                    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex flex-col">
                                                        <div className="w-full h-20 bg-gray-50 rounded mb-3 flex items-end p-2 gap-1 border border-gray-100">
                                                            {[20, 30, 50, 40, 70, 60, 90, 80].map((h, i) => (
                                                                <div key={i} className="flex-1 bg-[#6B9F91]/40 rounded-t-sm" style={{ height: `${h}%` }} />
                                                            ))}
                                                        </div>
                                                        <div className="w-full flex justify-between">
                                                            <div className="w-full max-w-[60%] space-y-1">
                                                                <div className="w-full h-2 bg-gray-200 rounded-full" />
                                                                <div className="w-3/4 h-2 bg-gray-100 rounded-full" />
                                                            </div>
                                                            <div className="w-6 h-6 rounded-full bg-[#6B9F91]/20 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-[#6B9F91]" /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* MOBILE APPLICATIONS PREVIEW */}
                                {activeId === "mobile" && (
                                    <motion.div
                                        key="mobile"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="relative z-10 w-full h-full flex items-center justify-center gap-6"
                                    >
                                        <div className="relative w-48 h-[380px] bg-white rounded-[2rem] shadow-xl border-[6px] border-gray-900 overflow-hidden hidden md:flex flex-col opacity-50 scale-90 translate-x-8">
                                            <div className="h-6 w-full bg-gray-900 rounded-b-xl flex items-center justify-center shrink-0"><div className="w-10 h-1 bg-gray-700 rounded-full" /></div>
                                            <div className="flex-1 p-4 flex flex-col gap-3"><div className="w-full h-1/2 bg-gray-100 rounded-xl" /><div className="w-full flex-1 bg-gray-50 rounded-xl" /></div>
                                        </div>

                                        <div className="relative w-56 md:w-64 h-[420px] md:h-[480px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-gray-900 overflow-hidden flex flex-col z-20">
                                            <div className="h-6 w-full bg-gray-900 mb-2 flex items-center justify-center shrink-0 rounded-b-xl"><div className="w-12 h-1.5 bg-gray-700 rounded-full" /></div>

                                            {/* Header */}
                                            <div className="px-4 py-2 flex justify-between items-center bg-white border-b border-gray-50">
                                                <div className="flex flex-col gap-1">
                                                    <div className="w-16 h-2 bg-gray-200 rounded-full" />
                                                    <span className="text-[10px] font-black text-[#111827]">Welcome back</span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center relative border border-gray-200">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                                                </div>
                                            </div>

                                            {/* Scrollable Content */}
                                            <div className="p-4 flex-1 overflow-hidden space-y-4 bg-gray-50/50">
                                                {/* Search Bar */}
                                                <div className="w-full h-10 bg-white border border-gray-200 rounded-xl flex items-center px-3 gap-2 shadow-sm">
                                                    <Search className="w-4 h-4 text-gray-400" />
                                                    <div className="w-24 h-2 bg-gray-100 rounded-full" />
                                                </div>

                                                {/* Hero Card */}
                                                <div className="w-full h-32 bg-[#6B9F91]/10 border border-[#6B9F91]/20 rounded-2xl p-4 flex flex-col justify-end relative overflow-hidden">
                                                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#6B9F91]/20 rounded-full" />
                                                    <div className="w-1/2 h-3 bg-white rounded-sm mb-2 relative z-10" />
                                                    <div className="w-3/4 h-5 bg-[#6B9F91] rounded-md relative z-10" />
                                                </div>

                                                {/* List Items */}
                                                <div className="w-full h-16 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center p-3 gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center"><Heart className="w-4 h-4 text-red-400" /></div>
                                                    <div className="flex flex-col flex-1 gap-1.5"><div className="w-1/2 h-2 bg-gray-200 rounded-full" /><div className="w-1/3 h-2 bg-gray-100 rounded-full" /></div>
                                                    <div className="w-8 h-4 bg-gray-200 rounded-full flex items-center px-0.5"><div className="w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                                                </div>

                                                <div className="w-full h-16 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center p-3 gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><LayoutTemplate className="w-4 h-4 text-blue-400" /></div>
                                                    <div className="flex flex-col flex-1 gap-1.5"><div className="w-1/2 h-2 bg-gray-200 rounded-full" /><div className="w-1/3 h-2 bg-gray-100 rounded-full" /></div>
                                                    <div className="w-8 h-4 bg-[#6B9F91] rounded-full flex items-center justify-end px-0.5"><div className="w-3 h-3 bg-white rounded-full shadow-sm" /></div>
                                                </div>
                                            </div>

                                            {/* FAB */}
                                            <div className="absolute bottom-20 right-4 w-12 h-12 bg-[#111827] rounded-full shadow-lg flex items-center justify-center z-30">
                                                <Plus className="w-6 h-6 text-white" />
                                            </div>

                                            {/* Bottom Navigation */}
                                            <div className="h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 relative z-30">
                                                <div className="flex flex-col items-center gap-1 text-[#6B9F91]"><Home className="w-5 h-5" /><div className="w-1 h-1 rounded-full bg-[#6B9F91]" /></div>
                                                <div className="flex flex-col items-center gap-1 text-gray-400"><Compass className="w-5 h-5" /></div>
                                                <div className="flex flex-col items-center gap-1 text-gray-400"><User className="w-5 h-5" /></div>
                                            </div>
                                        </div>

                                        <div className="relative w-48 h-[380px] bg-white rounded-[2rem] shadow-xl border-[6px] border-gray-900 overflow-hidden hidden md:flex flex-col opacity-50 scale-90 -translate-x-8">
                                            <div className="h-6 w-full bg-gray-900 rounded-b-xl flex items-center justify-center shrink-0"><div className="w-10 h-1 bg-gray-700 rounded-full" /></div>
                                            <div className="flex-1 p-4 flex flex-col gap-3"><div className="w-full h-1/3 bg-[#6B9F91]/20 rounded-xl" /><div className="w-full flex-1 bg-gray-50 rounded-xl" /></div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* AI SOLUTIONS PREVIEW */}
                                {activeId === "ai" && (
                                    <motion.div
                                        key="ai"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="relative z-10 w-full h-full flex flex-col items-center justify-center"
                                    >
                                        <div className="w-[85%] max-w-[400px] bg-white rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden flex flex-col">
                                            <div className="bg-gray-900 p-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#FFC900]/20 flex items-center justify-center text-[#FFC900]">
                                                    <Bot className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">Enterprise AI Assistant</div>
                                                    <div className="text-green-400 text-xs flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online</div>
                                                </div>
                                            </div>
                                            <div className="p-4 flex flex-col gap-4 bg-gray-50 h-[300px]">
                                                <div className="self-end max-w-[80%] bg-[#6B9F91] text-white p-3 rounded-2xl rounded-tr-sm text-xs">
                                                    Analyze Q3 revenue trends relative to marketing spend.
                                                </div>
                                                <div className="self-start max-w-[90%] bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-sm text-xs shadow-sm space-y-2">
                                                    <p className="text-gray-600">Processing real-time operational data...</p>
                                                    <div className="w-full h-20 bg-gray-50 border border-gray-100 rounded flex items-end p-2 gap-1 mt-2">
                                                        {[30, 45, 60, 40, 80, 100].map((h, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ height: "0%" }}
                                                                animate={{ height: `${h}%` }}
                                                                transition={{ delay: i * 0.1 }}
                                                                className="flex-1 bg-[#FFC900]/80 rounded-t-sm" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                                                <div className="flex-1 h-10 bg-gray-50 rounded-full border border-gray-200 px-4 flex items-center">
                                                    <div className="w-1/2 h-2 bg-gray-200 rounded-full" />
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-[#6B9F91] flex items-center justify-center text-white"><Sparkles className="w-4 h-4" /></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* CLOUD PLATFORMS PREVIEW */}
                                {activeId === "cloud" && (
                                    <motion.div
                                        key="cloud"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-8"
                                    >
                                        <div className="w-full max-w-[450px] flex justify-between items-center relative">
                                            {/* Lines */}
                                            <svg className="absolute inset-0 w-full h-full pointer-events-none -translate-z-10 z-0 text-[#6B9F91]">
                                                <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                                <line x1="80%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                                <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                            </svg>

                                            {/* Animated Data Packets */}
                                            <motion.div className="absolute top-1/2 left-[30%] w-2 h-2 bg-[#6B9F91] rounded-full z-10 -translate-y-1/2" animate={{ x: [0, 80] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                                            <motion.div className="absolute top-1/2 right-[30%] w-2 h-2 bg-[#6B9F91] rounded-full z-10 -translate-y-1/2" animate={{ x: [0, -80] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.7 }} />

                                            <div className="relative z-10 flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-xl shadow-lg flex items-center justify-center text-gray-500 relative">
                                                    <Database className="w-8 h-8" />
                                                    <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-600 rounded-full p-1 border border-blue-200 shadow-sm"><HardDrive className="w-3 h-3" /></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">us-east-1</span>
                                            </div>

                                            <div className="relative z-10 w-28 h-28 bg-[#6B9F91]/10 border-2 border-[#6B9F91] rounded-full shadow-[0_0_40px_rgba(107,159,145,0.3)] flex items-center justify-center text-[#6B9F91]">
                                                <Cloud className="w-12 h-12 fill-current" />
                                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-dashed border-[#6B9F91]/50" />
                                            </div>

                                            <div className="relative z-10 flex flex-col items-center gap-2">
                                                <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-xl shadow-lg flex items-center justify-center text-gray-500 relative">
                                                    <TerminalSquare className="w-8 h-8" />
                                                    <div className="absolute -bottom-2 -left-2 bg-yellow-100 text-yellow-600 rounded-full p-1 border border-yellow-200 shadow-sm"><ArrowRightLeft className="w-3 h-3" /></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">API Gateway</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 z-20">
                                            <div className="px-4 py-2 bg-white shadow-md border border-gray-200 rounded-full text-xs font-bold font-mono text-green-600 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Auto-scaling Active
                                            </div>
                                            <div className="px-4 py-2 bg-white shadow-md border border-gray-200 rounded-full text-xs font-bold font-mono text-[#6B9F91] flex items-center gap-2">
                                                <CloudUpload className="w-4 h-4" /> 99.99% Uptime
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* BUSINESS AUTOMATION PREVIEW */}
                                {activeId === "automation" && (
                                    <motion.div
                                        key="automation"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className="relative z-10 w-full h-full flex flex-col justify-center gap-6"
                                    >
                                        <div className="flex flex-col gap-6 max-w-[400px] mx-auto w-full relative">
                                            {/* Connection Line */}
                                            <div className="absolute top-8 bottom-8 left-8 w-1 bg-[#6B9F91]/20 -z-10" />

                                            <div className="flex items-center gap-6 relative group">
                                                <div className="w-16 h-16 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center z-10 text-gray-500 relative">
                                                    <Globe className="w-6 h-6" />
                                                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5"><Zap className="w-3 h-3" /></div>
                                                </div>
                                                <div className="flex-1 h-14 bg-white shadow-sm border border-gray-200 rounded-xl px-4 flex justify-between items-center transition-all duration-300 hover:border-[#6B9F91]/30 hover:shadow-md cursor-pointer">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trigger</span>
                                                        <span className="text-xs font-bold text-gray-700">Webhook Received</span>
                                                    </div>
                                                    <div className="text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full">Success</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 relative">
                                                <div className="w-16 h-16 rounded-full bg-[#6B9F91] shadow-lg shadow-[#6B9F91]/30 flex items-center justify-center z-10 text-white relative overflow-hidden">
                                                    <Workflow className="w-6 h-6 relative z-10" />
                                                    <motion.div className="absolute inset-x-0 bottom-0 bg-white/20" initial={{ height: "0%" }} animate={{ height: "100%" }} transition={{ duration: 2, repeat: Infinity }} />
                                                </div>
                                                <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 justify-center relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#6B9F91]/10 rounded-bl-full" />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Processing</span>
                                                        <div className="w-2 h-2 rounded-full bg-[#6B9F91] animate-pulse" />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="w-1/2 h-2 bg-green-400 rounded-full" />
                                                        <div className="w-3/4 h-2 bg-gray-700 rounded-full" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 relative group">
                                                <div className="w-16 h-16 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center z-10 text-gray-500 relative">
                                                    <Database className="w-6 h-6" />
                                                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5"><CheckCircle2 className="w-3 h-3" /></div>
                                                </div>
                                                <div className="flex-1 h-16 bg-white shadow-sm border border-gray-200 rounded-xl px-4 flex justify-between items-center transition-all duration-300 hover:border-[#6B9F91]/30 hover:shadow-md cursor-pointer">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</span>
                                                        <div className="flex gap-2">
                                                            <span className="text-xs font-bold text-gray-700">Sync to CRM</span>
                                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full self-center" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Mobile CTA */}
                <div className="pt-4 lg:hidden w-full flex justify-center">
                    <Button asChild size="lg" className="w-full bg-[#6B9F91] hover:bg-[#588478] text-white shadow-lg shadow-[#6B9F91]/20">
                        <Link href="/contact">
                            Start Your Project
                        </Link>
                    </Button>
                </div>

            </Container>
        </SectionWrapper>
    );
}
