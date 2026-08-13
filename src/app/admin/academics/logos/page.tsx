'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
        } else {
            setEditingId(null);
            setName('');
            setCategory('Academic Partner');
            setPlacementType('UNIVERSITY');
            setLogoUrl('');
            setSortOrder(0);
            setIsActive(true);
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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Academic Partner Logos</h2>
                    <p className="text-white/60">Manage collaborative university and institutional logos for Academics.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Partner
                </button>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-white/80">
                    <thead className="bg-white/5 border-b border-white/10 text-white">
                        <tr>
                            <th className="p-4 font-medium">Logo</th>
                            <th className="p-4 font-medium">Institution Name</th>
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">Order</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-white/40">No academic partners found.</td>
                            </tr>
                        ) : (
                            logos.map(logo => (
                                <tr key={logo.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        {logo.logoUrl ? (
                                            <div className="w-12 h-12 bg-white/10 rounded overflow-hidden flex items-center justify-center">
                                                <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain p-1" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-white/5 rounded flex items-center justify-center text-xs text-white/40">N/A</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium">{logo.name}</td>
                                    <td className="p-4 text-white/60">{logo.category}</td>
                                    <td className="p-4 text-white/60">{logo.sortOrder}</td>
                                    <td className="p-4">
                                        {logo.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500">
                                                <CheckCircle2 className="w-3 h-3" /> ACTIVE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 text-white/40">
                                                INACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleOpenModal(logo)} className="text-white/40 hover:text-white p-2 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(logo.id)} className="text-red-500/50 hover:text-red-500 p-2 transition-colors">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Partner Logo' : 'Add Partner Logo'}</h3>
                            <button onClick={handleCloseModal} className="text-white/40 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto custom-scrollbar">
                            {errorMsg && (
                                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm flex gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="logoForm" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">Institution Name *</label>
                                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">Type / Category *</label>
                                        <input required type="text" value={category} placeholder="e.g. University MoU" onChange={e => setCategory(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">Sort Order</label>
                                        <input type="number" required value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">Internal Placement Type *</label>
                                    <select value={placementType} onChange={e => setPlacementType(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)]">
                                        <option value="UNIVERSITY">University</option>
                                        <option value="PARTNER">Partner</option>
                                        <option value="CLIENT">Client</option>
                                        <option value="BRAND">Brand</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">Logo Image</label>
                                    <div className="flex gap-4 items-center">
                                        {logoUrl && (
                                            <div className="w-12 h-12 shrink-0 bg-white/10 rounded border border-white/5 flex items-center justify-center p-1">
                                                <img src={logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <label className={`cursor-pointer inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                                                <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload Image'}
                                                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                            </label>
                                            <p className="text-white/40 text-[10px] mt-1.5">* Prefer SVG, PNG or WebP with transparent backgrounds.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[var(--color-primary)]' : 'bg-white/10 group-hover:bg-white/20'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-white/80">Active</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-white/10 bg-black/30 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 font-medium transition-colors">Cancel</button>
                            <button form="logoForm" type="submit" disabled={isSaving} className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Logo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
