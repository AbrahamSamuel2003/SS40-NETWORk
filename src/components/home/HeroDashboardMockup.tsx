"use client";

import * as React from "react";
import { 
    Code2, 
    Layers, 
    GraduationCap, 
    Server, 
    ShieldCheck, 
    Cpu, 
    Activity, 
    Sparkles, 
    ArrowUpRight,
    CheckCircle2,
    Database,
    Cloud,
    Terminal
} from "lucide-react";
import { cn } from "@/utils/cn";

type WingTab = "solutions" | "products" | "academics";

interface WingData {
    id: WingTab;
    label: string;
    icon: React.ReactNode;
    tagline: string;
    metrics: { label: string; value: string; trend?: string }[];
    previewType: "code" | "saas" | "academic";
}

const WINGS: WingData[] = [
    {
        id: "solutions",
        label: "Digital Solutions",
        icon: <Code2 className="w-4 h-4" />,
        tagline: "High-Scale Full-Stack & Cloud Systems",
        metrics: [
            { label: "Deployment SLA", value: "99.99%", trend: "+Enterprise" },
            { label: "Architecture", value: "Microservices", trend: "Active" },
            { label: "Cloud Node Latency", value: "< 24ms", trend: "Optimized" }
        ],
        previewType: "code"
    },
    {
        id: "products",
        label: "SaaS Products",
        icon: <Layers className="w-4 h-4" />,
        tagline: "Proprietary Enterprise Software & ERPs",
        metrics: [
            { label: "Data Pipeline", value: "Real-Time", trend: "Synced" },
            { label: "Active Modules", value: "12+ Ready", trend: "Scale" },
            { label: "Data Security", value: "AES-256", trend: "Verified" }
        ],
        previewType: "saas"
    },
    {
        id: "academics",
        label: "Tech Academics",
        icon: <GraduationCap className="w-4 h-4" />,
        tagline: "Elite Industry-Grade Software Careers",
        metrics: [
            { label: "Curriculum", value: "Production-Grade", trend: "FullStack" },
            { label: "Capstone Projects", value: "Real Clients", trend: "100%" },
            { label: "Mentorship", value: "1-on-1 Senior", trend: "Active" }
        ],
        previewType: "academic"
    }
];

