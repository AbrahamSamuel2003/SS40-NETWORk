"use client";

import * as React from "react";
import { Container } from "@/components/ui/Container";
import { Landmark, FileText, CheckCircle2, ShieldCheck, Hash } from "lucide-react";

export function CorporateTrustBar() {
    const credentials = [
        {
            label: "CIN (Corporate Identity)",
            value: "U62013TN2025PTC187678",
            authority: "Ministry of Corporate Affairs",
            icon: Landmark,
        },
        {
            label: "DPIIT Recognition No",
            value: "DIPP268327",
            authority: "Startup India (Govt of India)",
            icon: ShieldCheck,
        },
        {
            label: "GSTIN Identification",
            value: "33ABSCS2156D1ZC",
            authority: "Goods & Services Tax Network",
            icon: FileText,
        },
        {
            label: "Statutory Tax Codes",
            value: "PAN: ABSCS2156D | TAN: MRIS15303B",
            authority: "Income Tax Department",
            icon: Hash,
        },
    ];

    return (
        <section className="bg-white border-b border-gray-200/80 py-6 sm:py-8">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {credentials.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-[#F8FAF9] hover:bg-white p-4 rounded-2xl border border-gray-200/70 hover:border-[#0F766E]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                        {item.label}
                                    </span>
                                    <div className="w-6 h-6 rounded-lg bg-[#D8E8E2] text-[#0F766E] flex items-center justify-center">
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-mono text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#0F766E] transition-colors break-all">
                                        {item.value}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-500">
                                        <CheckCircle2 className="w-3 h-3 text-[#0F766E] shrink-0" />
                                        <span className="truncate">{item.authority}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
