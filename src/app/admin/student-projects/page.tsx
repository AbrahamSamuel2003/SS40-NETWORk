'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon, Star, ExternalLink, Globe } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';
import { SectionVisibilityToggle } from '@/components/admin/SectionVisibilityToggle';

export default function StudentProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [badge, setBadge] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [isFeatured, setIsFeatured] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/student-projects?isActive=all');
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

    const handleOpenModal = (proj?: any) => {
        if (proj) {
            setEditingId(proj.id);
            setTitle(proj.title);
            setCategory(proj.category);
            setBadge(proj.badge || '');
            setDescription(proj.description || '');
            setImageUrl(proj.imageUrl || '');
            setProjectUrl(proj.projectUrl || '');
            const rawTags = Array.isArray(proj.tags) ? proj.tags : [];
            setTagsInput(rawTags.map((t: any) => typeof t === 'string' ? t : t.label).join(', '));
            setSortOrder(proj.sortOrder);
            setIsFeatured(proj.isFeatured || false);
            setIsActive(proj.isActive);
        } else {
            setEditingId(null);
            setTitle('');
            setCategory('');
            setBadge('');
            setDescription('');
            setImageUrl('');
            setProjectUrl('');
            setTagsInput('');
            setSortOrder(0);
            setIsFeatured(false);
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
            const file = await compressImageFile(rawFile);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pageScope', 'STUDENT_PROJECTS');

            const res = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData
            });
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
            category,
            badge: badge.trim() ? badge : null,
            description,
            imageUrl: imageUrl.trim() ? imageUrl : null,
            projectUrl: projectUrl.trim() ? projectUrl : null,
            sortOrder: Number(sortOrder),
            isFeatured,
            isActive,
            tags
        };

        try {
            const url = editingId
                ? `/api/admin/student-projects/${editingId}`
                : '/api/admin/student-projects';

            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchProjects();
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
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            const res = await fetch(`/api/admin/student-projects/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchProjects();
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
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Student Projects</h1>
                    <p className="text-sm text-[#475569] mt-0.5">Manage student capstone &amp; industry projects displayed in Academics.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <SectionVisibilityToggle
                        sectionKey="academics_studentProjects"
                        sectionLabel="Student Projects"
                    />
                    <button
                        onClick={() => handleOpenModal()}
                        className="admin-button-primary"
                    >
                        <Plus className="w-4 h-4" /> Add Project
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                {/* Mobile Cards: 2-Column Grid */}
                <div className="sm:hidden p-2.5">
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-sm text-[#64748B]">No student projects found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {projects.map(proj => (
                                <div key={proj.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                    <div className="space-y-1.5">
                                        {proj.imageUrl ? (
                                            <div className="w-full h-20 rounded-lg bg-slate-50 border border-[#E2E8F0] overflow-hidden relative flex items-center justify-center">
                                                <img src={proj.imageUrl} alt="" className="w-full h-full object-cover" />
                                                {proj.isFeatured && (
                                                    <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 bg-amber-50/90 backdrop-blur-xs text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-16 rounded-lg bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30 flex items-center justify-center font-bold text-sm">
                                                {proj.title.charAt(0)}
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center justify-between gap-1">
                                                <h3 className="font-bold text-xs text-[#0F172A] leading-tight truncate" title={proj.title}>
                                                    {proj.title}
                                                </h3>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold shrink-0 ${proj.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                    {proj.isActive ? 'Active' : 'Draft'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-[#64748B] truncate mt-0.5">{proj.category}</p>
                                        </div>

                                        <p className="text-[10px] text-[#334151] line-clamp-2 leading-relaxed">{proj.description}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                                        {proj.projectUrl ? (
                                            <a
                                                href={proj.projectUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 bg-gray-50 hover:bg-[#EDF5F2] text-[#0F766E] rounded-lg border border-gray-200 transition-colors flex items-center justify-center"
                                                title="Project Link"
                                            >
                                                <Globe className="w-3.5 h-3.5" />
                                            </a>
                                        ) : <div />}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenModal(proj)}
                                                className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(proj.id)}
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
                                <th>Project Title</th>
                                <th>Category &amp; Tags</th>
                                <th className="text-center">Order</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-[#64748B]">No student projects found.</td>
                                </tr>
                            ) : (
                                projects.map(proj => (
                                    <tr key={proj.id}>
                                        <td>
                                            {proj.imageUrl ? (
                                                <div className="w-12 h-12 bg-slate-100 border border-[#E2E8F0] rounded-lg overflow-hidden">
                                                    <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30 rounded-lg flex items-center justify-center font-bold">
                                                    {proj.title.charAt(0)}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="font-semibold text-sm text-[#0F172A]">{proj.title}</div>
                                            <div className="text-xs text-[#64748B] line-clamp-1 max-w-xs">{proj.description}</div>
                                            {proj.projectUrl && (
                                                <a href={proj.projectUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#0F766E] hover:underline inline-flex items-center gap-1 mt-1">
                                                    <ExternalLink className="w-3 h-3" /> {proj.projectUrl}
                                                </a>
                                            )}
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold text-[#0F172A] mb-1">{proj.category}</div>
                                            <div className="flex flex-wrap gap-1">
                                                {proj.badge && (
                                                    <span className="text-[10px] bg-[#EDF5F2] text-[#0F766E] px-1.5 py-0.5 rounded font-medium">
                                                        {proj.badge}
                                                    </span>
                                                )}
                                                {Array.isArray(proj.tags) && proj.tags.slice(0, 2).map((tag: any, i: number) => {
                                                    const label = typeof tag === 'string' ? tag : tag.label;
                                                    return (
                                                        <span key={i} className="text-[10px] bg-slate-100 text-[#475569] px-1.5 py-0.5 rounded font-medium">
                                                            {label}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="text-center text-xs text-[#64748B] font-mono">{proj.sortOrder}</td>
                                        <td className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${proj.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                    <CheckCircle2 className="w-3 h-3" /> {proj.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                {proj.isFeatured && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenModal(proj)}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-[#334151] hover:text-[#0F766E] hover:bg-[#EDF5F2] rounded-md transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(proj.id)}
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
                    <div className="admin-modal-panel max-w-2xl">
                        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAF9]">
                            <div>
                                <h3 className="text-base font-bold text-[#0F172A]">{editingId ? 'Edit Student Project' : 'Add Student Project'}</h3>
                                <p className="text-xs text-[#64748B]">Academics student capstone showcase</p>
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

                            <form id="projForm" onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Project Title *</label>
                                        <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="admin-input" placeholder="e.g. Smart Agri Sensor System" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Category *</label>
                                        <input required type="text" value={category} placeholder="e.g. IoT, AI / ML, Full Stack" onChange={e => setCategory(e.target.value)} className="admin-input" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Badge Text (optional)</label>
                                        <input type="text" value={badge} placeholder="e.g. Industry Capstone, Winner" onChange={e => setBadge(e.target.value)} className="admin-input" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Sort Order</label>
                                        <input type="number" required value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="admin-input" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Description *</label>
                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="admin-input resize-none" placeholder="Project outcome, tech stack used and team highlights..."></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Project Image</label>
                                    <div className="flex flex-col gap-2.5">
                                        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="URL or select from Media library..." className="admin-input text-xs" />
                                        
                                        {imageUrl && (
                                            <div className="relative w-full max-w-sm aspect-video bg-slate-50 rounded-lg overflow-hidden border border-[#E2E8F0]">
                                                <img src={imageUrl} alt="Image Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-slate-500 hover:text-rose-600 shadow-sm">
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
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Project URL / Repository (optional)</label>
                                    <input
                                        type="url"
                                        value={projectUrl}
                                        onChange={e => setProjectUrl(e.target.value)}
                                        placeholder="https://github.com/..."
                                        className="admin-input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Tags (Comma-separated)</label>
                                    <input
                                        type="text"
                                        value={tagsInput}
                                        onChange={e => setTagsInput(e.target.value)}
                                        placeholder="e.g. Python, TensorFlow, React, FastAPI"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="pt-3 flex flex-wrap gap-5 border-t border-[#E2E8F0]">
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isActive ? 'bg-[#0F766E]' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Active Configuration</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isFeatured ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Featured (Prominent Card)</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAF9] flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-secondary justify-center">Cancel</button>
                            <button form="projForm" type="submit" disabled={isSaving} className="admin-button-primary justify-center disabled:opacity-50">
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
