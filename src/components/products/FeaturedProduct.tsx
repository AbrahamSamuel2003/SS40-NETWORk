"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    FileText,
    CreditCard,
    PiggyBank,
    ShieldCheck,
    CloudIcon,
    BadgeCheck,
    CheckCircle2,
    PieChart,
    Wallet
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { hoverLift, slideUp, staggerContainer } from "@/lib/animations";

const FEATURE_CARDS = [
    { title: "GST Ready Invoicing", icon: FileText, desc: "Automatically calculate GST and generate tax-compliant invoices." },
    { title: "Instant Invoice Creation", icon: Zap, desc: "Create and send professional invoices in under 60 seconds." },
    { title: "Quotation Management", icon: FileSignature, desc: "Convert quotes to active invoices with a single click." },
    { title: "Expense Tracking", icon: PiggyBank, desc: "Categorize business expenses and track financial health." },
    { title: "Cloud Backup", icon: CloudIcon, desc: "Real-time automated backups of all your financial data." },
    { title: "Payment Integration", icon: CreditCard, desc: "Accept online payments securely via multiple gateways." },
];

function Zap(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
}
function FileSignature(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h5.5" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M21 12.5a2.828 2.828 0 1 0-4-4L9.5 16.028l-2.956.74 1.156-3.235zm-2.472-2.472 2.472 2.472" /></svg>;
}

