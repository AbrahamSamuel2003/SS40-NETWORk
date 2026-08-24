'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    MapPin,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
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
    ArrowUpRight,
    LucideIcon
} from 'lucide-react';

export const ACTIVITY_META: Record<string, { label: string; icon: LucideIcon; color: string; badgeBg: string }> = {
    GOVERNMENT_OFFICIAL: {
        label: 'Government / Official',
        icon: Building2,
        color: 'text-amber-800 border-amber-300 bg-amber-50',
        badgeBg: 'bg-amber-500'
    },
    PARTNERSHIP: {
        label: 'Partnership',
        icon: Handshake,
        color: 'text-emerald-800 border-emerald-300 bg-emerald-50',
        badgeBg: 'bg-emerald-500'
    },
    INDUSTRY_VISIT: {
        label: 'Industry Visit',
        icon: Factory,
        color: 'text-blue-800 border-blue-300 bg-blue-50',
        badgeBg: 'bg-blue-500'
    },
    MEETING: {
        label: 'Meeting',
        icon: Briefcase,
        color: 'text-purple-800 border-purple-300 bg-purple-50',
        badgeBg: 'bg-purple-500'
    },
    EVENT: {
        label: 'Event',
        icon: PartyPopper,
        color: 'text-pink-800 border-pink-300 bg-pink-50',
        badgeBg: 'bg-pink-500'
    },
    ACHIEVEMENT: {
        label: 'Achievement',
        icon: Trophy,
        color: 'text-yellow-800 border-yellow-300 bg-yellow-50',
        badgeBg: 'bg-yellow-500'
    },
    FOUNDER_ACTIVITY: {
        label: 'Founder Activity',
        icon: Rocket,
        color: 'text-indigo-800 border-indigo-300 bg-indigo-50',
        badgeBg: 'bg-indigo-500'
    },
    WEBINAR: {
        label: 'Webinar',
        icon: Video,
        color: 'text-cyan-800 border-cyan-300 bg-cyan-50',
        badgeBg: 'bg-cyan-500'
    },
    ANNOUNCEMENT: {
        label: 'Announcement',
        icon: Megaphone,
        color: 'text-orange-800 border-orange-300 bg-orange-50',
        badgeBg: 'bg-orange-500'
    },
    COMMUNITY: {
        label: 'Community',
        icon: Users,
        color: 'text-teal-800 border-teal-300 bg-teal-50',
        badgeBg: 'bg-teal-500'
    }
};

export interface ActivityImage {
    url: string;
    caption?: string;
    altText?: string;
}

export interface ActivityItem {
    id: string;
    title: string;
    slug: string;
    activityType: string;
    summary: string;
    content?: string | null;
    images: ActivityImage[] | string[] | unknown;
    location?: string | null;
    activityDate: string | Date;
    externalLink?: string | null;
}

export interface ActivityCardProps {
    activity: ActivityItem;
    reversed?: boolean;
    variant?: 'alternating' | 'grid' | 'mobile-swipe';
    onReadStory?: (activity: ActivityItem) => void;
}

