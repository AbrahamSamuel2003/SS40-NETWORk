"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Clock,
    Send,
    ArrowRight,
    ChevronDown,
    Check,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { hoverLift, staggerContainer, slideUp } from "@/lib/animations";
import { cn } from "@/utils/cn";
import type { SiteConfigData } from "@/lib/site-config";

const SERVICE_OPTIONS = [
    "Enterprise Software & Web Apps",
    "ClearInvoice & SaaS Products",
    "Academic Training & MoUs",
    "Cloud Architecture & AI Solutions",
    "Corporate Partnership & Consulting",
    "General Inquiry",
    "Other (Please specify)"
];

export function ContactSection({ config }: { config?: SiteConfigData | null }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        serviceInterest: "",
        customInterest: "",
        message: ""
    });

    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!isSelectOpen) return;

        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
                setIsSelectOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside, { passive: true });

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isSelectOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            const finalServiceInterest = formData.serviceInterest === "Other (Please specify)"
                ? (formData.customInterest.trim() ? `Other: ${formData.customInterest.trim()}` : "Other")
                : formData.serviceInterest;

            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                serviceInterest: finalServiceInterest,
                message: formData.message,
                source: "HOME_CONTACT_SECTION",
                sourcePage: "/",
                landingPage: typeof window !== "undefined" ? window.location.pathname : "/",
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
                customInterest: "",
                message: ""
            });
        } catch (err: any) {
            setStatus("error");
            setErrorMessage(err.message || "We couldn't submit your request right now. Please try again.");
        }
    };

    const CONTACT_INFO = [
        {
            icon: Mail,
            label: "Email",
            value: config?.contactEmail || "support@ss40network.com",
            href: config?.contactEmail ? `mailto:${config.contactEmail}` : null
        },
        {
            icon: Phone,
            label: "Phone",
            value: config?.contactPhone || "+91 83005 91750",
            href: config?.contactPhone ? `tel:${config.contactPhone.replace(/\s+/g, '')}` : null
        },
        {
            icon: MapPin,
            label: "Location",
            value: config?.addressText || "1st Floor, Municipal Corporation Incubation Centre\n(Near by trade centre), Sree Puram, Tirunelveli, Tamil Nadu 627001",
            href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((config?.companyName || "SS40 NETWORK PRIVATE LIMITED") + " " + (config?.addressText || "1st Floor, Municipal Corporation Incubation Centre, Sree Puram, Tirunelveli, Tamil Nadu 627001"))}`
        },
        {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "Chat with our team",
            href: config?.whatsappNumber ? `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent("Hello SS40 NETWORK, I would like to connect with your team.")}` : `https://wa.me/918300591750?text=${encodeURIComponent("Hello SS40 NETWORK, I would like to connect with your team.")}`
        },
        {
            icon: Clock,
            label: "Business Hours",
            value: config?.businessHours || "Monday – Friday, 9:00 AM – 6:00 PM",
            href: null
        }
    ];

    return (
        <SectionWrapper id="contact" className="bg-white lg:bg-[#D8E8E2]">
            <Container className="space-y-12 lg:space-y-16">

                {/* Section Header */}
                <SectionHeading
                    badge="Get In Touch"
                    title="Let's Build Something Amazing Together"
                    description="Whether you need digital solutions, business software, or learning programs, our team is ready to help you bring your ideas to life."
                />

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left Column - Contact Information (40%) */}
                    <div className="w-full lg:w-[40%] flex flex-col gap-8 h-full">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideUp}
                            className="text-center lg:text-left flex flex-col items-center lg:items-start"
                        >
                            <h3 className="text-3xl font-bold text-[var(--color-heading)] mb-4">Let's Talk.</h3>
                            <p className="text-[var(--color-body-text)] mb-8">
                                Connect directly with our specialists. We respond to all inquiries within 24 hours.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="flex flex-col gap-4 flex-1 justify-between h-full"
                        >
                            {CONTACT_INFO.map((item, idx) => {
                                const Icon = item.icon;
                                const content = (
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-white lg:bg-gray-50 border border-gray-100 lg:border-transparent flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300 shadow-2xs">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="pt-0.5 text-left">
                                            <p className="text-sm font-semibold text-[var(--color-heading)]">{item.label}</p>
                                            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line">{item.value}</p>
                                        </div>
                                    </div>
                                );

                                return (
                                    <CardMotion
                                        key={idx}
                                        variants={slideUp}
                                        {...hoverLift}
                                        className="p-4 group bg-gray-50/70 lg:bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors cursor-pointer shadow-2xs"
                                    >
                                        {item.href ? (
                                            <a href={item.href} target={item.href?.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                                                {content}
                                            </a>
                                        ) : (
                                            content
                                        )}
                                    </CardMotion>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Right Column - Premium Form (60%) */}
                    <div className="w-full lg:w-[60%] flex flex-col flex-1">
                        <CardMotion
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideUp}
                            className="p-8 md:p-10 bg-white shadow-xl shadow-gray-200/50 border border-[var(--color-border)] rounded-2xl relative overflow-visible flex-1 flex flex-col justify-between z-10"
                        >
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 blur-[80px] rounded-full pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {status === "success" ? (
                                    <motion.div
                                        key="home-success-state"
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
                                            Thank you for reaching out to SS40 NETWORK. Our team will review your inquiry and respond within 24 hours.
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
                                        key="home-form-state"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                        onSubmit={handleSubmit}
                                        className="relative z-10 flex flex-col gap-5"
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            <div className="flex flex-col gap-1.5">
                                                <label htmlFor="fullName" className="text-xs sm:text-sm font-semibold text-[var(--color-heading)]">
                                                    Full Name <span className="text-[#0F766E]">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    placeholder="Enter your full name"
                                                    className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[#FAFCFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-xs sm:text-sm text-[#0F172A] placeholder:text-gray-400"
                                                    required
                                                    disabled={status === "submitting"}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-[var(--color-heading)]">
                                                    Email Address <span className="text-[#0F766E]">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Enter your email address"
                                                    className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[#FAFCFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-xs sm:text-sm text-[#0F172A] placeholder:text-gray-400"
                                                    required
                                                    disabled={status === "submitting"}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone & Company Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                            <div className="flex flex-col gap-1.5">
                                                <label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-[var(--color-heading)]">
                                                    Mobile Number <span className="text-[#0F766E]">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Enter your mobile number"
                                                    className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[#FAFCFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-xs sm:text-sm text-[#0F172A] placeholder:text-gray-400"
                                                    required
                                                    disabled={status === "submitting"}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label htmlFor="company" className="text-xs sm:text-sm font-semibold text-[var(--color-heading)]">
                                                    Company Name <span className="text-gray-400 font-normal">(Optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="company"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    placeholder="Company / Institution"
                                                    className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[#FAFCFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-xs sm:text-sm text-[#0F172A] placeholder:text-gray-400"
                                                    disabled={status === "submitting"}
                                                />
                                            </div>
                                        </div>

                                        {/* Styled Dropdown for Service Required */}
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="serviceInterest" className="text-xs sm:text-sm font-semibold text-[var(--color-heading)] select-none">
                                                Service Required <span className="text-[#0F766E]">*</span>
                                            </label>

                                            <div className="relative" ref={selectRef}>
                                                <input
                                                    type="text"
                                                    required
                                                    tabIndex={-1}
                                                    value={formData.serviceInterest}
                                                    onChange={() => {}}
                                                    className="sr-only"
                                                    aria-hidden="true"
                                                />

                                                <button
                                                    type="button"
                                                    disabled={status === "submitting"}
                                                    onClick={() => setIsSelectOpen(prev => !prev)}
                                                    className={cn(
                                                        "w-full px-4 py-3 rounded-[var(--radius-input)] border bg-[#FAFCFB] flex items-center justify-between text-left transition-all text-xs sm:text-sm cursor-pointer shadow-2xs outline-none touch-manipulation font-sans",
                                                        isSelectOpen
                                                            ? "border-[#0F766E] ring-2 ring-[#0F766E]/20 bg-white"
                                                            : "border-[var(--color-border)] hover:border-[#0F766E]/50",
                                                        formData.serviceInterest ? "text-[#0F172A] font-medium" : "text-gray-400 font-normal"
                                                    )}
                                                >
                                                    <span className="truncate pr-2">
                                                        {formData.serviceInterest || "Select a service category"}
                                                    </span>
                                                    <ChevronDown className={cn(
                                                        "w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0",
                                                        isSelectOpen && "rotate-180 text-[#0F766E]"
                                                    )} />
                                                </button>

                                                <AnimatePresence>
                                                    {isSelectOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -4, scale: 0.99 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: -4, scale: 0.99 }}
                                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                                            data-lenis-prevent="true"
                                                            data-lenis-prevent-wheel="true"
                                                            data-lenis-prevent-touch="true"
                                                            onWheel={(e) => e.stopPropagation()}
                                                            onTouchMove={(e) => e.stopPropagation()}
                                                            className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/10 p-1.5 flex flex-col gap-0.5 max-h-48 overflow-y-auto overscroll-contain"
                                                            style={{
                                                                scrollbarWidth: 'thin',
                                                                scrollbarColor: '#0F766E #EDF5F2'
                                                            }}
                                                        >
                                                            {SERVICE_OPTIONS.map((opt) => {
                                                                const isSelected = formData.serviceInterest === opt;
                                                                return (
                                                                    <button
                                                                        key={opt}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData(prev => ({ ...prev, serviceInterest: opt }));
                                                                            setIsSelectOpen(false);
                                                                        }}
                                                                        className={cn(
                                                                            "w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm font-sans transition-colors flex items-center justify-between cursor-pointer touch-manipulation",
                                                                            isSelected
                                                                                ? "bg-[#EDF5F2] text-[#0F766E] font-semibold"
                                                                                : "text-[#0F172A] hover:bg-[#F8FAF9] hover:text-[#0F766E] font-normal"
                                                                        )}
                                                                    >
                                                                        <span className="truncate pr-2">{opt}</span>
                                                                        {isSelected && (
                                                                            <Check className="w-4 h-4 text-[#0F766E] shrink-0 stroke-[2.5]" />
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Custom Service Input (Shows when "Other (Please specify)" is selected) */}
                                            <AnimatePresence>
                                                {formData.serviceInterest === "Other (Please specify)" && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0, y: -4 }}
                                                        animate={{ opacity: 1, height: "auto", y: 0 }}
                                                        exit={{ opacity: 0, height: 0, y: -4 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex flex-col gap-1 overflow-hidden pt-1.5"
                                                    >
                                                        <label htmlFor="customInterest" className="text-xs font-semibold text-[#0F172A]">
                                                            Please Specify Your Required Service <span className="text-[#0F766E]">*</span>
                                                        </label>
                                                        <input
                                                            required
                                                            disabled={status === "submitting"}
                                                            type="text"
                                                            id="customInterest"
                                                            value={formData.customInterest}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[#FAFCFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all text-xs sm:text-sm text-[#0F172A] placeholder:text-gray-400 disabled:opacity-50"
                                                            placeholder="E.g., Custom SaaS development, IT consultation, MoU..."
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Project Message */}
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="message" className="text-xs sm:text-sm font-semibold text-[var(--color-heading)]">
                                                Project Message <span className="text-[#0F766E]">*</span>
                                            </label>
                                            <textarea
                                                id="message"
                                                rows={4}
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell us about your project or inquiry..."
                                                className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[#FAFCFB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] transition-all resize-none text-xs sm:text-sm text-[#0F172A] placeholder:text-gray-400"
                                                required
                                                disabled={status === "submitting"}
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                                            <Button
                                                type="submit"
                                                size="lg"
                                                disabled={status === "submitting"}
                                                className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#115E59] text-white shadow-lg shadow-[#0F766E]/20 group disabled:opacity-70 transition-all duration-300 min-w-[180px] cursor-pointer"
                                            >
                                                {status === "submitting" ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                                        Transmitting...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-1.5">
                                                        Send Message
                                                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </CardMotion>

                    </div>
                </div>

                {/* WhatsApp CTA Card (Centered below columns - Optimized Performance) */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full lg:w-[60%] mx-auto mt-8 lg:mt-12 bg-white/80 backdrop-blur-md border border-[#0F766E]/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-sm transform-gpu"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <MessageCircle className="w-24 h-24 text-[#0F766E]" />
                    </div>
                    <div className="relative z-10 text-center sm:text-left">
                        <h4 className="text-lg font-bold text-[#0F172A] mb-1">Need a quicker response?</h4>
                        <p className="text-sm text-[#334155]">Our support team is active on WhatsApp.</p>
                    </div>
                    <Button asChild className="relative z-10 whitespace-nowrap bg-[#25D366] hover:bg-[#128C7E] text-white border-[#25D366] hover:border-[#128C7E] shadow-lg shadow-[#25D366]/20 group transition-transform hover:scale-105 active:scale-95">
                        <a href={config?.whatsappNumber ? `https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent("Hello SS40 NETWORK, I need assistance.")}` : `https://wa.me/918300591750?text=${encodeURIComponent("Hello SS40 NETWORK, I need assistance.")}`} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 w-5 h-5 fill-current" />
                            Chat on WhatsApp
                        </a>
                    </Button>
                </motion.div>
            </Container>
        </SectionWrapper>
    );
}

