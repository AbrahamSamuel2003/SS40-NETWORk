'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon, Star, Video } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';
import { SectionVisibilityToggle } from '@/components/admin/SectionVisibilityToggle';

export default function StudentImpactsPage() {
    const [impacts, setImpacts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [studentName, setStudentName] = useState('');
    const [designation, setDesignation] = useState('');
    const [quote, setQuote] = useState('');
    const [academicRoute, setAcademicRoute] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [sortOrder, setSortOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);

    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

    useEffect(() => {
        fetchImpacts();
    }, []);

    const fetchImpacts = async () => {
        try {
            const res = await fetch('/api/admin/student-impacts?isActive=all');
            const data = await res.json();
            if (data.success) {
                setImpacts(data.data);
            } else {
                setErrorMsg(data.error);
            }
        } catch {
            setErrorMsg('Failed to load student impacts.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (imp?: any) => {
        if (imp) {
            setEditingId(imp.id);
            setStudentName(imp.studentName);
            setDesignation(imp.designation);
            setQuote(imp.quote);
            setAcademicRoute(imp.academicRoute);
            setVideoUrl(imp.videoUrl || '');
            setYoutubeUrl(imp.youtubeUrl || '');
            setIsFeatured(imp.isFeatured);
            setSortOrder(imp.sortOrder);
            setIsActive(imp.isActive);
        } else {
            setEditingId(null);
            setStudentName('');
            setDesignation('');
            setQuote('');
            setAcademicRoute('');
            setVideoUrl('');
            setYoutubeUrl('');
            setIsFeatured(false);
            setSortOrder(0);
            setIsActive(true);
        }

        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const rawFile = e.target.files[0];

        setIsUploadingMedia(true);
        try {
            const file = await compressImageFile(rawFile);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pageScope', 'STUDENT_IMPACTS');

            const res = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setVideoUrl(data.data.url);
            } else {
                setErrorMsg(data.error || 'Upload failed');
            }
        } catch {
            setErrorMsg('Upload error');
        } finally {
            setIsUploadingMedia(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');

        const payload = {
            studentName,
            designation,
            quote,
            academicRoute,
            videoUrl: videoUrl.trim() ? videoUrl : null,
            youtubeUrl: youtubeUrl.trim() ? youtubeUrl : null,
            isFeatured,
            sortOrder: Number(sortOrder),
            isActive
        };

        try {
            const url = editingId
                ? `/api/admin/student-impacts/${editingId}`
                : '/api/admin/student-impacts';

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchImpacts();
            } else {
                setErrorMsg(data.error);
            }
        } catch {
            setErrorMsg('Failed to save.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;
        try {
            const res = await fetch(`/api/admin/student-impacts/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchImpacts();
            } else {
                alert(data.error);
            }
        } catch {
            alert('Failed to delete');
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
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Student Impacts</h1>
                    <p className="text-sm text-[#475569] mt-0.5">Manage student success stories, testimonials, and video interviews.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <SectionVisibilityToggle
                        sectionKey="academics_studentImpacts"
                        sectionLabel="Student Impacts"
                    />
                    <button
                        onClick={() => handleOpenModal()}
                        className="admin-button-primary"
                    >
                        <Plus className="w-4 h-4" /> Add Impact
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                {/* Mobile Cards: 2-Column Grid */}
                <div className="sm:hidden p-2.5">
                    {impacts.length === 0 ? (
                        <div className="p-8 text-center text-sm text-[#64748B]">No student impacts found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {impacts.map(imp => (
                                <div key={imp.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            {imp.photoUrl ? (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-[#E2E8F0] overflow-hidden shrink-0">
                                                    <img src={imp.photoUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {imp.studentName.charAt(0)}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-xs text-[#0F172A] leading-tight truncate" title={imp.studentName}>
                                                    {imp.studentName}
                                                </h3>
                                                <p className="text-[10px] text-[#64748B] truncate">{imp.designation || imp.academicRoute}</p>
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-[#334151] italic line-clamp-3 leading-relaxed bg-[#F8FAFC] p-1.5 rounded border border-gray-100">
                                            &ldquo;{imp.quote}&rdquo;
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${imp.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                {imp.isActive ? 'Active' : 'Draft'}
                                            </span>
                                            {imp.isFeatured && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded">
                                                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Feat
                                                </span>
                                            )}
                                            {imp.youtubeUrl && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1 py-0.2 rounded">
                                                    <Video className="w-2.5 h-2.5 text-rose-600" /> Video
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => handleOpenModal(imp)}
                                            className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center flex-1"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(imp.id)}
                                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors flex items-center justify-center flex-1"
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

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Route &amp; Role</th>
                                <th>Quote Summary</th>
                                <th className="text-center">Order</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {impacts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-[#64748B]">No student impacts found.</td>
                                </tr>
                            ) : (
                                impacts.map(imp => (
                                    <tr key={imp.id}>
                                        <td>
                                            <div className="font-semibold text-sm text-[#0F172A]">{imp.studentName}</div>
                                            {imp.youtubeUrl && (
                                                <span className="text-[10px] text-rose-600 font-medium inline-flex items-center gap-1 mt-0.5">
                                                    <Video className="w-3 h-3" /> Video Attached
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold text-[#0F172A]">{imp.academicRoute}</div>
                                            <div className="text-xs text-[#64748B]">{imp.designation}</div>
                                        </td>
                                        <td className="max-w-xs">
                                            <p className="text-xs text-[#334151] line-clamp-1 italic">&ldquo;{imp.quote}&rdquo;</p>
                                        </td>
                                        <td className="text-center text-xs text-[#64748B] font-mono">{imp.sortOrder}</td>
                                        <td className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${imp.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                    <CheckCircle2 className="w-3 h-3" /> {imp.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                {imp.isFeatured && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenModal(imp)}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-[#334151] hover:text-[#0F766E] hover:bg-[#EDF5F2] rounded-md transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(imp.id)}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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

            {/* Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-panel max-w-2xl">
                        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAF9]">
                            <div>
                                <h3 className="text-base font-bold text-[#0F172A]">{editingId ? 'Edit Student Impact' : 'Add Student Impact'}</h3>
                                <p className="text-xs text-[#64748B]">Academics student success testimonial &amp; media</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-130px)] custom-scrollbar">
                            {errorMsg && (
                                <div className="mb-4 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="impForm" onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Student Name *</label>
                                        <input required type="text" value={studentName} onChange={e => setStudentName(e.target.value)} className="admin-input" placeholder="e.g. Rahul Sharma" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Designation / Placed At *</label>
                                        <input required type="text" value={designation} placeholder="e.g. SDE at Zoho" onChange={e => setDesignation(e.target.value)} className="admin-input" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Academic Route *</label>
                                        <input required type="text" value={academicRoute} placeholder="e.g. Full Stack Engineering Batch '24" onChange={e => setAcademicRoute(e.target.value)} className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Sort Order</label>
                                        <input type="number" required value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="admin-input" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Quote / Testimonial *</label>
                                    <textarea required value={quote} onChange={e => setQuote(e.target.value)} rows={3} className="admin-input resize-none" placeholder="Student testimonial quote..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Local Video / Reel URL</label>
                                    <div className="flex flex-col gap-2.5">
                                        <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Video file URL or select from Media library..." className="admin-input text-xs" />
                                        
                                        {videoUrl && (
                                            <div className="relative w-full max-w-sm aspect-video bg-slate-900 rounded-lg overflow-hidden border border-[#E2E8F0]">
                                                <video src={videoUrl} className="w-full h-full object-contain" />
                                                <button type="button" onClick={() => setVideoUrl('')} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-slate-500 hover:text-rose-600 shadow-sm">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <label className={`cursor-pointer admin-button-secondary justify-center text-xs ${isUploadingMedia ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <Upload className="w-4 h-4 text-[#0F766E]" /> {isUploadingMedia ? 'Uploading...' : 'Upload Video File'}
                                                <input type="file" accept="video/mp4,video/webm" onChange={handleUploadMedia} className="hidden" disabled={isUploadingMedia} />
                                            </label>
                                            <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className="admin-button-secondary justify-center text-xs">
                                                <ImageIcon className="w-4 h-4 text-[#0F766E]" /> Select from Media
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">YouTube Video URL</label>
                                    <input type="text" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="admin-input" />
                                </div>

                                <div className="pt-3 flex flex-wrap gap-5 border-t border-[#E2E8F0]">
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isActive ? 'bg-[#0F766E]' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Active</span>
                                    </label>

                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isFeatured ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Featured (Large Hero Card w/ Video)</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAF9] flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-secondary justify-center">Cancel</button>
                            <button form="impForm" type="submit" disabled={isSaving} className="admin-button-primary justify-center disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Impact'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isMediaSelectorOpen && (
                <MediaSelectorModal
                    onClose={() => setIsMediaSelectorOpen(false)}
                    onSelect={(url) => {
                        setVideoUrl(url);
                        setIsMediaSelectorOpen(false);
                    }}
                />
            )}
        </div>
    );
}
