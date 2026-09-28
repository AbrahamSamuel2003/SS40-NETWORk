"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";

export function ContactHeroIllustration() {
    return (
        <div className="relative w-full max-w-[540px] mx-auto select-none">
            {/* Main Illustration Container Frame */}
            <div className="relative bg-[#FAFCFB] rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xl shadow-gray-200/50 overflow-hidden">
                
                {/* SVG Vector Scene */}
                <svg
                    viewBox="0 0 560 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto drop-shadow-sm"
                >
                    <defs>
                        {/* Background Arch Gradient */}
                        <linearGradient id="heroBackdrop" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#0F766E" stopOpacity="0.12" />
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
                    <circle cx="90" cy="110" r="32" fill="#2DD4BF" fillOpacity="0.15" />
                    <circle cx="470" cy="120" r="40" fill="#0F766E" fillOpacity="0.1" />

                    {/* ================= FLOATING COMMUNICATION ICONS ================= */}
                    
                    {/* 1. Floating Phone Call Token (Top Left) */}
                    <g transform="translate(60, 110)">
                        <rect width="46" height="46" rx="15" fill="#FFFFFF" filter="drop-shadow(0 6px 14px rgba(15,118,110,0.12))" stroke="#E2E8F0" strokeWidth="1" />
                        <rect x="7" y="7" width="32" height="32" rx="10" fill="#EDF5F2" />
                        {/* Phone Icon Path */}
                        <path
                            d="M17 19 C17 24.5 21.5 29 27 29 C28.5 29 29.5 28 29 26.5 L27.5 24 C27 23.5 26 23.5 25.5 24 L24.8 24.7 C23.2 23.8 22.2 22.8 21.3 21.2 L22 20.5 C22.5 20 22.5 19 22 18.5 L19.5 17 C18 16.5 17 17.5 17 19 Z"
                            fill="#0F766E"
                        />
                    </g>

                    {/* 2. Floating Email Envelope Token (Top Right) */}
                    <g transform="translate(425, 65)">
                        <rect width="52" height="44" rx="14" fill="#FFFFFF" filter="drop-shadow(0 6px 14px rgba(15,118,110,0.12))" stroke="#E2E8F0" strokeWidth="1" />
                        <rect x="6" y="6" width="40" height="32" rx="10" fill="#EDF5F2" />
                        {/* Envelope Lines */}
                        <rect x="13" y="14" width="26" height="16" rx="3" fill="#FFFFFF" stroke="#0F766E" strokeWidth="1.5" />
                        <path d="M13 16 L26 23 L39 16" stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </g>

                    {/* 3. Floating Chat Bubble Token (Mid Left) */}
                    <g transform="translate(45, 195)">
                        <rect width="54" height="40" rx="14" fill="#FFFFFF" filter="drop-shadow(0 6px 14px rgba(15,118,110,0.12))" stroke="#E2E8F0" strokeWidth="1" />
                        {/* Chat bubble tail */}
                        <polygon points="58,225 68,225 54,233" fill="#FFFFFF" />
                        {/* Chat Lines */}
                        <rect x="57" y="206" width="28" height="4" rx="2" fill="#0F766E" />
                        <rect x="57" y="214" width="18" height="4" rx="2" fill="#2DD4BF" />
                    </g>

                    {/* 4. Floating Question / Support Query Token (Mid Right) */}
                    <g transform="translate(470, 190)">
                        <rect width="44" height="44" rx="14" fill="#FFFFFF" filter="drop-shadow(0 6px 14px rgba(15,118,110,0.12))" stroke="#E2E8F0" strokeWidth="1" />
                        <rect x="6" y="6" width="32" height="32" rx="10" fill="#EDF5F2" />
                        <path d="M22 15 C19 15 17.5 17 17.5 19 M22 15 C25 15 26.5 17 26.5 19.5 C26.5 22 23 23 22 25.5 M22 29 L22 30" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    </g>

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

                {/* Floating Interactive Badge: Live Advisory Status */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#2DD4BF]/40 shadow-lg shadow-[#0F766E]/10 flex items-center gap-2"
                >
                    <div className="w-6 h-6 rounded-lg bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                        <Headphones className="w-3.5 h-3.5 text-[#0F766E]" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-[#0F172A] tracking-tight">
                        Advisory &amp; Tech Desk Active
                    </span>
                </motion.div>

            </div>
        </div>
    );
}
