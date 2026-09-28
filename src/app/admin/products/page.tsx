'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Upload, X, Image as ImageIcon, Star, ExternalLink } from 'lucide-react';
import { compressImageFile } from '@/utils/imageCompressor';
import { MediaSelectorModal } from '@/components/admin/MediaSelectorModal';
import { SectionVisibilityToggle } from '@/components/admin/SectionVisibilityToggle';

export default function ManagedProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [name, setName] = useState('');
    const [marketingTitle, setMarketingTitle] = useState('');
    const [badgeText, setBadgeText] = useState('');
    const [productUrl, setProductUrl] = useState('');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [sortOrder, setSortOrder] = useState(0);
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
        const rawFile = e.target.files[0];
        setIsUploading(true);
        try {
            const file = await compressImageFile(rawFile, { maxWidth: 1600, maxHeight: 1600, quality: 0.85 });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pageScope', 'PRODUCTS');
            const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setScreenshotUrl(data.data.url);
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            alert('Upload error occurred');
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
        if (!confirm('Are you sure you want to delete this product?')) return;
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

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EDF5F2] border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-wider">
                        SaaS & Software Catalog
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1.5">
                        Products & SaaS Suites
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Manage company software products, landing features, screenshots, and live demo links.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <SectionVisibilityToggle
                        sectionKey="products_showcase"
                        sectionLabel="Products Showcase"
                    />
                    <button
                        onClick={() => handleOpenModal()}
                        className="admin-button-primary text-xs !py-2.5 !px-4"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            {/* Products Card / Table Wrapper */}
            <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs">
                {/* ── MOBILE VIEW: 2-Column Grid Cards ── */}
                <div className="block lg:hidden p-2.5">
                    {isLoading ? (
                        <div className="p-10 text-center text-gray-400 text-xs font-medium">
                            <div className="animate-spin rounded-full h-5 w-5 mx-auto border-2 border-[#0F766E] border-t-transparent mb-2" />
                            Loading products...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 text-xs font-medium">
                            No products created yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {products.map((item) => (
                                <div key={item.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                    <div className="space-y-1.5">
                                        {item.imageUrl ? (
                                            <div className="w-full h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center relative">
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                {item.isFeatured && (
                                                    <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 bg-amber-50/90 backdrop-blur-xs text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between gap-1">
                                                {item.isFeatured && (
                                                    <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center justify-between gap-1">
                                                <h4 className="text-xs font-bold text-[#0F172A] leading-tight truncate" title={item.name}>
                                                    {item.name}
                                                </h4>
                                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider shrink-0 ${item.isActive ? 'bg-[#EDF5F2] text-[#0F766E] border border-[#0F766E]/20' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                                    {item.isActive ? 'Active' : 'Draft'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-[#0F766E] font-medium truncate mt-0.5" title={item.marketingTitle}>
                                                {item.marketingTitle}
                                            </p>
                                        </div>

                                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                                        {item.productUrl ? (
                                            <a
                                                href={item.productUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 bg-gray-50 hover:bg-[#EDF5F2] text-[#0F766E] rounded-lg border border-gray-200 transition-colors flex items-center justify-center"
                                                title="Open Demo"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        ) : <div />}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center"
                                                title="Edit Product"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors flex items-center justify-center"
                                                title="Delete Product"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── DESKTOP VIEW: Full Table ── */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="admin-table">
                        <thead className="admin-table-head">
                            <tr>
                                <th className="p-4">Product Details</th>
                                <th className="p-4">Marketing Title</th>
                                <th className="p-4">Tags</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400">
                                        <div className="animate-spin rounded-full h-5 w-5 mx-auto border-2 border-[#0F766E] border-t-transparent mb-2" />
                                        Loading products...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-gray-400 text-xs font-medium">
                                        No products found. Click "Add Product" to create one.
                                    </td>
                                </tr>
                            ) : (
                                products.map((item) => (
                                    <tr key={item.id} className="admin-table-row">
                                        <td className="p-4 font-medium">
                                            <div className="font-bold text-[#0F172A] text-sm">{item.name}</div>
                                            <div className="text-gray-500 text-xs truncate max-w-xs">{item.description}</div>
                                            {item.productUrl && (
                                                <a href={item.productUrl} target="_blank" rel="noreferrer" className="text-[11px] text-[#0F766E] font-semibold hover:underline inline-flex items-center gap-1 mt-1">
                                                    <ExternalLink className="w-3 h-3" /> Visit Live Demo
                                                </a>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-[#0F172A] text-xs font-semibold mb-1">{item.marketingTitle}</div>
                                            {item.badgeText && (
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#EDF5F2] text-[#0F766E] border border-[#0F766E]/20 px-2 py-0.5 rounded-full">
                                                    {item.badgeText}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(item.tags) && item.tags.slice(0, 3).map((tag: string, i: number) => (
                                                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {Array.isArray(item.tags) && item.tags.length > 3 && (
                                                    <span className="text-[10px] text-gray-400">+{item.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${item.isActive ? 'bg-[#EDF5F2] text-[#0F766E] border border-[#0F766E]/20' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                {item.isFeatured && (
                                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="px-3 py-1.5 rounded-xl border border-[#0F766E]/30 text-[#0F766E] text-xs font-bold hover:bg-[#EDF5F2] transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Edit / Create Modal */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-panel max-w-2xl">
                        {/* Modal Header */}
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#EDF5F2]/50 shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-[#0F172A]">
                                    {editingId ? 'Edit Product Details' : 'Create New Product'}
                                </h3>
                                <p className="text-xs text-gray-500">Provide product meta, imagery, and external URLs</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
                            {errorMsg && (
                                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            <form id="productForm" onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Product Name *</label>
                                        <input
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="admin-input !text-xs"
                                            placeholder="e.g. ClearInvoice"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Marketing Title *</label>
                                        <input
                                            required
                                            value={marketingTitle}
                                            onChange={e => setMarketingTitle(e.target.value)}
                                            className="admin-input !text-xs"
                                            placeholder="Smart Invoicing for Fast-Growing Teams"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Badge Text (Optional)</label>
                                        <input
                                            value={badgeText}
                                            onChange={e => setBadgeText(e.target.value)}
                                            className="admin-input !text-xs"
                                            placeholder="e.g. LIVE PRODUCT, ENTERPRISE"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Live Demo URL (Optional)</label>
                                        <input
                                            value={productUrl}
                                            onChange={e => setProductUrl(e.target.value)}
                                            className="admin-input !text-xs"
                                            placeholder="https://clearinvoice.app"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Feature Tags (Comma Separated)</label>
                                    <input
                                        value={tagsInput}
                                        onChange={e => setTagsInput(e.target.value)}
                                        className="admin-input !text-xs"
                                        placeholder="GST Ready, Cloud Backup, Multi-Currency, Analytics"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Detailed Summary / Description *</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="admin-input !text-xs resize-none"
                                        placeholder="Highlight architecture, target audience, and key offerings..."
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#0F172A] block mb-1.5">Product Artwork / Screenshot</label>
                                    {screenshotUrl && (
                                        <div className="relative w-full max-h-[180px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 mb-3 group flex items-center justify-center p-2">
                                            <img src={screenshotUrl} alt="Product preview" className="max-h-[160px] w-auto max-w-full object-contain rounded-xl shadow-xs" />
                                            <button
                                                type="button"
                                                onClick={() => setScreenshotUrl('')}
                                                className="absolute top-2 right-2 bg-white p-1.5 rounded-full text-gray-500 hover:text-rose-600 shadow-md transition-colors"
                                                title="Remove image"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <label className={`flex items-center justify-center gap-2 border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-2.5 cursor-pointer transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <Upload className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs font-bold text-gray-700">{isUploading ? 'Compressing & Uploading...' : screenshotUrl ? 'Replace Local Image' : 'Upload Local Image'}</span>
                                            <input type="file" accept="image/*" onChange={handleUploadLocal} className="hidden" disabled={isUploading} />
                                        </label>

                                        <button
                                            type="button"
                                            onClick={() => setIsMediaSelectorOpen(true)}
                                            className="flex items-center justify-center gap-2 border border-[#0F766E]/30 bg-[#EDF5F2] hover:bg-[#EDF5F2]/80 text-[#0F766E] rounded-xl px-4 py-2.5 transition-colors cursor-pointer text-xs font-bold"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                            <span>Pick from Media Library</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100">
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={e => setIsActive(e.target.checked)}
                                            className="w-4 h-4 rounded text-[#0F766E] focus:ring-[#0F766E]"
                                        />
                                        <span className="text-xs font-bold text-[#0F172A]">Published / Active</span>
                                    </label>

                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isFeatured}
                                            onChange={e => setIsFeatured(e.target.checked)}
                                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                                        />
                                        <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
                                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                            Featured Product
                                        </span>
                                    </label>

                                    <div className="flex items-center gap-2 ml-auto">
                                        <span className="text-xs font-semibold text-gray-500">Order:</span>
                                        <input
                                            type="number"
                                            value={sortOrder}
                                            onChange={e => setSortOrder(parseInt(e.target.value) || 0)}
                                            className="w-16 bg-white border border-gray-200 rounded-xl px-2 py-1 text-xs text-center font-bold text-[#0F172A]"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-3.5 border-t border-gray-100 flex justify-end gap-2.5 bg-gray-50 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="admin-button-secondary text-xs !py-2 !px-4"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="productForm"
                                disabled={isSaving}
                                className="admin-button-primary text-xs !py-2 !px-5 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving Product...' : 'Save Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isMediaSelectorOpen && (
                <MediaSelectorModal
                    onClose={() => setIsMediaSelectorOpen(false)}
                    onSelect={(url) => {
                        setScreenshotUrl(url);
                        setIsMediaSelectorOpen(false);
                    }}
                />
            )}
        </div>
    );
}
