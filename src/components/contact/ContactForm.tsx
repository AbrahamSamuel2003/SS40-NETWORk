"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertCircle, ChevronDown, Plus, Minus, HelpCircle, MessageSquare } from "lucide-react";
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

const FAQ_DATA = [
    {
        question: "How quickly will our team receive a response?",
        answer: "Our core engineering and advisory team typically reviews inquiries and replies within 1 business day. For urgent business requirements, you can also reach us via direct WhatsApp."
    },
    {
        question: "Does SS40 Network handle custom enterprise development?",
        answer: "Yes. We design, architect, and deploy full-stack custom platforms, high-scale web applications, mobile apps, and proprietary AI automation workflows tailored to enterprise needs."
    },
    {
        question: "Can we request a demonstration of ClearInvoice or other SaaS products?",
        answer: "Certainly. Our product architects can organize a 1-on-1 virtual walkthrough to demonstrate features, integration capabilities, and deployment architecture."
    },
    {
        question: "How can educational institutions establish an academic MoU?",
        answer: "Through SS40 ACADEMICS, we partner with engineering colleges, universities, and polytechnics to provide hands-on software development training, live capstone projects, and industry internship programs."
    },
    {
        question: "Where are you located for in-person consultations?",
        answer: "Our headquarters is located at the 1st Floor, Municipal Corporation Incubation Centre, Sree Puram, Tirunelveli. In-person meetings are welcome during business hours."
    }
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
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
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
        <SectionWrapper id="contact-form" className="bg-[#D8E8E2] py-14 sm:py-16 lg:py-20 relative overflow-hidden">
            <Container className="max-w-3xl lg:max-w-7xl mx-auto">

                {/* SECTION HEADER */}
                <div className="mb-10 lg:mb-12 text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="inline-block px-3.5 py-1 rounded-full bg-white/80 border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-widest mb-2.5 shadow-2xs"
                    >
                        START A PROJECT
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mb-2 tracking-tight font-serif"
                    >
                        Send Us a <span className="text-[#0F766E]">Message</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-[#334155] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-normal"
                    >
                        Tell us about your requirements, timeline, or academic goals. We'll connect you with the appropriate technical lead.
                    </motion.p>
                </div>

                {/* 2-COLUMN UNIFIED DESKTOP GRID / 1-COLUMN ON MOBILE */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* LEFT COLUMN: START A PROJECT FORM (7 COLS ON DESKTOP, FULL WIDTH ON MOBILE) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="w-full lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/50 relative overflow-hidden"
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
                                    <div className="w-16 h-16 bg-[#EDF5F2] rounded-2xl flex items-center justify-center mb-4 border border-[#0F766E]/20 shadow-inner">
                                        <CheckCircle2 className="w-9 h-9 text-[#0F766E]" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2 font-serif">Message Received</h3>
                                    <p className="text-[#334155] text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                                        Thank you for contacting SS40 NETWORK. An engineering representative will review your message and reach out shortly.
                                    </p>
                                    <Button
                                        onClick={() => setStatus("idle")}
                                        className="bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-[#0F766E]/20 cursor-pointer"
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
                                    className="relative z-10 flex flex-col gap-4"
                                    onSubmit={handleSubmit}
                                >
                                    <AnimatePresence>
                                        {status === "error" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl flex items-start gap-2.5"
                                            >
                                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-bold text-xs">Unable to Send Message</h4>
                                                    <p className="text-[11px] font-medium mt-0.5">{errorMessage}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Name & Email Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="fullName" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                                                Full Name <span className="text-[#0F766E]">*</span>
                                            </label>
                                            <input
                                                required
                                                disabled={status === "submitting"}
                                                type="text"
                                                id="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 text-xs sm:text-sm disabled:opacity-50"
                                                placeholder="Enter your full name..."
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                                                Email Address <span className="text-[#0F766E]">*</span>
                                            </label>
                                            <input
                                                required
                                                disabled={status === "submitting"}
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 text-xs sm:text-sm disabled:opacity-50"
                                                placeholder="Enter your email address..."
                                            />
                                        </div>
                                    </div>

                                    {/* Phone & Company Row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                                                Phone Number <span className="text-[#0F766E]">*</span>
                                            </label>
                                            <input
                                                required
                                                disabled={status === "submitting"}
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 text-xs sm:text-sm disabled:opacity-50"
                                                placeholder="Enter your phone number..."
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="company" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                                                Company / Institution <span className="text-gray-400 font-normal">(Optional)</span>
                                            </label>
                                            <input
                                                disabled={status === "submitting"}
                                                type="text"
                                                id="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 text-xs sm:text-sm disabled:opacity-50"
                                                placeholder="Enter your company or institution name..."
                                            />
                                        </div>
                                    </div>

                                    {/* Service Interest Dropdown with Company Theme */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="serviceInterest" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                                            Area of Interest <span className="text-[#0F766E]">*</span>
                                        </label>

                                        <div className="relative group">
                                            <select
                                                required
                                                disabled={status === "submitting"}
                                                id="serviceInterest"
                                                value={formData.serviceInterest}
                                                onChange={handleChange}
                                                className="w-full bg-[#FAFCFB] border border-[#0F766E]/30 rounded-xl px-3.5 py-2.5 pr-11 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] font-medium appearance-none disabled:opacity-50 text-xs sm:text-sm cursor-pointer hover:border-[#0F766E]/60 shadow-2xs"
                                            >
                                                <option value="" disabled className="text-gray-400">Select an area of interest / service</option>
                                                {INTEREST_OPTIONS.map((opt) => (
                                                    <option key={opt} value={opt} className="text-[#0F172A] bg-white py-1.5 font-medium">{opt}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-6 h-6 rounded-lg bg-[#EDF5F2] flex items-center justify-center text-[#0F766E] border border-[#0F766E]/25 group-hover:bg-[#0F766E] group-hover:text-white transition-colors">
                                                <ChevronDown className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message Textarea */}
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                                            Project Brief / Query <span className="text-[#0F766E]">*</span>
                                        </label>
                                        <textarea
                                            required
                                            disabled={status === "submitting"}
                                            id="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full bg-[#FAFCFB] border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-[#0F172A] placeholder:text-gray-400 resize-none disabled:opacity-50 text-xs sm:text-sm"
                                            placeholder="Enter your message, project brief, or query..."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-1.5 flex justify-start sm:justify-end">
                                        <Button
                                            disabled={status === "submitting"}
                                            type="submit"
                                            className="w-full sm:w-auto bg-[#0F766E] text-white hover:bg-[#115E59] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl group shadow-lg shadow-[#0F766E]/20 disabled:opacity-70 transition-all duration-300 min-w-[180px] cursor-pointer active:scale-[0.98]"
                                        >
                                            {status === "submitting" ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                                    Transmitting...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-1.5">
                                                    Send Message
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* RIGHT COLUMN: COMMON INQUIRIES & FAQ ACCORDION (5 COLS ON DESKTOP, HIDDEN ON MOBILE) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="hidden lg:flex lg:col-span-5 flex-col gap-3.5"
                    >
                        <div className="flex items-center gap-2 px-1 mb-1">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/90 border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-widest shadow-2xs">
                                COMMON INQUIRIES
                            </span>
                            <span className="text-xs font-bold text-gray-500">· FAQs</span>
                        </div>

                        {FAQ_DATA.map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className={`w-full rounded-2xl transition-all duration-300 border ${
                                        isOpen
                                            ? 'bg-white border-[#0F766E]/30 shadow-md shadow-[#0F766E]/5'
                                            : 'bg-white/80 border-gray-200/80 hover:bg-white hover:border-[#0F766E]/20 shadow-xs'
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full text-left px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 focus:outline-none cursor-pointer"
                                        aria-expanded={isOpen}
                                    >
                                        <span className={`text-xs sm:text-sm font-bold transition-colors ${
                                            isOpen ? 'text-[#0F766E]' : 'text-[#0F172A]'
                                        }`}>
                                            {faq.question}
                                        </span>
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                            isOpen ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 sm:px-5 pb-3.5 text-xs text-[#334155] leading-relaxed border-t border-gray-100/80 pt-2.5">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}

                        {/* Direct WhatsApp / Advisory Helper Card */}
                        <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs flex items-center justify-between gap-3 mt-1">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] border border-[#0F766E]/20 text-[#0F766E] flex items-center justify-center shrink-0">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-[#0F172A] truncate">Need direct assistance?</p>
                                    <p className="text-[11px] text-gray-500 truncate">Connect with our desk on WhatsApp</p>
                                </div>
                            </div>
                            <a
                                href="https://wa.me/918300591750?text=Hello%20SS40%20Network%2C%20I%20have%20an%20inquiry."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-[#0F766E] text-white hover:bg-[#115E59] text-xs font-bold rounded-lg transition-colors shrink-0 shadow-xs inline-flex items-center gap-1"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </motion.div>

                </div>

            </Container>
        </SectionWrapper>
    );
}
