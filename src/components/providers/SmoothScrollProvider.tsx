"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        // Respect accessibility reduced motion preference or touch devices
        if (typeof window === "undefined") return;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window;
        if (prefersReducedMotion || isTouchDevice) return;

        const lenis = new Lenis({
            duration: 0.35,
            easing: (t) => 1 - Math.pow(1 - t, 3), // Instant cubic-out response eliminating rubbery 800ms lag
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.15,
            touchMultiplier: 1.0,
            infinite: false
        });

        // Expose global reference for modals/drawers
        (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

        let frameId: number;
        function raf(time: number) {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
        }
        frameId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(frameId);
            lenis.destroy();
            delete (window as unknown as { __lenis?: Lenis }).__lenis;
        };
    }, []);

    // Instantly reset scroll to top on route navigation
    useEffect(() => {
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        } else if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return <>{children}</>;
}
