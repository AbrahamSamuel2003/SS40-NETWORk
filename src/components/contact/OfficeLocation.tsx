"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, Clock, Map, Star } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { SiteConfigData } from "@/lib/site-config";

export function OfficeLocation({ config }: { config?: SiteConfigData | null }) {
    const companyName = config?.companyName || "SS40 NETWORK PRIVATE LIMITED";
    const rawAddress = config?.addressText || "1st Floor, Municipal Corporation Incubation Centre\n(Near by trade centre), Sree Puram, Tirunelveli, Tamil Nadu 627001";
    // Ensure address always starts with "1st Floor..." by stripping any leading duplicate company names
    const addressText = rawAddress.replace(/^(SS40\s+NETWORK(\s+PRIVATE\s+LIMITED)?\s*[,-]?\s*)/i, "").trim();
    const businessHours = config?.businessHours || "Monday – Friday: 9:30 AM – 6:30 PM";
    const phoneValue = config?.contactPhone || "+91 83005 91750";

    const mapDirectionsUrl = "https://www.google.co.in/maps/place/SS40+NETWORK+PRIVATE+LIMITED/@8.7291497,77.6975423,16z/data=!3m1!4b1!4m6!3m5!1s0x3b043d23a0d31415:0x156aa9529f1cb6e6!8m2!3d8.7291497!4d77.6975423!16s%2Fg%2F11ytv_cr14";
    const writeReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJFRTToCM9BDsR5rYcn1KpahU";

    return (
        <SectionWrapper id="office-location" className="bg-[#EDF5F2] py-12 md:py-16">
            <Container className="max-w-6xl mx-auto flex flex-col items-center">

                {/* HEADINGS */}
                <div className="text-center mb-4 sm:mb-6">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] mb-3 tracking-tight"
                    >
                        Visit Our <span className="text-[#0F766E]">Office</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium"
                    >
                        Meet our team or connect with us for business discussions and collaborations.
                    </motion.p>
                </div>

                {/* LOCATION CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="w-full bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6"
                >

                    {/* Left: Info */}
                    <div className="flex-1 flex flex-col">
                        <div className="w-12 h-12 bg-[#EDF5F2] rounded-2xl flex items-center justify-center border border-gray-100 mb-4">
                            <MapPin className="w-6 h-6 text-[#0F766E]" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-[#111827] mb-1">{companyName}</h3>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#0F766E] mb-3">Operational Headquarters</p>

                        <address className="not-italic text-gray-500 text-base leading-relaxed mb-4 whitespace-pre-line">
                            {addressText}
                        </address>

                        <div className="flex items-center gap-3 md:gap-4 text-[13px] md:text-sm font-bold text-[#111827] mb-4 bg-[#EDF5F2] w-full md:w-max px-3 md:px-4 py-3 rounded-xl border border-gray-100">
                            <Clock className="w-5 h-5 text-[#0F766E] shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-gray-500 text-[10px] uppercase tracking-widest whitespace-nowrap">Office Hours</span>
                                <span className="mt-1 md:mt-0 md:whitespace-nowrap break-words min-w-0">{businessHours}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
                            <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-[#0F766E] text-white hover:bg-[#115E59] font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl group shadow-md shadow-[#0F766E]/20 text-xs sm:text-sm">
                                    <Navigation className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                    Get Directions
                                </Button>
                            </a>
                            <a href={writeReviewUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="bg-amber-50/80 hover:bg-amber-100/90 border-amber-300 text-amber-900 font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl group shadow-2xs text-xs sm:text-sm">
                                    <Star className="w-4 h-4 mr-1.5 text-amber-500 fill-amber-400 group-hover:rotate-12 transition-transform" />
                                    Review Us on Google
                                </Button>
                            </a>
                            {phoneValue && (
                                <a href={`tel:${phoneValue.replace(/\s+/g, '')}`}>
                                    <Button variant="outline" className="bg-transparent border-gray-200 text-[#111827] hover:bg-gray-50 font-bold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl group text-xs sm:text-sm">
                                        <Phone className="w-4 h-4 mr-2 text-[#0F766E]" />
                                        Call Now
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: Embedded Interactive Map */}
                    <div className="flex-1 w-full bg-[#EDF5F2] rounded-2xl border border-gray-100 overflow-hidden relative min-h-[280px] lg:min-h-[100%] group shadow-inner">

                        {/* Live Map Iframe in background */}
                        <iframe
                            title={`${companyName} Office Location`}
                            src={
                                config?.googleMapsIframeUrl && config.googleMapsIframeUrl.includes("embed")
                                    ? config.googleMapsIframeUrl
                                    : "https://maps.google.com/maps?q=SS40+NETWORK+PRIVATE+LIMITED+Tirunelveli&t=&z=16&ie=UTF8&iwloc=&output=embed"
                            }
                            className="absolute inset-0 w-full h-full border-0 contrast-[1.05]"
                            allowFullScreen
                            loading="lazy"
                        />

                        {/* Floating protection gradient for button */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111827]/30 to-transparent pointer-events-none" />

                        {/* Floating Action Button */}
                        <div className="absolute inset-x-0 bottom-6 flex justify-center z-10 pointer-events-none">
                            <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer" className="pointer-events-auto">
                                <Button className="bg-[#111827] text-white hover:bg-[#1f2937] font-bold px-5 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all border border-gray-700/50 flex items-center group/btn">
                                    <Map className="w-4 h-4 mr-2 text-[#2DD4BF] group-hover/btn:text-white transition-colors" />
                                    View on Google Maps
                                </Button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </SectionWrapper>
    );
}
