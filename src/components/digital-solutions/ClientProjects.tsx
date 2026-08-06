"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { slideUp, staggerContainer, hoverLift } from "@/lib/animations";

// Mock Data Structure matching user constraints
const FEATURED_PROJECT = {
    id: "featured-1",
    title: "Global Supply Chain Operations Platform",
    industry: "Logistics",
    description: "An end-to-end enterprise platform streamlining international freight tracking, warehouse distribution, and automated billing workflows into a single interface.",
    tags: ["Enterprise Platform", "Business Automation", "Analytics"],
    status: "Live Production",
    isConfidential: false,
};

const ADDITIONAL_PROJECTS = [
    {
        id: "proj-1",
        title: "Secure Payment Gateway Engine",
        industry: "Finance",
        description: "A high-frequency transaction processing system engineered for zero-latency financial operations and strict regulatory compliance.",
        tags: ["Cloud Platform", "Digital Transformation"],
        status: "Completed",
        isConfidential: true,
    },
    {
        id: "proj-2",
        title: "Patient Care Telemetry Portal",
        industry: "Healthcare",
        description: "A secure digital interface allowing medical providers to monitor real-time patient analytics and treatment protocols.",
        tags: ["Customer Portal", "AI Enabled"],
        status: "Live Production",
        isConfidential: false,
    },
    {
        id: "proj-3",
        title: "Automated Inventory Routing",
        industry: "Retail e-Commerce",
        description: "An intelligent routing engine that optimizes warehouse allocation based on predictive consumer demand modeling.",
        tags: ["Workflow Solution", "Business Automation"],
        status: "Live Production",
        isConfidential: false,
    }
];

export function ClientProjects() {
    return (
        <SectionWrapper id="featured-projects" className="bg-[#EDF5F2]">
            <Container className="space-y-12 lg:space-y-16">

                {/* Section Header */}
                <SectionHeading
                    badge="Client Projects"
                    title="Solutions That Drive Business Growth"
                    description="Explore a selection of digital solutions developed to solve real business challenges across different industries."
                />

                <div className="flex flex-col gap-8 lg:gap-12">

                    {/* Featured Project */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={slideUp}
                        className="w-full bg-white border border-[var(--color-border)] rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/50 flex flex-col lg:flex-row group"
                    >
                        {/* Featured Visual Placeholder */}
                        <div className="w-full lg:w-3/5 aspect-video lg:aspect-auto bg-gray-100 relative overflow-hidden flex items-center justify-center shrink-0 min-h-[300px]">
                            {/* Abstract Dashboard Wireframe representing the placeholder */}
                            <div className="absolute inset-0 bg-[#6B9F91]/5 flex flex-col p-6 lg:p-10 gap-4 group-hover:scale-105 transition-transform duration-700 ease-out">
                                <div className="w-full flex justify-between items-center bg-white/80 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#6B9F91]/20" />
                                        <div className="w-32 h-3 bg-gray-200 rounded-full" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                                    </div>
                                </div>
                                <div className="flex gap-4 flex-1">
                                    <div className="w-1/4 h-full bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
                                        <div className="w-full h-8 bg-gray-100 rounded-md" />
                                        <div className="w-2/3 h-8 bg-gray-100 rounded-md" />
                                    </div>
                                    <div className="flex-1 h-full bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm p-4 grid grid-cols-2 gap-4">
                                        <div className="bg-[#6B9F91]/10 rounded-lg" />
                                        <div className="bg-gray-100 rounded-lg" />
                                        <div className="bg-gray-100 rounded-lg col-span-2" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-gray-900/10 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold text-gray-800 shadow-xl flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-gray-500" />
                                    Project Visual Preview
                                </div>
                            </div>
                        </div>

                        {/* Featured Content Area */}
                        <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-white relative z-10 border-l border-gray-100">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap">
                                    {FEATURED_PROJECT.industry}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {FEATURED_PROJECT.status}
                                </div>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)] mb-4 leading-tight">
                                {FEATURED_PROJECT.title}
                            </h3>

                            <p className="text-[var(--color-body-text)] mb-8 leading-relaxed">
                                {FEATURED_PROJECT.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-10">
                                {FEATURED_PROJECT.tags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-[#6B9F91]/10 text-[#6B9F91] rounded-lg text-xs font-semibold">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto pt-4">
                                <Button size="lg" className="w-full sm:w-auto bg-[#6B9F91] hover:bg-[#588478] text-white shadow-lg shadow-[#6B9F91]/20">
                                    View Case Study
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Additional Projects Grid */}
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-2"
                    >
                        {ADDITIONAL_PROJECTS.map((project, idx) => (
                            <CardMotion
                                key={project.id}
                                variants={slideUp}
                                {...hoverLift}
                                className={`bg-white overflow-hidden rounded-2xl flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/30 transition-all duration-300 ${idx === 2 ? 'hidden md:flex' : 'flex'}`}
                            >
                                {/* Grid Visual Placeholder */}
                                <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center border-b border-gray-100">
                                    {project.isConfidential ? (
                                        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-center p-6 select-none opacity-80 backdrop-blur-md">
                                            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-4">
                                                <Lock className="w-8 h-8" />
                                            </div>
                                            <h4 className="font-bold text-gray-700 text-sm mb-1 uppercase tracking-wider">Confidential Project</h4>
                                            <p className="text-xs text-gray-500">Visuals protected under corporate NDA.</p>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col p-4 gap-3 bg-[#6B9F91]/5 group-hover:scale-105 transition-transform duration-500">
                                            <div className="w-full h-1/2 flex gap-3">
                                                <div className="w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm" />
                                                <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm" />
                                            </div>
                                            <div className="w-full h-1/2 bg-white border border-gray-200 rounded-lg shadow-sm" />
                                        </div>
                                    )}
                                </div>

                                {/* Grid Content Area */}
                                <div className="p-6 md:p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap">
                                            {project.industry}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-xl text-[var(--color-heading)] leading-tight mb-3">
                                        {project.title}
                                    </h3>

                                    <p className="text-[var(--color-body-text)] text-sm mb-6 flex-1">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 mb-8">
                                        {project.tags.map((tag, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-[#6B9F91]/10 text-[#6B9F91] rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button className="mt-auto flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] rounded-sm">
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </CardMotion>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom CTA Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex justify-center mt-12"
                >
                    <div className="w-full max-w-4xl bg-gray-50 border border-[var(--color-border)] rounded-3xl p-10 md:p-14 text-center relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6B9F91]/10 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFC900]/10 blur-[80px] rounded-full -translate-x-1/3 translate-y-1/3" />

                        <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)] mb-3 relative z-10 tracking-tight">
                            Have a project in mind?
                        </h3>
                        <p className="text-[var(--color-body-text)] mb-8 relative z-10 max-w-lg">
                            Let's create a digital solution tailored to your business.
                        </p>
                        <Button asChild size="lg" className="relative z-10 shadow-lg shadow-[#6B9F91]/20 bg-[#6B9F91] hover:bg-[#588478] text-white">
                            <Link href="/contact">
                                Start Your Project
                            </Link>
                        </Button>
                    </div>
                </motion.div>

            </Container>
        </SectionWrapper>
    );
}
