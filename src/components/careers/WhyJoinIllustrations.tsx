'use client';

import React from 'react';

/**
 * Pillar 1: Everyday Empowerment
 * "The Engineering Workbench & Code Pipeline"
 * Vector scene: Modern IDE code editor window, continuous delivery pipeline, and branching commit flow.
 * STRICTLY NO SPARKLES, NO DOTS.
 */
export function EmpowermentIllustration() {
    return (
        <div className="relative w-full max-w-[420px] aspect-[4/3] mx-auto select-none flex items-center justify-center">
            <svg
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-md"
            >
                {/* Soft Ambient Glow */}
                <rect x="30" y="30" width="340" height="240" rx="28" fill="#F0FDF4" />
                
                {/* Main Code Editor Window */}
                <g filter="drop-shadow(0 10px 25px rgba(15, 118, 110, 0.08))">
                    <rect x="50" y="45" width="260" height="180" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                    
                    {/* Window Header Bar */}
                    <path d="M50 59C50 51.268 56.268 45 64 45H296C303.732 45 310 51.268 310 59V76H50V59Z" fill="#F8FAFC" />
                    <line x1="50" y1="76" x2="310" y2="76" stroke="#E2E8F0" strokeWidth="1.5" />
                    
                    {/* Window Control Buttons */}
                    <circle cx="68" cy="60" r="4.5" fill="#FDA4AF" />
                    <circle cx="82" cy="60" r="4.5" fill="#FDE047" />
                    <circle cx="96" cy="60" r="4.5" fill="#86EFAC" />
                    
                    {/* Editor Tab Pill */}
                    <rect x="116" y="52" width="90" height="18" rx="5" fill="#EDF5F2" />
                    <text x="126" y="65" fill="#0F766E" fontSize="9" fontWeight="700" fontFamily="monospace">pipeline.ts</text>
                    
                    {/* Code Lines */}
                    {/* Line 1: import */}
                    <rect x="68" y="90" width="44" height="6" rx="3" fill="#0F766E" />
                    <rect x="118" y="90" width="65" height="6" rx="3" fill="#64748B" />
                    
                    {/* Line 2: function */}
                    <rect x="68" y="104" width="60" height="6" rx="3" fill="#0284C7" />
                    <rect x="134" y="104" width="80" height="6" rx="3" fill="#0F172A" />
                    
                    {/* Line 3: indented body */}
                    <rect x="88" y="118" width="55" height="6" rx="3" fill="#2DD4BF" />
                    <rect x="149" y="118" width="95" height="6" rx="3" fill="#94A3B8" />
                    
                    {/* Line 4: return statement */}
                    <rect x="88" y="132" width="70" height="6" rx="3" fill="#0F766E" />
                    <rect x="164" y="132" width="45" height="6" rx="3" fill="#38BDF8" />

                    {/* Line 5: close bracket */}
                    <rect x="68" y="146" width="18" height="6" rx="3" fill="#64748B" />

                    {/* Terminal Status Bar at Bottom */}
                    <rect x="62" y="166" width="236" height="46" rx="8" fill="#0F172A" />
                    <text x="74" y="184" fill="#34D399" fontSize="9" fontWeight="bold" fontFamily="monospace">✓ build completed in 420ms</text>
                    <text x="74" y="200" fill="#94A3B8" fontSize="8" fontFamily="monospace">deployed to production cluster</text>
                </g>

                {/* Floating CI/CD Pipeline Badge (Right Overlay) */}
                <g filter="drop-shadow(0 12px 24px rgba(15, 23, 42, 0.12))">
                    <rect x="230" y="135" width="130" height="110" rx="12" fill="#FFFFFF" stroke="#0F766E" strokeWidth="2" />
                    <rect x="242" y="148" width="75" height="14" rx="4" fill="#EDF5F2" />
                    <text x="248" y="159" fill="#0F766E" fontSize="9" fontWeight="800">FAST SHIP</text>
                    
                    {/* Step 1 */}
                    <circle cx="250" cy="178" r="6" fill="#0F766E" />
                    <path d="M248 178L250 180L253 176" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="264" y="175" width="70" height="6" rx="3" fill="#334155" />

                    {/* Step Line */}
                    <line x1="250" y1="184" x2="250" y2="198" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="2 2" />

                    {/* Step 2 */}
                    <circle cx="250" cy="204" r="6" fill="#2DD4BF" />
                    <path d="M248 204L250 206L253 202" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="264" y="201" width="55" height="6" rx="3" fill="#334155" />

                    {/* Step 3 - Active */}
                    <circle cx="250" cy="226" r="6" fill="#0284C7" />
                    <rect x="264" y="223" width="80" height="6" rx="3" fill="#0284C7" />
                </g>

                {/* Branch Flow Connector (Bottom Left Accent) */}
                <path d="M90 235V260C90 268 98 274 108 274H190" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="90" cy="235" r="4.5" fill="#FFFFFF" stroke="#0F766E" strokeWidth="2.5" />
                <circle cx="190" cy="274" r="4.5" fill="#0F766E" />
                <rect x="130" y="260" width="85" height="18" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                <text x="138" y="272" fill="#0F172A" fontSize="8" fontWeight="700">main branch</text>
            </svg>
        </div>
    );
}

