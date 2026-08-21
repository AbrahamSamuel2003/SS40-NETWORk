'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Bot, Globe, Shield, Trash2, Eye, RefreshCw, Play, Pause } from 'lucide-react';

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Polling State
    const [isPolling, setIsPolling] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const POLLING_INTERVAL = 5000; // 5 seconds

    // Initialize lastUpdated only on client to avoid hydration mismatch
    useEffect(() => {
        setLastUpdated(new Date());
    }, []);

    // View Visitor states
    const [visitorData, setVisitorData] = useState<any>(null);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchTerm]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (page) params.append('page', page.toString());
            if (searchTerm) params.append('search', searchTerm);

            const res = await fetch('/api/admin/visitors?' + params.toString());
            const data = await res.json();
            if (data.success) {
                setVisitors(data.data);
                setTotalPages(data.pagination.totalPages);
                setLastUpdated(new Date());
                setErrorMsg('');
            } else {
                setErrorMsg(data.error || 'Failed to load visitors');
            }
        } catch (e) {
            setErrorMsg('Failed to load visitors.');
        } finally {
            setIsLoading(false);
        }
    };

    // Polling Effect
    useEffect(() => {
        if (!isPolling || isModalOpen) {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
            return;
        }

        pollingIntervalRef.current = setInterval(() => {
            fetchData();
        }, POLLING_INTERVAL);

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [isPolling, isModalOpen, page, searchTerm]);

    // Page Visibility API - Pause polling when tab is hidden
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsPolling(false);
            } else if (!isModalOpen) {
                setIsPolling(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isModalOpen]);

    const togglePolling = () => {
        setIsPolling(!isPolling);
    };

    const handleManualRefresh = () => {
        fetchData();
    };

    const handleOpenModal = (item: any) => {
        setVisitorData(item);
        setErrorMsg('');
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this visitor record? This action cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/visitors/${id}`, { method: 'DELETE' });
            if ((await res.json()).success) {
                fetchData();
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            alert('Error deleting visitor');
        }
    };

    const formatLocation = (city?: string, country?: string) => {
        if (city && country) return `${city}, ${country}`;
        if (city) return city;
        if (country) return country;
        return 'Unknown Location';
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#111827]">Visitors CRM</h2>
                        <p className="text-[#6B7280]">Monitor and inspect localized website session traffic dynamically.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleManualRefresh}
                            className="admin-card p-2 rounded-lg text-[#6B9F91] hover:bg-[#6B9F91]/10 transition-colors"
                            title="Manual refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={togglePolling}
                            className={`admin-card px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${isPolling ? 'text-[#6B9F91] bg-[#6B9F91]/10' : 'text-[#6B7280] bg-[#EDF5F2]/50'}`}
                            title={isPolling ? 'Pause auto-refresh' : 'Resume auto-refresh'}
                        >
                            {isPolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            <span className="hidden sm:inline">{isPolling ? 'Live' : 'Paused'}</span>
                        </button>
                    </div>
                </div>
                <div className="text-xs text-[#9CA3AF]">
                    Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Loading...'}
                    {isPolling && ' • Auto-refreshing every 5 seconds'}
                </div>
                {errorMsg && (
                    <div className="mt-4 p-4 text-sm text-[#B91C1C] bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg">
                        {errorMsg}
                    </div>
                )}
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-[450px]">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-[#9CA3AF]" />
                    <input
                        type="text"
                        placeholder="Search session ID, browser, city, landing page..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setPage(1); // reset to page 1 on search
                        }}
                        onKeyDown={e => e.key === 'Enter' && fetchData()}
                        className="w-full admin-card rounded-lg pl-10 pr-4 py-2 text-[#111827]"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    {/* Additional client filters could go here, but relying on server 'search' encompasses them */}
                </div>
            </div>

            <div className="admin-card overflow-hidden shadow-sm">
                {/* ── MOBILE CARD GRID (hidden on sm+) ── */}
                <div className="sm:hidden">
                    {isLoading ? (
                        <div className="p-8 text-center text-[#9CA3AF]">
                            <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-gray-200 mb-2"></div>
                            Fetching visitors securely...
                        </div>
                    ) : visitors.length === 0 ? (
                        <div className="p-8 text-center text-[#9CA3AF]">No tracked visitors match your query.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 p-3">
                            {visitors.map(item => (
                                <div key={item.id} className="admin-card p-3 flex flex-col gap-2 rounded-xl">
                                    <div className="flex items-start justify-between gap-1">
                                        <span className="font-semibold text-[#111827] text-xs leading-tight line-clamp-2 font-mono">{item.sessionId.substring(0, 10)}…</span>
                                        <button onClick={() => handleOpenModal(item)} className="shrink-0 p-1 text-[#6B9F91]">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[#6B7280] text-[10px] leading-snug line-clamp-1">{item.deviceType || 'Unknown'} · {item.browser || 'Unknown'}</p>
                                    <p className="text-[#9CA3AF] text-[10px] leading-snug line-clamp-1">{item.landingPage || 'Direct'}</p>
                                    <div className="mt-auto pt-1 flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EDF5F2]/70 text-[#111827] border border-gray-200">• {item.pageViews} views</span>
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
                                <th className="p-4 font-medium min-w-[180px]">Session ID</th>
                                <th className="p-4 font-medium min-w-[150px] hidden sm:table-cell">Platform / OS</th>
                                <th className="p-4 font-medium min-w-[120px] hidden md:table-cell">Location</th>
                                <th className="p-4 font-medium text-center min-w-[100px]">Views</th>
                                <th className="p-4 font-medium min-w-[120px] hidden sm:table-cell">Last Visited</th>
                                <th className="p-4 font-medium text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-[#9CA3AF]">
                                        <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-gray-200 mb-2"></div>
                                        Fetching visitors securely...
                                    </td>
                                </tr>
                            ) : visitors.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-[#9CA3AF]">No tracked visitors match your query.</td></tr>
                            ) : (
                                visitors.map(item => (
                                    <tr key={item.id} className="hover:bg-[#EDF5F2]/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {item.isBot && (
                                                    <span title="Bot Detected">
                                                        <Bot className="w-4 h-4 text-[#92400E]" />
                                                    </span>
                                                )}
                                                <div className="font-mono text-[#111827] text-xs">{item.sessionId.substring(0, 14)}...</div>
                                            </div>
                                            <div className="text-[#9CA3AF] text-[10px] mt-1 truncate max-w-[150px]">{item.landingPage || 'Direct'}</div>
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">
                                            <div className="text-[#111827] text-xs font-semibold">{item.deviceType || 'Unknown Device'}</div>
                                            <div className="text-[#6B7280] text-[11px] mt-0.5">{item.browser || 'Unknown'} • {item.operatingSystem || 'N/A'}</div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <div className="text-[#111827] text-xs flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 opacity-60" /> {formatLocation(item.city, item.country)}</div>
                                            {item.ipAddress && <div className="text-[#9CA3AF] text-[10px] font-mono mt-1">{item.ipAddress}</div>}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center bg-[#EDF5F2]/70 border border-gray-200 rounded-md px-2 py-0.5 text-xs font-bold text-[#111827]/90">
                                                {item.pageViews}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-[#6B7280] hidden sm:table-cell">
                                            {new Date(item.lastVisitedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            <div className="text-[10px] text-[#9CA3AF]">{new Date(item.lastVisitedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-col xl:flex-row gap-1.5 justify-end ml-auto shrink-0">
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
                    <span className="px-4 py-2 text-[#6B7280] flex items-center">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-lg admin-card text-[#111827] disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {isModalOpen && visitorData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
                    <div className="admin-card w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/80 shrink-0">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#6B9F91]" />
                                <div>
                                    <h3 className="text-sm font-bold text-[#111827]">Visitor Integrity Details</h3>
                                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">Session inspection report</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#111827] p-1"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="p-4 overflow-y-auto w-full custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Session Identity */}
                                <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-2 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Session Identity</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Session ID</span>
                                            <span className="text-[#111827] font-mono text-[11px] break-all">{visitorData.sessionId}</span>
                                        </div>
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Bot Trajectory</span>
                                            {visitorData.isBot ? (
                                                <span className="text-[#92400E] bg-[#FFC900]/15 px-2 py-0.5 rounded text-[10px] font-bold">BOT DETECTED</span>
                                            ) : (
                                                <span className="text-[#6B9F91] bg-[#6B9F91]/10 px-2 py-0.5 rounded text-[10px] font-bold">ORGANIC VISITOR</span>
                                            )}
                                        </div>
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">IP Address</span>
                                            <span className="text-[#111827] font-mono text-xs">{visitorData.ipAddress || 'Unavailable'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hardware / Geography */}
                                <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-2 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Hardware / Geography</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Device Class</span>
                                            <span className="text-[#111827] text-xs">{visitorData.deviceType || 'Unknown'}</span>
                                        </div>
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Browser Engine</span>
                                            <span className="text-[#111827] text-xs">{visitorData.browser || 'Unknown'}</span>
                                        </div>
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Operating System</span>
                                            <span className="text-[#111827] text-xs">{visitorData.operatingSystem || 'N/A'}</span>
                                        </div>
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Geographic Location</span>
                                            <span className="text-[#111827] text-xs">{formatLocation(visitorData.city, visitorData.country)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactivity Logs */}
                                <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-2 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Interactivity Logs</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Landing Path</span>
                                            <span className="text-[#111827] font-mono text-[11px]">{visitorData.landingPage || '/'}</span>
                                        </div>
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Referrer Origin</span>
                                            <span className="text-[#6B9F91] break-all text-xs">{visitorData.referrerUrl || 'Direct / None'}</span>
                                        </div>
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Total Page Views</span>
                                            <span className="text-[#111827] font-bold text-base">{visitorData.pageViews}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timestamps */}
                                <div className="bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-2 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Timestamps</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Initial Contact</span>
                                            <span className="text-[#111827] text-xs">{new Date(visitorData.firstVisitedAt).toLocaleString('en-GB')}</span>
                                        </div>
                                        <div className="px-3 py-2">
                                            <span className="text-[10px] text-[#9CA3AF] block">Last Sighted</span>
                                            <span className="text-[#111827] text-xs">{new Date(visitorData.lastVisitedAt).toLocaleString('en-GB')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* User-Agent */}
                                <div className="md:col-span-2 bg-[#EDF5F2]/40 rounded-md border border-gray-100 overflow-hidden">
                                    <div className="px-3 py-2 bg-[#EDF5F2]/70 border-b border-gray-200">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">Raw User-Agent Blob</span>
                                    </div>
                                    <div className="px-3 py-2">
                                        <span className="text-[#6B7280] text-[10px] break-all font-mono leading-relaxed">{visitorData.userAgent || 'No user agent signature captured.'}</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="px-4 py-2.5 border-t border-gray-200 flex justify-end bg-[#EDF5F2]/50 shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#EDF5F2] text-[#111827] hover:bg-[#EDF5F2]/80 transition-colors">Close Inspection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
