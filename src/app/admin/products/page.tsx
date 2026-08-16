'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle, X, ExternalLink } from 'lucide-react';

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
            setIsActive(true);
            setIsFeatured(false);
            setSortOrder(0);
        }
        setErrorMsg('');
        setIsModalOpen(true);
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
                <table className="w-full text-left text-sm text-[#374151]">
                    <thead className="bg-[#EDF5F2]/70 border-b border-gray-200 text-[#111827]">
                        <tr>
                            <th className="p-4 font-medium">Product Details</th>
                            <th className="p-4 font-medium">Marketing Title</th>
                            <th className="p-4 font-medium">Tags</th>
                            <th className="p-4 font-medium text-center">Status</th>
                            <th className="p-4 font-medium text-right">Actions</th>
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
                                    <td className="p-4">
                                        <div className="text-[#111827] text-xs mb-1">{item.marketingTitle}</div>
                                        {item.badgeText && (
                                            <span className="text-[10px] font-bold tracking-widest uppercase bg-[#EDF5F2] px-1.5 py-0.5 rounded text-[#6B7280]">{item.badgeText}</span>
                                        )}
                                    </td>
                                    <td className="p-4">
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
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleOpenModal(item)} className="text-[#9CA3AF] hover:text-[#111827] p-2 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-2 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
                    <div className="admin-card w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/70">
                            <h3 className="text-lg font-bold text-[#111827]">{editingId ? 'Edit Product' : 'Add Product'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#111827]"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full custom-scrollbar">
                            {errorMsg && <div className="mb-4 text-sm text-[#B91C1C] bg-[#FEE2E2] p-3 rounded-lg border border-[#FCA5A5] flex gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}</div>}

                            <form id="productForm" onSubmit={handleSave} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-[#374151] mb-1.5">Product Name *</label>
                                        <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" placeholder="e.g. ClearInvoice" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#374151] mb-1.5">Marketing Title *</label>
                                        <input required value={marketingTitle} onChange={e => setMarketingTitle(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" placeholder="Smart Invoicing Built For Modern Businesses" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-[#374151] mb-1.5">Badge Text (optional)</label>
                                        <input value={badgeText} onChange={e => setBadgeText(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" placeholder="e.g. OUR PRODUCT" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-[#374151] mb-1.5">Live URL (optional)</label>
                                        <input value={productUrl} onChange={e => setProductUrl(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827] placeholder:text-[#9CA3AF]" placeholder="https://" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-[#374151] mb-1.5">Tags (comma separated)</label>
                                    <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827]" placeholder="Tax, Billing, Software..." />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#374151] mb-1.5">Description *</label>
                                    <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-[#111827] resize-y" placeholder="Brief product summary..." />
                                </div>

                                <div className="pt-2 flex flex-wrap gap-6 border-t border-gray-100 mt-4">
                                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                        <div className="relative"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only" /><div className={`w-10 h-6 rounded-full transition-colors ${isActive ? 'bg-[#6B9F91]' : 'bg-[#EDF5F2]'}`}></div><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                        <span className="text-sm font-medium text-[#374151]">Active</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                        <div className="relative"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="sr-only" /><div className={`w-10 h-6 rounded-full transition-colors ${isFeatured ? 'bg-yellow-500' : 'bg-[#EDF5F2]'}`}></div><div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                        <span className="text-sm font-medium text-[#374151]">Featured</span>
                                    </label>
                                    <div className="flex items-center gap-3 pt-2">
                                        <span className="text-sm font-medium text-[#374151]">Sort Order</span>
                                        <input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} className="w-20 bg-white border border-gray-200 rounded-lg px-2 py-1 text-[#111827] text-center" />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-[#EDF5F2]/70">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-[#6B7280] hover:bg-[#EDF5F2]/70">Cancel</button>
                            <button type="submit" form="productForm" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-6 py-2 rounded-lg disabled:opacity-50">Save Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
