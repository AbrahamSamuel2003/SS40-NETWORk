import { prisma } from '@/lib/prisma';
import { Activity, Package, Briefcase, GraduationCap, Inbox, Users } from 'lucide-react';

export default async function AdminDashboardPage() {
    // Parallel fetch counts
    const [
        productsCount,
        clientProjectsCount,
        studentProjectsCount,
        leadsCount,
        visitorsCount,
        activities
    ] = await Promise.all([
        prisma.product.count(),
        prisma.clientProject.count(),
        prisma.studentProject.count(),
        prisma.lead.count(),
        prisma.visitor.count(),
        prisma.adminActivityLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { adminUser: true }
        })
    ]);

    const STATS = [
        { label: 'Total Products', value: productsCount, icon: Package, color: 'text-blue-500' },
        { label: 'Client Projects', value: clientProjectsCount, icon: Briefcase, color: 'text-indigo-500' },
        { label: 'Student Projects', value: studentProjectsCount, icon: GraduationCap, color: 'text-purple-500' },
        { label: 'Leads', value: leadsCount, icon: Inbox, color: 'text-rose-500' },
        { label: 'Visitors', value: visitorsCount, icon: Activity, color: 'text-green-500' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Overview</h2>
                <p className="text-white/60">High-level summary of your platform's content and engagement.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {STATS.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-[#111111] border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-white/20 transition-colors">
                            <Icon className={`w-8 h-8 mb-4 ${stat.color} opacity-80`} />
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                    <p className="text-sm text-white/50 mt-1">Audit log of latest CMS modifications.</p>
                </div>
                {activities.length === 0 ? (
                    <div className="p-8 text-center text-white/50">
                        No Recent Activity
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {activities.map((log) => (
                            <div key={log.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-white shadow-sm">
                                        <span className="text-[var(--color-primary)] font-bold">{log.adminUser?.fullName || 'System'}</span> {log.description.toLowerCase()}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-mono tracking-wide">
                                            {log.action}
                                        </span>
                                        <span>•</span>
                                        <span>{log.entity}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-white/40 whitespace-nowrap">
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
