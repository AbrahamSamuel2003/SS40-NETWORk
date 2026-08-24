'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    AlertCircle,
    X,
    ExternalLink,
    Upload,
    Image as ImageIcon,
    Check,
    ArrowLeft,
    ArrowRight,
    Calendar,
    MapPin,
    Search,
    ChevronLeft,
    
    ChevronRight,
    MoveUp,
    MoveDown,
    Building2,
    Handshake,
    Factory,
    Briefcase,
    PartyPopper,
    Trophy,
    Rocket,
    Video,
    Megaphone,
    Users
} from 'lucide-react';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';

export const ACTIVITY_TYPES = [
    { value: 'GOVERNMENT_OFFICIAL', label: 'Government / Official', icon: Building2, color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { value: 'PARTNERSHIP', label: 'Partnership', icon: Handshake, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { value: 'INDUSTRY_VISIT', label: 'Industry Visit', icon: Factory, color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { value: 'MEETING', label: 'Meeting', icon: Briefcase, color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { value: 'EVENT', label: 'Event', icon: PartyPopper, color: 'bg-pink-100 text-pink-800 border-pink-300' },
    { value: 'ACHIEVEMENT', label: 'Achievement', icon: Trophy, color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'FOUNDER_ACTIVITY', label: 'Founder Activity', icon: Rocket, color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    { value: 'WEBINAR', label: 'Webinar', icon: Video, color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
    { value: 'ANNOUNCEMENT', label: 'Announcement', icon: Megaphone, color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { value: 'COMMUNITY', label: 'Community', icon: Users, color: 'bg-teal-100 text-teal-800 border-teal-300' },
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
        } catch (e) {
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
            for (const file of filesToUpload) {
                const formData = new FormData();
                formData.append('file', file);
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
        } catch (err) {
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
        } catch (err) {
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
        } catch (e) {
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
            <div className="p-12 text-center text-[#111827]">
                <div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-[#6B9F91]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-1">
                        Blogs & Activity Updates
                    </h2>
                    <p className="text-sm text-[#6B7280]">
                        Manage company field visits, government dialogues, partnerships, and founder updates displayed on the Home page.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" /> Add Activity / Blog
                </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="admin-card p-3 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search activities, locations..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#6B9F91]"
                    />
                </div>

                <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setSelectedTypeFilter('ALL')}
                        className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${selectedTypeFilter === 'ALL' ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                                className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${selectedTypeFilter === type.value ? 'bg-[#6B9F91] text-[#111827] font-semibold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {type.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List / Table */}
            <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm text-[#374151] min-w-[700px]">
                        <thead className="bg-[#EDF5F2]/80 border-b border-gray-200 text-[#111827]">
                            <tr>
                                <th className="p-4 font-semibold min-w-[120px]">Images</th>
                                <th className="p-4 font-semibold min-w-[220px]">Activity Details</th>
                                <th className="p-4 font-semibold min-w-[140px]">Type</th>
                                <th className="p-4 font-semibold min-w-[130px]">Date & Place</th>
                                <th className="p-4 font-semibold text-center min-w-[90px]">Home</th>
                                <th className="p-4 font-semibold text-center min-w-[90px]">Status</th>
                                <th className="p-4 font-semibold text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-[#9CA3AF]">
                                        No activity posts found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredActivities.map(item => {
                                    const typeMeta = getActivityTypeMeta(item.activityType);
                                    const TypeIcon = typeMeta.icon;
                                    const itemImages: any[] = Array.isArray(item.images) ? item.images : [];
                                    const firstImg = itemImages[0]?.url || (typeof itemImages[0] === 'string' ? itemImages[0] : null);

                                    return (
                                        <tr key={item.id} className="hover:bg-[#EDF5F2]/40 transition-colors">
                                            <td className="p-4">
                                                <div className="relative w-16 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                                    {firstImg ? (
                                                        <img src={firstImg} alt={item.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <ImageIcon className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                    {itemImages.length > 1 && (
                                                        <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-[9px] font-bold text-white px-1 rounded">
                                                            +{itemImages.length - 1}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium">
                                                <div className="text-[#111827] font-bold leading-snug line-clamp-1">{item.title}</div>
                                                <div className="text-[#6B7280] text-xs line-clamp-2 mt-0.5">{item.summary}</div>
                                                {item.externalLink && (
                                                    <a
                                                        href={item.externalLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-[11px] text-[#6B9F91] hover:underline inline-flex items-center gap-1 mt-1 font-medium"
                                                    >
                                                        <ExternalLink className="w-3 h-3" /> View LinkedIn / Link
                                                    </a>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeMeta.color}`}>
                                                    <TypeIcon className="w-3.5 h-3.5" />
                                                    {typeMeta.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs text-[#6B7280]">
                                                <div className="flex items-center gap-1 text-[#111827] font-medium">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                    {new Date(item.activityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                {item.location && (
                                                    <div className="flex items-center gap-1 text-gray-500 mt-1 truncate max-w-[140px]">
                                                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                        {item.location}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {item.showOnHome ? (
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">Yes</span>
                                                ) : (
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500">Hidden</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${item.isActive ? 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                                                    {item.isActive ? 'Active' : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleOpenModal(item)}
                                                        className="px-2.5 py-1 rounded border border-gray-300 text-xs font-medium text-[#374151] hover:bg-[#EDF5F2] transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="px-2.5 py-1 rounded border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
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

            {/* CREATE / EDIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#111827]/50 backdrop-blur-sm overflow-y-auto">
                    <div className="admin-card w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col my-auto">
                        {/* Modal Header */}
                        <div className="px-5 py-3.5 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/80 shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-[#111827]">
                                    {editingId ? 'Edit Activity Post' : 'Add New Activity Post'}
                                </h3>
                                <p className="text-xs text-[#6B7280]">
                                    Supports up to 5 images with interactive pointer-scroll preview
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
                            {errorMsg && (
                                <div className="text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <form id="activityForm" onSubmit={handleSave} className="space-y-4">
                                {/* Title & Slug */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                                            Activity Title *
                                        </label>
                                        <input
                                            required
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="e.g. Dialogue with District Collector on Youth Tech Skilling"
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                                            URL Slug <span className="text-gray-400 font-normal">(optional, auto-generated)</span>
                                        </label>
                                        <input
                                            value={slug}
                                            onChange={e => setSlug(e.target.value)}
                                            placeholder="collector-meeting-tech-skilling"
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]"
                                        />
                                    </div>
                                </div>

                                {/* Type, Date, Location */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                                            Activity Type *
                                        </label>
                                        <select
                                            value={activityType}
                                            onChange={e => setActivityType(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]"
                                        >
                                            {ACTIVITY_TYPES.map(t => (
                                                <option key={t.value} value={t.value}>
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                                            Activity Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={activityDate}
                                            onChange={e => setActivityDate(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#374151] mb-1">
                                            Location / Venue
                                        </label>
                                        <input
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            placeholder="e.g. Collectorate, Tirunelveli"
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]"
                                        />
                                    </div>
                                </div>

                                {/* Short Summary */}
                                <div>
                                    <label className="block text-xs font-semibold text-[#374151] mb-1">
                                        Short Summary * <span className="text-gray-400 font-normal">(shown on Home card teaser)</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={summary}
                                        onChange={e => setSummary(e.target.value)}
                                        placeholder="Brief overview summarizing the milestone or visit..."
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]"
                                    />
                                </div>

                                {/* Full Story Content */}
                                <div>
                                    <label className="block text-xs font-semibold text-[#374151] mb-1">
                                        Full Story / Key Highlights <span className="text-gray-400 font-normal">(shown inside the Quick-View Story modal)</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        placeholder="Detailed narrative, key discussions, outcomes, and attendees..."
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]"
                                    />
                                </div>

                                {/* External Link (LinkedIn) */}
                                <div>
                                    <label className="block text-xs font-semibold text-[#374151] mb-1">
                                        Original LinkedIn / Social Post URL <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        value={externalLink}
                                        onChange={e => setExternalLink(e.target.value)}
                                        placeholder="https://www.linkedin.com/posts/..."
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]"
                                    />
                                </div>

                                {/* MULTI-IMAGE MANAGER (MAX 5) */}
                                <div className="border border-[#6B9F91]/30 rounded-xl p-4 bg-[#EDF5F2]/30 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                                                Images Gallery ({images.length} / 5)
                                            </span>
                                            <p className="text-[11px] text-gray-500">
                                                Add 1 to 5 images. The first image will be the primary cover; users can scroll/hover to view others.
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <label className={`flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-700 cursor-pointer ${isUploading || images.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <Upload className="w-3.5 h-3.5" />
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
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] rounded-lg text-xs font-semibold disabled:opacity-50"
                                            >
                                                <ImageIcon className="w-3.5 h-3.5" /> Select Media
                                            </button>
                                        </div>
                                    </div>

                                    {/* Image List / Slots */}
                                    {images.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                                            {images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`relative rounded-lg overflow-hidden border bg-white shadow-sm p-1.5 flex flex-col group ${previewImgIdx === idx ? 'ring-2 ring-[#6B9F91] border-transparent' : 'border-gray-200'}`}
                                                >
                                                    <div className="relative aspect-[4/3] rounded overflow-hidden bg-gray-100">
                                                        <img src={img.url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                        <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                            #{idx + 1} {idx === 0 && '(Cover)'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(idx)}
                                                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                                                            title="Remove image"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-gray-100">
                                                        <button
                                                            type="button"
                                                            onClick={() => setPreviewImgIdx(idx)}
                                                            className="text-[10px] text-[#6B9F91] font-bold hover:underline"
                                                        >
                                                            Preview
                                                        </button>
                                                        <div className="flex gap-1">
                                                            <button
                                                                type="button"
                                                                disabled={idx === 0}
                                                                onClick={() => handleMoveImage(idx, 'up')}
                                                                className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                                                                title="Move left"
                                                            >
                                                                <ArrowLeft className="w-3 h-3 text-gray-600" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={idx === images.length - 1}
                                                                onClick={() => handleMoveImage(idx, 'down')}
                                                                className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                                                                title="Move right"
                                                            >
                                                                <ArrowRight className="w-3 h-3 text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-white">
                                            <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-500 font-medium">
                                                No images added yet. Click &ldquo;Upload&rdquo; or &ldquo;Select Media&rdquo; above.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Controls / Toggles */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={e => setIsActive(e.target.checked)}
                                            className="w-4 h-4 text-[#6B9F91] rounded border-gray-300 focus:ring-[#6B9F91]"
                                        />
                                        <span className="text-xs font-semibold text-[#374151]">Active / Published</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showOnHome}
                                            onChange={e => setShowOnHome(e.target.checked)}
                                            className="w-4 h-4 text-[#6B9F91] rounded border-gray-300 focus:ring-[#6B9F91]"
                                        />
                                        <span className="text-xs font-semibold text-[#374151]">Show on Home</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isFeatured}
                                            onChange={e => setIsFeatured(e.target.checked)}
                                            className="w-4 h-4 text-[#6B9F91] rounded border-gray-300 focus:ring-[#6B9F91]"
                                        />
                                        <span className="text-xs font-semibold text-[#374151]">Featured Hero</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-[#374151]">Order:</span>
                                        <input
                                            type="number"
                                            value={sortOrder}
                                            onChange={e => setSortOrder(parseInt(e.target.value) || 0)}
                                            className="w-16 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-[#6B9F91]"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-[#EDF5F2]/60 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="activityForm"
                                disabled={isSaving}
                                className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg text-xs font-bold shadow-sm disabled:opacity-50"
                            >
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
