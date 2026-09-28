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
    Inbox,
    Activity,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Home,
    Monitor,
    Database,
    Shield,
    FileText
} from 'lucide-react';

interface SidebarProps {
    adminName: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    isDesktopCollapsed?: boolean;
    onToggleDesktopCollapse?: () => void;
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
    { name: 'Dashboard', href: '/siva', icon: LayoutDashboard, exact: true },

    {
        name: 'Home CMS',
        href: '/siva/home',
        icon: Home,
        subItems: [
            { name: 'Brand Logos', href: '/siva/home/logos' },
            { name: 'Happimonials', href: '/siva/home/happimonials' },
            { name: 'Activities & Blogs', href: '/siva/activities' },
        ]
    },
    {
        name: 'Digital Solutions',
        href: '/siva/digital-solutions',
        icon: Monitor,
        subItems: [
            { name: 'Client Projects', href: '/siva/digital-solutions/client-projects' },
            { name: 'Client Happimonials', href: '/siva/digital-solutions/happimonials' },
            { name: 'Organization Logos', href: '/siva/digital-solutions/organization-logos' },
        ]
    },
    {
        name: 'Products & SaaS',
        href: '/siva/products',
        icon: Package,
        subItems: [
            { name: 'Products Catalog', href: '/siva/products', exact: true },
            { name: 'Product Testimonials', href: '/siva/products/testimonials' },
            { name: 'Client Logos', href: '/siva/products/logos' },
        ]
    },
    {
        name: 'Academics',
        href: '/siva/academics',
        icon: GraduationCap,
        subItems: [
            { name: 'Student Projects', href: '/siva/student-projects' },
            { name: 'Student Impacts', href: '/siva/student-impacts' },
            { name: 'Partner Logos', href: '/siva/academics/logos' },
        ]
    },
    {
        name: 'Media Assets',
        href: '/siva/media',
        icon: ImageIcon,
    },

    { label: 'CRM & ANALYTICS' },
    {
        name: 'Inquiries & Leads',
        href: '/siva/leads',
        icon: Inbox,
    },
    {
        name: 'Traffic Visitors',
        href: '/siva/visitors',
        icon: Activity,
    },

    { label: 'SYSTEM' },
    {
        name: 'Site Configuration',
        href: '/siva/site-config',
        icon: Settings,
    },
    {
        name: 'Audit Logs',
        href: '/siva/activity-logs',
        icon: Database,
    },
];

