'use client';

import * as React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

export const AdminLayoutClient = React.memo(function AdminLayoutClient({
    children,
    adminName
}: {
    children: React.ReactNode;
    adminName: string;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-[#F1F5F4] flex font-sans selection:bg-[#0F766E] selection:text-white antialiased">
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
                <main className="flex-1 overflow-x-clip p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
});
