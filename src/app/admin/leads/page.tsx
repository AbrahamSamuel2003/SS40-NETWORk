'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, AlertCircle, X, Search, Filter } from 'lucide-react';

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
            case 'NEW': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
            case 'CONTACTED': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
            case 'CONVERTED': return 'bg-green-500/10 text-green-400 border border-green-500/20';
            case 'SPAM': return 'bg-red-500/10 text-red-500 border border-red-500/20';
            default: return 'bg-white/10 text-white/60 border border-white/20';
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Lead CRM</h2>
                <p className="text-white/60">Manage inbound leads and inquiries.</p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search name, email, company..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchData()}
                        className="w-full bg-[#111111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="bg-[#111111] border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none"
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
                        className="bg-[#111111] border border-white/10 rounded-lg px-4 py-2 text-white text-sm outline-none"
                    >
                        <option value="false">Active Only</option>
                        <option value="true">Archived Only</option>
                        <option value="all">Show All</option>
                    </select>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm text-white/80 whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/10 text-white">
                            <tr>
                                <th className="p-4 font-medium">Contact</th>
                                <th className="p-4 font-medium">Service Interest</th>
                                <th className="p-4 font-medium">Source</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium text-center">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-white/40">
                                        <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-white mb-2"></div>
                                        Loading leads...
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-white/40">No leads found.</td></tr>
                            ) : (
                                leads.map(item => (
                                    <tr key={item.id} className="hover:bg-white/[0.02]">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{item.fullName}</div>
                                            <div className="text-white/60 text-xs">{item.email}</div>
                                            <div className="text-white/40 text-xs">{item.phone} {item.company ? `• ${item.company}` : ''}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white text-xs max-w-xs truncate">{item.serviceInterest}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white/80 text-xs">{item.source || 'Unknown'}</div>
                                        </td>
                                        <td className="p-4 text-xs text-white/60">
                                            {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                            {item.isArchived && (
                                                <div className="mt-1"><span className="text-[10px] text-white/40 border border-white/10 px-1.5 rounded">Archived</span></div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleOpenModal(item)} className="text-[var(--color-primary)] hover:text-blue-400 p-2 transition-colors">
                                                View
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-500/50 hover:text-red-500 p-2 transition-colors ml-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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
                        className="px-4 py-2 rounded-lg bg-[#111111] border border-white/10 text-white disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2 text-white/60">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-lg bg-[#111111] border border-white/10 text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {isModalOpen && leadData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white">Lead Details</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Client Information</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-white/40 block text-xs">Name</span><span className="text-white/90">{leadData.fullName}</span></div>
                                        <div><span className="text-white/40 block text-xs">Email</span><span className="text-white/90">{leadData.email}</span></div>
                                        <div><span className="text-white/40 block text-xs">Phone</span><span className="text-white/90">{leadData.phone}</span></div>
                                        <div><span className="text-white/40 block text-xs">Company</span><span className="text-white/90">{leadData.company || 'N/A'}</span></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Request Information</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-white/40 block text-xs">Service</span><span className="text-white/90">{leadData.serviceInterest}</span></div>
                                        <div>
                                            <span className="text-white/40 block text-xs mb-1">Message</span>
                                            <div className="bg-white/5 p-3 rounded text-white/80 whitespace-pre-wrap text-xs">
                                                {leadData.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Attribution</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-white/40 block text-xs">Source</span><span className="text-white/90">{leadData.source || 'N/A'}</span></div>
                                        <div><span className="text-white/40 block text-xs">Source Page</span><span className="text-white/90">{leadData.sourcePage || 'N/A'}</span></div>
                                        <div><span className="text-white/40 block text-xs">Landing Page</span><span className="text-white/90">{leadData.landingPage || 'N/A'}</span></div>
                                        <div><span className="text-white/40 block text-xs">Referrer</span><span className="text-white/90 break-all">{leadData.referrer || 'N/A'}</span></div>
                                        <div><span className="text-white/40 block text-xs">Created At</span><span className="text-white/90">
                                            {new Date(leadData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span></div>
                                    </div>
                                </div>
                            </div>

                            <form id="leadForm" onSubmit={handleSave} className="space-y-6">
                                <div>
                                    <h4 className="text-white font-medium mb-4 border-b border-white/10 pb-2">CRM Management</h4>
                                    {errorMsg && <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/50 flex gap-2"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {errorMsg}</div>}

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-white/80 mb-1.5">Status</label>
                                            <select
                                                value={status}
                                                onChange={e => setStatus(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                                            >
                                                <option value="NEW">New</option>
                                                <option value="CONTACTED">Contacted</option>
                                                <option value="CONVERTED">Converted</option>
                                                <option value="SPAM">Spam</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-white/80 mb-1.5">Internal Notes (Private)</label>
                                            <textarea
                                                rows={5}
                                                value={internalNotes}
                                                onChange={e => setInternalNotes(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white resize-y"
                                                placeholder="Add internal notes about this lead..."
                                            />
                                        </div>

                                        <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                            <div className="relative">
                                                <input type="checkbox" checked={isArchived} onChange={e => setIsArchived(e.target.checked)} className="sr-only" />
                                                <div className={`w-10 h-6 rounded-full transition-colors ${isArchived ? 'bg-orange-500' : 'bg-white/10'}`}></div>
                                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isArchived ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                            </div>
                                            <span className="text-sm font-medium text-white/80">Archived Record</span>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-black/20 mt-auto shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-white/60 hover:bg-white/5">Close</button>
                            <button type="submit" form="leadForm" disabled={isSaving} className="bg-[var(--color-primary)] hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
