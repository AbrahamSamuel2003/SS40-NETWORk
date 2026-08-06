"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";

const METHODS = [
    {
        id: "email",
        icon: Mail,
        title: "Email Us",
        content: "support@ss40network.com",
        description: "Reach out with your questions, project ideas, or collaboration requests. We typically respond within one business day.",
        href: "mailto:support@ss40network.com"
    },
    {
        id: "phone",
        icon: Phone,
        title: "Call Us",
        content: "+91 83005 91750",
        description: "Speak directly with our team for project discussions, consultations, or general enquiries.",
        href: "tel:+918300591750"
    },
    {
        id: "visit",
        icon: MapPin,
        title: "Visit Us",
        content: "Tamil Nadu, India",
        description: "Serving businesses and educational institutions across India with innovative digital solutions and products.",
        href: "#office-location"
    }
];

export function ContactMethods() {
    return (
        <SectionWrapper id="contact-methods" className="bg-[#EDF5F2] py-20 md:py-32">
            <Container className="max-w-6xl mx-auto">

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
                        We're available through multiple channels to answer your questions and discuss your ideas.
                    </motion.p>
                </div>

                {/* 3-CARD GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {METHODS.map((method, idx) => {
                        const Icon = method.icon;
                        return (
                            <motion.a
                                href={method.href}
                                key={method.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md shadow-gray-200/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative overflow-hidden group flex flex-col items-center text-center cursor-pointer"
                            >
                                {/* Thin primary hover accent line */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-[#6B9F91] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="w-14 h-14 bg-[#EDF5F2] rounded-xl flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-[#6B9F91]/5 group-hover:border-[#6B9F91]/20 transition-colors">
                                    <Icon className="w-6 h-6 text-[#6B9F91]" />
                                </div>

                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">{method.title}</h3>
                                <p className="text-lg md:text-xl font-bold text-[#111827] mb-4 group-hover:text-[#6B9F91] transition-colors">{method.content}</p>
                                <p className="text-gray-500 text-sm leading-relaxed">{method.description}</p>
                            </motion.a>
                        );
                    })}
                </div>

            </Container>
        </SectionWrapper>
    );
}
