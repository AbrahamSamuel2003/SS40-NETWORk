'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';
import { SectionVisibilityToggle } from '@/components/admin/SectionVisibilityToggle';

export default function HomeHappimonialsPage() {
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
            const res = await fetch('/api/admin/happimonials?pageScope=HOME');
            const data = await res.json();
            if (data.success) {
                setHappimonials(data.data);
            } else {
                setErrorMsg(data.error);
            }
        } catch {
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
        const rawFile = e.target.files[0];

        setIsUploading(true);
        try {
            const file = await compressImageFile(rawFile, { maxWidth: 1200, maxHeight: 1200 });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pageScope', 'HOME_HAPPIMONIALS');
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
            pageScope: 'HOME'
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
        } catch {
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
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Home Page Happimonials</h1>
                    <p className="text-sm text-[#475569] mt-0.5">Manage featured testimonials displayed on the Homepage.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <SectionVisibilityToggle
                        sectionKey="home_happimonials"
                        sectionLabel="Success Stories"
                    />
                    <button onClick={() => handleOpenModal()} className="admin-button-primary">
                        <Plus className="w-4 h-4" /> Add Testimonial
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                {/* Mobile Cards: 2-Column Grid */}
                <div className="sm:hidden p-2.5">
                    {happimonials.length === 0 ? (
                        <div className="p-8 text-center text-sm text-[#64748B]">No entries specific to Home found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {happimonials.map(item => (
                                <div key={item.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            {item.thumbnailUrl ? (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-[#E2E8F0] overflow-hidden shrink-0">
                                                    <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {item.clientName.charAt(0)}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-xs text-[#0F172A] leading-tight truncate" title={item.clientName}>
                                                    {item.clientName}
                                                </h3>
                                                <p className="text-[10px] text-[#64748B] truncate">{item.companyName}</p>
                                            </div>
                                        </div>

                                        <p className="text-[10px] text-[#334151] italic line-clamp-3 leading-relaxed bg-[#F8FAFC] p-1.5 rounded border border-gray-100">
                                            &ldquo;{item.testimonial}&rdquo;
                                        </p>

                                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${item.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                {item.isActive ? 'Active' : 'Draft'}
                                            </span>
                                            {item.youtubeUrl && (
                                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1 py-0.2 rounded">
                                                    <Video className="w-2.5 h-2.5 text-rose-600" /> Video
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center flex-1"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
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
                                <th className="w-16">Avatar</th>
                                <th>Client Info</th>
                                <th>Testimonial Quote</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {happimonials.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-[#64748B]">No entries specific to Home found.</td>
                                </tr>
                            ) : (
                                happimonials.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.thumbnailUrl ? (
                                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-[#E2E8F0] overflow-hidden">
                                                    <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30 flex items-center justify-center font-bold">
                                                    {item.clientName.charAt(0)}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="font-semibold text-sm text-[#0F172A]">{item.clientName}</div>
                                            <div className="text-xs text-[#64748B]">{item.companyName} · {item.industry}</div>
                                            {item.youtubeUrl && (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-medium mt-1">
                                                    <Video className="w-3 h-3" /> YouTube Video
                                                </span>
                                            )}
                                        </td>
                                        <td className="max-w-md">
                                            <p className="text-xs text-[#334151] line-clamp-2 italic">&ldquo;{item.testimonial}&rdquo;</p>
                                        </td>
                                        <td className="text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${item.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                <CheckCircle2 className="w-3 h-3" /> {item.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-[#334151] hover:text-[#0F766E] hover:bg-[#EDF5F2] rounded-md transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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
                    <div className="admin-modal-panel max-w-xl">
                        <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAF9]">
                            <div>
                                <h3 className="text-base font-bold text-[#0F172A]">{editingId ? 'Edit Success Story' : 'Add Success Story'}</h3>
                                <p className="text-xs text-[#64748B]">Home page featured testimonial</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-[calc(90vh-130px)] custom-scrollbar">
                            {errorMsg && (
                                <div className="mb-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="happimonialForm" onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Client Name *</label>
                                        <input required value={clientName} onChange={e => setClientName(e.target.value)} className="admin-input" placeholder="e.g. John Doe" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Company Name *</label>
                                        <input required value={companyName} onChange={e => setCompanyName(e.target.value)} className="admin-input" placeholder="e.g. Acme Corp" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Industry Category *</label>
                                    <input required value={industry} onChange={e => setIndustry(e.target.value)} className="admin-input" placeholder="e.g. Logistics, AI" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Testimonial Quote *</label>
                                    <textarea required rows={3} value={testimonial} onChange={e => setTestimonial(e.target.value)} className="admin-input resize-none" placeholder="Feedback quote..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Avatar Image</label>
                                    <div className="flex flex-col gap-2.5">
                                        <input value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} className="admin-input text-xs" placeholder="URL or select from Media library..." />
                                        
                                        {thumbnailUrl && (
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#E2E8F0] bg-slate-50 group">
                                                <img src={thumbnailUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setThumbnailUrl('')} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <label className={`cursor-pointer admin-button-secondary justify-center text-xs ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <Upload className="w-4 h-4 text-[#0F766E]" /> {isUploading ? 'Uploading...' : 'Upload Local File'}
                                                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                            </label>
                                            <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className="admin-button-secondary justify-center text-xs">
                                                <ImageIcon className="w-4 h-4 text-[#0F766E]" /> Select from Media
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">YouTube URL (optional)</label>
                                    <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} className="admin-input" placeholder="https://www.youtube.com/watch?v=..." />
                                </div>

                                <div className="pt-3 border-t border-[#E2E8F0]">
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isActive ? 'bg-[#0F766E]' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Active</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAF9] flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-secondary justify-center">Cancel</button>
                            <button type="submit" form="happimonialForm" disabled={isSaving} className="admin-button-primary justify-center disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Happimonial'}
                            </button>
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
    );
}
