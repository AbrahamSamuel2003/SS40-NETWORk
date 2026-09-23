"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    X,
    Home,
    Code2,
    Box,
    GraduationCap,
    ChevronRight,
    ArrowRight,
    Phone,
    Mail,
    Landmark
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import type { SiteConfigData } from "@/lib/site-config";

interface MobileNavProps {
    navLinks: { name: string; href: string }[];
    config?: SiteConfigData | null;
}

interface NavItemDetails {
    href: string;
    name: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
}

const NAV_DETAILS: Record<string, { subtitle: string; icon: React.ComponentType<{ className?: string }> }> = {
    "/": {
        subtitle: "Ecosystem Overview",
        icon: Home
    },
    "/digital-solutions": {
        subtitle: "Custom Software and Cloud Systems",
        icon: Code2
    },
    "/products": {
        subtitle: "ClearInvoice and SaaS Platforms",
        icon: Box
    },
    "/academics": {
        subtitle: "Live Client Projects and Training",
        icon: GraduationCap
    }
};

export function MobileNav({ navLinks, config }: MobileNavProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Close on route navigation
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Lock background scroll when open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const companyName = config?.companyName || "SS40 NETWORK";
    const phone = config?.contactPhone || "+91 83005 91750";
    const email = config?.contactEmail || "support@ss40network.com";

    const items: NavItemDetails[] = navLinks.map((link) => {
        const detail = NAV_DETAILS[link.href] || {
            subtitle: "Explore page",
            icon: Home
        };
        return {
            href: link.href,
            name: link.name,
            subtitle: detail.subtitle,
            icon: detail.icon
        };
    });

    return (
        <>
            {/* Hamburger Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="p-2 text-[#0F172A] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Portal Drawer Overlay */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="mobile-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-xs md:hidden"
                                onClick={() => setIsOpen(false)}
                                aria-hidden="true"
                            />

                            {/* Drawer Content Container */}
                            <motion.div
                                key="mobile-drawer"
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.24 }}
                                className="fixed top-0 right-0 z-[110] h-full w-full max-w-[360px] sm:max-w-sm bg-white shadow-2xl md:hidden flex flex-col overflow-hidden border-l border-gray-100 font-crimson font-serif"
                                role="dialog"
                                aria-modal="true"
                                aria-label="Mobile Navigation Menu"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/70 shrink-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        {(config?.uploadedLogoUrl || config?.logoUrl) && (
                                            <Image
                                                src={(config?.uploadedLogoUrl || config?.logoUrl) as string}
                                                alt={`${companyName} Logo`}
                                                width={32}
                                                height={32}
                                                className="h-7 w-auto object-contain shrink-0 mix-blend-multiply"
                                                priority
                                            />
                                        )}
                                        <span className="text-base font-black tracking-tight text-[#0F172A] font-times truncate">
                                            SS40 <span className="text-[#0F766E] font-black">NETWORK</span>
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#0F172A] hover:bg-gray-100 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Navigation Items List */}
                                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
                                    <div className="px-2 pt-1 pb-1">
                                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                                            Navigation Ecosystem
                                        </span>
                                    </div>

                                    {items.map((item) => {
                                        const isActive = pathname === item.href;
                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "group flex items-center justify-between p-3 rounded-2xl border transition-all duration-150 active:scale-[0.98]",
                                                    isActive
                                                        ? "bg-[#EDF5F2] border-[#0F766E]/30 shadow-2xs"
                                                        : "bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/70"
                                                )}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs",
                                                        isActive
                                                            ? "bg-[#0F766E] text-white"
                                                            : "bg-[#EDF5F2] text-[#0F766E] group-hover:bg-[#E0EFEA]"
                                                    )}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>

                                                    <div className="flex flex-col min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className={cn(
                                                                "text-sm font-bold truncate",
                                                                isActive ? "text-[#0F766E]" : "text-[#0F172A]"
                                                            )}>
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                        <span className="text-[11px] text-gray-500 truncate font-normal">
                                                            {item.subtitle}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center shrink-0 pl-2">
                                                    <ChevronRight className={cn(
                                                        "w-4 h-4 transition-transform",
                                                        isActive ? "text-[#0F766E] translate-x-0.5" : "text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5"
                                                    )} />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Drawer Footer */}
                                <div className="p-4 border-t border-gray-100 bg-gray-50/80 space-y-3 shrink-0">
                                    {/* Primary CTA */}
                                    <Button
                                        asChild
                                        size="lg"
                                        className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-[#0F766E]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Link href="/contact">
                                            <span>Contact Us</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </Button>

                                    {/* Quick Contact Links */}
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <a
                                            href={`tel:${phone.replace(/\s+/g, '')}`}
                                            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-[#0F172A] hover:bg-gray-50 active:scale-95 transition-all truncate"
                                            aria-label={`Call ${phone}`}
                                        >
                                            <Phone className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                            <span className="truncate">{phone}</span>
                                        </a>

                                        <a
                                            href={`mailto:${email}`}
                                            className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-[#0F172A] hover:bg-gray-50 active:scale-95 transition-all truncate"
                                            aria-label={`Email ${email}`}
                                        >
                                            <Mail className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                            <span className="truncate">Email Us</span>
                                        </a>
                                    </div>

                                    {/* Corporate Compliance Sub-strip */}
                                    <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] font-semibold text-gray-400">
                                        <Landmark className="w-3 h-3 text-[#0F766E]" />
                                        <span>MCA Registered • Tirunelveli HQ</span>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
