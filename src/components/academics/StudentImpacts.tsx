"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, CheckCircle2, ChevronRight, Award, Briefcase, Code, Network } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { slideUp, staggerContainer, hoverLift } from "@/lib/animations";

const TIMELINE_STEPS = ["Learning", "Real Project", "Mentorship", "Industry Ready"];

export function StudentImpacts() {
    return (
        <SectionWrapper id="student-impacts" className="bg-[#F2F7F5] relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
                    style={{ backgroundImage: 'radial-gradient(#6B9F91 2px, transparent 2px)', backgroundSize: '40px 40px' }}
                />
                <motion.div
                    animate={{ rotate: 360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[800px] h-[800px] bg-[#6B9F91]/5 blur-[120px] rounded-full"
                />
                <div className="absolute top-[30%] right-[10%] w-64 h-64 border border-[#FFC900]/20 rounded-full opacity-60" />
                <div className="absolute bottom-[20%] right-[30%] w-32 h-32 border border-[#6B9F91]/20 rounded-full opacity-60" />
            </div>

            {/* Floating Achievement Badges */}
            <div className="absolute inset-0 pointer-events-none z-10 hidden lg:block">
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="absolute top-[20%] left-[8%] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#6B9F91]" /><span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Career Ready</span>
                </motion.div>
                <motion.div animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute top-[35%] right-[5%] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-500" /><span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Portfolio Built</span>
                </motion.div>
                <motion.div animate={{ y: [-15, 15, -15] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }} className="absolute bottom-[10%] left-[5%] bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
                    <Network className="w-4 h-4 text-purple-500" /><span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Industry Exposure</span>
                </motion.div>
            </div>

            <Container className="relative z-20">
                <SectionHeading
                    badge="STUDENT IMPACTS"
                    title={<>From Learning to <span className="text-[#6B9F91]">Real Achievement.</span></>}
                    description="Discover how students build practical skills, complete real-world projects, and prepare for successful careers through hands-on learning."
                    align="center"
                    className="mb-16 lg:mb-24"
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT: Featured Journey Card (Large) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="lg:col-span-7 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col relative group"
                    >
                        {/* Video/Image Placeholder Header */}
                        <div className="relative w-full aspect-video bg-gray-900 overflow-hidden isolate">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

                            {/* Play Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white z-20 group/play"
                                aria-label="Play impact story"
                            >
                                <div className="absolute inset-0 rounded-full animate-ping bg-white/20" style={{ animationDuration: '3s' }} />
                                <Play className="w-6 h-6 ml-1 fill-white opacity-90 group-hover/play:opacity-100 transition-opacity" />
                            </motion.button>

                            <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
                                <Badge className="bg-[#FFC900] text-amber-900 border-none font-bold uppercase tracking-wider text-[10px] w-fit">
                                    Software Engineering Pathway
                                </Badge>
                                <h3 className="text-3xl font-bold text-white">David Chen</h3>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-8 md:p-10 flex flex-col flex-grow">

                            {/* Visual Timeline */}
                            <div className="relative flex justify-between items-center mb-10 mt-2">
                                <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gray-100 -translate-y-1/2 -z-10" />
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "80%" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, delay: 0.3 }}
                                    className="absolute top-1/2 left-[10%] h-[2px] bg-[#6B9F91] -translate-y-1/2 -z-10"
                                />
                                {TIMELINE_STEPS.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-3 bg-white px-2">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white ${idx === 3 ? 'border-[#FFC900] text-[#FFC900]' : 'border-[#6B9F91] text-[#6B9F91]'}`}>
                                            {idx === 3 ? <Award className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider hidden sm:block">{step}</span>
                                    </div>
                                ))}
                            </div>

                            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed italic mb-8 relative">
                                <span className="text-4xl text-gray-200 absolute -top-4 -left-3">"</span>
                                Building scalable solutions here gave me the exact architecture experience I needed to immediately contribute on day one of my new career.
                            </p>

                            <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white"><Briefcase className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Current Role</p>
                                        <p className="text-sm font-bold text-gray-900 leading-none">Backend Engineer, TechCorp</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-[#6B9F91] hover:text-[#5C8C80] hover:bg-[#6B9F91]/5 font-bold p-0 hidden sm:flex">
                                    Read Journey <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Secondary Journey Cards Stack */}
                    <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">

                        {/* Secondary Card 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col sm:flex-row group"
                        >
                            <div className="w-full sm:w-[40%] aspect-video sm:aspect-auto sm:h-full relative overflow-hidden isolate bg-gray-900">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white z-20">
                                        <Play className="w-4 h-4 ml-0.5 fill-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col justify-between w-full sm:w-[60%]">
                                <div>
                                    <Badge className="bg-[#6B9F91]/10 text-[#6B9F91] border-none font-bold uppercase tracking-wider text-[9px] mb-2">Data Science Track</Badge>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Sarah Jenkins</h4>

                                    {/* Mini Timeline */}
                                    <div className="flex items-center gap-1.5 mb-4">
                                        <span className="text-[9px] uppercase font-bold text-gray-400">Learn</span>
                                        <ChevronRight className="w-3 h-3 text-gray-300" />
                                        <span className="text-[9px] uppercase font-bold text-gray-400">Build</span>
                                        <ChevronRight className="w-3 h-3 text-gray-300" />
                                        <span className="text-[9px] uppercase font-bold text-[#FFC900]">Placed</span>
                                    </div>

                                    <p className="text-sm text-gray-600 italic line-clamp-3 leading-relaxed">
                                        "The mentorship during the final live project totally changed how I approach data pipelines."
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Secondary Card 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col sm:flex-row group"
                        >
                            <div className="w-full sm:w-[40%] aspect-video sm:aspect-auto sm:h-full relative overflow-hidden isolate bg-gray-900">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white z-20">
                                        <Play className="w-4 h-4 ml-0.5 fill-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col justify-between w-full sm:w-[60%]">
                                <div>
                                    <Badge className="bg-blue-100 text-blue-700 border-none font-bold uppercase tracking-wider text-[9px] mb-2">Cloud Architecture</Badge>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Marcus Torres</h4>

                                    {/* Mini Timeline */}
                                    <div className="flex items-center gap-1.5 mb-4">
                                        <span className="text-[9px] uppercase font-bold text-gray-400">Theory</span>
                                        <ChevronRight className="w-3 h-3 text-gray-300" />
                                        <span className="text-[9px] uppercase font-bold text-gray-400">Deploy</span>
                                        <ChevronRight className="w-3 h-3 text-gray-300" />
                                        <span className="text-[9px] uppercase font-bold text-[#FFC900]">Hired</span>
                                    </div>

                                    <p className="text-sm text-gray-600 italic line-clamp-3 leading-relaxed">
                                        "Deploying real microservices for actual clients gave me a massive edge in technical interviews."
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                </div>
            </Container>
        </SectionWrapper>
    );
}
