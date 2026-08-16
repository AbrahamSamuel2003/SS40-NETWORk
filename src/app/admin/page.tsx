import { prisma } from '@/lib/prisma';
import { Activity, Package, Briefcase, GraduationCap, Inbox } from 'lucide-react';

export default async function AdminDashboardPage() {
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

    const stats = [
        { label: 'Total Products', value: productsCount, icon: Package, color: 'text-[#6B9F91]' },
        { label: 'Client Projects', value: clientProjectsCount, icon: Briefcase, color: 'text-[#6B9F91]' },
        { label: 'Student Projects', value: studentProjectsCount, icon: GraduationCap, color: 'text-[#6B9F91]' },
        { label: 'Leads', value: leadsCount, icon: Inbox, color: 'text-[#FFC900]' },
        { label: 'Visitors', value: visitorsCount, icon: Activity, color: 'text-[#6B9F91]' },
    ];

    return (
        <div className="admin-page space-y-8">
            <div className="admin-page-header">
                <div>
                    <span className="inline-flex rounded-full bg-[#6B9F91]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6B9F91]">
                        Admin Dashboard
                    </span>
                    <h2 className="admin-page-title mt-3">Overview</h2>
                </div>
                <p className="admin-page-description">High-level summary of your platform&apos;s content and engagement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="admin-card p-6 flex flex-col items-center justify-center text-center hover:border-[#6B9F91]/30 transition-colors">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDF5F2] border border-[#6B9F91]/10">
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="text-3xl font-extrabold text-[#111827] mb-1">{stat.value}</div>
                            <div className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            <div className="admin-card overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-white/60">
                    <h3 className="text-xl font-extrabold text-[#111827]">Recent Activity</h3>
                    <p className="text-sm text-[#6B7280] mt-1">Audit log of latest CMS modifications.</p>
                </div>
                {activities.length === 0 ? (
                    <div className="p-8 text-center text-[#6B7280]">
                        No Recent Activity
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {activities.map((log) => (
                            <div key={log.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#EDF5F2]/60 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-[#111827]">
                                        <span className="text-[#6B9F91] font-bold">{log.adminUser?.fullName || 'System'}</span> {log.description.toLowerCase()}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-[#6B7280]">
                                        <span className="bg-[#EDF5F2] text-[#111827] px-2 py-0.5 rounded text-[10px] font-mono tracking-wide">
                                            {log.action}
                                        </span>
                                        <span>•</span>
                                        <span>{log.entity}</span>
                                    </div>
                                </div>
                                <div className="text-xs text-[#6B7280] whitespace-nowrap">
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
