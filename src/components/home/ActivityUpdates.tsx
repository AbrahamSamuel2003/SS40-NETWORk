'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
    ActivityCard,
    ACTIVITY_META,
    ActivityItem,
    ActivityImage
} from '@/components/ui/ActivityCard';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
    X,
    Calendar,
    MapPin,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

interface ActivityUpdatesProps {
    data?: ActivityItem[];
}

export function ActivityUpdates({ data = [] }: ActivityUpdatesProps) {
    const [activeModalItem, setActiveModalItem] = useState<ActivityItem | null>(null);
    const [activeMobileIdx, setActiveMobileIdx] = useState(0);
    const [activeDesktopIdx, setActiveDesktopIdx] = useState(0);

    const desktopTrackRef = useRef<HTMLDivElement | null>(null);
    const mobileScrollRef = useRef<HTMLDivElement | null>(null);

    // Track scroll progression through the pinned desktop track
    const { scrollYProgress } = useScroll({
        target: desktopTrackRef,
        offset: ['start start', 'end end']
    });

    const homeActivities = data.slice(0, 3);
    const count = homeActivities.length;

    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
        if (count === 0) return;
        // Divide progression into 3 equal slots: 0 -> 0.33 -> 0.66 -> 1.0
        const index = Math.min(Math.floor(latest * count), count - 1);
        setActiveDesktopIdx(index);
    });

    // If no activities, hide section
    if (!data || data.length === 0) {
        return null;
    }

    // Sync mobile scroll position with active dot
    const handleMobileScroll = () => {
        const el = mobileScrollRef.current;
        if (!el) return;
        const scrollLeft = el.scrollLeft;
        const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 300;
        const idx = Math.round(scrollLeft / cardWidth);
        setActiveMobileIdx(Math.min(Math.max(0, idx), homeActivities.length - 1));
    };

    const scrollToMobileCard = (idx: number) => {
        const el = mobileScrollRef.current;
        if (!el) return;
        const cards = el.querySelectorAll('.mobile-activity-card');
        if (cards[idx]) {
            (cards[idx] as HTMLElement).scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
            setActiveMobileIdx(idx);
        }
    };

    const scrollToDesktopCard = (idx: number) => {
        const el = desktopTrackRef.current;
        if (!el) return;
        const trackTop = el.offsetTop;
        const trackHeight = el.offsetHeight;
        const targetScroll = trackTop + (idx / count) * (trackHeight - window.innerHeight) + 20;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    return (
        <>
            {/* ═════════════════════════════════════════════════════════════════════ */}
            {/* DESKTOP PINNED IN-SECTION SCROLL ENGINE (hidden on mobile)            */}
            {/* ═════════════════════════════════════════════════════════════════════ */}
            <div
                id="activities"
                ref={desktopTrackRef}
                className="hidden lg:block relative bg-white border-t border-gray-100"
                style={{ height: `${Math.max(200, count * 100)}vh` }}
            >
                {/* Pinned Viewport Container */}
                <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-8 px-4 relative">
                    {/* Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#6B9F91]/5 rounded-full blur-3xl pointer-events-none" />

                    <Container className="relative z-10 w-full flex flex-col justify-between h-full max-w-6xl">
                        {/* Section Header */}
                        <div className="text-center pt-2 shrink-0">
                            <SectionHeading
                                badge="Blogs & Field Activities"
                                title="Moments That Shape Our Impact"
                                description="Explore our field visits, institutional partnerships, and official dialogues driving modern technology empowerment."
                                align="center"
                            />
                        </div>

                        {/* Active Pinned Blog Card with Smooth Phase Transitions */}
                        <div className="relative w-full my-auto flex items-center justify-center min-h-[420px]">
                            <AnimatePresence mode="wait">
                                {homeActivities[activeDesktopIdx] && (
                                    <motion.div
                                        key={`desktop-card-${homeActivities[activeDesktopIdx].id}`}
                                        initial={{ opacity: 0, y: 25, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -25, scale: 0.98 }}
                                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        className="w-full"
                                    >
                                        <ActivityCard
                                            activity={homeActivities[activeDesktopIdx]}
                                            reversed={activeDesktopIdx % 2 === 1}
                                            variant="alternating"
                                            onReadStory={(item) => setActiveModalItem(item)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Bottom Bar: Step Tracker & View All Link */}
                        <div className="w-full flex items-center justify-between pt-2 pb-2 shrink-0 border-t border-gray-100">
                            {/* Step Progress Tracker */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-[#6B9F91] tracking-widest uppercase">
                                    0{activeDesktopIdx + 1} / 0{count}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {homeActivities.map((_, i) => (
                                        <button
                                            key={`step-${i}`}
                                            onClick={() => scrollToDesktopCard(i)}
                                            className={`h-2 rounded-full transition-all duration-400 cursor-pointer ${
                                                activeDesktopIdx === i
                                                    ? 'w-8 bg-[#6B9F91]'
                                                    : 'w-2 bg-gray-200 hover:bg-gray-300'
                                            }`}
                                            title={`Go to blog ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* View All Blogs Navigation Link (Only appears if > 3 blogs) */}
                            {data.length > 3 ? (
                                <Link
                                    href="/blogs"
                                    className="inline-flex items-center justify-center font-bold text-sm text-[#6B9F91] hover:text-[#588478] transition-colors group"
                                >
                                    View All Blogs
                                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <span className="text-xs font-medium text-gray-400">
                                    Scroll down to continue
                                </span>
                            )}
                        </div>
                    </Container>
                </div>
            </div>

            {/* ═════════════════════════════════════════════════════════════════════ */}
            {/* MOBILE TOUCH-SWIPE CAROUSEL (hidden on desktop)                       */}
            {/* ═════════════════════════════════════════════════════════════════════ */}
            <div id="activities-mobile" className="block lg:hidden w-full bg-white py-16 border-t border-gray-100 relative overflow-hidden">
                <Container className="space-y-8">
                    <SectionHeading
                        badge="Blogs & Field Activities"
                        title="Moments That Shape Our Impact"
                        description="Explore our field visits, institutional partnerships, and official dialogues driving modern technology empowerment."
                        align="center"
                    />

                    {/* Mobile Native Horizontal Swipe Deck */}
                    <div className="flex flex-col w-full -mx-4 sm:-mx-6">
                        <div
                            ref={mobileScrollRef}
                            onScroll={handleMobileScroll}
                            className="flex w-full overflow-x-auto snap-x snap-mandatory px-4 sm:px-6 gap-4 sm:gap-5 items-stretch [&::-webkit-scrollbar]:hidden"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {homeActivities.map((activity) => (
                                <div key={`mobile-act-${activity.id}`} className="mobile-activity-card snap-center shrink-0">
                                    <ActivityCard
                                        activity={activity}
                                        variant="mobile-swipe"
                                        onReadStory={(item) => setActiveModalItem(item)}
                                    />
                                </div>
                            ))}
                            <div className="w-2 shrink-0" />
                        </div>

                        {/* Mobile Pagination Indicator Dots */}
                        <div className="w-full flex justify-center items-center gap-2 mt-6 z-10 relative">
                            {homeActivities.map((_, i) => (
                                <button
                                    key={`dot-${i}`}
                                    onClick={() => scrollToMobileCard(i)}
                                    aria-label={`Scroll to blog ${i + 1}`}
                                    className="p-2 focus:outline-none flex items-center justify-center touch-manipulation cursor-pointer"
                                >
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            activeMobileIdx === i
                                                ? 'bg-[#6B9F91] w-7 shadow-sm'
                                                : 'bg-gray-300 w-2 hover:bg-gray-400'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* View All Blogs Navigation Link (Appears ONLY when blogs exceed 3) */}
                    {data.length > 3 && (
                        <div className="w-full flex justify-center mt-2">
                            <Link
                                href="/blogs"
                                className="inline-flex items-center justify-center font-bold text-base text-[#6B9F91] hover:text-[#588478] transition-colors group"
                            >
                                View All Blogs
                                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}
                </Container>
            </div>

            {/* ═════════════════════════════════════════════════════════════════════ */}
            {/* QUICK-VIEW STORY OVERLAY MODAL                                        */}
            {/* ═════════════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {activeModalItem && (
                    <ActivityStoryModal
                        activity={activeModalItem}
                        onClose={() => setActiveModalItem(null)}
                    />
                )}
            </AnimatePresence>
        </>
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

    // Active wheel listener: Intercept ONLY on horizontal scrolling
    useEffect(() => {
        const el = modalImageBoxRef.current;
        if (!el || images.length <= 1) return;

        const onWheel = (e: WheelEvent) => {
            const absX = Math.abs(e.deltaX);
            const absY = Math.abs(e.deltaY);

            if (absX > absY && absX > 8) {
                e.preventDefault();
                const now = Date.now();
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

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [images.length, nextImg, prevImg]);

    const formattedDate = React.useMemo(() => {
        const d = typeof activity.activityDate === 'string' ? new Date(activity.activityDate) : activity.activityDate;
        if (!d || isNaN(new Date(d).getTime())) return '';
        return new Date(d).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
        });
    }, [activity.activityDate]);

    // Keyboard navigation
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
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-[#111827]/80 backdrop-blur-md"
            />

            {/* Modal Dialog (Entire modal is fluidly scrollable) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh] z-10 flex flex-col my-auto border border-gray-100 custom-scrollbar"
            >
                {/* Sticky Close Button (Always visible on top right as modal scrolls) */}
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

                    {/* Subtle Gradient Overlay for Top Badges */}
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
                                aria-label={`Read story on LinkedIn for ${activity.title}`}
                                className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
                            >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.95 0-1.72.78-1.72 1.73s.77 1.73 1.72 1.73 1.73-.78 1.73-1.73c0-.95-.78-1.73-1.73-1.73z" />
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