/**
 * Pillar 2: Shared Energy
 * "Collaborative Synergy & Architecture Whiteboard"
 * Vector scene: Connected team nodes, whiteboard architecture blocks, and cohesive sprint alignment.
 * STRICTLY NO SPARKLES, NO DOTS.
 */
export function SharedEnergyIllustration() {
    return (
        <div className="relative w-full max-w-[420px] aspect-[4/3] mx-auto select-none flex items-center justify-center">
            <svg
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-md"
            >
                {/* Soft Ambient Background Panel */}
                <rect x="30" y="30" width="340" height="240" rx="28" fill="#F8FAFC" />
                
                {/* Whiteboard Board */}
                <g filter="drop-shadow(0 10px 25px rgba(0, 0, 0, 0.05))">
                    <rect x="50" y="48" width="300" height="204" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                    
                    {/* Top Marker Tray / Header */}
                    <rect x="70" y="60" width="110" height="16" rx="5" fill="#EDF5F2" />
                    <text x="78" y="72" fill="#0F766E" fontSize="9" fontWeight="800">TEAM WHITEBOARD</text>

                    {/* Architecture Node 1 (Frontend UI) */}
                    <rect x="75" y="96" width="85" height="48" rx="8" fill="#FFFFFF" stroke="#0F766E" strokeWidth="1.8" />
                    <rect x="85" y="106" width="30" height="6" rx="3" fill="#0F766E" />
                    <rect x="85" y="118" width="55" height="5" rx="2.5" fill="#94A3B8" />
                    <rect x="85" y="128" width="40" height="5" rx="2.5" fill="#CBD5E1" />

                    {/* Architecture Node 2 (Backend Core) */}
                    <rect x="235" y="96" width="85" height="48" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.8" />
                    <rect x="245" y="106" width="35" height="6" rx="3" fill="#0284C7" />
                    <rect x="245" y="118" width="55" height="5" rx="2.5" fill="#94A3B8" />
                    <rect x="245" y="128" width="45" height="5" rx="2.5" fill="#CBD5E1" />

                    {/* Connecting Communication Line */}
                    <path d="M160 120H235" stroke="#0F766E" strokeWidth="2" strokeDasharray="4 3" />
                    <polygon points="198,116 205,120 198,124" fill="#0F766E" />
                    <rect x="180" y="106" width="35" height="14" rx="4" fill="#EDF5F2" />
                    <text x="184" y="116" fill="#0F766E" fontSize="7" fontWeight="bold">REST API</text>

                    {/* Shared Hub Node (Database / Cloud Services) */}
                    <rect x="150" y="172" width="100" height="54" rx="10" fill="#0F172A" />
                    <rect x="162" y="184" width="45" height="6" rx="3" fill="#2DD4BF" />
                    <rect x="162" y="196" width="70" height="5" rx="2.5" fill="#94A3B8" />
                    <rect x="162" y="206" width="50" height="5" rx="2.5" fill="#64748B" />

                    {/* Connectors from Nodes to Hub */}
                    <path d="M117 144V185C117 192 124 199 132 199H150" stroke="#0F766E" strokeWidth="2" />
                    <path d="M278 144V185C278 192 271 199 263 199H250" stroke="#0284C7" strokeWidth="2" />
                </g>

                {/* Collaborative Team Avatars Badge (Floating Left-Bottom) */}
                <g filter="drop-shadow(0 8px 18px rgba(15, 118, 110, 0.15))">
                    <rect x="42" y="210" width="112" height="42" rx="10" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                    
                    {/* Avatar 1 */}
                    <circle cx="62" cy="231" r="12" fill="#0F766E" />
                    <text x="58" y="235" fill="#FFFFFF" fontSize="10" fontWeight="bold">AS</text>

                    {/* Avatar 2 */}
                    <circle cx="82" cy="231" r="12" fill="#0284C7" />
                    <text x="78" y="235" fill="#FFFFFF" fontSize="10" fontWeight="bold">SK</text>

                    {/* Avatar 3 */}
                    <circle cx="102" cy="231" r="12" fill="#F59E0B" />
                    <text x="98" y="235" fill="#FFFFFF" fontSize="10" fontWeight="bold">RK</text>
                    
                    <circle cx="124" cy="231" r="9" fill="#EDF5F2" />
                    <text x="120" y="234" fill="#0F766E" fontSize="9" fontWeight="bold">+</text>
                </g>

                {/* High Trust / Merge Success Pill (Floating Top-Right) */}
                <g filter="drop-shadow(0 8px 18px rgba(0, 0, 0, 0.08))">
                    <rect x="250" y="38" width="108" height="32" rx="8" fill="#FFFFFF" stroke="#0F766E" strokeWidth="1.5" />
                    <circle cx="266" cy="54" r="7" fill="#10B981" />
                    <path d="M263 54L265 56L269 52" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="278" y="57" fill="#0F172A" fontSize="9" fontWeight="800">100% Peer Trust</text>
                </g>
            </svg>
        </div>
    );
}

