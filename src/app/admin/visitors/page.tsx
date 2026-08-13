'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Bot, Globe, Shield, Trash2, Eye } from 'lucide-react';

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filters and Search
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
            } else {
                setErrorMsg(data.error || 'Failed to load visitors');
            }
        } catch (e) {
            setErrorMsg('Failed to load visitors.');
        } finally {
            setIsLoading(false);
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
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Visitors CRM</h2>
                <p className="text-white/60">Monitor and inspect localized website session traffic dynamically.</p>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-[450px]">
                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search session ID, browser, city, landing page..."
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setPage(1); // reset to page 1 on search
                        }}
                        onKeyDown={e => e.key === 'Enter' && fetchData()}
                        className="w-full bg-[#111111] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    {/* Additional client filters could go here, but relying on server 'search' encompasses them */}
                </div>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm text-white/80 whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/10 text-white">
                            <tr>
                                <th className="p-4 font-medium">Session ID</th>
                                <th className="p-4 font-medium">Platform / OS</th>
                                <th className="p-4 font-medium">Location</th>
                                <th className="p-4 font-medium text-center">Views</th>
                                <th className="p-4 font-medium">Last Visited</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-white/40">
                                        <div className="animate-spin rounded-full h-6 w-6 mx-auto border-t-2 border-b-2 border-white mb-2"></div>
                                        Fetching visitors securely...
                                    </td>
                                </tr>
                            ) : visitors.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-white/40">No tracked visitors match your query.</td></tr>
                            ) : (
                                visitors.map(item => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {item.isBot && (
                                                    <span title="Bot Detected">
                                                        <Bot className="w-4 h-4 text-purple-400" />
                                                    </span>
                                                )}
                                                <div className="font-mono text-white text-xs">{item.sessionId.substring(0, 14)}...</div>
                                            </div>
                                            <div className="text-white/40 text-[10px] mt-1 truncate max-w-[150px]">{item.landingPage || 'Direct'}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-white text-xs font-semibold">{item.deviceType || 'Unknown Device'}</div>
                                            <div className="text-white/60 text-[11px] mt-0.5">{item.browser || 'Unknown'} • {item.operatingSystem || 'N/A'}</div>
                                        </td>
                                        <td className="p-4 relative">
                                            <div className="text-white text-xs flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 opacity-60" /> {formatLocation(item.city, item.country)}</div>
                                            {item.ipAddress && <div className="text-white/40 text-[10px] font-mono mt-1">{item.ipAddress}</div>}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center bg-white/5 border border-white/10 rounded-md px-2 py-0.5 text-xs font-bold text-white/90">
                                                {item.pageViews}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-white/60">
                                            {new Date(item.lastVisitedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            <div className="text-[10px] text-white/30">{new Date(item.lastVisitedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleOpenModal(item)} className="text-[var(--color-primary)] hover:text-blue-400 p-2 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-500/50 hover:text-red-500 p-2 transition-colors ml-1">
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
                    <span className="px-4 py-2 text-white/60 flex items-center">Page {page} of {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 rounded-lg bg-[#111111] border border-white/10 text-white disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {isModalOpen && visitorData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-white/10 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[var(--color-primary)]" />
                                Visitor Integrity Details
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Detailed Information Grid */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Session Identity</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-white/40 block text-xs">Session ID</span><span className="text-white/90 font-mono text-[11px] break-all">{visitorData.sessionId}</span></div>
                                        <div>
                                            <span className="text-white/40 block text-xs">Bot Trajectory</span>
                                            {visitorData.isBot ? (
                                                <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded text-xs font-semibold">BOT DETECTED</span>
                                            ) : (
                                                <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded text-xs font-semibold">ORGANIC VISITOR</span>
                                            )}
                                        </div>
                                        <div><span className="text-white/40 block text-xs">IP Address</span><span className="text-white/90 font-mono text-xs">{visitorData.ipAddress || 'Unavailable'}</span></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Hardware / Geography</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-white/40 block text-xs">Device Class</span><span className="text-white/90">{visitorData.deviceType || 'Unknown'}</span></div>
                                        <div><span className="text-white/40 block text-xs">Browser Engine</span><span className="text-white/90">{visitorData.browser || 'Unknown'}</span></div>
                                        <div><span className="text-white/40 block text-xs">Operating System</span><span className="text-white/90">{visitorData.operatingSystem || 'N/A'}</span></div>
                                        <div><span className="text-white/40 block text-xs">Geographic Location</span><span className="text-white/90">{formatLocation(visitorData.city, visitorData.country)}</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Interactivity Logs</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-white/40 block text-xs">Landing Path</span><span className="text-white/90 font-mono text-[11px]">{visitorData.landingPage || '/'}</span></div>
                                        <div><span className="text-white/40 block text-xs">Referrer Origin</span><span className="text-white/90 break-all text-xs text-blue-400">{visitorData.referrerUrl || 'Direct / None'}</span></div>
                                        <div><span className="text-white/40 block text-xs">Total Page Views Recorded</span><span className="text-white/90 font-bold text-lg">{visitorData.pageViews}</span></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-white font-medium mb-4 border-b border-white/10 pb-2">Timestamps</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-white/40 block text-xs">Initial Contact</span><span className="text-white/90 text-xs">
                                            {new Date(visitorData.firstVisitedAt).toLocaleString('en-GB')}
                                        </span></div>
                                        <div><span className="text-white/40 block text-xs">Last Sighted</span><span className="text-white/90 text-xs">
                                            {new Date(visitorData.lastVisitedAt).toLocaleString('en-GB')}
                                        </span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <h4 className="text-white font-medium mb-2 border-b border-white/10 pb-2 text-sm">Raw User-Agent Blob</h4>
                                <div className="bg-white/5 p-3 rounded text-white/50 text-[10px] break-all font-mono leading-relaxed border border-white/5">
                                    {visitorData.userAgent || 'No user agent signature captured.'}
                                </div>
                            </div>

                        </div>
                        <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-black/20 mt-auto shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">Close Inspection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