export function ActivityCard({ activity, reversed = false, variant = 'alternating', onReadStory }: ActivityCardProps) {
    const rawImages = Array.isArray(activity.images) ? activity.images : [];
    const images: ActivityImage[] = rawImages.map((img: unknown) => {
        if (typeof img === 'string') return { url: img };
        if (img && typeof img === 'object' && 'url' in img) return img as ActivityImage;
        return { url: '' };
    }).filter(img => Boolean(img.url));

    const [currentIndex, setCurrentIndex] = useState(0);
    const totalImages = images.length;

    // Wheel event handler with non-passive listener for horizontal scroll only
    const imageBoxRef = useRef<HTMLDivElement | null>(null);
    const lastWheelTime = useRef<number>(0);
    const WHEEL_THROTTLE_MS = 220;

    const nextImage = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (totalImages <= 1) return;
        setCurrentIndex(prev => (prev + 1) % totalImages);
    }, [totalImages]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (totalImages <= 1) return;
        setCurrentIndex(prev => (prev - 1 + totalImages) % totalImages);
    }, [totalImages]);

    // Active wheel listener: Intercept ONLY when user scrolls horizontally (e.deltaX)
    useEffect(() => {
        const el = imageBoxRef.current;
        if (!el || totalImages <= 1) return;

        const onWheel = (e: WheelEvent) => {
            const absX = Math.abs(e.deltaX);
            const absY = Math.abs(e.deltaY);

            // Trigger ONLY on horizontal scroll gestures (leave vertical page scroll completely untouched)
            if (absX > absY && absX > 8) {
                e.preventDefault();
                const now = Date.now();
                if (now - lastWheelTime.current >= WHEEL_THROTTLE_MS) {
                    lastWheelTime.current = now;
                    if (e.deltaX > 0) {
                        setCurrentIndex(prev => (prev + 1) % totalImages);
                    } else {
                        setCurrentIndex(prev => (prev - 1 + totalImages) % totalImages);
                    }
                }
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [totalImages]);

    // Touch swipe handling
    const touchStartX = useRef<number | null>(null);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartX.current) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 40) nextImage();
        else if (diff < -40) prevImage();
        touchStartX.current = null;
    };

    const meta = ACTIVITY_META[activity.activityType] || ACTIVITY_META.MEETING;
    const Icon = meta.icon;

    const formattedDate = new Date(activity.activityDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // MOBILE SWIPE VARIANT (For the horizontal snap carousel on mobile)
    // ─────────────────────────────────────────────────────────────────────────────
    if (variant === 'mobile-swipe') {
        return (
            <div className="w-[85vw] sm:w-[380px] shrink-0 snap-center flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/60 border border-gray-100 h-full select-none">
                {/* Standard Fixed Aspect Image */}
                <div
                    ref={imageBoxRef}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => onReadStory && onReadStory(activity)}
                    className="relative w-full h-[220px] sm:h-[240px] bg-gray-950 overflow-hidden cursor-pointer shrink-0"
                >
                    <AnimatePresence mode="wait">
                        {images[currentIndex] && (
                            <motion.img
                                key={images[currentIndex].url || currentIndex}
                                src={images[currentIndex].url}
                                alt={images[currentIndex].altText || activity.title}
                                initial={{ opacity: 0.85 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.85 }}
                                transition={{ duration: 0.25 }}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md border ${meta.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {meta.label}
                        </span>

                        {totalImages > 1 && (
                            <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                📷 {currentIndex + 1} / {totalImages}
                            </span>
                        )}
                    </div>

                    {totalImages > 1 && (
                        <div className="absolute bottom-2.5 inset-x-4 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
                            {images.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-300 shadow-sm ${
                                        currentIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between text-left">
                    <div>
                        <div className="flex items-center gap-2.5 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1 font-semibold text-gray-700">
                                <Calendar className="w-3.5 h-3.5 text-[#6B9F91]" />
                                {formattedDate}
                            </span>
                            {activity.location && (
                                <span className="flex items-center gap-1 text-gray-500 truncate max-w-[150px]">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="truncate">{activity.location}</span>
                                </span>
                            )}
                        </div>

                        <h3
                            onClick={() => onReadStory && onReadStory(activity)}
                            className="text-base font-bold text-[#111827] leading-snug hover:text-[#6B9F91] transition-colors cursor-pointer line-clamp-2 mb-2"
                        >
                            {activity.title}
                        </h3>

                        <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3 mb-4">
                            {activity.summary}
                        </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <button
                            type="button"
                            onClick={() => onReadStory && onReadStory(activity)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B9F91] hover:text-[#5C8C80] transition-colors"
                        >
                            Read Story
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        {activity.externalLink && (
                            <a
                                href={activity.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-[#0A66C2] transition-colors bg-gray-50 px-2 py-1 rounded border border-gray-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-3 h-3 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.95 0-1.72.78-1.72 1.73s.77 1.73 1.72 1.73 1.73-.78 1.73-1.73c0-.95-.78-1.73-1.73-1.73z" />
                                </svg>
                                LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // GRID VARIANT (For the dedicated /blogs listing page)
    // ─────────────────────────────────────────────────────────────────────────────
    if (variant === 'grid') {
        return (
            <div className="group/card bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#6B9F91]/50 transition-all duration-300 flex flex-col overflow-hidden h-full">
                <div
                    ref={imageBoxRef}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => onReadStory && onReadStory(activity)}
                    className="relative w-full aspect-[16/10] bg-gray-950 overflow-hidden cursor-pointer select-none shrink-0"
                >
                    <AnimatePresence mode="wait">
                        {images[currentIndex] && (
                            <motion.img
                                key={images[currentIndex].url || currentIndex}
                                src={images[currentIndex].url}
                                alt={images[currentIndex].altText || activity.title}
                                initial={{ opacity: 0.85 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.85 }}
                                transition={{ duration: 0.25 }}
                                className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                            />
                        )}
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md backdrop-blur-md border ${meta.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                            {meta.label}
                        </span>

                        {totalImages > 1 && (
                            <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                📷 {currentIndex + 1} / {totalImages}
                            </span>
                        )}
                    </div>

                    {totalImages > 1 && (
                        <div className="absolute bottom-2.5 inset-x-4 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
                            {images.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-300 shadow-sm ${
                                        currentIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                            <span className="flex items-center gap-1 font-semibold text-gray-700">
                                <Calendar className="w-3.5 h-3.5 text-[#6B9F91]" />
                                {formattedDate}
                            </span>
                            {activity.location && (
                                <span className="flex items-center gap-1 text-gray-500 truncate max-w-[140px]">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="truncate">{activity.location}</span>
                                </span>
                            )}
                        </div>

                        <h3
                            onClick={() => onReadStory && onReadStory(activity)}
                            className="text-base font-bold text-[#111827] leading-snug hover:text-[#6B9F91] transition-colors cursor-pointer line-clamp-2 mb-2"
                        >
                            {activity.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed line-clamp-3 mb-4">
                            {activity.summary}
                        </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <button
                            type="button"
                            onClick={() => onReadStory && onReadStory(activity)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B9F91] hover:text-[#5C8C80] transition-colors"
                        >
                            Read Story
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        {activity.externalLink && (
                            <a
                                href={activity.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-[#0A66C2] transition-colors bg-gray-50 px-2 py-1 rounded border border-gray-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-3 h-3 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.95 0-1.72.78-1.72 1.73s.77 1.73 1.72 1.73 1.73-.78 1.73-1.73c0-.95-.78-1.73-1.73-1.73z" />
                                </svg>
                                LinkedIn
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // ALTERNATING FULL-ROW VARIANT (For Home page with standard fixed dimensions)
    // ─────────────────────────────────────────────────────────────────────────────
    return (
        <div
            className={`group/card bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#6B9F91]/50 transition-all duration-300 overflow-hidden flex flex-col ${
                reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
            }`}
        >
            {/* ── STANDARD FIXED-SIZE IMAGE CONTAINER ── */}
            <div
                ref={imageBoxRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => onReadStory && onReadStory(activity)}
                className="relative w-full lg:w-1/2 h-[260px] sm:h-[340px] lg:h-[390px] xl:h-[410px] bg-gray-950 overflow-hidden cursor-pointer select-none shrink-0"
            >
                <AnimatePresence mode="wait">
                    {images[currentIndex] && (
                        <motion.img
                            key={images[currentIndex].url || currentIndex}
                            src={images[currentIndex].url}
                            alt={images[currentIndex].altText || activity.title}
                            initial={{ opacity: 0.85 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.85 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                        />
                    )}
                </AnimatePresence>

                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border ${meta.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {meta.label}
                    </span>

                    {totalImages > 1 && (
                        <span className="bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                            📷 {currentIndex + 1} / {totalImages}
                        </span>
                    )}
                </div>

                {/* Segmented Hover Hotspots across image */}
                {totalImages > 1 && (
                    <div className="absolute inset-0 grid z-10" style={{ gridTemplateColumns: `repeat(${totalImages}, 1fr)` }}>
                        {images.map((_, i) => (
                            <div
                                key={i}
                                onMouseEnter={() => setCurrentIndex(i)}
                                className="h-full cursor-pointer"
                                title={`Preview photo ${i + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Navigation Chevrons on Hover */}
                {totalImages > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover/card:opacity-100 transition-opacity z-20 shadow-lg"
                            aria-label="Previous photo"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover/card:opacity-100 transition-opacity z-20 shadow-lg"
                            aria-label="Next photo"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Bottom Segmented Pill Indicators */}
                {totalImages > 1 && (
                    <div className="absolute bottom-3.5 inset-x-6 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
                        {images.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 shadow-md ${
                                    currentIndex === i
                                        ? 'w-7 bg-white'
                                        : 'w-2 bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── CONTENT SECTION ── */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between flex-1 overflow-hidden">
                <div className="space-y-4">
                    {/* Date and Location Header */}
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1.5 font-semibold text-gray-800 bg-[#EDF5F2] px-3 py-1 rounded-full">
                            <Calendar className="w-3.5 h-3.5 text-[#6B9F91]" />
                            {formattedDate}
                        </span>
                        {activity.location && (
                            <span className="flex items-center gap-1.5 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="truncate max-w-[180px] sm:max-w-[280px]">{activity.location}</span>
                            </span>
                        )}
                    </div>

                    {/* Blog Title */}
                    <h3
                        onClick={() => onReadStory && onReadStory(activity)}
                        className="text-xl sm:text-2xl font-extrabold text-[#111827] leading-tight hover:text-[#6B9F91] transition-colors cursor-pointer"
                    >
                        {activity.title}
                    </h3>

                    {/* Summary Paragraph */}
                    <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed line-clamp-4">
                        {activity.summary}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 mt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => onReadStory && onReadStory(activity)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#6B9F91] hover:text-[#5C8C80] group-hover/card:translate-x-1 transition-all bg-[#EDF5F2]/80 hover:bg-[#EDF5F2] px-4 py-2 rounded-xl"
                    >
                        Read Full Story
                        <ArrowUpRight className="w-4 h-4" />
                    </button>

                    {activity.externalLink && (
                        <a
                            href={activity.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#0A66C2] transition-colors bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-xl border border-gray-200 hover:border-blue-200 shadow-sm"
                            title="View original post on LinkedIn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="w-3.5 h-3.5 fill-current text-[#0A66C2]" viewBox="0 0 24 24">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.95 0-1.72.78-1.72 1.73s.77 1.73 1.72 1.73 1.73-.78 1.73-1.73c0-.95-.78-1.73-1.73-1.73z" />
                            </svg>
                            View on LinkedIn
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
