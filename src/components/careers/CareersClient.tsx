'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    Briefcase, 
    Calendar,
    ChevronDown, 
    ChevronUp, 
    ArrowRight,
    ArrowDown,
    MapPin,
    Check,
    Rocket,
    HeartHandshake,
    Mail,
    FileText
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { CareerHeroIllustration } from './CareerHeroIllustration';
import { WhyJoinSection } from './WhyJoinSection';

interface CareerItem {
    id: string;
    title: string;
    department: string;
    employmentType: string;
    location: string;
    experienceLevel: string;
    salaryRange?: string | null;
    description: string;
    responsibilities?: string[] | any;
    requirements?: string[] | any;
    skills?: string[] | any;
    badgeText?: string | null;
    applyLink?: string | null;
    applyEmail?: string | null;
    isFeatured: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: string | Date;
}

export function CareersClient({ initialCareers }: { initialCareers: CareerItem[] }) {
    // Dropdown accordions start closed initially
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="w-full bg-[#FAFCFB] min-h-screen relative text-[#334155]">
            
            {/* ================= HERO SECTION (MATCHING CONTACT HERO) ================= */}
            <section className="relative w-full overflow-hidden bg-white border-b border-gray-100 pt-24 pb-10 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-14 lg:min-h-[min(70vh,660px)] flex items-center">
                <Container className="relative z-10 w-full">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
                        
                        {/* LEFT: CONTENT */}
                        <div className="w-full lg:w-1/2 flex flex-col text-center lg:text-left z-20">
                            <div className="mb-4">
                                <span className="inline-block px-3.5 py-1 rounded-full bg-[#DFE9D4] text-[#0F766E] border border-[#0F766E]/20 text-[11px] font-extrabold uppercase tracking-widest shadow-2xs font-crimson">
                                    SS40 Careers &amp; Opportunities
                                </span>
                            </div>

                            <h1 className="text-[clamp(32px,5vw,48px)] font-bold text-[#0F172A] leading-[1.12] tracking-tight mb-4 max-w-2xl font-serif font-crimson">
                                Build the Future With Us. <br className="hidden lg:block" />
                                <span className="text-[#0F766E]">Shape Next-Gen Tech in Tirunelveli.</span>
                            </h1>

                            <p className="text-base md:text-lg text-[#334155] mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                Join an engineering ecosystem architecting custom software, scaling proprietary SaaS products, and grooming world-class developers. Discover your next career milestone below.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                                <button
                                    onClick={() => {
                                        document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full sm:w-auto bg-[#0F766E] text-white hover:bg-[#115E59] font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl group shadow-lg shadow-[#0F766E]/20 inline-flex items-center justify-center whitespace-nowrap cursor-pointer transition-all active:scale-[0.98]"
                                >
                                    <span>Explore Open Roles</span>
                                    <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform shrink-0" />
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: BESPOKE CAREER HERO ILLUSTRATION */}
                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center relative lg:translate-x-18 xl:translate-x-18">
                            <CareerHeroIllustration />
                        </div>

                    </div>
                </Container>
            </section>

            {/* ================= WHY JOIN SS40 NETWORK (CAPGEMINI-INSPIRED 3 PILLARS WITH BESPOKE ILLUSTRATIONS) ================= */}
            <WhyJoinSection />

            {/* ================= OPENINGS ACCORDION SECTION ================= */}
            <section id="openings" className="py-12 sm:py-16 relative bg-white">
                
                <Container className="relative z-10 max-w-4xl mx-auto space-y-6">
                    
                    {/* Section Header */}
                    <div className="text-center max-w-2xl mx-auto space-y-3 mb-2">
                        <div>
                            <span className="inline-block px-3.5 py-1 rounded-full bg-[#DFE9D4] text-[#0F766E] border border-[#0F766E]/20 text-[11px] font-extrabold uppercase tracking-widest font-crimson">
                                Active Openings
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight font-serif font-crimson">
                            Explore Available Roles ({initialCareers.length})
                        </h2>
                        <p className="text-sm sm:text-base text-[#475569] leading-relaxed mx-auto">
                            Discover active vacancies across our engineering wings in Tirunelveli. Click on any role to explore core responsibilities and technical qualifications, or submit your profile directly.
                        </p>
                    </div>

                    {/* ACCORDION CARDS LIST (Matching Screenshot) */}
                    {initialCareers.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center max-w-lg mx-auto">
                            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-gray-800">No active vacancies at the moment</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                We are not actively hiring for any open positions right now. Please check back soon.
                            </p>
                        </div>
                    ) : (
                        initialCareers.map((job) => {
                            const isExpanded = expandedIds.includes(job.id);
                            const badgeLabel = job.badgeText || (job.isFeatured ? 'CURRENT ROLE' : 'ACTIVE OPENING');

                            return (
                                <div
                                    key={job.id}
                                    className={`bg-white rounded-2xl transition-all duration-300 relative shadow-xs hover:shadow-md ${
                                        isExpanded
                                            ? 'border-2 border-[#0F766E] shadow-sm'
                                            : 'border border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {/* Floating Pill Badge Overlapping Top Border (exact match with screenshot) */}
                                    <div className="absolute -top-3 left-6 sm:left-8 z-10">
                                        <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-2xs ${
                                            isExpanded
                                                ? 'bg-[#0F766E] text-white'
                                                : 'bg-[#1E293B] text-white'
                                        }`}>
                                            {badgeLabel}
                                        </span>
                                    </div>

                                    {/* Clickable Header Area */}
                                    <div
                                        onClick={() => toggleExpand(job.id)}
                                        className="pt-6 pb-5 px-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                                    >
                                        {/* Left Column: Role Title & Department/Location Badges */}
                                        <div className="space-y-1.5">
                                            <h3 className="text-lg sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                                <span className="inline-flex items-center text-xs font-semibold text-[#0F766E] bg-[#0F766E]/10 px-2 py-0.5 rounded-md">
                                                    {job.department}
                                                </span>
                                                <span className="text-gray-300 hidden sm:inline">&bull;</span>
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                    <span>{job.location}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Column: Timeline, Status Tag & Clear Action CTA */}
                                        <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                                            <div className="flex items-center gap-2">
                                                {/* Timeline / Experience */}
                                                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-600 font-medium bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                                                    <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                                                    <span>{job.experienceLevel}</span>
                                                </div>

                                                {/* Status Pill */}
                                                <span className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold border transition-colors ${
                                                    isExpanded
                                                        ? 'bg-[#0F766E]/15 text-[#0F766E] border-[#0F766E]/30'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                    {job.employmentType} &bull; Open
                                                </span>
                                            </div>

                                            {/* Direct Action / Toggle CTA */}
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F766E]">
                                                <span className="text-[11px] sm:text-xs">{isExpanded ? 'Close' : 'View Details'}</span>
                                                <button
                                                    type="button"
                                                    aria-label={isExpanded ? 'Collapse role details' : 'Expand role details'}
                                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${
                                                        isExpanded
                                                            ? 'bg-[#0F766E] text-white border-[#0F766E]'
                                                            : 'bg-[#0F766E]/10 border-[#0F766E]/20 text-[#0F766E] hover:bg-[#0F766E] hover:text-white'
                                                    }`}
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* EXPANDED "DROP-DOWN" CONTENT (Matching Screenshot) */}
                                    {isExpanded && (
                                        <div className="px-5 sm:px-7 pb-6 sm:pb-7 pt-2 border-t border-gray-100 space-y-5 animate-in fade-in-50 duration-200">
                                            
                                            {/* Role Overview Paragraph */}
                                            {job.description && (
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                                                    {job.description}
                                                </p>
                                            )}

                                            {/* Key Responsibilities with Checkmark Circles */}
                                            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                                                <div className="space-y-2.5">
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                                        Core Responsibilities:
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {job.responsibilities.map((resp: string, idx: number) => (
                                                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                                                                <div className="w-4 h-4 rounded-full bg-[#0F766E]/10 border border-[#0F766E]/30 text-[#0F766E] flex items-center justify-center shrink-0 mt-0.5">
                                                                    <Check className="w-2.5 h-2.5" />
                                                                </div>
                                                                <span className="leading-relaxed">{resp}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Requirements & Qualifications with Checkmark Circles */}
                                            {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                                                <div className="space-y-2.5 pt-1">
                                                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                                        Qualifications & Requirements:
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {job.requirements.map((req: string, idx: number) => (
                                                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                                                                <div className="w-4 h-4 rounded-full bg-[#0F766E]/10 border border-[#0F766E]/30 text-[#0F766E] flex items-center justify-center shrink-0 mt-0.5">
                                                                    <Check className="w-2.5 h-2.5" />
                                                                </div>
                                                                <span className="leading-relaxed">{req}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Drop-down Footer with Location & "Apply Now" Button */}
                                            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                                    <span>{job.location}</span>
                                                </div>

                                                {/* Apply Now button navigating directly to form page */}
                                                <Link
                                                    href={`/careers/apply?jobId=${job.id}&role=${encodeURIComponent(job.title)}&dept=${encodeURIComponent(job.department)}`}
                                                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D625C] shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
                                                >
                                                    <span>Apply for this Position</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </Container>
            </section>

            {/* ================= READY TO JOIN US? (INSPIRED BY NVIDIA ARCHITECTURE) ================= */}
            <section className="py-14 sm:py-20 relative bg-[#D8E8E2] border-t border-[#0F766E]/15">
                <Container className="relative z-10 max-w-5xl mx-auto space-y-10 sm:space-y-12">
                    
                    {/* Section Header */}
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <div>
                            <span className="inline-block px-3.5 py-1 rounded-full bg-white text-[#0F766E] border border-[#0F766E]/20 text-[11px] font-extrabold uppercase tracking-widest font-crimson shadow-2xs">
                                Next Steps
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight font-serif font-crimson">
                            Ready to Join Us?
                        </h2>
                        <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
                            Take the next step in your engineering journey. Explore our active positions, review our transparent recruitment process, or connect directly with our hiring team.
                        </p>
                    </div>

                    {/* 3 Action Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* 1. Get Started Here */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-md transition-all">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                                        <Rocket className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] font-serif font-crimson leading-tight">
                                        Get Started Here
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                                    Browse open engineering roles, explore tech stack prerequisites, and submit your resume directly to our hiring team.
                                </p>
                            </div>
                            <div className="mt-4 pt-3.5 border-t border-gray-100">
                                <Link
                                    href="/careers/apply"
                                    className="inline-flex items-center text-xs font-bold text-[#0F766E] hover:text-[#0D625C] group gap-1.5 transition-colors"
                                >
                                    <span>Submit Your Application</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* 2. How We Hire */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-md transition-all">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] font-serif font-crimson leading-tight">
                                        How We Hire
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                                    A transparent 4-stage evaluation: Application Review &rarr; Architecture Dialogue &rarr; Practical Coding &rarr; Culture Alignment &amp; Offer.
                                </p>
                            </div>
                            <div className="mt-4 pt-3.5 border-t border-gray-100">
                                <button
                                    onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex items-center text-xs font-bold text-[#0F766E] hover:text-[#0D625C] group gap-1.5 transition-colors cursor-pointer"
                                >
                                    <span>Review Role Requirements</span>
                                    <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* 3. Direct Applicant Support */}
                        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-md transition-all">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] font-serif font-crimson leading-tight">
                                        Applicant Support
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                                    Have questions about job specifications, interview schedules, or onsite opportunities in Tirunelveli? Our talent desk is here to help.
                                </p>
                            </div>
                            <div className="mt-4 pt-3.5 border-t border-gray-100">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center text-xs font-bold text-[#0F766E] hover:text-[#0D625C] group gap-1.5 transition-colors"
                                >
                                    <span>Contact Talent Desk</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                    </div>

                </Container>
            </section>
        </div>
    );
}
