'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, X, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';

const COLOR_OPTIONS = {
    'Gray': 'bg-gray-50 text-gray-600 border-gray-200',
    'Blue': 'bg-blue-50 text-blue-700 border-blue-100',
    'Purple': 'bg-purple-50 text-purple-700 border-purple-100',
    'Green': 'bg-green-50 text-green-700 border-green-100',
    'Amber': 'bg-amber-50 text-amber-700 border-amber-100',
    'Indigo': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'Rose': 'bg-rose-50 text-rose-700 border-rose-100'
};

const ICON_OPTIONS = [
    'Building2',
    'Sparkles',
    'Lightbulb',
    'Target',
    'HeartPulse',
    'Sprout',
    'Blocks',
    'Monitor',
    'LayoutDashboard',
    'Box'
];

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
    const [sortOrder, setSortOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [tags, setTags] = useState<any[]>([]);

    // Tag Builder states
    const [tagLabel, setTagLabel] = useState('');
    const [tagIcon, setTagIcon] = useState(ICON_OPTIONS[0]);
    const [tagColor, setTagColor] = useState(Object.values(COLOR_OPTIONS)[0]);

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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
            setSortOrder(proj.sortOrder);
            setIsActive(proj.isActive);
            setTags(Array.isArray(proj.tags) ? proj.tags : []);
        } else {
            setEditingId(null);
            setTitle('');
            setCategory('');
            setBadge('');
            setDescription('');
            setImageUrl('');
            setSortOrder(0);
            setIsActive(true);
            setTags([]);
        }

        // Reset tag builder
        setTagLabel('');
        setTagIcon(ICON_OPTIONS[0]);
        setTagColor(Object.values(COLOR_OPTIONS)[0]);

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

    const handleAddTag = () => {
        if (!tagLabel.trim()) return;
        setTags([...tags, {
            label: tagLabel.trim(),
            icon: tagIcon,
            colorClass: tagColor
        }]);
        setTagLabel('');
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');

        const payload = {
            title,
            category,
            badge: badge.trim() ? badge : null,
            description,
            imageUrl: imageUrl.trim() ? imageUrl : null,
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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-12 pt-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Student Projects</h2>
                    <p className="text-white/60">Manage student projects displayed in the Academics section.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-white/80 whitespace-nowrap">
                    <thead className="bg-white/5 border-b border-white/10 text-white">
                        <tr>
                            <th className="p-4 font-medium">Image</th>
                            <th className="p-4 font-medium">Title</th>
                            <th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Order</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {projects.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-white/40">No student projects found.</td>
                            </tr>
                        ) : (
                            projects.map(proj => (
                                <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        {proj.imageUrl ? (
                                            <div className="w-16 h-10 bg-white/10 rounded overflow-hidden flex items-center justify-center">
                                                <img src={proj.imageUrl} alt={proj.title} className="max-w-full max-h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-10 bg-white/5 rounded flex items-center justify-center text-[10px] text-white/40">N/A</div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium">{proj.title}</td>
                                    <td className="p-4 text-white/60">{proj.category}</td>
                                    <td className="p-4 text-white/60">{proj.sortOrder}</td>
                                    <td className="p-4">
                                        {proj.isActive ? (
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
                                        <button onClick={() => handleOpenModal(proj)} className="text-white/40 hover:text-white p-2 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(proj.id)} className="text-red-500/50 hover:text-red-500 p-2 transition-colors">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
                    <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
                        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
                            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Student Project' : 'Add Student Project'}</h3>
                            <button onClick={handleCloseModal} className="text-white/40 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
                            {errorMsg && (
                                <div className="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm flex gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}
                                </div>
                            )}

                            <form id="projForm" onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">Project Title *</label>
                                        <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">Category *</label>
                                        <input required type="text" value={category} placeholder="e.g. Data Visualization" onChange={e => setCategory(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">Badge Text</label>
                                        <input type="text" value={badge} placeholder="e.g. Industry Project" onChange={e => setBadge(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/80 mb-2">Sort Order</label>
                                        <input type="number" required value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">Description *</label>
                                    <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--color-primary)]"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">Project Image</label>
                                    <div className="flex gap-4 items-center">
                                        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="/uploads/... or https://..." className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                                        <label className={`cursor-pointer shrink-0 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                            <Upload className="w-4 h-4" /> {isUploading ? '...' : 'Upload Image'}
                                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={isUploading} />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/80 mb-2">Project Tags</label>
                                    <div className="bg-black/50 border border-white/10 rounded-lg p-4">
                                        {/* Existing tags display */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {tags.length === 0 ? (
                                                <span className="text-white/30 text-xs italic">No tags added yet.</span>
                                            ) : (
                                                tags.map((t, idx) => (
                                                    <div key={idx} className="bg-white/5 border border-white/10 rounded-md py-1 px-2.5 text-xs text-white/80 flex items-center gap-2">
                                                        <span>{t.icon}</span>
                                                        <span>{t.label}</span>
                                                        <button type="button" onClick={() => handleRemoveTag(idx)} className="text-red-400 hover:text-red-300 ml-1">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Tag Builder UI */}
                                        <div className="flex gap-2 items-end pt-3 border-t border-white/10">
                                            <div className="flex-1">
                                                <input type="text" value={tagLabel} onChange={e => setTagLabel(e.target.value)} placeholder="Tag Label (e.g. Automation)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]" />
                                            </div>
                                            <div className="w-32">
                                                <select title="Icon" value={tagIcon} onChange={e => setTagIcon(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]">
                                                    {ICON_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-32">
                                                <select title="Color" value={tagColor} onChange={e => setTagColor(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-primary)]">
                                                    {Object.entries(COLOR_OPTIONS).map(([name, cls]) => (
                                                        <option key={name} value={cls}>{name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button type="button" onClick={handleAddTag} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors font-medium flex items-center shrink-0">
                                                <Plus className="w-4 h-4 mr-1" /> Add
                                            </button>
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
                                        <span className="text-sm font-medium text-white/80">Active Configuration</span>
                                    </label>
                                </div>
                            </form>
                        </div>

                        <div className="p-5 border-t border-white/10 bg-black/30 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 font-medium transition-colors">Cancel</button>
                            <button form="projForm" type="submit" disabled={isSaving} className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Project'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
