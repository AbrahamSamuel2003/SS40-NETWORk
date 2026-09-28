"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Headphones, Phone, Mail, MessageSquare } from "lucide-react";

export function ContactHeroIllustration() {
    return (
        <div className="relative w-full max-w-[540px] mx-auto select-none flex items-center justify-center">
            
            {/* ================= FLOATING COMMUNICATION TOKENS (MATCHING SCREENSHOT) ================= */}

            {/* 1. Advisory & Tech Desk Active Status Pill (Top Left) */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#2DD4BF]/40 shadow-lg shadow-[#0F766E]/10 flex items-center gap-2.5"
            >
                <div className="w-7 h-7 rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#0F766E]/20">
                    <Headphones className="w-4 h-4 text-[#0F766E]" />
                </div>
                <span className="text-xs font-bold text-[#0F172A] tracking-tight font-serif">
                    Advisory &amp; Tech Desk Active
                </span>
            </motion.div>

            {/* 2. Floating Phone Call Token (Mid-Left) */}
            <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[28%] left-1 sm:left-3 z-20 bg-white rounded-2xl p-3 shadow-xl shadow-[#0F766E]/10 border border-gray-100/90 flex items-center justify-center"
            >
                <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] flex items-center justify-center text-[#0F766E]">
                    <Phone className="w-4.5 h-4.5" />
                </div>
            </motion.div>

            {/* 3. Floating Email Envelope Token (Top Right) */}
            <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute top-[16%] right-3 sm:right-6 z-20 bg-white rounded-2xl p-3 shadow-xl shadow-[#0F766E]/10 border border-gray-100/90 flex items-center justify-center"
            >
                <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] flex items-center justify-center text-[#0F766E]">
                    <Mail className="w-4.5 h-4.5" />
                </div>
            </motion.div>

            {/* 4. Floating Chat Bubble Token (Lower Left) */}
            <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute top-[50%] left-0 sm:left-1 z-20 bg-white rounded-2xl p-3 shadow-xl shadow-[#0F766E]/10 border border-gray-100/90 flex items-center justify-center"
            >
                <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] flex items-center justify-center text-[#0F766E]">
                    <MessageSquare className="w-4.5 h-4.5" />
                </div>
            </motion.div>

            {/* 5. Floating WhatsApp Token (Mid Right) */}
            <motion.div
                animate={{ y: [3, -3, 3] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-[44%] right-1 sm:right-3 z-20 bg-white rounded-2xl p-3 shadow-xl shadow-[#0F766E]/10 border border-gray-100/90 flex items-center justify-center"
            >
                <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] flex items-center justify-center text-[#0F766E]">
                    {/* Authentic WhatsApp Vector Icon */}
                    <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-.9-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.4 4.9L2 22l5.3-1.4c1.4.8 3 1.3 4.7 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.2.8.9-3.1-.2-.3c-.9-1.4-1.4-3-1.4-4.7 0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5-3.8 8.7-8.5 8.7z"/>
                    </svg>
                </div>
            </motion.div>

            {/* ================= SVG VECTOR SCENE ================= */}
            <svg
                viewBox="0 0 560 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-sm relative z-10"
            >
                <defs>
                    {/* Background Arch Gradient */}
                    <linearGradient id="heroBackdrop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#0F766E" stopOpacity="0.08" />
                    </linearGradient>
                    {/* Skin Gradients for Realistic Depth */}
                    <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBD7C0" />
                        <stop offset="100%" stopColor="#E5B299" />
                    </linearGradient>
                    <linearGradient id="skinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D49B80" />
                        <stop offset="100%" stopColor="#C48669" />
                    </linearGradient>
                    {/* Hair Gradient */}
                    <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                    {/* Jacket Gradient (SS40 Pine) */}
                    <linearGradient id="jacketPine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0F766E" />
                        <stop offset="100%" stopColor="#115E59" />
                    </linearGradient>
                    {/* Screen Dark Gradient */}
                    <linearGradient id="monitorScreen" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0F172A" />
                        <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                </defs>

                {/* Background Subtle Curved Arch */}
                <path
                    d="M50 340 C50 160, 150 60, 290 60 C430 60, 510 160, 510 340 Z"
                    fill="url(#heroBackdrop)"
                />

                {/* Ambient Background Circles */}
                <circle cx="90" cy="110" r="32" fill="#2DD4BF" fillOpacity="0.12" />
                <circle cx="470" cy="120" r="40" fill="#0F766E" fillOpacity="0.08" />

                {/* Ergonomic Office Chair Behind Character */}
                <rect x="135" y="150" width="80" height="120" rx="20" fill="#1E293B" opacity="0.9" />
                <rect x="155" y="115" width="40" height="30" rx="10" fill="#334155" />

                {/* ================= CHARACTER BODY ================= */}

                {/* Torso & Shoulders (Tailored Pine Blazer) */}
                <path
                    d="M85 340 C85 260, 115 228, 175 228 C235 228, 265 260, 265 340 Z"
                    fill="url(#jacketPine)"
                />

                {/* Inner Shirt (Crisp White with V-Neck Collar) */}
                <path d="M152 228 L175 285 L198 228 Z" fill="#FFFFFF" />
                <path d="M168 255 L175 285 L182 255 Z" fill="#2DD4BF" />

                {/* Neck with Natural Shadow under Chin */}
                <path d="M163 195 L187 195 L187 235 L163 235 Z" fill="url(#skinGrad)" />
                <path d="M163 195 C170 206, 180 206, 187 195 L187 205 C180 214, 170 214, 163 205 Z" fill="url(#skinShadow)" opacity="0.6" />

                {/* ================= CHARACTER HEAD & FACE ================= */}

                {/* Ears with Inner Detail */}
                <ellipse cx="140" cy="162" rx="6" ry="9" fill="url(#skinGrad)" />
                <ellipse cx="210" cy="162" rx="6" ry="9" fill="url(#skinGrad)" />
                <path d="M140 158 Q142 162 140 166" stroke="#D49B80" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <path d="M210 158 Q208 162 210 166" stroke="#D49B80" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                {/* Face Shape (Natural Jawline & Chin) */}
                <path
                    d="M144 148 C144 125, 155 118, 175 118 C195 118, 206 125, 206 148 C206 172, 194 195, 175 195 C156 195, 144 172, 144 148 Z"
                    fill="url(#skinGrad)"
                />

                {/* Modern Textured Hairstyle */}
                <path
                    d="M140 142 C140 115, 152 104, 175 104 C198 104, 212 112, 212 135 C212 140, 208 142, 204 138 C198 126, 186 122, 175 124 C164 126, 152 132, 144 145 C142 148, 140 146, 140 142 Z"
                    fill="url(#hairGrad)"
                />
                <path d="M150 118 C160 110, 180 110, 192 115" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />

                {/* Eyebrows */}
                <path d="M154 142 Q162 138 168 141" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M182 141 Q188 138 196 142" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                {/* Human Eyes with Eyelids & Iris Depth */}
                {/* Left Eye */}
                <ellipse cx="161" cy="151" rx="4.5" ry="3" fill="#FFFFFF" />
                <ellipse cx="162" cy="151" rx="2.5" ry="2.5" fill="#0F172A" />
                <circle cx="163" cy="150" r="0.8" fill="#FFFFFF" />
                <path d="M156 148 Q161 146 166 148" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                {/* Right Eye */}
                <ellipse cx="189" cy="151" rx="4.5" ry="3" fill="#FFFFFF" />
                <ellipse cx="188" cy="151" rx="2.5" ry="2.5" fill="#0F172A" />
                <circle cx="187" cy="150" r="0.8" fill="#FFFFFF" />
                <path d="M184 148 Q189 146 194 148" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                {/* Soft Nose Contour */}
                <path d="M174 153 L176 163 L172 165" stroke="#D49B80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                {/* Warm Friendly Smile & Lips */}
                <path d="M165 174 Q175 183 185 174" stroke="#A85A48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M167 175 Q175 180 183 175" fill="#FFFFFF" />

                {/* Sleek Modern Headset */}
                <path
                    d="M138 160 C136 122, 148 108, 175 108 C202 108, 214 122, 212 160"
                    stroke="#0F172A"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                />
                {/* Headset Cushions */}
                <rect x="134" y="152" width="7" height="18" rx="3.5" fill="#2DD4BF" />
                <rect x="209" y="152" width="7" height="18" rx="3.5" fill="#2DD4BF" />
                {/* Headset Mic Stem */}
                <path d="M138 165 Q145 182 164 179" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="166" cy="179" r="3" fill="#0F766E" />

                {/* Right Arm Typing on Keyboard */}
                <path
                    d="M220 280 L285 305 C295 309, 295 318, 285 322 L230 318 Z"
                    fill="#0F766E"
                />
                {/* Hand on Keyboard */}
                <ellipse cx="290" cy="314" rx="8" ry="5" fill="url(#skinGrad)" />

                {/* ================= WORKSTATION SETUP ================= */}

                {/* Monitor Stand */}
                <rect x="382" y="275" width="16" height="50" rx="3" fill="#94A3B8" />
                <ellipse cx="390" cy="325" rx="38" ry="6" fill="#64748B" />

                {/* Main Ultra-Wide Screen */}
                <rect
                    x="295"
                    y="125"
                    width="215"
                    height="155"
                    rx="14"
                    fill="url(#monitorScreen)"
                    stroke="#334155"
                    strokeWidth="4"
                />

                {/* Screen Window Controls */}
                <rect x="307" y="138" width="191" height="14" rx="5" fill="#1E293B" />
                <circle cx="318" cy="145" r="3" fill="#EF4444" />
                <circle cx="328" cy="145" r="3" fill="#EAB308" />
                <circle cx="338" cy="145" r="3" fill="#10B981" />

                {/* Code & Content Lines on Monitor */}
                <rect x="312" y="165" width="75" height="7" rx="3.5" fill="#2DD4BF" />
                <rect x="312" y="178" width="115" height="5" rx="2.5" fill="#64748B" />
                <rect x="322" y="190" width="95" height="5" rx="2.5" fill="#94A3B8" />
                <rect x="322" y="202" width="80" height="5" rx="2.5" fill="#2DD4BF" fillOpacity="0.8" />
                <rect x="312" y="214" width="105" height="5" rx="2.5" fill="#64748B" />
                <rect x="312" y="226" width="60" height="5" rx="2.5" fill="#0F766E" />

                {/* Analytics Dashboard Graph on Monitor */}
                <rect x="425" y="165" width="75" height="55" rx="8" fill="#1E293B" stroke="#334151" strokeWidth="1.5" />
                <path d="M432 208 L445 194 L458 200 L475 180 L492 174" stroke="#2DD4BF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="492" cy="174" r="3" fill="#2DD4BF" />

                {/* Slim Keyboard */}
                <rect x="270" y="315" width="125" height="12" rx="3" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1" />

                {/* Coffee Mug on Desk */}
                <rect x="235" y="292" width="22" height="28" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                <path d="M257 298 C265 298, 265 310, 257 310" stroke="#CBD5E1" strokeWidth="2.5" fill="none" />
                {/* Steam rising */}
                <path d="M242 284 Q240 277 244 272" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" fill="none" />
                <path d="M249 286 Q252 279 248 273" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" fill="none" />

                {/* Desk Surface with Shadow */}
                <rect x="20" y="330" width="520" height="14" rx="7" fill="#0F172A" />
                <rect x="25" y="344" width="510" height="4" rx="2" fill="#334155" />
            </svg>

        </div>
    );
}
