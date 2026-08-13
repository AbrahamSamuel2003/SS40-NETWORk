'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import {
    LayoutDashboard,
    Settings,
    Image as ImageIcon,
    Package,
    Briefcase,
    GraduationCap,
    Smile,
    Award,
    Inbox,
    Users,
    Activity,
    LogOut,
    X,
    FileImage,
    ChevronDown,
    Home,
    Monitor,
    Database
} from 'lucide-react';

interface SidebarProps {
    adminName: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

type MenuItem = {
    name: string;
    href: string;
    icon?: React.ElementType;
    exact?: boolean;
    subItems?: Omit<MenuItem, 'subItems'>[];
};

type MenuLabel = {
    label: string;
};

type MenuBlock = MenuItem | MenuLabel;

const MENU_ITEMS: MenuBlock[] = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },

    { label: 'CONTENT' },
    {
        name: 'Home',
        href: '/admin/home', // Base route
        icon: Home,
        subItems: [
            { name: 'Logos', href: '/admin/home/logos' },
            { name: 'Happimonials', href: '/admin/home/happimonials' },
            { name: 'Media', href: '/admin/home/media' },
        ]
    },
    {
        name: 'Digital Solutions',
        href: '/admin/digital-solutions', // Logical grouping
        icon: Monitor,
        subItems: [
            { name: 'Client Projects', href: '/admin/digital-solutions/client-projects' }, // Existing
            { name: 'Happimonials', href: '/admin/digital-solutions/happimonials' }, // Existing
            { name: 'Organization Logos', href: '/admin/digital-solutions/organization-logos' }, // Existing
            { name: 'Media', href: '/admin/media' }, // Reusing media feature
        ]
    },
    {
        name: 'Products',
        href: '/admin/products-group',
        icon: Package,
        subItems: [
            { name: 'Products', href: '/admin/products' }, // Existing
            { name: 'Product Testimonials', href: '/admin/products/testimonials' },
            { name: 'Product Logos', href: '/admin/products/logos' },
            { name: 'Product Media', href: '/admin/products/media' },
        ]
    },
    {
        name: 'Academics',
        href: '/admin/academics',
        icon: GraduationCap,
        subItems: [
            { name: 'Student Projects', href: '/admin/student-projects' }, // Existing
            { name: 'Student Impacts', href: '/admin/student-impacts' }, // Existing
            { name: 'Academic Partner Logos', href: '/admin/academics/logos' },
            { name: 'Media', href: '/admin/media' }, // Reusing existing
        ]
    },


    { label: 'CRM' },
    {
        name: 'Leads',
        href: '/admin/leads',
        icon: Inbox,
    },
    {
        name: 'Visitors',
        href: '/admin/visitors',
        icon: Activity,
    },

    { label: 'SYSTEM' },
    {
        name: 'Site Config',
        href: '/admin/site-config',
        icon: Settings,
    },
    {
        name: 'Activity Logs',
        href: '/admin/activity-logs',
        icon: Database,
    },
];

export function AdminSidebar({ adminName, isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();

    // Auto-expand parents that contain active routes
    const getInitialExpanded = React.useCallback(() => {
        const expanded: Record<string, boolean> = {};
        for (const item of MENU_ITEMS) {
            if ('subItems' in item && item.subItems) {
                const isChildActive = item.subItems.some(sub =>
                    sub.exact ? pathname === sub.href : pathname.startsWith(sub.href)
                );
                if (isChildActive) {
                    expanded[item.name] = true;
                }
            }
        }
        return expanded;
    }, [pathname]);

    const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>(getInitialExpanded());

    // Update expansion state on route change smoothly if desired, but 
    // usually we just want to ensure parents are open if we directly land there.
    React.useEffect(() => {
        setExpandedMenus(prev => ({
            ...prev,
            ...getInitialExpanded()
        }));
    }, [pathname, getInitialExpanded]);

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
            window.location.href = '/login';
        }
    };

    const toggleMenu = (name: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/10 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 hidden-scrollbar",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                    <span className="text-xl font-bold tracking-tight text-white">
                        SS40 <span className="text-[var(--color-primary)]">CMS</span>
                    </span>
                    <button onClick={() => setIsOpen(false)} className="p-1 lg:hidden text-white/50 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-white/10">
                    <nav className="space-y-1 px-3">
                        {MENU_ITEMS.map((item, idx) => {
                            if ('label' in item) {
                                return (
                                    <div key={`label-${idx}`} className="pt-4 pb-2 px-3 text-xs font-semibold text-white/40 tracking-wider">
                                        {item.label}
                                    </div>
                                );
                            }

                            const hasSubItems = item.subItems && item.subItems.length > 0;

                            // Check if current parent is active in isolation (for non-subItem cases) or as a group
                            const isActiveGroup = hasSubItems
                                ? item.subItems!.some(sub => sub.exact ? pathname === sub.href : pathname.startsWith(sub.href))
                                : (item.exact ? pathname === item.href : pathname.startsWith(item.href));

                            const Icon = item.icon || Settings; // Fallback icon

                            if (hasSubItems) {
                                const isExpanded = expandedMenus[item.name];
                                return (
                                    <div key={item.name} className="flex flex-col space-y-1">
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                                isActiveGroup && !isExpanded
                                                    ? "bg-white/5 text-white"
                                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon size={18} className={isActiveGroup ? "text-[var(--color-primary)] opacity-100" : "opacity-75"} />
                                                {item.name}
                                            </div>
                                            <ChevronDown size={16} className={cn("transition-transform duration-200", isExpanded ? "rotate-180" : "rotate-0")} />
                                        </button>

                                        {/* SubItems Wrapper with simple conditional render (or layout animation) */}
                                        {isExpanded && (
                                            <div className="flex flex-col space-y-1 pl-9 mt-1">
                                                {item.subItems!.map((sub) => {
                                                    const isSubActive = sub.exact ? pathname === sub.href : pathname.startsWith(sub.href);
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            onClick={(e) => {
                                                                if (sub.href.endsWith('-group') || sub.href.includes('/home/')) {
                                                                    // We allow navigation to fake routes but closing mobile navigation
                                                                }
                                                                setIsOpen(false);
                                                            }}
                                                            className={cn(
                                                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                                                isSubActive
                                                                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                                                                    : "text-white/50 hover:text-white hover:bg-white/5"
                                                            )}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Regular Single Item
                            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                        isActive
                                            ? "bg-white/10 text-white font-medium"
                                            : "text-white/60 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <Icon size={18} className={isActive ? "text-[var(--color-primary)]" : "opacity-75"} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer / User Area */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between shrink-0 bg-[#0a0a0a]">
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-white truncate">{adminName}</span>
                        <span className="text-xs text-white/50 truncate">Administrator</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>
        </>
    );
}
