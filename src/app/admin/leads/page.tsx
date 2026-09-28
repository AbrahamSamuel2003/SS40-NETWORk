'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, AlertCircle, X, Search, Phone, Mail, User, Clock, ArrowRight, CheckCircle2, ChevronDown, Archive } from 'lucide-react';

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('active');
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
                // defaults to active without spam
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
        if (!confirm('Are you sure you want to delete this inquiry? This cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
            if ((await res.json()).success) {
                fetchData();
            } else {
                alert('Failed to delete inquiry');
            }
        } catch (e) {
            alert('Error deleting inquiry');
        }
    };

    const getStatusBadge = (s: string) => {
        switch (s) {
            case 'NEW':
                return 'bg-[#EDF5F2] text-[#0F766E] border border-[#0F766E]/30';
            case 'CONTACTED':
                return 'bg-amber-50 text-amber-700 border border-amber-200';
            case 'CONVERTED':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            case 'SPAM':
                return 'bg-rose-50 text-rose-700 border border-rose-200';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EDF5F2] border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-wider">
                        CRM Management
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1.5">
                        Inquiries & Leads
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Manage prospective client project inquiries, MoUs, and sales requests.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, company, or service..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="admin-input !pl-10 !text-xs"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative min-w-[150px] flex-1 sm:flex-none">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[#0F766E]"
                        >
                            <option value="active">Active (Exclude Spam)</option>
                            <option value="all">All Statuses</option>
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="CONVERTED">Converted</option>
                            <option value="SPAM">Spam</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="relative min-w-[130px] flex-1 sm:flex-none">
                        <select
                            value={archivedFilter}
                            onChange={e => setArchivedFilter(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[#0F766E]"
                        >
                            <option value="false">Active Records</option>
                            <option value="true">Archived</option>
                            <option value="all">Show All</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Container for Cards & Table */}
            <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs">
                {/* ── MOBILE VIEW: 2-Column Grid Cards ── */}
                <div className="block lg:hidden p-2.5">
                    {isLoading ? (
                        <div className="p-10 text-center text-gray-400 text-xs font-medium">
                            <div className="animate-spin rounded-full h-5 w-5 mx-auto border-2 border-[#0F766E] border-t-transparent mb-2" />
                            Loading leads...
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 text-xs font-medium">
                            No inquiries match your current filters.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {leads.map((item) => (
                                <div key={item.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                    <div className="space-y-1.5">
                                        <div className="flex items-start justify-between gap-1">
                                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                                                {item.status}
                                            </span>
                                            <span className="text-[10px] text-gray-400 shrink-0">
                                                {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-[#0F172A] leading-tight truncate" title={item.fullName}>
                                                {item.fullName}
                                            </h4>
                                            <p className="text-[10px] text-gray-500 truncate" title={item.company || 'Individual Client'}>
                                                {item.company || 'Individual'}
                                            </p>
                                        </div>

                                        <div className="bg-[#EDF5F2]/60 rounded-lg p-2 text-[11px] text-[#0F766E] border border-[#2DD4BF]/20 font-medium line-clamp-1">
                                            {item.serviceInterest || 'General Inquiry'}
                                        </div>

                                        {item.message && (
                                            <p className="text-[10px] text-gray-600 line-clamp-2 italic bg-gray-50 p-1.5 rounded border border-gray-100">
                                                "{item.message}"
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                                        <a
                                            href={`tel:${item.phone.replace(/\s+/g, '')}`}
                                            className="p-1.5 bg-gray-50 hover:bg-[#EDF5F2] text-[#0F766E] rounded-lg border border-gray-200 transition-colors flex-1 flex items-center justify-center"
                                            title="Call Lead"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                        </a>
                                        <a
                                            href={`mailto:${item.email}`}
                                            className="p-1.5 bg-gray-50 hover:bg-[#EDF5F2] text-[#0F766E] rounded-lg border border-gray-200 transition-colors flex-1 flex items-center justify-center"
                                            title="Email Lead"
                                        >
                                            <Mail className="w-3.5 h-3.5" />
                                        </a>
                                        <button
                                            onClick={() => handleOpenModal(item)}
                                            className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex-1 flex items-center justify-center"
                                            title="View Details"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── DESKTOP VIEW: Full Data Table ── */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="admin-table">
                        <thead className="admin-table-head">
                            <tr>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Service Interest</th>
                                <th className="p-4">Source Channel</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-gray-400">
                                        <div className="animate-spin rounded-full h-5 w-5 mx-auto border-2 border-[#0F766E] border-t-transparent mb-2" />
                                        Loading inquiries...
                                    </td>
                                </tr>
                            ) : leads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-400 text-xs font-medium">
                                        No inquiries found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                leads.map((item) => (
                                    <tr key={item.id} className="admin-table-row">
                                        <td className="p-4">
                                            <div className="font-bold text-[#0F172A] text-sm">{item.fullName}</div>
                                            <div className="text-gray-500 text-xs">{item.email}</div>
                                            <div className="text-gray-400 text-xs">{item.phone} {item.company ? `• ${item.company}` : ''}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-semibold text-[#0F172A] block max-w-xs truncate">
                                                {item.serviceInterest || 'General Inquiry'}
                                            </span>
                                            <span className="text-[11px] text-gray-400 line-clamp-1 italic max-w-xs">
                                                "{item.message}"
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs font-medium text-gray-600">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-mono text-[10px]">
                                                {item.source || 'Website Form'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${getStatusBadge(item.status)}`}>
                                                {item.status}
                                            </span>
                                            {item.isArchived && (
                                                <span className="block text-[9px] text-gray-400 uppercase font-bold mt-1">Archived</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="px-3 py-1.5 rounded-xl border border-[#0F766E]/30 text-[#0F766E] text-xs font-bold hover:bg-[#EDF5F2] transition-colors cursor-pointer"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                                    title="Delete Inquiry"
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

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between bg-white border border-gray-200/90 rounded-2xl px-4 py-3 shadow-xs">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="admin-button-secondary text-xs !py-1.5 !px-3 disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <span className="text-xs font-semibold text-gray-500">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="admin-button-secondary text-xs !py-1.5 !px-3 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Lead Detail / Edit Modal */}
            {isModalOpen && leadData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/50 backdrop-blur-xs">
                    <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
                        {/* Modal Header */}
                        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-[#EDF5F2]/50 shrink-0">
                            <div>
                                <h3 className="text-base font-bold text-[#0F172A]">Inquiry Details</h3>
                                <p className="text-xs text-gray-500">{leadData.fullName} · {leadData.email}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
                            {/* Read-only details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                                <div>
                                    <span className="text-gray-400 font-bold uppercase text-[10px] block">Contact Phone</span>
                                    <a href={`tel:${leadData.phone}`} className="font-bold text-[#0F766E] hover:underline flex items-center gap-1 mt-0.5">
                                        <Phone className="w-3 h-3" />
                                        {leadData.phone}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-bold uppercase text-[10px] block">Company / Institution</span>
                                    <span className="font-bold text-[#0F172A] block mt-0.5">{leadData.company || 'Not Specified'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-bold uppercase text-[10px] block">Area of Interest</span>
                                    <span className="font-bold text-[#0F766E] block mt-0.5">{leadData.serviceInterest || 'General Enquiry'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-bold uppercase text-[10px] block">Submitted Date</span>
                                    <span className="text-gray-600 block mt-0.5">
                                        {new Date(leadData.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                </div>
                            </div>

                            {/* Message Block */}
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                                    Project Brief / Message
                                </label>
                                <div className="bg-[#EDF5F2]/40 border border-[#0F766E]/15 p-4 rounded-2xl text-xs text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                                    {leadData.message}
                                </div>
                            </div>

                            {/* CRM Form Controls */}
                            <form id="leadForm" onSubmit={handleSave} className="space-y-4 pt-2 border-t border-gray-100">
                                {errorMsg && (
                                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{errorMsg}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#0F172A] block mb-1.5">
                                            Status Pipeline
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={status}
                                                onChange={e => setStatus(e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#0F172A] appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[#0F766E]"
                                            >
                                                <option value="NEW">New (Uncontacted)</option>
                                                <option value="CONTACTED">Contacted</option>
                                                <option value="CONVERTED">Converted / Closed</option>
                                                <option value="SPAM">Spam</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="flex items-end">
                                        <label className="flex items-center gap-3 p-2.5 bg-gray-50 border border-gray-200 rounded-xl w-full cursor-pointer hover:bg-gray-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={isArchived}
                                                onChange={e => setIsArchived(e.target.checked)}
                                                className="w-4 h-4 rounded text-[#0F766E] focus:ring-[#0F766E]"
                                            />
                                            <span className="text-xs font-bold text-[#0F172A]">Archive this Record</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#0F172A] block mb-1.5">
                                        Internal Notes <span className="text-gray-400 font-normal">(Visible only to Admins)</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={internalNotes}
                                        onChange={e => setInternalNotes(e.target.value)}
                                        className="admin-input !text-xs resize-none"
                                        placeholder="Add follow-up notes, assigned team member, quotes..."
                                    />
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
                                Close
                            </button>
                            <button
                                type="submit"
                                form="leadForm"
                                disabled={isSaving}
                                className="admin-button-primary text-xs !py-2 !px-5 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Updates'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
