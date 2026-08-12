"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface MobileNavProps {
    navLinks: { name: string; href: string }[];
}

export function MobileNav({ navLinks }: MobileNavProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathname = usePathname();

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Close when path changes
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Lock scroll
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-[var(--color-heading)] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-sm)]"
                aria-label="Open menu"
                aria-expanded={isOpen}
            >
                <Menu className="w-6 h-6" />
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                key="mobile-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] bg-black/40 md:hidden"
                                onClick={() => setIsOpen(false)}
                            />
                            <motion.div
                                key="mobile-menu"
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "tween", ease: "easeOut", duration: 0.28 }}
                                className="fixed top-0 right-0 z-[110] h-full w-full max-w-sm bg-[var(--color-background)] shadow-xl md:hidden overflow-y-auto"
                            >
                                <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                                    <span className="text-xl font-bold text-[var(--color-heading)]">Menu</span>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 text-gray-500 hover:text-[var(--color-heading)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-sm)] bg-gray-50 hover:bg-gray-100 transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <nav className="flex flex-col gap-2 p-6">
                                    {navLinks.map((link) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)} // Close on click
                                                className={cn(
                                                    "px-4 py-3 text-lg font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
                                                    isActive
                                                        ? "bg-[var(--color-primary)] text-white"
                                                        : "text-[var(--color-heading)] hover:bg-gray-100"
                                                )}
                                            >
                                                {link.name}
                                            </Link>
                                        );
                                    })}

                                    <div className="mt-8 flex flex-col gap-4">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="px-4 py-3 text-lg font-medium text-[var(--color-heading)] hover:bg-gray-100 rounded-xl transition-colors text-center"
                                        >
                                            Login
                                        </Link>
                                        <Button asChild className="w-full" size="lg" onClick={() => setIsOpen(false)}>
                                            <Link href="/contact">Contact Us</Link>
                                        </Button>
                                    </div>
                                </nav>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