export function FeaturedProduct() {
    return (
        <SectionWrapper id="featured-product" className="bg-[#F2F7F5]">
            <Container className="space-y-16">

                {/* Top Section Layout (Two Columns) */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

                    {/* Left Column: Product Info */}
                    <div className="w-full lg:w-[45%] flex flex-col text-center lg:text-left items-center lg:items-start">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideUp}
                            className="flex flex-col items-center lg:items-start"
                        >
                            <Badge className="mb-4 rounded-md uppercase tracking-widest text-[10px] font-bold bg-[#2DD4BF]/15 text-[#0F766E]">
                                OUR PRODUCT
                            </Badge>

                            <div className="mb-8 border-l-4 border-[#2DD4BF] pl-4 lg:border-l-4 lg:pl-4 border-l-0 pl-0 border-b-4 pb-2 lg:border-b-0 lg:pb-0 inline-block">
                                <h4 className="text-[#2DD4BF] font-mono text-sm tracking-widest font-bold mb-2 uppercase">ClearInvoice</h4>
                                <h2 className="text-3xl md:text-5xl font-bold text-[#111827] leading-tight tracking-tight">
                                    Smart Invoicing <br />
                                    Built For Modern Businesses
                                </h2>
                            </div>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                                ClearInvoice helps businesses create invoices, manage billing, track expenses, and simplify financial workflows through a modern cloud-based experience.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-10">
                                {["GST Automation", "Easy Billing", "Expense Manager"].map((chip, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold shadow-sm">
                                        {chip}
                                    </span>
                                ))}
                            </div>

                            <Button asChild size="lg" className="w-full sm:w-auto bg-[#2DD4BF] hover:bg-[#14b8a6] text-white shadow-lg shadow-[#2DD4BF]/20 rounded-xl group">
                                <Link href="/contact">
                                    Start using ClearInvoice
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right Column: Elaborate SaaS Dashboard Mockup */}
                    <div className="w-full lg:w-[55%] relative flex justify-center lg:justify-end min-h-[500px]">

                        {/* Background Container Flow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[#DFE9D4]/40 blur-[80px] rounded-full z-0" />

                        {/* Main Dashboard Window */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative z-10 w-full max-w-[650px] aspect-[16/11] bg-white rounded-2xl shadow-2xl shadow-gray-300/50 border border-gray-200 flex flex-col overflow-hidden"
                        >
                            {/* Window Header */}
                            <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 shrink-0">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="ml-6 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-[#2DD4BF]" />
                                    <span className="text-xs font-bold text-gray-600">ClearInvoice Platform</span>
                                </div>
                            </div>

                            {/* Dashboard Body */}
                            <div className="flex flex-1 bg-gray-50/50 p-4 md:p-6 gap-4 overflow-hidden">

                                {/* Metrics Cards Column */}
                                <div className="w-1/3 flex flex-col gap-4">
                                    {/* Revenue Card */}
                                    <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col h-24 justify-between">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] md:text-xs text-gray-400 font-bold">Total Revenue</span>
                                            <Wallet className="w-4 h-4 text-[#2DD4BF]" />
                                        </div>
                                        <div>
                                            <span className="text-sm md:text-lg font-bold text-gray-900">$84,500</span>
                                            <span className="text-[8px] md:text-[10px] text-green-500 ml-2">+12%</span>
                                        </div>
                                    </div>

                                    {/* Expense Card */}
                                    <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col h-24 justify-between">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] md:text-xs text-gray-400 font-bold">Expenses</span>
                                            <PieChart className="w-4 h-4 text-orange-400" />
                                        </div>
                                        <div>
                                            <span className="text-sm md:text-lg font-bold text-gray-900">$12,300</span>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-orange-400 w-[60%]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Invoice Stats */}
                                    <div className="bg-[#2DD4BF] p-3 md:p-4 rounded-xl border border-[#2DD4BF] shadow-sm shadow-[#2DD4BF]/20 flex flex-col flex-1 text-white relative overflow-hidden">
                                        <div className="absolute -right-4 -bottom-4 opacity-20"><FileText className="w-20 h-20" /></div>
                                        <span className="text-[10px] md:text-xs text-teal-50 font-bold mb-1">Invoices Sent</span>
                                        <span className="text-2xl font-bold">142</span>
                                        <span className="text-[10px] md:text-xs text-teal-50 mt-auto">3 pending payment</span>
                                    </div>
                                </div>

                                {/* Main View Panel */}
                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-24 h-4 bg-gray-200 rounded-sm" />
                                        <div className="w-16 h-6 bg-[#2DD4BF] rounded-md" />
                                    </div>

                                    {/* Recent Invoice Table */}
                                    <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col pt-2 overflow-hidden">
                                        <div className="px-4 py-2 border-b border-gray-100 flex justify-between gap-4">
                                            <div className="w-1/4 h-2 bg-gray-200 rounded-full" />
                                            <div className="w-1/4 h-2 bg-gray-200 rounded-full" />
                                            <div className="w-1/4 h-2 bg-gray-200 rounded-full" />
                                        </div>
                                        <div className="flex-1 px-4 py-3 flex flex-col gap-4">
                                            {/* Row 1 */}
                                            <div className="flex justify-between items-center w-full">
                                                <div className="w-1/4 flex flex-col gap-1.5"><div className="w-full h-2 bg-gray-200 rounded" /><div className="w-1/2 h-1.5 bg-gray-100 rounded" /></div>
                                                <div className="w-1/4 text-center"><div className="w-8 h-2 bg-gray-200 rounded inline-block" /></div>
                                                <div className="w-1/4 flex justify-end"><span className="px-2 py-0.5 bg-green-100 text-green-600 text-[8px] md:text-[10px] font-bold uppercase rounded">Paid</span></div>
                                            </div>
                                            {/* Row 2 */}
                                            <div className="flex justify-between items-center w-full">
                                                <div className="w-1/4 flex flex-col gap-1.5"><div className="w-full h-2 bg-gray-200 rounded" /><div className="w-2/3 h-1.5 bg-gray-100 rounded" /></div>
                                                <div className="w-1/4 text-center"><div className="w-10 h-2 bg-gray-900 rounded inline-block" /></div>
                                                <div className="w-1/4 flex justify-end"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-[8px] md:text-[10px] font-bold uppercase rounded">Pending</span></div>
                                            </div>
                                            {/* Row 3 */}
                                            <div className="flex justify-between items-center w-full opacity-50">
                                                <div className="w-1/4 flex flex-col gap-1.5"><div className="w-[90%] h-2 bg-gray-200 rounded" /><div className="w-1/2 h-1.5 bg-gray-100 rounded" /></div>
                                                <div className="w-1/4 text-center"><div className="w-8 h-2 bg-gray-200 rounded inline-block" /></div>
                                                <div className="w-1/4 flex justify-end"><span className="px-2 py-0.5 bg-green-100 text-green-600 text-[8px] md:text-[10px] font-bold uppercase rounded">Paid</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [-6, 6, -6] }}
                            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                            className="absolute -right-2 top-20 md:-right-6 md:top-24 z-30 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl border border-gray-100 flex items-center gap-2"
                        >
                            <BadgeCheck className="w-4 h-4 text-[#2DD4BF]" />
                            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest whitespace-nowrap">GST Ready</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [6, -6, 6] }}
                            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
                            className="absolute -left-2 bottom-12 md:-left-8 md:bottom-20 z-30 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl border border-gray-100 flex items-center gap-2"
                        >
                            <CloudIcon className="w-4 h-4 text-blue-500" />
                            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest whitespace-nowrap">Cloud Backup</span>
                        </motion.div>

                        <motion.div
                            animate={{ y: [-4, 4, -4] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute right-[20%] -bottom-4 md:-bottom-2 z-30 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl border border-gray-100 flex items-center gap-2"
                        >
                            <ShieldCheck className="w-4 h-4 text-gray-800" />
                            <span className="text-[10px] font-bold text-gray-800 uppercase tracking-widest whitespace-nowrap">Secure Platform</span>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Section: Feature Cards Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12 border-t border-gray-100"
                >
                    {FEATURE_CARDS.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={slideUp}
                                {...hoverLift}
                                className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2DD4BF]/30 transition-all duration-300 flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] flex-shrink-0 flex items-center justify-center">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#111827] text-lg mb-1">{feature.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </Container>
        </SectionWrapper>
    );
}
