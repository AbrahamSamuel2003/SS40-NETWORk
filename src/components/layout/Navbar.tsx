"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Digital Solutions", href: "/digital-solutions" },
    { name: "Products", href: "/products" },
    { name: "Academics", href: "/academics" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-40 w-full transition-all duration-300",
                isScrolled
                    ? "bg-gray-50/80 shadow-sm border-b border-[var(--color-border)]"
                    : "bg-gray-50 border-b border-transparent"
            )}
        >
            {/* Dedicated Blur Layer to prevent breaking fixed positioning context for MobileNav */}
            {isScrolled && <div className="absolute inset-0 backdrop-blur-lg pointer-events-none -z-10" />}

            <div className="container-width relative z-10 w-full">
                <div className="flex items-center justify-between h-[72px] lg:h-[80px]">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-md"
                        aria-label="SS40 NETWORK Home"
                    >
                        <span className="text-2xl font-bold tracking-tight text-[var(--color-heading)]">
                            SS40 <span className="text-[var(--color-primary)]">NETWORK</span>
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
                    <div className="hidden md:flex items-center">
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
