'use client';

import * as React from 'react';
import { Menu, LogOut, ExternalLink, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface TopbarProps {
    adminName: string;
    onMenuClick: () => void;
}

export function AdminTopbar({ adminName, onMenuClick }: TopbarProps) {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (pathname === '/siva' || pathname === '/admin') return 'Dashboard Overview';
        const parts = pathname.split('/').filter(Boolean);
        const lastPart = parts[parts.length - 1];
        if (!lastPart) return 'Dashboard';
        return lastPart
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    };

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
            window.location.href = '/login';
        }
    };

    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200/90 shrink-0 sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
                <button
                    onClick={onMenuClick}
                    type="button"
                    aria-label="Open Navigation"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 lg:hidden text-gray-600 hover:text-[#0F766E] hover:bg-[#EDF5F2] rounded-xl transition-colors cursor-pointer"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex flex-col min-w-0">
                    <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        Admin CMS
                    </span>
                    <h1 className="text-base sm:text-lg font-bold text-[#0F172A] truncate tracking-tight">
                        {getPageTitle()}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#0F766E] transition-colors px-3 py-2 rounded-xl hover:bg-[#EDF5F2] border border-transparent hover:border-[#0F766E]/20"
                    title="View Public Site"
                >
                    <ExternalLink className="w-4 h-4 text-[#0F766E]" />
                    <span className="hidden sm:inline">Live Website</span>
                </a>

                <div className="h-5 w-px bg-gray-200 hidden sm:block" />

                <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200/80 px-3 py-1.5 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-[#EDF5F2] border border-[#0F766E]/20 text-[#0F766E] flex items-center justify-center text-xs font-bold">
                        <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#0F172A] hidden md:inline truncate max-w-[120px]">
                        {adminName}
                    </span>
                </div>

                <button
                    onClick={handleLogout}
                    type="button"
                    title="Logout from CMS"
                    className="min-h-[38px] min-w-[38px] sm:min-h-auto sm:min-w-auto flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rose-600 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}
