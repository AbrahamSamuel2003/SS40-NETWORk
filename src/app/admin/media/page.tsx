'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Upload, X, Copy, Check, Eye, ExternalLink, FileText, Film } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';

function formatBytes(bytes?: number) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function GlobalMediaPage() {
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
            const res = await fetch('/api/admin/media?limit=100');
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
            formData.append('pageScope', 'GLOBAL');

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-16">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0F766E]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Central Media Library</h1>
                    <p className="text-sm text-[#475569] mt-0.5">Upload, compress, and reuse media assets across all site sections.</p>
                </div>
                <label className={`cursor-pointer admin-button-primary ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-4 h-4" /> {isUploading ? 'Compressing & Uploading...' : 'Upload Media'}
                    <input type="file" onChange={handleUpload} className="hidden" disabled={isUploading} />
                </label>
            </div>

            {/* Compact Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                {mediaItems.length === 0 ? (
                    <div className="col-span-full border border-dashed border-[#CBD5E1] rounded-2xl p-12 text-center bg-white">
                        <Upload className="w-10 h-10 text-[#0F766E]/40 mx-auto mb-3" />
                        <h3 className="text-[#0F172A] font-semibold mb-1 text-sm">No Media Uploaded</h3>
                        <p className="text-[#64748B] text-xs max-w-sm mx-auto">Upload images or videos here. They will be automatically compressed and reusable across all website sections.</p>
                    </div>
                ) : (
                    mediaItems.map(media => (
                        <div 
                            key={media.id} 
                            className="admin-card overflow-hidden group flex flex-col hover:border-[#0F766E]/40 hover:shadow-md transition-all duration-200"
                        >
                            {/* Clickable Image Preview Thumbnail */}
                            <div 
                                onClick={() => setPreviewItem(media)}
                                className="aspect-square bg-slate-50 border-b border-[#E2E8F0] flex items-center justify-center p-2 relative overflow-hidden cursor-pointer group/thumb"
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
                                    <div className="relative w-full h-full flex items-center justify-center bg-slate-900 rounded">
                                        <video src={media.fileUrl} className="w-full h-full object-cover opacity-75" />
                                        <Film className="w-6 h-6 text-white absolute" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-[#64748B] gap-1">
                                        <FileText className="w-8 h-8 text-[#0F766E]/50" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">{media.mediaType}</span>
                                    </div>
                                )}

                                {/* Hover preview overlay badge */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-white/95 text-[#0F172A] text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 backdrop-blur-xs">
                                        <Eye className="w-3 h-3 text-[#0F766E]" /> Inspect
                                    </span>
                                </div>
                            </div>

                            {/* Card Details & Actions */}
                            <div className="p-2.5 flex flex-col flex-1">
                                <div 
                                    className="text-xs font-semibold text-[#0F172A] truncate max-w-full leading-tight" 
                                    title={media.fileName}
                                >
                                    {media.fileName}
                                </div>
                                <div className="text-[10px] text-[#64748B] mt-0.5 flex items-center justify-between">
                                    <span className="truncate max-w-[65%]">{media.mimeType.split('/')[1]?.toUpperCase() || media.mediaType}</span>
                                    <span>{formatBytes(media.fileSize)}</span>
                                </div>

                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-[#F1F5F9]">
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCopy(media.fileUrl, media.id);
                                        }} 
                                        className="text-[#0F766E] hover:text-[#115E59] text-[11px] font-semibold flex items-center gap-1 transition-colors min-h-[32px]"
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
                                        className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded hover:bg-rose-50 min-h-[32px] min-w-[32px] flex items-center justify-center"
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

            {/* Full Lightbox Preview Modal */}
            {previewItem && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
                    onClick={() => setPreviewItem(null)}
                >
                    <div 
                        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAF9] shrink-0">
                            <div className="min-w-0 pr-4">
                                <h3 className="text-sm font-bold text-[#0F172A] truncate" title={previewItem.fileName}>
                                    {previewItem.fileName}
                                </h3>
                                <p className="text-xs text-[#64748B] mt-0.5">
                                    {previewItem.mimeType} · {formatBytes(previewItem.fileSize)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleCopy(previewItem.fileUrl, previewItem.id)}
                                    className="admin-button-secondary text-xs"
                                >
                                    {copiedId === previewItem.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedId === previewItem.id ? 'Copied' : 'Copy URL'}
                                </button>
                                <a 
                                    href={previewItem.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button 
                                    onClick={() => setPreviewItem(null)} 
                                    className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors"
                                    title="Close Preview (Esc)"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Full Image Display Container */}
                        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-900/5 min-h-[300px]">
                            {previewItem.mediaType === 'IMAGE' ? (
                                <img 
                                    src={previewItem.fileUrl} 
                                    alt={previewItem.fileName} 
                                    className="max-w-full max-h-[65vh] w-auto h-auto object-contain rounded-lg shadow-sm border border-[#E2E8F0] bg-white"
                                />
                            ) : previewItem.mediaType === 'VIDEO' ? (
                                <video 
                                    src={previewItem.fileUrl} 
                                    className="max-w-full max-h-[65vh] rounded-lg shadow-sm bg-black" 
                                    controls 
                                    autoPlay 
                                />
                            ) : (
                                <div className="text-center p-8 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                                    <FileText className="w-16 h-16 text-[#0F766E] mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-[#0F172A]">{previewItem.fileName}</p>
                                    <p className="text-xs text-[#64748B] mt-1">{previewItem.mimeType}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer details bar */}
                        <div className="px-5 py-2.5 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-xs text-[#64748B] shrink-0">
                            <span className="truncate max-w-md font-mono text-[11px] text-[#64748B]">
                                {previewItem.fileUrl}
                            </span>
                            <button
                                onClick={() => handleDelete(previewItem.id, previewItem.fileName)}
                                className="text-rose-600 hover:text-rose-700 font-semibold text-xs flex items-center gap-1 transition-colors ml-auto"
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
