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
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.45, delay: idx * 0.08 }}
                                className="group relative flex flex-col min-h-[110px] bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:translate-y-0.5 hover:shadow-md transition-all duration-150 overflow-hidden cursor-pointer"
                            >
                                {/* Color-coded accent bar — intensifies on hover */}
                                <div
                                    className="absolute top-0 left-0 right-0 h-1 opacity-40 transition-opacity duration-200"
                                    style={{ backgroundColor: channel.accent }}
                                />

                                {/* Icon circle — colored per channel */}
                                <div
                                    className="w-10 h-10 rounded-md flex items-center justify-center border mb-3 transition-all duration-150 group-hover:opacity-90"
                                    style={{
                                        backgroundColor: `${channel.accent}10`,
                                        borderColor: `${channel.accent}20`,
                                    }}
                                >
                                    <Icon className="w-4 h-4" style={{ color: channel.accent }} />
                                </div>

                                {/* Title */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">{channel.title}</h3>
                                        <p className="text-sm font-semibold text-[#111827] mt-1 break-words whitespace-pre-line" style={{ color: BRAND }}>{channel.value}</p>
                                    </div>
                                    <div className="ml-3 flex-shrink-0">
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                                    </div>
                                </div>
                                <p className="text-gray-400 text-[11px] mt-2">{channel.description}</p>
                            </motion.a>
                        );
                    })}
                </div>

            </Container>
        </SectionWrapper>
    );
}
