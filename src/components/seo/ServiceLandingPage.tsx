"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    CheckCircle2,
    MessageSquare,
    PhoneCall,
    MapPin,
    ShieldCheck,
    Cpu,
    ExternalLink,
    Layers,
    Code2,
    Compass,
    Clock,
    Briefcase,
    Handshake,
    Scaling,
    Plus,
    Minus,
    HelpCircle
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { SEOServiceItem } from "@/data/seo-services";

interface ServiceLandingPageProps {
    service: SEOServiceItem;
    relatedServices?: SEOServiceItem[];
}

// Helper function to render **bold** keywords as semantic <strong> tags for search engines
export function renderFormattedText(text: string) {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={i} className="font-bold text-gray-900">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
}

export function ServiceLandingPage({ service, relatedServices = [] }: ServiceLandingPageProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const whatsappMessage = encodeURIComponent(
        `Hello SS40 NETWORK! I am interested in your ${service.title}. I would like to schedule a consultation and get a quote.`
    );
    const whatsappUrl = `https://wa.me/918300591750?text=${whatsappMessage}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `https://ss40network.com/${service.slug}`,
                "url": `https://ss40network.com/${service.slug}`,
                "name": service.metaTitle,
                "description": service.metaDescription,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": "https://ss40network.com/#website",
                    "url": "https://ss40network.com",
                    "name": "SS40 NETWORK"
                },
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://ss40network.com"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Services Directory",
                            "item": "https://ss40network.com/blog"
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": service.title,
                            "item": `https://ss40network.com/${service.slug}`
                        }
                    ]
                }
            },
            {
                "@type": "Service",
                "@id": `https://ss40network.com/${service.slug}#service`,
                "name": service.title,
                "serviceType": service.category,
                "description": service.summary,
                "provider": {
                    "@type": "LocalBusiness",
                    "name": "SS40 NETWORK PRIVATE LIMITED",
                    "telephone": "+91 83005 91750",
                    "email": "support@ss40network.com",
                    "url": "https://ss40network.com",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "1st Floor, Municipal Corporation Incubation Centre (Near Trade Centre), Sree Puram",
                        "addressLocality": "Tirunelveli",
                        "addressRegion": "Tamil Nadu",
                        "postalCode": "627001",
                        "addressCountry": "IN"
                    }
                },
                "areaServed": {
                    "@type": service.city === "India" ? "Country" : (service.city === "Tamil Nadu" ? "State" : "City"),
                    "name": service.city === "India" ? "India" : (service.city === "Tamil Nadu" ? "Tamil Nadu" : `${service.city}, Tamil Nadu`)
                }
            },
            {
                "@type": "FAQPage",
                "@id": `https://ss40network.com/${service.slug}#faq`,
                "mainEntity": service.faqs.map((faq) => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        ]
    };

    return (
        <article className="min-h-screen bg-white text-[#1F2937]">
            {/* Inject JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* 1. HERO SECTION (Safe Navbar Clearance) */}
            <header className="relative overflow-hidden bg-gradient-to-b from-[#F0FDF4]/30 via-white to-white pt-28 pb-16 lg:pt-36 lg:pb-24 border-b border-gray-100">
                <div className="absolute inset-0 bg-[radial-gradient(#0F766E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />
                
                <Container className="relative z-10">
                    <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                        {/* Category & Badge Pill */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F766E]/10 border border-[#0F766E]/20 text-[#0F766E] text-xs sm:text-sm font-semibold mb-6 shadow-xs">
                            <span>{service.badgeText}</span>
                            <span className="w-1 h-1 rounded-full bg-[#0F766E]" />
                            <span>{service.category}</span>
                        </div>

                        {/* H1 Headline with Keyword Emphasis */}
                        <h1 
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#111827] leading-[1.15] mb-6"
                            style={{ fontFamily: "var(--font-crimson-pro), Georgia, serif" }}
                        >
                            {service.heroHeadline}{" "}
                            <span className="text-[#0F766E]">
                                {service.heroHighlight}
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-8">
                            {renderFormattedText(service.heroSubtitle)}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
                            <Button asChild size="lg" className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#115E59] text-white shadow-lg shadow-[#0F766E]/20 rounded-xl px-8 h-12 text-sm font-semibold transition-all">
                                <Link href={`/contact?service=${encodeURIComponent(service.title)}&source=${service.slug}`}>
                                    Request Free Consultation
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-semibold text-sm transition-all"
                            >
                                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </Container>
            </header>

            {/* 2. CORE DELIVERABLES GRID (SS40 Signature Mint) */}
            <section className="py-16 lg:py-20 bg-[#D8E8E2] border-y border-[#0F766E]/15">
                <Container>
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">What We Engineer</span>
                        <h2 
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2"
                            style={{ fontFamily: "var(--font-crimson-pro), Georgia, serif" }}
                        >
                            Specialized Capabilities in <span className="text-[#0F766E]">{service.title}</span>
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base mt-2">
                            Engineered with clean architecture, enterprise security, and verified sub-second speed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {service.deliverables.map((item, index) => (
                            <div
                                key={index}
                                className="group relative bg-white hover:bg-white p-6 sm:p-8 rounded-2xl border border-[#0F766E]/15 hover:border-[#0F766E]/40 shadow-xs hover:shadow-xl hover:shadow-[#0F766E]/5 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center font-bold text-sm shrink-0">
                                            0{index + 1}
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#0F766E] transition-colors leading-snug">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {renderFormattedText(item.description)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* 3. IN-DEPTH OVERVIEW & LOCAL ADVANTAGES */}
            <section className="py-16 lg:py-20 bg-white">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                        {/* Left column: Narrative Text */}
                        <div className="lg:col-span-7 flex flex-col gap-5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">Regional Expertise</span>
                            <h2 
                                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
                                style={{ fontFamily: "var(--font-crimson-pro), Georgia, serif" }}
                            >
                                Why Choose SS40 NETWORK for {service.title}?
                            </h2>
                            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                                {service.overview.map((paragraph, idx) => (
                                    <p key={idx}>{renderFormattedText(paragraph)}</p>
                                ))}
                            </div>

                            {/* Tech Stack Chips */}
                            <div className="pt-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Core Technologies Deployed</h4>
                                <div className="flex flex-wrap gap-2">
                                    {service.techStack.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 rounded-lg bg-[#F9FBFA] border border-gray-200/80 text-xs font-semibold text-gray-700 shadow-2xs"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right column: Why Us Key Benefits */}
                        <div className="lg:col-span-5 bg-[#F9FBFA] p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
                                The SS40 Engineering Advantage
                            </h3>
                            <ul className="space-y-4">
                                {service.whyChooseUs.map((benefit, bIdx) => (
                                    <li key={bIdx} className="flex items-start gap-3 text-sm text-gray-700 leading-normal">
                                        <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                                        <span>{renderFormattedText(benefit)}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                                <div className="text-xs text-gray-500">
                                    Have a project in mind for {service.city}? Speak directly with our lead architects.
                                </div>
                                <Button asChild className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold">
                                    <Link href={`/contact?service=${encodeURIComponent(service.title)}`}>
                                        Schedule Free Strategy Call
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* 4. INTERACTIVE FAQ ACCORDION (Contact Page Design Aesthetic) */}
            <section className="py-16 md:py-24 bg-[#D8E8E2] border-y border-[#0F766E]/15 relative">
                <Container className="max-w-4xl mx-auto flex flex-col items-center">
                    <div className="text-center mb-10 md:mb-14">
                        <div className="inline-block px-3.5 py-1 rounded-full bg-white/80 border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-widest mb-3 shadow-2xs">
                            COMMON INQUIRIES
                        </div>
                        <h2 
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight"
                            style={{ fontFamily: "var(--font-crimson-pro), Georgia, serif" }}
                        >
                            Frequently Asked Questions About <span className="text-[#0F766E]">{service.title}</span>
                        </h2>
                    </div>

                    {/* FAQ ACCORDION LIST */}
                    <div className="w-full flex flex-col gap-3.5">
                        {service.faqs.map((faq, index) => {
                            const isOpen = openFaqIndex === index;
                            return (
                                <div
                                    key={index}
                                    className={`w-full rounded-2xl transition-all duration-300 border ${
                                        isOpen
                                            ? 'bg-[#FAFCFB] border-[#0F766E]/30 shadow-md shadow-[#0F766E]/5'
                                            : 'bg-white border-gray-200/70 hover:border-[#0F766E]/30 shadow-xs'
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                                        className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                                        aria-expanded={isOpen}
                                    >
                                        <span 
                                            className={`font-bold text-base md:text-lg transition-colors pr-6 leading-snug ${
                                                isOpen ? 'text-[#0F766E]' : 'text-gray-900'
                                            }`}
                                            style={{ fontFamily: "var(--font-crimson-pro), Georgia, serif" }}
                                        >
                                            {faq.question}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                                            isOpen ? 'bg-[#0F766E] text-white' : 'bg-[#0F766E]/10 text-[#0F766E]'
                                        }`}>
                                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 md:px-6 pb-6 text-gray-700 text-sm md:text-base leading-relaxed border-t border-gray-100/80 pt-4 font-normal">
                                                    {renderFormattedText(faq.answer)}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* BOTTOM CONCIERGE STRIP */}
                    <div className="w-full mt-10 sm:mt-12 p-5 sm:p-6 rounded-2xl bg-white/90 border border-[#0F766E]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E] shadow-2xs shrink-0">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900">Have a question not listed here?</h4>
                                <p className="text-xs text-gray-600">Our engineering representatives {service.city === "India" ? "across India" : `in ${service.city}`} are available online.</p>
                            </div>
                        </div>

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold transition-all shadow-xs shrink-0"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Chat on WhatsApp
                        </a>
                    </div>
                </Container>
            </section>

            {/* 5. RELATED REGIONAL SERVICES & DIRECTORY CROSS-LINKS */}
            {relatedServices.length > 0 && (
                <section className="py-14 bg-white border-t border-gray-200/70">
                    <Container>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">Internal Knowledge Network</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-1">Explore Related Regional Services</h3>
                            </div>
                            <Button asChild variant="outline" size="sm" className="self-start sm:self-auto border-gray-300 text-gray-700 hover:text-[#0F766E]">
                                <Link href="/blog">
                                    Browse All 18 Services Directory →
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {relatedServices.slice(0, 3).map((rel, rIdx) => (
                                <Link
                                    key={rIdx}
                                    href={`/${rel.slug}`}
                                    className="p-5 bg-[#F9FBFA] hover:bg-white rounded-xl border border-gray-200/80 hover:border-[#0F766E]/40 hover:shadow-md transition-all group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-[#0F766E] mb-2">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{rel.city}</span>
                                            <span className="text-gray-300">•</span>
                                            <span>{rel.category}</span>
                                        </div>
                                        <h4 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#0F766E] transition-colors mb-2">
                                            {rel.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {rel.summary}
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-xs font-bold text-[#0F766E] group-hover:translate-x-1 transition-transform">
                                        View Details →
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* 6. LIGHT-THEMED HARMONIZED LEAD CONVERSION SECTION (SS40 Signature Mint) */}
            <section className="relative overflow-hidden bg-[#D8E8E2] border-t border-[#0F766E]/20 py-16 lg:py-20">
                {/* Ambient Subtle Glows */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                    />
                    <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-[#0F766E]/10 blur-[120px] rounded-full -translate-x-1/3 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#14B8A6]/10 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3" />
                </div>

                <Container className="relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Left Column (55%) */}
                        <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#0F766E]/20 text-[#0F766E] text-xs font-semibold mb-5 shadow-xs">
                                <span>{service.city === "India" ? "Start Your Project Today" : `Start Your Project in ${service.city}`}</span>
                            </div>

                            <h2
                                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.2] tracking-tight mb-5"
                                style={{ fontFamily: "var(--font-crimson-pro), Georgia, serif" }}
                            >
                                Ready to Partner with a Leading{" "}
                                <span className="text-[#0F766E]">{service.title}</span>?
                            </h2>

                            <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-xl leading-relaxed">
                                Book a free 30-minute discovery session with our software engineering team at our Tirunelveli incubation centre or schedule a direct video consultation.
                            </p>

                            {/* Trust Indicators Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl">
                                <div className="bg-white/90 border border-[#0F766E]/15 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                                    <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">Tailored Engineering & Architecture</span>
                                </div>
                                <div className="bg-white/90 border border-[#0F766E]/15 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                                    <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">Direct Local Communications</span>
                                </div>
                                <div className="bg-white/90 border border-[#0F766E]/15 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                                    <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <Scaling className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">Scalable Next-Gen Platforms</span>
                                </div>
                                <div className="bg-white/90 border border-[#0F766E]/15 rounded-xl p-3.5 flex items-center gap-3 shadow-2xs">
                                    <div className="w-9 h-9 rounded-lg bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <Handshake className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">Long-Term Maintenance Partnership</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column (45%) - Floating White Card */}
                        <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
                            <div className="w-full max-w-[460px] bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#0F766E]/10 border border-[#0F766E]/20 relative overflow-hidden flex flex-col items-center text-center">
                                {/* Top Accent Bar */}
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0F766E] to-[#14B8A6]" />

                                <div className="w-14 h-14 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E] mb-5 shadow-inner">
                                    <MessageSquare className="w-7 h-7" />
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    Request a Free Custom Quote
                                </h3>
                                <p className="text-gray-500 text-xs sm:text-sm mb-6 max-w-xs">
                                    Share your project scope for {service.title} with our engineering team.
                                </p>

                                <div className="w-full flex flex-col gap-3">
                                    <Button asChild size="lg" className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#0F766E]/20">
                                        <Link href={`/contact?service=${encodeURIComponent(service.title)}`}>
                                            Get Free Proposal
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>

                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-semibold text-xs transition-all"
                                    >
                                        <MessageSquare className="w-4 h-4 text-[#25D366]" />
                                        Chat on WhatsApp
                                    </a>
                                </div>

                                <div className="mt-5 flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                                    <span>Average response time: &lt; 2 hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </article>
    );
}
