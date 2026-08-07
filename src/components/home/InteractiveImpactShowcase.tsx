"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Cloud, Smartphone, Shield, Database, Brain, Globe, BarChart3, Users, DollarSign, Activity, FileText, CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";

const SCENES = [
    {
        id: "digital",
        title: "Digital Solutions",
        description: "We help businesses transform operations through modern software, automation, and scalable digital solutions.",
        cards: [
            { title: "Enterprise Software", text: "Custom-built solutions tailored to business operations." },
            { title: "AI & Automation", text: "Improve efficiency with intelligent workflows." }
        ]
    },
    {
        id: "products",
        title: "Products",
        description: "We build scalable digital products that simplify business operations and support business growth.",
        cards: [
            { title: "Cloud Platform", text: "Accessible anytime with reliable cloud infrastructure." },
            { title: "Business Automation", text: "Reduce manual work with streamlined digital processes." }
        ]
    },
    {
        id: "academics",
        title: "Academics",
        description: "We bridge education and industry through practical learning, mentorship, and career-focused experiences.",
        cards: [
            { title: "Hands-on Learning", text: "Build practical skills through real-world projects." },
            { title: "Career Readiness", text: "Develop confidence for interviews and professional growth." }
        ]
    }
];

const GlowingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transform-gpu" style={{ willChange: "transform" }}>
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6B9F91] rounded-full blur-[100px] transform-gpu" style={{ willChange: "transform, opacity" }} />
        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#A6CBBE] rounded-full blur-[120px] transform-gpu" style={{ willChange: "transform, opacity" }} />
    </div>
);

