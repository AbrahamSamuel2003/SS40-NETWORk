"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2, Network, Library, GraduationCap, Briefcase,
    Rocket, Presentation, Users, Lightbulb, ArrowRight, BookOpen, Target
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

// --- Data ---
const NETWORK_NODES = [
    { id: "uni", label: "Universities", tooltip: "Global academic partnerships", icon: Library, x: -140, y: -60 },
    { id: "col", label: "Colleges", tooltip: "Regional college collaborations", icon: GraduationCap, x: 140, y: -60 },
    { id: "part", label: "Academic Partners", tooltip: "Curriculum co-creation", icon: Network, x: -100, y: 100 },
    { id: "train", label: "Training Institutions", tooltip: "Vocational & technical training", icon: BookOpen, x: 100, y: 100 },
    { id: "res", label: "Research Partners", tooltip: "Innovation & R&D", icon: Target, x: 0, y: -130 },
];

const INSTITUTIONS = [
    { name: "Tech Institute of Excellence", type: "Academic Partner", logo: null },
    { name: "Global Management College", type: "University MoU", logo: null },
    { name: "Pioneer Engineering Academy", type: "Training Partner", logo: null },
    { name: "Future Innovators University", type: "Research Collaborator", logo: null },
    { name: "Apex Sciences Institute", type: "Academic Partner", logo: null },
];

const BENEFITS = [
    { title: "Industry Projects", description: "Students solve real business challenges.", icon: Rocket },
    { title: "Workshops", description: "Interactive technical training sessions.", icon: Presentation },
    { title: "Guest Lectures", description: "Insights from active industry experts.", icon: Building2 },
    { title: "Internship Opportunities", description: "Direct pathways to professional roles.", icon: Briefcase },
    { title: "Faculty Collaboration", description: "Empowering educators with modern tech.", icon: Users },
    { title: "Placement Support", description: "Strategic hiring and recruitment pipelines.", icon: Lightbulb },
];

