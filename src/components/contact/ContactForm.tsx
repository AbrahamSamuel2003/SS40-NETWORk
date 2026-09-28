"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const INTEREST_OPTIONS = [
    "Enterprise Software & Web Apps",
    "ClearInvoice & SaaS Products",
    "Academic Training & MoUs",
    "Cloud & AI Solutions",
    "Corporate Partnership",
    "General Enquiry"
];

export function ContactForm() {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        serviceInterest: "",
        message: ""
    });

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    // Detect attribution sources on mount
    const [sourceContext, setSourceContext] = useState({
        source: "CONTACT_FORM",
        sourcePage: "/contact",
        landingPage: "/contact"
    });

    useEffect(() => {
        const querySource = searchParams.get("source");
        const queryPage = searchParams.get("sourcePage");

        setSourceContext({
            source: querySource || "CONTACT_FORM",
            sourcePage: queryPage || pathname || "/contact",
            landingPage: window.location.pathname
        });

        // Pre-select service from query parameter if present
        if (querySource?.includes("DIGITAL_SOLUTIONS")) {
            setFormData(prev => ({ ...prev, serviceInterest: "Enterprise Software & Web Apps" }));
        } else if (querySource?.includes("PRODUCTS") || querySource?.includes("CLEARINVOICE")) {
            setFormData(prev => ({ ...prev, serviceInterest: "ClearInvoice & SaaS Products" }));
        } else if (querySource?.includes("ACADEMICS")) {
            setFormData(prev => ({ ...prev, serviceInterest: "Academic Training & MoUs" }));
        }
    }, [searchParams, pathname]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        try {
            const payload = {
                ...formData,
                ...sourceContext,
                referrer: typeof document !== "undefined" ? document.referrer || null : null
            };

            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "We couldn't submit your request right now. Please try again.");
            }

            setStatus("success");
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                company: "",
                serviceInterest: "",
                message: ""
            });
        } catch (err: any) {
            setStatus("error");
            setErrorMessage(err.message || "We couldn't submit your request right now. Please try again.");
        }
    };

    return (
        <SectionWrapper id="contact-form" className="bg-[#D8E8E2] py-16 md:py-24 relative overflow-hidden">
            <Container className="max-w-4xl mx-auto">

                {/* HEADINGS */}
                <div className="mb-10 md:mb-14 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="inline-block px-3.5 py-1 rounded-full bg-white/80 border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-widest mb-3 shadow-2xs"
                    >
                        START A PROJECT
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight font-serif"
                    >
                        Send Us a <span className="text-[#0F766E]">Message</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-[#334155] text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal"
                    >
                        Tell us about your requirements, timeline, or academic goals. We'll connect you with the appropriate technical lead.
                    </motion.p>
                </div>

                {/* CENTERED FORM CONTAINER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-gray-200/50 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                key="success-state"
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="relative z-10 flex flex-col items-center justify-center text-center py-10 md:py-14"
                            >
                                <div className="w-18 h-18 bg-[#EDF5F2] rounded-2xl flex items-center justify-center mb-5 border border-[#0F766E]/20 shadow-inner">
                                    <CheckCircle2 className="w-10 h-10 text-[#0F766E]" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3 font-serif">Message Received</h3>
                                <p className="text-[#334155] text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
                                    Thank you for contacting SS40 NETWORK. An engineering representative will review your message and reach out shortly.
                                </p>
                                <Button
                                    onClick={() => setStatus("idle")}
                                    className="bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-[#0F766E]/20 cursor-pointer"
                                >
                                    Send Another Message
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form-state"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="relative z-10 flex flex-col gap-5"
                                onSubmit={handleSubmit}
                            >
                                <AnimatePresence>
                                    {status === "error" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-start gap-3"
                                        >
                                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-sm">Unable to Send Message</h4>
                                                <p className="text-xs font-medium mt-0.5">{errorMessage}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Name & Email Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                                            Full Name <span className="text-[#0F766E]">*</span>
                                        </label>
                                        <input
                                            required
                                            disabled={status === "submitting"}
                                            type="text"
                                            id="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 text-sm disabled:opacity-50"
                                            placeholder="e.g. Samuel Raj"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                                            Email Address <span className="text-[#0F766E]">*</span>
                                        </label>
                                        <input
                                            required
                                            disabled={status === "submitting"}
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 text-sm disabled:opacity-50"
                                            placeholder="e.g. samuel@company.com"
                                        />
                                    </div>
                                </div>

                                {/* Phone & Company Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                                            Phone Number <span className="text-[#0F766E]">*</span>
                                        </label>
                                        <input
                                            required
                                            disabled={status === "submitting"}
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 text-sm disabled:opacity-50"
                                            placeholder="e.g. +91 98765 43210"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                                            Company / Institution <span className="text-gray-400 font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            disabled={status === "submitting"}
                                            type="text"
                                            id="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 text-sm disabled:opacity-50"
                                            placeholder="Organization Name"
                                        />
                                    </div>
                                </div>

                                {/* Service Interest Dropdown */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="serviceInterest" className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                                        Area of Interest <span className="text-[#0F766E]">*</span>
                                    </label>

                                    <div className="relative">
                                        <select
                                            required
                                            disabled={status === "submitting"}
                                            id="serviceInterest"
                                            value={formData.serviceInterest}
                                            onChange={handleChange}
                                            className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] appearance-none disabled:opacity-50 text-sm cursor-pointer"
                                        >
                                            <option value="" disabled>Select an area of interest / service</option>
                                            {INTEREST_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Message Textarea */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                                        Project Brief / Query <span className="text-[#0F766E]">*</span>
                                    </label>
                                    <textarea
                                        required
                                        disabled={status === "submitting"}
                                        id="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 resize-none disabled:opacity-50 text-sm"
                                        placeholder="Tell us about what you want to build or discuss..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2 flex justify-start sm:justify-end">
                                    <Button
                                        disabled={status === "submitting"}
                                        type="submit"
                                        className="w-full sm:w-auto bg-[#0F766E] text-white hover:bg-[#115E59] font-bold text-sm px-8 py-3.5 rounded-xl group shadow-lg shadow-[#0F766E]/20 disabled:opacity-70 transition-all duration-300 min-w-[200px] cursor-pointer active:scale-[0.98]"
                                    >
                                        {status === "submitting" ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                                Transmitting...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                Send Message
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

            </Container>
        </SectionWrapper>
    );
}
