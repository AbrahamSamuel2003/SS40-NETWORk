'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
import { formatCleanText } from '@/utils/text';

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
    priority?: boolean;
    onReadStory?: (activity: ActivityItem) => void;
}

export function ActivityCard({ activity, reversed = false, variant = 'alternating', priority = false, onReadStory }: ActivityCardProps) {
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

    const cleanTitle = React.useMemo(() => formatCleanText(activity.title), [activity.title]);
    const cleanSummary = React.useMemo(() => formatCleanText(activity.summary), [activity.summary]);
    const cleanLocation = React.useMemo(() => formatCleanText(activity.location), [activity.location]);

    const formattedDate = React.useMemo(() => {
        const d = typeof activity.activityDate === 'string' ? new Date(activity.activityDate) : activity.activityDate;
        if (!d || isNaN(new Date(d).getTime())) return '';
        return new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
        });
    }, [activity.activityDate]);

    // ─────────────────────────────────────────────────────────────────────────────
    // MOBILE SWIPE VARIANT (For the horizontal snap carousel on mobile)
    // ─────────────────────────────────────────────────────────────────────────────
    // MOBILE SWIPE VARIANT (Replicating exact OUR IMPACT geometry)
    // ─────────────────────────────────────────────────────────────────────────────
    if (variant === 'mobile-swipe') {
        return (
            <div
                className="mobile-activity-card w-[82vw] sm:w-[350px] shrink-0 snap-center flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-200/90 h-full select-none relative scroll-ml-6 transform-gpu"
                style={{ transform: 'translateZ(0)', willChange: 'transform' }}
            >
                {/* Standard Fixed Aspect Image */}
                <div
                    ref={imageBoxRef}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => onReadStory && onReadStory(activity)}
                    className="relative w-full h-[200px] sm:h-[220px] bg-gray-950 overflow-hidden cursor-pointer shrink-0 z-0"
                >
                    <AnimatePresence>
                        {images[currentIndex] && (
                            <motion.div
                                key={images[currentIndex].url || currentIndex}
                                initial={{ opacity: 0.9 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.9 }}
                                transition={{ duration: 0.12 }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <Image
                                    src={images[currentIndex].url}
                                    alt={images[currentIndex].altText || activity.title}
                                    fill
                                    quality={75}
                                    sizes="(max-width: 640px) 350px, 350px"
                                    className="object-cover"
                                    priority={priority}
                                    loading={priority ? 'eager' : 'lazy'}
                                    decoding="async"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between pointer-events-none z-10">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-white/90 bg-black/40 backdrop-blur-md border border-white/20 shadow-2xs select-none">
                            {meta.label}
                        </span>

                        {totalImages > 1 && (
                            <span className="bg-black/50 backdrop-blur-md text-white/80 text-[9px] font-medium px-1.5 py-0.5 rounded-full border border-white/15 shadow-2xs">
                                {currentIndex + 1} / {totalImages}
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
                            {cleanLocation && (
                                <span className="flex items-center gap-1 text-gray-500 truncate max-w-[150px]">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="truncate">{cleanLocation}</span>
                                </span>
                            )}
                        </div>

                        <h3
                            onClick={() => onReadStory && onReadStory(activity)}
                            className="text-base font-bold text-[#111827] leading-snug hover:text-[#2E544A] transition-colors cursor-pointer line-clamp-2 mb-2"
                        >
                            {cleanTitle}
                        </h3>

                        <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3 mb-4">
                            {cleanSummary}
                        </p>
                    </div>

                    <div className="pt-1 flex items-center justify-between mt-auto">
                        <button
                            type="button"
                            onClick={() => onReadStory && onReadStory(activity)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3D35] hover:text-[#11221E] transition-colors"
                        >
                            Read Story
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        {activity.externalLink && (
                            <a
                                href={activity.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Read LinkedIn post about ${cleanTitle}`}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#0A66C2] transition-colors bg-gray-50 px-2 py-1 rounded border border-gray-200"
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
                    <AnimatePresence>
                        {images[currentIndex] && (
                            <motion.div
                                key={images[currentIndex].url || currentIndex}
                                initial={{ opacity: 0.9 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.9 }}
                                transition={{ duration: 0.12 }}
                                className="absolute inset-0 w-full h-full group-hover/card:scale-105 transition-transform duration-500"
                            >
                                <Image
                                    src={images[currentIndex].url}
                                    alt={images[currentIndex].altText || cleanTitle}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-2.5 inset-x-2.5 sm:top-3 sm:inset-x-3 flex items-center justify-between pointer-events-none z-10">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-white/90 bg-black/40 backdrop-blur-md border border-white/20 shadow-2xs select-none">
                            {meta.label}
                        </span>

                        {totalImages > 1 && (
                            <span className="bg-black/50 backdrop-blur-md text-white/80 text-[9px] font-medium px-1.5 py-0.5 rounded-full border border-white/15 shadow-2xs">
                                {currentIndex + 1} / {totalImages}
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
                            {cleanLocation && (
                                <span className="flex items-center gap-1 text-gray-500 truncate max-w-[140px]">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="truncate">{cleanLocation}</span>
                                </span>
                            )}
                        </div>

                        <h3
                            onClick={() => onReadStory && onReadStory(activity)}
                            className="text-base font-bold text-[#111827] leading-snug hover:text-[#2E544A] transition-colors cursor-pointer line-clamp-2 mb-2"
                        >
                            {cleanTitle}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed line-clamp-3 mb-4">
                            {cleanSummary}
                        </p>
                    </div>

                    <div className="pt-1 flex items-center justify-between mt-auto">
                        <button
                            type="button"
                            onClick={() => onReadStory && onReadStory(activity)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3D35] hover:text-[#11221E] transition-colors"
                        >
                            Read Story
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        {activity.externalLink && (
                            <a
                                href={activity.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Read LinkedIn post about ${cleanTitle}`}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-[#0A66C2] transition-colors bg-gray-50 px-2 py-1 rounded border border-gray-200"
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
            className={`group/card bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-[#6B9F91]/50 transition-all duration-300 overflow-hidden flex flex-col transform-gpu ${
                reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
            }`}
        >
            {/* ── STANDARD FIXED-SIZE IMAGE CONTAINER ── */}
            <div
                ref={imageBoxRef}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => onReadStory && onReadStory(activity)}
                className="relative w-full lg:w-1/2 h-[240px] sm:h-[300px] lg:h-[320px] xl:h-[350px] bg-gray-950 overflow-hidden cursor-pointer select-none shrink-0"
            >
                <AnimatePresence>
                    {images[currentIndex] && (
                        <motion.div
                            key={images[currentIndex].url || currentIndex}
                            initial={{ opacity: 0.9 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.9 }}
                            transition={{ duration: 0.12 }}
                            className="absolute inset-0 w-full h-full group-hover/card:scale-105 transition-transform duration-700"
                        >
                            <Image
                                src={images[currentIndex].url}
                                alt={images[currentIndex].altText || cleanTitle}
                                fill
                                quality={75}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                                priority={priority}
                                loading={priority ? 'eager' : 'lazy'}
                                decoding="async"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subtle vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-2.5 inset-x-2.5 lg:top-3.5 lg:inset-x-3.5 flex items-center justify-between pointer-events-none z-10">
                    <span className="inline-flex items-center px-2 py-0.5 lg:px-2.5 lg:py-0.5 rounded-full text-[9px] sm:text-[10px] lg:text-[11px] font-semibold tracking-wider uppercase text-white/90 bg-black/40 backdrop-blur-md border border-white/20 shadow-2xs select-none">
                        {meta.label}
                    </span>

                    {totalImages > 1 && (
                        <span className="bg-black/50 backdrop-blur-md text-white/80 text-[9px] lg:text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/15 shadow-2xs">
                            {currentIndex + 1} / {totalImages}
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
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all hover:scale-110 z-20"
                            aria-label="Previous photo"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={nextImage}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all hover:scale-110 z-20"
                            aria-label="Next photo"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </>
                )}

                {/* Bottom Segmented Pill Indicators */}
                {totalImages > 1 && (
                    <div className="absolute bottom-3 inset-x-4 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
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
            <div className="p-5 sm:p-6 lg:p-7 xl:p-8 flex flex-col justify-between flex-1 overflow-hidden">
                <div className="space-y-3">
                    {/* Date and Location Header */}
                    <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-gray-600">
                        <span className="flex items-center gap-1.5 font-semibold text-[#1F3D35] bg-[#D8E8E2] px-2.5 py-0.5 rounded-full">
                            <Calendar className="w-3.5 h-3.5 text-[#2E544A]" />
                            {formattedDate}
                        </span>
                        {cleanLocation && (
                            <span className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
                                <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                <span className="truncate max-w-[180px] sm:max-w-[260px]">{cleanLocation}</span>
                            </span>
                        )}
                    </div>

                    {/* Blog Title */}
                    <h3
                        onClick={() => onReadStory && onReadStory(activity)}
                        className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#111827] leading-snug hover:text-[#2E544A] transition-colors cursor-pointer line-clamp-2"
                    >
                        {cleanTitle}
                    </h3>

                    {/* Summary Paragraph */}
                    <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed line-clamp-3">
                        {cleanSummary}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 mt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => onReadStory && onReadStory(activity)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#1F3D35] hover:text-[#11221E] group-hover/card:translate-x-1 transition-all bg-[#D8E8E2] hover:bg-[#DEEDE8] px-4 py-2 rounded-xl"
                    >
                        Read Full Story
                        <ArrowUpRight className="w-4 h-4" />
                    </button>

                    {activity.externalLink && (
                        <a
                            href={activity.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Read LinkedIn post about ${cleanTitle}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-[#0A66C2] transition-colors bg-gray-50 hover:bg-blue-50 px-3 py-2 rounded-xl border border-gray-200 hover:border-blue-200 shadow-sm"
                            title={`Read LinkedIn post about ${cleanTitle}`}
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
