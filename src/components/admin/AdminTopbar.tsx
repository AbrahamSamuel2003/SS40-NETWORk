'use client';

import * as React from 'react';
import { Menu, LogOut } from 'lucide-react';
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
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-[#0a0a0a] border-b border-white/10 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 lg:hidden text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-lg lg:text-xl font-semibold text-white truncate">
                    {pageTitle}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <span className="hidden sm:block text-sm text-white/70">
                    Hello, <strong className="text-white font-medium">{adminName}</strong>
                </span>
                <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </header>
    );
}
