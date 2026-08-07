"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Clock,
    Send,
    Calendar,
    ArrowRight
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { hoverLift, staggerContainer, slideUp, fadeIn } from "@/lib/animations";
import { cn } from "@/utils/cn";

const CONTACT_INFO = [
    {
        icon: Mail,
        label: "Email",
        value: "support@ss40network.com",
        href: "mailto:support@ss40network.com"
    },
    {
        icon: Phone,
        label: "Phone",
        value: "+91 83005 91750",
        href: "tel:+918300591750"
    },
    {
        icon: MapPin,
        label: "Location",
        value: "SS40 NETWORK PRIVATE LIMITED, 1st Floor, Municipal Corporation Incubation Centre\n(Near by trade centre), Sree Puram, Tirunelveli, Tamil Nadu 627001.",
        href: "https://goo.gl/maps/DWiCMVGgqKi2r5188"
    },
    {
        icon: MessageCircle,
        label: "WhatsApp",
        value: "Chat with our team",
        href: "https://wa.me/918300591750"
    },
    {
        icon: Clock,
        label: "Business Hours",
        value: "Monday – Friday, 9:00 AM – 6:00 PM",
        href: null
    }
];

export function ContactSection() {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Form submission logic will be handled here
    };

    return (
        <SectionWrapper id="contact" className="bg-white">
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
                                        <div className="w-12 h-12 shrink-0 rounded-full bg-gray-50 flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
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
                                        className="p-4 group bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 transition-colors cursor-pointer"
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
                            className="p-8 md:p-10 bg-white shadow-xl shadow-gray-200/50 border border-[var(--color-border)] rounded-2xl relative overflow-hidden flex-1 flex flex-col justify-between"
                        >
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 blur-[80px] rounded-full pointer-events-none" />

                            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="fullName" className="text-sm font-semibold text-[var(--color-heading)]">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            placeholder="Full Name"
                                            className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-[var(--color-heading)]">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Email Address"
                                            className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="mobile" className="text-sm font-semibold text-[var(--color-heading)]">Mobile Number</label>
                                        <input
                                            type="tel"
                                            id="mobile"
                                            placeholder="Mobile Number"
                                            className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="company" className="text-sm font-semibold text-[var(--color-heading)]">Company Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                                        <input
                                            type="text"
                                            id="company"
                                            placeholder="Company Name (Optional)"
                                            className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="service" className="text-sm font-semibold text-[var(--color-heading)]">Service Required</label>
                                    <select
                                        id="service"
                                        className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all appearance-none cursor-pointer"
                                        required
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select a service category</option>
                                        <option value="digital-solutions">Digital Solutions</option>
                                        <option value="products">Products</option>
                                        <option value="academics">Academics</option>
                                        <option value="general">General Inquiry</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="text-sm font-semibold text-[var(--color-heading)]">Project Message</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        placeholder="Project Message"
                                        className="w-full px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                                    <Button type="submit" size="lg" className="w-full sm:w-auto shadow-lg shadow-[var(--color-primary)]/20 group">
                                        Send Message
                                        <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </form>
                        </CardMotion>

                    </div>
                </div>

                {/* WhatsApp CTA Card (Centered below columns) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.4 }}
                    className="w-full lg:w-[60%] mx-auto mt-8 lg:mt-12 bg-[var(--color-hero)]/30 border border-[var(--color-primary)]/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <MessageCircle className="w-24 h-24 text-[var(--color-primary)]" />
                    </div>
                    <div className="relative z-10 text-center sm:text-left">
                        <h4 className="text-lg font-bold text-[var(--color-heading)] mb-1">Need a quicker response?</h4>
                        <p className="text-sm text-[var(--color-body-text)]">Our support team is active on WhatsApp.</p>
                    </div>
                    <Button asChild className="relative z-10 whitespace-nowrap bg-[#25D366] hover:bg-[#128C7E] text-white border-[#25D366] hover:border-[#128C7E] shadow-lg shadow-[#25D366]/20 group">
                        <a href="https://wa.me/918300591750" target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="mr-2 w-5 h-5 fill-current" />
                            Chat on WhatsApp
                        </a>
                    </Button>
                </motion.div>
            </Container>
        </SectionWrapper>
    );
}
