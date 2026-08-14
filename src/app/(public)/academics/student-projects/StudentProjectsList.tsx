"use client";

import React, { useState } from "react";
import { ArrowRight, Lightbulb, Blocks, Target, Box, Sparkles, Sprout, HeartPulse, Building2, Monitor, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { StudentProjectModal } from "@/components/academics/BestProjects";

// Animation Variants matching BestProjects
const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

const IconMap: Record<string, React.ElementType> = {
    Building2,
    Sparkles,
    Lightbulb,
    Target,
    HeartPulse,
    Sprout,
    Blocks,
    Monitor,
    LayoutDashboard,
    Box
};

function getIcon(name: string): React.ElementType {
    return IconMap[name] || Box;
}

function ProjectPreviewPlaceholder() {
    return (
        <div className="w-full h-full flex flex-col bg-[#EDF5F2] group-hover:bg-white transition-colors duration-500">
            {/* Browser Header */}
            <div className="h-8 bg-white border-b border-gray-100 flex items-center px-4 gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <div className="mx-auto w-1/3 h-3 bg-gray-50 rounded-full border border-gray-100" />
            </div>

            {/* Inner Content */}
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center border-t-2 border-[#6B9F91]/20">
                <div className="w-16 h-16 bg-[#6B9F91]/10 rounded-2xl flex items-center justify-center mb-4 text-[#6B9F91]">
                    <LayoutDashboard className="w-8 h-8" />
                </div>
                <h5 className="font-bold text-gray-900 text-sm md:text-base mb-1">Student Project Preview</h5>
                <p className="text-[10px] md:text-xs text-gray-500 font-medium max-w-[80%] leading-relaxed">
                    Actual student project screenshots will appear here.
                </p>
            </div>
        </div>
    );
}

export function StudentProjectsList({ initialProjects }: { initialProjects: any[] }) {
    const [activeModalProject, setActiveModalProject] = useState<any | null>(null);

    return (
        <div className="w-full">
            {/* Grid Area */}
            {initialProjects.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                        <Blocks className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Found</h3>
                    <p className="text-gray-500">There are no student projects available at this time.</p>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {initialProjects.map((project: any) => (
                        <motion.div
                            key={project.id}
                            variants={itemVariants}
                            role="button"
                            tabIndex={0}
                            onClick={() => setActiveModalProject(project)}
                            onKeyDown={(e: React.KeyboardEvent) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setActiveModalProject(project);
                                }
                            }}
                            className="bg-white rounded-3xl shadow-lg shadow-gray-200/40 border border-gray-100 overflow-hidden flex-col group cursor-pointer hover:-translate-y-1 transition-transform duration-300 flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2"
                        >
                            {/* Image / Placeholder */}
                            <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-50 border-b border-gray-100">
                                {project.image || project.imageUrl ? (
                                    <Image
                                        src={project.image || project.imageUrl}
                                        alt={project.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                ) : (
                                    <ProjectPreviewPlaceholder />
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <h4 className="text-lg font-bold text-gray-900 mb-1 leading-tight group-hover:text-[#6B9F91] transition-colors">{project.title}</h4>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{project.category}</span>
                                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-5 flex-grow">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {Array.isArray(project.tags) ? project.tags.map((tag: any, i: number) => {
                                        const TagIcon = getIcon(tag.icon);
                                        return (
                                            <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-transparent ${tag.colorClass}`}>
                                                <TagIcon className="w-3 h-3" /> {tag.label}
                                            </span>
                                        );
                                    }) : typeof project.tags === 'string' ? (() => {
                                        try {
                                            const tags = JSON.parse(project.tags);
                                            if (Array.isArray(tags)) {
                                                return tags.map((tag: any, i: number) => {
                                                    const TagIcon = getIcon(tag.icon);
                                                    return (
                                                        <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-transparent ${tag.colorClass}`}>
                                                            <TagIcon className="w-3 h-3" /> {tag.label}
                                                        </span>
                                                    );
                                                });
                                            }
                                        } catch { return null; }
                                    })() : null}
                                </div>

                                <div className="mt-auto border-t border-gray-100 pt-4 flex items-center text-[#6B9F91] font-bold text-sm group-hover:text-[#5C8C80]">
                                    View Details <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Read Details Modal overlay */}
            <AnimatePresence>
                {activeModalProject && (
                    <StudentProjectModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}
