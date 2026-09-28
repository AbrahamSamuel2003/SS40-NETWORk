'use client';

import React, { useState, useEffect } from 'react';
import { compressImageFile } from '@/utils/imageCompressor';
import {
    Plus,
    Edit2,
    Trash2,
    AlertCircle,
    X,
    ExternalLink,
    Upload,
    Image as ImageIcon,
    ArrowLeft,
    ArrowRight,
    Calendar,
    MapPin,
    Search,
    Building2,
    Handshake,
    Factory,
    Briefcase,
    PartyPopper,
    Trophy,
    Rocket,
    Video,
    Megaphone,
    Users,
    Star
} from 'lucide-react';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';
import { SectionVisibilityToggle } from '@/components/admin/SectionVisibilityToggle';

export const ACTIVITY_TYPES = [
    { value: 'GOVERNMENT_OFFICIAL', label: 'Government / Official', icon: Building2, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { value: 'PARTNERSHIP', label: 'Partnership', icon: Handshake, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { value: 'INDUSTRY_VISIT', label: 'Industry Visit', icon: Factory, color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { value: 'MEETING', label: 'Meeting', icon: Briefcase, color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { value: 'EVENT', label: 'Event', icon: PartyPopper, color: 'bg-pink-50 text-pink-800 border-pink-200' },
    { value: 'ACHIEVEMENT', label: 'Achievement', icon: Trophy, color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
    { value: 'FOUNDER_ACTIVITY', label: 'Founder Activity', icon: Rocket, color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { value: 'WEBINAR', label: 'Webinar', icon: Video, color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
    { value: 'ANNOUNCEMENT', label: 'Announcement', icon: Megaphone, color: 'bg-orange-50 text-orange-800 border-orange-200' },
    { value: 'COMMUNITY', label: 'Community', icon: Users, color: 'bg-teal-50 text-teal-800 border-teal-200' },
] as const;

export function getActivityTypeMeta(type: string) {
    return ACTIVITY_TYPES.find(t => t.value === type) || ACTIVITY_TYPES[0];
}

interface ImageItem {
    url: string;
    caption?: string;
    altText?: string;
}

export default function ManagedActivitiesPage() {
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Filter & Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

    // Form states
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [activityType, setActivityType] = useState('MEETING');
    const [location, setLocation] = useState('');
    const [activityDate, setActivityDate] = useState(new Date().toISOString().split('T')[0]);
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [externalLink, setExternalLink] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [showOnHome, setShowOnHome] = useState(true);
    const [isActive, setIsActive] = useState(true);
    const [sortOrder, setSortOrder] = useState(0);

    // Multi-Image States (Max 5)
    const [images, setImages] = useState<ImageItem[]>([]);
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Live preview active image index
    const [previewImgIdx, setPreviewImgIdx] = useState(0);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch('/api/admin/activities');
            const data = await res.json();
            if (data.success) {
                setActivities(data.data);
            } else {
                setErrorMsg(data.error || 'Failed to load activities');
            }
        } catch {
            setErrorMsg('Failed to load activities');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: any) => {
        if (item) {
            setEditingId(item.id);
            setTitle(item.title || '');
            setSlug(item.slug || '');
            setActivityType(item.activityType || 'MEETING');
            setLocation(item.location || '');
            setActivityDate(item.activityDate ? new Date(item.activityDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
            setSummary(item.summary || '');
            setContent(item.content || '');
            setExternalLink(item.externalLink || '');
            setIsFeatured(item.isFeatured ?? false);
            setShowOnHome(item.showOnHome ?? true);
            setIsActive(item.isActive ?? true);
            setSortOrder(item.sortOrder || 0);

            // Images
            let itemImgs: ImageItem[] = [];
            if (Array.isArray(item.images)) {
                itemImgs = item.images.map((img: any) => typeof img === 'string' ? { url: img } : img);
            }
            setImages(itemImgs.slice(0, 5));
        } else {
            setEditingId(null);
            setTitle('');
            setSlug('');
            setActivityType('MEETING');
            setLocation('');
            setActivityDate(new Date().toISOString().split('T')[0]);
            setSummary('');
            setContent('');
            setExternalLink('');
            setIsFeatured(false);
            setShowOnHome(true);
            setIsActive(true);
            setSortOrder(0);
            setImages([]);
        }
        setPreviewImgIdx(0);
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleUploadLocal = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        if (images.length >= 5) {
            alert('Maximum 5 images allowed per activity post.');
            return;
        }

        const files = Array.from(e.target.files);
        const remainingSlots = 5 - images.length;
        const filesToUpload = files.slice(0, remainingSlots);

        setIsUploading(true);
        try {
            const uploadedUrls: string[] = [];
            for (const rawFile of filesToUpload) {
                const file = await compressImageFile(rawFile);
                const formData = new FormData();
                formData.append('file', file);
                formData.append('pageScope', 'ACTIVITIES');
                const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) {
                    uploadedUrls.push(data.data.url);
                }
            }

            if (uploadedUrls.length > 0) {
                const newImageItems: ImageItem[] = uploadedUrls.map(url => ({ url, caption: '', altText: title || 'Activity Photo' }));
                setImages(prev => [...prev, ...newImageItems].slice(0, 5));
            }
        } catch {
            alert('Upload failed');
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleSelectMedia = (url: string) => {
        if (images.length >= 5) {
            alert('Maximum 5 images allowed per activity post.');
            return;
        }
        setImages(prev => [...prev, { url, caption: '', altText: title || 'Activity Photo' }].slice(0, 5));
        setIsMediaSelectorOpen(false);
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        if (previewImgIdx >= index && previewImgIdx > 0) {
            setPreviewImgIdx(previewImgIdx - 1);
        }
    };

    const handleMoveImage = (index: number, direction: 'up' | 'down') => {
        const newIdx = direction === 'up' ? index - 1 : index + 1;
        if (newIdx < 0 || newIdx >= images.length) return;
        const copy = [...images];
        const temp = copy[index];
        copy[index] = copy[newIdx];
        copy[newIdx] = temp;
        setImages(copy);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setErrorMsg('Title is required');
            return;
        }
        if (!summary.trim()) {
            setErrorMsg('Summary is required');
            return;
        }
        if (images.length === 0) {
            setErrorMsg('Please add at least 1 image (up to 5 max).');
            return;
        }

        setIsSaving(true);
        setErrorMsg('');

        const payload = {
            title: title.trim(),
            slug: slug.trim() || undefined,
            activityType,
            location: location.trim() || null,
            activityDate: new Date(activityDate).toISOString(),
            summary: summary.trim(),
            content: content.trim() || null,
            externalLink: externalLink.trim() || null,
            images,
            isFeatured,
            showOnHome,
            isActive,
            sortOrder
        };

        try {
            const url = editingId ? `/api/admin/activities/${editingId}` : '/api/admin/activities';
            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchActivities();
            } else {
                setErrorMsg(data.error || 'Failed to save activity');
            }
        } catch {
            setErrorMsg('Failed to save activity');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this activity post?')) return;
        try {
            const res = await fetch(`/api/admin/activities/${id}`, { method: 'DELETE' });
            if ((await res.json()).success) {
                fetchActivities();
            } else {
                alert('Failed to delete activity post');
            }
        } catch {
            alert('Error deleting activity post');
        }
    };

    // Filter activities
    const filteredActivities = activities.filter(item => {
        const matchesQuery = !searchQuery ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = selectedTypeFilter === 'ALL' || item.activityType === selectedTypeFilter;

        return matchesQuery && matchesType;
    });

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
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Blogs &amp; Activities</h1>
                    <p className="text-sm text-[#475569] mt-0.5">Manage company field visits, MoUs, partnership meets, and updates.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <SectionVisibilityToggle
                        sectionKey="home_activities"
                        sectionLabel="Home Blogs & Activities"
                    />
                    <button
                        onClick={() => handleOpenModal()}
                        className="admin-button-primary"
                    >
                        <Plus className="w-4 h-4" /> Add Activity
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="admin-card p-3 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search activities, locations..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="admin-input pl-9"
                    />
                </div>

                <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setSelectedTypeFilter('ALL')}
                        className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${selectedTypeFilter === 'ALL' ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        All ({activities.length})
                    </button>
                    {ACTIVITY_TYPES.map(type => {
                        const count = activities.filter(a => a.activityType === type.value).length;
                        if (count === 0 && selectedTypeFilter !== type.value) return null;
                        return (
                            <button
                                key={type.value}
                                onClick={() => setSelectedTypeFilter(type.value)}
                                className={`px-2.5 py-1 text-xs rounded-full font-semibold transition-colors ${selectedTypeFilter === type.value ? 'bg-[#0F766E] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {type.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content List / Table */}
            <div className="admin-card overflow-hidden">
                {/* Mobile Cards: 2-Column Grid */}
                <div className="sm:hidden p-2.5">
                    {filteredActivities.length === 0 ? (
                        <div className="p-8 text-center text-sm text-[#64748B]">No activity posts found matching your criteria.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {filteredActivities.map(item => {
                                const typeMeta = getActivityTypeMeta(item.activityType);
                                const TypeIcon = typeMeta.icon;
                                const itemImages: any[] = Array.isArray(item.images) ? item.images : [];
                                const firstImg = itemImages[0]?.url || (typeof itemImages[0] === 'string' ? itemImages[0] : null);

                                return (
                                    <div key={item.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                        <div className="space-y-1.5">
                                            <div className="relative w-full h-20 rounded-lg bg-slate-50 overflow-hidden border border-[#E2E8F0] flex items-center justify-center">
                                                {firstImg ? (
                                                    <img src={firstImg} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                                {itemImages.length > 1 && (
                                                    <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-bold text-white px-1 py-0.2 rounded">
                                                        +{itemImages.length - 1}
                                                    </span>
                                                )}
                                                {item.isFeatured && (
                                                    <span className="absolute top-1 left-1 bg-amber-500 text-[8px] font-bold text-white px-1 py-0.2 rounded shadow-xs flex items-center gap-0.5">
                                                        <Star className="w-2.5 h-2.5 fill-current" /> Feat
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold border truncate max-w-[65%] ${typeMeta.color}`}>
                                                        <TypeIcon className="w-2.5 h-2.5 shrink-0" />
                                                        <span className="truncate">{typeMeta.label}</span>
                                                    </span>
                                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-semibold shrink-0 ${item.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                        {item.isActive ? 'Active' : 'Draft'}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-xs text-[#0F172A] leading-tight truncate mt-1" title={item.title}>
                                                    {item.title}
                                                </h3>
                                                <p className="text-[10px] text-[#64748B] line-clamp-2 mt-0.5">{item.summary}</p>
                                            </div>

                                            <div className="text-[9px] text-[#64748B] flex items-center gap-1 truncate pt-0.5">
                                                <Calendar className="w-2.5 h-2.5 text-[#0F766E] shrink-0" />
                                                <span className="truncate">{new Date(item.activityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-1">
                                            {item.externalLink ? (
                                                <a
                                                    href={item.externalLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 bg-gray-50 hover:bg-[#EDF5F2] text-[#0F766E] rounded-lg border border-gray-200 transition-colors flex items-center justify-center"
                                                    title="Social Post"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            ) : <div />}
                                            <div className="flex items-center gap-1 flex-1 justify-end">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center flex-1"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors flex items-center justify-center flex-1"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="w-20">Images</th>
                                <th>Activity Details</th>
                                <th>Type</th>
                                <th>Date &amp; Location</th>
                                <th className="text-center">Home</th>
                                <th className="text-center">Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-[#64748B]">No activity posts found matching your criteria.</td>
                                </tr>
                            ) : (
                                filteredActivities.map(item => {
                                    const typeMeta = getActivityTypeMeta(item.activityType);
                                    const TypeIcon = typeMeta.icon;
                                    const itemImages: any[] = Array.isArray(item.images) ? item.images : [];
                                    const firstImg = itemImages[0]?.url || (typeof itemImages[0] === 'string' ? itemImages[0] : null);

                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <div className="relative w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-[#E2E8F0]">
                                                    {firstImg ? (
                                                        <img src={firstImg} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <ImageIcon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    {itemImages.length > 1 && (
                                                        <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] font-bold text-white px-1 rounded">
                                                            +{itemImages.length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="font-semibold text-sm text-[#0F172A] line-clamp-1">{item.title}</div>
                                                <div className="text-xs text-[#64748B] line-clamp-1 max-w-sm mt-0.5">{item.summary}</div>
                                                {item.externalLink && (
                                                    <a
                                                        href={item.externalLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[11px] text-[#0F766E] hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                                                    >
                                                        <ExternalLink className="w-3 h-3" /> View LinkedIn / Social
                                                    </a>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeMeta.color}`}>
                                                    <TypeIcon className="w-3.5 h-3.5" />
                                                    {typeMeta.label}
                                                </span>
                                            </td>
                                            <td className="text-xs text-[#475569]">
                                                <div className="flex items-center gap-1 font-medium text-[#0F172A]">
                                                    <Calendar className="w-3 h-3 text-[#0F766E]" />
                                                    {new Date(item.activityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                {item.location && (
                                                    <div className="flex items-center gap-1 text-[#64748B] mt-0.5 truncate max-w-[140px]">
                                                        <MapPin className="w-3 h-3 text-[#0F766E]" />
                                                        {item.location}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {item.showOnHome ? (
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF5F2] text-[#0F766E]">Yes</span>
                                                ) : (
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500">Hidden</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${item.isActive ? 'bg-[#EDF5F2] text-[#0F766E]' : 'bg-slate-100 text-slate-500'}`}>
                                                    {item.isActive ? 'Active' : 'Draft'}
                                                </span>
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
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-panel max-w-4xl">
                        <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAF9]">
                            <div>
                                <h3 className="text-base font-bold text-[#0F172A]">{editingId ? 'Edit Activity Post' : 'Add New Activity Post'}</h3>
                                <p className="text-xs text-[#64748B]">Multi-image media gallery (up to 5 images)</p>
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

                            <form id="activityForm" onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Activity Title *</label>
                                        <input
                                            required
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="e.g. MoU Signing with Engineering Institution"
                                            className="admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">URL Slug (optional)</label>
                                        <input
                                            value={slug}
                                            onChange={e => setSlug(e.target.value)}
                                            placeholder="mou-signing-engineering-college"
                                            className="admin-input"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Activity Type *</label>
                                        <select
                                            value={activityType}
                                            onChange={e => setActivityType(e.target.value)}
                                            className="admin-input"
                                        >
                                            {ACTIVITY_TYPES.map(t => (
                                                <option key={t.value} value={t.value}>
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Activity Date *</label>
                                        <input
                                            type="date"
                                            required
                                            value={activityDate}
                                            onChange={e => setActivityDate(e.target.value)}
                                            className="admin-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#334151] mb-1.5">Location / Venue</label>
                                        <input
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            placeholder="e.g. Incubation Hub, Tirunelveli"
                                            className="admin-input"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Short Summary *</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={summary}
                                        onChange={e => setSummary(e.target.value)}
                                        placeholder="Brief overview summarizing the milestone or visit..."
                                        className="admin-input resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">Full Story / Highlights</label>
                                    <textarea
                                        rows={4}
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        placeholder="Detailed narrative, key discussions, outcomes, and attendees..."
                                        className="admin-input resize-y"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-[#334151] mb-1.5">LinkedIn / Social Post URL</label>
                                    <input
                                        value={externalLink}
                                        onChange={e => setExternalLink(e.target.value)}
                                        placeholder="https://www.linkedin.com/posts/..."
                                        className="admin-input"
                                    />
                                </div>

                                {/* Multi-image gallery manager */}
                                <div className="border border-[#0F766E]/20 rounded-xl p-4 bg-[#EDF5F2]/40 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                                                Image Gallery ({images.length} / 5)
                                            </span>
                                            <p className="text-[11px] text-[#64748B]">
                                                Add 1 to 5 photos. The first image is the cover photo.
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <label className={`cursor-pointer admin-button-secondary text-xs ${isUploading || images.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <Upload className="w-3.5 h-3.5 text-[#0F766E]" />
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleUploadLocal}
                                                    className="hidden"
                                                    disabled={isUploading || images.length >= 5}
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setIsMediaSelectorOpen(true)}
                                                disabled={images.length >= 5}
                                                className="admin-button-primary text-xs disabled:opacity-50"
                                            >
                                                <ImageIcon className="w-3.5 h-3.5" /> Select Media
                                            </button>
                                        </div>
                                    </div>

                                    {images.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                                            {images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`relative rounded-lg overflow-hidden border bg-white shadow-sm p-1.5 flex flex-col group ${previewImgIdx === idx ? 'ring-2 ring-[#0F766E] border-transparent' : 'border-[#E2E8F0]'}`}
                                                >
                                                    <div className="relative aspect-[4/3] rounded overflow-hidden bg-slate-100">
                                                        <img src={img.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                        <span className="absolute top-1 left-1 bg-black/75 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                            #{idx + 1} {idx === 0 && '(Cover)'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(idx)}
                                                            className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-full opacity-90 group-hover:opacity-100 shadow-sm"
                                                            title="Remove image"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-[#F1F5F9]">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPreviewImgIdx(idx)}
                                                            className="text-[10px] text-[#0F766E] font-bold hover:underline"
                                                        >
                                                            Select
                                                        </button>
                                                        <div className="flex gap-1">
                                                            <button
                                                                type="button"
                                                                disabled={idx === 0}
                                                                onClick={() => handleMoveImage(idx, 'up')}
                                                                className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
                                                                title="Move left"
                                                            >
                                                                <ArrowLeft className="w-3 h-3 text-[#475569]" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={idx === images.length - 1}
                                                                onClick={() => handleMoveImage(idx, 'down')}
                                                                className="p-0.5 hover:bg-slate-100 rounded disabled:opacity-30"
                                                                title="Move right"
                                                            >
                                                                <ArrowRight className="w-3 h-3 text-[#475569]" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 border-2 border-dashed border-[#CBD5E1] rounded-lg text-center bg-white">
                                            <ImageIcon className="w-7 h-7 mx-auto text-slate-400 mb-1" />
                                            <p className="text-xs text-[#64748B] font-medium">
                                                No images added yet. Click &ldquo;Upload&rdquo; or &ldquo;Select Media&rdquo; above.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 flex flex-wrap gap-5 border-t border-[#E2E8F0]">
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isActive ? 'bg-[#0F766E]' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Active / Published</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={showOnHome} onChange={e => setShowOnHome(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${showOnHome ? 'bg-[#0F766E]' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${showOnHome ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Show on Home</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" />
                                            <div className={`w-9 h-5 rounded-full transition-colors ${isFeatured ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                            <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="text-xs font-semibold text-[#334151]">Featured</span>
                                    </label>
                                    <div className="flex items-center gap-2 ml-auto">
                                        <span className="text-xs font-semibold text-[#334151]">Order:</span>
                                        <input
                                            type="number"
                                            value={sortOrder}
                                            onChange={e => setSortOrder(parseInt(e.target.value) || 0)}
                                            className="w-16 admin-input py-1 text-center"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAF9] flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-secondary justify-center">Cancel</button>
                            <button form="activityForm" type="submit" disabled={isSaving} className="admin-button-primary justify-center disabled:opacity-50">
                                {isSaving ? 'Saving...' : 'Save Activity Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Selector Modal */}
            {isMediaSelectorOpen && (
                <MediaSelectorModal
                    onClose={() => setIsMediaSelectorOpen(false)}
                    onSelect={handleSelectMedia}
                />
            )}
        </div>
    );
}
