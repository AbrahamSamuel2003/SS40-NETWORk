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

    React.useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;
        let frameId: number | null = null;
        let scrolledState = window.scrollY > 10;
        let hiddenState = false;

        const handleScroll = () => {
            if (ticking) return;

            ticking = true;
            frameId = window.requestAnimationFrame(() => {
                const currentY = window.scrollY;
                const nextScrolled = currentY > 10;

                if (nextScrolled !== scrolledState) {
                    scrolledState = nextScrolled;
                    setIsScrolled(nextScrolled);
                }

                // Always show at top and lock anchor
                if (currentY <= 20) {
                    if (hiddenState) {
                        hiddenState = false;
                        setIsHidden(false);
                    }
                    lastY = currentY;
                    ticking = false;
                    return;
                }

                // Calculate exact scroll delta
                const diff = currentY - lastY;

                // Hide if scrolling down past 8px deadzone
                if (diff > 8 && currentY > 80) {
                    if (!hiddenState) {
                        hiddenState = true;
                        setIsHidden(true);
                    }
                    lastY = currentY;
                }
                // Reveal if scrolling up past 8px deadzone
                else if (diff < -8) {
                    if (hiddenState) {
                        hiddenState = false;
                        setIsHidden(false);
                    }
                    lastY = currentY;
                }

                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, []);

    return (
        <header
            // Uses standard transform positioning to animate. MobileNav overlay is portaled out to avoid containing block bugs
            className={cn(
                "sticky top-0 z-40 w-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu",
                isScrolled
                    ? "bg-gray-50/80 shadow-sm border-b border-[var(--color-border)]"
                    : "bg-gray-50 border-b border-transparent",
                isHidden ? "-translate-y-full" : "translate-y-0"
            )}
        >
            {/* Dedicated Blur Layer to prevent breaking fixed positioning context for MobileNav */}
            {isScrolled && <div className="absolute inset-0 backdrop-blur-lg pointer-events-none -z-10" />}

            <div className="container-width relative z-10 w-full">
                <div className="flex items-center justify-between h-[72px] lg:h-[80px]">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 md:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-md shrink-0 py-1"
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
                        <span className="text-2xl font-bold tracking-tight text-[var(--color-heading)] shrink-0 min-w-0">
                            {companyName.replace('NETWORK', '').trim()} <span className="text-[var(--color-primary)]">{companyName.includes('NETWORK') ? 'NETWORK' : ''}</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 xl:gap-2">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] outline-offset-2",
                                        isActive
                                            ? "text-[var(--color-primary)]"
                                            : "text-[var(--color-body-text)] hover:text-[var(--color-heading)] hover:bg-gray-100"
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
                    <MobileNav navLinks={NAV_LINKS} />
                </div>
            </div>
        </header>
    );
}
