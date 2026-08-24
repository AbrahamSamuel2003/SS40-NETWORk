'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ActivityCard,
    ACTIVITY_META,
    ActivityItem,
    ActivityImage
} from '@/components/ui/ActivityCard';
import {
    Search,
    X,
    Calendar,
    MapPin,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from 'lucide-react';

interface BlogsListProps {
    initialActivities: ActivityItem[];
}

export function BlogsList({ initialActivities }: BlogsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [activeModalItem, setActiveModalItem] = useState<ActivityItem | null>(null);

    // Extract categories
    const categories = useMemo(() => {
        const set = new Set<string>();
        initialActivities.forEach(item => {
            if (item.activityType) set.add(item.activityType);
        });
        return Array.from(set);
    }, [initialActivities]);

    // Filter activities
    const filteredActivities = useMemo(() => {
        return initialActivities.filter(item => {
            const matchesCategory = selectedCategory === 'ALL' || item.activityType === selectedCategory;
            const matchesSearch = !searchQuery.trim() ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [initialActivities, selectedCategory, searchQuery]);

    return (
        <div className="space-y-10">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#EDF5F2]/50 p-4 sm:p-5 rounded-3xl border border-[#6B9F91]/20 shadow-sm">
                {/* Search input */}
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search blogs, visits, locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91] shadow-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                            selectedCategory === 'ALL'
                                ? 'bg-[#111827] text-white ring-2 ring-[#111827]/20 shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                    >
                        All ({initialActivities.length})
                    </button>

                    {categories.map(typeKey => {
                        const meta = ACTIVITY_META[typeKey] || { label: typeKey };
                        const count = initialActivities.filter(item => item.activityType === typeKey).length;
                        const isActive = selectedCategory === typeKey;

                        return (
                            <button
                                key={typeKey}
                                onClick={() => setSelectedCategory(typeKey)}
                                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                                    isActive
                                        ? 'bg-[#6B9F91] text-[#111827] ring-2 ring-[#6B9F91]/40 font-bold shadow-md'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                <span>{meta.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#111827]/10' : 'bg-gray-100 text-gray-500'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid of Cards */}
            {filteredActivities.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-200">
                    <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-[#111827]">No Activities Found</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                        We couldn&apos;t find any activity blogs matching your search or category filter. Try clearing filters.
                    </p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                        className="mt-4 px-4 py-2 bg-[#EDF5F2] text-[#6B9F91] hover:bg-[#6B9F91] hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    <AnimatePresence>
                        {filteredActivities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <ActivityCard
                                    activity={activity}
                                    variant="grid"
                                    onReadStory={(item) => setActiveModalItem(item)}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Quick-View Story Modal */}
            <AnimatePresence>
                {activeModalItem && (
                    <ActivityStoryModal
                        activity={activeModalItem}
                        onClose={() => setActiveModalItem(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// -----------------------------------------------------------------------------
// STORY DETAIL MODAL COMPONENT (WITH HORIZONTAL-ONLY WHEEL SCROLLING)
// -----------------------------------------------------------------------------

function ActivityStoryModal({ activity, onClose }: { activity: ActivityItem; onClose: () => void }) {
    const rawImages = Array.isArray(activity.images) ? activity.images : [];
    const images: ActivityImage[] = rawImages.map((img: unknown) => {
        if (typeof img === 'string') return { url: img };
        if (img && typeof img === 'object' && 'url' in img) return img as ActivityImage;
        return { url: '' };
    }).filter(img => Boolean(img.url));

    const [activeImgIdx, setActiveImgIdx] = useState(0);
    const meta = ACTIVITY_META[activity.activityType] || ACTIVITY_META.MEETING;
    const Icon = meta.icon;

    const modalImageBoxRef = useRef<HTMLDivElement | null>(null);
    const lastWheelTime = useRef<number>(0);
    const WHEEL_THROTTLE_MS = 220;

    const nextImg = useCallback(() => {
        if (images.length <= 1) return;
        setActiveImgIdx((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImg = useCallback(() => {
        if (images.length <= 1) return;
        setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const el = modalImageBoxRef.current;
        if (!el || images.length <= 1) return;

        const onWheel = (e: WheelEvent) => {
            const absX = Math.abs(e.deltaX);
            const absY = Math.abs(e.deltaY);

            if (absX > absY && absX > 8) {
                e.preventDefault();
                if (now - lastWheelTime.current >= WHEEL_THROTTLE_MS) {
                    lastWheelTime.current = now;
                    if (e.deltaX > 0) {
                        nextImg();
                    } else {
                        prevImg();
                    }
                }
            }
        };

        const now = Date.now();
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [images.length, nextImg, prevImg]);

    const formattedDate = new Date(activity.activityDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') nextImg();
            if (e.key === 'ArrowLeft') prevImg();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextImg, prevImg, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-[#111827]/80 backdrop-blur-md"
            />
            {/* Modal Dialog (Fluid document scroll) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh] z-10 flex flex-col my-auto border border-gray-100 custom-scrollbar"
            >
                {/* Sticky Close Button */}
                <button
                    onClick={onClose}
                    className="sticky top-4 self-end -mb-12 mr-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md transition-all shadow-xl cursor-pointer"
                    aria-label="Close dialog"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* MODAL IMAGE CAROUSEL (FULL-BLEED COVER IMAGE) */}
                <div
                    ref={modalImageBoxRef}
                    className="relative w-full h-[280px] sm:h-[380px] lg:h-[440px] bg-slate-900 shrink-0 overflow-hidden group select-none"
                >
                    <AnimatePresence mode="wait">
                        {images[activeImgIdx] && (
                            <motion.div
                                key={images[activeImgIdx].url || activeImgIdx}
                                initial={{ opacity: 0.85 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.85 }}
                                transition={{ duration: 0.25 }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <Image
                                    src={images[activeImgIdx].url}
                                    alt={images[activeImgIdx].altText || activity.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 896px"
                                    className="object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30 pointer-events-none" />

                    {/* Image Counter Badge */}
                    {images.length > 1 && (
                        <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            📷 {activeImgIdx + 1} / {images.length}
                        </div>
                    )}

                    {/* Next / Prev Navigation */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImg}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
                                aria-label="Previous photo"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextImg}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xl"
                                aria-label="Next photo"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Bottom Thumbnail Strip */}
                    {images.length > 1 && (
                        <div className="absolute bottom-3.5 inset-x-0 flex justify-center gap-2 px-4 z-20">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImgIdx(idx)}
                                    className={`relative w-14 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                                        activeImgIdx === idx ? 'border-[#6B9F91] scale-110 shadow-xl' : 'border-white/50 opacity-75 hover:opacity-100'
                                    }`}
                                >
                                    <Image src={img.url} alt="" fill sizes="56px" className="object-cover" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* MODAL CONTENT */}
                <div className="p-6 sm:p-8 lg:p-10 space-y-6 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${meta.color}`}>
                            <Icon className="w-4 h-4" />
                            {meta.label}
                        </span>

                        <span className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold bg-[#EDF5F2] px-3.5 py-1.5 rounded-full">
                            <Calendar className="w-3.5 h-3.5 text-[#6B9F91]" />
                            {formattedDate}
                        </span>

                        {activity.location && (
                            <span className="flex items-center gap-1.5 text-xs text-gray-600 font-medium bg-gray-100 px-3.5 py-1.5 rounded-full">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                {activity.location}
                            </span>
                        )}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] leading-tight">
                        {activity.title}
                    </h2>

                    <div className="space-y-4 text-sm sm:text-base text-[#374151] leading-relaxed">
                        <p className="font-semibold text-gray-800 bg-[#EDF5F2]/60 p-5 rounded-2xl border border-[#6B9F91]/25">
                            {activity.summary}
                        </p>

                        {activity.content ? (
                            <div className="whitespace-pre-line text-gray-700 leading-relaxed pt-2">
                                {activity.content}
                            </div>
                        ) : null}
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                        {activity.externalLink ? (
                            <a
                                href={activity.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1 2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.95 0-1.72.78-1.72 1.73s.77 1.73 1.72 1.73 1.73-.78 1.73-1.73c0-.95-.78-1.73-1.73-1.73z" />
                                </svg>
                                View on LinkedIn
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        ) : <div />}

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#111827] font-bold text-xs transition-colors"
                        >
                            Close Story
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
