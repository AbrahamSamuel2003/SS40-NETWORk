"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        // Respect accessibility reduced motion preference
        if (typeof window === "undefined") return;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.95,
            touchMultiplier: 1.5,
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
