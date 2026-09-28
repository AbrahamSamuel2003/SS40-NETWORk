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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/50 backdrop-blur-xs shadow-2xl animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#EDF5F2]/50">
                    <div>
                        <h3 className="text-sm sm:text-base font-bold text-[#0F172A] flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-[#0F766E]" />
                            Select from Media Assets
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Click any asset thumbnail to apply it to your current form</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 py-3 border-b border-gray-100 bg-white">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter by filename..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="admin-input !pl-10 !text-xs"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-gray-50/50">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-48 gap-2 text-gray-400 text-xs">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#0F766E] border-t-transparent" />
                            <span>Loading media gallery...</span>
                        </div>
                    ) : filteredMedia.length === 0 ? (
                        <div className="text-center py-12">
                            <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 font-medium text-xs">No media assets found matching search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {filteredMedia.map((media) => (
                                <button
                                    type="button"
                                    key={media.id}
                                    onClick={() => onSelect(media.fileUrl)}
                                    className="group relative aspect-square bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#0F766E] hover:ring-2 hover:ring-[#0F766E]/20 transition-all text-left focus:outline-none flex items-center justify-center cursor-pointer shadow-2xs"
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
                                        <p className="text-white text-[10px] truncate font-medium">{media.fileName}</p>
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
