"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, ShieldCheck, Lock, CheckCircle2, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CardMotion } from "@/components/ui/Card";
import { hoverLift, slideUp } from "@/lib/animations";

export function ClientProjectsList({ initialProjects }: { initialProjects: any[] }) {
    const [activeModalProject, setActiveModalProject] = useState<any | null>(null);

    return (
        <div className="w-full">
            {/* Common Heading Block */}
            <div className="w-full flex justify-center mb-10 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-heading)] tracking-tight relative text-center">
                    Explore All Projects & Deployments
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#6B9F91] rounded-full"></div>
                </h2>
            </div>

            {/* Grid Area */}
            {initialProjects.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                        <Building2 className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Found</h3>
                    <p className="text-gray-500">There are no client projects available at this time.</p>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {initialProjects.map((project: any) => (
                            <CardMotion
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                {...hoverLift}
                                role="button"
                                tabIndex={0}
                                onClick={() => setActiveModalProject(project)}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter' || e.key === 'Space') {
                                        e.preventDefault();
                                        setActiveModalProject(project);
                                    }
                                }}
                                className="cursor-pointer bg-white overflow-hidden rounded-2xl flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/30 transition-all duration-300 flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2"
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
                                    ) : project.imageUrl ? (
                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <span className="px-3 py-1 bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap overflow-hidden text-ellipsis">
                                            {project.industry}
                                        </span>
                                        {project.status && (
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                                                <CheckCircle2 className="w-3 h-3" />
                                                {project.status}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-xl text-[var(--color-heading)] leading-tight mb-3">
                                        {project.title}
                                    </h3>

                                    <p className="text-[var(--color-body-text)] text-sm mb-6 flex-1 line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* Open Modal Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveModalProject(project);
                                        }}
                                        className="mt-auto flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] rounded-sm"
                                    >
                                        View Details
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </CardMotion>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* View Details Reading Modal overlay */}
            <AnimatePresence>
                {activeModalProject && (
                    <ProjectModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// MODAL COMPONENT (Reuses SuccessStories interaction pattern)
// ============================================================================

function ProjectModal({ project, onClose }: { project: any, onClose: () => void }) {
    // Lock body scroll when modal is open
    React.useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalStyle;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Parse tags safely from CMS JSON payload
    let parsedTags: string[] = [];
    try {
        if (project.tags && typeof project.tags === 'string') {
            parsedTags = JSON.parse(project.tags);
        } else if (Array.isArray(project.tags)) {
            parsedTags = project.tags as string[];
        }
    } catch {
        parsedTags = [];
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh] md:max-h-[85vh]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center transition-colors z-10 focus-visible:outline-none"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content Area */}
                <div
                    className="overflow-y-auto px-6 py-8 md:px-10 md:py-10 flex flex-col h-full [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >

                    {/* 1. Industry */}
                    <div className="flex items-center gap-2 pr-12 mb-4">
                        <span className="px-3 py-1 bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-md whitespace-nowrap">
                            {project.industry}
                        </span>
                        {project.status && (
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#6B9F91] uppercase tracking-wider whitespace-nowrap">
                                <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                {project.status}
                            </span>
                        )}
                    </div>

                    {/* 2. Project Title */}
                    <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[var(--color-heading)] leading-tight tracking-tight mb-4 pr-6">
                        {project.title}
                    </h2>

                    {/* 3. Short Description */}
                    <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed mb-6">
                        {project.description}
                    </p>

                    {/* 4. Technologies / Tags */}
                    {parsedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {parsedTags.map((tag, idx) => (
                                <span key={idx} className="px-2.5 py-1.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-semibold">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 5. Visit Live Project (Primary CTA, top level before scroll needs) */}
                    {project.projectUrl ? (
                        <div className="mb-10 shrink-0">
                            <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#6B9F91] text-white font-bold shadow-lg shadow-[#6B9F91]/20 hover:bg-[#588478] transition-all hover:scale-105 active:scale-95"
                            >
                                Visit Live Project
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                        </div>
                    ) : (
                        <div className="mb-10 shrink-0" /> // Spacer if no URL
                    )}

                    {/* 6. Case Study */}
                    {project.caseStudy && (
                        <div className="border-t border-gray-100 pt-8 mt-2 flex-grow">
                            <h3 className="text-xl font-bold text-[var(--color-heading)] mb-6">
                                Case Study Overview
                            </h3>
                            <div className="prose prose-sm md:prose-base prose-[#6B9F91] max-w-none text-[var(--color-body-text)]">
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {project.caseStudy}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
