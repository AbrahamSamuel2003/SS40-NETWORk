"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDown, MessageSquare } from "lucide-react";
import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ContactHeroIllustration } from "@/components/contact/ContactHeroIllustration";

export function Hero() {
    return (
        <section id="contact-hero" className={cn("relative w-full overflow-hidden bg-white border-b border-gray-100 pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 lg:min-h-[min(74vh,700px)] flex items-center")}>


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
                            className="text-[clamp(32px,5vw,48px)] font-bold text-[#0F172A] leading-[1.12] tracking-tight mb-4 max-w-2xl font-serif"
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
                            Whether you're exploring enterprise software, integrating ClearInvoice SaaS, or collaborating on university tech training, our founding engineering team is ready to assist.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-6"
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

                    {/* RIGHT: BESPOKE VECTOR ILLUSTRATED TECH & SUPPORT DESK */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full lg:w-1/2 flex justify-center items-center relative"
                    >
                        <ContactHeroIllustration />
                    </motion.div>

                </div>
            </Container>
        </section>
    );
}
