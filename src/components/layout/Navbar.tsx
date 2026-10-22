"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import type { SiteConfigData } from "@/lib/site-config";

// Desktop top-level links (Company has a submenu containing Careers)
const DESKTOP_NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Digital Solutions", href: "/digital-solutions" },
    { name: "Products", href: "/products" },
    { name: "Academics", href: "/academics" },
];

// Mobile navigation links (all links appear directly as normal)
const MOBILE_NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Digital Solutions", href: "/digital-solutions" },
    { name: "Products", href: "/products" },
    { name: "Academics", href: "/academics" },
    { name: "Company", href: "/company" },
    { name: "Careers", href: "/careers" },
];

export function Navbar({ config }: { config?: SiteConfigData | null }) {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isHidden, setIsHidden] = React.useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = React.useState(false);
    const companyDropdownRef = React.useRef<HTMLDivElement>(null);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();

    const companyName = config?.companyName || "SS40 NETWORK";
    // Desktop: 100% transparent at the top of every page, frosted glass when scrolled down
    const isTop = !isScrolled;

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsCompanyOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsCompanyOpen(false);
        }, 150);
    };

    // Close company dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) {
                setIsCompanyOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Close company dropdown on page change
    React.useEffect(() => {
        setIsCompanyOpen(false);
    }, [pathname]);

    React.useEffect(() => {
        let lastY = typeof window !== "undefined" ? window.scrollY : 0;
        let ticking = false;
        let frameId: number | null = null;

        const updateScrollState = () => {
            if (typeof window === "undefined") return;
            const currentY = window.scrollY;
            
            // Scrolled threshold: transparent ONLY at the top (<= 10px)
            setIsScrolled(currentY > 10);

            // Always show navbar when near top
            if (currentY <= 20) {
                setIsHidden(false);
            } else {
                const diff = currentY - lastY;
                // Hide when scrolling down past 80px
                if (diff > 8 && currentY > 80) {
                    setIsHidden(true);
                }
                // Reveal when scrolling up
                else if (diff < -8) {
                    setIsHidden(false);
                }
            }

            lastY = currentY;
            ticking = false;
        };

        // Immediate check on mount and pathname route transition
        updateScrollState();

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            frameId = window.requestAnimationFrame(updateScrollState);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", updateScrollState, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", updateScrollState);
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [pathname]);

    const isCompanyActive = pathname === "/company" || pathname.startsWith("/careers");

    return (
        <header
            // Mobile: Always solid frosted background.
            // Desktop: 100% transparent at the top of all pages (no bg, no blur), high-transparency frosted glass on scroll.
            className={cn(
                "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu will-change-[transform] font-crimson font-serif",
                "bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-200/50",
                isTop
                    ? "md:bg-transparent md:border-transparent md:shadow-none md:backdrop-blur-none"
                    : "md:bg-white/92 md:backdrop-blur-md md:shadow-xs md:border-b md:border-gray-200/50",
                isHidden ? "-translate-y-full" : "translate-y-0"
            )}
        >

            <div className="container-width relative z-10 w-full">
                <div className="flex items-center justify-between h-[72px] lg:h-[80px]">
                    {/* Logo */}
                    <Link
                        href="/"
                        prefetch={true}
                        className="flex items-center gap-2 md:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-md shrink-0 min-w-0 py-1"
                        aria-label={`${companyName} Home`}
                    >
                        {(config?.uploadedLogoUrl || config?.logoUrl) && (
                            <Image
                                src={(config?.uploadedLogoUrl || config?.logoUrl) as string}
                                alt={`${companyName} Official Logo`}
                                width={48}
                                height={48}
                                className="h-7 md:h-9 w-auto object-contain shrink-0 mix-blend-multiply"
                                priority
                            />
                        )}
                        <span className="text-xl md:text-2xl font-black tracking-tight text-[var(--color-heading)] shrink-0 min-w-0 truncate max-w-[180px] sm:max-w-none font-crimson">
                            SS40 <span className="text-[var(--color-primary-hover)] font-black">NETWORK</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 xl:gap-2 font-crimson">
                        {DESKTOP_NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    prefetch={true}
                                    className={cn(
                                        "px-4 py-2 text-base transition-all duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] outline-offset-2 font-crimson",
                                        isActive
                                            ? "text-[#134E4A] font-bold bg-[#D8E8E2]"
                                            : "text-[#374151] font-medium hover:text-[#111827] hover:bg-gray-100"
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        {/* Company Dropdown (Containing About Company & Careers) */}
                        <div 
                            ref={companyDropdownRef}
                            className="relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                type="button"
                                onClick={() => setIsCompanyOpen(prev => !prev)}
                                className={cn(
                                    "px-4 py-2 text-base transition-all duration-200 rounded-full flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] outline-offset-2 font-crimson cursor-pointer",
                                    isCompanyActive || isCompanyOpen
                                        ? "text-[#134E4A] font-bold bg-[#D8E8E2]"
                                        : "text-[#374151] font-medium hover:text-[#111827] hover:bg-gray-100"
                                )}
                                aria-expanded={isCompanyOpen}
                            >
                                <span>Company</span>
                                <ChevronDown className={cn(
                                    "w-3.5 h-3.5 transition-transform duration-200",
                                    isCompanyOpen && "rotate-180"
                                )} />
                            </button>

                            {/* Dropdown Menu */}
                            {isCompanyOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                                    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xl shadow-black/10 p-1.5 min-w-[190px] flex flex-col gap-0.5 backdrop-blur-md">
                                        <Link
                                            href="/company"
                                            prefetch={true}
                                            onClick={() => setIsCompanyOpen(false)}
                                            className={cn(
                                                "px-3.5 py-2.5 rounded-xl text-left transition-colors font-crimson block",
                                                pathname === "/company"
                                                    ? "bg-[#EDF5F2] text-[#0F766E] font-bold"
                                                    : "text-[#0F172A] hover:bg-[#F8FAF9] hover:text-[#0F766E]"
                                            )}
                                        >
                                            <div className="text-sm font-bold leading-tight">About Company</div>
                                            <div className="text-[11px] text-gray-400 font-normal mt-0.5">Our vision &amp; roots</div>
                                        </Link>

                                        <Link
                                            href="/careers"
                                            prefetch={true}
                                            onClick={() => setIsCompanyOpen(false)}
                                            className={cn(
                                                "px-3.5 py-2.5 rounded-xl text-left transition-colors font-crimson block",
                                                pathname.startsWith("/careers")
                                                    ? "bg-[#EDF5F2] text-[#0F766E] font-bold"
                                                    : "text-[#0F172A] hover:bg-[#F8FAF9] hover:text-[#0F766E]"
                                            )}
                                        >
                                            <div className="text-sm font-bold leading-tight">Careers</div>
                                            <div className="text-[11px] text-gray-400 font-normal mt-0.5">Active vacancies</div>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3 font-crimson">
                        <Button asChild size="sm" className="md:px-6 font-crimson font-bold text-sm">
                            <Link href="/contact" prefetch={true}>Contact Us</Link>
                        </Button>
                    </div>

                    {/* Mobile Navigation (Contains all links directly as normal) */}
                    <MobileNav navLinks={MOBILE_NAV_LINKS} config={config} />
                </div>
            </div>
        </header>
    );
}