export function Collaborations() {
    const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

    // Provide a continuous array for infinite scrolling
    const marqueeItems = [...INSTITUTIONS, ...INSTITUTIONS];

    return (
        <SectionWrapper id="collaborations" className="bg-white relative overflow-hidden pb-8 md:pb-12">

            {/* Ambient background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[#6B9F91]/5 blur-[100px] rounded-full mix-blend-multiply" />
                <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-[#FFC900]/5 blur-[80px] rounded-full mix-blend-multiply" />
            </div>

            <Container className="relative z-10 flex flex-col items-center">

                {/* SECTION HEADER */}
                <span className="inline-block px-3 py-1 rounded-full bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-widest mb-4">
                    UNIVERSITIES & COLLEGE COLLABORATIONS
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-4 text-center max-w-3xl leading-tight">
                    Building Strong Academic <span className="text-[#6B9F91]">Partnerships.</span>
                </h2>
                <p className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto text-center leading-relaxed mb-10">
                    Collaborating with educational institutions to create practical learning experiences, industry exposure, and career opportunities.
                </p>

                {/* 1. PARTNERSHIP NETWORK */}
                <div className="w-full max-w-3xl mx-auto h-[380px] md:h-[400px] relative flex items-center justify-center mb-8 isolate">

                    {/* SVG Connecting Lines */}
                    <svg className="absolute inset-0 w-full h-full -z-10" viewBox="-200 -200 400 400">
                        {NETWORK_NODES.map((node) => {
                            const isHovered = hoveredNode === node.id;
                            const isFaded = hoveredNode && !isHovered;

                            return (
                                <g key={`line-${node.id}`}>
                                    <line
                                        x1="0" y1="0" x2={node.x} y2={node.y}
                                        stroke="#6B9F91"
                                        strokeWidth="1.5"
                                        strokeDasharray="4 4"
                                        className={`transition-opacity duration-300 ${isFaded ? 'opacity-10' : 'opacity-30'}`}
                                    />
                                    {isHovered && (
                                        <motion.line
                                            x1="0" y1="0" x2={node.x} y2={node.y}
                                            stroke="#6B9F91"
                                            strokeWidth="2.5"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="opacity-80"
                                        />
                                    )}
                                </g>
                            )
                        })}
                    </svg>

                    {/* Central Node */}
                    <div className="relative z-20 flex flex-col items-center justify-center w-36 h-36 md:w-44 md:h-44 bg-white rounded-full shadow-[0_15px_50px_rgba(107,159,145,0.15)] border-4 border-[#EDF5F2]">
                        <div className="absolute inset-0 bg-[#6B9F91]/5 rounded-full animate-pulse -z-10" />
                        <Network className="w-8 h-8 text-[#6B9F91] mb-2" />
                        <span className="font-extrabold text-[#111827] text-xs md:text-sm tracking-wider text-center">SS40<br />ACADEMICS</span>
                    </div>

                    {/* Outer Nodes */}
                    {NETWORK_NODES.map((node) => {
                        const Icon = node.icon;
                        const isHovered = hoveredNode === node.id;
                        const isFaded = hoveredNode && !isHovered;

                        return (
                            <div
                                key={node.id}
                                className="absolute z-30"
                                style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                            >
                                <motion.div
                                    className={`relative flex flex-col items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-xl cursor-default transition-all duration-300 border-2
                                        ${isHovered ? 'border-[#6B9F91] shadow-[#6B9F91]/20 scale-110 z-40' : 'border-gray-50 scale-100 z-30'}
                                        ${isFaded ? 'opacity-40 grayscale blur-[1px]' : 'opacity-100'}
                                    `}
                                >
                                    <Icon className={`w-5 h-5 mb-1.5 transition-colors ${isHovered ? 'text-[#6B9F91]' : 'text-gray-400'}`} />
                                    <span className={`text-[9px] md:text-[10px] font-bold text-center leading-tight px-2 ${isHovered ? 'text-[#111827]' : 'text-gray-500'}`}>
                                        {node.label}
                                    </span>

                                    {/* Tooltip */}
                                    <AnimatePresence>
                                        {isHovered && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                                className="absolute -bottom-10 whitespace-nowrap bg-[#111827] text-white text-[10px] font-medium px-3 py-1.5 rounded-lg shadow-lg pointer-events-none"
                                            >
                                                {node.tooltip}
                                                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111827] transform rotate-45" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>

                {/* 2. INSTITUTION SHOWCASE (MARQUEE) */}
                <div className="w-full relative py-2 mb-16 md:mb-24">
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 hidden md:block" />
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 hidden md:block" />

                    <div className="flex overflow-hidden group">
                        <div className="flex animate-[scroll-left_40s_linear_infinite] group-hover:animate-play-state-paused gap-6 pr-6 w-max">
                            {marqueeItems.map((inst, idx) => (
                                <div
                                    key={`inst-${idx}`}
                                    className="w-[280px] md:w-[320px] bg-[#EDF5F2] rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 shrink-0 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50"
                                >
                                    {/* Logo Placeholder */}
                                    <div className="w-14 h-14 bg-white rounded-xl shadow-inner border border-gray-100 flex items-center justify-center shrink-0">
                                        {inst.logo ? (
                                            <Image src={inst.logo} alt={inst.name} width={40} height={40} className="object-contain" />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-gray-300" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-extrabold text-[#111827] leading-tight mb-1">{inst.name}</h4>
                                        <p className="text-[11px] font-bold text-[#6B9F91] uppercase tracking-wider">{inst.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. PARTNERSHIP BENEFITS */}
                <div className="w-full max-w-6xl mx-auto mb-4 md:mb-8">

                    <SectionHeading
                        badge="COLLABORATION BENEFITS"
                        title={<>How We Bring <span className="text-[#6B9F91]">Value.</span></>}
                        description="We provide tangible, career-defining support that directly impacts your students and strengthens your institution's industry presence."
                        align="center"
                        className="mb-12 lg:mb-16"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {BENEFITS.map((benefit, idx) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ margin: "-50px", once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    className="p-6 md:p-8 bg-[#EDF5F2] rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-[#6B9F91]/5 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-5 group-hover:bg-[#6B9F91]/10 group-hover:border-[#6B9F91]/20 transition-colors">
                                        <Icon className="w-6 h-6 text-[#6B9F91]" />
                                    </div>
                                    <h4 className="text-lg font-bold text-[#111827] mb-2">{benefit.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>



            </Container>

            {/* Inline styles for marquee (can optionally go to global CSS) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-50% - 12px)); } /* accounting for gap */
                }
            `}} />
        </SectionWrapper>
    );
}
