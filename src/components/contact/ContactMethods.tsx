"use client";

import type { ComponentType, CSSProperties } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare, ArrowUpRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import type { SiteConfigData } from "@/lib/site-config";

interface ContactChannel {
    id: string;
    icon: ComponentType<{ className?: string; style?: CSSProperties }>;
    title: string;
    mobileTitle: string;
    subtitle: string;
    value: string;
    href: string;
    actionLabel: string;
    target?: string;
    rel?: string;
}

export function ContactMethods({ config }: { config?: SiteConfigData | null }) {
    const emailValue = config?.contactEmail || "support@ss40network.com";
    const phoneValue = config?.contactPhone || "+91 83005 91750";
    const whatsappValue = config?.whatsappNumber || "+91 83005 91750";
    const cleanPhone = phoneValue.replace(/\s+/g, "");
    const cleanWhatsapp = whatsappValue.replace(/\s+/g, "");

    const channels: ContactChannel[] = [
        {
            id: "email",
            icon: Mail,
            title: "Corporate Email",
            mobileTitle: "Email Desk",
            subtitle: "General & Technical Enquiries",
            value: emailValue,
            actionLabel: "Send Email",
            href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailValue)}`,
            target: "_blank",
            rel: "noopener noreferrer",
        },
        {
            id: "whatsapp",
            icon: MessageSquare,
            title: "WhatsApp Desk",
            mobileTitle: "WhatsApp",
            subtitle: "Instant Chat & Direct Advice",
            value: whatsappValue,
            actionLabel: "Chat Now",
            href: `https://wa.me/${cleanWhatsapp.replace('+', '')}?text=${encodeURIComponent("Hello SS40 Network, I would like to enquire about your services.")}`,
            target: "_blank",
            rel: "noopener noreferrer",
        },
        {
            id: "phone",
            icon: Phone,
            title: "Direct Voice Line",
            mobileTitle: "Direct Call",
            subtitle: "Mon - Sat (9:00 AM - 6:00 PM)",
            value: phoneValue,
            actionLabel: "Call Desk",
            href: `tel:${cleanPhone}`,
        },
    ];

    return (
        <SectionWrapper id="contact-methods" className="bg-[#D8E8E2] py-12 sm:py-16 md:py-20 relative">
            <Container className="max-w-6xl mx-auto">

                {/* SECTION HEADER */}
                <div className="text-center mb-8 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="inline-block px-3.5 py-1 rounded-full bg-white/80 border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-widest mb-3 shadow-2xs"
                    >
                        COMMUNICATION CHANNELS
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] mb-2 sm:mb-3 tracking-tight font-serif"
                    >
                        Choose Your Preferred Way to <span className="text-[#0F766E]">Reach Us</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-[#334155] text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed"
                    >
                        Connect directly with our engineering and advisory teams through any of our official channels.
                    </motion.p>
                </div>

                {/* SINGLE ROW GRID ON BOTH MOBILE & DESKTOP (3 Columns) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 items-stretch">
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
                                className="group relative flex flex-col justify-between p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-[0_4px_16px_-4px_rgba(15,118,110,0.08)] hover:shadow-[0_12px_28px_-6px_rgba(15,118,110,0.16)] hover:border-[#0F766E]/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                                aria-label={`${channel.title}: ${channel.value}`}
                            >
                                <div className="flex flex-col h-full justify-between">
                                    {/* Icon & Arrow Header Row */}
                                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                                        <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#EDF5F2] border border-[#0F766E]/15 flex items-center justify-center text-[#0F766E] group-hover:bg-[#0F766E] group-hover:text-white transition-all duration-300 shadow-2xs shrink-0">
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#0F766E] group-hover:bg-[#EDF5F2] transition-colors shrink-0">
                                            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Titles & Value */}
                                    <div>
                                        {/* Responsive Title: Compact on Mobile, Full on Desktop */}
                                        <h3 className="text-xs sm:text-base md:text-lg font-bold text-[#0F172A] mb-0.5 sm:mb-1 font-serif group-hover:text-[#0F766E] transition-colors truncate">
                                            <span className="sm:hidden">{channel.mobileTitle}</span>
                                            <span className="hidden sm:inline">{channel.title}</span>
                                        </h3>

                                        {/* Subtitle (Hidden on small mobile screens to keep cards sleek) */}
                                        <p className="hidden sm:block text-[11px] sm:text-xs text-gray-500 mb-3 font-normal line-clamp-1">
                                            {channel.subtitle}
                                        </p>

                                        {/* Value: Compact & Clean */}
                                        <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0F766E] transition-colors truncate">
                                            {channel.value}
                                        </p>
                                    </div>

                                    {/* Action Tag Pill */}
                                    <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100/80 flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#0F766E]">
                                        <span className="truncate">{channel.actionLabel}</span>
                                        <span className="hidden md:inline text-[9px] uppercase tracking-wider text-gray-400 group-hover:text-[#0F766E] transition-colors">&rarr;</span>
                                    </div>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>

            </Container>
        </SectionWrapper>
    );
}
