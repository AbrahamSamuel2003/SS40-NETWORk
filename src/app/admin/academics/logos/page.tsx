'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';
import { SectionVisibilityToggle } from '@/components/admin/SectionVisibilityToggle';

export default function AcademicPartnerLogosPage() {
    const [logos, setLogos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [placementType, setPlacementType] = useState('UNIVERSITY');
    const [logoUrl, setLogoUrl] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [showTextOnCard, setShowTextOnCard] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

    useEffect(() => {
        fetchLogos();
    }, []);

    const fetchLogos = async () => {
        try {
            const res = await fetch('/api/admin/organization-logos?isActive=all&pageScope=ACADEMICS');
            const data = await res.json();
            if (data.success) {
                setLogos(data.data);
            } else {
                setErrorMsg(data.error);
            }
        } catch {
            setErrorMsg('Failed to load logos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (logo?: any) => {
        if (logo) {
            setEditingId(logo.id);
            setName(logo.name);
            setCategory(logo.category);
            setPlacementType(logo.placementType);
            setLogoUrl(logo.logoUrl || '');
            setSortOrder(logo.sortOrder);
            setIsActive(logo.isActive);
            setShowTextOnCard(logo.showTextOnCard || false);
        } else {
            setEditingId(null);
            setName('');
            setCategory('Academic Partner');
            setPlacementType('UNIVERSITY');
            setLogoUrl('');
            setSortOrder(0);
            setIsActive(true);
            setShowTextOnCard(false);
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
            formData.append('pageScope', 'ACADEMICS_LOGOS');

            const res = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setLogoUrl(data.data.url);
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
            name,
            category,
            placementType,
            logoUrl,
            sortOrder,
            isActive,
            showTextOnCard,
            pageScope: 'ACADEMICS'
        };

        try {
            const url = editingId
                ? `/api/admin/organization-logos/${editingId}`
                : '/api/admin/organization-logos';

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchLogos();
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
        if (!confirm('Are you sure you want to delete this partner logo?')) return;
        try {
            const res = await fetch(`/api/admin/organization-logos/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchLogos();
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
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Academic Partner Logos</h1>
                    <p className="text-sm text-[#475569] mt-0.5">Manage university MoUs and institutional logos for Academics.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <SectionVisibilityToggle
                        sectionKey="academics_logos"
                        sectionLabel="Academic Partner Logos"
                    />
                    <button
                        onClick={() => handleOpenModal()}
                        className="admin-button-primary"
                    >
                        <Plus className="w-4 h-4" /> Add Partner
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                {/* Mobile Cards: 2-Column Grid */}
                <div className="sm:hidden p-2.5">
                    {logos.length === 0 ? (
                        <div className="p-8 text-center text-sm text-[#64748B]">No academic partners found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {logos.map(logo => (
                                <div key={logo.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                    <div className="space-y-1.5">
                                        <div className="w-full h-16 bg-slate-50 border border-[#E2E8F0] rounded-lg flex items-center justify-center p-2 relative">
                                            {logo.logoUrl ? (
                                                <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain" />
                                            ) : (
                                                <span className="text-xs text-[#94A3B8] font-bold">{logo.name.slice(0, 2).toUpperCase()}</span>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between gap-1">
                                                <h3 className="font-bold text-xs text-[#0F172A] leading-tight truncate" title={logo.name}>
                                                    {logo.name}
                                                </h3>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0 ${logo.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                    {logo.isActive ? 'Active' : 'Draft'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-[#64748B] truncate mt-0.5">{logo.category}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-1">
                                        <button
                                            onClick={() => handleOpenModal(logo)}
                                            className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center flex-1"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(logo.id)}
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
                                <th className="w-16">Logo</th>
                                <th>Institution Name</th>
                                <th>Type / Category</th>
                                <th className="text-center">Order</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-[#64748B]">No academic partners found.</td>
                                </tr>
                            ) : (
                                logos.map(logo => (
                                    <tr key={logo.id}>
                                        <td>
                                            <div className="w-12 h-12 bg-slate-50 border border-[#E2E8F0] rounded-lg flex items-center justify-center p-1.5">
                                                {logo.logoUrl ? (
                                                    <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain" />
                                                ) : (
                                                    <span className="text-xs text-[#94A3B8]">N/A</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-semibold text-sm text-[#0F172A]">{logo.name}</div>
                                        </td>
                                        <td className="text-xs text-[#475569]">{logo.category}</td>
                                        <td className="text-center text-xs text-[#64748B] font-mono">{logo.sortOrder}</td>
                                        <td className="text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${logo.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                <CheckCircle2 className="w-3 h-3" /> {logo.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(logo)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F766E] bg-[#EDF5F2] hover:bg-[#0F766E] hover:text-white rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(logo.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-lg transition-colors border border-rose-200/60"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Delete</span>
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
                    <div className="admin-modal-panel max-w-lg">
                        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAF9]">
                            <div>
                                <h3 className="text-base font-bold text-[#0F172A]">{editingId ? 'Edit Partner Logo' : 'Add Partner Logo'}</h3>
                                <p className="text-xs text-[#64748B]">University MoU partner mark</p>
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

                            <form id="logoForm" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Institution Name *</label>
                                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="admin-input" placeholder="e.g. Anna University" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Type / Category *</label>
                                        <input required type="text" value={category} placeholder="e.g. University MoU" onChange={e => setCategory(e.target.value)} className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Sort Order</label>
                                        <input type="number" required value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="admin-input" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Placement Type *</label>
                                    <select value={placementType} onChange={e => setPlacementType(e.target.value)} className="admin-input">
                                        <option value="UNIVERSITY">University</option>
                                        <option value="PARTNER">Partner</option>
                                        <option value="CLIENT">Client</option>
                                        <option value="BRAND">Brand</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Logo Image</label>
                                    <div className="flex flex-col gap-2.5">
                                        <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="URL or select from Media library..." className="admin-input text-xs" />
                                        
                                        {logoUrl && (
                                            <div className="w-20 h-20 bg-slate-50 rounded-lg border border-[#E2E8F0] flex items-center justify-center p-2 relative group">
                                                <img src={logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                                <button type="button" onClick={() => setLogoUrl('')} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-slate-500 hover:text-rose-600 shadow-sm" title="Remove">
                                                    <X className="w-3 h-3" />
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
                                            <input type="checkbox" checked={showTextOnCard} onChange={e => setShowTextOnCard(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${showTextOnCard ? 'bg-[#0F766E]' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${showTextOnCard ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Show text label</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAF9] flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-secondary justify-center">Cancel</button>
                            <button form="logoForm" type="submit" disabled={isSaving} className="admin-button-primary justify-center disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Logo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isMediaSelectorOpen && (
                <MediaSelectorModal
                    onClose={() => setIsMediaSelectorOpen(false)}
                    onSelect={(url) => {
                        setLogoUrl(url);
                        setIsMediaSelectorOpen(false);
                    }}
                />
            )}
        </div>
    );
}
