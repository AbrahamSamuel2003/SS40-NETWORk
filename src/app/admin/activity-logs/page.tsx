'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Activity, Filter, Eye } from 'lucide-react';

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

    // Extracted unique values for filter dropdowns based strictly on established schema/API capabilities
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

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Activity Logs</h2>
                </div>
                <p className="text-white/60">Review immutable administrative activity across the CMS. Activity logs are immutable audit records.</p>
                {errorMsg && (
                    <div className="mt-4 p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                        {errorMsg}
                    </div>
                )}
            </div>

            <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:w-96">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search description, action, or entity..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchSubmit}
                        className="w-full bg-[#111111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm"
                    />
                </div>

                <div className="flex gap-4 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
                    <div className="flex items-center gap-2 bg-[#111111] border border-white/10 rounded-lg px-3 flex-shrink-0">
                        <Filter className="w-4 h-4 text-white/40" />
                        <select
                            value={entityFilter}
                            onChange={e => {
                                setEntityFilter(e.target.value);
                                setPage(1);
                            }}
                            className="bg-transparent py-2 text-white text-sm outline-none w-32 cursor-pointer"
                        >
                            <option value="" className="bg-[#111111]">All Entities</option>
                            {predefinedEntities.map(entity => (
                                <option key={entity} value={entity} className="bg-[#111111]">{entity}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-[#111111] border border-white/10 rounded-lg px-3 flex-shrink-0">
                        <select
                            value={actionFilter}
                            onChange={e => {
                                setActionFilter(e.target.value);
                                setPage(1);
                            }}
                            className="bg-transparent py-2 text-white text-sm outline-none w-40 cursor-pointer"
                        >
                            <option value="" className="bg-[#111111]">All Actions</option>
                            <option value="CREATED" className="bg-[#111111]">Creation Events</option>
                            <option value="UPDATED" className="bg-[#111111]">Modification Events</option>
                            <option value="DELETED" className="bg-[#111111]">Deletion Events</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm text-white/80 whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/10 text-white">
                            <tr>
                                <th className="p-4 font-medium">Date / Time</th>
                                <th className="p-4 font-medium">Admin</th>
                                <th className="p-4 font-medium">Action</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-white/40">
                                        <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-white mb-2"></div>
                                        Fetching immutable records...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-white/40">
                                        No activity has been recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(item => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="text-white text-xs">
                                                {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })},{' '}
                                                <span className="text-white/50">{new Date(item.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 flex flex-col">
                                            <span className="font-medium text-white text-xs truncate max-w-[150px]">{item.adminUser?.fullName || 'System Event'}</span>
                                            <span className="text-white/40 text-[10px] truncate max-w-[150px]">{item.adminUser?.email || '-'}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-white/5 text-white/80 border border-white/10">
                                                {item.action}
                                            </span>
                                        </td>
                                        <td className="p-4 truncate max-w-[300px]">
                                            <div className="text-white/80 text-xs truncate" title={item.description}>
                                                {item.description}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="text-[var(--color-primary)] hover:text-blue-400 p-2 transition-colors flex items-center justify-end gap-1 w-full"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="text-xs">View</span>
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
                        className="px-4 py-2 rounded-lg bg-[#111111] border border-white/10 text-white disabled:opacity-50 hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-white/60 text-sm flex items-center">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-lg bg-[#111111] border border-white/10 text-white disabled:opacity-50 hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        Next
                    </button>
                </div>
            )}

            {isModalOpen && logData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl">
                    <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[var(--color-primary)] opacity-80" />
                                Audit Log Details
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full custom-scrollbar space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">Date & Time</h4>
                                    <div className="text-white text-sm">
                                        {new Date(logData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} at{' '}
                                        <span className="text-white/80">{new Date(logData.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Administrator</h4>
                                    <div className="text-white text-sm font-medium">{logData.adminUser?.fullName || 'System Event'}</div>
                                    <div className="text-white/60 text-xs font-mono">{logData.adminUser?.email || '-'}</div>
                                </div>

                                <div>
                                    <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Action Code</h4>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        {logData.action}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Entity Context</h4>
                                    <div className="text-white text-sm font-semibold">{logData.entity}</div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-6">
                                <div>
                                    <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2">Immutable Description</h4>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                                        {logData.description}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                                    <div>
                                        <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Target Entity ID</h4>
                                        <div className="text-white/90 font-mono text-xs break-all bg-black/50 p-2 rounded border border-white/5 inline-block">
                                            {logData.entityId || 'N/A'}
                                        </div>
                                    </div>

                                    {(logData.ipAddress || logData.userAgent) && (
                                        <div>
                                            <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Network Signature</h4>
                                            <div className="text-white/60 font-mono text-[10px] break-all leading-tight max-h-[80px] overflow-y-auto custom-scrollbar pr-2">
                                                {logData.ipAddress && <div><span className="text-white/40">IP:</span> {logData.ipAddress}</div>}
                                                {logData.userAgent && <div className="mt-1"><span className="text-white/40">Agent:</span> {logData.userAgent}</div>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                        <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-black/20 mt-auto shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-medium text-sm"
                            >
                                Close Audit Record
                            </button>
                            {/* Strictly Read-Only Mode Maintained: No Mutations */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
