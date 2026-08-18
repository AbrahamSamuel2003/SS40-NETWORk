'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';

export default function StudentProjectsPage() {
    const router = useRouter();
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
        } catch (e) {
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
            // Support both old object-array tags and new string-array tags
            const rawTags = Array.isArray(proj.tags) ? proj.tags : [];
            setTagsInput(rawTags.map((t: any) => typeof t === 'string' ? t : t.label).join(', '));
            setSortOrder(proj.sortOrder);
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
        } catch (err) {
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
        <div className="max-w-6xl mx-auto pb-12 pt-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Student Projects</h2>
                    <p className="text-[#6B7280]">Manage student projects displayed in the Academics section.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                {/* ── MOBILE CARD GRID (hidden on sm+) ── */}
                <div className="sm:hidden">
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-[#9CA3AF]">No student projects found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-3">
                            {projects.map(proj => (
                                <div key={proj.id} className="admin-card p-3 flex flex-col gap-2 rounded-xl">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold text-[#111827] text-sm leading-tight line-clamp-2">{proj.title}</span>
                                        <button onClick={() => handleOpenModal(proj)} className="shrink-0 p-1 text-[#9CA3AF] hover:text-[#111827]">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[#6B7280] text-xs leading-snug line-clamp-1">{proj.category}</p>
                                    <div className="mt-auto pt-1 flex items-center justify-between">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${proj.isActive ? 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20' : 'bg-[#EDF5F2]/70 text-[#9CA3AF]'}`}>• {proj.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
                                        <button onClick={() => handleDelete(proj.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-1">
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
                                <th className="p-4 font-medium min-w-[100px] hidden sm:table-cell">Image</th>
                                <th className="p-4 font-medium min-w-[150px]">Title</th>
                                <th className="p-4 font-medium min-w-[120px] hidden sm:table-cell">Category</th>
                                <th className="p-4 font-medium min-w-[80px] hidden md:table-cell">Order</th>
                                <th className="p-4 font-medium min-w-[100px]">Status</th>
                                <th className="p-4 font-medium text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[#9CA3AF]">No student projects found.</td>
                                </tr>
                            ) : (
                                projects.map(proj => (
                                    <tr key={proj.id} className="hover:bg-[#EDF5F2]/50 transition-colors">
                                        <td className="p-4 hidden sm:table-cell">
                                            {proj.imageUrl ? (
                                                <div className="w-16 h-10 bg-[#EDF5F2] rounded overflow-hidden flex items-center justify-center">
                                                    <img src={proj.imageUrl} alt={proj.title} className="max-w-full max-h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-10 bg-[#EDF5F2]/70 rounded flex items-center justify-center text-[10px] text-[#9CA3AF]">N/A</div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium">{proj.title}</td>
                                        <td className="p-4 text-[#6B7280] hidden sm:table-cell">{proj.category}</td>
                                        <td className="p-4 text-[#6B7280] hidden md:table-cell">{proj.sortOrder}</td>
                                        <td className="p-4">
                                            {proj.isActive ? (
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
                                                <button onClick={() => handleOpenModal(proj)} className="px-3 py-1 rounded border border-gray-300 text-[#374151] text-xs font-medium hover:bg-[#EDF5F2]/70 hover:border-[#6B9F91] transition-colors whitespace-nowrap">Edit</button>
                                                <button onClick={() => handleDelete(proj.id)} className="px-3 py-1 rounded border border-[#FCA5A5] text-[#B91C1C] text-xs font-medium hover:bg-red-50 transition-colors whitespace-nowrap">Delete</button>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm overflow-hidden">
                    <div className="admin-card w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
                        <div className="p-5 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-[#111827]">{editingId ? 'Edit Student Project' : 'Add Student Project'}</h3>
                            <button onClick={handleCloseModal} className="text-[#9CA3AF] hover:text-[#111827] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                            {errorMsg && (
                                <div className="mb-4 bg-[#FEE2E2] border border-[#FCA5A5] text-[#B91C1C] p-3 rounded-lg text-sm flex gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="projForm" onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Project Title *</label>
                                        <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Category *</label>
                                        <input required type="text" value={category} placeholder="e.g. Data Visualization" onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Badge Text</label>
                                        <input type="text" value={badge} placeholder="e.g. Industry Project" onChange={e => setBadge(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-2">Sort Order</label>
                                        <input type="number" required value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Description *</label>
                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] focus:outline-none focus:border-[#6B9F91]"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Project Image</label>
                                    <div className="flex flex-col gap-3">
                                        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="/uploads/... or https://..." className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] text-sm focus:outline-none focus:border-[#6B9F91]" />
                                        
                                        {imageUrl && (
                                            <div className="relative w-full max-w-sm aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group">
                                                <img src={imageUrl} alt="Image Preview" className="w-full h-full object-contain" />
                                                <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 shadow-sm">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        
                                        <div className="flex flex-wrap gap-3">
                                            <label className={`cursor-pointer bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload Local File'}
                                                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                            </label>
                                            <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className="cursor-pointer bg-[#EDF5F2]/70 hover:bg-[#EDF5F2] text-[#111827] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-[#6B9F91]" /> Select from Media
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Project URL (optional)</label>
                                    <input
                                        type="url"
                                        value={projectUrl}
                                        onChange={e => setProjectUrl(e.target.value)}
                                        placeholder="https://github.com/student/project"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6B9F91]"
                                    />
                                    <p className="text-xs text-[#9CA3AF] mt-1">This URL is used for the &quot;Explore Project&quot; button on the frontend.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-2">Project Tags</label>
                                    <input
                                        type="text"
                                        value={tagsInput}
                                        onChange={e => setTagsInput(e.target.value)}
                                        placeholder="e.g. React, Node.js, AI, Data Analysis"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#6B9F91]"
                                    />
                                    <p className="text-xs text-[#9CA3AF] mt-1">Comma-separated. e.g. &quot;Python, Machine Learning, Flask&quot;</p>
                                    {tagsInput && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {tagsInput.split(',').map(t => t.trim()).filter(t => t).map((tag, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EDF5F2] border border-[#6B9F91]/20 rounded-lg text-xs font-semibold text-[#0F766E]">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
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
                            </form>
                        </div>

                        <div className="p-5 border-t border-gray-200 bg-[#EDF5F2]/70 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#EDF5F2]/70 font-medium transition-colors">Cancel</button>
                            <button form="projForm" type="submit" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
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
