"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Briefcase,
    MessageSquare,
    Scaling,
    Handshake,
    ArrowRight,
    Clock
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { slideUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/utils/cn";

const TRUST_INDICATORS = [
    {
        title: "Tailored Business Solutions",
        icon: Briefcase,
    },
    {
        title: "Transparent Communication",
        icon: MessageSquare,
    },
    {
        title: "Scalable Solutions",
        icon: Scaling,
    },
    {
        title: "Long-Term Partnership",
        icon: Handshake,
    },
];

export function GetQuote() {
    return (
        <SectionWrapper id="get-quote" className="relative overflow-hidden bg-white">

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                />

                {/* Radial Glows */}
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#6B9F91]/10 blur-[120px] rounded-full -translate-x-1/3 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#6B9F91]/5 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

                {/* Floating Abstract Shapes */}
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute top-10 right-20 w-32 h-32 border-4 border-[#6B9F91]/10 rounded-3xl -rotate-12 pointer-events-none hidden lg:block"
                />
                <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    className="absolute bottom-20 left-40 w-24 h-24 bg-[#FFC900]/5 rounded-full pointer-events-none hidden lg:block"
                />
            </div>

            <Container className="relative z-10 w-full mb-8 lg:mb-12">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-12">

                    {/* Left Column - Content (55%) */}
                    <div className="w-full lg:w-[55%] flex flex-col text-center lg:text-left items-center lg:items-start">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideUp}
                            className="flex flex-col items-center lg:items-start"
                        >
                            <Badge variant="primary" className="mb-6 rounded-md uppercase tracking-widest text-[10px] font-bold shadow-sm">
                                Let's Build Together
                            </Badge>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-heading)] leading-tight tracking-tight mb-6">
                                Ready to Start Your <br className="hidden md:block" />
                                <span className="text-[#6B9F91]">Next Digital Project?</span>
                            </h2>

                            <p className="text-base md:text-lg text-[var(--color-body-text)] mb-12 max-w-xl leading-relaxed">
                                Whether you're planning custom software, business automation, or enterprise solutions, our team is ready to help you turn your ideas into reality.
                            </p>
                        </motion.div>

                        {/* Trust Indicators Grid */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {TRUST_INDICATORS.map((indicator, idx) => {
                                const Icon = indicator.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        variants={slideUp}
                                        className="bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md hover:bg-white transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-[#6B9F91]/10 flex items-center justify-center text-[#6B9F91] shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-[var(--color-heading)] text-sm">{indicator.title}</span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Right Column - Premium CTA Card (45%) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full lg:w-[45%] flex justify-end"
                    >
                        <div className="w-full max-w-[480px] bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-gray-200/60 border border-[var(--color-border)] relative overflow-hidden flex flex-col items-center text-center">

                            {/* Card Accent Arch */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6B9F91] to-teal-300" />
                            <div className="w-64 h-64 bg-[#FFC900]/10 blur-[60px] rounded-full absolute -top-32 -right-32 pointer-events-none" />

                            <div className="w-16 h-16 rounded-2xl bg-[#6B9F91]/10 flex items-center justify-center text-[#6B9F91] mb-6 shadow-inner">
                                <MessageSquare className="w-8 h-8" />
                            </div>

                            <h3 className="text-2xl font-bold text-[var(--color-heading)] mb-2">Request a Proposal</h3>
                            <p className="text-gray-500 text-sm mb-8">Discuss your technical requirements with our engineering team.</p>

                            <div className="w-full flex flex-col gap-4">
                                <Button asChild size="lg" className="w-full bg-[#6B9F91] hover:bg-[#588478] text-white shadow-lg shadow-[#6B9F91]/20 group">
                                    <Link href="/contact?source=DIGITAL_SOLUTIONS_START_PROJECT&sourcePage=/digital-solutions">
                                        Get a Free Quote
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="w-full border-gray-200 hover:bg-gray-50">
                                    <Link href="/contact?source=DIGITAL_SOLUTIONS_TALK_TO_TEAM&sourcePage=/digital-solutions">
                                        Talk to Our Team
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <Clock className="w-4 h-4 text-[#FFC900]" />
                                Typically responds within 1 business day
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </SectionWrapper>
    );
}
