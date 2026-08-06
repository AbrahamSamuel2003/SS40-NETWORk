"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Building,
    Landmark,
    Globe2,
    Eye,
    Target,
    Heart,
    ShieldCheck,
    CheckCircle2,
    Lock,
    Cpu,
    Box,
    GraduationCap
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { hoverLift, staggerContainer, fadeIn, slideUp } from "@/lib/animations";

const HIGHLIGHTS = [
    { icon: <Calendar className="w-5 h-5" />, label: "Founded", value: "2023" },
    { icon: <Building className="w-5 h-5" />, label: "Enterprise", value: "Ready" },
    { icon: <Landmark className="w-5 h-5" />, label: "MCA", value: "Registered" },
    { icon: <Globe2 className="w-5 h-5" />, label: "Serving", value: "India" },
];


const TRUST_FEATURES = [
    {
        title: "Fixed-Scope Projects",
        description: "No surprise billing.",
        icon: <CheckCircle2 className="w-5 h-5" />
    },
    {
        title: "30-Day Support",
        description: "Post-launch support included.",
        icon: <ShieldCheck className="w-5 h-5" />
    },
    {
        title: "Enterprise Security",
        description: "Built with secure and scalable practices.",
        icon: <Lock className="w-5 h-5" />
    },
];

const AboutIllustration = () => (
    <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center pointer-events-none">
        {/* Center Glow */}
        <div className="absolute w-[200px] h-[200px] bg-[var(--color-primary)]/20 blur-3xl rounded-full" />

        {/* Core Orbit Ring */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute inset-4 border border-dashed border-[var(--color-primary)]/40 rounded-full"
        />
        <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
            className="absolute inset-10 border border-solid border-gray-200 rounded-full"
        />

        {/* Product: Central Glass Cube */}
        <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute w-28 h-28 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-[var(--color-primary)]/10 border border-[var(--color-border)] flex items-center justify-center z-10"
        >
            <Box className="w-12 h-12 text-[var(--color-primary)]" />
        </motion.div>

        {/* Education: Top Right Floating Element */}
        <motion.div
            animate={{ y: [8, -8, 8], x: [4, -4, 4] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute top-4 right-4 sm:right-8 w-16 h-16 bg-[var(--color-accent)]/10 backdrop-blur-md rounded-full shadow-lg border border-[var(--color-accent)]/20 flex items-center justify-center z-20"
        >
            <GraduationCap className="w-6 h-6 text-[var(--color-accent)]" />
        </motion.div>

        {/* Tech: Bottom Left Floating Element */}
        <motion.div
            animate={{ y: [-6, 12, -6], x: [-8, 4, -8] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute bottom-6 left-6 sm:left-10 w-16 h-16 bg-teal-500/10 backdrop-blur-md rounded-xl shadow-lg border border-teal-500/20 flex items-center justify-center z-20 rotate-12"
        >
            <Cpu className="w-6 h-6 text-teal-600" />
        </motion.div>
    </div>
);

export function About() {
    return (
        <SectionWrapper id="about" className="bg-[#EDF5F2]">
            <Container className="space-y-12 lg:space-y-16">

                {/* 1. Section Header & Abstract Graphic */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                    <div className="w-full lg:w-1/2">
                        <SectionHeading
                            align="left"
                            badge="About SS40 NETWORK"
                            title="Built in India. Thinking Globally."
                            description="Founded in 2023, we are an enterprise-ready technology company empowering modern businesses through elite digital solutions."
                        />
                    </div>

                    <div className="hidden lg:flex w-full lg:w-1/2 justify-end relative">
                        <AboutIllustration />
                    </div>
                </div>

                {/* 2. Company Highlights */}
                <div className="relative w-full">

                    {/* Mobile Watermark Illustration: complete composition scaled and rendered behind the cards */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center lg:hidden opacity-[0.06] overflow-visible pointer-events-none">
                        <div className="scale-75 sm:scale-100 flex items-center justify-center">
                            <AboutIllustration />
                        </div>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
                    >
                        {HIGHLIGHTS.map((item, i) => (
                            <CardMotion
                                key={i}
                                variants={slideUp}
                                whileHover="hover"
                                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4"
                                {...hoverLift}
                            >
                                <div className="w-12 h-12 shrink-0 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-body-text)]">{item.label}</p>
                                    <p className="text-xl font-bold text-[var(--color-heading)]">{item.value}</p>
                                </div>
                            </CardMotion>
                        ))}
                    </motion.div>
                </div>

                {/* 3. Vision, Mission & Culture */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Vision */}
                    <CardMotion variants={slideUp} className="flex flex-col gap-4 items-start relative overflow-hidden">
                        <h3 className="text-card-title flex items-center gap-2">
                            <Eye className="w-5 h-5 text-[var(--color-primary)]" /> Vision
                        </h3>
                        <p className="text-[var(--color-body-text)] flex-1 text-lg leading-relaxed relative z-10">
                            Most trusted digital partner in South India.
                        </p>
                    </CardMotion>

                    {/* Mission */}
                    <CardMotion variants={slideUp} className="flex flex-col gap-4 items-start relative overflow-hidden">
                        <h3 className="text-card-title flex items-center gap-2">
                            <Target className="w-5 h-5 text-[var(--color-primary)]" /> Mission
                        </h3>
                        <p className="text-[var(--color-body-text)] flex-1 text-lg leading-relaxed relative z-10">
                            Ship quality products. Empower growth.
                        </p>
                    </CardMotion>

                    {/* Culture */}
                    <CardMotion variants={slideUp} className="flex flex-col gap-4 items-start relative overflow-hidden">
                        <h3 className="text-card-title flex items-center gap-2">
                            <Heart className="w-5 h-5 text-[var(--color-primary)]" /> Culture
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2 relative z-10">
                            <span className="px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary-hover)] rounded-full text-sm font-semibold tracking-wide">Integrity</span>
                            <span className="px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary-hover)] rounded-full text-sm font-semibold tracking-wide">Curiosity</span>
                            <span className="px-3 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary-hover)] rounded-full text-sm font-semibold tracking-wide">Partnership</span>
                        </div>
                    </CardMotion>
                </motion.div>


                {/* 5. Trust Highlights */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {TRUST_FEATURES.map((feat, i) => (
                        <FeatureCard
                            key={i}
                            title={feat.title}
                            description={feat.description}
                            icon={feat.icon}
                        />
                    ))}
                </motion.div>

            </Container>
        </SectionWrapper>
    );
}
