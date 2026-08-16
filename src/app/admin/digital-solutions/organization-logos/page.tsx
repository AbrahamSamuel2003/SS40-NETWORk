'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DigitalSolutionsLogosPage() {
    const router = useRouter();
    const [logos, setLogos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Client');
    const [placementType, setPlacementType] = useState('CLIENT');
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
            const res = await fetch('/api/admin/organization-logos?isActive=all&pageScope=DIGITAL_SOLUTIONS');
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
            pageScope: 'DIGITAL_SOLUTIONS'
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
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Digital Solutions Logos</h2>
                    <p className="text-[#6B7280]">Manage logos for the Digital Solutions "Trusted Clients" section.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Logo
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                <table className="w-full text-left text-sm text-[#374151]">
                    <thead className="bg-[#EDF5F2]/70 border-b border-gray-200 text-[#111827]">
                        <tr>
                            <th className="p-4 font-medium">Logo</th>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Category / Type</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logos.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-[#9CA3AF]">No logos found for Digital Solutions.</td>
                            </tr>
                        ) : (
                            logos.map(logo => (
                                <tr key={logo.id} className="hover:bg-[#EDF5F2]/50 transition-colors">
                                    <td className="p-4">
                                        {logo.logoUrl ? (
                                            <div className="w-12 h-12 bg-[#EDF5F2] rounded overflow-hidden flex items-center justify-center">
                                                <img src={logo.logoUrl} alt={logo.name} className="max-w-full max-h-full object-contain p-1" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-[#EDF5F2]/70 rounded flex items-center justify-center text-xs text-[#9CA3AF]">N/A</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium">{logo.name}</td>
                                    <td className="p-4 text-[#6B7280]">{logo.category} <span className="opacity-50">· {logo.placementType}</span></td>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
                    <div className="admin-card w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-[#111827]">{editingId ? 'Edit Logo' : 'Add Logo'}</h3>
                            <button onClick={handleCloseModal} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto">
                            {errorMsg && (
                                <div className="mb-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] p-3 rounded-lg text-sm flex gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="logoForm" onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Name *</label>
                                    <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6B9F91]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Category *</label>
                                        <input required type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Icon/Type *</label>
                                        <select value={placementType} onChange={e => setPlacementType(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]">
                                            <option value="CLIENT">CLIENT</option>
                                            <option value="BRAND">BRAND</option>
                                            <option value="UNIVERSITY">UNIVERSITY</option>
                                            <option value="PARTNER">PARTNER</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Logo Media</label>
                                    <div className="flex gap-4 items-center">
                                        <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="/uploads/... or https://..." className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] text-sm focus:outline-none focus:border-[#6B9F91]" />
                                        <label className={`cursor-pointer shrink-0 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                            <Upload className="w-4 h-4" /> {isUploading ? '...' : 'Upload'}
                                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2] group-hover:bg-[#EDF5F2]'}`}></div>
                                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-sm font-medium text-[#374151]">Active Configuration</span>
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

                        <div className="p-5 border-t border-gray-200 bg-[#EDF5F2]/70 flex justify-end gap-3">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#EDF5F2]/70 font-medium transition-colors">Cancel</button>
                            <button form="logoForm" type="submit" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Logo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
