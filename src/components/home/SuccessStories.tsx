"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Star, ArrowRight, Building2 } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardMotion } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { slideUp, hoverLift, staggerContainer, fadeIn } from "@/lib/animations";

// Data-driven placeholders 
const FEATURED_STORY = {
    clientName: "Enterprise Client",
    company: "Global Tech Solutions",
    quote: "SS40 NETWORK transformed our digital infrastructure, delivering a highly scalable enterprise solution ahead of schedule.",
    link: "#",
};

const SECONDARY_STORIES = [
    {
        clientName: "StartUp Founder",
        company: "Innovative Products Inc.",
        quote: "The seamless integration of their AI tools drastically reduced our operational overhead.",
    },
    {
        clientName: "Alumni Leader",
        company: "Academics Division",
        quote: "The training programs completely bridged our talent gap, preparing our workforce for modern tech challenges.",
    },
];



export function SuccessStories() {
    return (
        <SectionWrapper id="success-stories" className="bg-[#F2F7F5]">
            <Container className="space-y-12 lg:space-y-16">

                {/* Section Header */}
                <SectionHeading
                    badge="Success Stories"
                    title="Built on trust. Driven by results."
                    description="Real partnerships. Real outcomes. Discover how SS40 NETWORK helps businesses and learners grow through technology, products, and education."
                />

                {/* Testimonials Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="flex flex-col gap-6 max-w-5xl mx-auto"
                >
                    {/* Featured Testimonial (Large) */}
                    <CardMotion
                        variants={slideUp}
                        {...hoverLift}
                        className="flex flex-col lg:flex-row p-0 overflow-hidden group"
                    >
                        {/* Video Placeholder */}
                        <div className="w-full lg:w-[55%] relative h-[300px] lg:h-auto bg-gray-100 flex items-center justify-center overflow-hidden">
                            {/* Ambient placeholder background */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50" />
                            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')] mix-blend-multiply pointer-events-none" />

                            {/* Play Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative z-10 w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-[var(--color-primary)] group-hover:text-[var(--color-primary-hover)] transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                                aria-label="Play testimonial video"
                            >
                                <Play className="w-8 h-8 ml-1 fill-current" />

                                {/* Pulsing ring */}
                                <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-50" style={{ animationDuration: '3s' }} />
                            </motion.button>
                        </div>

                        {/* Featured Content */}
                        <div className="w-full lg:w-[45%] flex flex-col justify-center p-8 lg:p-12">
                            <div className="flex gap-1 mb-6 text-yellow-500">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                            </div>

                            <p className="text-xl md:text-2xl font-medium text-[var(--color-heading)] italic leading-relaxed mb-8">
                                "{FEATURED_STORY.quote}"
                            </p>

                            <div className="flex items-center gap-4 mb-8 mt-auto">
                                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                                <div>
                                    <p className="font-bold text-[var(--color-heading)]">{FEATURED_STORY.clientName}</p>
                                    <p className="text-sm text-[var(--color-body-text)]">{FEATURED_STORY.company}</p>
                                </div>
                            </div>

                            <Link href={FEATURED_STORY.link} className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-bold focus-visible:outline-none group/link">
                                Read Full Story
                                <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </CardMotion>

                    {/* Secondary Testimonials (2 Columns) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {SECONDARY_STORIES.map((story, idx) => (
                            <CardMotion
                                key={idx}
                                variants={slideUp}
                                {...hoverLift}
                                className="p-8 flex flex-col"
                            >
                                <div className="flex gap-1 mb-4 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-lg text-[var(--color-body-text)] leading-relaxed mb-8 flex-1">
                                    "{story.quote}"
                                </p>
                                <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-6">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm text-[var(--color-heading)]">{story.clientName}</p>
                                        <p className="text-xs text-gray-500">{story.company}</p>
                                    </div>
                                </div>
                            </CardMotion>
                        ))}
                    </div>
                </motion.div>



                {/* Bottom CTA Block */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center text-center pt-10"
                >
                    <div className="bg-gray-50 border border-[var(--color-border)] rounded-[var(--radius-container)] p-12 lg:p-16 w-full max-w-4xl mx-auto flex flex-col items-center">
                        <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-heading)] mb-6 max-w-2xl">
                            Ready to build your next digital success story?
                        </h3>
                        <Button asChild size="lg" className="w-full sm:w-auto shadow-xl shadow-[var(--color-primary)]/20">
                            <Link href="/contact">
                                Start Your Project
                            </Link>
                        </Button>
                    </div>
                </motion.div>

            </Container>
        </SectionWrapper>
    );
}
