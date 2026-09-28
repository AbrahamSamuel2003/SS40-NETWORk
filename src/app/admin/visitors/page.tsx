'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Bot, Globe, Shield, Trash2, Eye, RefreshCw, Play, Pause, Calendar } from 'lucide-react';

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);
    const [cleanupDays, setCleanupDays] = useState(30);
    const [isCleaningUp, setIsCleaningUp] = useState(false);

    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Polling State
    const [isPolling, setIsPolling] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const POLLING_INTERVAL = 5000; // 5 seconds

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
        } catch {
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

    const handleOpenCleanupModal = () => {
        setIsCleanupModalOpen(true);
        setCleanupDays(30);
    };

    const handleCleanup = async () => {
        if (!confirm(`Are you sure you want to delete all visitor records older than ${cleanupDays} days? This action cannot be undone.`)) return;

        try {
            setIsCleaningUp(true);
            const res = await fetch('/api/admin/visitors', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ days: cleanupDays })
            });

            const data = await res.json();
            if (data.success) {
                alert(data.message || `Deleted ${data.deletedCount} records`);
                setIsCleanupModalOpen(false);
                fetchData();
            } else {
                alert(data.error || 'Cleanup failed');
            }
        } catch {
            alert('Error during cleanup');
        } finally {
            setIsCleaningUp(false);
        }
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
        } catch {
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">Visitors CRM</h1>
                    <p className="text-sm text-[#475569] mt-0.5">
                        Live traffic telemetry and session intelligence. Last updated:{' '}
                        <span className="font-mono text-xs text-[#0F766E]">
                            {lastUpdated ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '...'}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleOpenCleanupModal}
                        className="admin-button-secondary text-rose-600 hover:bg-rose-50 text-xs"
                        title="Clear old logs"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Clear History</span>
                    </button>
                    <button
                        onClick={handleManualRefresh}
                        className="p-2 admin-button-secondary"
                        title="Manual refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#0F766E]' : ''}`} />
                    </button>
                    <button
                        onClick={togglePolling}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-colors ${isPolling ? 'bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30' : 'bg-slate-100 text-slate-600'}`}
                        title={isPolling ? 'Pause live stream' : 'Resume live stream'}
                    >
                        {isPolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPolling ? 'Live Active' : 'Paused'}</span>
                    </button>
                </div>
            </div>

            {errorMsg && (
                <div className="p-3 text-xs sm:text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                    {errorMsg}
                </div>
            )}

            <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search session ID, browser, city, landing page..."
                    value={searchTerm}
                    onChange={e => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    onKeyDown={e => e.key === 'Enter' && fetchData()}
                    className="admin-input pl-9"
                />
            </div>

            <div className="admin-card overflow-hidden">
                {/* Mobile Cards: 2-Column Grid */}
                <div className="sm:hidden p-2.5">
                    {isLoading ? (
                        <div className="p-8 text-center text-sm text-[#64748B]">
                            <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-[#0F766E] mb-2"></div>
                            Loading visitor sessions...
                        </div>
                    ) : visitors.length === 0 ? (
                        <div className="p-8 text-center text-sm text-[#64748B]">No tracked visitors match your query.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                            {visitors.map(item => (
                                <div key={item.id} className="p-3 rounded-xl border border-gray-200/90 bg-white flex flex-col justify-between gap-2 shadow-xs hover:border-[#2DD4BF]/50 transition-colors">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between gap-1">
                                            <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#0F172A] truncate">
                                                {item.isBot && <Bot className="w-3 h-3 text-amber-600 shrink-0" />}
                                                <span className="truncate">{item.sessionId.substring(0, 8)}...</span>
                                            </div>
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#EDF5F2] text-[#0F766E] shrink-0">
                                                {item.pageViews}v
                                            </span>
                                        </div>

                                        <div className="text-[10px] text-[#475569] space-y-0.5">
                                            <div className="font-semibold text-[#0F172A] truncate">{item.deviceType || 'Device'} · {item.browser || 'Browser'}</div>
                                            <div className="flex items-center gap-1 text-[#64748B] truncate">
                                                <Globe className="w-2.5 h-2.5 text-[#0F766E] shrink-0" />
                                                <span className="truncate">{formatLocation(item.city, item.country)}</span>
                                            </div>
                                            <div className="text-[9px] text-[#94A3B8] font-mono truncate">
                                                {item.landingPage || '/'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                                        <span className="text-[9px] text-[#94A3B8]">
                                            {new Date(item.lastVisitedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-1.5 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-lg transition-colors flex items-center justify-center"
                                                title="Inspect Session"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 transition-colors flex items-center justify-center"
                                                title="Delete"
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

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Session ID</th>
                                <th>Platform &amp; Engine</th>
                                <th>Location &amp; IP</th>
                                <th className="text-center">Views</th>
                                <th>Last Sighted</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-[#64748B]">
                                        <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-[#0F766E] mb-2"></div>
                                        Fetching visitor sessions...
                                    </td>
                                </tr>
                            ) : visitors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-[#64748B]">No tracked visitors match your query.</td>
                                </tr>
                            ) : (
                                visitors.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#0F172A]">
                                                {item.isBot && <span title="Bot Detected"><Bot className="w-3.5 h-3.5 text-amber-600" /></span>}
                                                <span>{item.sessionId.substring(0, 16)}...</span>
                                            </div>
                                            <div className="text-[11px] text-[#64748B] font-mono mt-0.5 truncate max-w-[160px]">{item.landingPage || '/'}</div>
                                        </td>
                                        <td>
                                            <div className="text-xs font-semibold text-[#0F172A]">{item.deviceType || 'Unknown'}</div>
                                            <div className="text-[11px] text-[#64748B]">{item.browser || 'Unknown'} · {item.operatingSystem || 'N/A'}</div>
                                        </td>
                                        <td>
                                            <div className="text-xs text-[#0F172A] flex items-center gap-1">
                                                <Globe className="w-3.5 h-3.5 text-[#0F766E]" /> {formatLocation(item.city, item.country)}
                                            </div>
                                            {item.ipAddress && <div className="text-[10px] text-[#94A3B8] font-mono mt-0.5">{item.ipAddress}</div>}
                                        </td>
                                        <td className="text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#EDF5F2] text-[#0F766E]">
                                                {item.pageViews}
                                            </span>
                                        </td>
                                        <td className="text-xs text-[#475569]">
                                            <div>{new Date(item.lastVisitedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div>
                                            <div className="text-[10px] text-[#94A3B8]">{new Date(item.lastVisitedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-[#0F766E] hover:bg-[#EDF5F2] rounded-md transition-colors"
                                                >
                                                    Inspect
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                                >
                                                    Delete
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

            {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="admin-button-secondary text-xs disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-xs font-semibold text-[#475569] px-2">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="admin-button-secondary text-xs disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Inspect Modal */}
            {isModalOpen && visitorData && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-panel max-w-2xl">
                        <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAF9]">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#0F766E]" />
                                <div>
                                    <h3 className="text-base font-bold text-[#0F172A]">Visitor Session Inspection</h3>
                                    <p className="text-xs text-[#64748B]">Real-time telemetry trace</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto max-h-[calc(90vh-130px)] custom-scrollbar space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-[#E2E8F0] space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">Session Identity</span>
                                    <div>
                                        <span className="text-[10px] text-[#64748B] block">Session ID</span>
                                        <span className="text-[#0F172A] font-mono text-xs break-all font-semibold">{visitorData.sessionId}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-[#64748B] block">Bot Signature</span>
                                        {visitorData.isBot ? (
                                            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">BOT DETECTED</span>
                                        ) : (
                                            <span className="text-[#0F766E] bg-[#EDF5F2] px-2 py-0.5 rounded text-[10px] font-bold">ORGANIC USER</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-[#64748B] block">IP Address</span>
                                        <span className="text-[#0F172A] font-mono text-xs">{visitorData.ipAddress || 'Unavailable'}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3.5 rounded-xl border border-[#E2E8F0] space-y-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">Hardware &amp; Location</span>
                                    <div>
                                        <span className="text-[10px] text-[#64748B] block">Device / Browser</span>
                                        <span className="text-[#0F172A] text-xs font-semibold">{visitorData.deviceType || 'Unknown'} · {visitorData.browser || 'Unknown'}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-[#64748B] block">Operating System</span>
                                        <span className="text-[#0F172A] text-xs">{visitorData.operatingSystem || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-[#64748B] block">Location</span>
                                        <span className="text-[#0F172A] text-xs">{formatLocation(visitorData.city, visitorData.country)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-xl border border-[#E2E8F0]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] block mb-2">User Agent</span>
                                <p className="text-[11px] font-mono text-[#475569] break-all leading-relaxed bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
                                    {visitorData.userAgent || 'No user agent captured.'}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAF9] flex justify-end">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="admin-button-secondary">
                                Close Inspection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cleanup Modal */}
            {isCleanupModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-panel max-w-md">
                        <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAF9]">
                            <h3 className="text-base font-bold text-[#0F172A]">Clear Visitor Logs</h3>
                            <button onClick={() => setIsCleanupModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#334151] mb-1.5">
                                    Delete records older than (days):
                                </label>
                                <input
                                    type="number"
                                    value={cleanupDays}
                                    onChange={(e) => setCleanupDays(parseInt(e.target.value) || 30)}
                                    min="1"
                                    max="365"
                                    className="admin-input"
                                />
                            </div>
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                                This will permanently delete all visitor traces older than {cleanupDays} days.
                            </div>
                        </div>
                        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAF9] flex justify-end gap-2.5">
                            <button type="button" onClick={() => setIsCleanupModalOpen(false)} className="admin-button-secondary">Cancel</button>
                            <button onClick={handleCleanup} disabled={isCleaningUp} className="admin-button-primary bg-rose-600 hover:bg-rose-700">
                                {isCleaningUp ? 'Cleaning...' : 'Delete Old Logs'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
