'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    CheckCircle2, 
    Upload, 
    Send, 
    AlertCircle, 
    ChevronDown, 
    Check 
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/utils/cn';

const EXPERIENCE_OPTIONS = [
    'Fresher / Student (0-1 Year)',
    '1 - 3 Years',
    '3 - 5 Years',
    '5+ Years (Lead / Principal)'
];

function ApplyFormContent() {
    const searchParams = useSearchParams();

    const initialJobId = searchParams.get('jobId') || '';
    const initialRole = searchParams.get('role') || '';
    const initialDept = searchParams.get('dept') || '';

    const [activeRoles, setActiveRoles] = useState<any[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);

    const [selectedJobId, setSelectedJobId] = useState(initialJobId);
    const [roleTitle, setRoleTitle] = useState(initialRole);
    const [department, setDepartment] = useState(initialDept || 'Digital Solutions');

    const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
    const roleSelectContainerRef = useRef<HTMLDivElement>(null);

    const [experienceLevel, setExperienceLevel] = useState('1 - 3 Years');
    const [isExpSelectOpen, setIsExpSelectOpen] = useState(false);
    const expSelectContainerRef = useRef<HTMLDivElement>(null);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [currentOrg, setCurrentOrg] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [coverLetter, setCoverLetter] = useState('');

    const [resumeMode, setResumeMode] = useState<'upload' | 'link'>('upload');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Fetch active roles from DB
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await fetch('/api/careers');
                const data = await res.json();
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    setActiveRoles(data.data);
                    
                    // Match with query param if present
                    const matched = data.data.find(
                        (r: any) => r.id === initialJobId || (initialRole && r.title.toLowerCase() === initialRole.toLowerCase())
                    );
                    if (matched) {
                        setSelectedJobId(matched.id);
                        setRoleTitle(matched.title);
                        setDepartment(matched.department);
                    } else {
                        setSelectedJobId(data.data[0].id);
                        setRoleTitle(data.data[0].title);
                        setDepartment(data.data[0].department);
                    }
                }
            } catch {
                // Fallback retained
            } finally {
                setIsLoadingRoles(false);
            }
        };
        fetchRoles();
    }, [initialJobId, initialRole]);

    // Click outside handler for role dropdown
    useEffect(() => {
        if (!isRoleSelectOpen) return;
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (roleSelectContainerRef.current && !roleSelectContainerRef.current.contains(e.target as Node)) {
                setIsRoleSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isRoleSelectOpen]);

    // Click outside handler for experience level dropdown
    useEffect(() => {
        if (!isExpSelectOpen) return;
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (expSelectContainerRef.current && !expSelectContainerRef.current.contains(e.target as Node)) {
                setIsExpSelectOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isExpSelectOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrorMsg('Resume file size exceeds the 5MB limit. Please upload a smaller file.');
                setResumeFile(null);
                e.target.value = '';
                return;
            }
            setErrorMsg('');
            setResumeFile(file);
        } else {
            setResumeFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (resumeMode === 'upload' && resumeFile && resumeFile.size > 5 * 1024 * 1024) {
            setErrorMsg('Resume file size exceeds the 5MB limit. Please upload a smaller file.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('careerId', selectedJobId);
            formData.append('roleTitle', roleTitle);
            formData.append('department', department);
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('experienceLevel', experienceLevel);
            formData.append('currentOrg', currentOrg);
            formData.append('portfolioUrl', portfolioUrl);
            formData.append('linkedinUrl', linkedinUrl);
            formData.append('coverLetter', coverLetter);

            if (resumeMode === 'upload' && resumeFile) {
                formData.append('resumeFile', resumeFile);
            } else if (resumeMode === 'link' && resumeUrl) {
                formData.append('resumeUrl', resumeUrl);
            }

            const res = await fetch('/api/careers/apply', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                setIsSuccess(true);
            } else {
                setErrorMsg(data.error || 'Failed to submit application. Please check all fields.');
            }
        } catch {
            setErrorMsg('Network error while submitting. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="py-16 sm:py-24 text-center max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#2DD4BF]/20 text-[#0F766E] border-2 border-[#0F766E]/30 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-[#0F172A] font-serif font-crimson">
                        Application Received!
                    </h2>
                    <p className="text-base text-gray-700 leading-relaxed max-w-md mx-auto">
                        Thank you for applying, <span className="font-bold text-[#0F172A]">{fullName}</span>! Our team has received your application for <span className="font-bold text-[#0F766E]">{roleTitle}</span>. We will review your profile and contact you soon.
                    </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-4">
                    <Link
                        href="/careers"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F766E] hover:bg-[#0D625C] shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Explore Other Openings
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 shadow-xs transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 sm:py-14 max-w-3xl mx-auto">
            {/* Top Navigation Back & Main Page Heading */}
            <div className="mb-6 space-y-3">
                <Link
                    href="/careers"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0F766E] hover:underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to All Openings
                </Link>

                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] font-serif font-crimson tracking-tight">
                        Official Job Application
                    </h1>
                    <p className="text-xs sm:text-sm text-[#475569]">
                        Submit your profile directly to the SS40 NETWORK engineering desk in Tirunelveli.
                    </p>
                </div>
            </div>

            {/* Application Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden relative">
                {/* Form Header with Dynamic DB Role Dropdown (Contact-style UI) */}
                <div className="p-6 sm:p-8 bg-[#FAFDFB] border-b border-gray-100">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E] block">
                            Applying for Position <span className="text-[#0F766E]">*</span>
                        </label>
                        
                        {/* Custom Dropdown for Roles from DB (Contact-style UI) */}
                        <div className="relative" ref={roleSelectContainerRef}>
                            <button
                                type="button"
                                disabled={isLoadingRoles}
                                onClick={() => setIsRoleSelectOpen(prev => !prev)}
                                className={cn(
                                    "w-full bg-white border rounded-xl px-4 py-3 flex items-center justify-between text-left transition-all text-sm sm:text-base cursor-pointer shadow-2xs outline-none",
                                    isRoleSelectOpen
                                        ? "border-[#0F766E] ring-2 ring-[#0F766E]/20 bg-white"
                                        : "border-gray-200 hover:border-[#0F766E]/50",
                                    roleTitle ? "text-[#0F172A] font-bold" : "text-gray-400 font-normal"
                                )}
                            >
                                <span className="truncate pr-2 font-serif font-crimson text-xl sm:text-2xl">
                                    {roleTitle || (isLoadingRoles ? 'Loading open roles from database...' : 'Select an open role')}
                                </span>
                                <ChevronDown className={cn(
                                    "w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0",
                                    isRoleSelectOpen && "rotate-180 text-[#0F766E]"
                                )} />
                            </button>

                            <AnimatePresence>
                                {isRoleSelectOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4, scale: 0.99 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -4, scale: 0.99 }}
                                        transition={{ duration: 0.15, ease: "easeOut" }}
                                        data-lenis-prevent="true"
                                        data-lenis-prevent-wheel="true"
                                        data-lenis-prevent-touch="true"
                                        onWheel={(e) => e.stopPropagation()}
                                        onTouchMove={(e) => e.stopPropagation()}
                                        className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/10 p-1.5 flex flex-col gap-0.5 max-h-56 overflow-y-auto overscroll-contain"
                                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#0F766E #EDF5F2' }}
                                    >
                                        {activeRoles.length === 0 ? (
                                            <div className="p-3 text-xs text-gray-500 text-center">
                                                No active roles found. You may submit an open application.
                                            </div>
                                        ) : (
                                            activeRoles.map((role) => {
                                                const isSelected = selectedJobId === role.id || roleTitle === role.title;
                                                return (
                                                    <button
                                                        key={role.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedJobId(role.id);
                                                            setRoleTitle(role.title);
                                                            setDepartment(role.department);
                                                            setIsRoleSelectOpen(false);
                                                        }}
                                                        className={cn(
                                                            "w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-sans transition-colors flex items-center justify-between cursor-pointer touch-manipulation",
                                                            isSelected
                                                                ? "bg-[#EDF5F2] text-[#0F766E] font-semibold"
                                                                : "text-[#0F172A] hover:bg-[#F8FAF9] hover:text-[#0F766E] font-normal"
                                                        )}
                                                    >
                                                        <div className="flex flex-col min-w-0 pr-2">
                                                            <span className="font-bold text-sm text-[#0F172A]">{role.title}</span>
                                                            <span className="text-[11px] text-[#64748B]">{role.department} &bull; {role.employmentType}</span>
                                                        </div>
                                                        {isSelected && (
                                                            <Check className="w-4 h-4 text-[#0F766E] shrink-0 stroke-[2.5]" />
                                                        )}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Candidate Form */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    {/* Section: Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                            1. Personal & Contact Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Phone Number / WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Enter your phone number / WhatsApp"
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Experience Level
                                </label>
                                <div className="relative" ref={expSelectContainerRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsExpSelectOpen(prev => !prev)}
                                        className={cn(
                                            "w-full bg-[#FAFCFB] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left transition-all text-sm cursor-pointer shadow-2xs outline-none",
                                            isExpSelectOpen
                                                ? "border-[#0F766E] ring-2 ring-[#0F766E]/20 bg-white"
                                                : "border-gray-200 hover:border-[#0F766E]/50",
                                            experienceLevel ? "text-[#0F172A] font-medium" : "text-gray-400 font-normal"
                                        )}
                                    >
                                        <span className="truncate pr-2">
                                            {experienceLevel || 'Select Experience Level'}
                                        </span>
                                        <ChevronDown className={cn(
                                            "w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0",
                                            isExpSelectOpen && "rotate-180 text-[#0F766E]"
                                        )} />
                                    </button>

                                    <AnimatePresence>
                                        {isExpSelectOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4, scale: 0.99 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -4, scale: 0.99 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                data-lenis-prevent="true"
                                                data-lenis-prevent-wheel="true"
                                                data-lenis-prevent-touch="true"
                                                onWheel={(e) => e.stopPropagation()}
                                                onTouchMove={(e) => e.stopPropagation()}
                                                className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/10 p-1.5 flex flex-col gap-0.5 max-h-48 overflow-y-auto overscroll-contain"
                                                style={{ scrollbarWidth: 'thin', scrollbarColor: '#0F766E #EDF5F2' }}
                                            >
                                                {EXPERIENCE_OPTIONS.map((opt) => {
                                                    const isSelected = experienceLevel === opt;
                                                    return (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() => {
                                                                setExperienceLevel(opt);
                                                                setIsExpSelectOpen(false);
                                                            }}
                                                            className={cn(
                                                                "w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm font-sans transition-colors flex items-center justify-between cursor-pointer touch-manipulation",
                                                                isSelected
                                                                    ? "bg-[#EDF5F2] text-[#0F766E] font-semibold"
                                                                    : "text-[#0F172A] hover:bg-[#F8FAF9] hover:text-[#0F766E] font-normal"
                                                            )}
                                                        >
                                                            <span className="truncate pr-2">{opt}</span>
                                                            {isSelected && (
                                                                <Check className="w-4 h-4 text-[#0F766E] shrink-0 stroke-[2.5]" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Current Organization or College / University
                            </label>
                            <input
                                type="text"
                                value={currentOrg}
                                onChange={(e) => setCurrentOrg(e.target.value)}
                                placeholder="Enter your current organization or college name"
                                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                            />
                        </div>
                    </div>

                    {/* Section: Online Profiles & Work Samples */}
                    <div className="space-y-4 pt-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                            2. Professional Profiles & Work Links
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    LinkedIn Profile URL
                                </label>
                                <input
                                    type="url"
                                    value={linkedinUrl}
                                    onChange={(e) => setLinkedinUrl(e.target.value)}
                                    placeholder="Enter your LinkedIn profile URL"
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    GitHub / Portfolio / Project Link
                                </label>
                                <input
                                    type="url"
                                    value={portfolioUrl}
                                    onChange={(e) => setPortfolioUrl(e.target.value)}
                                    placeholder="Enter your portfolio or GitHub link"
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Resume Submission */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                3. Resume / Curriculum Vitae *
                            </h3>
                            <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs">
                                <button
                                    type="button"
                                    onClick={() => setResumeMode('upload')}
                                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                                        resumeMode === 'upload' ? 'bg-white text-[#0F766E] shadow-2xs' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    File Upload
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setResumeMode('link')}
                                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                                        resumeMode === 'link' ? 'bg-white text-[#0F766E] shadow-2xs' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Google Drive / PDF Link
                                </button>
                            </div>
                        </div>

                        {resumeMode === 'upload' ? (
                            <div className="border-2 border-dashed border-gray-200 hover:border-[#0F766E]/40 rounded-2xl p-6 text-center transition-all bg-[#FAFDFB]">
                                <input
                                    type="file"
                                    id="resumeFile"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="resumeFile" className="cursor-pointer block space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center mx-auto">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="text-xs font-bold text-gray-700">
                                        {resumeFile ? resumeFile.name : 'Click to select your Resume (PDF or DOCX)'}
                                    </div>
                                    <p className="text-[11px] text-gray-400">
                                        Max file size: 5MB
                                    </p>
                                </label>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                    Google Drive / Cloud Link to Resume (Ensure view access is public)
                                </label>
                                <input
                                    type="url"
                                    value={resumeUrl}
                                    onChange={(e) => setResumeUrl(e.target.value)}
                                    placeholder="Enter public Google Drive or document link"
                                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                                />
                            </div>
                        )}
                    </div>

                    {/* Section: Cover Note */}
                    <div className="space-y-4 pt-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                            4. Introduction / Cover Note
                        </h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                Tell us briefly why you would like to join SS40 NETWORK (Optional)
                            </label>
                            <textarea
                                rows={4}
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Enter a brief introduction and why you are interested in joining SS40 NETWORK..."
                                className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[11px] text-gray-400 text-center sm:text-left">
                            By submitting, you agree to allow SS40 NETWORK to review your professional credentials.
                        </p>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#0F766E] hover:bg-[#0D625C] shadow-sm disabled:opacity-50 transition-all cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                            <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CareerApplyPage() {
    return (
        <div className="w-full min-h-screen bg-[#D8E8E2] border-t border-[#0F766E]/15 pt-24 pb-20 relative">
            <Container className="relative z-10">
                <Suspense fallback={
                    <div className="py-24 text-center">
                        <div className="w-8 h-8 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-gray-700 font-medium">Loading application portal...</p>
                    </div>
                }>
                    <ApplyFormContent />
                </Suspense>
            </Container>
        </div>
    );
}
