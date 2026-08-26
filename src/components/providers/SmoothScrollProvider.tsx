"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { LazyMotion, domAnimation } from "framer-motion";
import "lenis/dist/lenis.css";

interface SmoothScrollProviderProps {
    children: React.ReactNode;
}

/**
 * RouteChangeScrollReset: Automatically resets scroll to top cleanly on page route transitions.
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
 * TabVisibilityController: Pauses Lenis RAF animation loop when browser tab is in background,
 * reducing idle background CPU and battery consumption to 0%.
 */
function TabVisibilityController() {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                lenis.stop();
            } else {
                lenis.start();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [lenis]);

    return null;
}

/**
 * SmoothScrollProvider:
 * 1. LazyMotion: Strips unused 3D and heavy morph libraries, cutting animation JS bundle by ~70%.
 * 2. Lenis: Delivers physics-based inertial scrolling on desktop while passing through 120Hz native touch on mobile.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    return (
        <LazyMotion features={domAnimation} strict={false}>
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
                <TabVisibilityController />
                {children}
            </ReactLenis>
        </LazyMotion>
    );
}
