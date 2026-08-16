'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentImpactsPage() {
    const router = useRouter();
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
        } catch (e) {
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        setIsUploadingMedia(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

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
        } catch (err) {
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
        } catch (e) {
            alert('Failed to delete');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12 pt-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Student Impacts</h2>
                    <p className="text-[#6B7280]">Manage student testimonials and videos displayed in Academics.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Impact
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                <table className="w-full text-left text-sm text-[#374151] whitespace-nowrap">
                    <thead className="bg-[#EDF5F2]/70 border-b border-gray-200 text-[#111827]">
                        <tr>
                            <th className="p-4 font-medium">Student Name</th>
                            <th className="p-4 font-medium">Route / Designation</th>
                            <th className="p-4 font-medium">Featured</th>
                            <th className="p-4 font-medium">Order</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {impacts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-[#9CA3AF]">No student impacts found.</td>
                            </tr>
                        ) : (
                            impacts.map(imp => (
                                <tr key={imp.id} className="hover:bg-[#EDF5F2]/50 transition-colors">
                                    <td className="p-4 font-medium">{imp.studentName}</td>
                                    <td className="p-4 text-[#6B7280]">{imp.academicRoute} <span className="opacity-50">· {imp.designation}</span></td>
                                    <td className="p-4">
                                        {imp.isFeatured ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500">
                                                <Star className="w-3 h-3 fill-current" /> YES
                                            </span>
                                        ) : (
                                            <span className="text-[#9CA3AF] text-xs">NO</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-[#6B7280]">{imp.sortOrder}</td>
                                    <td className="p-4">
                                        {imp.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6B9F91]/10 text-[#6B9F91]">
                                                <CheckCircle2 className="w-3 h-3" /> ACTIVE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EDF5F2]/70 text-[#9CA3AF]">
                                                INACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleOpenModal(imp)} className="text-[#9CA3AF] hover:text-[#111827] p-2 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(imp.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-2 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm overflow-hidden">
                    <div className="admin-card w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-[#111827]">{editingId ? 'Edit Student Impact' : 'Add Student Impact'}</h3>
                            <button onClick={handleCloseModal} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                            {errorMsg && (
                                <div className="mb-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] p-3 rounded-lg text-sm flex gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="impForm" onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Student Name *</label>
                                        <input required type="text" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Designation / Role *</label>
                                        <input required type="text" value={designation} placeholder="e.g. Frontend Developer" onChange={e => setDesignation(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Academic Route *</label>
                                        <input required type="text" value={academicRoute} placeholder="e.g. Web Development Track" onChange={e => setAcademicRoute(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Sort Order</label>
                                        <input type="number" required value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Quote / Testimonial *</label>
                                    <textarea required value={quote} onChange={e => setQuote(e.target.value)} rows={3} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Local Video URL (Alternative to YouTube)</label>
                                    <div className="flex gap-4 items-center">
                                        <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] text-sm focus:outline-none focus:border-[#6B9F91]" />
                                        <label className={`cursor-pointer shrink-0 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isUploadingMedia ? 'opacity-50' : ''}`}>
                                            <Upload className="w-4 h-4" /> {isUploadingMedia ? '...' : 'Upload Media'}
                                            <input type="file" accept="video/mp4,video/webm" onChange={handleUploadMedia} className="hidden" disabled={isUploadingMedia} />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">YouTube Video URL (Only ONE allowed globally)</label>
                                    <div className="flex gap-4 items-center">
                                        <input type="text" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] text-sm focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                    <p className="text-[#9CA3AF] text-[10px] mt-1.5">Academics UI displays exactly 1 YouTube featured record with a video player on the left.</p>
                                </div>

                                <div className="pt-2 flex gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2] group-hover:bg-[#EDF5F2]'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-[#374151]">Active</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${isFeatured ? 'bg-amber-500' : 'bg-[#EDF5F2] group-hover:bg-[#EDF5F2]'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-[#374151]">Featured (Large Card w/ Video)</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-gray-200 bg-[#EDF5F2]/70 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#EDF5F2]/70 font-medium transition-colors">Cancel</button>
                            <button form="impForm" type="submit" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Impact'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
