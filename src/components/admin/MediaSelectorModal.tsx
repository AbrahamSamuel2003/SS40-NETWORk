'use client';

import React, { useState, useEffect } from 'react';
import { X, Search, Image as ImageIcon } from 'lucide-react';

interface MediaSelectorModalProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

export function MediaSelectorModal({ onSelect, onClose }: MediaSelectorModalProps) {
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/media?limit=100');
            const data = await res.json();
            if (data.success) {
                setMediaItems(data.data);
            }
        } catch (e) {
            console.error('Failed to fetch media', e);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredMedia = mediaItems.filter(m => 
        m.fileName.toLowerCase().includes(search.toLowerCase()) || 
        (m.altText && m.altText.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-[#111827]/40 backdrop-blur-sm shadow-2xl">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200 flex justify-between items-center bg-[#D8E8E2]/80">
                    <div>
                        <h3 className="text-sm sm:text-base font-bold text-[#111827] flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B9F91]" />
                            Select from Media Library
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#6B7280] mt-0.5">Click on an image or video to select it</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-200/50 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="px-4 py-2.5 sm:px-5 sm:py-3 border-b border-gray-100 bg-white">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search media..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#6B9F91] focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-5 custom-scrollbar bg-gray-50/50">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6B9F91]"></div>
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="text-center py-12">
                            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium text-sm">No media found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
                            {filteredMedia.map((media) => (
                                <button
                                    type="button"
                                    key={media.id}
                                    onClick={() => onSelect(media.fileUrl)}
                                    className="group relative aspect-square bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#6B9F91] hover:ring-2 hover:ring-[#6B9F91]/20 transition-all text-left focus:outline-none flex items-center justify-center"
                                >
                                    {media.mediaType === 'IMAGE' ? (
                                        <img src={media.fileUrl} alt={media.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : media.mediaType === 'VIDEO' ? (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <video src={media.fileUrl} className="max-w-full max-h-full opacity-80" />
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-400 uppercase tracking-widest">{media.mediaType}</div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-[10px] truncate">{media.fileName}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
