import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Activity, Package, Briefcase, GraduationCap, Inbox, Image as ImageIcon, ArrowRight, Plus, ExternalLink, Settings } from 'lucide-react';

export default async function AdminDashboardPage() {
    const [
        productsCount,
        clientProjectsCount,
        studentProjectsCount,
        leadsCount,
        visitorsCount,
        mediaCount,
        activities
    ] = await Promise.all([
        prisma.product.count(),
        prisma.clientProject.count(),
        prisma.studentProject.count(),
        prisma.lead.count(),
        prisma.visitor.count(),
        prisma.media.count(),
        prisma.adminActivityLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { adminUser: true }
        })
    ]);

    const stats = [
        { label: 'Products', value: productsCount, icon: Package, href: '/siva/products', color: 'text-[#0F766E]', bg: 'bg-[#EDF5F2]' },
        { label: 'Client Projects', value: clientProjectsCount, icon: Briefcase, href: '/siva/digital-solutions/client-projects', color: 'text-[#0F766E]', bg: 'bg-[#EDF5F2]' },
        { label: 'Student Projects', value: studentProjectsCount, icon: GraduationCap, href: '/siva/student-projects', color: 'text-[#0F766E]', bg: 'bg-[#EDF5F2]' },
        { label: 'Inquiries & Leads', value: leadsCount, icon: Inbox, href: '/siva/leads', color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Visitors', value: visitorsCount, icon: Activity, href: '/siva/visitors', color: 'text-[#0F766E]', bg: 'bg-[#EDF5F2]' },
        { label: 'Media Assets', value: mediaCount, icon: ImageIcon, href: '/siva/media', color: 'text-[#0F766E]', bg: 'bg-[#EDF5F2]' },
    ];

    const quickActions = [
        { label: 'Manage Inquiries', href: '/siva/leads', icon: Inbox, desc: 'Review inbound inquiries' },
        { label: 'Products & SaaS', href: '/siva/products', icon: Package, desc: 'Add or update SaaS products' },
        { label: 'Media Library', href: '/siva/media', icon: ImageIcon, desc: 'Upload images & banners' },
        { label: 'Site Configuration', href: '/siva/site-config', icon: Settings, desc: 'Global branding & contact' },
    ];

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EDF5F2] border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-wider">
                        CMS Overview
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1.5">
                        Platform Dashboard
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        Central control hub for managing content, products, leads, and assets.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/siva/leads"
                        className="admin-button-primary text-xs !py-2.5 !px-4"
                    >
                        <Inbox className="w-4 h-4" />
                        <span>View Inquiries ({leadsCount})</span>
                    </Link>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={idx}
                            href={stat.href}
                            className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:border-[#0F766E]/40 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                        >
                            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} border border-[#0F766E]/15 group-hover:scale-105 transition-transform`}>
                                <Icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-none mb-1">
                                {stat.value}
                            </div>
                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider line-clamp-1">
                                {stat.label}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Action Cards Grid */}
            <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Quick Navigation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {quickActions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={idx}
                                href={action.href}
                                className="bg-white border border-gray-200/90 hover:border-[#0F766E]/40 rounded-2xl p-4 flex items-center justify-between group hover:shadow-sm transition-all"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] flex items-center justify-center text-[#0F766E] shrink-0 group-hover:bg-[#0F766E] group-hover:text-white transition-colors">
                                        <Icon className="w-4.5 h-4.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#0F766E] transition-colors">
                                            {action.label}
                                        </h4>
                                        <p className="text-[11px] text-gray-400 truncate">
                                            {action.desc}
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs">
                <div className="p-4 sm:px-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">Recent Audit Activity</h3>
                        <p className="text-xs text-gray-500">Live audit log of latest CMS additions and modifications.</p>
                    </div>
                    <Link
                        href="/siva/activity-logs"
                        className="text-xs font-bold text-[#0F766E] hover:text-[#115E59] flex items-center gap-1"
                    >
                        <span>View All</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {activities.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 text-xs font-medium">
                        No recent system activities recorded yet.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {activities.map((log) => (
                            <div
                                key={log.id}
                                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-gray-50/70 transition-colors"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-medium text-[#0F172A] break-words">
                                        <span className="text-[#0F766E] font-bold">{log.adminUser?.fullName || 'System'}</span> {log.description.toLowerCase()}
                                    </p>
                                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                                        <span className="bg-[#EDF5F2] text-[#0F766E] border border-[#0F766E]/20 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wide">
                                            {log.action}
                                        </span>
                                        <span>•</span>
                                        <span className="font-mono text-[11px] text-gray-500">{log.entity}</span>
                                    </div>
                                </div>
                                <div className="text-[11px] text-gray-400 whitespace-nowrap shrink-0">
                                    {new Intl.DateTimeFormat('en-US', {
                                        month: 'short', day: 'numeric',
                                        hour: 'numeric', minute: '2-digit'
                                    }).format(new Date(log.createdAt))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
