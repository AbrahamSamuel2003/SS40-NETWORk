'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';

export default function ProductTestimonialsPage() {
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

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/happimonials?pageScope=PRODUCTS');
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
            pageScope: 'PRODUCTS'
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
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Product Testimonials</h2>
                    <p className="text-[#6B7280]">Manage client success stories for the Products section.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Testimonial
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                <table className="w-full text-left text-sm text-[#374151]">
                    <thead className="bg-[#EDF5F2]/70 border-b border-gray-200 text-[#111827]">
                        <tr>
                            <th className="p-4 font-medium">Avatar</th>
                            <th className="p-4 font-medium">Client Info</th>
                            <th className="p-4 font-medium text-left">Testimonial</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {happimonials.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-[#9CA3AF]">No product testimonials found.</td></tr>
                        ) : (
                            happimonials.map(item => (
                                <tr key={item.id} className="hover:bg-[#EDF5F2]/50">
                                    <td className="p-4">
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
                                    <td className="p-4 text-[#6B7280] text-xs max-w-sm truncate">{item.testimonial}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleOpenModal(item)} className="text-[#9CA3AF] hover:text-[#111827] p-2 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-2 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
                    <div className="admin-card w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/70">
                            <h3 className="text-lg font-bold text-[#111827]">{editingId ? 'Edit Success Story' : 'Add Success Story'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#111827]"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full custom-scrollbar">
                            {errorMsg && <div className="mb-4 text-sm text-[#B91C1C] bg-[#FEE2E2] p-3 rounded-lg border border-[#FCA5A5] flex gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}</div>}

                            <form id="happimonialForm" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm text-[#374151] mb-1.5">Client Name *</label><input required value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" /></div>
                                    <div><label className="block text-sm text-[#374151] mb-1.5">Company Name *</label><input required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" /></div>
                                </div>
                                <div><label className="block text-sm text-[#374151] mb-1.5">Industry Category *</label><input required value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" /></div>

                                <div><label className="block text-sm text-[#374151] mb-1.5">Testimonial Quote *</label><textarea required rows={4} value={testimonial} onChange={e => setTestimonial(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827] resize-none" /></div>

                                <div>
                                    <label className="block text-sm text-[#374151] mb-1.5">Avatar / Thumbnail Image</label>
                                    <div className="flex gap-4">
                                        <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" placeholder="URL..." />
                                        <label className={`cursor-pointer shrink-0 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                            <Upload className="w-4 h-4" /> Upload
                                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#374151] mb-1.5">
                                        YouTube Video URL
                                        <span className="ml-2 text-[#9CA3AF] text-xs font-normal">(optional)</span>
                                    </label>
                                    <input
                                        value={youtubeUrl}
                                        onChange={e => setYoutubeUrl(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827] placeholder:text-[#9CA3AF]"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    <p className="mt-1 text-xs text-[#9CA3AF]">Supports youtube.com/watch, youtu.be, and youtube.com/shorts links.</p>
                                </div>
                                <div className="pt-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" /><div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2]'}`}></div><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                        <span className="text-sm font-medium text-[#374151]">Active</span>
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-[#EDF5F2]/70">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-[#6B7280] hover:bg-[#EDF5F2]/70">Cancel</button>
                            <button type="submit" form="happimonialForm" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg disabled:opacity-50">Save Testimonial</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
