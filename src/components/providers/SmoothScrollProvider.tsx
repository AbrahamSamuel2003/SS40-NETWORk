"use client";
 
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Provide zero-overhead native passthrough for modals and drawers expecting __lenis
        const nativeScrollProxy = {
            stop: () => {
                document.body.style.overflow = "hidden";
            },
            start: () => {
                document.body.style.overflow = "";
            },
            scrollTo: (target: number | string | HTMLElement, options?: { immediate?: boolean }) => {
                if (typeof target === "number") {
                    window.scrollTo({
                        top: target,
                        behavior: options?.immediate ? "instant" : "smooth",
                    });
                } else if (typeof target === "string") {
                    const el = document.querySelector(target);
                    if (el) {
                        el.scrollIntoView({
                            behavior: options?.immediate ? "instant" : "smooth",
                            block: "start",
                        });
                    }
                } else if (target instanceof HTMLElement) {
                    target.scrollIntoView({
                        behavior: options?.immediate ? "instant" : "smooth",
                        block: "start",
                    });
                }
            },
        };

        (window as unknown as { __lenis?: typeof nativeScrollProxy }).__lenis = nativeScrollProxy;

        return () => {
            delete (window as unknown as { __lenis?: typeof nativeScrollProxy }).__lenis;
        };
    }, []);

    // Instantly reset scroll to top on route navigation
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return <>{children}</>;
}