/**
 * Pillar 3: Impactful Experiences
 * "Mission-Critical Impact & Scalable SaaS Cloud Analytics"
 * Vector scene: Rising growth telemetry curves, SaaS dashboard analytics, and rocket propulsion indicator.
 * STRICTLY NO SPARKLES, NO DOTS.
 */
export function ImpactfulExperiencesIllustration() {
    return (
        <div className="relative w-full max-w-[420px] aspect-[4/3] mx-auto select-none flex items-center justify-center">
            <svg
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-md"
            >
                {/* Ambient Soft Canvas */}
                <rect x="30" y="30" width="340" height="240" rx="28" fill="#F0F9FF" />

                {/* Main Analytics Dashboard Panel */}
                <g filter="drop-shadow(0 12px 28px rgba(15, 23, 42, 0.08))">
                    <rect x="52" y="46" width="280" height="194" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                    
                    {/* Header Strip */}
                    <rect x="68" y="60" width="80" height="14" rx="4" fill="#EDF5F2" />
                    <text x="74" y="70" fill="#0F766E" fontSize="8" fontWeight="800">LIVE IMPACT TELEMETRY</text>

                    {/* Metric Card 1 */}
                    <rect x="68" y="84" width="70" height="42" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                    <text x="76" y="98" fill="#64748B" fontSize="7" fontWeight="bold">Active Users</text>
                    <text x="76" y="116" fill="#0F172A" fontSize="13" fontWeight="800">120K+</text>

                    {/* Metric Card 2 */}
                    <rect x="146" y="84" width="70" height="42" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                    <text x="154" y="98" fill="#64748B" fontSize="7" fontWeight="bold">Uptime SLA</text>
                    <text x="154" y="116" fill="#0F766E" fontSize="13" fontWeight="800">99.98%</text>

                    {/* Metric Card 3 */}
                    <rect x="224" y="84" width="94" height="42" rx="8" fill="#0F172A" />
                    <text x="234" y="98" fill="#94A3B8" fontSize="7" fontWeight="bold">Speed Index</text>
                    <text x="234" y="116" fill="#2DD4BF" fontSize="13" fontWeight="800">&lt;180ms</text>

                    {/* Analytical Chart Frame */}
                    <rect x="68" y="136" width="250" height="90" rx="10" fill="#FAFCFB" stroke="#E2E8F0" strokeWidth="1" />

                    {/* Horizontal Chart Grid Lines (Plain solid lines, no dots) */}
                    <line x1="78" y1="156" x2="308" y2="156" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="78" y1="180" x2="308" y2="180" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="78" y1="204" x2="308" y2="204" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Growth Wave Area Fill */}
                    <path
                        d="M78 214C115 204 140 186 175 180C210 174 240 152 308 144V216H78V214Z"
                        fill="url(#impact_gradient)"
                        opacity="0.25"
                    />

                    {/* Primary Growth Vector Line */}
                    <path
                        d="M78 214C115 204 140 186 175 180C210 174 240 152 308 144"
                        stroke="#0F766E"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* Peak Metric Marker */}
                    <circle cx="308" cy="144" r="5" fill="#FFFFFF" stroke="#0F766E" strokeWidth="3" />
                </g>

                {/* Rocket / High Speed Launch Badge (Floating Bottom Right) */}
                <g filter="drop-shadow(0 10px 22px rgba(15, 118, 110, 0.18))">
                    <rect x="238" y="218" width="124" height="42" rx="12" fill="#0F766E" />
                    <rect x="246" y="226" width="26" height="26" rx="8" fill="#115E59" />
                    {/* Rocket Icon */}
                    <path
                        d="M260 231C257 234 255 237 254 242L258 246C263 245 266 243 269 240C271 234 271 231 271 231C271 231 268 231 260 231Z"
                        fill="#2DD4BF"
                    />
                    <text x="280" y="237" fill="#FFFFFF" fontSize="9" fontWeight="800">GLOBAL IMPACT</text>
                    <text x="280" y="248" fill="#D8E8E2" fontSize="7.5" fontWeight="500">Tamil Nadu to World</text>
                </g>

                <defs>
                    <linearGradient id="impact_gradient" x1="193" y1="144" x2="193" y2="216" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0F766E" />
                        <stop offset="1" stopColor="#0F766E" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
