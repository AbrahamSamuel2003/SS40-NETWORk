"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, ArrowRight, Building2, Store, Factory } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { slideUp, staggerContainer, hoverLift } from "@/lib/animations";

const IMPACT_STORIES = [
    {
        id: "1",
        businessName: "Nexus Logistics",
        industry: "Supply Chain",
        impact: "Reduced invoicing discrepancies to zero and recovered 15% missing revenue with ClearInvoice.",
        icon: Building2,
    },
    {
        id: "2",
        businessName: "Prime Retailers",
        industry: "Retail & E-commerce",
        impact: "Automated their entire global multi-currency tax billing system seamlessly.",
        icon: Store,
    },
    {
        id: "3",
        businessName: "AeroTech Manufacturing",
        industry: "Manufacturing",
        impact: "Simplified complex operational workflows across 4 facilities using SS40 Automation solutions.",
        icon: Factory,
    }
];

export function ProductImpacts() {
    return (
        <SectionWrapper id="product-impacts" className="bg-white border-t border-gray-100">
            <Container className="space-y-16">

                {/* Section Header */}
                <SectionHeading
                    badge="PRODUCT IMPACTS"
                    title={
                        <>
                            Real Businesses.<br />
                            Real Product <span className="text-[#6B9F91]">Success.</span>
                        </>
                    }
                    description="See how organizations use SS40 NETWORK products to simplify operations, improve productivity, and achieve better business outcomes."
                    align="center"
                />

                {/* 3-Column Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {IMPACT_STORIES.map((story) => (
                        <motion.div
                            key={story.id}
                            variants={slideUp}
                            {...hoverLift}
                            className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#6B9F91]/10 flex flex-col group transition-all duration-300"
                        >
                            {/* Video Placeholder Box */}
                            <div className="relative w-full aspect-video bg-gray-900 overflow-hidden flex flex-col items-center justify-center p-6">
                                {/* Ambient Background Gradient inside Video */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-black/80 z-0 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />

                                <motion.div
                                    className="relative z-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white mb-4 shadow-lg group-hover:bg-[#6B9F91] group-hover:scale-110 group-hover:border-[#6B9F91] transition-all duration-300"
                                >
                                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                                </motion.div>

                                <p className="relative z-10 text-white/50 text-xs font-bold tracking-widest uppercase mb-1">
                                    ▶ Product Story
                                </p>
                                <p className="relative z-10 text-white font-medium text-sm">
                                    Demo Coming Soon
                                </p>
                            </div>

                            {/* Content Context */}
                            <div className="p-6 md:p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#6B9F91] border border-gray-100 shrink-0">
                                        <story.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{story.businessName}</h3>
                                        <p className="text-xs font-bold text-[#FFC900] uppercase tracking-wider">{story.industry}</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                                    "{story.impact}"
                                </p>

                                <button
                                    className="flex items-center font-bold text-sm text-[#6B9F91] hover:text-[#5C8C80] group/btn transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC900] rounded-md mt-auto"
                                    aria-label={`Watch story for ${story.businessName}`}
                                >
                                    Watch Story
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </Container>
        </SectionWrapper>
    );
}
