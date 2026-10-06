"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Award,
    CheckCircle2,
    Download,
    ExternalLink,
    FileCheck,
    Landmark,
    Maximize2,
    ShieldCheck,
    X,
    ZoomIn,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface CertificateItem {
    id: string;
    tabName: string;
    tag: string;
    title: string;
    subtitle: string;
    regNumberLabel: string;
    regNumber: string;
    issueDate: string;
    validity: string;
    imageSrc: string;
    pdfPath: string;
    aspectRatio: string;
    narrative: string;
    highlights: string[];
    verifyUrl: string;
    verifyPortalName: string;
    icon: any;
}

const CERTIFICATES: CertificateItem[] = [
    {
        id: "mca-incorporation",
        tabName: "MCA Incorporation",
        tag: "Corporate Incorporation",
        title: "Incorporated Under Companies Act, 2013",
        subtitle: "Central Registration Centre (CRC) • Ministry of Corporate Affairs, Govt of India",
        regNumberLabel: "Corporate Identity Number (CIN)",
        regNumber: "U62013TN2025PTC187678",
        issueDate: "23-12-2025",
        validity: "Perpetual Corporate Entity",
        imageSrc: "/images/certificates/mca-certificate-of-incorporation.webp",
        pdfPath: "/documents/certificates/MCA-Certificate-of-Incorporation.pdf",
        aspectRatio: "aspect-[1190/1684]",
        narrative:
            "SS40 NETWORK PRIVATE LIMITED is incorporated as a Private Limited Company limited by shares under Section 7(2) & 8(1) of the Companies Act, 2013 and Rule 18 of Companies Rules, 2014. Registered with the Central Registration Centre, this formal charter establishes our perpetual corporate existence, board governance, and complete regulatory accountability.",
        highlights: [
            "Company Limited by Shares (Private Limited)",
            "Permanent Account Number (PAN): ABSCS2156D",
            "Tax Deduction Account Number (TAN): MRIS15303B",
            "Central RoC Manesar Jurisdiction",
        ],
        verifyUrl: "https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do",
        verifyPortalName: "MCA Master Data Portal",
        icon: Landmark,
    },
    {
        id: "startup-india",
        tabName: "Startup India (DPIIT)",
        tag: "Government Recognition",
        title: "DPIIT Recognized Technology Startup",
        subtitle: "Department for Promotion of Industry and Internal Trade • Ministry of Commerce & Industry",
        regNumberLabel: "Certificate No",
        regNumber: "DIPP268327",
        issueDate: "22-06-2026",
        validity: "Valid Upto: 22-12-2035 (10-Year Charter)",
        imageSrc: "/images/certificates/startup-india-recognition.webp",
        pdfPath: "/documents/certificates/DPIIT-Startup-India-Recognition.pdf",
        aspectRatio: "aspect-[1684/1190]",
        narrative:
            "SS40 NETWORK PRIVATE LIMITED is officially recognized as an innovative startup by the Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce and Industry, Government of India. Operating under the 'IT Services' industry and 'IT Consulting' sector, this accreditation affirms our engineering quality and dedication to building scalable digital infrastructure.",
        highlights: [
            "Industry: IT Services & IT Consulting",
            "10-Year Statutory Recognition (2026 – 2035)",
            "Incorporated under Companies Act on 23-12-2025",
            "Self-Certified National Innovation Entity",
        ],
        verifyUrl: "https://www.startupindia.gov.in",
        verifyPortalName: "Startup India Portal",
        icon: Award,
    },
    {
        id: "gst-registration",
        tabName: "GST Registration",
        tag: "Tax & Regulatory Compliance",
        title: "100% Tax Compliant GST Registration",
        subtitle: "Goods and Services Tax Network • Department of Revenue, Ministry of Finance",
        regNumberLabel: "GST Identification Number (GSTIN)",
        regNumber: "33ABSCS2156D1ZC",
        issueDate: "23-02-2026",
        validity: "Regular Active Taxpayer",
        imageSrc: "/images/certificates/gst-registration-certificate.webp",
        pdfPath: "/documents/certificates/GST-Registration-Certificate.pdf",
        aspectRatio: "aspect-[1190/1684]",
        narrative:
            "Registered under the Goods and Services Tax Act (Form GST REG-06) for commercial software engineering and consulting operations. Headquartered in Tirunelveli, Tamil Nadu, SS40 NETWORK PRIVATE LIMITED maintains rigorous invoicing discipline, statutory filings, and transparent financial reporting across all enterprise engagements.",
        highlights: [
            "Legal & Trade Name: SS40 NETWORK PRIVATE LIMITED",
            "Constitution: Private Limited Company",
            "Principal Place: Tirunelveli, Tamil Nadu (PIN: 627603)",
            "Verified Tax Invoicing & Filing Active",
        ],
        verifyUrl: "https://services.gst.gov.in/services/searchtp",
        verifyPortalName: "GST Services Portal",
        icon: ShieldCheck,
    },
];

