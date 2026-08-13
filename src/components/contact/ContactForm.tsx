"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Briefcase, GraduationCap, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
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
                referrer: document.referrer || null
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
            // We do NOT automatically revert to idle. The user must click "Send Another Message".
        } catch (err: any) {
            setStatus("error");
            setErrorMessage(err.message || "We couldn't submit your request right now. Please try again.");
        }
    };

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

                    {/* LEFT: FORM OR SUCCESS STATE */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="w-full lg:w-2/3 bg-white border border-gray-100 rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/40 relative overflow-hidden"
                    >
                        {/* Soft background glow within the form card */}
                        <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#6B9F91]/5 blur-[80px] rounded-full pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    key="success-state"
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative z-10 flex flex-col items-center justify-center text-center py-10 md:py-20"
                                >
                                    <div className="w-20 h-20 bg-[#EDF5F2] rounded-full flex items-center justify-center mb-6 border border-[#6B9F91]/20 shadow-inner">
                                        <CheckCircle2 className="w-10 h-10 text-[#6B9F91]" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-4">Message Sent Successfully</h3>
                                    <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto mb-10 leading-relaxed font-medium">
                                        Thank you for reaching out to SS40 NETWORK. We've received your message and our team will get back to you soon.
                                    </p>
                                    <Button
                                        onClick={() => setStatus("idle")}
                                        variant="outline"
                                        className="border-gray-200 text-gray-700 font-bold hover:bg-gray-50 px-8 py-6 rounded-full shadow-sm"
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
                                    className="relative z-10 flex flex-col gap-6"
                                    onSubmit={handleSubmit}
                                >
                                    <AnimatePresence>
                                        {status === "error" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 mb-2"
                                            >
                                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-sm">Unable to Send Message</h4>
                                                    <p className="text-sm font-medium mt-1">{errorMessage}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="fullName" className="text-sm font-bold text-[#111827]">Full Name</label>
                                            <input required disabled={status === "submitting"} type="text" id="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400 disabled:opacity-50" placeholder="Full Name" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="email" className="text-sm font-bold text-[#111827]">Email Address</label>
                                            <input required disabled={status === "submitting"} type="email" id="email" value={formData.email} onChange={handleChange} className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400 disabled:opacity-50" placeholder="Email Address" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="phone" className="text-sm font-bold text-[#111827]">Phone Number</label>
                                            <input required disabled={status === "submitting"} type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400 disabled:opacity-50" placeholder="Mobile Number" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="company" className="text-sm font-bold text-[#111827]">Company / Institution <span className="text-gray-400 font-normal">(Optional)</span></label>
                                            <input disabled={status === "submitting"} type="text" id="company" value={formData.company} onChange={handleChange} className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400 disabled:opacity-50" placeholder="Company Name (Optional)" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="serviceInterest" className="text-sm font-bold text-[#111827]">Interested In</label>
                                        <select required disabled={status === "submitting"} id="serviceInterest" value={formData.serviceInterest} onChange={handleChange} className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 appearance-none disabled:opacity-50">
                                            <option value="" disabled>Select an option</option>
                                            {INTEREST_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="message" className="text-sm font-bold text-[#111827]">Message</label>
                                        <textarea required disabled={status === "submitting"} id="message" value={formData.message} onChange={handleChange} rows={5} className="w-full bg-[#EDF5F2] border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#6B9F91]/30 focus:border-[#6B9F91] transition-all text-gray-900 placeholder:text-gray-400 resize-none disabled:opacity-50" placeholder="Project Message"></textarea>
                                    </div>

                                    <motion.div whileHover={{ scale: status !== "submitting" ? 1.01 : 1 }} whileTap={{ scale: status !== "submitting" ? 0.98 : 1 }} className="mt-4">
                                        <Button disabled={status === "submitting"} type="submit" className="w-full sm:w-auto bg-[#6B9F91] text-white hover:bg-[#5C8C80] font-bold text-base px-10 py-6 rounded-full group shadow-lg shadow-[#6B9F91]/20 disabled:opacity-70 transition-all duration-300 min-w-[200px]">
                                            {status === "submitting" ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 rounded-full border-2 border-white items-center justify-center border-t-transparent animate-spin"></div>
                                                    Sending...
                                                </span>
                                            ) : status === "error" ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    Try Again
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    Send Message
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            )}
                                        </Button>
                                    </motion.div>
                                </motion.form>
                            )}
                        </AnimatePresence>
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
