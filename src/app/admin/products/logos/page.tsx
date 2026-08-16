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
            <div className="p-12 text-center text-[#111827]">
                <div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-gray-200"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Product Logos</h2>
                    <p className="text-[#6B7280]">Manage partner and client organization logos for the Products section.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Logo
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                <table className="w-full text-left text-sm text-[#374151]">
                    <thead className="bg-[#EDF5F2]/70 border-b border-gray-200 text-[#111827]">
                        <tr>
                            <th className="p-4 font-medium">Logo</th>
                            <th className="p-4 font-medium">Organization / Category</th>
                            <th className="p-4 font-medium">Placement / Scope</th>
                            <th className="p-4 font-medium text-center">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-[#9CA3AF]">
                                    No logos found for the Products page.
                                </td>
                            </tr>
                        ) : (
                            logos.map((logo) => (
                                <tr key={logo.id} className="hover:bg-[#EDF5F2]/50">
                                    <td className="p-4 w-24">
                                        {logo.logoUrl ? (
                                            <div className="w-14 h-14 bg-[#EDF5F2]/70 rounded flex items-center justify-center p-2">
                                                <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 bg-[#EDF5F2]/70 rounded flex items-center justify-center text-[#111827]/20 text-xs text-center border border-dashed border-gray-200/20">
                                                No Img
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium">
                                        <div className="text-[#111827]">{logo.name}</div>
                                        <div className="text-[#9CA3AF] text-xs mt-0.5">{logo.category}</div>
                                    </td>
                                    <td className="p-4 text-xs">
                                        <span className="inline-block bg-[#EDF5F2] px-2 py-0.5 rounded text-[#6B7280] mb-1">
                                            {logo.placementType}
                                        </span>
                                        <div className="text-[#9CA3AF] mt-1">PRODUCTS</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${logo.isActive ? 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20' : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'}`}>
                                            {logo.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleOpenModal(logo)} className="text-[#9CA3AF] hover:text-[#111827] p-2 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(logo.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-2 transition-colors">
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
                    <div className="admin-card w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/70">
                            <h3 className="text-lg font-bold text-[#111827]">{editingId ? 'Edit Logo' : 'Add Logo'}</h3>
                            <button onClick={handleCloseModal} className="text-[#9CA3AF] hover:text-[#111827]"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {errorMsg && (
                                <div className="mb-4 text-sm text-[#B91C1C] bg-[#FEE2E2] p-3 rounded-lg border border-[#FCA5A5] flex gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="logoForm" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-[#374151] mb-1.5">Organization Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]"
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-[#374151] mb-1.5">Category *</label>
                                        <input
                                            required
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]"
                                            placeholder="e.g. Client, Partner, Featured"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#374151] mb-1.5">Placement Target *</label>
                                        <select
                                            value={placementType}
                                            onChange={e => setPlacementType(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]"
                                        >
                                            <option value="CLIENT">Client Marquee</option>
                                            <option value="PARTNER">Partner Details</option>
                                            <option value="FEATURED">Featured Section</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="block text-sm text-[#374151] mb-1.5">Logo Image *</label>
                                    {logoUrl && (
                                        <div className="mb-3 p-4 bg-[#EDF5F2]/70 rounded-lg border border-gray-200 flex justify-center">
                                            <img src={logoUrl} alt="Preview" className="max-h-20 object-contain" />
                                        </div>
                                    )}
                                    <div className="flex gap-4">
                                        <input
                                            required={!logoUrl}
                                            value={logoUrl}
                                            onChange={e => setLogoUrl(e.target.value)}
                                            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]"
                                            placeholder="URL..."
                                        />
                                        <label className={`cursor-pointer shrink-0 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                            <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload'}
                                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2]'}`}></div>
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

                        <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-[#EDF5F2]/70">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-[#6B7280] hover:bg-[#EDF5F2]/70 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="logoForm" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg transition-colors disabled:opacity-50 font-medium">
                                {isSaving ? 'Saving...' : (editingId ? 'Update Logo' : 'Add Logo')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
