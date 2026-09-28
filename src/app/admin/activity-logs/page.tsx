'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Activity, Filter, Eye, ShieldCheck, ChevronLeft, ChevronRight, User, Database, Globe } from 'lucide-react';

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [entityFilter, setEntityFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Predefined entities based strictly on established schema/API capabilities
    const predefinedEntities = ['AdminUser', 'ClientProject', 'Happimonial', 'Lead', 'Media', 'OrganizationLogo', 'Product', 'SiteConfig', 'StudentImpact', 'StudentProject', 'Visitor'];

    // View Log state
    const [logData, setLogData] = useState<any>(null);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, actionFilter, entityFilter]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (page) params.append('page', page.toString());
            if (searchTerm) params.append('search', searchTerm);
            if (actionFilter) params.append('action', actionFilter);
            if (entityFilter) params.append('entity', entityFilter);

            const res = await fetch('/api/admin/activity-logs?' + params.toString());
            const data = await res.json();

            if (data.success) {
                setLogs(data.data);
                setTotalPages(data.pagination.totalPages);
                setErrorMsg('');
            } else {
                setErrorMsg(data.error || 'Failed to load activity logs');
            }
        } catch (e) {
            setErrorMsg('Unable to load activity logs. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setPage(1);
            fetchData();
        }
    };

    const handleOpenModal = (item: any) => {
        setLogData(item);
        setIsModalOpen(true);
    };

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'CREATED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'UPDATED':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'DELETED':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-[#EDF5F2] text-[#0F766E] border-[#2DD4BF]/30';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Audit &amp; Activity Logs</h1>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30">
                            <ShieldCheck className="w-3.5 h-3.5" /> Immutable
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                        System tamper-resistant audit trail recording administrative changes across the CMS.
                    </p>
                </div>
            </div>

            {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
                    {errorMsg}
                </div>
            )}

            {/* Filter Bar */}
            <div className="admin-card p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input
                        type="text"
                        placeholder="Search description, entity or action... (Press Enter)"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchSubmit}
                        className="admin-input pl-10"
                    />
                </div>

                <div className="flex gap-2 sm:gap-3">
                    <div className="relative min-w-[140px] flex-1 sm:flex-initial">
                        <select
                            value={entityFilter}
                            onChange={e => {
                                setEntityFilter(e.target.value);
                                setPage(1);
                            }}
                            className="admin-input text-xs sm:text-sm cursor-pointer pr-8"
                        >
                            <option value="">All Entities</option>
                            {predefinedEntities.map(entity => (
                                <option key={entity} value={entity}>{entity}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative min-w-[140px] flex-1 sm:flex-initial">
                        <select
                            value={actionFilter}
                            onChange={e => {
                                setActionFilter(e.target.value);
                                setPage(1);
                            }}
                            className="admin-input text-xs sm:text-sm cursor-pointer pr-8"
                        >
                            <option value="">All Actions</option>
                            <option value="CREATED">Creation (CREATED)</option>
                            <option value="UPDATED">Update (UPDATED)</option>
                            <option value="DELETED">Deletion (DELETED)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── MOBILE CARDS: 2-Column Grid (Visible only on < sm) ── */}
            <div className="sm:hidden">
                {isLoading ? (
                    <div className="admin-card p-8 text-center text-xs text-[#64748B]">
                        <div className="w-6 h-6 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        Fetching immutable audit trail...
                    </div>
                ) : logs.length === 0 ? (
                    <div className="admin-card p-8 text-center text-xs text-[#64748B]">
                        No activity records found matching filters.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                        {logs.map(item => (
                            <div key={item.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-1 flex-wrap">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase border truncate max-w-[55%] ${getActionBadge(item.action)}`}>
                                            {item.action}
                                        </span>
                                        <span className="font-mono text-[9px] text-[#334151] bg-[#EDF5F2] px-1 py-0.2 rounded border border-[#2DD4BF]/20 truncate max-w-[45%]">
                                            {item.entity}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-xs text-[#0F172A] leading-tight line-clamp-2" title={item.description}>
                                        {item.description}
                                    </h3>
                                </div>

                                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                                    <span className="text-[9px] text-[#94A3B8] truncate max-w-[55%]">
                                        {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </span>
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center shrink-0"
                                        title="View Details"
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── DESKTOP TABLE (Hidden on < sm) ── */}
            <div className="hidden sm:block admin-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Administrator</th>
                                <th>Action</th>
                                <th>Entity</th>
                                <th>Description</th>
                                <th className="text-right">Inspect</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-[#64748B]">
                                        <div className="w-6 h-6 border-2 border-[#0F766E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        Fetching immutable records...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-[#64748B]">
                                        No activity records found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(item => (
                                    <tr key={item.id} className="hover:bg-[#F8FAFC]">
                                        <td className="whitespace-nowrap">
                                            <div className="text-xs font-semibold text-[#0F172A]">
                                                {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="text-[11px] text-[#64748B]">
                                                {new Date(item.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-medium text-[#0F172A] truncate max-w-[150px]">
                                                {item.adminUser?.fullName || 'System Event'}
                                            </div>
                                            <div className="text-[10px] text-[#64748B] truncate max-w-[150px] font-mono">
                                                {item.adminUser?.email || 'automated@system'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${getActionBadge(item.action)}`}>
                                                {item.action}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="font-mono text-xs text-[#334151] bg-[#EDF5F2] px-2 py-0.5 rounded border border-[#2DD4BF]/20">
                                                {item.entity}
                                            </span>
                                        </td>
                                        <td className="max-w-[320px]">
                                            <p className="text-xs text-[#334151] line-clamp-2" title={item.description}>
                                                {item.description}
                                            </p>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#0F766E] hover:bg-[#EDF5F2] border border-[#2DD4BF]/30 transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-[#64748B]">
                        Showing page <span className="font-semibold text-[#0F172A]">{page}</span> of <span className="font-semibold text-[#0F172A]">{totalPages}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="admin-button-secondary py-1.5 px-3 text-xs disabled:opacity-40"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="admin-button-secondary py-1.5 px-3 text-xs disabled:opacity-40"
                        >
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── AUDIT LOG DETAILS MODAL ── */}
            {isModalOpen && logData && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-panel max-w-xl">
                        {/* Header */}
                        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#EDF5F2] flex items-center justify-center text-[#0F766E]">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-[#0F172A]">Audit Record Inspector</h2>
                                    <p className="text-xs text-[#64748B]">Immutable transaction signature</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Key Value Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Date &amp; Time</div>
                                    <div className="text-xs font-semibold text-[#0F172A]">
                                        {new Date(logData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                    <div className="text-[11px] text-[#64748B]">
                                        {new Date(logData.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Action Type</div>
                                    <div>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${getActionBadge(logData.action)}`}>
                                            {logData.action}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Entity Target</div>
                                    <div className="text-xs font-bold text-[#0F766E] font-mono">
                                        {logData.entity}
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Administrator</div>
                                    <div className="text-xs font-semibold text-[#0F172A] truncate">
                                        {logData.adminUser?.fullName || 'System Event'}
                                    </div>
                                    <div className="text-[10px] text-[#64748B] font-mono truncate">
                                        {logData.adminUser?.email || '-'}
                                    </div>
                                </div>
                            </div>

                            {/* Description Box */}
                            <div className="p-3.5 rounded-xl bg-[#EDF5F2]/40 border border-[#2DD4BF]/20 space-y-1.5">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">Activity Description</div>
                                <p className="text-xs text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                                    {logData.description}
                                </p>
                            </div>

                            {/* Entity ID */}
                            {logData.entityId && (
                                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Target Entity ID</div>
                                    <p className="font-mono text-xs text-[#0F172A] break-all bg-white p-2 rounded border border-[#E2E8F0]">
                                        {logData.entityId}
                                    </p>
                                </div>
                            )}

                            {/* Network Metadata */}
                            {(logData.ipAddress || logData.userAgent) && (
                                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Origin Network Fingerprint</div>
                                    <div className="space-y-1 font-mono text-[11px] text-[#64748B]">
                                        {logData.ipAddress && (
                                            <div className="flex items-center gap-1.5">
                                                <Globe className="w-3.5 h-3.5 text-[#0F766E]" />
                                                <span>IP: <strong className="text-[#0F172A]">{logData.ipAddress}</strong></span>
                                            </div>
                                        )}
                                        {logData.userAgent && (
                                            <div className="text-[10px] bg-white p-2 rounded border border-[#E2E8F0] break-all text-[#334151]">
                                                {logData.userAgent}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="admin-button-secondary text-xs px-4 py-2"
                            >
                                Close Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