// SCENE 1: DIGITAL SOLUTIONS
const VisualDigital = React.memo(() => {
    const radius = 140; // Mathematically exact radius
    // Distribute nodes equally around a 360 degree circle
    const nodes = [
        { label: "Mobile", icon: Smartphone, angle: 0 },
        { label: "Data", icon: Database, angle: 60 },
        { label: "Security", icon: Shield, angle: 120 },
        { label: "Web", icon: Globe, angle: 180 },
        { label: "Dev", icon: Brain, angle: 240 },
        { label: "Cloud", icon: Cloud, angle: 300 },
    ].map((n, i) => {
        const rad = n.angle * (Math.PI / 180);
        return {
            ...n,
            pos: {
                x: Number((Math.cos(rad) * radius).toFixed(2)),
                y: Number((Math.sin(rad) * radius).toFixed(2))
            }
        };
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full flex items-center justify-center p-8">
            <GlowingOrbs />
            <div className="relative w-[320px] h-[320px] flex items-center justify-center z-10">
                {/* SVG Lines originating perfectly from (0,0) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-160 -160 320 320">
                    {nodes.map((node, i) => (
                        <motion.line
                            key={`line-${i}`}
                            x1="0" y1="0" x2={node.pos.x} y2={node.pos.y}
                            stroke="#6B9F91" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="4 4"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                        />
                    ))}
                </svg>

                {/* HTML DOM Particles (Hardware Accelerated to instantly stop Webkit SVG flickering) */}
                {nodes.map((node, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute left-[50%] top-[50%] w-2 h-2 -ml-1 -mt-1 bg-[#6B9F91] rounded-full z-10 pointer-events-none transform-gpu"
                        style={{ willChange: "transform, opacity" }}
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 1, 0], x: [0, node.pos.x], y: [0, node.pos.y] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                    />
                ))}

                {/* Central Hub */}
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                    className="absolute left-[50%] top-[50%] w-20 h-20 -ml-10 -mt-10 bg-white rounded-full shadow-2xl border-4 border-[#EDF5F2] flex items-center justify-center z-20"
                >
                    <div className="text-[#111827] font-black text-xl tracking-tighter">SS40</div>
                    <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0, 0.2, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 bg-[#6B9F91] rounded-full z-[-1]" />
                </motion.div>

                {/* Peripheral Nodes built precisely on coordinate center */}
                {nodes.map((node, i) => {
                    const Icon = node.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, x: node.pos.x, y: node.pos.y }}
                            animate={{ opacity: 1, scale: 1, x: node.pos.x, y: node.pos.y }}
                            transition={{ type: "spring", delay: 0.5 + i * 0.1, bounce: 0.4 }}
                            className="absolute left-[50%] top-[50%] w-14 h-14 -ml-7 -mt-7 flex flex-col items-center justify-center group z-30"
                        >
                            <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-[#6B9F91]/10 border border-gray-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-[#6B9F91] group-hover:bg-[#EDF5F2] cursor-pointer relative">
                                <Icon className="w-6 h-6 text-[#6B9F91]" />
                                {/* Label positioned radially outward */}
                                <div className={`absolute whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#111827] text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none ${node.pos.y > 0 ? 'top-[calc(100%+8px)]' : 'bottom-[calc(100%+8px)]'}`}>
                                    {node.label}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
});

// SCENE 2: PRODUCTS
const VisualProducts = React.memo(() => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full flex flex-col items-center justify-center p-8 perspective-1000">
            <GlowingOrbs />
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center z-10 preserve-3d">

                {/* Main Dashboard Panel */}
                <motion.div
                    initial={{ y: 50, rotateX: 20 }} animate={{ y: 0, rotateX: 0 }} transition={{ type: "spring", duration: 1 }}
                    className="absolute w-full h-72 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-[#6B9F91]/10 flex flex-col p-6 z-10 overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100/50 pb-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-200" />
                            <div className="w-3 h-3 rounded-full bg-gray-200" />
                        </div>
                        <div className="w-24 h-4 bg-gray-100 rounded-full" />
                    </div>

                    <div className="flex items-end justify-between gap-3 h-32 w-full mt-auto">
                        {[40, 70, 50, 90, 60, 100, 85].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ scaleY: 0 }} animate={{ scaleY: h / 100 }} transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                className={`w-full h-full origin-bottom rounded-t-md ${i === 5 ? 'bg-[#6B9F91]' : 'bg-[#6B9F91]/20'}`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Floating Card 1 (Revenue) */}
                <motion.div
                    initial={{ x: -100, y: -50, opacity: 0 }} animate={{ x: -60, opacity: 1, y: [-80, -90, -80] }} transition={{ opacity: { duration: 0.5, delay: 0.2 }, y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                    className="absolute w-48 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 z-20 flex flex-col gap-2"
                >
                    <div className="flex items-center gap-3 text-gray-500 text-sm font-semibold mb-2"><DollarSign className="w-4 h-4 text-green-500" /> Total Revenue</div>
                    <motion.div className="text-2xl font-black text-[#111827]">
                        $<motion.span>84,392</motion.span>
                    </motion.div>
                </motion.div>

                {/* Floating Card 2 (Active Users) */}
                <motion.div
                    initial={{ x: 100, y: 50, opacity: 0 }} animate={{ x: 80, opacity: 1, y: [60, 70, 60] }} transition={{ opacity: { duration: 0.5, delay: 0.4 }, y: { repeat: Infinity, duration: 5, ease: "easeInOut" } }}
                    className="absolute w-40 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 z-20 flex flex-col gap-2"
                >
                    <div className="flex items-center gap-3 text-gray-500 text-sm font-semibold mb-2"><Users className="w-4 h-4 text-blue-500" /> Active Users</div>
                    <div className="flex items-end gap-2">
                        <div className="text-2xl font-black text-[#111827]">1,204</div>
                        <div className="text-xs font-bold text-green-500 mb-1">+12%</div>
                    </div>
                </motion.div>

                {/* Floating Notification */}
                <motion.div
                    initial={{ x: -50, y: 100, opacity: 0 }} animate={{ x: -20, y: 120, opacity: 1 }} transition={{ type: "spring", delay: 0.8 }}
                    className="absolute w-48 bg-white rounded-xl p-3 shadow-lg border border-gray-100 z-30 flex items-center gap-3"
                >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-green-600" /></div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#111827]">Invoice Paid</span>
                        <span className="text-[10px] text-gray-500">Just now</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
});

// SCENE 3: ACADEMICS
const VisualAcademics = React.memo(() => {
    // Mathematically bounded roadmap points relative to center SVG
    const pathData = "M -80 140 L 80 70 L -80 0 L 80 -70 L 0 -140";
    const milestones = [
        { label: "Learning", y: 140, x: -80, align: "left" },
        { label: "Build", y: 70, x: 80, align: "right" },
        { label: "Display", y: 0, x: -80, align: "left" },
        { label: "Interview", y: -70, x: 80, align: "right" },
        { label: "Career", y: -140, x: 0, final: true }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full flex items-center justify-center p-8">
            <GlowingOrbs />

            {/* Fixed mathematical wrapper guaranteeing no coordinate drift */}
            <div className="relative w-[280px] h-[360px] flex items-center justify-center z-10">

                {/* SVG Path locked perfectly to the box */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-140 -180 280 360">
                    <motion.path
                        d={pathData}
                        fill="none" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                    />
                    <motion.path
                        d={pathData}
                        fill="none" stroke="#6B9F91" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    {/* Travelling particle tracking path seamlessly */}
                    <motion.circle r="6" fill="#111827">
                        <animateMotion path={pathData} dur="1.5s" repeatCount="1" fill="freeze" calcMode="linear" />
                    </motion.circle>
                </svg>

                {/* Milestone Nodes explicitly anchored to mathematical center */}
                {milestones.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0, x: m.x, y: m.y }}
                        animate={{ scale: 1, opacity: 1, x: m.x, y: m.y }}
                        transition={{ duration: 0.3, delay: i * 0.3, ease: "backOut" }}
                        className={`absolute left-[50%] top-[50%] flex items-center justify-center z-20 ${m.final ? 'w-16 h-16 -ml-8 -mt-8' : 'w-8 h-8 -ml-4 -mt-4'}`}
                    >
                        <div className={`relative flex items-center justify-center rounded-full shadow-md w-full h-full ${m.final ? 'bg-[#111827]' : 'bg-white border-4 border-[#6B9F91]'}`}>
                            {m.final && <GraduationCap className="w-8 h-8 text-white" />}
                            {/* Pulse Effect */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                className={`absolute inset-0 rounded-full ${m.final ? 'bg-[#111827]' : 'bg-[#6B9F91]'}`}
                                style={{ zIndex: -1 }}
                            />
                        </div>

                        {/* Staggered Label Animation anchored beside node */}
                        <motion.div
                            initial={{ opacity: 0, x: m.align === "left" ? 10 : -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: (i * 0.3) + 0.2 }}
                            className={`absolute whitespace-nowrap text-sm font-bold bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-100 ${m.final ? 'top-[calc(100%+8px)] text-[#111827] text-base px-6' : m.align === "left" ? 'right-[calc(100%+16px)] text-gray-700' : 'left-[calc(100%+16px)] text-gray-700'}`}
                        >
                            {m.label}
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
});

const MobileVisualDigital = React.memo(() => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full h-full flex items-center justify-center"
        >
            <svg viewBox="0 0 400 360" className="w-[400px] h-auto drop-shadow-sm pointer-events-none">
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#6B9F91" floodOpacity="0.4" />
                    </filter>
                    <filter id="shadow-md" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.08" />
                    </filter>
                    <filter id="shadow-lg" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#000" floodOpacity="0.12" />
                    </filter>
                </defs>

                {/* Circuit Board Trace Background */}
                <path
                    d="M 130 150 V 190 Q 130 200 140 200 H 180 Q 190 200 190 210 V 275 M 190 275 H 280"
                    fill="none" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="4 4"
                />

                {/* Moving Data Packet */}
                <motion.path
                    d="M 130 150 V 190 Q 130 200 140 200 H 180 Q 190 200 190 210 V 275 M 190 275 H 280"
                    fill="none" stroke="#6B9F91" strokeWidth="3" filter="url(#glow)" strokeLinecap="round"
                    initial={{ pathLength: 0.1, pathOffset: 0 }}
                    animate={{ pathOffset: [0, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ willChange: "stroke-dashoffset" }}
                />

                {/* Component 1: Code Editor (SS40 Theme) */}
                <g transform="translate(15, 15)" filter="url(#shadow-lg)">
                    <rect x="0" y="0" width="220" height="135" rx="8" fill="#111827" />
                    {/* Header */}
                    <rect x="0" y="0" width="220" height="24" rx="8" fill="#1F2937" />
                    {/* Neutral MacOS dots */}
                    <circle cx="15" cy="12" r="4" fill="#374151" />
                    <circle cx="28" cy="12" r="4" fill="#4B5563" />
                    <circle cx="41" cy="12" r="4" fill="#6B7280" />
                    <text x="110" y="16" fontSize="9" fill="#9CA3AF" fontFamily="monospace" textAnchor="middle">api-controller.ts</text>

                    {/* Code Lines - Mint & Gray Syntax */}
                    <rect x="15" y="40" width="30" height="6" rx="3" fill="#A6CBBE" />
                    <rect x="52" y="40" width="60" height="6" rx="3" fill="#D1D5DB" />

                    <rect x="15" y="55" width="80" height="6" rx="3" fill="#6B9F91" />
                    <rect x="100" y="55" width="40" height="6" rx="3" fill="#E5E7EB" />

                    <rect x="30" y="70" width="40" height="6" rx="3" fill="#A6CBBE" />

                    {/* Animated Fade Syntax */}
                    <motion.rect
                        x="30" y="85" width="110" height="6" rx="3" fill="#6B9F91"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                    <motion.rect
                        x="30" y="100" width="80" height="6" rx="3" fill="#A6CBBE"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                    />

                    {/* Blinking Cursor */}
                    <motion.rect
                        x="145" y="83" width="6" height="10" fill="#6B9F91"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ willChange: "opacity" }}
                    />
                </g>

                {/* Component 2: Dev Team Panel */}
                <g transform="translate(195, 45)" filter="url(#shadow-md)">
                    <rect x="0" y="0" width="145" height="75" rx="10" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                    <rect x="0" y="0" width="145" height="75" rx="10" fill="white" />
                    {/* Sparkle mint */}
                    <path d="M 15 15 L 17 22 L 24 24 L 17 26 L 15 33 L 13 26 L 6 24 L 13 22 Z" fill="#6B9F91" />
                    <text x="32" y="24" fontSize="11" fontWeight="bold" fill="#111827" fontFamily="sans-serif">Dev Team</text>

                    <circle cx="16" cy="42" r="5" fill="#EDF5F2" />
                    <path d="M 13 42 L 15 44 L 19 40" fill="none" stroke="#6B9F91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="26" y="45" fontSize="9" fontWeight="bold" fill="#374151" fontFamily="sans-serif">Code Optimized</text>

                    <circle cx="16" cy="58" r="5" fill="#EDF5F2" />
                    <path d="M 13 58 L 15 60 L 19 56" fill="none" stroke="#6B9F91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="26" y="61" fontSize="9" fontWeight="bold" fill="#374151" fontFamily="sans-serif">Logic Refactored</text>
                </g>

                {/* Component 3: Build Terminal */}
                <g transform="translate(15, 170)" filter="url(#shadow-md)">
                    <rect x="0" y="0" width="165" height="65" rx="10" fill="#111827" />
                    <text x="15" y="24" fontSize="10" fill="#6B9F91" fontFamily="monospace">&gt;</text>
                    <text x="26" y="24" fontSize="10" fill="#D1D5DB" fontFamily="monospace">npm run deploy</text>

                    <motion.g
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.5 }}
                    >
                        <path d="M 16 41 L 19 44 L 25 38" fill="none" stroke="#6B9F91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="32" y="44" fontSize="10" fontWeight="bold" fill="#6B9F91" fontFamily="sans-serif">Build Successful</text>
                        <text x="15" y="56" fontSize="8" fill="#6B7280" fontFamily="sans-serif">Deployed in 1.2s</text>
                    </motion.g>
                </g>

                {/* Component 4: Cloud Deployment */}
                <g transform="translate(130, 245)" filter="url(#shadow-md)">
                    <rect x="0" y="0" width="120" height="65" rx="12" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                    <motion.g
                        animate={{ y: [-1, 1, -1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ willChange: "transform" }}
                    >
                        <rect x="15" y="16" width="32" height="32" rx="8" fill="#EDF5F2" />
                        <path d="M22 31h10a3 3 0 0 0 0-6h-1A4.5 4.5 0 1 0 22 31Z" fill="none" stroke="#6B9F91" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.g>
                    {/* Live Pulser */}
                    <circle cx="59" cy="23" r="3" fill="#6B9F91" />
                    <motion.circle
                        cx="59" cy="23" r="3" fill="#6B9F91"
                        animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, ease: "easeOut" }}
                        style={{ willChange: "transform, opacity" }}
                    />
                    <text x="68" y="26" fontSize="10" fontWeight="bold" fill="#111827" fontFamily="sans-serif">Live</text>
                    <text x="55" y="40" fontSize="8" fill="#6B7280" fontFamily="sans-serif">Deployment</text>
                    <text x="55" y="50" fontSize="8" fill="#6B7280" fontFamily="sans-serif">Successful</text>
                </g>

                {/* Component 5: Live Preview */}
                <g transform="translate(265, 175)" filter="url(#shadow-lg)">
                    <rect x="0" y="0" width="120" height="135" rx="10" fill="#ffffff" />
                    <rect x="0" y="0" width="120" height="24" rx="10" fill="#F3F4F6" />
                    <rect x="0" y="14" width="120" height="10" fill="#F3F4F6" />

                    <circle cx="12" cy="12" r="3" fill="#D1D5DB" />
                    <circle cx="21" cy="12" r="3" fill="#D1D5DB" />
                    <circle cx="30" cy="12" r="3" fill="#D1D5DB" />
                    <rect x="42" y="9" width="70" height="6" rx="3" fill="#ffffff" />

                    {/* Website Content Mockup */}
                    <rect x="12" y="38" width="55" height="10" rx="3" fill="#111827" />
                    <rect x="12" y="54" width="96" height="4" rx="2" fill="#E5E7EB" />
                    <rect x="12" y="62" width="76" height="4" rx="2" fill="#E5E7EB" />

                    <rect x="12" y="74" width="45" height="45" rx="6" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
                    <rect x="63" y="74" width="45" height="45" rx="6" fill="#EDF5F2" stroke="#6B9F91" strokeWidth="1" />

                    <path d="M 75 92 L 85 92 M 80 87 L 80 97" stroke="#6B9F91" strokeWidth="2" strokeLinecap="round" />
                </g>
            </svg>
        </motion.div>
    );
});
MobileVisualDigital.displayName = "MobileVisualDigital";

VisualDigital.displayName = "VisualDigital";
VisualProducts.displayName = "VisualProducts";
VisualAcademics.displayName = "VisualAcademics";

const MobileSwipeCard = ({ scene, idx }: { scene: any, idx: number }) => {
    const Visual = idx === 0 ? MobileVisualDigital : (idx === 1 ? VisualProducts : VisualAcademics);

    return (
        <div
            className="mobile-swipe-card w-[82vw] sm:w-[350px] flex-shrink-0 flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 snap-center relative scroll-ml-6"
            data-mobile-id={idx}
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        >
            {/* Visual Part (Blended seamlessly into the card) */}
            <div className="h-[260px] w-full flex items-center justify-center bg-white overflow-hidden relative shrink-0 z-0">
                {/* Scaled explicit bounding box to prevent clipping and guarantee safe padding */}
                <div
                    className="absolute flex items-center justify-center origin-center w-[500px] h-[500px]"
                    style={{ transform: 'scale(0.55) translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
                >
                    <Visual />
                </div>
            </div>

            {/* Content Part */}
            <div className="flex-1 w-full flex flex-col px-6 pb-8 bg-white text-left relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#EDF5F2] text-[#6B9F91] flex items-center justify-center font-bold text-base mb-4 border border-gray-100 shrink-0">
                    0{idx + 1}
                </div>
                <h3 className="text-2xl font-black text-[#111827] tracking-tight mb-2">{scene.title}</h3>
                <p className="text-gray-500 text-sm leading-snug mb-5 shrink-0 line-clamp-2">{scene.description}</p>

                <div className="flex flex-col gap-2">
                    {scene.cards.map((card: any, i: number) => (
                        <div key={i} className="flex flex-col gap-1 p-3 bg-gray-50/70 rounded-xl border border-gray-100 shrink-0">
                            <span className="text-[#111827] font-bold text-sm tracking-tight">{card.title}</span>
                            <p className="text-gray-500 text-xs leading-relaxed opacity-90">{card.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export function InteractiveImpactShowcase() {
    const [activeScene, setActiveScene] = React.useState(0);
    const [activeMobileIdx, setActiveMobileIdx] = React.useState(0);
    const mobileScrollRef = React.useRef<HTMLDivElement>(null);

    const scrollToMobileScene = (idx: number) => {
        if (!mobileScrollRef.current) return;
        const container = mobileScrollRef.current;
        const cardWidth = container.clientWidth * 0.82 + 20; // Exact match to scroll math
        container.scrollTo({
            left: idx * cardWidth,
            behavior: "smooth"
        });
    };

    React.useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveScene(Number(entry.target.getAttribute("data-scene-id")));
                }
            });
        }, { rootMargin: "-40% 0px -40% 0px" });

        const sections = document.querySelectorAll(".impact-topic");
        sections.forEach(s => observer.observe(s));

        const mobileObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveMobileIdx(Number(entry.target.getAttribute("data-mobile-id")));
                }
            });
        }, { root: mobileScrollRef.current, threshold: 0.6 });

        const mobileCards = document.querySelectorAll(".mobile-swipe-card");
        mobileCards.forEach(c => mobileObserver.observe(c));

        return () => {
            observer.disconnect();
            mobileObserver.disconnect();
        };
    }, []);

    const CurrentVisual = () => {
        if (activeScene === 1) return <VisualProducts key="p" />;
        if (activeScene === 2) return <VisualAcademics key="a" />;
        return <VisualDigital key="d" />;
    };

    return (
        <section className="bg-white border-t border-b border-gray-100 relative">

            {/* Header Area above the sticky scroll */}
            <div className="w-full bg-[#FAFCFB] pt-16 md:pt-24 pb-8 md:pb-10 border-b border-gray-100 relative z-20">
                <Container className="text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="inline-block px-3 py-1.5 rounded-full bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-widest mb-6"
                    >
                        OUR IMPACT
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-4"
                    >
                        How We Create Impact
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto"
                    >
                        One Vision. Three Ways We Build the Future.
                    </motion.p>

                </Container>
            </div>

            {/* Desktop Sticky Scrolling Engine */}
            <div className="hidden lg:flex flex-row-reverse w-full relative bg-transparent">
                {/* Visual Column */}
                <div className="w-[55%] h-screen sticky top-0 bg-transparent flex items-center justify-center overflow-hidden border-l border-gray-200 z-30 shadow-none">
                    <AnimatePresence mode="wait">
                        <CurrentVisual />
                    </AnimatePresence>
                </div>

                {/* Content Column (Scrolling natively underneath) */}
                <div className="w-[45%] relative z-10 flex flex-col pb-0">
                    {SCENES.map((scene, idx) => (
                        <div
                            key={`desktop-scene-${idx}`}
                            data-scene-id={idx}
                            className={`impact-topic w-full min-h-screen flex items-center ${activeScene === idx ? 'opacity-100' : 'opacity-30'} transition-opacity duration-500`}
                        >
                            <Container className="pl-16 xl:pl-24 pr-12">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ margin: "-20% 0px -20% 0px" }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-[#EDF5F2] text-[#6B9F91] flex items-center justify-center font-bold text-lg mb-8 border border-gray-100">
                                        0{idx + 1}
                                    </div>
                                    <h3 className="text-4xl font-black text-[#111827] tracking-tight mb-6">{scene.title}</h3>
                                    <p className="text-gray-500 text-lg leading-relaxed mb-10">{scene.description}</p>

                                    <div className="flex flex-col gap-6">
                                        {scene.cards.map((card, i) => (
                                            <div key={i} className="flex flex-col gap-2 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#EDF5F2] flex items-center justify-center shadow-sm border border-gray-50 text-[#6B9F91] font-bold text-sm">
                                                        {i + 1}
                                                    </div>
                                                    <span className="text-[#111827] font-bold text-lg tracking-wide">{card.title}</span>
                                                </div>
                                                <p className="text-gray-500 text-sm leading-relaxed pl-11">{card.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </Container>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Native Horizontal Swipe Deck */}
            <div className="flex flex-col lg:hidden w-full bg-gray-50 pt-10 pb-16 relative">
                <div
                    ref={mobileScrollRef}
                    className="flex w-full overflow-x-auto snap-x snap-mandatory px-6 gap-5 items-stretch [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {SCENES.map((scene, idx) => (
                        <MobileSwipeCard key={`mobile-card-${idx}`} scene={scene} idx={idx} />
                    ))}
                    {/* End spacer so the last card doesn't hit the right screen edge */}
                    <div className="w-[4vw] shrink-0" />
                </div>

                {/* Pagination Dots representation */}
                <div className="w-full flex justify-center items-center gap-3 mt-8 z-10 relative">
                    {SCENES.map((_, i) => (
                        <button
                            key={`dot-${i}`}
                            onClick={() => scrollToMobileScene(i)}
                            aria-label={`Scroll to scene ${i + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-400 ease-out ${activeMobileIdx === i ? 'bg-[#6B9F91] w-8 shadow-sm scale-100' : 'bg-gray-300 w-2.5 hover:bg-gray-400 scale-90'} border-none cursor-pointer focus:outline-none`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
