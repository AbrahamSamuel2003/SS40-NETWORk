'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';

export default function DigitalSolutionsHappimonialsPage() {
    const [happimonials, setHappimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [clientName, setClientName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [testimonial, setTestimonial] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/happimonials?pageScope=DIGITAL_SOLUTIONS');
            const data = await res.json();
            if (data.success) {
                setHappimonials(data.data);
            } else {
                setErrorMsg(data.error);
            }
        } catch (e) {
            setErrorMsg('Failed to load.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: any) => {
        if (item) {
            setEditingId(item.id);
            setClientName(item.clientName);
            setCompanyName(item.companyName);
            setIndustry(item.industry);
            setTestimonial(item.testimonial);
            setThumbnailUrl(item.thumbnailUrl || '');
            setVideoUrl(item.videoUrl || '');
            setYoutubeUrl(item.youtubeUrl || '');
            setIsActive(item.isActive);
        } else {
            setEditingId(null);
            setClientName('');
            setCompanyName('');
            setIndustry('');
            setTestimonial('');
            setThumbnailUrl('');
            setVideoUrl('');
            setYoutubeUrl('');
            setIsActive(true);
        }
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setThumbnailUrl(data.data.url);
            } else {
                setErrorMsg(data.error || 'Upload failed');
            }
        } catch {
            setErrorMsg('Upload error');
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');

        const payload = {
            clientName,
            companyName,
            industry,
            testimonial,
            thumbnailUrl,
            videoUrl,
            youtubeUrl,
            isActive,
            pageScope: 'DIGITAL_SOLUTIONS'
        };

        try {
            const url = editingId ? `/api/admin/happimonials/${editingId}` : '/api/admin/happimonials';
            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchData();
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
        if (!confirm('Delete this happimonial?')) return;
        try {
            const res = await fetch(`/api/admin/happimonials/${id}`, { method: 'DELETE' });
            if ((await res.json()).success) fetchData();
        } catch (e) {
            alert('Failed to delete');
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[#111827]"><div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-gray-200"></div></div>;

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Digital Solutions Happimonials</h2>
                    <p className="text-[#6B7280]">Manage client success stories for the Digital Solutions section.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Testimonial
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                {/* ── MOBILE CARD GRID (hidden on sm+) ── */}
                <div className="sm:hidden">
                    {happimonials.length === 0 ? (
                        <div className="p-8 text-center text-[#9CA3AF]">No happimonials found for Digital Solutions.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-3">
                            {happimonials.map(item => (
                                <div key={item.id} className="admin-card p-3 flex flex-col gap-2 rounded-xl">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold text-[#111827] text-sm leading-tight line-clamp-2">{item.clientName}</span>
                                        <button onClick={() => handleOpenModal(item)} className="shrink-0 p-1 text-[#9CA3AF] hover:text-[#111827]">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[#6B7280] text-xs leading-snug line-clamp-1">{item.companyName} · {item.industry}</p>
                                    <p className="text-[#9CA3AF] text-[10px] leading-snug line-clamp-2">{item.testimonial}</p>
                                    <div className="mt-auto pt-1 flex items-center justify-between">
                                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20">• Story</span>
                                        <button onClick={() => handleDelete(item.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-1">
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
                        <thead className="bg-[#EDF5F2]/70 border-b border-gray-200 text-[#111827]">
                            <tr>
                                <th className="p-4 font-medium min-w-[80px] hidden sm:table-cell">Avatar</th>
                                <th className="p-4 font-medium min-w-[150px]">Client Info</th>
                                <th className="p-4 font-medium text-left min-w-[200px] hidden sm:table-cell">Testimonial</th>
                                <th className="p-4 font-medium text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {happimonials.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-[#9CA3AF]">No happimonials found for Digital Solutions.</td></tr>
                            ) : (
                                happimonials.map(item => (
                                    <tr key={item.id} className="hover:bg-[#EDF5F2]/50">
                                        <td className="p-4 hidden sm:table-cell">
                                            {item.thumbnailUrl ? (
                                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0"><img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" /></div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-[#EDF5F2] flex items-center justify-center shrink-0 uppercase font-bold text-[#9CA3AF]">{item.clientName.charAt(0)}</div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">
                                            <div className="text-[#111827]">{item.clientName}</div>
                                            <div className="text-[#9CA3AF] text-xs">{item.companyName} · {item.industry}</div>
                                            {item.youtubeUrl && (
                                                <div className="mt-1">
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#B91C1C] bg-[#FEE2E2] border border-[#FCA5A5] rounded px-1.5 py-0.5">
                                                        ▶ YouTube
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-[#6B7280] text-xs max-w-sm truncate hidden sm:table-cell">{item.testimonial}</td>
                                        <td className="p-3">
                                            <div className="grid grid-cols-2 gap-1.5 w-fit ml-auto">
                                                <button onClick={() => handleOpenModal(item)} className="px-3 py-1 rounded border border-gray-300 text-[#374151] text-xs font-medium hover:bg-[#EDF5F2]/70 hover:border-[#6B9F91] transition-colors whitespace-nowrap">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded border border-[#FCA5A5] text-[#B91C1C] text-xs font-medium hover:bg-red-50 transition-colors whitespace-nowrap">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
                    <div className="admin-card w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/80 shrink-0">
                            <div>
                                <h3 className="text-sm font-bold text-[#111827]">{editingId ? 'Edit Success Story' : 'Add Success Story'}</h3>
                                <p className="text-[10px] text-[#9CA3AF] mt-0.5">Digital Solutions happimonials</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#111827] p-1"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-4 overflow-y-auto w-full custom-scrollbar">
                            {errorMsg && <div className="mb-3 text-xs text-[#B91C1C] bg-[#FEE2E2] px-3 py-2 rounded border border-[#FCA5A5] flex gap-2"><AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMsg}</div>}

                            <form id="happimonialForm" onSubmit={handleSave} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-xs font-medium text-[#374151] mb-1">Client Name *</label><input required value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]" /></div>
                                    <div><label className="block text-xs font-medium text-[#374151] mb-1">Company Name *</label><input required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]" /></div>
                                </div>
                                <div><label className="block text-xs font-medium text-[#374151] mb-1">Industry Category *</label><input required value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]" /></div>

                                <div><label className="block text-xs font-medium text-[#374151] mb-1">Testimonial Quote *</label><textarea required rows={3} value={testimonial} onChange={e => setTestimonial(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] resize-none focus:outline-none focus:border-[#6B9F91]" /></div>

                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1">Avatar Image</label>
                                    <div className="flex gap-2">
                                        <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]" placeholder="URL..." />
                                        <label className={`cursor-pointer shrink-0 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${isUploading ? 'opacity-50' : ''}`}>
                                            <Upload className="w-3.5 h-3.5" /> Upload Local File
                                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                        </label>
                                        <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className="cursor-pointer shrink-0 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5">
                                            <ImageIcon className="w-3.5 h-3.5 text-[#6B9F91]" /> Select from Media
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1">
                                        YouTube URL <span className="text-[#9CA3AF] font-normal">(optional — one per Home section)</span>
                                    </label>
                                    <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91] placeholder:text-[#9CA3AF]" placeholder="https://www.youtube.com/watch?v=..." />
                                    <p className="mt-1 text-[10px] text-[#9CA3AF]">Supports youtube.com/watch, youtu.be, and youtube.com/shorts links.</p>
                                </div>

                                <label className="flex items-center gap-2.5 cursor-pointer pt-1 border-t border-gray-100">
                                    <div className="relative shrink-0">
                                        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                        <div className={`w-8 h-5 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2]'}`}></div>
                                        <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-3' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className="text-xs font-medium text-[#374151]">Active</span>
                                </label>
                            </form>
                        </div>
                        <div className="px-4 py-2.5 border-t border-gray-200 flex justify-end gap-2 bg-[#EDF5F2]/50 shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 rounded-md text-xs text-[#6B7280] hover:bg-[#EDF5F2]/70 font-medium">Cancel</button>
                            <button type="submit" form="happimonialForm" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-5 py-1.5 rounded-md text-xs font-medium disabled:opacity-50">Save Happimonial</button>
                        </div>
                    </div>
                </div>
            )}

            {isMediaSelectorOpen && (
                <MediaSelectorModal
                    onClose={() => setIsMediaSelectorOpen(false)}
                    onSelect={(url) => {
                        setThumbnailUrl(url);
                        setIsMediaSelectorOpen(false);
                    }}
                />
            )}
        </div>
    )
}
