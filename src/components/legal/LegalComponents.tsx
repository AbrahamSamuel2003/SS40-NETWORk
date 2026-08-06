"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Shield, Mail, Lock, UserCheck, HelpCircle, Globe, Layers, Users, Scale, RefreshCcw, FileX, AlertCircle, LifeBuoy } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// -- ICON MAP --
const ICON_MAP: Record<string, React.ElementType> = {
    Shield,
    Mail,
    Lock,
    UserCheck,
    HelpCircle,
    Globe,
    Layers,
    Users,
    Scale,
    RefreshCcw,
    FileX,
    AlertCircle,
    LifeBuoy
};

// --- HERO ---
export function LegalHero({ title, description, lastUpdated }: { title: string, description: string, lastUpdated: string }) {
    return (
        <section className="bg-white pt-32 pb-14 md:pt-40 md:pb-20 lg:pb-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#EDF5F2] to-white pointer-events-none" />
            <Container className="relative z-10 flex flex-col items-center text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-3 py-1.5 rounded-full bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20 text-[10px] font-bold uppercase tracking-widest mb-6"
                >
                    LEGAL
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#111827] mb-6 tracking-tight"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium mb-8"
                >
                    {description}
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 text-sm font-bold text-[#111827] bg-[#EDF5F2] px-4 py-2 rounded-lg border border-gray-100"
                >
                    <Calendar className="w-4 h-4 text-[#6B9F91]" />
                    Last Updated: <span className="text-gray-500 font-medium">{lastUpdated}</span>
                </motion.div>
            </Container>
        </section>
    );
}

// --- QUICK SUMMARY ---
export function LegalSummaryBlocks({ summaries }: { summaries: { title: string, description: string, icon: string }[] }) {
    return (
        <section className="bg-white pb-14 md:pb-20 lg:pb-24 relative z-10">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {summaries.map((item, idx) => {
                        const Icon = ICON_MAP[item.icon] || HelpCircle;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                                className="bg-[#EDF5F2] rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all group"
                            >
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:bg-[#6B9F91]/5 transition-colors border border-gray-50">
                                    <Icon className="w-5 h-5 text-[#6B9F91]" />
                                </div>
                                <h3 className="font-bold text-[#111827] text-base mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}

// --- SIDEBAR & CONTENT LAYOUT ---
export function LegalSidebarLayout({ sections }: { sections: { id: string, title: string, content: string }[] }) {
    const [activeSection, setActiveSection] = React.useState(sections[0].id);
    const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

    React.useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -60% 0px", // triggers when element is roughly in middle of screen
            threshold: 0
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((sec) => {
            const element = document.getElementById(sec.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sections]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: y - 100, // offset padding for fixed header
                behavior: "smooth"
            });
            setMobileNavOpen(false);
            // Updating URL hash without jumping
            history.pushState(null, '', `#${id}`);
        }
    };

    return (
        <section className="bg-[#EDF5F2] border-t border-gray-100 py-14 md:py-20 lg:py-24 relative">
            <Container>

                {/* Mobile/Tablet Navigation */}
                <div className="lg:hidden mb-12 sticky top-24 z-30">
                    <button
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                        className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm focus:outline-none"
                    >
                        <span className="font-bold text-[#111827] text-sm">Jump to section...</span>
                        <motion.div animate={{ rotate: mobileNavOpen ? 180 : 0 }}>
                            <ArrowRight className="w-4 h-4 text-[#6B9F91] rotate-90" />
                        </motion.div>
                    </button>
                    {mobileNavOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-40 overflow-hidden flex flex-col"
                        >
                            {sections.map((sec) => (
                                <a
                                    key={sec.id}
                                    href={`#${sec.id}`}
                                    onClick={(e) => scrollToSection(e, sec.id)}
                                    className={`text-left text-sm font-medium px-4 py-3 border-b border-gray-50 last:border-0 transition-colors ${activeSection === sec.id ? 'text-[#6B9F91] font-bold bg-[#EDF5F2]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    {sec.title}
                                </a>
                            ))}
                        </motion.div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative items-start">

                    {/* Sticky Sidebar (Desktop) */}
                    <div className="w-full lg:w-1/4 sticky top-32 hidden lg:flex flex-col gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-4">Contents</span>
                        <nav className="flex flex-col gap-1 border-l-2 border-gray-100 relative">
                            {sections.map((sec) => (
                                <a
                                    key={sec.id}
                                    href={`#${sec.id}`}
                                    onClick={(e) => scrollToSection(e, sec.id)}
                                    className={`block text-left text-sm font-medium px-4 py-2.5 transition-all relative
                                        ${activeSection === sec.id
                                            ? 'text-[#6B9F91] bg-[#6B9F91]/5 font-bold'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {activeSection === sec.id && (
                                        <motion.div layoutId="activeNavLine" className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-[#6B9F91]" />
                                    )}
                                    {sec.title}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Scrollable Article */}
                    <div className="w-full lg:w-3/4 flex flex-col gap-8 md:gap-12">
                        {sections.map((sec, idx) => (
                            <section
                                key={sec.id}
                                id={sec.id}
                                className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-200/40 scroll-mt-32"
                            >
                                <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }}>
                                    <div className="w-8 h-8 rounded-full bg-[#EDF5F2] text-[#6B9F91] font-bold text-xs flex items-center justify-center mb-6 border border-gray-100">
                                        {idx + 1}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827] mb-6 tracking-tight">
                                        {sec.title}
                                    </h2>
                                    <div className="prose prose-gray max-w-none text-gray-500 leading-loose">
                                        {sec.content.split('\n').map((paragraph, i) => (
                                            <p key={i} className="mb-4 last:mb-0 text-base md:text-lg">{paragraph}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            </section>
                        ))}
                    </div>

                </div>
            </Container>
        </section>
    );
}

// --- BOTTOM CTA ---
export function LegalCTA({ heading, text }: { heading: string, text: string }) {
    return (
        <section className="bg-white pt-10 pb-14 md:pb-20 lg:pb-24 relative overflow-hidden">
            <Container className="text-center max-w-3xl mx-auto flex flex-col items-center">
                <div className="w-24 h-px bg-gray-200 mb-16" />

                <h3 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4 tracking-tight">
                    {heading}
                </h3>
                <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-10">
                    {text}
                </p>
                <Link href="/contact" passHref>
                    <Button className="bg-[#6B9F91] text-white hover:bg-[#5C8C80] font-bold px-8 py-6 rounded-full group shadow-md shadow-[#6B9F91]/20">
                        Contact Us
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </Container>
        </section>
    );
}
