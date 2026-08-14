"use client";

import type { ComponentType, CSSProperties } from "react";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import type { SiteConfigData } from "@/lib/site-config";

interface ContactChannel {
    id: string;
    icon: ComponentType<{ className?: string; style?: CSSProperties }>;
    title: string;
    value: string;
    href: string;
    target?: string;
    rel?: string;
}

export function ContactMethods({ config }: { config?: SiteConfigData | null }) {
    const emailValue = config?.contactEmail || "support@ss40network.com";
    const phoneValue = config?.contactPhone || "+91 83005 91750";

    const channels: ContactChannel[] = [
        {
            id: "email",
            icon: Mail,
            title: "Email Us",
            value: emailValue,
            href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailValue)}`,
            target: "_blank",
            rel: "noopener noreferrer",
        },
        {
            id: "phone",
            icon: Phone,
            title: "Contact Us",
            value: phoneValue,
            href: `tel:${phoneValue.replace(/\s+/g, "")}`,
        },
    ];

    return (
        <SectionWrapper id="contact-methods" className="bg-[#EDF5F2] py-16 md:py-24">
            <Container className="max-w-5xl mx-auto">

                {/* SECTION HEADER */}
                <div className="text-center mb-8 sm:mb-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] mb-3 tracking-tight"
                    >
                        Choose Your Preferred Way to <span className="text-[#6B9F91]">Reach Us</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.08 }}
                        className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium"
                    >
                        We&apos;re available through multiple channels to answer your questions and discuss your ideas.
                    </motion.p>
                </div>

                {/* TWO COMPACT CONTACT CARDS — CENTERED GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto items-stretch">
                    {channels.map((channel, idx) => {
                        const Icon = channel.icon;
                        return (
                            <motion.a
                                key={channel.id}
                                href={channel.href}
                                target={channel.target}
                                rel={channel.rel}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.35, delay: idx * 0.08 }}
                                className="group relative flex flex-col items-center justify-center text-center p-5 sm:p-6 md:p-7 rounded-xl sm:rounded-2xl bg-white border border-gray-100/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(107,159,145,0.12)] hover:border-[#6B9F91]/35 transition-all duration-200 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] focus-visible:ring-offset-2"
                                aria-label={`${channel.title}: ${channel.value}`}
                            >
                                {/* Subtle top border accent on hover */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6B9F91] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Compact Icon Container */}
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#6B9F91]/10 border border-[#6B9F91]/20 flex items-center justify-center text-[#6B9F91] mb-3 sm:mb-3.5 group-hover:bg-[#6B9F91]/15 group-hover:border-[#6B9F91]/30 group-hover:scale-105 transition-all duration-200">
                                    <Icon className="w-5 h-5 text-[#6B9F91]" />
                                </div>

                                {/* Card Title */}
                                <h3 className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-1.5">
                                    {channel.title}
                                </h3>

                                {/* Email / Phone Value */}
                                <p className="text-sm sm:text-base md:text-lg font-bold text-[#111827] group-hover:text-[#6B9F91] transition-colors duration-200 break-all sm:break-normal">
                                    {channel.value}
                                </p>
                            </motion.a>
                        );
                    })}
                </div>

            </Container>
        </SectionWrapper>
    );
}
