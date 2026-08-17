'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';

export default function AcademicPartnerLogosPage() {
    const router = useRouter();
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
        } catch (e) {
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

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
        } catch (err) {
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
        <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Academic Partner Logos</h2>
                    <p className="text-[#6B7280]">Manage collaborative university and institutional logos for Academics.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Partner
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                {/* ── MOBILE CARD GRID (hidden on sm+) ── */}
                <div className="sm:hidden">
                    {logos.length === 0 ? (
                        <div className="p-8 text-center text-[#9CA3AF]">No academic partners found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-3">
                            {logos.map(logo => (
                                <div key={logo.id} className="admin-card p-3 flex flex-col gap-2 rounded-xl">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold text-[#111827] text-sm leading-tight line-clamp-2">{logo.name}</span>
                                        <button onClick={() => handleOpenModal(logo)} className="shrink-0 p-1 text-[#9CA3AF] hover:text-[#111827]">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[#6B7280] text-xs leading-snug line-clamp-1">{logo.category}</p>
                                    <div className="mt-auto pt-1 flex items-center justify-between">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${logo.isActive ? 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20' : 'bg-[#EDF5F2]/70 text-[#9CA3AF]'}`}>• {logo.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                                        <button onClick={() => handleDelete(logo.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-1">
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
                                <th className="p-4 font-medium min-w-[80px] hidden sm:table-cell">Logo</th>
                                <th className="p-4 font-medium min-w-[150px]">Institution Name</th>
                                <th className="p-4 font-medium min-w-[100px] hidden sm:table-cell">Type</th>
                                <th className="p-4 font-medium min-w-[80px] hidden md:table-cell">Order</th>
                                <th className="p-4 font-medium min-w-[100px]">Status</th>
                                <th className="p-4 font-medium text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#9CA3AF]">No academic partners found.</td>
                                </tr>
                            ) : (
                                logos.map(logo => (
                                    <tr key={logo.id} className="hover:bg-[#EDF5F2]/50 transition-colors">
                                        <td className="p-4 hidden sm:table-cell">
                                            {logo.logoUrl ? (
                                                <div className="w-12 h-12 bg-[#EDF5F2] rounded overflow-hidden flex items-center justify-center">
                                                    <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain p-1" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-[#EDF5F2]/70 rounded flex items-center justify-center text-xs text-[#9CA3AF]">N/A</div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">{logo.name}</td>
                                        <td className="p-4 text-[#6B7280] hidden sm:table-cell">{logo.category}</td>
                                        <td className="p-4 text-[#6B7280] hidden md:table-cell">{logo.sortOrder}</td>
                                        <td className="p-4">
                                            {logo.isActive ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#6B9F91]/10 text-[#6B9F91]">
                                                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EDF5F2]/70 text-[#9CA3AF]">
                                                    INACTIVE
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="grid grid-cols-2 gap-1.5 w-fit ml-auto">
                                                <button onClick={() => handleOpenModal(logo)} className="px-3 py-1 rounded border border-gray-300 text-[#374151] text-xs font-medium hover:bg-[#EDF5F2]/70 hover:border-[#6B9F91] transition-colors whitespace-nowrap">Edit</button>
                                                <button onClick={() => handleDelete(logo.id)} className="px-3 py-1 rounded border border-[#FCA5A5] text-[#B91C1C] text-xs font-medium hover:bg-red-50 transition-colors whitespace-nowrap">Delete</button>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
                    <div className="admin-card w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-[#111827]">{editingId ? 'Edit Partner Logo' : 'Add Partner Logo'}</h3>
                            <button onClick={handleCloseModal} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto custom-scrollbar">
                            {errorMsg && (
                                <div className="mb-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] p-3 rounded-lg text-sm flex gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="logoForm" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Institution Name *</label>
                                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6B9F91]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Type / Category *</label>
                                        <input required type="text" value={category} placeholder="e.g. University MoU" onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Sort Order</label>
                                        <input type="number" required value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Internal Placement Type *</label>
                                    <select value={placementType} onChange={e => setPlacementType(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]">
                                        <option value="UNIVERSITY">University</option>
                                        <option value="PARTNER">Partner</option>
                                        <option value="CLIENT">Client</option>
                                        <option value="BRAND">Brand</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Logo Image</label>
                                    <div className="flex gap-4 items-center">
                                        {logoUrl && (
                                            <div className="w-12 h-12 shrink-0 bg-[#EDF5F2] rounded border border-gray-100 flex items-center justify-center p-1">
                                                <img src={logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                            </div>
                                        )}
                                        <div className="flex-1 flex gap-2 items-center flex-wrap">
                                            <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="/uploads/... or https://..." className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827] focus:outline-none focus:border-[#6B9F91] mb-1" />
                                            <label className={`cursor-pointer inline-flex items-center gap-2 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] border border-gray-200 text-[#111827] px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                                                <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload Local File'}
                                                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                            </label>
                                            <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className="cursor-pointer inline-flex items-center gap-2 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] border border-gray-200 text-[#111827] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                                <ImageIcon className="w-4 h-4 text-[#6B9F91]" /> Select from Media
                                            </button>
                                            <p className="text-[#9CA3AF] text-[10px] w-full mt-1">* Prefer SVG, PNG or WebP with transparent backgrounds.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2] group-hover:bg-[#EDF5F2]'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-[#374151]">Active</span>
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={showTextOnCard} onChange={e => setShowTextOnCard(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${showTextOnCard ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2] group-hover:bg-[#EDF5F2]'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showTextOnCard ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-[#374151]">Show text on card</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-gray-200 bg-[#EDF5F2]/70 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#EDF5F2]/70 font-medium transition-colors">Cancel</button>
                            <button form="logoForm" type="submit" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
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