export function OfficialCertifications() {
    const [activeTab, setActiveTab] = React.useState<number>(0);
    const [selectedCertModal, setSelectedCertModal] = React.useState<CertificateItem | null>(null);

    const currentCert = CERTIFICATES[activeTab] || CERTIFICATES[0];
    const Icon = currentCert.icon;

    return (
        <SectionWrapper id="certifications" className="bg-[#D8E8E2] scroll-mt-20 py-12 sm:py-16 lg:py-24 border-b border-[#0F766E]/15 relative overflow-hidden font-crimson font-serif">
            {/* Subtle Ambient Pattern */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-30">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(rgba(15,118,110,0.12) 1px, transparent 1px)`,
                        backgroundSize: "28px 28px",
                    }}
                />
            </div>

            {/* 0-Latency Preload Pipeline: Pre-fetches and decodes all certificates into GPU memory on initial page load */}
            <div className="hidden" aria-hidden="true">
                {CERTIFICATES.map((cert) => (
                    <Image
                        key={`preload-${cert.id}`}
                        src={cert.imageSrc}
                        alt=""
                        width={400}
                        height={560}
                        priority
                        loading="eager"
                        unoptimized
                    />
                ))}
            </div>

            <Container className="relative z-10 space-y-8 sm:space-y-10 max-w-6xl mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center space-y-2.5 sm:space-y-3 max-w-3xl mx-auto">
                    <p className="text-[11px] sm:text-xs font-bold tracking-widest text-[#0F766E] uppercase">
                        Awards & Recognition
                    </p>
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] font-serif leading-snug sm:leading-tight">
                        MCA Incorporated • DPIIT Recognized • 100% GST Compliant
                    </h2>
                </div>

                {/* Senior Production Segmented Switcher (Grid on Mobile, Inline on Desktop) */}
                <div className="w-full flex justify-center">
                    <div className="w-full max-w-md sm:max-w-none sm:w-auto grid grid-cols-3 sm:inline-flex p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur-md border border-gray-200/90 shadow-xs gap-1 sm:gap-2">
                        {CERTIFICATES.map((cert, idx) => {
                            const isActive = activeTab === idx;
                            const TabIcon = cert.icon;
                            return (
                                <button
                                    key={cert.id}
                                    type="button"
                                    onClick={() => setActiveTab(idx)}
                                    className={cn(
                                        "px-2 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 select-none cursor-pointer border text-center",
                                        isActive
                                            ? "bg-[#0F766E] text-white border-[#0F766E] shadow-xs shadow-[#0F766E]/20"
                                            : "bg-white/80 text-gray-700 border-transparent hover:border-[#0F766E]/30 hover:bg-white hover:text-[#0F766E]"
                                    )}
                                >
                                    <TabIcon className="w-3.5 h-3.5 hidden sm:block shrink-0" />
                                    {/* Mobile Concise Label */}
                                    <span className="sm:hidden font-semibold truncate">
                                        {cert.id === "mca-incorporation"
                                            ? "MCA"
                                            : cert.id === "startup-india"
                                            ? "Startup India"
                                            : "GST"}
                                    </span>
                                    {/* Desktop Full Label */}
                                    <span className="hidden sm:inline whitespace-nowrap">
                                        {cert.tabName}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Animated Certificate Showcase Card */}
                <div className="relative pt-1 sm:pt-2">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={currentCert.id}
                            initial={{ opacity: 0.8, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center"
                        >
                            {/* Left Column: Authentic Certificate Document (Floating, Clean Elevation) */}
                            <div className="lg:col-span-5 flex justify-center">
                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Inspect ${currentCert.title}`}
                                    onClick={() => setSelectedCertModal(currentCert)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            setSelectedCertModal(currentCert);
                                        }
                                    }}
                                    className="cursor-pointer relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[400px] rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl shadow-black/10 hover:scale-[1.01] transition-all duration-300 group/img focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] bg-white border border-gray-200/80"
                                >
                                    <div className={`relative w-full ${currentCert.aspectRatio} bg-white`}>
                                        <Image
                                            src={currentCert.imageSrc}
                                            alt={`${currentCert.title} — Official Document`}
                                            fill
                                            className="object-contain p-1"
                                            sizes="(max-width: 640px) 280px, (max-width: 1024px) 45vw, 400px"
                                            priority
                                            loading="eager"
                                            fetchPriority="high"
                                            unoptimized
                                        />
                                    </div>

                                    {/* Hover / Tap Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-[#0F766E] font-bold text-xs shadow-lg">
                                            <ZoomIn className="w-3.5 h-3.5" />
                                            <span>Click to Inspect</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Editorial Details */}
                            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
                                {/* Category Label (Icon hidden on mobile) */}
                                <div className="flex items-center gap-2">
                                    <div className="hidden sm:flex w-6 h-6 rounded-lg bg-[#0F766E]/10 text-[#0F766E] items-center justify-center shrink-0">
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#0F766E]">
                                        {currentCert.tag}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl sm:text-2xl lg:text-[30px] font-bold text-[#0F172A] font-serif leading-snug">
                                    {currentCert.title}
                                </h3>

                                {/* Statutory Identification Strip */}
                                <div className="p-3 sm:py-1.5 sm:px-3 rounded-xl bg-white/90 border border-[#0F766E]/15 shadow-2xs">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-xs font-mono">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-bold text-[#0F766E]">{currentCert.regNumberLabel}:</span>
                                            <span className="font-bold text-gray-900">{currentCert.regNumber}</span>
                                        </div>
                                        <span className="hidden sm:inline text-gray-300">•</span>
                                        <span className="text-gray-500 text-[11px] sm:text-xs">{currentCert.validity}</span>
                                    </div>
                                </div>

                                {/* Authoritative Narrative */}
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                    {currentCert.narrative}
                                </p>

                                {/* Key Verification Bullet Highlights (Hidden on Mobile View) */}
                                <div className="hidden sm:grid sm:grid-cols-2 gap-2 pt-1">
                                    {currentCert.highlights.map((point, pIdx) => (
                                        <div
                                            key={pIdx}
                                            className="flex items-start gap-2 text-xs text-gray-800 font-medium"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                                            <span>{point}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons: 2-column tactile grid on mobile, flex on desktop */}
                                <div className="pt-2 sm:pt-3 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
                                        <Button
                                            onClick={() => setSelectedCertModal(currentCert)}
                                            size="sm"
                                            className="bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs h-10 px-3 sm:px-5 rounded-xl cursor-pointer shadow-xs justify-center"
                                        >
                                            <Maximize2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                            <span>Inspect</span>
                                        </Button>

                                        <a
                                            href={currentCert.pdfPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 h-10 rounded-xl bg-white border border-gray-300 hover:border-[#0F766E] hover:text-[#0F766E] text-gray-700 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                                        >
                                            <Download className="w-3.5 h-3.5 shrink-0" />
                                            <span>PDF</span>
                                        </a>
                                    </div>

                                    <a
                                        href={currentCert.verifyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center sm:justify-start gap-1 text-xs font-bold text-[#0F766E] hover:underline w-full sm:w-auto py-1"
                                    >
                                        <span>Verify on {currentCert.verifyPortalName}</span>
                                        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </Container>

            {/* Full-Screen Document Inspection Modal */}
            <AnimatePresence>
                {selectedCertModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xs">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-4xl w-full overflow-hidden text-left relative z-10 flex flex-col max-h-[92vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#F0FDFA] to-white shrink-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-[#0F766E]/15 text-[#0F766E] flex items-center justify-center shrink-0">
                                        <FileCheck className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-base sm:text-lg text-gray-900 font-serif truncate">
                                            {selectedCertModal.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 truncate">
                                            {selectedCertModal.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCertModal(null)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body: Scrollable Document View */}
                            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
                                <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg p-2 sm:p-4">
                                    <div className={`relative w-full ${selectedCertModal.aspectRatio} max-h-[65vh]`}>
                                        <Image
                                            src={selectedCertModal.imageSrc}
                                            alt={selectedCertModal.title}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 800px"
                                            priority
                                            loading="eager"
                                            unoptimized
                                        />
                                    </div>
                                </div>

                                {/* Verification Data Strip */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-gray-200/80 space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            {selectedCertModal.regNumberLabel}
                                        </span>
                                        <p className="font-mono text-sm sm:text-base font-bold text-gray-900">
                                            {selectedCertModal.regNumber}
                                        </p>
                                        <p className="text-xs text-[#0F766E] font-semibold">
                                            {selectedCertModal.validity}
                                        </p>
                                    </div>

                                    <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-gray-200/80 space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            Issuing Body
                                        </span>
                                        <p className="text-xs font-bold text-gray-900 leading-tight">
                                            {selectedCertModal.subtitle}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Issue Date: <strong className="text-gray-700">{selectedCertModal.issueDate}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 sm:p-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50 shrink-0">
                                <a
                                    href={selectedCertModal.verifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline"
                                >
                                    <span>Verify on {selectedCertModal.verifyPortalName}</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>

                                <div className="flex items-center gap-2">
                                    <Button
                                        asChild
                                        size="sm"
                                        className="bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs h-9 rounded-xl cursor-pointer"
                                    >
                                        <a
                                            href={selectedCertModal.pdfPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="w-3.5 h-3.5 mr-1.5" />
                                            <span>Download Official PDF</span>
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
}
