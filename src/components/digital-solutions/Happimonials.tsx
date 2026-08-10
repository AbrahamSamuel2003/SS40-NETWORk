"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ArrowRight, Video } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { slideUp, staggerContainer, hoverLift } from "@/lib/animations";

const HAPPIMONIALS_DATA = [
    {
        id: "1",
        clientName: "Sarah Chen",
        companyName: "Global Trade Logistics",
        industry: "Supply Chain",
        testimonial: "SS40 transformed our legacy tracking system into a seamless, automated platform that saved us hundreds of hours.",
    },
    {
        id: "2",
        clientName: "Marcus Thorne",
        companyName: "Elevate Health Partners",
        industry: "Healthcare",
        testimonial: "Their engineering team built a secure, compliance-ready enterprise portal that our users absolutely love.",
    },
    {
        id: "3",
        clientName: "Priya Sharma",
        companyName: "FinTech Solutions India",
        industry: "Finance",
        testimonial: "The digital solution provided an instant boost to our conversion rates, delivering beyond our initial expectations.",
    }
];

export function Happimonials() {
    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    const scrollToMobileTestimonial = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".happimonial-mobile-card");
        const card = mobileCards[idx];
        if (!card) return;

        card.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
        });
    };

    React.useEffect(() => {
        const mobileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveMobileIdx(Number(entry.target.getAttribute("data-mobile-id")));
                }
            });
        }, { root: mobileScrollRef.current, threshold: 0.6 });

        if (mobileScrollRef.current) {
            const mobileCards = mobileScrollRef.current.querySelectorAll<HTMLElement>(".happimonial-mobile-card");
            mobileCards.forEach(c => mobileObserver.observe(c));
            requestAnimationFrame(() => {
                mobileCards[0]?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
            });
        }

        return () => {
            mobileObserver.disconnect();
        };
    }, []);

    return (
        <SectionWrapper id="happimonials" className="bg-white !pb-0 md:!pb-0 lg:!pb-0">
            <Container>

                {/* Section Header */}
                <SectionHeading
                    badge="Happimonials"
                    title="Real Businesses. Real Success Stories."
                    description="Discover how organizations have transformed their businesses through tailored digital solutions delivered by SS40 NETWORK."
                    className="mb-12 lg:mb-16"
                />

                {/* Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {HAPPIMONIALS_DATA.map((item) => (
                        <CardMotion
                            key={item.id}
                            variants={slideUp}
                            {...hoverLift}
                            className="bg-white overflow-hidden rounded-2xl flex flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/30 transition-all duration-300"
                        >
                            {/* Video Placeholder Area */}
                            <div className="relative w-full aspect-video bg-gray-100 overflow-hidden shrink-0 cursor-pointer">
                                {/* Simulated Background Image / Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                </div>

                                {/* Overlay Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/10 group-hover:bg-gray-900/20 transition-colors duration-300">
                                    <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-[#6B9F91] group-hover:scale-110 group-hover:bg-[#6B9F91] group-hover:text-white transition-all duration-300 ease-out z-10 mb-3">
                                        <Play className="w-5 h-5 ml-1 fill-current" />
                                    </div>
                                    <div className="text-center z-10">
                                        <p className="text-xs font-bold text-gray-800 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block shadow-sm mb-1 uppercase tracking-wider">
                                            Client Story
                                        </p>
                                        <div className="flex items-center gap-1.5 justify-center text-[10px] uppercase font-bold text-gray-600 bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
                                            <Video className="w-3 h-3" /> Video Coming Soon
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-[var(--color-heading)] leading-tight">{item.clientName}</h3>
                                        <p className="text-sm font-medium text-gray-600 mt-1">{item.companyName}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap">
                                        {item.industry}
                                    </span>
                                </div>

                                <p className="text-[var(--color-body-text)] text-sm italic flex-1 leading-relaxed">
                                    "{item.testimonial}"
                                </p>
                            </div>
                        </CardMotion>
                    ))}
                </motion.div>

                {/* Mobile Native Horizontal Swipe Deck */}
                <div className="flex flex-col md:hidden relative overflow-visible -mx-6 mt-2">
                    <div
                        ref={mobileScrollRef}
                        className="flex w-full overflow-x-auto snap-x snap-mandatory pb-8 gap-5 items-stretch [&::-webkit-scrollbar]:hidden px-6"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {HAPPIMONIALS_DATA.map((item, idx) => (
                            <div
                                key={`mobile-test-${item.id}`}
                                data-mobile-id={idx}
                                className="happimonial-mobile-card w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-[var(--color-border)] snap-center relative scroll-ml-6 group"
                            >
                                {/* Video Placeholder Area */}
                                <div className="relative w-full aspect-video bg-gray-100 overflow-hidden shrink-0 cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center">
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                    </div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/10 group-hover:bg-gray-900/20 transition-colors duration-300">
                                        <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-[#6B9F91] group-hover:scale-110 group-hover:bg-[#6B9F91] group-hover:text-white transition-all duration-300 ease-out z-10 mb-3">
                                            <Play className="w-5 h-5 ml-1 fill-current" />
                                        </div>
                                        <div className="text-center z-10">
                                            <p className="text-xs font-bold text-gray-800 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block shadow-sm mb-1 uppercase tracking-wider">
                                                Client Story
                                            </p>
                                            <div className="flex items-center gap-1.5 justify-center text-[10px] uppercase font-bold text-gray-600 bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
                                                <Video className="w-3 h-3" /> Video Coming Soon
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-6 flex flex-col flex-1 relative z-10 text-left">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 pr-2">
                                            <h3 className="font-bold text-xl text-[var(--color-heading)] leading-tight tracking-tight mb-1">{item.clientName}</h3>
                                            <p className="text-xs font-medium text-gray-600 line-clamp-1">{item.companyName}</p>
                                        </div>
                                        <span className="shrink-0 px-3 py-1 bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap">
                                            {item.industry}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-h-0 relative">
                                        <p className="text-[var(--color-body-text)] text-sm italic leading-relaxed overflow-hidden line-clamp-4">
                                            "{item.testimonial}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* End spacer so the last card doesn't hit the right screen edge */}
                        <div className="w-[4vw] shrink-0" />
                    </div>

                    {/* Pagination Dots representation */}
                    <div className="w-full flex justify-center items-center gap-3 mt-2 mb-0 z-10 relative">
                        {HAPPIMONIALS_DATA.map((_, i) => (
                            <button
                                key={`dot-${i}`}
                                onClick={() => scrollToMobileTestimonial(i)}
                                aria-label={`Scroll to testimonial ${i + 1}`}
                                className={`h-2.5 rounded-full transition-all duration-400 ease-out ${activeMobileIdx === i ? 'bg-[#6B9F91] w-8 shadow-sm scale-100' : 'bg-gray-300 w-2.5 hover:bg-gray-400 scale-90'} border-none cursor-pointer focus:outline-none`}
                            />
                        ))}
                    </div>
                </div>


            </Container>
        </SectionWrapper>
    );
}
