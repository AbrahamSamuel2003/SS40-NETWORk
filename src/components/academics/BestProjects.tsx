"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Lightbulb, Blocks, Target, Box, Sparkles, Sprout, HeartPulse, Building2, Monitor, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Stagger animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

// Premium Browser Mockup Placeholder
function ProjectPreviewPlaceholder() {
    return (
        <div className="w-full h-full flex flex-col bg-[#F2F7F5] group-hover:bg-white transition-colors duration-500">
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


// MOCK DATA structure designed to handle local image assets
const PROJECTS = [
    {
        id: "nexus",
        title: "Nexus Analytics Platform",
        category: "Data Visualization",
        badge: "Industry Project",
        description: "A comprehensive analytics dashboard designed to process and visualize real-time business metrics, helping local enterprises identify growth bottlenecks instantly.",
        image: null, // e.g: "/images/student-projects/nexus-screenshot.png"
        tags: [
            { icon: Building2, label: "Real-World Solution", colorClass: "bg-gray-50 text-gray-600 border-gray-200" },
            { icon: Sparkles, label: "Automation", colorClass: "bg-gray-50 text-gray-600 border-gray-200" },
            { icon: Lightbulb, label: "Productivity", colorClass: "bg-gray-50 text-gray-600 border-gray-200" }
        ]
    },
    {
        id: "medtrack",
        title: "MedTrack Systems",
        category: "Healthcare Mgmt",
        description: "A smart patient appointment and record management system designed for independent medical clinics.",
        image: null,
        tags: [
            { icon: HeartPulse, label: "Healthcare", colorClass: "bg-blue-50 text-blue-700 border-blue-100" },
            { icon: Target, label: "Smart System", colorClass: "bg-purple-50 text-purple-700 border-purple-100" }
        ]
    },
    {
        id: "ecoscale",
        title: "EcoScale Routing",
        category: "Logistics Tech",
        description: "An automated routing algorithm that reduces delivery fleet carbon emissions while improving daily delivery rates.",
        image: null,
        tags: [
            { icon: Sprout, label: "Sustainability", colorClass: "bg-green-50 text-green-700 border-green-100" },
            { icon: Blocks, label: "Innovation", colorClass: "bg-amber-50 text-amber-700 border-amber-100" }
        ]
    },
    {
        id: "classconnect",
        title: "ClassConnect",
        category: "EdTech Platform",
        description: "A community-driven learning management system built to assist underprivileged schools with digital material distributions.",
        image: null,
        tags: [
            { icon: Lightbulb, label: "Education", colorClass: "bg-indigo-50 text-indigo-700 border-indigo-100" },
            { icon: Sparkles, label: "Community Impact", colorClass: "bg-rose-50 text-rose-700 border-rose-100" }
        ]
    }
];

export function BestProjects() {
    const featuredProject = PROJECTS[0];
    const secondaryProjects = PROJECTS.slice(1);

    return (
        <SectionWrapper id="best-projects" className="bg-white relative overflow-hidden">

            {/* Ambient Background & Floating Geometry */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
                    style={{ backgroundImage: 'radial-gradient(#6B9F91 2px, transparent 2px)', backgroundSize: '40px 40px' }}
                />

                <motion.div
                    animate={{ rotate: -360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[15%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full"
                />

                {/* Floating Abstract Elements */}
                <motion.div
                    animate={{ y: [-15, 15, -15], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute top-[15%] right-[10%] w-24 h-24 border-4 border-[#FFC900]/20 rounded-2xl opacity-60 flex items-center justify-center p-2"
                >
                    <Box className="w-12 h-12 text-[#FFC900]/30" />
                </motion.div>

                <motion.div
                    animate={{ y: [15, -15, 15], rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                    className="absolute bottom-[25%] left-[5%] w-32 h-32 border border-[#6B9F91]/20 rounded-full opacity-60 flex items-center justify-center"
                >
                    <Target className="w-16 h-16 text-[#6B9F91]/10" />
                </motion.div>
            </div>

            <Container className="relative z-20">
                <SectionHeading
                    badge="BEST STUDENT PROJECTS"
                    title={<>Ideas Built Into <span className="text-[#6B9F91]">Reality.</span></>}
                    description="Explore innovative projects created by students through hands-on learning, mentorship, and real-world challenges."
                    align="center"
                    className="mb-16 lg:mb-20"
                />

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col gap-8 lg:gap-10"
                >
                    {/* TOP: Featured Project (Dominant) */}
                    <motion.div variants={itemVariants} className="w-full bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col lg:flex-row group">
                        {/* Project Preview */}
                        <div className="w-full lg:w-7/12 aspect-video lg:aspect-auto lg:h-[450px] relative overflow-hidden bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100">
                            {featuredProject.image ? (
                                <Image
                                    src={featuredProject.image}
                                    alt={featuredProject.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                />
                            ) : (
                                <ProjectPreviewPlaceholder />
                            )}
                        </div>

                        {/* Content */}
                        <div className="w-full lg:w-5/12 p-8 lg:p-12 flex flex-col bg-white">
                            <div className="mb-6 flex justify-between items-start gap-4">
                                {featuredProject.badge && (
                                    <Badge className="bg-[#6B9F91]/10 text-[#6B9F91] hover:bg-[#6B9F91]/20 border-none font-bold uppercase tracking-wider text-[10px]">
                                        {featuredProject.badge}
                                    </Badge>
                                )}
                                <Blocks className="w-6 h-6 text-gray-300 ml-auto" />
                            </div>

                            <h3 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{featuredProject.title}</h3>
                            <p className="text-sm font-semibold text-[#FFC900] uppercase tracking-widest mb-4">{featuredProject.category}</p>

                            <p className="text-gray-600 text-base leading-relaxed mb-8 flex-grow">
                                {featuredProject.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {featuredProject.tags.map((tag, i) => {
                                    const TagIcon = tag.icon;
                                    return (
                                        <span key={i} className={`text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap border ${tag.colorClass}`}>
                                            <TagIcon className="w-3 h-3" /> {tag.label}
                                        </span>
                                    );
                                })}
                            </div>

                            <Button className="w-full sm:w-auto bg-[#111827] text-white hover:bg-gray-800 font-bold group/btn">
                                Explore Project <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* BOTTOM: 3 Project Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {secondaryProjects.map((project, idx) => (
                            <motion.div
                                key={project.id}
                                variants={itemVariants}
                                className={`bg-white rounded-3xl shadow-lg shadow-gray-200/40 border border-gray-100 overflow-hidden flex-col group cursor-pointer hover:-translate-y-1 transition-transform duration-300 md:last:col-span-2 lg:last:col-span-1 ${idx === 2 ? 'hidden md:flex' : 'flex'}`}
                            >

                                {/* Image / Placeholder */}
                                <div className="w-full aspect-video relative overflow-hidden bg-gray-50 border-b border-gray-100">
                                    {project.image ? (
                                        <Image
                                            src={project.image}
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
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-5 flex-grow">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tags.map((tag, i) => {
                                            const TagIcon = tag.icon;
                                            return (
                                                <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-transparent ${tag.colorClass}`}>
                                                    <TagIcon className="w-3 h-3" /> {tag.label}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-auto border-t border-gray-100 pt-4 flex items-center text-[#6B9F91] font-bold text-sm group-hover:text-[#5C8C80]">
                                        View Details <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>



                </motion.div>
            </Container>
        </SectionWrapper>
    );
}
