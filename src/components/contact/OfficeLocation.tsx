"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, Clock, Map } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function OfficeLocation() {
    return (
        <SectionWrapper id="office-location" className="bg-[#F2F7F5] py-20 md:py-32">
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
                        <div className="w-16 h-16 bg-[#F2F7F5] rounded-2xl flex items-center justify-center border border-gray-100 mb-8">
                            <MapPin className="w-8 h-8 text-[#6B9F91]" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-[#111827] mb-4">SS40 NETWORK PRIVATE LIMITED</h3>

                        <address className="not-italic text-gray-500 text-base leading-relaxed mb-8 flex flex-col gap-1">
                            <span>1st Floor</span>
                            <span>Municipal Corporation Incubation Centre</span>
                            <span>Near Trade Centre</span>
                            <span>Swamy Nellaiappar Temple Highway</span>
                            <span>Tirunelveli Junction</span>
                            <span>Tirunelveli, Tamil Nadu – 627001</span>
                        </address>

                        <div className="flex items-center gap-4 text-sm font-bold text-[#111827] mb-8 bg-[#F2F7F5] w-max px-4 py-3 rounded-xl border border-gray-100">
                            <Clock className="w-5 h-5 text-[#6B9F91]" />
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-[10px] uppercase tracking-widest">Office Hours</span>
                                Monday – Friday: 9:30 AM – 6:30 PM
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-auto">
                            <a href="https://maps.google.com/?q=SS40+NETWORK+Tirunelveli" target="_blank" rel="noopener noreferrer">
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

                    {/* Right: Map Placeholder */}
                    <div className="flex-1 w-full bg-[#F2F7F5] rounded-2xl border border-gray-100 overflow-hidden relative min-h-[300px] flex items-center justify-center group overflow-hidden">

                        {/* Fake map pattern background */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#111827 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
                        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwek0yMCAyMGMxMS0xMSAxMS0xMSAxMS0xMSBMMSAxWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTExODI3IiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvc3ZnPg==')] pointer-events-none" />

                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-[#6B9F91]/10 to-transparent" />

                        <div className="z-10 flex flex-col items-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 text-[#6B9F91]">
                                <Map className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-6">Interactive Map</span>

                            <a href="https://maps.google.com/?q=SS40+NETWORK+Tirunelveli" target="_blank" rel="noopener noreferrer">
                                <Button className="bg-[#111827] text-white hover:bg-gray-800 font-bold px-6 py-5 rounded-lg text-sm shadow-xl hover:-translate-y-0.5 transition-transform border border-gray-700">
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
