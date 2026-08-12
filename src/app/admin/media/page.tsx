'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Link as LinkIcon, Upload, X, Copy, Check } from 'lucide-react';

export default function GlobalMediaPage() {
    const [mediaItems, setMediaItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const res = await fetch('/api/admin/media');
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
        const file = e.target.files[0];

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            // 1. Upload to storage
            const uploadRes = await fetch('/api/admin/media/upload', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();

            if (uploadData.success) {
                // 2. Save metadata scoped to HOME
                let mediaType = 'OTHER';
                if (file.type.startsWith('image/')) mediaType = 'IMAGE';
                else if (file.type.startsWith('video/')) mediaType = 'VIDEO';
                else if (file.type.includes('pdf')) mediaType = 'DOCUMENT';

                await fetch('/api/admin/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileName: uploadData.data.fileName,
                        fileUrl: uploadData.data.url,
                        mimeType: uploadData.data.mimeType,
                        mediaType,
                        fileSize: uploadData.data.size,
                        pageScope: 'GLOBAL'
                    })
                });

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

    if (isLoading) return <div className="p-12 text-center text-white"><div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-white"></div></div>;

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Central Media Library</h2>
                    <p className="text-white/60">Upload and manage reusable media assets for all CMS sections.</p>
                </div>
                <label className={`cursor-pointer bg-[var(--color-primary)] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload Media'}
                    <input type="file" onChange={handleUpload} className="hidden" disabled={isUploading} />
                </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mediaItems.length === 0 ? (
                    <div className="col-span-full border border-dashed border-white/20 rounded-xl p-12 text-center">
                        <Upload className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-1">No Media Uploaded</h3>
                        <p className="text-white/40 text-sm">Upload media elements to use across the entire platform.</p>
                    </div>
                ) : (
                    mediaItems.map(media => (
                        <div key={media.id} className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden group flex flex-col">
                            <div className="aspect-video bg-black/50 border-b border-white/10 flex items-center justify-center p-4 relative">
                                {media.mediaType === 'IMAGE' ? (
                                    <img src={media.fileUrl} alt={media.fileName} className="max-w-full max-h-full object-contain" />
                                ) : media.mediaType === 'VIDEO' ? (
                                    <video src={media.fileUrl} className="max-w-full max-h-full" controls={false} />
                                ) : (
                                    <div className="text-white/40 font-bold uppercase tracking-widest">{media.mediaType}</div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="text-sm font-medium text-white truncate max-w-full" title={media.fileName}>{media.fileName}</div>
                                <div className="text-xs text-white/40 mt-1 flex-1">{media.mimeType} · {(media.fileSize / 1024 / 1024).toFixed(2)} MB</div>

                                <div className="flex justify-between items-center mt-4">
                                    <button onClick={() => handleCopy(media.fileUrl, media.id)} className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1.5 transition-colors">
                                        {copiedId === media.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copiedId === media.id ? 'Copied' : 'Copy URL'}
                                    </button>
                                    <button onClick={() => handleDelete(media.id, media.fileName)} className="text-white/20 hover:text-red-500 transition-colors p-1.5">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
