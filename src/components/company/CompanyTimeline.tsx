"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface MilestoneItem {
    year: string;
    title: string;
    badge: string;
    summary: string;
    achievements: string[];
}

const MILESTONES: MilestoneItem[] = [
    {
        year: "2023",
        title: "Inception & Engineering Collective",
        badge: "Genesis",
        summary:
            "Founded in Tamil Nadu with an ambitious mission: to bring enterprise-grade software development, fixed-scope digital delivery, and elite practical tech education to regional talent.",
        achievements: [
            "Started hands-on engineering mentorship programs",
            "Delivered initial bespoke software prototypes",
            "Established core values: 0-latency execution & code quality",
        ],
    },
    {
        year: "2024",
        title: "Multi-Disciplinary Scale & Product R&D",
        badge: "Growth",
        summary:
            "Expanded into an end-to-end technology ecosystem spanning commercial digital solutions, proprietary SaaS products, and comprehensive academic innovation tracks.",
        achievements: [
            "Built and shipped client projects across multiple industries",
            "Accelerated 100+ student engineers with hands-on capstones",
            "Initiated research on AI-enabled workflow automations",
        ],
    },
    {
        year: "2025",
        title: "Official MCA Corporate Incorporation",
        badge: "Corporate Formalization",
        summary:
            "Formalized as SS40 NETWORK PRIVATE LIMITED under the Companies Act, 2013 on 23rd December 2025, registered with the Central Registration Centre, Ministry of Corporate Affairs.",
        achievements: [
            "Allocated Corporate Identity Number (CIN: U62013TN2025PTC187678)",
            "Established statutory corporate governance & board structure",
            "Achieved 100% regulatory and legal compliance",
        ],
    },
    {
        year: "2026",
        title: "DPIIT Startup India Recognition & Nationwide Expansion",
        badge: "National Recognition",
        summary:
            "Recognized by the Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce & Industry as an innovative technology startup (Certificate: DIPP268327).",
        achievements: [
            "Awarded 10-Year Startup India Recognition Certificate",
            "Active GST compliance across commercial software operations",
            "Scaling flagship SaaS products and institutional academic partnerships",
        ],
    },
];

interface MilestoneCardProps {
    milestone: MilestoneItem;
}

function MilestoneCard({ milestone }: MilestoneCardProps) {
    return (
        <div className="bg-[#F8FAF9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-200/80 hover:border-[#0F766E]/40 hover:bg-white hover:shadow-xl transition-all duration-300 group">
            {/* Badge Row */}
            <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#0F766E] bg-[#D8E8E2] px-2.5 py-0.5 rounded-full border border-[#2DD4BF]/40">
                    {milestone.badge}
                </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-gray-900 font-serif leading-snug group-hover:text-[#0F766E] transition-colors">
                {milestone.title}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2 sm:mt-2.5">
                {milestone.summary}
            </p>

            <div className="mt-3.5 sm:mt-4 pt-3.5 sm:pt-4 border-t border-gray-200/60 space-y-1.5">
                {milestone.achievements.map((item, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const timelineContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const timelineItemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
    },
};

export function CompanyTimeline() {
    return (
        <SectionWrapper id="timeline" className="bg-white scroll-mt-20 py-16 lg:py-24 border-b border-gray-200/80 relative overflow-hidden font-crimson font-serif">
            {/* Subtle Ambient Background Grid */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-25">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(rgba(15,118,110,0.12) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                    }}
                />
            </div>

            <Container className="relative z-10 space-y-12">
                {/* Section Heading */}
                <SectionHeading
                    badge="OUR JOURNEY & EVOLUTION"
                    title={
                        <>
                            The Story of <span className="text-[#0F766E]">SS40 NETWORK.</span>
                        </>
                    }
                    description="From an ambitious regional engineering initiative to a Government of India recognized technology enterprise."
                    align="center"
                />

                {/* Timeline Grid with Scroll Reveal Transitions */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Left Track Line (Mobile - Continuous Solid Teal Spine) */}
                    <div
                        aria-hidden="true"
                        className="md:hidden absolute top-6 bottom-16 w-[2px] bg-[#0F766E] z-0 pointer-events-none"
                        style={{
                            left: "22px",
                            transform: "translateX(-50%)",
                            backgroundColor: "#0F766E",
                            width: "2px",
                        }}
                    />

                    {/* Vertical Center Track Line (Desktop - Strong Solid Teal) */}
                    <div
                        aria-hidden="true"
                        className="hidden md:block absolute top-8 bottom-8 w-[2px] bg-[#0F766E] z-0 pointer-events-none"
                        style={{
                            left: "50%",
                            transform: "translateX(-50%)",
                            backgroundColor: "#0F766E",
                            width: "2px",
                        }}
                    />

                    <motion.div
                        variants={timelineContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        className="space-y-6 sm:space-y-8 md:space-y-12"
                    >
                        {MILESTONES.map((milestone, idx) => {
                            // Desktop zig-zag layout: 2023, 2025 on Right; 2024, 2026 on Left
                            const isRightOnDesktop = idx % 2 === 0;

                            return (
                                <motion.div
                                    key={milestone.year}
                                    variants={timelineItemVariants}
                                    className="relative flex flex-row items-center md:grid md:grid-cols-2 md:gap-16 md:items-center gap-3 sm:gap-4 z-10"
                                >
                                    {/* Mobile Left Column: Year Badge Node (Centered in Middle of the Card) */}
                                    <div className="flex md:hidden shrink-0 w-11 justify-center items-center z-10">
                                        <div className="w-11 h-11 rounded-xl bg-white border-2 border-[#0F766E] shadow-sm flex items-center justify-center text-[#0F766E] font-bold text-xs font-mono shrink-0">
                                            <span>{milestone.year}</span>
                                        </div>
                                    </div>

                                    {/* Desktop Center Year Badge Node (Exact Center of Container) */}
                                    <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-white border-2 border-[#0F766E] shadow-md items-center justify-center text-[#0F766E] font-bold text-xs z-20 font-mono">
                                        <span>{milestone.year}</span>
                                    </div>

                                    {/* Desktop Left Column Slot (For 2024, 2026 on desktop) */}
                                    <div className="hidden md:block">
                                        {!isRightOnDesktop ? (
                                            <MilestoneCard milestone={milestone} />
                                        ) : (
                                            <div aria-hidden="true" />
                                        )}
                                    </div>

                                    {/* Desktop Right Column Slot (For 2023, 2025 on desktop) & Mobile Main Card */}
                                    <div className={cn("flex-1 min-w-0 md:block", !isRightOnDesktop && "md:hidden")}>
                                        <MilestoneCard milestone={milestone} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </Container>
        </SectionWrapper>
    );
}
