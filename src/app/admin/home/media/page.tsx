'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, X, Copy, Check, Eye, ExternalLink, Download, FileText, Film, Image as ImageIcon } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';

function formatBytes(bytes?: number) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function HomeMediaPage() {
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [previewItem, setPreviewItem] = useState<any | null>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    // Close preview on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreviewItem(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/admin/media?pageScope=HOME');
            const data = await res.json();
            if (data.success) {
                setMediaItems(data.data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const rawFile = e.target.files[0];

        setIsUploading(true);
        try {
            const file = await compressImageFile(rawFile);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pageScope', 'HOME');

            const uploadRes = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (uploadData.success) {
                fetchMedia();
            }
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleDelete = async (id: string, fileName: string) => {
        if (!confirm(`Delete ${fileName}?`)) return;
        try {
            await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
            if (previewItem?.id === id) setPreviewItem(null);
            fetchMedia();
        } catch (e) {
            console.error(e);
        }
    };

    const handleCopy = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (isLoading) return <div className="p-12 text-center text-[#111827]"><div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-gray-200"></div></div>;

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-1">Home Page Media</h2>
                    <p className="text-[#6B7280] text-sm">Upload, compress, and manage media assets scoped for the Home page. Click any card to inspect the full image.</p>
                </div>
                <label className={`cursor-pointer bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-4 h-4" /> {isUploading ? 'Compressing & Uploading...' : 'Upload Media'}
                    <input type="file" onChange={handleUpload} className="hidden" disabled={isUploading} />
                </label>
            </div>

            {/* Compact Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                {mediaItems.length === 0 ? (
                    <div className="col-span-full border border-dashed border-gray-200 rounded-2xl p-12 text-center bg-white/50">
                        <Upload className="w-10 h-10 text-[#6B9F91]/40 mx-auto mb-3" />
                        <h3 className="text-[#111827] font-semibold mb-1 text-sm">No Media Uploaded</h3>
                        <p className="text-[#9CA3AF] text-xs max-w-sm mx-auto">Upload media elements specifically scoped for the Home page layout.</p>
                    </div>
                ) : (
                    mediaItems.map(media => (
                        <div 
                            key={media.id} 
                            className="admin-card overflow-hidden group flex flex-col hover:border-[#6B9F91]/50 hover:shadow-md transition-all duration-200 rounded-xl bg-white border border-gray-200/80"
                        >
                            {/* Clickable Image Preview Thumbnail */}
                            <div 
                                onClick={() => setPreviewItem(media)}
                                className="aspect-square bg-gray-50/70 border-b border-gray-100 flex items-center justify-center p-2 relative overflow-hidden cursor-pointer group/thumb"
                                title="Click to view full preview"
                            >
                                {media.mediaType === 'IMAGE' ? (
                                    <img 
                                        src={media.fileUrl} 
                                        alt={media.fileName} 
                                        className="w-full h-full object-contain transition-transform duration-300 group-hover/thumb:scale-105" 
                                        loading="lazy"
                                    />
                                ) : media.mediaType === 'VIDEO' ? (
                                    <div className="relative w-full h-full flex items-center justify-center bg-gray-900 rounded">
                                        <video src={media.fileUrl} className="w-full h-full object-cover opacity-75" />
                                        <Film className="w-6 h-6 text-white absolute" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400 gap-1">
                                        <FileText className="w-8 h-8 text-[#6B9F91]/50" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">{media.mediaType}</span>
                                    </div>
                                )}

                                {/* Hover preview overlay badge */}
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 backdrop-blur-xs">
                                        <Eye className="w-3 h-3 text-[#6B9F91]" /> Inspect
                                    </span>
                                </div>
                            </div>

                            {/* Card Details & Actions */}
                            <div className="p-2.5 flex flex-col flex-1">
                                <div 
                                    className="text-xs font-semibold text-[#111827] truncate max-w-full leading-tight" 
                                    title={media.fileName}
                                >
                                    {media.fileName}
                                </div>
                                <div className="text-[10px] text-[#9CA3AF] mt-0.5 flex items-center justify-between">
                                    <span className="truncate max-w-[65%]">{media.mimeType.split('/')[1]?.toUpperCase() || media.mediaType}</span>
                                    <span>{formatBytes(media.fileSize)}</span>
                                </div>

                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-gray-100">
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopy(media.fileUrl, media.id);
                                        }} 
                                        className="text-[#6B9F91] hover:text-[#5C8C80] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                    >
                                        {copiedId === media.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copiedId === media.id ? 'Copied' : 'Copy'}
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(media.id, media.fileName);
                                        }} 
                                        className="text-gray-400 hover:text-[#B91C1C] transition-colors p-1 rounded hover:bg-red-50"
                                        title="Delete Asset"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Crystal-Clear Full Lightbox Preview Modal */}
            {previewItem && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
                    onClick={() => setPreviewItem(null)}
                >
                    <div 
                        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/90 shrink-0">
                            <div className="min-w-0 pr-4">
                                <h3 className="text-sm font-bold text-[#111827] truncate" title={previewItem.fileName}>
                                    {previewItem.fileName}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {previewItem.mimeType} · {formatBytes(previewItem.fileSize)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleCopy(previewItem.fileUrl, previewItem.id)}
                                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:border-[#6B9F91] hover:text-[#6B9F91] transition-colors flex items-center gap-1.5 shadow-xs"
                                >
                                    {copiedId === previewItem.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedId === previewItem.id ? 'Copied' : 'Copy URL'}
                                </button>
                                <a 
                                    href={previewItem.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button 
                                    onClick={() => setPreviewItem(null)} 
                                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
                                    title="Close Preview (Esc)"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Full Image Display Container (No Cropping / No Distortion) */}
                        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-gray-900/5 min-h-[300px]">
                            {previewItem.mediaType === 'IMAGE' ? (
                                <img 
                                    src={previewItem.fileUrl} 
                                    alt={previewItem.fileName} 
                                    className="max-w-full max-h-[65vh] w-auto h-auto object-contain rounded-lg shadow-sm border border-gray-200 bg-white"
                                />
                            ) : previewItem.mediaType === 'VIDEO' ? (
                                <video 
                                    src={previewItem.fileUrl} 
                                    className="max-w-full max-h-[65vh] rounded-lg shadow-sm bg-black" 
                                    controls 
                                    autoPlay 
                                />
                            ) : (
                                <div className="text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <FileText className="w-16 h-16 text-[#6B9F91] mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-gray-800">{previewItem.fileName}</p>
                                    <p className="text-xs text-gray-400 mt-1">{previewItem.mimeType}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer details bar */}
                        <div className="px-5 py-2.5 border-t border-gray-100 bg-white flex items-center justify-between text-xs text-gray-500 shrink-0">
                            <span className="truncate max-w-md font-mono text-[11px] text-gray-400">
                                {previewItem.fileUrl}
                            </span>
                            <button
                                onClick={() => handleDelete(previewItem.id, previewItem.fileName)}
                                className="text-red-500 hover:text-red-700 font-semibold text-xs flex items-center gap-1 transition-colors ml-auto"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> Delete File
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
