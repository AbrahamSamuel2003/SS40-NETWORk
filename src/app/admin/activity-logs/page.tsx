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
                    <h2 className="text-2xl font-bold tracking-tight text-[#111827]">Activity Logs</h2>
                </div>
                <p className="text-[#6B7280]">Review immutable administrative activity across the CMS. Activity logs are immutable audit records.</p>
                {errorMsg && (
                    <div className="mt-4 p-4 text-sm text-[#B91C1C] bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg">
                        {errorMsg}
                    </div>
                )}
            </div>

            <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="relative w-full lg:w-96">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search description, action, or entity..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchSubmit}
                        className="w-full admin-card rounded-lg pl-10 pr-4 py-2 text-[#111827] text-sm"
                    />
                </div>

                <div className="flex gap-4 w-full lg:w-auto overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
                    <div className="flex items-center gap-2 admin-card rounded-lg px-3 flex-shrink-0">
                        <Filter className="w-4 h-4 text-[#9CA3AF]" />
                        <select
                            value={entityFilter}
                            onChange={e => {
                                setEntityFilter(e.target.value);
                                setPage(1);
                            }}
                            className="bg-transparent py-2 text-[#111827] text-sm outline-none w-32 cursor-pointer"
                        >
                            <option value="" className="bg-white">All Entities</option>
                            {predefinedEntities.map(entity => (
                                <option key={entity} value={entity} className="bg-white">{entity}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 admin-card rounded-lg px-3 flex-shrink-0">
                        <select
                            value={actionFilter}
                            onChange={e => {
                                setActionFilter(e.target.value);
                                setPage(1);
                            }}
                            className="bg-transparent py-2 text-[#111827] text-sm outline-none w-40 cursor-pointer"
                        >
                            <option value="" className="bg-white">All Actions</option>
                            <option value="CREATED" className="bg-white">Creation Events</option>
                            <option value="UPDATED" className="bg-white">Modification Events</option>
                            <option value="DELETED" className="bg-white">Deletion Events</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="admin-card overflow-hidden shadow-sm">
                {/* ── MOBILE CARD GRID (hidden on sm+) ── */}
                <div className="sm:hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-[#9CA3AF]">
                            <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-gray-200 mb-2"></div>
                            Fetching immutable records...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-8 text-center text-[#9CA3AF]">No activity has been recorded yet.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-3">
                            {logs.map(item => (
                                <div key={item.id} className="admin-card p-3 flex flex-col gap-2 rounded-xl">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold text-[#111827] text-sm leading-tight line-clamp-2">{item.description}</span>
                                        <button onClick={() => handleOpenModal(item)} className="shrink-0 p-1 text-[#6B9F91]">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[#6B7280] text-[10px] leading-snug line-clamp-1">{item.adminUser?.fullName || 'System Event'}</p>
                                    <div className="mt-auto pt-1 flex items-center justify-between">
                                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-[#EDF5F2]/70 text-[#374151] border border-gray-200">• {item.action}</span>
                                        <span className="text-[#9CA3AF] text-[10px]">{new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
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
                                <th className="p-4 font-medium min-w-[150px]">Date / Time</th>
                                <th className="p-4 font-medium min-w-[150px] hidden sm:table-cell">Admin</th>
                                <th className="p-4 font-medium min-w-[100px]">Action</th>
                                <th className="p-4 font-medium min-w-[200px]">Description</th>
                                <th className="p-4 font-medium text-right min-w-[100px]">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-[#9CA3AF]">
                                        <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-gray-200 mb-2"></div>
                                        Fetching immutable records...
                                    </td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-[#9CA3AF]">
                                        No activity has been recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map(item => (
                                    <tr key={item.id} className="hover:bg-[#EDF5F2]/50 transition-colors">
                                        <td className="p-4">
                                            <div className="text-[#111827] text-xs">
                                                {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })},{' '}
                                                <span className="text-[#6B7280]">{new Date(item.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            <span className="font-medium text-[#111827] text-xs truncate max-w-[150px]">{item.adminUser?.fullName || 'System Event'}</span>
                                            <span className="text-[#9CA3AF] text-[10px] truncate max-w-[150px]">{item.adminUser?.email || '-'}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-[#EDF5F2]/70 text-[#374151] border border-gray-200">
                                                {item.action}
                                            </span>
                                        </td>
                                        <td className="p-4 truncate max-w-[300px]">
                                            <div className="text-[#374151] text-xs truncate" title={item.description}>
                                                {item.description}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-end">
                                                <button onClick={() => handleOpenModal(item)} className="px-3 py-1 rounded border border-[#6B9F91] text-[#6B9F91] text-xs font-medium hover:bg-[#6B9F91]/10 transition-colors whitespace-nowrap">View</button>
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
                        className="px-4 py-2 rounded-lg admin-card text-[#111827] disabled:opacity-50 hover:bg-[#EDF5F2]/70 transition-colors text-sm font-medium"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-[#6B7280] text-sm flex items-center">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-lg admin-card text-[#111827] disabled:opacity-50 hover:bg-[#EDF5F2]/70 transition-colors text-sm font-medium"
                    >
                        Next
                    </button>
                </div>
            )}

            {isModalOpen && logData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm shadow-2xl">
                    <div className="admin-card w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/80 shrink-0">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[#6B9F91] opacity-80" />
                                <div>
                                    <h3 className="text-sm font-bold text-[#111827]">Audit Log Details</h3>
                                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">Read-only inspection record</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#111827] p-1 transition-colors"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="p-4 overflow-y-auto w-full custom-scrollbar space-y-3">

                            {/* Top meta grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-1.5 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Date &amp; Time</span>
                                    </div>
                                    <div className="px-3 py-2">
                                        <div className="text-[#111827] text-xs font-medium">
                                            {new Date(logData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-[#6B7280] text-[11px]">
                                            {new Date(logData.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-1.5 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Administrator</span>
                                    </div>
                                    <div className="px-3 py-2">
                                        <div className="text-[#111827] text-xs font-medium">{logData.adminUser?.fullName || 'System Event'}</div>
                                        <div className="text-[#6B7280] text-[11px] font-mono">{logData.adminUser?.email || '-'}</div>
                                    </div>
                                </div>

                                <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-1.5 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Action Code</span>
                                    </div>
                                    <div className="px-3 py-2">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-[#6B9F91]/10 text-[#6B9F91] border border-[#6B9F91]/20">
                                            {logData.action}
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-1.5 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Entity Context</span>
                                    </div>
                                    <div className="px-3 py-2">
                                        <div className="text-[#111827] text-xs font-semibold">{logData.entity}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                <div className="px-3 py-1.5 bg-[#EDF5F2]/70 border-b border-gray-200">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Immutable Description</span>
                                </div>
                                <div className="px-3 py-2">
                                    <p className="text-[#111827]/90 text-xs leading-relaxed whitespace-pre-wrap">{logData.description}</p>
                                </div>
                            </div>

                            {/* Target ID + Network */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-1.5 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Target Entity ID</span>
                                    </div>
                                    <div className="px-3 py-2">
                                        <span className="text-[#111827]/90 font-mono text-[11px] break-all">{logData.entityId || 'N/A'}</span>
                                    </div>
                                </div>

                                {(logData.ipAddress || logData.userAgent) && (
                                    <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                        <div className="px-3 py-1.5 bg-[#EDF5F2]/70 border-b border-gray-200">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Network Signature</span>
                                        </div>
                                        <div className="px-3 py-2 max-h-[72px] overflow-y-auto custom-scrollbar">
                                            <div className="text-[#6B7280] font-mono text-[10px] break-all leading-tight">
                                                {logData.ipAddress && <div><span className="text-[#9CA3AF]">IP:</span> {logData.ipAddress}</div>}
                                                {logData.userAgent && <div className="mt-1"><span className="text-[#9CA3AF]">Agent:</span> {logData.userAgent}</div>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="px-4 py-2.5 border-t border-gray-200 flex justify-end bg-[#EDF5F2]/50 shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#EDF5F2] text-[#111827] hover:bg-[#EDF5F2]/80 transition-colors">
                                Close Audit Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
