"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, Briefcase, GraduationCap, ArrowRight } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const HELPFUL_INFO = [
    {
        icon: Clock,
        title: "Response Time",
        description: "Usually within one business day."
    },
    {
        icon: Briefcase,
        title: "Business Enquiries",
        description: "Digital Solutions, Products and Consulting."
    },
    {
        icon: GraduationCap,
        title: "Academic Collaborations",
        description: "Universities, Colleges and Institutions."
    }
];

const INTEREST_OPTIONS = [
    "Digital Solutions",
    "Products",
    "Academics",
    "General Enquiry",
    "Partnership",
    "Support"
];

export function ContactForm() {
    return (
        <SectionWrapper id="contact-form" className="bg-white py-20 md:py-32 relative overflow-hidden">
            <Container className="max-w-7xl mx-auto">

                {/* HEADINGS */}
                <div className="mb-16 text-center md:text-left flex flex-col items-center md:items-start">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight"
                    >
                        Send Us a <span className="text-[#6B9F91]">Message</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-gray-500 text-base md:text-lg max-w-2xl leading-relaxed font-medium"
                    >
                        Tell us about your idea, project, or partnership opportunity. Our team will get back to you with the right guidance.
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* LEFT: FORM */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="w-full lg:w-2/3 bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/40 relative"
                    >
                        {/* Soft background glow within the form card */}
                        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#6B9F91]/5 blur-[80px] rounded-full pointer-events-none" />

                        <form className="relative z-10 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="fullName" className="text-sm font-bold text-[#111827]">Full Name</label>
                                    <input type="text" id="fullName" className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400" placeholder="Full Name" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email" className="text-sm font-bold text-[#111827]">Email Address</label>
                                    <input type="email" id="email" className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400" placeholder="Email Address" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="phone" className="text-sm font-bold text-[#111827]">Phone Number</label>
                                    <input type="tel" id="phone" className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400" placeholder="Mobile Number" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="company" className="text-sm font-bold text-[#111827]">Company / Institution <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <input type="text" id="company" className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400" placeholder="Company Name (Optional)" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="interestedIn" className="text-sm font-bold text-[#111827]">Interested In</label>
                                <select id="interestedIn" defaultValue="" className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 appearance-none">
                                    <option value="" disabled>Select an option</option>
                                    {INTEREST_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="text-sm font-bold text-[#111827]">Message</label>
                                <textarea id="message" rows={5} className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400 resize-none" placeholder="Project Message"></textarea>
                            </div>

                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="mt-4">
                                <Button type="submit" className="w-full sm:w-auto bg-[#6B9F91] text-white hover:bg-[#5C8C80] font-bold text-base px-10 py-6 rounded-full group shadow-lg shadow-[#6B9F91]/20">
                                    Send Message
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </motion.div>
                        </form>
                    </motion.div>

                    {/* RIGHT: HELPFUL INFORMATION */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        {HELPFUL_INFO.map((info, idx) => {
                            const Icon = info.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                                    className="bg-[#EDF5F2] rounded-2xl p-6 md:p-8 border border-gray-100 flex items-start gap-4 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-[#6B9F91]" />
                                    </div>
                                    <div>
                                        <h4 className="text-[#111827] font-bold text-base mb-1">{info.title}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">{info.description}</p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </Container>
        </SectionWrapper>
    );
}
