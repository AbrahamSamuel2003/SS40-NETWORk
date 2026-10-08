"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Briefcase,
    MessageSquare,
    GraduationCap,
    ShieldCheck,
    ArrowRight,
    Clock,
    Mail,
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { slideUp, staggerContainer } from "@/lib/animations";

const TRUST_INDICATORS = [
    {
        title: "Enterprise Software Scoping",
        icon: Briefcase,
    },
    {
        title: "Fixed-Scope & SLA Guarantee",
        icon: ShieldCheck,
    },
    {
        title: "Academic Talent Acceleration",
        icon: GraduationCap,
    },
    {
        title: "Direct Executive Consultation",
        icon: MessageSquare,
    },
];

export function CompanyCTA() {
    return (
        <SectionWrapper id="company-cta" className="relative overflow-hidden bg-white py-16 lg:py-24 border-t border-gray-100 font-crimson font-serif">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#6B9F91]/10 blur-[120px] rounded-full -translate-x-1/3 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#6B9F91]/5 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />
            </div>

            <Container className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Left Column - Content (55%) */}
                    <div className="w-full lg:w-[55%] flex flex-col text-center lg:text-left items-center lg:items-start">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideUp}
                            className="flex flex-col items-center lg:items-start"
                        >
                            <Badge
                                variant="primary"
                                className="mb-6 rounded-md uppercase tracking-widest text-[10px] font-bold shadow-xs bg-[#D8E8E2] text-[#0F766E] border border-[#2DD4BF]/40"
                            >
                                Let's Build Together
                            </Badge>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-heading)] leading-tight tracking-tight mb-6 font-serif">
                                Ready to Partner with <br className="hidden md:block" />
                                <span className="text-[#0F766E]">SS40 NETWORK?</span>
                            </h2>

                            <p className="text-base md:text-lg text-gray-600 mb-10 max-w-xl leading-relaxed">
                                Whether you're planning custom enterprise software, exploring SaaS products, or establishing academic talent pipelines, our engineering team is ready to deliver.
                            </p>
                        </motion.div>

                        {/* Trust Indicators Grid (Hidden on Mobile, Visible on Desktop) */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="hidden sm:grid sm:grid-cols-2 gap-4 w-full"
                        >
                            {TRUST_INDICATORS.map((indicator, idx) => {
                                const Icon = indicator.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        variants={slideUp}
                                        className="bg-[#F8FAF9] border border-gray-200/80 rounded-xl p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-md hover:bg-white transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-[#D8E8E2] flex items-center justify-center text-[#0F766E] shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-semibold text-gray-900 text-xs sm:text-sm text-left">
                                            {indicator.title}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Right Column - Premium Signature CTA Card (45%) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full lg:w-[45%] flex justify-center lg:justify-end"
                    >
                        <div className="w-full max-w-[480px] bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/60 border border-gray-200/90 relative overflow-hidden flex flex-col items-center text-center">
                            {/* Card Accent Top Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F766E] via-[#2DD4BF] to-[#115E59]" />

                            <div className="w-14 h-14 rounded-2xl bg-[#D8E8E2] flex items-center justify-center text-[#0F766E] mb-5 shadow-2xs">
                                <MessageSquare className="w-7 h-7" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-2">
                                Request a Consultation
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm mb-7 leading-relaxed">
                                Discuss your business or academic initiative directly with our solutions engineering team.
                            </p>

                            <div className="w-full flex flex-col gap-3.5">
                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white shadow-md shadow-[#0F766E]/20 font-bold text-sm h-12 rounded-xl group cursor-pointer"
                                >
                                    <Link href="/contact?source=COMPANY_START_PROJECT&sourcePage=/company">
                                        <span>Start a Conversation</span>
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm h-12 rounded-xl cursor-pointer"
                                >
                                    <a href="mailto:support@ss40network.com">
                                        <Mail className="w-4 h-4 mr-2 text-[#0F766E]" />
                                        <span>support@ss40network.com</span>
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-7 pt-5 border-t border-gray-100 w-full flex items-center justify-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                                <span>Typically responds within 1 business day</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </SectionWrapper>
    );
}
