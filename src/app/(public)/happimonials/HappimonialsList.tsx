"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, X } from "lucide-react";
import { CardMotion } from "@/components/ui/Card";
import { hoverLift, slideUp } from "@/lib/animations";

function getYouTubeEmbedUrl(url: string) {
    if (!url) return '';
    try {
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1]?.split('&')[0];
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        } else if (url.includes('shorts/')) {
            videoId = url.split('shorts/')[1]?.split('?')[0];
        }
        if (videoId) videoId = videoId.split('#')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
        return url;
    }
}

export function HappimonialsList({ initialStories }: { initialStories: any[] }) {
    const [activeModalStory, setActiveModalStory] = useState<any | null>(null);

    return (
        <div className="w-full">
            {initialStories.length === 0 ? (
                <div className="py-24 text-center flex flex-col items-center justify-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Stories Found</h3>
                    <p className="text-gray-500">There are no client stories available at this time.</p>
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {initialStories.map((item: any) => (
                            <CardMotion
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                {...hoverLift}
                                className="bg-white overflow-hidden rounded-2xl flex flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/30 transition-all duration-300"
                            >
                                {/* Video / Thumbnail Area (Perfect Fit 4:3) */}
                                <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden shrink-0 cursor-pointer">
                                    {item.youtubeUrl ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(item.youtubeUrl)}
                                            className="absolute inset-0 w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : item.thumbnailUrl ? (
                                        <>
                                            <img src={item.thumbnailUrl} alt={item.clientName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/10 group-hover:bg-gray-900/30 transition-colors duration-300">
                                                <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-md shadow-xl flex items-center justify-center text-[#6B9F91] group-hover:scale-110 group-hover:bg-[#6B9F91] group-hover:text-white transition-all duration-300 ease-out z-10 mb-4">
                                                    <Play className="w-6 h-6 ml-1 fill-current" />
                                                </div>
                                                <div className="text-center z-10">
                                                    <p className="text-xs font-bold text-gray-900 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full inline-block shadow-md uppercase tracking-wider">
                                                        Client Story
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#6B9F91]/20 to-[#6B9F91]/5 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center">
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6B9F91 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Content Area (Reduced padding, tight spacing) */}
                                <div className="p-5 md:p-6 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {item.thumbnailUrl && (
                                                <img src={item.thumbnailUrl} alt={item.clientName} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm shrink-0" />
                                            )}
                                            <div>
                                                <h3 className="font-bold text-lg text-[var(--color-heading)] leading-tight tracking-tight">{item.clientName}</h3>
                                                <p className="text-sm font-medium text-gray-500 mt-0.5">{item.companyName}</p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap">
                                            {item.industry}
                                        </span>
                                    </div>

                                    <p className="text-[var(--color-body-text)] text-sm italic flex-1 leading-relaxed line-clamp-3 mb-4 text-gray-600">
                                        "{item.testimonial}"
                                    </p>

                                    <button
                                        onClick={() => setActiveModalStory(item)}
                                        className="mt-auto flex items-center text-sm font-bold text-[#6B9F91] hover:text-[#588478] transition-colors group/btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B9F91] rounded-sm w-max"
                                    >
                                        Read More
                                        <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </CardMotion>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Read More Modal */}
            <AnimatePresence>
                {activeModalStory && (
                    <HappimonialModal story={activeModalStory} onClose={() => setActiveModalStory(null)} />
                )}
            </AnimatePresence>
        </div>
    );
}

function HappimonialModal({ story, onClose }: { story: any, onClose: () => void }) {
    React.useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalStyle;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh] md:max-h-[85vh]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center transition-colors z-10 focus-visible:outline-none"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div
                    className="overflow-y-auto px-6 py-8 md:px-10 md:py-10 flex flex-col h-full [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <div className="flex items-center gap-4 mb-8 shrink-0 pb-6 border-b border-gray-100">
                        {story.thumbnailUrl ? (
                            <img src={story.thumbnailUrl} alt={story.clientName} className="w-14 h-14 rounded-full object-cover border border-gray-100 shadow-sm shrink-0" />
                        ) : (
                            <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 p-[2px]">
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                    <span className="text-gray-500 font-bold text-lg">{story.clientName.charAt(0)}</span>
                                </div>
                            </div>
                        )}
                        <div className="pr-12">
                            <h3 className="font-bold text-xl text-[#111827]">{story.clientName}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="font-semibold text-gray-600 text-sm">
                                    {story.companyName}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="px-2 py-0.5 bg-[#6B9F91]/10 text-[#6B9F91] text-[10px] font-bold uppercase tracking-wider rounded">
                                    {story.industry}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
                        {story.youtubeUrl && (
                            <div className="relative w-full aspect-[16/9] mb-6 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                                <iframe
                                    src={getYouTubeEmbedUrl(story.youtubeUrl)}
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap italic">
                            "{story.testimonial}"
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
