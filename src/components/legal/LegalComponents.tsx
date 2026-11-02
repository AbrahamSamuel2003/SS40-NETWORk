"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Shield, Mail, Lock, UserCheck, HelpCircle, Globe, Layers, Users, Scale, RefreshCcw, FileX, AlertCircle, LifeBuoy } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// -- ICON MAP --
const ICON_MAP: Record<string, React.ElementType> = {
    Shield,
    Mail,
    Lock,
    UserCheck,
    HelpCircle,
    Globe,
    Layers,
    Users,
    Scale,
    RefreshCcw,
    FileX,
    AlertCircle,
    LifeBuoy
};

// --- HERO ---
export function LegalHero({ title, description, lastUpdated }: { title: string, description: string, lastUpdated: string }) {
    return (
        <section className="bg-white pt-20 md:pt-24 pb-14 md:pb-20 lg:pb-24 relative overflow-hidden">
            <Container className="relative z-10 flex flex-col items-center text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-3 py-1.5 rounded-full bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20 text-[10px] font-bold uppercase tracking-widest mb-6"
                >
                    LEGAL
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] mb-6 tracking-tight font-serif"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-8"
                >
                    {description}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 text-sm font-bold text-[#111827] bg-[#D8E8E2] px-4 py-2 rounded-lg border border-gray-100"
                >
                    <Calendar className="w-4 h-4 text-[#6B9F91]" />
                    Last Updated: <span className="text-gray-500 font-medium">{lastUpdated}</span>
                </motion.div>
            </Container>
        </section>
    );
}

// --- QUICK SUMMARY ---
export function LegalSummaryBlocks({ summaries }: { summaries: { title: string, description: string, icon: string }[] }) {
    return (
        <section className="bg-[#D8E8E2] py-14 md:py-18 lg:py-20 relative z-10 border-t border-[#6B9F91]/20">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {summaries.map((item, idx) => {
                        const Icon = ICON_MAP[item.icon] || HelpCircle;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#6B9F91]/30 transition-all group flex flex-col"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 shrink-0 bg-[#D8E8E2] rounded-xl flex items-center justify-center group-hover:bg-[#6B9F91]/15 transition-colors border border-gray-100">
                                        <Icon className="w-5 h-5 text-[#0F766E]" />
                                    </div>
                                    <h3 className="font-bold text-[#111827] text-base font-serif leading-snug">{item.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}

// --- SIDEBAR & CONTENT LAYOUT ---
export function LegalSidebarLayout({ sections }: { sections: { id: string, title: string, content: string }[] }) {
    return (
        <section className="bg-white border-t border-gray-100 py-12 md:py-16 lg:py-20 relative">
            <Container>
                {/* Scrollable Article Flow */}
                <div className="w-full max-w-4xl mx-auto flex flex-col">
                    {sections.map((sec, idx) => (
                        <article
                            key={sec.id}
                            id={sec.id}
                            className="scroll-mt-32 py-8 md:py-12 border-t border-gray-100 first:border-t-0 first:pt-0"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                    <span className="w-7 h-7 shrink-0 rounded-lg bg-[#6B9F91]/15 text-[#0F766E] font-bold text-xs flex items-center justify-center">
                                        {idx + 1}
                                    </span>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight font-serif">
                                        {sec.title}
                                    </h2>
                                </div>
                                <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed sm:leading-loose pl-0 sm:pl-10">
                                    {sec.content.split('\n').map((paragraph, i) => (
                                        <p key={i} className="mb-4 last:mb-0 text-sm sm:text-base md:text-lg">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </motion.div>
                        </article>
                    ))}
                </div>
            </Container>
        </section>
    );
}

// --- BOTTOM CTA ---
export function LegalCTA({ heading, text }: { heading: string, text: string }) {
    return (
        <section className="bg-white pt-10 pb-14 md:pb-20 lg:pb-24 relative overflow-hidden">
            <Container className="text-center max-w-3xl mx-auto flex flex-col items-center">
                <div className="w-24 h-px bg-gray-200 mb-16" />

                <h3 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4 tracking-tight font-serif">
                    {heading}
                </h3>
                <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10">
                    {text}
                </p>
                <Link href="/contact" passHref>
                    <Button className="bg-[#6B9F91] text-white hover:bg-[#5C8C80] font-bold px-8 py-6 rounded-full group shadow-md shadow-[#6B9F91]/20">
                        Contact Us
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </Container>
        </section>
    );
}
