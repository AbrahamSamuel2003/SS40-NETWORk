'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Film, Image as ImageIcon, Sparkles, Star } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';
import { useRouter } from 'next/navigation';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';
import { SectionVisibilityToggle } from '@/components/admin/SectionVisibilityToggle';

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
            <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Student Impacts</h2>
                    <p className="text-[#6B7280]">Manage student testimonials and videos displayed in Academics.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                    <SectionVisibilityToggle
                        sectionKey="academics_studentImpacts"
                        sectionLabel="Student Impacts"
                    />
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Impact
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                {/* ── MOBILE CARD GRID (hidden on sm+) ── */}
                <div className="sm:hidden">
                    {impacts.length === 0 ? (
                        <div className="p-8 text-center text-[#9CA3AF]">No student impacts found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-3">
                            {impacts.map(imp => (
                                <div key={imp.id} className="admin-card p-3 flex flex-col gap-2 rounded-xl">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold text-[#111827] text-sm leading-tight line-clamp-2">{imp.studentName}</span>
                                        <button onClick={() => handleOpenModal(imp)} className="shrink-0 p-1 text-[#9CA3AF] hover:text-[#111827]">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[#6B7280] text-xs leading-snug line-clamp-1">{imp.academicRoute} · {imp.designation}</p>
                                    <div className="mt-auto pt-1 flex items-center justify-between">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${imp.isActive ? 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20' : 'bg-[#D8E8E2]/70 text-[#9CA3AF]'}`}>• {imp.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                                        <button onClick={() => handleDelete(imp.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-1">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── DESKTOP TABLE (hidden on mobile) ── */}
                <div className="hidden sm:block overflow-x-auto w-full touch-auto">
                    <table className="w-full text-left text-sm text-[#374151] min-w-[600px]">
                        <thead className="bg-[#D8E8E2]/70 border-b border-gray-200 text-[#111827]">
                            <tr>
                                <th className="p-4 font-medium min-w-[150px]">Student Name</th>
                                <th className="p-4 font-medium min-w-[150px] hidden sm:table-cell">Route / Designation</th>
                                <th className="p-4 font-medium min-w-[100px] hidden md:table-cell">Featured</th>
                                <th className="p-4 font-medium min-w-[80px] hidden md:table-cell">Order</th>
                                <th className="p-4 font-medium min-w-[100px]">Status</th>
                                <th className="p-4 font-medium text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {impacts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#9CA3AF]">No student impacts found.</td>
                                </tr>
                            ) : (
                                impacts.map(imp => (
                                    <tr key={imp.id} className="hover:bg-[#D8E8E2]/50 transition-colors">
                                        <td className="p-4 font-medium">{imp.studentName}</td>
                                        <td className="p-4 text-[#6B7280] hidden sm:table-cell">{imp.academicRoute} <span className="opacity-50">· {imp.designation}</span></td>
                                        <td className="p-4 hidden md:table-cell">
                                            {imp.isFeatured ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500">
                                                    <Star className="w-3 h-3 fill-current" /> YES
                                                </span>
                                            ) : (
                                                <span className="text-[#9CA3AF] text-xs">NO</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-[#6B7280] hidden md:table-cell">{imp.sortOrder}</td>
                                        <td className="p-4">
                                            {imp.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6B9F91]/10 text-[#6B9F91]">
                                                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D8E8E2]/70 text-[#9CA3AF]">
                                                    INACTIVE
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-col xl:flex-row gap-1.5 justify-end ml-auto shrink-0">
                                                <button onClick={() => handleOpenModal(imp)} className="px-3 py-1 rounded border border-gray-300 text-[#374151] text-xs font-medium hover:bg-[#D8E8E2]/70 hover:border-[#6B9F91] transition-colors whitespace-nowrap">Edit</button>
                                                <button onClick={() => handleDelete(imp.id)} className="px-3 py-1 rounded border border-[#FCA5A5] text-[#B91C1C] text-xs font-medium hover:bg-red-50 transition-colors whitespace-nowrap">Delete</button>
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
                                    <div className="flex flex-col gap-3">
                                        <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] text-sm focus:outline-none focus:border-[#6B9F91]" />
                                        
                                        {videoUrl && (
                                            <div className="relative w-full max-w-sm aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group">
                                                <video src={videoUrl} className="w-full h-full object-contain" />
                                                <button type="button" onClick={() => setVideoUrl('')} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 shadow-sm">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        
                                        <div className="flex flex-wrap gap-3">
                                            <label className={`cursor-pointer bg-[#D8E8E2]/70 hover:bg-[#D8E8E2] text-[#111827] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isUploadingMedia ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <Upload className="w-4 h-4" /> {isUploadingMedia ? 'Uploading...' : 'Upload Local File'}
                                                <input type="file" accept="video/mp4,video/webm" onChange={handleUploadMedia} className="hidden" disabled={isUploadingMedia} />
                                            </label>
                                            <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className="cursor-pointer bg-[#D8E8E2]/70 hover:bg-[#D8E8E2] text-[#111827] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-[#6B9F91]" /> Select from Media
                                            </button>
                                        </div>
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
                                            <div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#D8E8E2] group-hover:bg-[#D8E8E2]'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-[#374151]">Active</span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${isFeatured ? 'bg-amber-500' : 'bg-[#D8E8E2] group-hover:bg-[#D8E8E2]'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-[#374151]">Featured (Large Card w/ Video)</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-gray-200 bg-[#D8E8E2]/70 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#D8E8E2]/70 font-medium transition-colors">Cancel</button>
                            <button form="impForm" type="submit" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
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
