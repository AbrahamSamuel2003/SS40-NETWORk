"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
    ArrowDown, 
    MessageSquare, 
    Phone, 
    Code2, 
    Box, 
    GraduationCap, 
    Layers,
    ArrowRight
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const SS40_WINGS = [
    {
        id: "digital-solutions",
        title: "SS40 Digital Solutions",
        description: "Custom Software, Web & Cloud Systems",
        tag: "Engineering Desk",
        icon: Code2,
        accentBg: "bg-[#EDF5F2]",
        accentText: "text-[#0F766E]",
    },
    {
        id: "products",
        title: "SS40 Products",
        description: "ClearInvoice SaaS & Cloud Tools",
        tag: "Product Demo",
        icon: Box,
        accentBg: "bg-[#EDF5F2]",
        accentText: "text-[#0F766E]",
    },
    {
        id: "academics",
        title: "SS40 Academics",
        description: "Tech Programs & Institutional MoUs",
        tag: "Admissions",
        icon: GraduationCap,
        accentBg: "bg-[#EDF5F2]",
        accentText: "text-[#0F766E]",
    },
];

export function Hero() {
    return (
        <section id="contact-hero" className={cn("relative w-full overflow-hidden bg-white border-b border-gray-100 pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 lg:min-h-[min(72vh,680px)] flex items-center")}>

            {/* Ambient Background & Soft Radial Color Blends */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <div 
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(223, 233, 212, 0.45) 0%, rgba(216, 232, 226, 0.25) 50%, #ffffff 100%)' }}
                />
                {/* Soft ambient gradient orbs */}
                <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#DFE9D4]/40 rounded-full blur-3xl pointer-events-none" />
            </div>

            <Container className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

                    {/* LEFT: CONTENT */}
                    <div className="w-full lg:w-1/2 flex flex-col text-center lg:text-left z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-4"
                        >
                            <span className="inline-block px-3.5 py-1 rounded-full bg-[#DFE9D4] text-[#0F766E] border border-[#0F766E]/20 text-[11px] font-extrabold uppercase tracking-widest shadow-2xs">
                                SS40 Contact &amp; Advisory
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-[clamp(32px,5vw,46px)] font-bold text-[#0F172A] leading-[1.12] tracking-tight mb-4 max-w-2xl font-serif"
                        >
                            Let's Build Something <br className="hidden lg:block" />
                            Exceptional <span className="text-[#0F766E]">Together.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-base md:text-lg text-[#334155] mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
                        >
                            Whether you're exploring enterprise software, integrating ClearInvoice SaaS, or collaborating on university tech training, our core engineering team is ready to assist.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5"
                        >
                            <Button
                                onClick={() => {
                                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full sm:w-auto bg-[#0F766E] text-white hover:bg-[#115E59] font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl group shadow-lg shadow-[#0F766E]/20 inline-flex items-center justify-center whitespace-nowrap cursor-pointer transition-all active:scale-[0.98]"
                            >
                                Start a Conversation
                                <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform shrink-0" />
                            </Button>

                            <a
                                href="https://wa.me/918300591750?text=Hello%20SS40%20Network%2C%20I%20would%20like%20to%20connect%20with%20your%20team."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full bg-[#D8E8E2]/60 border-gray-200 text-[#0F172A] hover:bg-white hover:border-[#0F766E]/30 font-bold text-sm sm:text-base px-5 py-3.5 rounded-xl group transition-all inline-flex items-center justify-center whitespace-nowrap"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2 text-[#0F766E] shrink-0" />
                                    WhatsApp Desk
                                </Button>
                            </a>
                        </motion.div>
                    </div>

                    {/* RIGHT: SIMPLE, ATTRACTIVE, OUT-OF-THE-BOX ILLUSTRATION (SS40 Ecosystem Console) */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center relative">
                        <div className="relative w-full max-w-[440px]">

                            {/* MAIN SS40 ECOSYSTEM ILLUSTRATOR CARD */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="w-full bg-white rounded-3xl border border-gray-200/80 shadow-[0_20px_50px_-12px_rgba(15,118,110,0.14)] p-5 sm:p-6 flex flex-col gap-4 relative z-10"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
                                            <Layers className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-serif">
                                                SS40 Ecosystem Direct
                                            </h3>
                                            <span className="text-[10px] text-gray-500 font-medium">
                                                One Company. Three Wings.
                                            </span>
                                        </div>
                                    </div>

                                    <span className="px-2.5 py-1 rounded-full bg-[#EDF5F2] text-[#0F766E] text-[10px] font-bold">
                                        Active
                                    </span>
                                </div>

                                {/* Three SS40 Wings */}
                                <div className="flex flex-col gap-2.5">
                                    {SS40_WINGS.map((wing) => {
                                        const Icon = wing.icon;
                                        return (
                                            <div
                                                key={wing.id}
                                                className="p-3.5 rounded-2xl bg-[#FAFCFB] border border-gray-100 hover:border-[#0F766E]/40 hover:bg-white hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs", wing.accentBg, wing.accentText, "group-hover:bg-[#0F766E] group-hover:text-white")}>
                                                        <Icon className="w-4.5 h-4.5" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-[#0F766E] transition-colors font-serif">
                                                            {wing.title}
                                                        </div>
                                                        <div className="text-[10px] sm:text-[11px] text-gray-500">
                                                            {wing.description}
                                                        </div>
                                                    </div>
                                                </div>

                                                <span className="text-[10px] font-bold text-[#0F766E] bg-[#EDF5F2] px-2.5 py-1 rounded-lg shrink-0 group-hover:bg-[#0F766E] group-hover:text-white transition-colors">
                                                    {wing.tag}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Quick Connect Footer Strip */}
                                <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2.5">
                                    <a 
                                        href="https://wa.me/918300591750" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#EDF5F2] hover:bg-[#0F766E] text-[#0F766E] hover:text-white transition-all text-xs font-bold text-center shadow-2xs"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>WhatsApp Chat</span>
                                    </a>

                                    <a 
                                        href="tel:+918300591750" 
                                        className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#FAFCFB] hover:bg-gray-100 text-[#0F172A] transition-all text-xs font-bold text-center border border-gray-200/80"
                                    >
                                        <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
                                        <span>Direct Call</span>
                                    </a>
                                </div>
                            </motion.div>

                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
