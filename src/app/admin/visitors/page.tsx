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
                <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">Visitors CRM</h2>
                <p className="text-[#6B7280]">Monitor and inspect localized website session traffic dynamically.</p>
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
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left text-sm text-[#374151] whitespace-nowrap">
                        <thead className="bg-[#EDF5F2]/70 border-b border-gray-200 text-[#111827]">
                            <tr>
                                <th className="p-4 font-medium">Session ID</th>
                                <th className="p-4 font-medium">Platform / OS</th>
                                <th className="p-4 font-medium">Location</th>
                                <th className="p-4 font-medium text-center">Views</th>
                                <th className="p-4 font-medium">Last Visited</th>
                                <th className="p-4 font-medium text-right">Actions</th>
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
                                        <td className="p-4">
                                            <div className="text-[#111827] text-xs font-semibold">{item.deviceType || 'Unknown Device'}</div>
                                            <div className="text-[#6B7280] text-[11px] mt-0.5">{item.browser || 'Unknown'} • {item.operatingSystem || 'N/A'}</div>
                                        </td>
                                        <td className="p-4 relative">
                                            <div className="text-[#111827] text-xs flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 opacity-60" /> {formatLocation(item.city, item.country)}</div>
                                            {item.ipAddress && <div className="text-[#9CA3AF] text-[10px] font-mono mt-1">{item.ipAddress}</div>}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center justify-center bg-[#EDF5F2]/70 border border-gray-200 rounded-md px-2 py-0.5 text-xs font-bold text-[#111827]/90">
                                                {item.pageViews}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-[#6B7280]">
                                            {new Date(item.lastVisitedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            <div className="text-[10px] text-[#9CA3AF]">{new Date(item.lastVisitedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => handleOpenModal(item)} className="text-[#6B9F91] hover:text-[#6B9F91] p-2 transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="text-[#B91C1C]/50 hover:text-[#B91C1C] p-2 transition-colors ml-1">
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
                    <div className="admin-card w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#EDF5F2]/70">
                            <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[#6B9F91]" />
                                Visitor Integrity Details
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#9CA3AF] hover:text-[#111827]"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto w-full custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Detailed Information Grid */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[#111827] font-medium mb-4 border-b border-gray-200 pb-2">Session Identity</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-[#9CA3AF] block text-xs">Session ID</span><span className="text-[#111827]/90 font-mono text-[11px] break-all">{visitorData.sessionId}</span></div>
                                        <div>
                                            <span className="text-[#9CA3AF] block text-xs">Bot Trajectory</span>
                                            {visitorData.isBot ? (
                                                <span className="text-[#92400E] bg-[#FFC900]/15 px-2 py-0.5 rounded text-xs font-semibold">BOT DETECTED</span>
                                            ) : (
                                                <span className="text-[#6B9F91] bg-[#6B9F91]/10 px-2 py-0.5 rounded text-xs font-semibold">ORGANIC VISITOR</span>
                                            )}
                                        </div>
                                        <div><span className="text-[#9CA3AF] block text-xs">IP Address</span><span className="text-[#111827]/90 font-mono text-xs">{visitorData.ipAddress || 'Unavailable'}</span></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[#111827] font-medium mb-4 border-b border-gray-200 pb-2">Hardware / Geography</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-[#9CA3AF] block text-xs">Device Class</span><span className="text-[#111827]/90">{visitorData.deviceType || 'Unknown'}</span></div>
                                        <div><span className="text-[#9CA3AF] block text-xs">Browser Engine</span><span className="text-[#111827]/90">{visitorData.browser || 'Unknown'}</span></div>
                                        <div><span className="text-[#9CA3AF] block text-xs">Operating System</span><span className="text-[#111827]/90">{visitorData.operatingSystem || 'N/A'}</span></div>
                                        <div><span className="text-[#9CA3AF] block text-xs">Geographic Location</span><span className="text-[#111827]/90">{formatLocation(visitorData.city, visitorData.country)}</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[#111827] font-medium mb-4 border-b border-gray-200 pb-2">Interactivity Logs</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-[#9CA3AF] block text-xs">Landing Path</span><span className="text-[#111827]/90 font-mono text-[11px]">{visitorData.landingPage || '/'}</span></div>
                                        <div><span className="text-[#9CA3AF] block text-xs">Referrer Origin</span><span className="text-[#111827]/90 break-all text-xs text-[#6B9F91]">{visitorData.referrerUrl || 'Direct / None'}</span></div>
                                        <div><span className="text-[#9CA3AF] block text-xs">Total Page Views Recorded</span><span className="text-[#111827]/90 font-bold text-lg">{visitorData.pageViews}</span></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[#111827] font-medium mb-4 border-b border-gray-200 pb-2">Timestamps</h4>
                                    <div className="space-y-3 text-sm">
                                        <div><span className="text-[#9CA3AF] block text-xs">Initial Contact</span><span className="text-[#111827]/90 text-xs">
                                            {new Date(visitorData.firstVisitedAt).toLocaleString('en-GB')}
                                        </span></div>
                                        <div><span className="text-[#9CA3AF] block text-xs">Last Sighted</span><span className="text-[#111827]/90 text-xs">
                                            {new Date(visitorData.lastVisitedAt).toLocaleString('en-GB')}
                                        </span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <h4 className="text-[#111827] font-medium mb-2 border-b border-gray-200 pb-2 text-sm">Raw User-Agent Blob</h4>
                                <div className="bg-[#EDF5F2]/70 p-3 rounded text-[#6B7280] text-[10px] break-all font-mono leading-relaxed border border-gray-100">
                                    {visitorData.userAgent || 'No user agent signature captured.'}
                                </div>
                            </div>

                        </div>
                        <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-[#EDF5F2]/70 mt-auto shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg bg-[#EDF5F2] text-[#111827] hover:bg-[#EDF5F2] transition-colors">Close Inspection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
