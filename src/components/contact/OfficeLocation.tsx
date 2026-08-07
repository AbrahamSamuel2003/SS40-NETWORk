"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, Clock, Map, ExternalLink } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function OfficeLocation() {
    return (
        <SectionWrapper id="office-location" className="bg-[#EDF5F2] py-20 md:py-32">
            <Container className="max-w-6xl mx-auto flex flex-col items-center">

                {/* HEADINGS */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight"
                    >
                        Visit Our <span className="text-[#6B9F91]">Office</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Meet our team or connect with us for business discussions and collaborations.
                    </motion.p>
                </div>

                {/* LOCATION CARD */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row gap-12"
                >

                    {/* Left: Info */}
                    <div className="flex-1 flex flex-col">
                        <div className="w-16 h-16 bg-[#EDF5F2] rounded-2xl flex items-center justify-center border border-gray-100 mb-8">
                            <MapPin className="w-8 h-8 text-[#6B9F91]" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-[#111827] mb-4">SS40 NETWORK PRIVATE LIMITED</h3>

                        <address className="not-italic text-gray-500 text-base leading-relaxed mb-8 flex flex-col gap-1">
                            <span>SS40 NETWORK PRIVATE LIMITED,</span>
                            <span>1st Floor,</span>
                            <span>Municipal Corporation Incubation Centre</span>
                            <span>(Near by trade centre),</span>
                            <span>Sree Puram,</span>
                            <span>Tirunelveli, Tamil Nadu 627001</span>
                        </address>

                        <div className="flex items-center gap-3 md:gap-4 text-[13px] md:text-sm font-bold text-[#111827] mb-8 bg-[#EDF5F2] w-full md:w-max px-3 md:px-4 py-3 rounded-xl border border-gray-100">
                            <Clock className="w-5 h-5 text-[#6B9F91] shrink-0" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-gray-500 text-[10px] uppercase tracking-widest whitespace-nowrap">Office Hours</span>
                                <span className="mt-1 md:mt-0 whitespace-nowrap">Monday – Friday: 9:30 AM – 6:30 PM</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            <a href="https://goo.gl/maps/DWiCMVGgqKi2r5188" target="_blank" rel="noopener noreferrer">
                                <Button className="bg-[#6B9F91] text-white hover:bg-[#5C8C80] font-bold px-6 py-6 rounded-xl group shadow-md shadow-[#6B9F91]/20">
                                    <Navigation className="w-4 h-4 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                    Get Directions
                                </Button>
                            </a>
                            <a href="tel:+918300591750">
                                <Button variant="outline" className="bg-transparent border-gray-200 text-[#111827] hover:bg-gray-50 font-bold px-6 py-6 rounded-xl group">
                                    <Phone className="w-4 h-4 mr-2 text-[#6B9F91]" />
                                    Call Now
                                </Button>
                            </a>
                        </div>
                    </div>

                    {/* Right: Embedded Interactive Map */}
                    <div className="flex-1 w-full bg-[#EDF5F2] rounded-2xl border border-gray-100 overflow-hidden relative min-h-[350px] lg:min-h-[100%] group shadow-inner">

                        {/* Live Google Map Iframe */}
                        <iframe
                            title="SS40 NETWORK Office Location"
                            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=8.72921,77.69742+(SS40%20NETWORK%20PRIVATE%20LIMITED)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=near&amp;output=embed"
                            className="absolute inset-0 w-full h-full border-0 grayscale-[15%] contrast-[1.05]"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                        {/* Custom Google Places Mock Overlay */}
                        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white rounded-md shadow-[0_2px_6px_rgba(0,0,0,0.3)] p-3 md:p-4 z-20 w-[240px] md:w-[280px] pointer-events-auto">
                            <h4 className="text-[15px] font-semibold text-gray-900 leading-tight mb-1 flex justify-between items-start">
                                SS40 NETWORK PRIVATE LIMITED
                                <a href="https://goo.gl/maps/DWiCMVGgqKi2r5188" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 p-1">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </h4>
                            <p className="text-[12px] text-gray-600 leading-snug">
                                SS40 NETWORK PRIVATE LIMITED, 1st Floor, Municipal Corporation Incubation Centre<br />
                                (Near by trade centre), Sree Puram, Tirunelveli, Tamil Nadu 627001.
                            </p>
                        </div>

                        {/* Floating protection gradient for button */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111827]/30 to-transparent pointer-events-none" />

                        {/* Floating Action Button */}
                        <div className="absolute inset-x-0 bottom-6 flex justify-center z-10 pointer-events-none">
                            <a href="https://goo.gl/maps/DWiCMVGgqKi2r5188" target="_blank" rel="noopener noreferrer" className="pointer-events-auto">
                                <Button className="bg-[#111827] text-white hover:bg-[#1f2937] font-bold px-6 py-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all border border-gray-700/50 flex items-center group/btn">
                                    <Map className="w-4 h-4 mr-2 text-[#6B9F91] group-hover/btn:text-white transition-colors" />
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
