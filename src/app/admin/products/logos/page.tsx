'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductLogosPage() {
    const router = useRouter();
    const [logos, setLogos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Client');
    const [placementType, setPlacementType] = useState('CLIENT'); // In Products page, it's typically just a general list, but I will keep schema compatible
    const [logoUrl, setLogoUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [showTextOnCard, setShowTextOnCard] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchLogos();
    }, []);

    const fetchLogos = async () => {
        try {
            const res = await fetch('/api/admin/organization-logos?pageScope=PRODUCTS');
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
            setCategory(logo.category || 'Client');
            setPlacementType(logo.placementType || 'CLIENT');
            setLogoUrl(logo.logoUrl || '');
            setIsActive(logo.isActive);
            setShowTextOnCard(logo.showTextOnCard || false);
        } else {
            setEditingId(null);
            setName('');
            setCategory('Client');
            setPlacementType('CLIENT');
            setLogoUrl('');
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
            isActive,
            showTextOnCard,
            pageScope: 'PRODUCTS'
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
        if (!confirm('Are you sure you want to delete this logo?')) return;
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
            <div className="p-12 text-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Product Logos</h2>
                    <p className="text-white/60">Manage partner and client organization logos for the Products section.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Logo
                </button>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-white/80">
                    <thead className="bg-white/5 border-b border-white/10 text-white">
                        <tr>
                            <th className="p-4 font-medium">Logo</th>
                            <th className="p-4 font-medium">Organization / Category</th>
                            <th className="p-4 font-medium">Placement / Scope</th>
                            <th className="p-4 font-medium text-center">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-white/40">
                                    No logos found for the Products page.
                                </td>
                            </tr>
                        ) : (
                            logos.map((logo) => (
                                <tr key={logo.id} className="hover:bg-white/[0.02]">
                                    <td className="p-4 w-24">
                                        {logo.logoUrl ? (
                                            <div className="w-14 h-14 bg-white/5 rounded flex items-center justify-center p-2">
                                                <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 bg-white/5 rounded flex items-center justify-center text-white/20 text-xs text-center border border-dashed border-white/20">
                                                No Img
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium">
                                        <div className="text-white">{logo.name}</div>
                                        <div className="text-white/40 text-xs mt-0.5">{logo.category}</div>
                                    </td>
                                    <td className="p-4 text-xs">
                                        <span className="inline-block bg-white/10 px-2 py-0.5 rounded text-white/60 mb-1">
                                            {logo.placementType}
                                        </span>
                                        <div className="text-white/40 mt-1">PRODUCTS</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${logo.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {logo.isActive ? 'Active' : 'Inactive'}
                                        </span>
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Logo' : 'Add Logo'}</h3>
                            <button onClick={handleCloseModal} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {errorMsg && (
                                <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/50 flex gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="logoForm" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/80 mb-1.5">Organization Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/80 mb-1.5">Category *</label>
                                        <input
                                            required
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                                            placeholder="e.g. Client, Partner, Featured"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/80 mb-1.5">Placement Target *</label>
                                        <select
                                            value={placementType}
                                            onChange={e => setPlacementType(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="CLIENT">Client Marquee</option>
                                            <option value="PARTNER">Partner Details</option>
                                            <option value="FEATURED">Featured Section</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="block text-sm text-white/80 mb-1.5">Logo Image *</label>
                                    {logoUrl && (
                                        <div className="mb-3 p-4 bg-white/5 rounded-lg border border-white/10 flex justify-center">
                                            <img src={logoUrl} alt="Preview" className="max-h-20 object-contain" />
                                        </div>
                                    )}
                                    <div className="flex gap-4">
                                        <input
                                            required={!logoUrl}
                                            value={logoUrl}
                                            onChange={e => setLogoUrl(e.target.value)}
                                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                                            placeholder="URL..."
                                        />
                                        <label className={`cursor-pointer shrink-0 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                            <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload'}
                                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-white/80">Active</span>
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={showTextOnCard} onChange={e => setShowTextOnCard(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${showTextOnCard ? 'bg-[var(--color-primary)]' : 'bg-white/10 group-hover:bg-white/20'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showTextOnCard ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-white/80">Show text on card</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/5 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="logoForm" disabled={isSaving} className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 font-medium">
                                {isSaving ? 'Saving...' : (editingId ? 'Update Logo' : 'Add Logo')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
