'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, AlertCircle, X, Search } from 'lucide-react';

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('active'); // 'active' (not spam), 'all', 'NEW', 'CONTACTED', 'CONVERTED', 'SPAM'
    const [archivedFilter, setArchivedFilter] = useState('false');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // View/Edit Lead states
    const [leadData, setLeadData] = useState<any>(null);
    const [status, setStatus] = useState('NEW');
    const [internalNotes, setInternalNotes] = useState('');
    const [isArchived, setIsArchived] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, statusFilter, archivedFilter, searchTerm]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (page) params.append('page', page.toString());
            if (searchTerm) params.append('search', searchTerm);

            if (statusFilter === 'active') {
                // defaults to not spam on backend without explicit filter, but we can pass 'all' 
                // Wait, if it's 'active', we just don't pass status parameter assuming backend excludes SPAM by default
            } else if (statusFilter === 'all') {
                params.append('status', 'all');
            } else {
                params.append('status', statusFilter);
            }

            params.append('isArchived', archivedFilter);

            const res = await fetch('/api/admin/leads?' + params.toString());
            const data = await res.json();
            if (data.success) {
                setLeads(data.data);
                setTotalPages(data.pagination.totalPages);
            } else {
                setErrorMsg(data.error || 'Failed to load leads');
            }
        } catch (e) {
            setErrorMsg('Failed to load leads.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (item: any) => {
        setEditingId(item.id);
        setLeadData(item);
        setStatus(item.status || 'NEW');
        setInternalNotes(item.internalNotes || '');
        setIsArchived(item.isArchived || false);
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;
        setIsSaving(true);
        setErrorMsg('');

        try {
            const res = await fetch(`/api/admin/leads/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    internalNotes,
                    isArchived
                })
            });

            const data = await res.json();
            if (data.success) {
                setIsModalOpen(false);
                fetchData();
            } else {
                setErrorMsg(data.error);
            }
        } catch (err) {
            setErrorMsg('Failed to update lead.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this lead? This action cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
            if ((await res.json()).success) {
                fetchData();
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            alert('Error deleting lead');
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'NEW': return 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20';
            case 'CONTACTED': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
            case 'CONVERTED': return 'bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20';
            case 'SPAM': return 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]';
            default: return 'bg-[#EDF5F2] text-[#6B7280] border border-gray-200/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Lead CRM</h2>
                <p className="text-[#6B7280]">Manage inbound leads and inquiries.</p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search name, email, company..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchData()}
                        className="w-full admin-card rounded-lg pl-10 pr-4 py-2 text-[#111827]"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="admin-card rounded-lg px-4 py-2 text-[#111827] text-sm outline-none"
                    >
                        <option value="active">Active (Exclude Spam)</option>
                        <option value="all">All Statuses</option>
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="SPAM">Spam</option>
                    </select>
                    <select
                        value={archivedFilter}
                        onChange={e => setArchivedFilter(e.target.value)}
                        className="admin-card rounded-lg px-4 py-2 text-[#111827] text-sm outline-none"
                    >
                        <option value="false">Active Only</option>
                        <option value="true">Archived Only</option>
                        <option value="all">Show All</option>
                    </select>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                {/* ── MOBILE CARD GRID (hidden on sm+) ── */}
                <div className="sm:hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-[#9CA3AF]">
                            <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-gray-200 mb-2"></div>
                            Loading leads...
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="p-8 text-center text-[#9CA3AF]">No leads found.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-3">
                            {leads.map(item => (
                                <div key={item.id} className="admin-card p-3 flex flex-col gap-2 rounded-xl">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold text-[#111827] text-sm leading-tight line-clamp-2">{item.fullName}</span>
                                        <button onClick={() => handleOpenModal(item)} className="shrink-0 p-1 text-[#6B9F91]">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[#6B7280] text-xs leading-snug line-clamp-1">{item.email}</p>
                                    <p className="text-[#9CA3AF] text-[10px] leading-snug line-clamp-1">{item.serviceInterest || 'General'}</p>
                                    <div className="mt-auto pt-1 flex items-center justify-between">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(item.status)}`}>• {item.status}</span>
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
                                <th className="p-4 font-medium min-w-[180px]">Contact</th>
                                <th className="p-4 font-medium min-w-[150px] hidden sm:table-cell">Service Interest</th>
                                <th className="p-4 font-medium min-w-[120px] hidden md:table-cell">Source</th>
                                <th className="p-4 font-medium min-w-[120px] hidden md:table-cell">Date</th>
                                <th className="p-4 font-medium text-center min-w-[100px]">Status</th>
                                <th className="p-4 font-medium text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-[#9CA3AF]">
                                        <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-gray-200 mb-2"></div>
                                        Loading leads...
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-[#9CA3AF]">No leads found.</td></tr>
                            ) : (
                                leads.map(item => (
                                    <tr key={item.id} className="hover:bg-[#EDF5F2]/50">
                                        <td className="p-4">
                                            <div className="font-medium text-[#111827]">{item.fullName}</div>
                                            <div className="text-[#6B7280] text-xs">{item.email}</div>
                                            <div className="text-[#9CA3AF] text-xs">{item.phone} {item.company ? `• ${item.company}` : ''}</div>
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            <div className="text-[#111827] text-xs max-w-xs truncate">{item.serviceInterest}</div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <div className="text-[#374151] text-xs">{item.source || 'Unknown'}</div>
                                        </td>
                                        <td className="p-4 text-xs text-[#6B7280] hidden md:table-cell">
                                            {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                            {item.isArchived && (
                                                <div className="mt-1"><span className="text-[10px] text-[#9CA3AF] border border-gray-200 px-1.5 rounded">Archived</span></div>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="grid grid-cols-2 gap-1.5 w-fit ml-auto">
                                                <button onClick={() => handleOpenModal(item)} className="px-3 py-1 rounded border border-[#6B9F91] text-[#6B9F91] text-xs font-medium hover:bg-[#6B9F91]/10 transition-colors whitespace-nowrap">View</button>
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

            {!isLoading && totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-4 py-2 rounded-lg admin-card text-[#111827] disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 text-[#6B7280]">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-lg admin-card text-[#111827] disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {isModalOpen && leadData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
                    <div className="admin-card w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/80 shrink-0">
                            <div>
                                <h3 className="text-sm font-bold text-[#111827]">Lead Details</h3>
                                <p className="text-[10px] text-[#9CA3AF] mt-0.5">{leadData.fullName} · {leadData.email}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#111827] p-1"><X className="w-4 h-4" /></button>
                        </div>

                        {/* Body */}
                        <div className="p-4 overflow-y-auto w-full custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* LEFT — Read-only data */}
                            <div className="space-y-4">
                                {/* Client Info */}
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] pb-1 border-b border-gray-100 mb-2">Client Information</p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                        <div><span className="text-[#9CA3AF] block text-[10px]">Name</span><span className="text-[#111827]">{leadData.fullName}</span></div>
                                        <div><span className="text-[#9CA3AF] block text-[10px]">Phone</span><span className="text-[#111827]">{leadData.phone}</span></div>
                                        <div className="col-span-2"><span className="text-[#9CA3AF] block text-[10px]">Email</span><span className="text-[#111827]">{leadData.email}</span></div>
                                        <div className="col-span-2"><span className="text-[#9CA3AF] block text-[10px]">Company</span><span className="text-[#111827]">{leadData.company || 'N/A'}</span></div>
                                    </div>
                                </div>

                                {/* Request */}
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] pb-1 border-b border-gray-100 mb-2">Request</p>
                                    <div className="space-y-2 text-xs">
                                        <div><span className="text-[#9CA3AF] block text-[10px]">Service</span><span className="text-[#111827]">{leadData.serviceInterest}</span></div>
                                        <div>
                                            <span className="text-[#9CA3AF] block text-[10px] mb-1">Message</span>
                                            <div className="bg-[#EDF5F2]/70 px-2.5 py-2 rounded text-[#374151] whitespace-pre-wrap text-xs leading-relaxed max-h-28 overflow-y-auto">{leadData.message}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Attribution */}
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] pb-1 border-b border-gray-100 mb-2">Attribution</p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                        <div><span className="text-[#9CA3AF] block text-[10px]">Source</span><span className="text-[#111827]">{leadData.source || 'N/A'}</span></div>
                                        <div><span className="text-[#9CA3AF] block text-[10px]">Source Page</span><span className="text-[#111827]">{leadData.sourcePage || 'N/A'}</span></div>
                                        <div className="col-span-2"><span className="text-[#9CA3AF] block text-[10px]">Landing Page</span><span className="text-[#111827]">{leadData.landingPage || 'N/A'}</span></div>
                                        <div className="col-span-2"><span className="text-[#9CA3AF] block text-[10px]">Created</span><span className="text-[#111827]">{new Date(leadData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT — CRM edit */}
                            <form id="leadForm" onSubmit={handleSave} className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] pb-1 border-b border-gray-100">CRM Management</p>
                                {errorMsg && <div className="text-xs text-[#B91C1C] bg-[#FEE2E2] px-3 py-2 rounded border border-[#FCA5A5] flex gap-2"><AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> {errorMsg}</div>}

                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1">Status</label>
                                    <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] focus:outline-none focus:border-[#6B9F91]">
                                        <option value="NEW">New</option>
                                        <option value="CONTACTED">Contacted</option>
                                        <option value="CONVERTED">Converted</option>
                                        <option value="SPAM">Spam</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-[#374151] mb-1">Internal Notes <span className="text-[#9CA3AF] font-normal">(private)</span></label>
                                    <textarea rows={3} value={internalNotes} onChange={e => setInternalNotes(e.target.value)} className="w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-[#111827] resize-y focus:outline-none focus:border-[#6B9F91]" placeholder="Add internal notes about this lead..." />
                                </div>

                                <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                                    <div className="relative shrink-0">
                                        <input type="checkbox" checked={isArchived} onChange={e => setIsArchived(e.target.checked)} className="sr-only" />
                                        <div className={`w-8 h-5 rounded-full transition-colors ${isArchived ? 'bg-[#FFC900]' : 'bg-[#EDF5F2]'}`}></div>
                                        <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${isArchived ? 'translate-x-3' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className="text-xs font-medium text-[#374151]">Archived Record</span>
                                </label>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2.5 border-t border-gray-200 flex justify-end gap-2 bg-[#EDF5F2]/50 shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 rounded-md text-xs text-[#6B7280] hover:bg-[#EDF5F2]/70 font-medium">Close</button>
                            <button type="submit" form="leadForm" disabled={isSaving} className="bg-[#6B9F91] hover:bg-[#5C8C80] text-[#111827] px-5 py-1.5 rounded-md text-xs font-medium disabled:opacity-50">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
