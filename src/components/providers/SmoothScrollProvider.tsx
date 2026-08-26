"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

interface SmoothScrollProviderProps {
    children: React.ReactNode;
}

/**
 * RouteChangeScrollReset: Automatically resets scroll to top cleanly on public page transitions.
 */
function RouteChangeScrollReset() {
    const pathname = usePathname();
    const lenis = useLenis();
    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname, lenis]);

    return null;
}

/**
 * SmoothScrollProvider:
 * - Activates Lenis physics-driven scrolling for public-facing web pages.
 * - Automatically bypasses Lenis on Admin/CMS portals (/admin, /siva, /login) to guarantee
 *   100% native scrolling for sidebars, data tables, and modals.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/siva') || pathname === '/login';

    // If on admin dashboard or login page, render children directly with native browser scrolling
    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            options={{
                lerp: 0.09,
                duration: 1.2,
                smoothWheel: true,
                wheelMultiplier: 1.0,
                touchMultiplier: 1.0,
                syncTouch: false,
                autoRaf: true,
            }}
        >
            <RouteChangeScrollReset />
            {children}
        </ReactLenis>
    );
}
