'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';

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

    // New fields
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
            // Using isActive=all to fetch all projects for the admin dashboard
            const res = await fetch('/api/admin/client-projects?isActive=all');
            const data = await res.json();
            if (data.success) {
                setProjects(data.data);
            } else {
                setErrorMsg(data.error);
            }
        } catch (e) {
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

        // Parse tags from comma separated string
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
        } catch (err) {
            setErrorMsg('Failed to save project.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this project?')) return;
        try {
            const res = await fetch(`/api/admin/client-projects/${id}`, { method: 'DELETE' });
            if ((await res.json()).success) fetchData();
        } catch (e) {
            alert('Failed to delete');
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[#111827]"><div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-gray-200"></div></div>;

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Client Projects</h2>
                    <p className="text-[#6B7280]">Manage digital solution projects and their case studies.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                {/* ── MOBILE CARD GRID (hidden on sm+) ── */}
                <div className="sm:hidden">
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-[#9CA3AF]">No projects found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-3">
                            {projects.map(item => (
                                <div key={item.id} className="admin-card p-3 flex flex-col gap-2 rounded-xl">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold text-[#111827] text-sm leading-tight line-clamp-2">{item.title}</span>
                                        <button onClick={() => handleOpenModal(item)} className="shrink-0 p-1 text-[#9CA3AF] hover:text-[#111827]">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[#6B7280] text-xs leading-snug line-clamp-1">{item.industry}</p>
                                    <p className="text-[#9CA3AF] text-[10px] leading-snug line-clamp-2">{item.description}</p>
                                    <div className="mt-auto pt-1 flex items-center justify-between">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${item.isActive ? 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20' : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'}`}>• {item.isActive ? 'Active' : 'Inactive'}</span>
                                        <button onClick={() => handleDelete(item.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-1">
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
                                <th className="p-4 font-medium min-w-[80px] hidden sm:table-cell">Image</th>
                                <th className="p-4 font-medium min-w-[150px]">Project</th>
                                <th className="p-4 font-medium min-w-[150px] hidden sm:table-cell">Industry / Tags</th>
                                <th className="p-4 font-medium text-center min-w-[100px]">Status</th>
                                <th className="p-4 font-medium text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {projects.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-[#9CA3AF]">No projects found.</td></tr>
                            ) : (
                                projects.map(item => (
                                    <tr key={item.id} className="hover:bg-[#EDF5F2]/50">
                                        <td className="p-4 w-20 hidden sm:table-cell">
                                            {item.imageUrl ? (
                                                <div className="w-12 h-12 rounded overflow-hidden shrink-0"><img src={item.imageUrl} alt="" className="w-full h-full object-cover" /></div>
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-[#EDF5F2] flex items-center justify-center shrink-0 uppercase font-bold text-[#9CA3AF]">{item.title.charAt(0)}</div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">
                                            <div className="text-[#111827]">{item.title}</div>
                                            <div className="text-[#9CA3AF] text-xs truncate max-w-xs">{item.description}</div>
                                            {item.projectUrl && (
                                                <div className="mt-1">
                                                    <a href={item.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#6B9F91] hover:underline">{item.projectUrl}</a>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            <div className="text-[#111827] text-xs mb-1">{item.industry}</div>
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag: string, i: number) => (
                                                    <span key={i} className="text-[10px] bg-[#EDF5F2] px-1.5 py-0.5 rounded text-[#6B7280]">{tag}</span>
                                                ))}
                                                {Array.isArray(item.tags) && item.tags.length > 3 && (
                                                    <span className="text-[10px] text-[#9CA3AF]">+{item.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex flex-col gap-1 items-center">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${item.isActive ? 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20' : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                {item.isFeatured && (
                                                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFC900]/10 text-[#FFC900] border border-[#FFC900]/20">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-col xl:flex-row gap-1.5 justify-end ml-auto shrink-0">
                                                <button onClick={() => handleOpenModal(item)} className="px-3 py-1 rounded border border-gray-300 text-[#374151] text-xs font-medium hover:bg-[#EDF5F2]/70 hover:border-[#6B9F91] transition-colors whitespace-nowrap">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded border border-[#FCA5A5] text-[#B91C1C] text-xs font-medium hover:bg-red-50 transition-colors whitespace-nowrap">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
                    <div className="admin-card w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/70">
                            <h3 className="text-lg font-bold text-[#111827]">{editingId ? 'Edit Project' : 'Add Project'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#111827]"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full custom-scrollbar">
                            {errorMsg && <div className="mb-4 text-sm text-[#B91C1C] bg-[#FEE2E2] p-3 rounded-lg border border-[#FCA5A5] flex gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}</div>}

                            <form id="projectForm" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm text-[#374151] mb-1.5">Project Title *</label><input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" /></div>
                                    <div><label className="block text-sm text-[#374151] mb-1.5">Industry *</label><input required value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" /></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm text-[#374151] mb-1.5">Tags (comma separated) *</label><input required value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" placeholder="React, Node.js, Next.js..." /></div>
                                    <div><label className="block text-sm text-[#374151] mb-1.5">Status (optional)</label><input value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" placeholder="e.g. Completed, Ongoing" /></div>
                                </div>

                                <div><label className="block text-sm text-[#374151] mb-1.5">Short Description *</label><textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827] resize-none" placeholder="Brief summary for the project card..." /></div>

                                <div>
                                    <label className="block text-sm text-[#374151] mb-1.5">Project Image (Media Library)</label>
                                    <div className="flex gap-4">
                                        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" placeholder="URL..." />
                                        <label className={`cursor-pointer shrink-0 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                            <Upload className="w-4 h-4" /> Upload Local File
                                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                        </label>
                                        <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className="cursor-pointer shrink-0 bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-[#6B9F91]" /> Select from Media
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#374151] mb-1.5">Live Project URL</label>
                                    <input value={projectUrl} onChange={e => setProjectUrl(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827] placeholder:text-[#9CA3AF]" placeholder="https://" />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#374151] mb-1.5">Case Study Content</label>
                                    <textarea rows={8} value={caseStudy} onChange={e => setCaseStudy(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827] resize-y" placeholder="Detailed case study breakdown..." />
                                </div>

                                <div className="pt-2 flex flex-wrap gap-6 border-t border-gray-100 mt-4">
                                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                        <div className="relative"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" /><div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2]'}`}></div><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                        <span className="text-sm font-medium text-[#374151]">Active</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                        <div className="relative"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" /><div className={`w-10 h-6 rounded-full transition-colors ${isFeatured ? 'bg-[#FFC900]' : 'bg-[#EDF5F2]'}`}></div><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                        <span className="text-sm font-medium text-[#374151]">Featured (Big Card)</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                        <div className="relative"><input type="checkbox" checked={isConfidential} onChange={e => setIsConfidential(e.target.checked)} className="sr-only" /><div className={`w-10 h-6 rounded-full transition-colors ${isConfidential ? 'bg-[#FFC900]' : 'bg-[#EDF5F2]'}`}></div><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isConfidential ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                        <span className="text-sm font-medium text-[#374151]">Confidential</span>
                                    </label>
                                    <div className="flex items-center gap-3 pt-2">
                                        <span className="text-sm font-medium text-[#374151]">Sort Order</span>
                                        <input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1 text-[#111827] text-center" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-[#EDF5F2]/70">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-[#6B7280] hover:bg-[#EDF5F2]/70">Cancel</button>
                            <button type="submit" form="projectForm" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg disabled:opacity-50">Save Project</button>
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
