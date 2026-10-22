'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    CheckCircle2, 
    AlertCircle, 
    X, 
    Star, 
    Briefcase,
    MapPin,
    Calendar,
    ExternalLink,
    ChevronDown,
    Check
} from 'lucide-react';
import { cn } from '@/utils/cn';

const DEPARTMENTS = [
    'Digital Solutions',
    'Products',
    'Academics',
    'Operations',
    'Design & Marketing',
    'Other (Custom)'
];

const EMPLOYMENT_TYPES = [
    'Full-Time',
    'Part-Time',
    'Internship',
    'Contract',
    'Other (Custom)'
];

const EXPERIENCE_LEVELS = [
    'Fresher / 0-1 Yr',
    '1-3 Years',
    '3-5 Years',
    '5+ Years (Lead)',
    'Other (Custom)'
];

export default function AdminCareersPage() {
    const [careers, setCareers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    
    // Department custom dropdown
    const [department, setDepartment] = useState('Digital Solutions');
    const [customDepartment, setCustomDepartment] = useState('');
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const deptRef = useRef<HTMLDivElement>(null);

    // Employment Type custom dropdown
    const [employmentType, setEmploymentType] = useState('Full-Time');
    const [customEmploymentType, setCustomEmploymentType] = useState('');
    const [isEmpOpen, setIsEmpOpen] = useState(false);
    const empRef = useRef<HTMLDivElement>(null);

    // Experience Level custom dropdown
    const [experienceLevel, setExperienceLevel] = useState('1-3 Years');
    const [customExperienceLevel, setCustomExperienceLevel] = useState('');
    const [isExpOpen, setIsExpOpen] = useState(false);
    const expRef = useRef<HTMLDivElement>(null);

    const [location, setLocation] = useState('Tirunelveli, Tamil Nadu (Onsite / Hybrid)');
    const [badgeText, setBadgeText] = useState('');
    const [description, setDescription] = useState('');
    const [responsibilitiesText, setResponsibilitiesText] = useState('');
    const [requirementsText, setRequirementsText] = useState('');
    const [applyEmail, setApplyEmail] = useState('careers@ss40network.com');
    const [applyLink, setApplyLink] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Click outside handler for all 3 admin custom dropdowns
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (deptRef.current && !deptRef.current.contains(e.target as Node)) {
                setIsDeptOpen(false);
            }
            if (empRef.current && !empRef.current.contains(e.target as Node)) {
                setIsEmpOpen(false);
            }
            if (expRef.current && !expRef.current.contains(e.target as Node)) {
                setIsExpOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchCareers();
    }, []);

    const fetchCareers = async () => {
        try {
            const res = await fetch('/api/admin/careers');
            const data = await res.json();
            if (data.success) {
                setCareers(data.data);
            } else {
                setErrorMsg(data.error);
            }
        } catch {
            setErrorMsg('Failed to load career listings.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (job?: any) => {
        if (job) {
            setEditingId(job.id);
            setTitle(job.title || '');

            const standardDepts = DEPARTMENTS.filter(d => d !== 'Other (Custom)');
            if (job.department && standardDepts.includes(job.department)) {
                setDepartment(job.department);
                setCustomDepartment('');
            } else {
                setDepartment('Other (Custom)');
                setCustomDepartment(job.department || '');
            }

            const standardEmps = EMPLOYMENT_TYPES.filter(t => t !== 'Other (Custom)');
            if (job.employmentType && standardEmps.includes(job.employmentType)) {
                setEmploymentType(job.employmentType);
                setCustomEmploymentType('');
            } else {
                setEmploymentType('Other (Custom)');
                setCustomEmploymentType(job.employmentType || '');
            }

            const standardExps = EXPERIENCE_LEVELS.filter(e => e !== 'Other (Custom)');
            if (job.experienceLevel && standardExps.includes(job.experienceLevel)) {
                setExperienceLevel(job.experienceLevel);
                setCustomExperienceLevel('');
            } else {
                setExperienceLevel('Other (Custom)');
                setCustomExperienceLevel(job.experienceLevel || '');
            }

            setLocation(job.location || 'Tirunelveli, Tamil Nadu (Onsite / Hybrid)');
            setBadgeText(job.badgeText || '');
            setDescription(job.description || '');
            
            const resp = Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '';
            setResponsibilitiesText(resp);

            const req = Array.isArray(job.requirements) ? job.requirements.join('\n') : '';
            setRequirementsText(req);

            setApplyEmail(job.applyEmail || 'careers@ss40network.com');
            setApplyLink(job.applyLink || '');
            setSortOrder(typeof job.sortOrder === 'number' ? job.sortOrder : 0);
            setIsFeatured(Boolean(job.isFeatured));
            setIsActive(job.isActive !== false);
        } else {
            setEditingId(null);
            setTitle('');
            setDepartment('Digital Solutions');
            setCustomDepartment('');
            setEmploymentType('Full-Time');
            setCustomEmploymentType('');
            setLocation('Tirunelveli, Tamil Nadu (Onsite / Hybrid)');
            setExperienceLevel('1-3 Years');
            setCustomExperienceLevel('');
            setBadgeText('');
            setDescription('');
            setResponsibilitiesText('');
            setRequirementsText('');
            setApplyEmail('careers@ss40network.com');
            setApplyLink('');
            setSortOrder(0);
            setIsFeatured(false);
            setIsActive(true);
        }

        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');

        try {
            const responsibilities = responsibilitiesText
                .split('\n')
                .map(s => s.trim())
                .filter(Boolean);

            const requirements = requirementsText
                .split('\n')
                .map(s => s.trim())
                .filter(Boolean);

            const finalDepartment = department === 'Other (Custom)'
                ? (customDepartment.trim() || 'Other')
                : department;

            const finalEmploymentType = employmentType === 'Other (Custom)'
                ? (customEmploymentType.trim() || 'Other')
                : employmentType;

            const finalExperienceLevel = experienceLevel === 'Other (Custom)'
                ? (customExperienceLevel.trim() || 'Other')
                : experienceLevel;

            const payload = {
                title,
                department: finalDepartment,
                employmentType: finalEmploymentType,
                location,
                experienceLevel: finalExperienceLevel,
                badgeText: badgeText.trim() || null,
                description,
                responsibilities,
                requirements,
                applyEmail: applyEmail.trim() || 'careers@ss40network.com',
                applyLink: applyLink.trim() || null,
                sortOrder: Number(sortOrder) || 0,
                isFeatured,
                isActive,
            };

            const url = editingId ? `/api/admin/careers/${editingId}` : '/api/admin/careers';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchCareers();
            } else {
                setErrorMsg(data.error || 'Failed to save role.');
            }
        } catch {
            setErrorMsg('Network error while saving.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string, roleTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${roleTitle}"? This cannot be undone.`)) return;

        try {
            const res = await fetch(`/api/admin/careers/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchCareers();
            } else {
                alert(data.error || 'Failed to delete');
            }
        } catch {
            alert('Failed to delete role');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-16">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0F766E]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header (Matching student-projects) */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Careers &amp; Vacancies</h1>
                    <p className="text-sm text-[#475569] mt-0.5">Manage job openings, roles, responsibilities, and requirements displayed on the Careers page.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={() => handleOpenModal()}
                        className="admin-button-primary"
                    >
                        <Plus className="w-4 h-4" /> Add Vacancy
                    </button>
                </div>
            </div>

            {/* Error Notification */}
            {errorMsg && (
                <div className="text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                    <button onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Main Data Container (Matching student-projects admin-card) */}
            <div className="admin-card overflow-hidden">
                {/* Mobile Cards (2-Column Grid matching student-projects) */}
                <div className="sm:hidden p-2.5">
                    {careers.length === 0 ? (
                        <div className="p-8 text-center text-sm text-[#64748B]">No career vacancies found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {careers.map(job => (
                                <div key={job.id} className="p-2.5 sm:p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="text-[9px] bg-[#EDF5F2] text-[#0F766E] px-1.5 py-0.5 rounded font-bold truncate">
                                                {job.department}
                                            </span>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {job.isFeatured && (
                                                    <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                                    </span>
                                                )}
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${job.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                    {job.isActive ? 'Active' : 'Draft'}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-xs text-[#0F172A] leading-tight truncate" title={job.title}>
                                            {job.title}
                                        </h3>

                                        <p className="text-[10px] text-[#64748B] truncate">
                                            {job.employmentType} &bull; {job.experienceLevel}
                                        </p>

                                        <p className="text-[10px] text-[#334151] line-clamp-2 leading-relaxed">
                                            {job.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => handleOpenModal(job)}
                                            className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job.id, job.title)}
                                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors flex items-center justify-center cursor-pointer"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop Table (Matching student-projects admin-table) */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="admin-table">
                        <thead className="admin-table-head">
                            <tr>
                                <th>Role Title &amp; Overview</th>
                                <th>Department &amp; Type</th>
                                <th>Experience &amp; Location</th>
                                <th className="text-center">Order</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="admin-table-body">
                            {careers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-[#64748B]">No career vacancies found.</td>
                                </tr>
                            ) : (
                                careers.map(job => (
                                    <tr key={job.id} className="admin-table-row">
                                        {/* Title & Overview */}
                                        <td>
                                            <div className="font-semibold text-sm text-[#0F172A]">{job.title}</div>
                                            <div className="text-xs text-[#64748B] line-clamp-1 max-w-sm mt-0.5">{job.description}</div>
                                            {job.applyLink && (
                                                <a 
                                                    href={job.applyLink} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="text-[11px] text-[#0F766E] hover:underline inline-flex items-center gap-1 mt-1"
                                                >
                                                    <ExternalLink className="w-3 h-3" /> External Apply Link
                                                </a>
                                            )}
                                        </td>

                                        {/* Department & Type */}
                                        <td>
                                            <div className="text-xs font-semibold text-[#0F172A] mb-1">{job.department}</div>
                                            <div className="flex flex-wrap gap-1">
                                                <span className="text-[10px] bg-[#EDF5F2] text-[#0F766E] px-1.5 py-0.5 rounded font-medium">
                                                    {job.employmentType}
                                                </span>
                                                {job.badgeText && (
                                                    <span className="text-[10px] bg-slate-100 text-[#475569] px-1.5 py-0.5 rounded font-medium">
                                                        {job.badgeText}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Experience & Location */}
                                        <td>
                                            <div className="text-xs font-medium text-[#0F172A]">{job.experienceLevel}</div>
                                            <div className="text-[11px] text-[#64748B] truncate max-w-xs">{job.location}</div>
                                        </td>

                                        {/* Sort Order */}
                                        <td className="text-center text-xs text-[#64748B] font-mono">{job.sortOrder}</td>

                                        {/* Status */}
                                        <td className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${job.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                    <CheckCircle2 className="w-3 h-3" /> {job.isActive ? 'Active' : 'Draft'}
                                                </span>
                                                {job.isFeatured && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenModal(job)}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-[#334151] hover:text-[#0F766E] hover:bg-[#EDF5F2] rounded-md transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(job.id, job.title)}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal (Matching student-projects admin-modal-overlay) */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-panel max-w-2xl">
                        {/* Modal Header */}
                        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAF9]">
                            <div>
                                <h3 className="text-base font-bold text-[#0F172A]">
                                    {editingId ? 'Edit Career Vacancy' : 'Add Career Vacancy'}
                                </h3>
                                <p className="text-xs text-[#64748B]">Configure job roles, responsibilities, and qualifications</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-130px)] custom-scrollbar">
                            {errorMsg && (
                                <div className="mb-4 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="careerForm" onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                            Job Title *
                                        </label>
                                        <input 
                                            required 
                                            type="text" 
                                            value={title} 
                                            onChange={e => setTitle(e.target.value)} 
                                            className="admin-input" 
                                            placeholder="e.g. Senior Full-Stack Engineer" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                            Department *
                                        </label>
                                        <div className="relative" ref={deptRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsDeptOpen(prev => !prev)}
                                                className={cn(
                                                    "w-full bg-[#FAFCFB] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left transition-all text-xs sm:text-sm cursor-pointer outline-none shadow-2xs",
                                                    isDeptOpen ? "border-[#0F766E] ring-2 ring-[#0F766E]/20 bg-white" : "border-gray-200 hover:border-[#0F766E]/50",
                                                    department ? "text-[#0F172A] font-medium" : "text-gray-400"
                                                )}
                                            >
                                                <span className="truncate pr-2">{department}</span>
                                                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0", isDeptOpen && "rotate-180 text-[#0F766E]")} />
                                            </button>

                                            <AnimatePresence>
                                                {isDeptOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -4, scale: 0.99 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -4, scale: 0.99 }}
                                                        transition={{ duration: 0.15 }}
                                                        data-lenis-prevent="true"
                                                        data-lenis-prevent-wheel="true"
                                                        data-lenis-prevent-touch="true"
                                                        onWheel={(e) => e.stopPropagation()}
                                                        onTouchMove={(e) => e.stopPropagation()}
                                                        className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-1.5 flex flex-col gap-0.5 max-h-48 overflow-y-auto overscroll-contain"
                                                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#0F766E #EDF5F2' }}
                                                    >
                                                        {DEPARTMENTS.map(d => {
                                                            const isSelected = department === d;
                                                            return (
                                                                <button
                                                                    key={d}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setDepartment(d);
                                                                        setIsDeptOpen(false);
                                                                    }}
                                                                    className={cn(
                                                                        "w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-sans transition-colors flex items-center justify-between cursor-pointer",
                                                                        isSelected ? "bg-[#EDF5F2] text-[#0F766E] font-semibold" : "text-[#0F172A] hover:bg-[#F8FAF9] hover:text-[#0F766E]"
                                                                    )}
                                                                >
                                                                    <span className="truncate pr-2">{d}</span>
                                                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0F766E] shrink-0 stroke-[2.5]" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Custom Department Input */}
                                        <AnimatePresence>
                                            {department === 'Other (Custom)' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <input
                                                        type="text"
                                                        required
                                                        value={customDepartment}
                                                        onChange={e => setCustomDepartment(e.target.value)}
                                                        placeholder="Enter custom department name..."
                                                        className="admin-input text-xs"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                            Employment Type *
                                        </label>
                                        <div className="relative" ref={empRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsEmpOpen(prev => !prev)}
                                                className={cn(
                                                    "w-full bg-[#FAFCFB] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left transition-all text-xs sm:text-sm cursor-pointer outline-none shadow-2xs",
                                                    isEmpOpen ? "border-[#0F766E] ring-2 ring-[#0F766E]/20 bg-white" : "border-gray-200 hover:border-[#0F766E]/50",
                                                    employmentType ? "text-[#0F172A] font-medium" : "text-gray-400"
                                                )}
                                            >
                                                <span className="truncate pr-2">{employmentType}</span>
                                                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0", isEmpOpen && "rotate-180 text-[#0F766E]")} />
                                            </button>

                                            <AnimatePresence>
                                                {isEmpOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -4, scale: 0.99 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -4, scale: 0.99 }}
                                                        transition={{ duration: 0.15 }}
                                                        data-lenis-prevent="true"
                                                        data-lenis-prevent-wheel="true"
                                                        data-lenis-prevent-touch="true"
                                                        onWheel={(e) => e.stopPropagation()}
                                                        onTouchMove={(e) => e.stopPropagation()}
                                                        className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-1.5 flex flex-col gap-0.5 max-h-48 overflow-y-auto overscroll-contain"
                                                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#0F766E #EDF5F2' }}
                                                    >
                                                        {EMPLOYMENT_TYPES.map(t => {
                                                            const isSelected = employmentType === t;
                                                            return (
                                                                <button
                                                                    key={t}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEmploymentType(t);
                                                                        setIsEmpOpen(false);
                                                                    }}
                                                                    className={cn(
                                                                        "w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-sans transition-colors flex items-center justify-between cursor-pointer",
                                                                        isSelected ? "bg-[#EDF5F2] text-[#0F766E] font-semibold" : "text-[#0F172A] hover:bg-[#F8FAF9] hover:text-[#0F766E]"
                                                                    )}
                                                                >
                                                                    <span className="truncate pr-2">{t}</span>
                                                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0F766E] shrink-0 stroke-[2.5]" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Custom Employment Type Input */}
                                        <AnimatePresence>
                                            {employmentType === 'Other (Custom)' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <input
                                                        type="text"
                                                        required
                                                        value={customEmploymentType}
                                                        onChange={e => setCustomEmploymentType(e.target.value)}
                                                        placeholder="Enter custom employment type..."
                                                        className="admin-input text-xs"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                            Experience Level
                                        </label>
                                        <div className="relative" ref={expRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsExpOpen(prev => !prev)}
                                                className={cn(
                                                    "w-full bg-[#FAFCFB] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left transition-all text-xs sm:text-sm cursor-pointer outline-none shadow-2xs",
                                                    isExpOpen ? "border-[#0F766E] ring-2 ring-[#0F766E]/20 bg-white" : "border-gray-200 hover:border-[#0F766E]/50",
                                                    experienceLevel ? "text-[#0F172A] font-medium" : "text-gray-400"
                                                )}
                                            >
                                                <span className="truncate pr-2">{experienceLevel}</span>
                                                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0", isExpOpen && "rotate-180 text-[#0F766E]")} />
                                            </button>

                                            <AnimatePresence>
                                                {isExpOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -4, scale: 0.99 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -4, scale: 0.99 }}
                                                        transition={{ duration: 0.15 }}
                                                        data-lenis-prevent="true"
                                                        data-lenis-prevent-wheel="true"
                                                        data-lenis-prevent-touch="true"
                                                        onWheel={(e) => e.stopPropagation()}
                                                        onTouchMove={(e) => e.stopPropagation()}
                                                        className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-1.5 flex flex-col gap-0.5 max-h-48 overflow-y-auto overscroll-contain"
                                                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#0F766E #EDF5F2' }}
                                                    >
                                                        {EXPERIENCE_LEVELS.map(exp => {
                                                            const isSelected = experienceLevel === exp;
                                                            return (
                                                                <button
                                                                    key={exp}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setExperienceLevel(exp);
                                                                        setIsExpOpen(false);
                                                                    }}
                                                                    className={cn(
                                                                        "w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-sans transition-colors flex items-center justify-between cursor-pointer",
                                                                        isSelected ? "bg-[#EDF5F2] text-[#0F766E] font-semibold" : "text-[#0F172A] hover:bg-[#F8FAF9] hover:text-[#0F766E]"
                                                                    )}
                                                                >
                                                                    <span className="truncate pr-2">{exp}</span>
                                                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#0F766E] shrink-0 stroke-[2.5]" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Custom Experience Level Input */}
                                        <AnimatePresence>
                                            {experienceLevel === 'Other (Custom)' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <input
                                                        type="text"
                                                        required
                                                        value={customExperienceLevel}
                                                        onChange={e => setCustomExperienceLevel(e.target.value)}
                                                        placeholder="Enter custom experience level..."
                                                        className="admin-input text-xs"
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                            Location
                                        </label>
                                        <input 
                                            type="text" 
                                            value={location} 
                                            onChange={e => setLocation(e.target.value)} 
                                            className="admin-input" 
                                            placeholder="Tirunelveli, Tamil Nadu (Onsite / Hybrid)" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                            Badge Text (optional)
                                        </label>
                                        <input 
                                            type="text" 
                                            value={badgeText} 
                                            placeholder="e.g. CURRENT ROLE, URGENT HIRING" 
                                            onChange={e => setBadgeText(e.target.value)} 
                                            className="admin-input" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                        Role Overview &amp; Description *
                                    </label>
                                    <textarea 
                                        required 
                                        value={description} 
                                        onChange={e => setDescription(e.target.value)} 
                                        rows={3} 
                                        className="admin-input resize-none" 
                                        placeholder="Brief summary of the role and what the candidate will work on..." 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                        Core Responsibilities (One per line)
                                    </label>
                                    <textarea 
                                        value={responsibilitiesText} 
                                        onChange={e => setResponsibilitiesText(e.target.value)} 
                                        rows={3} 
                                        className="admin-input resize-none" 
                                        placeholder="Building production web applications and scalable cloud backends&#10;Collaborating with product teams on AI agent workflows" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                        Qualifications &amp; Requirements (One per line)
                                    </label>
                                    <textarea 
                                        value={requirementsText} 
                                        onChange={e => setRequirementsText(e.target.value)} 
                                        rows={3} 
                                        className="admin-input resize-none" 
                                        placeholder="Strong proficiency in TypeScript and Next.js&#10;Hands-on experience with PostgreSQL and relational databases" 
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                            Application Email
                                        </label>
                                        <input 
                                            type="email" 
                                            value={applyEmail} 
                                            onChange={e => setApplyEmail(e.target.value)} 
                                            className="admin-input" 
                                            placeholder="careers@ss40network.com" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                            External Apply URL (optional)
                                        </label>
                                        <input 
                                            type="url" 
                                            value={applyLink} 
                                            onChange={e => setApplyLink(e.target.value)} 
                                            className="admin-input" 
                                            placeholder="https://..." 
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                            Sort Order
                                        </label>
                                        <input 
                                            type="number" 
                                            required 
                                            value={sortOrder} 
                                            onChange={e => setSortOrder(Number(e.target.value))} 
                                            className="admin-input" 
                                        />
                                    </div>
                                    <div className="flex items-center pt-5">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#334151]">
                                            <input 
                                                type="checkbox" 
                                                checked={isActive} 
                                                onChange={e => setIsActive(e.target.checked)} 
                                                className="w-4 h-4 text-[#0F766E] rounded" 
                                            />
                                            Active (Live)
                                        </label>
                                    </div>
                                    <div className="flex items-center pt-5">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#334151]">
                                            <input 
                                                type="checkbox" 
                                                checked={isFeatured} 
                                                onChange={e => setIsFeatured(e.target.checked)} 
                                                className="w-4 h-4 text-[#0F766E] rounded" 
                                            />
                                            Featured
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAF9] flex items-center justify-end gap-2.5">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)} 
                                className="admin-button-secondary text-xs"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                form="careerForm" 
                                disabled={isSaving} 
                                className="admin-button-primary text-xs"
                            >
                                {isSaving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish Vacancy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
