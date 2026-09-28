"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, Clock, Map } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { SiteConfigData } from "@/lib/site-config";

export function OfficeLocation({ config }: { config?: SiteConfigData | null }) {
    const companyName = config?.companyName || "SS40 NETWORK PRIVATE LIMITED";
    const addressText = config?.addressText || "1st Floor, Municipal Corporation Incubation Centre\n(Near by trade centre), Sree Puram, Tirunelveli, Tamil Nadu 627001";
    const businessHours = config?.businessHours || "Monday – Saturday: 09:00 AM – 06:00 PM";
    const phoneValue = config?.contactPhone || "+91 83005 91750";

    return (
        <SectionWrapper id="office-location" className="bg-white py-16 md:py-24 relative border-t border-gray-100">
            <Container className="max-w-6xl mx-auto flex flex-col items-center">

                {/* HEADINGS */}
                <div className="text-center mb-10 md:mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="inline-block px-3.5 py-1 rounded-full bg-[#EDF5F2] border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-widest mb-3 shadow-2xs"
                    >
                        PHYSICAL LOCATION
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] mb-3 tracking-tight font-serif"
                    >
                        Visit Our <span className="text-[#0F766E]">Headquarters</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-[#334155] text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal"
                    >
                        Meet our founding engineers and educators at our municipal incubation facility in Tirunelveli.
                    </motion.p>
                </div>

                {/* LOCATION CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="w-full bg-[#FAFCFB] rounded-3xl border border-gray-200/80 shadow-xl shadow-gray-200/40 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row gap-8 items-stretch"
                >

                    {/* Left: Physical Info */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#0F766E]/20 mb-5 text-[#0F766E] shadow-2xs">
                                <MapPin className="w-6 h-6" />
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-3 font-serif">
                                {companyName}
                            </h3>

                            <address className="not-italic text-[#334155] text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line font-normal">
                                {addressText}
                            </address>

                            {/* Office Hours Pill */}
                            <div className="flex items-start gap-3 text-xs sm:text-sm font-semibold text-[#0F172A] mb-6 bg-white p-4 rounded-2xl border border-gray-200/70">
                                <div className="w-8 h-8 rounded-xl bg-[#EDF5F2] flex items-center justify-center shrink-0 text-[#0F766E] mt-0.5">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Office Hours</span>
                                    </div>
                                    <span className="text-gray-700 font-medium">{businessHours}</span>
                                </div>
                            </div>
                        </div>

                        {/* Directions & Call Buttons */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            <a
                                href="https://goo.gl/maps/DWiCMVGgqKi2r5188"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none"
                            >
                                <Button className="w-full sm:w-auto bg-[#0F766E] text-white hover:bg-[#115E59] font-bold px-6 py-3.5 rounded-xl group shadow-md shadow-[#0F766E]/20 cursor-pointer">
                                    <Navigation className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                    Get Directions
                                </Button>
                            </a>

                            <a
                                href={`tel:${phoneValue.replace(/\s+/g, '')}`}
                                className="flex-1 sm:flex-none"
                            >
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto bg-white border-gray-200 text-[#0F172A] hover:bg-gray-100 font-bold px-6 py-3.5 rounded-xl group"
                                >
                                    <Phone className="w-4 h-4 mr-2 text-[#0F766E]" />
                                    Call Reception
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Right: Embedded Interactive Map */}
                    <div className="flex-1 w-full bg-white rounded-2xl border border-gray-200/80 overflow-hidden relative min-h-[300px] lg:min-h-[360px] group shadow-inner">
                        {/* Live Google Map Iframe */}
                        <iframe
                            title={`${companyName} Office Location`}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(companyName + " " + addressText)}&t=m&z=15&output=embed&iwloc=near`}
                            className="absolute inset-0 w-full h-full border-0 contrast-[1.05]"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                        {/* Floating Action Bar */}
                        <div className="absolute inset-x-0 bottom-4 flex justify-center z-10 pointer-events-none">
                            <a
                                href={`https://maps.google.com/maps?q=${encodeURIComponent(companyName + " " + addressText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pointer-events-auto"
                            >
                                <Button className="bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 group/btn cursor-pointer">
                                    <Map className="w-3.5 h-3.5 text-[#2DD4BF] group-hover/btn:scale-110 transition-transform" />
                                    <span>Open Full Map</span>
                                </Button>
                            </a>
                        </div>
                    </div>

                </motion.div>
            </Container>
        </SectionWrapper>
    );
}
