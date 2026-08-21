'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, X, ExternalLink, Upload, Image as ImageIcon, ZoomIn, ZoomOut, Check, RefreshCw } from 'lucide-react';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';

export default function ManagedProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states (Product-specific fields)
    const [name, setName] = useState('');
    const [marketingTitle, setMarketingTitle] = useState('');
    const [badgeText, setBadgeText] = useState('');
    const [productUrl, setProductUrl] = useState('');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false); // Kept since it's in our DB model
    const [sortOrder, setSortOrder] = useState(0);
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Image Cropper States
    const [editorImage, setEditorImage] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Redraw canvas on changes
    useEffect(() => {
        if (!editorImage || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new Image();
        img.crossOrigin = 'anonymous'; // prevent tainted canvas issues
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw image relative to current zoom and drag position
            const w = img.width * zoom;
            const h = img.height * zoom;
            ctx.drawImage(img, position.x, position.y, w, h);
        };
        img.src = editorImage;
    }, [editorImage, zoom, position]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleApplyCrop = () => {
        if (!canvasRef.current) return;
        setIsUploading(true);
        canvasRef.current.toBlob(async (blob) => {
            if (!blob) {
                setIsUploading(false);
                return;
            }
            try {
                const formData = new FormData();
                formData.append('file', blob, 'cropped-product.png');
                const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) {
                    setScreenshotUrl(data.data.url);
                    setEditorImage(null); // Hide editor
                } else {
                    alert('Failed to save cropped image.');
                }
            } catch (e) {
                alert('Upload error.');
            } finally {
                setIsUploading(false);
            }
        }, 'image/png');
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            } else {
                setErrorMsg(data.error);
            }
        } catch (e) {
            setErrorMsg('Failed to load products.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item?: any) => {
        if (item) {
            setEditingId(item.id);
            setName(item.name || '');
            setMarketingTitle(item.marketingTitle || '');
            setBadgeText(item.badgeText || '');
            setProductUrl(item.productUrl || '');
            setDescription(item.description || '');
            setTagsInput(Array.isArray(item.tags) ? item.tags.join(', ') : '');
            setScreenshotUrl(item.screenshotUrl || '');
            setIsActive(item.isActive ?? true);
            setIsFeatured(item.isFeatured ?? false);
            setSortOrder(item.sortOrder || 0);
        } else {
            setEditingId(null);
            setName('');
            setMarketingTitle('');
            setBadgeText('');
            setProductUrl('');
            setDescription('');
            setTagsInput('');
            setScreenshotUrl('');
            setIsActive(true);
            setIsFeatured(false);
            setSortOrder(0);
        }
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleUploadLocal = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', e.target.files[0]);
            const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setEditorImage(data.data.url);
                setZoom(1);
                setPosition({ x: 0, y: 0 });
            } else {
                alert('Upload failed');
            }
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrorMsg('');

        const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');

        const payload = {
            name,
            marketingTitle,
            badgeText,
            productUrl,
            description,
            tags,
            screenshotUrl,
            isActive,
            isFeatured,
            sortOrder
        };

        try {
            const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products';
            const res = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchData();
            } else {
                setErrorMsg(data.error);
            }
        } catch (err) {
            setErrorMsg('Failed to save product.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if ((await res.json()).success) {
                fetchData();
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            alert('Error deleting product');
        }
    };

    if (isLoading) return <div className="p-12 text-center text-[#111827]"><div className="animate-spin rounded-full h-8 w-8 mx-auto border-t-2 border-b-2 border-gray-200"></div></div>;

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Managed Products</h2>
                    <p className="text-[#6B7280]">Manage software products displayed on the Products page.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                </button>
            </div>

            <div className="admin-card overflow-hidden">
                {/* ── MOBILE CARD GRID (hidden on sm+) ── */}
                <div className="sm:hidden">
                    {products.length === 0 ? (
                        <div className="p-8 text-center text-[#9CA3AF]">No products found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-3">
                            {products.map(item => (
                                <div key={item.id} className="admin-card p-3 flex flex-col gap-2 rounded-xl">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold text-[#111827] text-sm leading-tight line-clamp-2">{item.name}</span>
                                        <button onClick={() => handleOpenModal(item)} className="shrink-0 p-1 text-[#9CA3AF] hover:text-[#111827]">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[#6B7280] text-xs leading-snug line-clamp-2">{item.description}</p>
                                    <div className="mt-auto pt-1 flex items-center justify-between">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${item.isActive ? 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20' : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'}`}>• {item.isActive ? 'Active' : 'Inactive'}</span>
                                        <button onClick={() => handleDelete(item.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-1">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── DESKTOP TABLE (hidden on mobile) ── */}
                <div className="hidden sm:block overflow-x-auto w-full touch-auto">
                    <table className="w-full text-left text-sm text-[#374151] min-w-[600px]">
                        <thead className="bg-[#EDF5F2]/70 border-b border-gray-200 text-[#111827]">
                            <tr>
                                <th className="p-4 font-medium min-w-[180px]">Product Details</th>
                                <th className="p-4 font-medium min-w-[150px] hidden sm:table-cell">Marketing Title</th>
                                <th className="p-4 font-medium min-w-[120px] hidden md:table-cell">Tags</th>
                                <th className="p-4 font-medium text-center min-w-[100px]">Status</th>
                                <th className="p-4 font-medium text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-[#9CA3AF]">No products found.</td></tr>
                            ) : (
                                products.map(item => (
                                    <tr key={item.id} className="hover:bg-[#EDF5F2]/50">
                                        <td className="p-4 font-medium">
                                            <div className="text-[#111827]">{item.name}</div>
                                            <div className="text-[#9CA3AF] text-xs truncate max-w-xs">{item.description}</div>
                                            {item.productUrl && (
                                                <div className="mt-1">
                                                    <a href={item.productUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#6B9F91] hover:underline flex items-center gap-1">
                                                        <ExternalLink className="w-3 h-3" /> URL Link
                                                    </a>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            <div className="text-[#111827] text-xs mb-1">{item.marketingTitle}</div>
                                            {item.badgeText && (
                                                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#EDF5F2] px-1.5 py-0.5 rounded text-[#6B7280]">{item.badgeText}</span>
                                            )}
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag: string, i: number) => (
                                                    <span key={i} className="text-[10px] bg-[#EDF5F2] px-1.5 py-0.5 rounded text-[#6B7280]">{tag}</span>
                                                ))}
                                                {Array.isArray(item.tags) && item.tags.length > 3 && (
                                                    <span className="text-[10px] text-[#9CA3AF]">+{item.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${item.isActive ? 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20' : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                {item.isFeatured && (
                                                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-col xl:flex-row gap-1.5 justify-end ml-auto shrink-0">
                                                <button onClick={() => handleOpenModal(item)} className="px-3 py-1 rounded border border-gray-300 text-[#374151] text-xs font-medium hover:bg-[#EDF5F2]/70 hover:border-[#6B9F91] transition-colors whitespace-nowrap">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 rounded border border-[#FCA5A5] text-[#B91C1C] text-xs font-medium hover:bg-red-50 transition-colors whitespace-nowrap">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
                    <div className="admin-card w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/80 shrink-0">
                            <div>
                                <h3 className="text-sm font-bold text-[#111827]">{editingId ? 'Edit Product' : 'Add Product'}</h3>
                                <p className="text-[10px] text-[#9CA3AF] mt-0.5">Fill in the product details below</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#111827] p-1"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-4 overflow-y-auto w-full custom-scrollbar">
                            {errorMsg && <div className="mb-3 text-xs text-[#B91C1C] bg-[#FEE2E2] px-3 py-2 rounded border border-[#FCA5A5] flex gap-2"><AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMsg}</div>}

                            <form id="productForm" onSubmit={handleSave} className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-[#374151] mb-1">Product Name *</label>
                                        <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]" placeholder="e.g. ClearInvoice" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#374151] mb-1">Marketing Title *</label>
                                        <input required value={marketingTitle} onChange={e => setMarketingTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]" placeholder="Smart Invoicing Built For Modern Businesses" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-[#374151] mb-1">Badge Text <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
                                        <input value={badgeText} onChange={e => setBadgeText(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]" placeholder="e.g. OUR PRODUCT" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-[#374151] mb-1">Live URL <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
                                        <input value={productUrl} onChange={e => setProductUrl(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91] placeholder:text-[#9CA3AF]" placeholder="https://" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1">Tags <span className="text-[#9CA3AF] font-normal">(comma separated)</span></label>
                                    <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]" placeholder="Tax, Billing, Software..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1">Description *</label>
                                    <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] resize-y focus:outline-none focus:border-[#6B9F91]" placeholder="Brief product summary..." />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1">Product Screenshot</label>
                                    <p className="text-[10px] text-[#9CA3AF] mb-2">Fits standard aspect ratio 16:11 on website. You can edit/crop below after selection.</p>
                                    
                                    {/* Crop Editor Canvas Workspace */}
                                    {editorImage && (
                                        <div className="border border-[#6B9F91]/40 rounded-xl p-3 bg-[#EDF5F2]/20 mb-3 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider">Image Editor (Ratio: 16:11)</span>
                                            </div>
                                            <div className="flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden relative cursor-move">
                                                <canvas 
                                                    ref={canvasRef} 
                                                    width={480} 
                                                    height={330} 
                                                    onMouseDown={handleMouseDown}
                                                    onMouseMove={handleMouseMove}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseLeave={handleMouseUp}
                                                    className="max-w-full aspect-[16/11] object-contain border border-gray-800"
                                                />
                                                <div className="absolute bottom-2 left-2 right-2 flex justify-between bg-black/60 backdrop-blur-sm p-1.5 rounded-lg">
                                                    <span className="text-[9px] text-white flex items-center">Drag image to position crop</span>
                                                    <div className="flex items-center gap-2">
                                                        <button type="button" onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-1 hover:bg-white/10 rounded text-white" title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></button>
                                                        <span className="text-[9px] text-white font-mono">{Math.round(zoom * 100)}%</span>
                                                        <button type="button" onClick={() => setZoom(z => Math.min(5, z + 0.1))} className="p-1 hover:bg-white/10 rounded text-white" title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={handleApplyCrop} disabled={isUploading} className="flex-1 flex items-center justify-center gap-1.5 bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] py-1.5 rounded-lg text-xs font-medium disabled:opacity-50">
                                                    <Check className="w-3.5 h-3.5" /> {isUploading ? 'Saving...' : 'Apply & Save Crop'}
                                                </button>
                                                <button type="button" onClick={() => setEditorImage(null)} className="px-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 rounded-lg text-xs font-medium">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {screenshotUrl && !editorImage && (
                                        <div className="relative w-full aspect-[16/11] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 mb-3 group flex items-center justify-center">
                                            <img src={screenshotUrl} alt="Screenshot" className="w-full h-full object-contain p-2" />
                                            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button type="button" onClick={() => { setEditorImage(screenshotUrl); setZoom(1); setPosition({ x: 0, y: 0 }); }} className="bg-white/90 p-1.5 rounded-full text-gray-500 hover:text-[#6B9F91] shadow-sm" title="Edit / Recrop">
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                </button>
                                                <button type="button" onClick={() => setScreenshotUrl('')} className="bg-white/90 p-1.5 rounded-full text-gray-500 hover:text-red-500 shadow-sm" title="Delete">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        <label className={`flex-1 flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg px-4 py-2 cursor-pointer transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <Upload className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs font-medium text-[#374151]">{isUploading ? 'Uploading...' : 'Upload Local File'}</span>
                                            <input type="file" accept="image/*" onChange={handleUploadLocal} className="hidden" disabled={isUploading} />
                                        </label>
                                        <button type="button" onClick={() => setIsMediaSelectorOpen(true)} className="flex-1 flex items-center justify-center gap-2 border border-[#6B9F91]/30 bg-[#EDF5F2]/50 hover:bg-[#EDF5F2] rounded-lg px-4 py-2 transition-colors">
                                            <ImageIcon className="w-4 h-4 text-[#6B9F91]" />
                                            <span className="text-xs font-medium text-[#111827]">Select from Media</span>
                                        </button>
                                        {screenshotUrl && !editorImage && (
                                            <button type="button" onClick={() => { setEditorImage(screenshotUrl); setZoom(1); setPosition({ x: 0, y: 0 }); }} className="flex-1 flex items-center justify-center gap-2 border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-600 rounded-lg px-4 py-2 transition-colors">
                                                <RefreshCw className="w-4 h-4" />
                                                <span className="text-xs font-medium">Edit / Recrop</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 border-t border-gray-100">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="relative shrink-0"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" /><div className={`w-8 h-5 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2]'}`}></div><div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-3' : 'translate-x-0'}`}></div></div>
                                        <span className="text-xs font-medium text-[#374151]">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="relative shrink-0"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" /><div className={`w-8 h-5 rounded-full transition-colors ${isFeatured ? 'bg-yellow-500' : 'bg-[#EDF5F2]'}`}></div><div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-3' : 'translate-x-0'}`}></div></div>
                                        <span className="text-xs font-medium text-[#374151]">Featured</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-[#374151]">Sort Order</span>
                                        <input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} className="w-16 bg-white border border-gray-200 rounded-md px-2 py-1 text-sm text-[#111827] text-center focus:outline-none focus:border-[#6B9F91]" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="px-4 py-2.5 border-t border-gray-200 flex justify-end gap-2 bg-[#EDF5F2]/50 shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 rounded-md text-xs text-[#6B7280] hover:bg-[#EDF5F2]/70 font-medium">Cancel</button>
                            <button type="submit" form="productForm" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-5 py-1.5 rounded-md text-xs font-medium disabled:opacity-50">Save Product</button>
                        </div>
                    </div>
                </div>
            )}

            {isMediaSelectorOpen && (
                <MediaSelectorModal
                    onClose={() => setIsMediaSelectorOpen(false)}
                    onSelect={(url) => {
                        setEditorImage(url);
                        setZoom(1);
                        setPosition({ x: 0, y: 0 });
                        setIsMediaSelectorOpen(false);
                    }}
                />
            )}
        </div>
    );
}
