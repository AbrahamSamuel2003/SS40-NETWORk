"use client";

import type { ComponentType, CSSProperties } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import type { SiteConfigData } from "@/lib/site-config";

/* Per-channel accent colors for intuitive at-a-glance scanning.
   teal  → email (brand green) | blue → phone (communication)
   amber → location (directions)                                       */
const BRAND = "#6B9F91";
const ACCENTS: Record<string, string> = {
    email: BRAND,
    phone: BRAND,
    visit: "#F59E0B",
};

interface ContactChannel {
    id: string;
    icon: ComponentType<{ className?: string; style?: CSSProperties }>;
    title: string;
    value: string;
    description: string;
    href: string;
    accent: string;
}

export function ContactMethods({ config }: { config?: SiteConfigData | null }) {
    const channels: ContactChannel[] = [
        {
            id: "email",
            icon: Mail,
            title: "Email Us",
            value: config?.contactEmail || "",
            description: "We typically respond within one business day.",
            href: config?.contactEmail ? `mailto:${config.contactEmail}` : "#",
            accent: ACCENTS.email,
        },
        {
            id: "phone",
            icon: Phone,
            title: "Contact Us",
            value: config?.contactPhone || "",
            description: "Mon–Fri, 9:00 AM – 6:00 PM IST.",
            href: config?.contactPhone ? `tel:${config.contactPhone.replace(/\s+/g, "")}` : "#",
            accent: ACCENTS.phone,
        },
    ];

    // Only show cards that actually have content
        const visitCard = config?.addressText ? {
            icon: MapPin,
            title: "Visit Us",
            content: config.addressText,
            description: "Serving businesses and educational institutions across India with innovative digital solutions and products.",
            href: "#office-location",
            imageUrl: config.contactSectionImageUrl,
        } : null;
    const visible = channels.filter((c) => c.value && c.value.trim() !== "");

    return (
        <SectionWrapper id="contact-methods" className="bg-[#EDF5F2] py-20 md:py-32">
            <Container className="max-w-7xl mx-auto">

                {/* SECTION HEADER */}
                <div className="text-center mb-16 lg:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight"
                    >
                        Choose Your Preferred Way to <span className="text-[#6B9F91]">Reach Us</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        We&apos;re available through multiple channels to answer your questions and discuss your ideas.
                    </motion.p>
                </div>

                {/* CHANNEL CARDS — equal-width grid; every card is a full-card link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
                    {visible.map((channel, idx) => {
                        const Icon = channel.icon;
                        return (
                            <motion.a
                                key={channel.id}
                                href={channel.href}
                                initial={{ opacity: 0, y: 6 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.35, delay: idx * 0.06 }}
                                className="group relative flex items-center min-h-[92px] bg-white rounded-lg p-3 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_18px_rgba(107,159,145,0.08)] hover:border-[#e6f3ec] transition-all duration-150 overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6B9F91]/30"
                                role="button"
                                aria-label={`${channel.title} — ${channel.value}`}
                                tabIndex={0}
                            >
                                {/* Thin top accent */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60 transition-opacity duration-200" style={{ backgroundColor: channel.accent }} />

                                <div className="flex items-center gap-3 w-full">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center border" style={{ backgroundColor: `${channel.accent}10`, borderColor: `${channel.accent}18` }}>
                                        <Icon className="w-4 h-4" style={{ color: channel.accent }} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="truncate">
                                                <h3 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide truncate">{channel.title}</h3>
                                                <p className="text-lg md:text-xl font-extrabold text-[#0f172a] leading-tight truncate mt-1">{channel.value}</p>
                                            </div>
                                            <div className="ml-3 flex-shrink-0 mt-0.5">
                                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                            </div>
                                        </div>

                                        <p className="text-gray-400 text-xs mt-2">{channel.description}</p>
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
