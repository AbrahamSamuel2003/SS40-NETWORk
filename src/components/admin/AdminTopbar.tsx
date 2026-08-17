'use client';

import * as React from 'react';
import { Menu, LogOut, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface TopbarProps {
    adminName: string;
    onMenuClick: () => void;
}

export function AdminTopbar({ adminName, onMenuClick }: TopbarProps) {
    const pathname = usePathname();

    // Naive way to generate a page title from the pathname
    const pageTitle = pathname === '/admin'
        ? 'Dashboard'
        : pathname.split('/').pop()?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Dashboard';

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
            window.location.href = '/login';
        }
    };

    return (
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shrink-0 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 lg:hidden text-[#111827]/70 hover:text-[#111827] hover:bg-[#EDF5F2] rounded-md transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-lg lg:text-xl font-bold text-[#111827] truncate">
                    {pageTitle}
                </h1>
            </div>
            <div className="flex items-center gap-3">
                <a
                    href="/"
                    className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#6B9F91] transition-colors px-3 py-2 rounded-md hover:bg-[#EDF5F2]"
                    title="Home"
                >
                    <Home size={16} />
                    <span className="hidden sm:inline">Home</span>
                </a>
                <span className="hidden sm:block text-sm text-[#6B7280]">
                    Hello, <strong className="text-[#111827] font-semibold">{adminName}</strong>
                </span>
                <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] transition-colors"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </header>
    );
}
