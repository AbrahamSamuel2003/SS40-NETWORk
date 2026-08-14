"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import type { SiteConfigData } from "@/lib/site-config";

export function ContactMethods({ config }: { config?: SiteConfigData | null }) {
    const contactCards = [
        ...(config?.contactEmail ? [{
            id: "email",
            icon: Mail,
            title: "Email Us",
            content: config.contactEmail,
            description: "Reach out with your questions, project ideas, or collaboration requests. We typically respond within one business day.",
            href: `mailto:${config.contactEmail}`
        }] : []),
        ...(config?.contactPhone ? [{
            id: "phone",
            icon: Phone,
            title: "Call Us",
            content: config.contactPhone,
            description: "Speak directly with our team for project discussions, consultations, or general enquiries.",
            href: `tel:${config.contactPhone.replace(/\s+/g, '')}`
        }] : [])
    ];

    const visitCard = config?.addressText ? {
        icon: MapPin,
        title: "Visit Us",
        content: config.addressText,
        description: "Serving businesses and educational institutions across India with innovative digital solutions and products.",
        href: "#office-location",
        imageUrl: config.contactSectionImageUrl,
    } : null;

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

                <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.6fr] gap-6 lg:gap-8 items-stretch">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        {contactCards.map((method, idx) => {
                            const Icon = method.icon;
                            return (
                                <motion.a
                                    href={method.href}
                                    key={method.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="min-h-[220px] bg-white rounded-2xl p-8 border border-gray-100 shadow-md shadow-gray-200/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between cursor-pointer"
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B9F91] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    <div className="w-14 h-14 bg-[#EDF5F2] rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-[#6B9F91]/5 group-hover:border-[#6B9F91]/20 transition-colors">
                                        <Icon className="w-6 h-6 text-[#6B9F91]" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{method.title}</h3>
                                        <p className="text-lg md:text-xl font-bold text-[#111827] mb-3 group-hover:text-[#6B9F91] transition-colors break-words">{method.content}</p>
                                        <p className="text-gray-500 text-sm leading-relaxed">{method.description}</p>
                                    </div>
                                </motion.a>
                            );
                        })}
                    </div>

                    {visitCard && (() => {
                        const Icon = visitCard.icon;
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="min-h-[320px] bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-md shadow-gray-200/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative overflow-hidden group flex flex-col justify-center"
                            >
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B9F91] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="flex items-start gap-8 md:gap-12">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-[#EDF5F2] rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-[#6B9F91]/5 group-hover:border-[#6B9F91]/20 transition-colors">
                                            <Icon className="w-7 h-7 text-[#6B9F91]" />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{visitCard.title}</h3>
                                        <p className="text-2xl md:text-4xl font-extrabold text-[#111827] mb-4 group-hover:text-[#6B9F91] transition-colors leading-tight">{visitCard.content}</p>
                                        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl mb-6">{visitCard.description}</p>

                                        <div className="flex items-center gap-3">
                                            <a
                                                href={visitCard.href}
                                                className="inline-flex items-center px-5 py-3 bg-[#6B9F91] text-white rounded-lg font-bold text-sm hover:bg-[#588478] transition-colors"
                                            >
                                                View Location
                                            </a>

                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(visitCard.content)}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center px-4 py-3 border border-gray-100 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Open in Maps
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })()}
                </div>

            </Container>
        </SectionWrapper>
    );
}
