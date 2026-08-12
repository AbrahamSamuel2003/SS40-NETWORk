'use client';

import * as React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

export function AdminLayoutClient({
    children,
    adminName
}: {
    children: React.ReactNode;
    adminName: string;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-[#070707] flex font-sans selection:bg-[var(--color-primary)] selection:text-white">
            <AdminSidebar
                adminName={adminName}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
                <AdminTopbar
                    adminName={adminName}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 overflow-x-hidden p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
