"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Building2, Handshake } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const CARDS = [
    {
        title: "Students",
        icon: GraduationCap,
        description: "Learn through practical projects and industry-focused experiences."
    },
    {
        title: "Institutions",
        icon: Building2,
        description: "Partner with SS40 NETWORK to create stronger academic collaborations."
    },
    {
        title: "Industry",
        icon: Handshake,
        description: "Collaborate to support innovation and connect with future-ready talent."
    }
];

export function Collaborate() {
    return (
        <SectionWrapper id="collaborate" className="bg-[#EDF5F2] relative overflow-hidden pt-4 pb-20 md:pt-8 md:pb-32">

            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Subtle dotted texture */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: 'radial-gradient(#111827 2px, transparent 2px)', backgroundSize: '32px 32px' }}
                />

                {/* Soft teal radial glow */}
                <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.2, 0.15] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6B9F91] blur-[150px] rounded-full mix-blend-multiply pointer-events-none"
                />

                {/* Light floating circles */}
                <motion.div
                    animate={{ y: [-15, 15, -15] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                    className="absolute top-[20%] left-[15%] w-16 h-16 rounded-full border border-[#6B9F91]/20 opacity-40"
                />
                <motion.div
                    animate={{ y: [15, -15, 15] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute bottom-[30%] right-[15%] w-24 h-24 rounded-full border border-[#6B9F91]/20 opacity-30"
                />
            </div>

            <Container className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">

                {/* SECTION HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-3 py-1 rounded-full bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-widest mb-4">
                        COLLABORATE WITH US
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-4 tracking-tight leading-tight">
                        Let's Build the Future Together.
                    </h2>
                    <p className="text-gray-500 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Whether you're a student, an educational institution, or an industry partner, we're ready to build meaningful opportunities together.
                    </p>
                </motion.div>

                {/* 3-CARD GRID */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
                    {CARDS.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md shadow-gray-200/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative overflow-hidden group flex flex-col items-center text-center"
                            >
                                {/* Thin primary hover accent line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B9F91] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="w-14 h-14 bg-[#EDF5F2] rounded-xl flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-[#6B9F91]/5 group-hover:border-[#6B9F91]/20 transition-colors">
                                    <Icon className="w-6 h-6 text-[#6B9F91]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#111827] mb-3">{card.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA BUTTON */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full sm:w-auto flex justify-center"
                >
                    <Button asChild className="w-full sm:w-auto bg-[#6B9F91] text-white hover:bg-[#5C8C80] font-bold text-base px-8 py-6 rounded-full group shadow-lg shadow-[#6B9F91]/20">
                        <Link href="/contact">
                            Collaborate With Us
                            <motion.span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                                <ArrowRight className="w-5 h-5" />
                            </motion.span>
                        </Link>
                    </Button>
                </motion.div>

            </Container>
        </SectionWrapper>
    );
}
