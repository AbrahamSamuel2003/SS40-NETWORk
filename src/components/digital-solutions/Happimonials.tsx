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

import { Loader2 } from "lucide-react";

const HAPPIMONIALS_DATA = []; // Removed: using dynamic API data now

export function Happimonials() {
    const [happimonials, setHappimonials] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
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
        fetch('/api/happimonials?pageScope=DIGITAL_SOLUTIONS')
            .then(res => res.json())
            .then(data => {
                if (data.success) setHappimonials(data.data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));

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

                {/* Loading / Empty State */}
                {isLoading ? (
                    <div className="py-20 flex justify-center items-center opacity-50">
                        <Loader2 className="w-8 h-8 animate-spin text-[#6B9F91]" />
                    </div>
                ) : happimonials.length === 0 ? (
                    <div className="py-20 flex justify-center items-center">
                        <p className="text-gray-500">No client stories available yet.</p>
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                        >
                            {happimonials.map((item) => (
                                <CardMotion
                                    key={item.id}
                                    variants={slideUp}
                                    {...hoverLift}
                                    className="bg-white overflow-hidden rounded-2xl flex flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/30 transition-all duration-300"
                                >
                                    {/* Video Placeholder or Real Thumbnail Area */}
                                    <div className="relative w-full aspect-video bg-gray-100 overflow-hidden shrink-0 cursor-pointer">
                                        {item.thumbnailUrl ? (
                                            <img src={item.thumbnailUrl} alt={item.clientName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 group-hover:scale-105 transition-transform duration-500 ease-out flex items-center justify-center">
                                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                            </div>
                                        )}

                                        {/* Overlay Content */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/10 group-hover:bg-gray-900/20 transition-colors duration-300">
                                            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-[#6B9F91] group-hover:scale-110 group-hover:bg-[#6B9F91] group-hover:text-white transition-all duration-300 ease-out z-10 mb-3">
                                                <Play className="w-5 h-5 ml-1 fill-current" />
                                            </div>
                                            <div className="text-center z-10">
                                                <p className="text-xs font-bold text-gray-800 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full inline-block shadow-sm mb-1 uppercase tracking-wider">
                                                    Client Story
                                                </p>
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
                                {!isLoading && happimonials.map((item, idx) => (
                                    <div
                                        key={`mobile-${item.id}`}
                                        data-mobile-id={idx}
                                        className="happimonial-mobile-card w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white overflow-hidden rounded-3xl snap-center relative scroll-ml-6 border border-[var(--color-border)] shadow-xl shadow-gray-200/50"
                                    >
                                        {/* Video Area or Thumbnail */}
                                        <div className="relative w-full aspect-video bg-gray-100 overflow-hidden shrink-0">
                                            {item.thumbnailUrl ? (
                                                <img src={item.thumbnailUrl} alt={item.clientName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 flex items-center justify-center">
                                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/10">
                                                <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-[#6B9F91] mb-2">
                                                    <Play className="w-4 h-4 ml-1 fill-current" />
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-800 bg-white/80 backdrop-blur-sm px-2.5 py-0.5 rounded-full inline-block shadow-sm uppercase tracking-wider">
                                                    Watch Story
                                                </p>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-6 flex flex-col flex-1 text-left relative z-10 bg-white">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-lg text-[var(--color-heading)] leading-tight">{item.clientName}</h3>
                                                    <p className="text-xs font-medium text-gray-500 mt-1">{item.companyName}</p>
                                                </div>
                                                <span className="w-max px-2 py-0.5 bg-[#6B9F91]/10 text-[#6B9F91] text-[9px] font-bold uppercase tracking-wider rounded whitespace-nowrap">
                                                    {item.industry}
                                                </span>
                                            </div>
                                            <p className="text-[var(--color-body-text)] text-sm italic leading-relaxed line-clamp-4">
                                                "{item.testimonial}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="w-[4vw] shrink-0" />
                            </div>

                            {/* Pagination Dots */}
                            {!isLoading && happimonials.length > 0 && (
                                <div className="w-full flex justify-center items-center gap-3 mt-2 mb-8 z-10 relative">
                                    {happimonials.map((_, i) => (
                                        <button
                                            key={`mob-dot-${i}`}
                                            onClick={() => scrollToMobileTestimonial(i)}
                                            aria-label={`View testimonial ${i + 1}`}
                                            className={`h-2.5 rounded-full transition-all duration-400 ease-out ${activeMobileIdx === i ? 'bg-[#6B9F91] w-8 shadow-sm scale-100' : 'bg-gray-300 w-2.5 hover:bg-gray-400 scale-90'} border-none cursor-pointer`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                    </>
                )}


            </Container>
        </SectionWrapper>
    );
}
