'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon, Star, ExternalLink, Globe } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';
import { SectionVisibilityToggle } from '@/components/admin/SectionVisibilityToggle';

export default function ClientProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [industry, setIndustry] = useState('');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [status, setStatus] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [isConfidential, setIsConfidential] = useState(false);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isActive, setIsActive] = useState(true);

    // Image and external links
    const [imageUrl, setImageUrl] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [caseStudy, setCaseStudy] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/client-projects?isActive=all');
            const data = await res.json();
            if (data.success) {
                setProjects(data.data);
            } else {
                setErrorMsg(data.error);
            }
        } catch {
            setErrorMsg('Failed to load projects.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: any) => {
        if (item) {
            setEditingId(item.id);
            setTitle(item.title);
            setIndustry(item.industry);
            setDescription(item.description);
            setTagsInput(Array.isArray(item.tags) ? item.tags.join(', ') : '');
            setStatus(item.status || '');
            setSortOrder(item.sortOrder || 0);
            setIsConfidential(item.isConfidential);
            setIsFeatured(item.isFeatured || false);
            setIsActive(item.isActive);
            setImageUrl(item.imageUrl || '');
            setProjectUrl(item.projectUrl || '');
            setCaseStudy(item.caseStudy || '');
        } else {
            setEditingId(null);
            setTitle('');
            setIndustry('');
            setDescription('');
            setTagsInput('');
            setStatus('');
            setSortOrder(0);
            setIsConfidential(false);
            setIsFeatured(false);
            setIsActive(true);
            setImageUrl('');
            setProjectUrl('');
            setCaseStudy('');
        }
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const rawFile = e.target.files[0];

        setIsUploading(true);
        try {
            const file = await compressImageFile(rawFile);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pageScope', 'DIGITAL_SOLUTIONS_PROJECTS');
            const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setImageUrl(data.data.url);
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

        const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');

        const payload = {
            title,
            industry,
            description,
            tags,
            status,
            sortOrder,
            isConfidential,
            isFeatured,
            isActive,
            imageUrl,
            projectUrl,
            caseStudy
        };

        try {
            const url = editingId ? `/api/admin/client-projects/${editingId}` : '/api/admin/client-projects';
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
            setErrorMsg('Failed to save project.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            const res = await fetch(`/api/admin/client-projects/${id}`, { method: 'DELETE' });
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Client Projects</h1>
                    <p className="text-sm text-[#475569] mt-0.5">Enterprise engineering showcases and client case studies.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <SectionVisibilityToggle
                        sectionKey="digitalSolutions_projects"
                        sectionLabel="Client Projects"
                    />
                    <button
                        onClick={() => handleOpenModal()}
                        className="admin-button-primary"
                    >
                        <Plus className="w-4 h-4" /> Add Project
                    </button>
                </div>
            </div>

            {/* Content List / Table */}
            <div className="admin-card overflow-hidden">
                {/* Mobile Cards: 2-Column Grid */}
                <div className="sm:hidden p-2.5">
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-sm text-[#64748B]">No client projects configured yet.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {projects.map(item => (
                                <div key={item.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                    <div className="space-y-1.5">
                                        {item.imageUrl ? (
                                            <div className="w-full h-20 rounded-lg bg-slate-50 border border-gray-100 overflow-hidden relative flex items-center justify-center">
                                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                                {item.isFeatured && (
                                                    <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 bg-amber-50/90 backdrop-blur-xs text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-16 rounded-lg bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30 flex items-center justify-center font-bold text-sm">
                                                {item.title.charAt(0)}
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center justify-between gap-1">
                                                <h3 className="font-bold text-xs text-[#0F172A] leading-tight truncate" title={item.title}>
                                                    {item.title}
                                                </h3>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0 ${item.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                    {item.isActive ? 'Active' : 'Draft'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-[#64748B] truncate mt-0.5">{item.industry}</p>
                                        </div>

                                        <p className="text-[10px] text-[#334151] line-clamp-2 leading-relaxed">{item.description}</p>

                                        <div className="flex flex-wrap gap-1 pt-0.5">
                                            {item.isConfidential && (
                                                <span className="inline-flex text-[9px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-1 py-0.2 rounded">
                                                    Confidential
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                                        {item.projectUrl ? (
                                            <a
                                                href={item.projectUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 bg-gray-50 hover:bg-[#EDF5F2] text-[#0F766E] rounded-lg border border-gray-200 transition-colors flex items-center justify-center"
                                                title="Preview Link"
                                            >
                                                <Globe className="w-3.5 h-3.5" />
                                            </a>
                                        ) : <div />}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors flex items-center justify-center"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
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
                                <th className="w-16">Preview</th>
                                <th>Project &amp; Summary</th>
                                <th>Industry / Tags</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-[#64748B]">No client projects found.</td>
                                </tr>
                            ) : (
                                projects.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.imageUrl ? (
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-[#E2E8F0] overflow-hidden">
                                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30 flex items-center justify-center font-bold">
                                                    {item.title.charAt(0)}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="font-semibold text-sm text-[#0F172A]">{item.title}</div>
                                            <div className="text-xs text-[#64748B] line-clamp-1 max-w-sm mt-0.5">{item.description}</div>
                                            {item.projectUrl && (
                                                <a href={item.projectUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#0F766E] hover:underline inline-flex items-center gap-1 mt-1">
                                                    <ExternalLink className="w-3 h-3" /> {item.projectUrl}
                                                </a>
                                            )}
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold text-[#0F172A] mb-1">{item.industry}</div>
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag: string, i: number) => (
                                                    <span key={i} className="text-[10px] bg-slate-100 text-[#475569] px-2 py-0.5 rounded font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {Array.isArray(item.tags) && item.tags.length > 3 && (
                                                    <span className="text-[10px] text-[#64748B]">+{item.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${item.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                    <CheckCircle2 className="w-3 h-3" /> {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                {item.isFeatured && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                                                    </span>
                                                )}
                                            </div>
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
                    <div className="admin-modal-panel max-w-3xl">
                        <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAF9]">
                            <div>
                                <h3 className="text-base font-bold text-[#0F172A]">{editingId ? 'Edit Client Project' : 'Add Client Project'}</h3>
                                <p className="text-xs text-[#64748B]">Digital solutions enterprise showcase configuration</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-130px)] custom-scrollbar">
                            {errorMsg && (
                                <div className="mb-4 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="projectForm" onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Project Title *</label>
                                        <input required value={title} onChange={e => setTitle(e.target.value)} className="admin-input" placeholder="e.g. Apex Health CRM" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Industry *</label>
                                        <input required value={industry} onChange={e => setIndustry(e.target.value)} className="admin-input" placeholder="e.g. Healthcare, Fintech" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Tags (comma separated) *</label>
                                        <input required value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="admin-input" placeholder="React, Node.js, Next.js..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Delivery Status (optional)</label>
                                        <input value={status} onChange={e => setStatus(e.target.value)} className="admin-input" placeholder="e.g. Live Production, Q3 Release" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Short Description *</label>
                                    <textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} className="admin-input resize-none" placeholder="Brief summary for the digital solutions showcase card..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Project Visual Asset</label>
                                    <div className="flex flex-col gap-2.5">
                                        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="admin-input text-xs" placeholder="URL or select from Media library..." />
                                        
                                        {imageUrl && (
                                            <div className="relative w-full max-w-xs aspect-video bg-slate-50 rounded-lg overflow-hidden border border-[#E2E8F0]">
                                                <img src={imageUrl} alt="Project Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setImageUrl('')} className="absolute top-1.5 right-1.5 bg-white/90 p-1 rounded-full text-slate-500 hover:text-rose-600 shadow-sm" title="Remove image">
                                                    <X className="w-3.5 h-3.5" />
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
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Live Production URL</label>
                                    <input value={projectUrl} onChange={e => setProjectUrl(e.target.value)} className="admin-input" placeholder="https://..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Case Study Breakdown (Markdown / Full Details)</label>
                                    <textarea rows={6} value={caseStudy} onChange={e => setCaseStudy(e.target.value)} className="admin-input resize-y" placeholder="Detailed architectural breakdown, milestones, impact..." />
                                </div>

                                <div className="pt-3 flex flex-wrap gap-5 border-t border-[#E2E8F0]">
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isActive ? 'bg-[#0F766E]' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Active in Catalog</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isFeatured ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Featured Showcase</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isConfidential} onChange={e => setIsConfidential(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isConfidential ? 'bg-purple-600' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isConfidential ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">NDA / Confidential Badge</span>
                                    </label>
                                    <div className="flex items-center gap-2 ml-auto">
                                        <span className="text-xs font-semibold text-[#334151]">Sort Order</span>
                                        <input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} className="w-16 admin-input py-1 text-center" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAF9] flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-secondary justify-center">Cancel</button>
                            <button type="submit" form="projectForm" disabled={isSaving} className="admin-button-primary justify-center disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isMediaSelectorOpen && (
                <MediaSelectorModal
                    onClose={() => setIsMediaSelectorOpen(false)}
                    onSelect={(url) => {
                        setImageUrl(url);
                        setIsMediaSelectorOpen(false);
                    }}
                />
            )}
        </div>
    );
}
