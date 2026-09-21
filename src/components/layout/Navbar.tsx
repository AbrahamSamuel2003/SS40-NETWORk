"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import type { SiteConfigData } from "@/lib/site-config";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Digital Solutions", href: "/digital-solutions" },
    { name: "Products", href: "/products" },
    { name: "Academics", href: "/academics" },
];

export function Navbar({ config }: { config?: SiteConfigData | null }) {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isHidden, setIsHidden] = React.useState(false);
    const pathname = usePathname();

    const companyName = config?.companyName || "SS40 NETWORK";
    // Desktop: 100% transparent at the top of every page, frosted glass when scrolled down
    const isTop = !isScrolled;

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

    return (
        <header
            // Mobile: Always solid frosted background.
            // Desktop: 100% transparent at the top of all pages (no bg, no blur), high-transparency frosted glass on scroll.
            className={cn(
                "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu",
                "bg-white/95 backdrop-blur-xl shadow-xs border-b border-gray-200/50",
                isTop
                    ? "md:bg-transparent md:border-transparent md:shadow-none md:backdrop-blur-none"
                    : "md:bg-white/85 md:backdrop-blur-xl md:shadow-xs md:border-b md:border-gray-200/50",
                isHidden ? "-translate-y-full" : "translate-y-0"
            )}
        >

            <div className="container-width relative z-10 w-full">
                <div className="flex items-center justify-between h-[72px] lg:h-[80px]">
                    {/* Logo */}
                    <Link
                        href="/"
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
                        <span className="text-xl md:text-2xl font-black tracking-tight text-[var(--color-heading)] shrink-0 min-w-0 truncate max-w-[180px] sm:max-w-none font-times">
                            SS40 <span className="text-[var(--color-primary-hover)] font-black">NETWORK</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 xl:gap-2">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 text-sm transition-all duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] outline-offset-2",
                                        isActive
                                            ? "text-[#0F766E] font-bold bg-[#D8E8E2]"
                                            : "text-[#374151] font-medium hover:text-[#111827] hover:bg-gray-100"
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button asChild size="sm" className="md:px-6">
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <MobileNav navLinks={NAV_LINKS} config={config} />
                </div>
            </div>
        </header>
    );
}
