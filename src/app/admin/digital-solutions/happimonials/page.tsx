'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';

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

    if (isLoading) return <div className="p-12 text-center text-white"><div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-white"></div></div>;

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Digital Solutions Happimonials</h2>
                    <p className="text-white/60">Manage client success stories for the Digital Solutions section.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Testimonial
                </button>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-white/80">
                    <thead className="bg-white/5 border-b border-white/10 text-white">
                        <tr>
                            <th className="p-4 font-medium">Avatar</th>
                            <th className="p-4 font-medium">Client Info</th>
                            <th className="p-4 font-medium text-left">Testimonial</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {happimonials.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-white/40">No happimonials found for Digital Solutions.</td></tr>
                        ) : (
                            happimonials.map(item => (
                                <tr key={item.id} className="hover:bg-white/[0.02]">
                                    <td className="p-4">
                                        {item.thumbnailUrl ? (
                                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0"><img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" /></div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 uppercase font-bold text-white/40">{item.clientName.charAt(0)}</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium">
                                        <div className="text-white">{item.clientName}</div>
                                        <div className="text-white/40 text-xs">{item.companyName} · {item.industry}</div>
                                        {item.youtubeUrl && (
                                            <div className="mt-1">
                                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5">
                                                    ▶ YouTube
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-white/60 text-xs max-w-sm truncate">{item.testimonial}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleOpenModal(item)} className="text-white/40 hover:text-white p-2">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-500/50 hover:text-red-500 p-2">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Success Story' : 'Add Success Story'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full">
                            {errorMsg && <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/50 flex gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}</div>}

                            <form id="happimonialForm" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm text-white/80 mb-1.5">Client Name *</label><input required value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white" /></div>
                                    <div><label className="block text-sm text-white/80 mb-1.5">Company Name *</label><input required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white" /></div>
                                </div>
                                <div><label className="block text-sm text-white/80 mb-1.5">Industry Category *</label><input required value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white" /></div>

                                <div><label className="block text-sm text-white/80 mb-1.5">Testimonial Quote *</label><textarea required rows={4} value={testimonial} onChange={e => setTestimonial(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white resize-none" /></div>

                                <div>
                                    <label className="block text-sm text-white/80 mb-1.5">Avatar Image</label>
                                    <div className="flex gap-4">
                                        <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="URL..." />
                                        <label className={`cursor-pointer shrink-0 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                            <Upload className="w-4 h-4" /> Upload
                                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/80 mb-1.5">
                                        YouTube Video URL
                                        <span className="ml-2 text-white/30 text-xs font-normal">(optional — only one allowed per Home section)</span>
                                    </label>
                                    <input
                                        value={youtubeUrl}
                                        onChange={e => setYoutubeUrl(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                    <p className="mt-1 text-xs text-white/30">Supports youtube.com/watch, youtu.be, and youtube.com/shorts links.</p>
                                </div>
                                <div className="pt-3">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" /><div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`}></div><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                        <span className="text-sm font-medium text-white/80">Active</span>
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/5">Cancel</button>
                            <button type="submit" form="happimonialForm" disabled={isSaving} className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50">Save Happimonial</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
