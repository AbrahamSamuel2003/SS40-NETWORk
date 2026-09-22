"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, PhoneCall, Mail, Phone, Video, HelpCircle, Network } from "lucide-react";
import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// -- Content Data --
const NODES = [
    { id: "email", label: "Email", icon: Mail, x: -100, y: -90, delay: 0 },
    { id: "phone", label: "Phone", icon: Phone, x: 100, y: -60, delay: 0.2 },
    { id: "meeting", label: "Meeting", icon: Video, x: -90, y: 80, delay: 0.4 },
    { id: "support", label: "Support", icon: HelpCircle, x: 110, y: 90, delay: 0.6 },
];

export function Hero() {
    return (
        <section id="contact-hero" className={cn("relative w-full overflow-hidden bg-white border-b border-gray-100 pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-20 lg:min-h-[min(70vh,650px)] flex items-center")}>

            {/* Ambient Background Image & Gradients (Clean Stacking Context) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <Image
                    src="/images/hero/contact-hero-bg.png"
                    alt=""
                    fill
                    loading="eager"
                    sizes="100vw"
                    className="object-cover object-center opacity-45 sm:opacity-55 mix-blend-multiply"
                    quality={90}
                />
                <div 
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.75) 65%, #ffffff 100%)' }}
                />
                {/* Dotted texture */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#111827 2px, transparent 2px)', backgroundSize: '32px 32px' }}
                />
            </div>

            <Container className="relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-6">

                    {/* LEFT: CONTENT */}
                    <div className="w-full lg:w-1/2 flex flex-col text-center lg:text-left z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="mb-4"
                        >
                            <span className="inline-block px-3 py-1.5 rounded-full bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20 text-[10px] font-bold uppercase tracking-widest">
                                CONTACT US
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-[clamp(30px,5vw,40px)] font-bold text-[#111827] leading-[1.1] tracking-tight mb-4 max-w-2xl font-serif"
                        >
                            Let's Build Something <br className="hidden lg:block" /> Meaningful <span className="text-[#6B9F91]">Together.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-base md:text-lg text-[#6B7280] mb-5 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Whether you're looking for digital solutions, exploring our products, or interested in academic collaborations, our team is ready to help you take the next step.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <Button
                                onClick={() => {
                                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full sm:w-auto bg-[#6B9F91] text-white hover:bg-[#5C8C80] font-bold text-base px-6 py-4 rounded-full group shadow-lg shadow-[#6B9F91]/20 inline-flex items-center justify-center whitespace-nowrap"
                            >
                                Get in Touch
                                <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform shrink-0" />
                            </Button>

                            <a href="tel:+918300591750" className="w-full sm:w-auto inline-flex items-center justify-center">
                                <Button
                                    variant="outline"
                                    className="w-full bg-[#D8E8E2] border-gray-200 text-[#111827] hover:bg-gray-50 hover:border-gray-300 font-bold text-base px-6 py-4 rounded-full group transition-all inline-flex items-center justify-center whitespace-nowrap"
                                >
                                    <PhoneCall className="w-4 h-4 mr-2 text-[#6B9F91] shrink-0" />
                                    Call Us
                                </Button>
                            </a>
                        </motion.div>
                    </div>

                    {/* RIGHT: VISUAL COMMUNICATION HUB */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center h-[260px] md:h-[340px] relative">

                        <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">

                            {/* SVG Connecting Lines */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="-200 -200 400 400">
                                {NODES.map((node, i) => (
                                    <motion.g key={`line-${node.id}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.2 }}>
                                        <motion.line
                                            x1="0" y1="0" x2={node.x} y2={node.y}
                                            stroke="#6B9F91" strokeWidth="1.5" strokeDasharray="4 4"
                                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: "easeOut", delay: 0.5 + i * 0.2 }}
                                            className="opacity-40"
                                        />
                                    </motion.g>
                                ))}
                            </svg>

                            {/* Center Node */}
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, type: "spring" }}
                                className="relative z-20 flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 bg-white rounded-full shadow-[0_15px_50px_rgba(107,159,145,0.15)] border-4 border-[#D8E8E2]"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-[#6B9F91]/10 rounded-full blur-md -z-10"
                                />
                                <Network className="w-7 h-7 text-[#6B9F91] mb-1.5" />
                                <span className="font-extrabold text-[#111827] text-[10px] md:text-xs tracking-wider text-center leading-tight">SS40<br />NETWORK</span>
                            </motion.div>

                            {/* Outer Nodes */}
                            {NODES.map((node, i) => {
                                const Icon = node.icon;
                                return (
                                    <div
                                        key={node.id}
                                        className="absolute z-30"
                                        style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1, y: [-4, 4, -4] }}
                                            transition={{
                                                 opacity: { duration: 0.4, delay: 0.6 + i * 0.2 },
                                                 scale: { duration: 0.5, type: "spring", delay: 0.6 + i * 0.2 },
                                                 y: { repeat: Infinity, duration: 4 + i, ease: "easeInOut", delay: node.delay }
                                            }}
                                            className="relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100"
                                        >
                                            <Icon className="w-5 h-5 text-[#6B9F91] mb-1" />
                                            <span className="text-[9px] md:text-[10px] font-bold text-[#111827]">{node.label}</span>
                                        </motion.div>
                                    </div>
                                );
                            })}

                            {/* Floating Particles Around Hub */}
                            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute text-[#A6CBBE] top-0 left-[20%] text-sm">✦</motion.div>
                            <motion.div animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute text-[#FFC900] bottom-[10%] right-[10%] text-xs opacity-60">✦</motion.div>

                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
