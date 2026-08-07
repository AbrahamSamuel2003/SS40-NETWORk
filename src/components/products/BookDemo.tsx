"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    CalendarCheck,
    MonitorPlay,
    Briefcase,
    MessageCircleQuestion,
    Clock,
    ShieldCheck,
    ArrowRight
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { slideUp, staggerContainer, hoverLift } from "@/lib/animations";

const DEMO_BENEFITS = [
    { text: "Personalized Product Tour", icon: MonitorPlay },
    { text: "Business Use Cases", icon: Briefcase },
    { text: "Questions & Answers", icon: MessageCircleQuestion },
    { text: "No Commitment Required", icon: ShieldCheck },
];

export function BookDemo() {
    return (
        <SectionWrapper id="book-demo" className="bg-white relative overflow-hidden">

            {/* Abstract Background Enhancements */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Static on mobile, rotating on md+ */}
                <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-[#6B9F91]/5 blur-[100px] rounded-full md:hidden" />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-[#6B9F91]/5 blur-[100px] rounded-full hidden md:block"
                />
                <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-[#FFC900]/5 blur-[120px] rounded-full md:hidden" />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-[#FFC900]/5 blur-[120px] rounded-full hidden md:block"
                />
                {/* Geometrics */}
                <div className="absolute right-[10%] top-[40%] w-64 h-64 border border-[#6B9F91]/20 rounded-full rotate-45" />
                <div className="absolute left-[20%] bottom-[20%] w-32 h-32 border border-[#FFC900]/20 rounded-lg -rotate-12" />
            </div>

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

                    {/* Left Column - Content & CTA */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 }
                            }
                        }}
                        className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <motion.div variants={slideUp}>
                            <Badge className="mb-6 rounded-md uppercase tracking-widest text-[10px] font-bold bg-[#6B9F91]/15 text-[#6B9F91]">
                                BOOK A DEMO
                            </Badge>
                        </motion.div>

                        <motion.h2 variants={slideUp} className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight tracking-tight mb-6">
                            See Our Products <br />
                            <span className="text-[#6B9F91]">in Action.</span>
                        </motion.h2>

                        <motion.p variants={slideUp} className="text-lg text-[#6B7280] mb-10 leading-relaxed max-w-lg">
                            Schedule a live walkthrough with our team to explore how SS40 NETWORK products can simplify workflows, improve efficiency, and support your business goals.
                        </motion.p>

                        <motion.div variants={slideUp} className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
                            <Button asChild size="lg" className="w-full sm:w-auto bg-[#6B9F91] hover:bg-[#5C8C80] text-white shadow-lg shadow-[#6B9F91]/20 group">
                                <Link href="/contact">
                                    <CalendarCheck className="w-5 h-5 mr-2 transition-transform" />
                                    Book a Demo
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white hover:bg-gray-50 border-gray-200 text-gray-700 group">
                                <Link href="/contact">
                                    Talk to Expert
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Information Card */}
                    <div className="w-full lg:w-1/2 relative group/section">

                        {/* Ambient glow specifically in right container */}
                        {/* Static ambient glow on mobile, rotating on md+ */}
                        <div className="absolute inset-0 opacity-[0.04] blur-[60px] bg-gradient-to-tr from-[#6B9F91] via-[#FFC900] to-[#6B9F91] scale-150 pointer-events-none z-0 md:hidden" />
                        <motion.div
                            animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 opacity-[0.04] blur-[60px] bg-gradient-to-tr from-[#6B9F91] via-[#FFC900] to-[#6B9F91] scale-150 pointer-events-none z-0 hidden md:block"
                        />

                        <motion.div
                            initial={{ opacity: 0, x: 40, y: 40 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
                            className="relative w-full max-w-md mx-auto lg:ml-auto bg-white/80 backdrop-blur-xl border border-white md:hover:border-[#6B9F91]/20 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-gray-200/50 md:hover:shadow-[0_30px_60px_-15px_rgba(107,159,145,0.15)] transition-all duration-300 md:duration-500 z-10"
                        >
                            {/* Card Header */}
                            <div className="flex items-center gap-4 mb-2.5">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#6B9F91]/10 flex items-center justify-center text-[#6B9F91]">
                                    <MonitorPlay className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-[#111827]">
                                    Live Product Walkthrough
                                </h3>
                            </div>
                            <p className="text-[#6B7280] text-sm mb-6">
                                A guided session tailored to your business needs, engineered to demonstrate exact outcomes.
                            </p>

                            {/* Benefit List */}
                            <motion.ul
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                                    }
                                }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="space-y-2 mb-6"
                            >
                                {DEMO_BENEFITS.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.li
                                            key={idx}
                                            variants={slideUp}
                                            className="group/feature flex items-center gap-3 p-2 -mx-2 rounded-xl md:hover:bg-[#6B9F91]/[0.03] md:hover:shadow-[0_4px_15px_rgba(107,159,145,0.05)] border border-transparent md:hover:border-[#6B9F91]/10 transition-colors duration-200 md:transition-all md:duration-300 cursor-default"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-[#EDF5F2] text-[#6B9F91] flex items-center justify-center shrink-0 md:group-hover/feature:bg-[#6B9F91] md:group-hover/feature:text-white md:group-hover/feature:shadow-[0_0_12px_rgba(107,159,145,0.3)] transition-colors duration-200 md:transition-all md:duration-300">
                                                <Icon className="w-3.5 h-3.5 md:group-hover/feature:scale-110 transition-transform duration-200" />
                                            </div>
                                            <span className="font-semibold text-gray-700 text-sm md:group-hover/feature:text-[#111827] md:group-hover/feature:translate-x-1 transition-colors duration-200 md:transition-all md:duration-300 ease-out">{item.text}</span>
                                        </motion.li>
                                    );
                                })}
                            </motion.ul>

                            {/* Info Badge */}
                            <motion.div
                                variants={slideUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="w-full bg-[#EDF5F2] border border-[#6B9F91]/20 md:hover:border-[#6B9F91]/40 md:hover:shadow-[0_4px_20px_rgba(107,159,145,0.1)] transition-colors duration-200 md:transition-all md:duration-300 rounded-2xl p-4 flex items-center justify-between group/duration cursor-default"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider mb-1">Typical Demo Duration</span>
                                    <span className="font-bold text-[#111827] flex items-center gap-2 md:group-hover/duration:text-[#6B9F91] transition-colors duration-200">
                                        <Clock className="w-4 h-4 text-gray-500 md:group-hover/duration:text-[#6B9F91] transition-colors duration-200" />
                                        <span className="inline-block text-gray-900 md:group-hover/duration:scale-105 origin-left md:group-hover/duration:text-[#6B9F91] transition-colors duration-200 md:transition-transform md:duration-300">30–45 Minutes</span>
                                    </span>
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 relative md:group-hover/duration:-translate-x-1 transition-transform" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 relative md:group-hover/duration:-translate-x-0.5 transition-transform" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#6B9F91] text-[10px] text-white flex items-center justify-center font-bold relative md:group-hover/duration:scale-110 transition-transform">+</div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Decorative Glass Panel Behind */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-white/40 to-[#6B9F91]/10 border border-white backdrop-blur-md rounded-[2.5rem] z-[0] transform rotate-3" />
                    </div>

                </div>
            </Container>
        </SectionWrapper>
    );
}
