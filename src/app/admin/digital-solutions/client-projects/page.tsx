'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Upload, X } from 'lucide-react';

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
    const [isActive, setIsActive] = useState(true);

    // New fields
    const [imageUrl, setImageUrl] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [caseStudy, setCaseStudy] = useState('');

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
        const file = e.target.files[0];

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
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

    if (isLoading) return <div className="p-12 text-center text-white"><div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-white"></div></div>;

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Client Projects</h2>
                    <p className="text-white/60">Manage digital solution projects and their case studies.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-white/80">
                    <thead className="bg-white/5 border-b border-white/10 text-white">
                        <tr>
                            <th className="p-4 font-medium">Image</th>
                            <th className="p-4 font-medium">Project</th>
                            <th className="p-4 font-medium">Industry / Tags</th>
                            <th className="p-4 font-medium text-center">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {projects.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-white/40">No projects found.</td></tr>
                        ) : (
                            projects.map(item => (
                                <tr key={item.id} className="hover:bg-white/[0.02]">
                                    <td className="p-4 w-20">
                                        {item.imageUrl ? (
                                            <div className="w-12 h-12 rounded overflow-hidden shrink-0"><img src={item.imageUrl} alt="" className="w-full h-full object-cover" /></div>
                                        ) : (
                                            <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center shrink-0 uppercase font-bold text-white/40">{item.title.charAt(0)}</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium">
                                        <div className="text-white">{item.title}</div>
                                        <div className="text-white/40 text-xs truncate max-w-xs">{item.description}</div>
                                        {item.projectUrl && (
                                            <div className="mt-1">
                                                <a href={item.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">{item.projectUrl}</a>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white text-xs mb-1">{item.industry}</div>
                                        <div className="flex flex-wrap gap-1">
                                            {Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">{tag}</span>
                                            ))}
                                            {Array.isArray(item.tags) && item.tags.length > 3 && (
                                                <span className="text-[10px] text-white/40">+{item.tags.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${item.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleOpenModal(item)} className="text-white/40 hover:text-white p-2 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-500/50 hover:text-red-500 p-2 transition-colors">
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
                    <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Project' : 'Add Project'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full custom-scrollbar">
                            {errorMsg && <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/50 flex gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}</div>}

                            <form id="projectForm" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm text-white/80 mb-1.5">Project Title *</label><input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" /></div>
                                    <div><label className="block text-sm text-white/80 mb-1.5">Industry *</label><input required value={industry} onChange={e => setIndustry(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" /></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm text-white/80 mb-1.5">Tags (comma separated) *</label><input required value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="React, Node.js, Next.js..." /></div>
                                    <div><label className="block text-sm text-white/80 mb-1.5">Status (optional)</label><input value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="e.g. Completed, Ongoing" /></div>
                                </div>

                                <div><label className="block text-sm text-white/80 mb-1.5">Short Description *</label><textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white resize-none" placeholder="Brief summary for the project card..." /></div>

                                <div>
                                    <label className="block text-sm text-white/80 mb-1.5">Project Image (Media Library)</label>
                                    <div className="flex gap-4">
                                        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white" placeholder="URL..." />
                                        <label className={`cursor-pointer shrink-0 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                            <Upload className="w-4 h-4" /> Upload
                                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/80 mb-1.5">Live Project URL</label>
                                    <input value={projectUrl} onChange={e => setProjectUrl(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/20" placeholder="https://" />
                                </div>

                                <div>
                                    <label className="block text-sm text-white/80 mb-1.5">Case Study Content</label>
                                    <textarea rows={8} value={caseStudy} onChange={e => setCaseStudy(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white resize-y" placeholder="Detailed case study breakdown..." />
                                </div>

                                <div className="pt-2 flex flex-wrap gap-6 border-t border-white/5 mt-4">
                                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                        <div className="relative"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" /><div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`}></div><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                        <span className="text-sm font-medium text-white/80">Active</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                        <div className="relative"><input type="checkbox" checked={isConfidential} onChange={e => setIsConfidential(e.target.checked)} className="sr-only" /><div className={`w-10 h-6 rounded-full transition-colors ${isConfidential ? 'bg-orange-500' : 'bg-white/10'}`}></div><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isConfidential ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                        <span className="text-sm font-medium text-white/80">Confidential</span>
                                    </label>
                                    <div className="flex items-center gap-3 pt-2">
                                        <span className="text-sm font-medium text-white/80">Sort Order</span>
                                        <input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} className="w-20 bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-white text-center" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-black/20">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/5">Cancel</button>
                            <button type="submit" form="projectForm" disabled={isSaving} className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50">Save Project</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
