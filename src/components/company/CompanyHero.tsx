"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";

export function CompanyHero() {
    return (
        <SectionWrapper className="relative bg-white pt-32 pb-14 sm:pt-36 sm:pb-16 lg:pt-40 lg:pb-20 overflow-hidden border-b border-gray-100 font-crimson font-serif">
            {/* Subtle Corporate Grid Background */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-30">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(rgba(15,118,110,0.08) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                    }}
                />
            </div>

            <Container className="relative z-10">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto text-center space-y-6"
                >
                    {/* Official Corporate Eyebrow Badge (Matching Home 'A LITTLE BIT MORE' Theme) */}
                    <motion.div
                        variants={fadeIn}
                        className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-widest bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 text-[#0F766E] shadow-2xs font-crimson"
                    >
                        <span>Corporate Governance</span>
                    </motion.div>

                    {/* Main Title (Standardized text-[clamp(40px,5vw,56px)] matching Digital Solutions) */}
                    <motion.h1
                        variants={slideUp}
                        className="text-[clamp(40px,5vw,56px)] font-bold tracking-tight text-[var(--color-heading)] font-serif leading-[1.1]"
                    >
                        Official{" "}
                        <span className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#115E59] bg-clip-text text-transparent">
                            Certifications & Credentials.
                        </span>
                    </motion.h1>

                    {/* Subtitle (Standardized text-lg md:text-xl matching Digital Solutions) */}
                    <motion.p
                        variants={slideUp}
                        className="text-lg md:text-xl text-[var(--color-body-text)] leading-relaxed max-w-2xl mx-auto"
                    >
                        <strong className="text-gray-900 font-semibold">SS40 NETWORK PRIVATE LIMITED</strong> is a Government of India recognized technology company operating across enterprise software engineering, intelligent SaaS products, and elite engineering talent acceleration.
                    </motion.p>
                </motion.div>
            </Container>
        </SectionWrapper>
    );
}