export function HeroDashboardMockup() {
    const [activeTab, setActiveTab] = React.useState<WingTab>("solutions");
    const activeWing = WINGS.find(w => w.id === activeTab) || WINGS[0];

    return (
        <div className="w-full lg:w-[48%] relative mt-8 lg:mt-0 flex justify-center lg:justify-end select-none">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--color-primary)]/20 via-[#DFE9D4]/40 to-[var(--color-soft)]/20 rounded-3xl blur-2xl -z-10 opacity-70" />

            {/* Main Interactive Command Frame */}
            <div className="w-full max-w-[520px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-[var(--color-border)] overflow-hidden flex flex-col z-10 transition-all duration-300">
                
                {/* Console Header / Interactive Wing Switcher */}
                <div className="bg-[#0F172A] p-3 sm:p-4 text-white">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-mono font-medium tracking-wide text-slate-300">SS40 ECOSYSTEM ENGINE v2.4</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-white/10 text-teal-300 border border-teal-400/20">
                                Live Console
                            </span>
                        </div>
                    </div>

                    {/* Interactive 3-Wing Tabs */}
                    <div className="grid grid-cols-3 gap-1.5 mt-3">
                        {WINGS.map((wing) => {
                            const isSelected = activeTab === wing.id;
                            return (
                                <button
                                    key={wing.id}
                                    type="button"
                                    onClick={() => setActiveTab(wing.id)}
                                    className={cn(
                                        "flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer text-center",
                                        isSelected 
                                            ? "bg-[var(--color-primary)] text-[#0F172A] shadow-md shadow-[var(--color-primary)]/20 font-bold" 
                                            : "text-slate-300 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    {wing.icon}
                                    <span className="truncate">{wing.label.split(" ")[0]}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dynamic Console Body */}
                <div className="p-5 flex flex-col gap-4 bg-gradient-to-b from-slate-50/50 to-white">
                    
                    {/* Active Wing Header Pill */}
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[var(--color-border)] shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/15 text-[var(--color-primary-hover)] flex items-center justify-center font-bold">
                                {activeWing.icon}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[var(--color-heading)] leading-tight">{activeWing.label}</h4>
                                <p className="text-[11px] text-[var(--color-body-text)]">{activeWing.tagline}</p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60">
                            <Activity className="w-3 h-3" />
                            <span>Online</span>
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2.5">
                        {activeWing.metrics.map((m, idx) => (
                            <div key={idx} className="bg-white p-2.5 sm:p-3 rounded-xl border border-[var(--color-border)] flex flex-col justify-between shadow-xs">
                                <span className="text-[10px] text-gray-500 font-medium truncate">{m.label}</span>
                                <div className="mt-1 flex items-baseline justify-between">
                                    <span className="text-xs sm:text-sm font-bold text-[var(--color-heading)]">{m.value}</span>
                                </div>
                                {m.trend && (
                                    <span className="text-[9px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded w-fit mt-1">
                                        {m.trend}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Interactive Showcase Preview Panel */}
                    <div className="bg-[#0F172A] rounded-xl p-3.5 text-slate-200 border border-slate-800 relative overflow-hidden font-mono text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 pb-1.5 border-b border-slate-800">
                            <div className="flex items-center gap-1.5">
                                <Terminal className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                                <span>preview_stream.ss40</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-sans">verified</span>
                        </div>

                        {activeTab === "solutions" && (
                            <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                                <p><span className="text-teal-400">const</span> <span className="text-yellow-300">stack</span> = [<span className="text-emerald-300">&quot;Next.js&quot;</span>, <span className="text-emerald-300">&quot;FastAPI&quot;</span>, <span className="text-emerald-300">&quot;PostgreSQL&quot;</span>];</p>
                                <p><span className="text-teal-400">await</span> SS40.deployEnterpriseApp({`{`} scope: <span className="text-emerald-300">&quot;Fixed-Price&quot;</span>, warranty: <span className="text-emerald-300">&quot;30-Days&quot;</span> {`}`});</p>
                                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-teal-300">
                                    <span>✔ Ultra-Fast Speed</span>
                                    <span>✔ Cloud Native CI/CD</span>
                                </div>
                            </div>
                        )}

                        {activeTab === "products" && (
                            <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                                <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded text-[11px]">
                                    <span className="text-slate-300">Enterprise ERP Core</span>
                                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                                </div>
                                <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded text-[11px]">
                                    <span className="text-slate-300">Automated Billing & GST</span>
                                    <span className="text-teal-300 font-bold">READY</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-teal-300">
                                    <span>✔ Multi-Tenant Ready</span>
                                    <span>✔ End-to-End Encrypted</span>
                                </div>
                            </div>
                        )}

                        {activeTab === "academics" && (
                            <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                                <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded text-[11px]">
                                    <span className="text-slate-300">Full-Stack Engineering</span>
                                    <span className="text-yellow-300 font-bold">COHORT ACTIVE</span>
                                </div>
                                <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded text-[11px]">
                                    <span className="text-slate-300">Production Code Reviews</span>
                                    <span className="text-emerald-400 font-bold">1-ON-1</span>
                                </div>
                                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-teal-300">
                                    <span>✔ Guaranteed Portfolio</span>
                                    <span>✔ Industry Internship</span>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Console Footer */}
                <div className="bg-slate-50 px-5 py-2.5 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-body-text)]">
                    <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary-hover)]" />
                        MCA Government Certified
                    </span>
                    <span className="font-semibold text-[var(--color-heading)] flex items-center gap-1">
                        HQ: Tirunelveli, India 🇮🇳
                    </span>
                </div>
            </div>

            {/* Floating Tactile Glass Badges */}
            <div className="animate-float-delayed-1 absolute -left-6 top-8 z-20 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-[var(--color-border)] hidden xl:flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-[var(--color-primary-hover)] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs font-bold text-[var(--color-heading)] leading-none">Fixed Scope Guarantee</p>
                    <p className="text-[10px] text-[var(--color-body-text)] mt-0.5">Zero surprise billing</p>
                </div>
            </div>

            <div className="animate-float-delayed-2 absolute -right-5 bottom-12 z-20 bg-[#0F172A] text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-[var(--color-primary)] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs font-bold text-white leading-none">30-Day Support</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">Post-launch warranty</p>
                </div>
            </div>

        </div>
    );
}
