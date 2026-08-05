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
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-[#6B9F91]/5 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-[#FFC900]/5 blur-[120px] rounded-full"
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
                        variants={slideUp}
                        className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <Badge className="mb-6 rounded-md uppercase tracking-widest text-[10px] font-bold bg-[#6B9F91]/15 text-[#6B9F91]">
                            BOOK A DEMO
                        </Badge>

                        <h2 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight tracking-tight mb-6">
                            See Our Products <br />
                            <span className="text-[#6B9F91]">in Action.</span>
                        </h2>

                        <p className="text-lg text-[#6B7280] mb-10 leading-relaxed max-w-lg">
                            Schedule a live walkthrough with our team to explore how SS40 NETWORK products can simplify workflows, improve efficiency, and support your business goals.
                        </p>

                        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
                            <Button asChild size="lg" className="w-full sm:w-auto bg-[#6B9F91] hover:bg-[#5C8C80] text-white shadow-xl shadow-[#6B9F91]/20 group">
                                <Link href="/contact">
                                    <CalendarCheck className="w-5 h-5 mr-2" />
                                    Book a Demo
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white hover:bg-gray-50 border-gray-200 text-gray-700">
                                <Link href="/contact">
                                    Talk to Sales
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right Column - Information Card */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, x: 40, y: 40 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
                            className="w-full max-w-md mx-auto lg:ml-auto bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 rounded-[2rem] shadow-2xl shadow-gray-200/50"
                        >
                            {/* Card Header */}
                            <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-[#6B9F91]/10 flex items-center justify-center text-[#6B9F91]">
                                    <MonitorPlay className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-[#111827]">
                                    Live Product Walkthrough
                                </h3>
                            </div>
                            <p className="text-[#6B7280] text-sm mb-8">
                                A guided session tailored to your business needs, engineered to demonstrate exact outcomes.
                            </p>

                            {/* Benefit List */}
                            <motion.ul
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="space-y-4 mb-10"
                            >
                                {DEMO_BENEFITS.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.li
                                            key={idx}
                                            variants={slideUp}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#F2F7F5] text-[#6B9F91] flex items-center justify-center shrink-0">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-gray-700 text-sm">{item.text}</span>
                                        </motion.li>
                                    );
                                })}
                            </motion.ul>

                            {/* Info Badge */}
                            <div className="w-full bg-[#F2F7F5] border border-[#6B9F91]/20 rounded-2xl p-5 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider mb-1">Typical Demo Duration</span>
                                    <span className="font-bold text-[#111827] flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        30–45 Minutes
                                    </span>
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#6B9F91] text-[10px] text-white flex items-center justify-center font-bold">+</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative Glass Panel Behind */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-white/40 to-[#6B9F91]/10 border border-white backdrop-blur-md rounded-[2.5rem] z-[-1] transform rotate-3" />
                    </div>

                </div>
            </Container>
        </SectionWrapper>
    );
}
