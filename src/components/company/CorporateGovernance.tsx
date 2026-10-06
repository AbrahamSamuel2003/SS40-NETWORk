"use client";

import * as React from "react";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
    MapPin,
    UserCheck,
} from "lucide-react";

export function CorporateGovernance() {
    const directors = [
        {
            name: "Muppidathi Sivasubramanian",
            role: "Director",
            dinStatus: "Appointed at Incorporation",
            state: "Tamil Nadu, India",
            responsibilities: "Executive Strategy, Engineering Architecture & Institutional Partnerships",
        },
        {
            name: "Muppidathi",
            role: "Director",
            dinStatus: "Appointed at Incorporation",
            state: "Tamil Nadu, India",
            responsibilities: "Corporate Governance, Statutory Compliance & Regional Operations",
        },
    ];

    return (
        <SectionWrapper id="governance" className="bg-[#D8E8E2] py-16 lg:py-24 border-b border-[#0F766E]/15 relative overflow-hidden font-crimson font-serif">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-30">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(rgba(15,118,110,0.12) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                    }}
                />
            </div>

            <Container className="relative z-10 space-y-12">
                {/* Section Heading */}
                <SectionHeading
                    badge="CORPORATE GOVERNANCE & LEADERSHIP"
                    title={
                        <>
                            Built on Trust, <span className="text-[#0F766E]">Integrity & Compliance.</span>
                        </>
                    }
                    description="SS40 NETWORK PRIVATE LIMITED operates under strict statutory governance, ethical execution, and experienced board leadership."
                    align="center"
                />

                {/* Unified 2-Column Corporate Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    {/* 1. Left Card: Board of Directors & Executive Leadership */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="w-9 h-9 rounded-xl bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 font-serif leading-tight">
                                            Board of Directors
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">Executive Leadership & Governance</p>
                                    </div>
                                </div>
                                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D8E8E2] text-[#0F766E] whitespace-nowrap shrink-0">
                                    Active Board
                                </span>
                            </div>

                            <div className="space-y-4">
                                {directors.map((director, idx) => (
                                    <div
                                        key={idx}
                                        className="p-5 rounded-2xl bg-[#F8FAF9] border border-gray-100 space-y-2.5 hover:border-[#0F766E]/30 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h4 className="font-bold text-base text-gray-900 leading-tight">
                                                    {director.name}
                                                </h4>
                                                <p className="text-xs text-[#0F766E] font-semibold mt-0.5">
                                                    {director.role} • {director.state}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md shrink-0">
                                                {director.dinStatus}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed pt-1 border-t border-gray-200/60">
                                            {director.responsibilities}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                            <span>Constitution</span>
                            <span className="font-bold text-[#0F766E]">Private Limited Company</span>
                        </div>
                    </div>

                    {/* 2. Right Card: Principal Registered Office & Statutory Profile */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm flex flex-col justify-between space-y-6">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div className="w-9 h-9 rounded-xl bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 font-serif leading-tight">
                                            Principal Registered Office
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">Official Statutory Registered Location</p>
                                    </div>
                                </div>
                                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D8E8E2] text-[#0F766E] whitespace-nowrap shrink-0">
                                    RoC Verified
                                </span>
                            </div>

                            <div className="p-5 rounded-2xl bg-[#F8FAF9] border border-gray-100 space-y-3">
                                <p className="text-xs sm:text-sm text-gray-800 font-mono leading-relaxed">
                                    <strong className="text-gray-900 font-bold block mb-1 text-sm">SS40 NETWORK PRIVATE LIMITED</strong>
                                    Building No. 5/4/37a, West Car Street, Petta,<br />
                                    Vadakku Ariyanayakipuram, Ambasamudram,<br />
                                    Tirunelveli — 627603, Tamil Nadu, India.
                                </p>
                                <div className="pt-3 border-t border-gray-200/60 flex flex-wrap items-center gap-2 text-[11px] text-gray-600">
                                    <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 font-medium">
                                        RoC: Central Registration Centre (CRC)
                                    </span>
                                    <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 font-medium">
                                        State: Tamil Nadu
                                    </span>
                                    <span className="px-2.5 py-1 rounded-md bg-white border border-gray-200 font-medium">
                                        PIN: 627603
                                    </span>
                                </div>
                            </div>

                            {/* Statutory Credentials Quick Reference */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        CIN Number
                                    </p>
                                    <p className="font-mono text-xs font-bold text-gray-900 mt-0.5">
                                        U62013TN2025PTC187678
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-xl bg-[#F8FAF9] border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Startup India Recognition
                                    </p>
                                    <p className="font-mono text-xs font-bold text-[#0F766E] mt-0.5">
                                        DIPP268327
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                            <span>Statutory Status</span>
                            <span className="font-bold text-[#0F766E]">100% MCA & DPIIT Compliant</span>
                        </div>
                    </div>
                </div>
            </Container>
        </SectionWrapper>
    );
}