export function AdminSidebar({
    adminName,
    isOpen,
    setIsOpen,
    isDesktopCollapsed = false,
    onToggleDesktopCollapse
}: SidebarProps) {
    const pathname = usePathname();

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

    React.useEffect(() => {
        setExpandedMenus(prev => ({
            ...prev,
            ...getInitialExpanded()
        }));
    }, [pathname, getInitialExpanded]);

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
                    className="fixed inset-0 z-40 bg-[#0F172A]/50 backdrop-blur-xs lg:hidden transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Unified Desktop Middle Toggle Button */}
            {onToggleDesktopCollapse && (
                <button
                    type="button"
                    onClick={onToggleDesktopCollapse}
                    title={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    aria-label={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    className={cn(
                        "hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 items-center justify-center bg-white border border-gray-200/90 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer group select-none",
                        isDesktopCollapsed
                            ? "left-0 translate-x-0 w-6 h-12 rounded-r-xl rounded-l-none border-l-0 text-gray-500 hover:text-[#0F766E] hover:w-7.5 hover:bg-[#EDF5F2]/80 hover:border-[#0F766E]/40"
                            : "left-64 -translate-x-1/2 w-7 h-7 rounded-full text-gray-600 hover:text-[#0F766E] hover:bg-[#EDF5F2] hover:border-[#0F766E]/50 hover:scale-105 active:scale-95"
                    )}
                >
                    {isDesktopCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#0F766E] transition-transform duration-200 group-hover:translate-x-0.5" />
                    ) : (
                        <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-[#0F766E] transition-transform duration-200 group-hover:-translate-x-0.5" />
                    )}
                </button>
            )}

            {/* Sidebar Shell */}
            <aside
                data-lenis-prevent="true"
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200/90 text-[#0F172A] flex flex-col h-full transition-transform duration-300 ease-in-out shadow-xl shadow-gray-200/50",
                    isOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none lg:pointer-events-auto",
                    isDesktopCollapsed ? "lg:-translate-x-full lg:pointer-events-none" : "lg:translate-x-0 lg:pointer-events-auto"
                )}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 sm:px-5 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl overflow-hidden border border-gray-200/90 bg-white shadow-xs flex items-center justify-center shrink-0">
                            <img src="/logos/ss40-logo.jpeg" alt="SS40 Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-black tracking-tight text-[#0F172A]">
                                SS40 <span className="text-[#0F766E]">ADMIN CMS</span>
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close Sidebar"
                        className="p-1.5 min-h-[40px] min-w-[40px] flex items-center justify-center lg:hidden text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Links */}
                <div
                    data-lenis-prevent="true"
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-3.5 px-3 space-y-0.5 scrollbar-thin scrollbar-thumb-gray-200"
                    style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
                >
                    <nav className="space-y-0.5">
                        {MENU_ITEMS.map((item, idx) => {
                            if ('label' in item) {
                                return (
                                    <div key={`label-${idx}`} className="pt-4 pb-1.5 px-3 text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">
                                        {item.label}
                                    </div>
                                );
                            }

                            const hasSubItems = item.subItems && item.subItems.length > 0;

                            const isActiveGroup = hasSubItems
                                ? item.subItems!.some(sub => sub.exact ? pathname === sub.href : pathname.startsWith(sub.href))
                                : (item.exact ? pathname === item.href : pathname.startsWith(item.href));

                            const Icon = item.icon || Settings;

                            if (hasSubItems) {
                                const isExpanded = expandedMenus[item.name];
                                return (
                                    <div key={item.name} className="flex flex-col space-y-0.5">
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            type="button"
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px]",
                                                isActiveGroup && !isExpanded
                                                    ? "bg-[#EDF5F2] text-[#0F766E] border border-[#0F766E]/20"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-[#0F172A]"
                                            )}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon className={cn("w-4 h-4", isActiveGroup ? "text-[#0F766E]" : "text-gray-400")} />
                                                <span>{item.name}</span>
                                            </div>
                                            <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform duration-200", isExpanded ? "rotate-180" : "rotate-0")} />
                                        </button>

                                        {isExpanded && (
                                            <div className="flex flex-col space-y-0.5 pl-6 pr-1 py-1 border-l-2 border-gray-100 ml-5">
                                                {item.subItems!.map((sub) => {
                                                    const isSubActive = sub.exact ? pathname === sub.href : pathname.startsWith(sub.href);
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            onClick={() => setIsOpen(false)}
                                                            className={cn(
                                                                "flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-all min-h-[36px]",
                                                                isSubActive
                                                                    ? "bg-[#0F766E] text-white shadow-xs font-bold"
                                                                    : "text-gray-500 hover:text-[#0F172A] hover:bg-gray-50"
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
                                        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px]",
                                        isActive
                                            ? "bg-[#0F766E] text-white shadow-sm"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-[#0F172A]"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-400")} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer User Area */}
                <div className="p-3.5 border-t border-gray-100 flex items-center shrink-0 bg-gray-50/80">
                    <div className="flex items-center gap-2.5 min-w-0 w-full">
                        <div className="w-8 h-8 rounded-xl bg-[#EDF5F2] border border-[#0F766E]/20 text-[#0F766E] flex items-center justify-center font-bold text-xs shrink-0">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-[#0F172A] truncate">{adminName || 'System Administrator'}</span>
                            <span className="text-[10px] text-gray-500 truncate">Super Admin</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
