"use client";

import * as React from "react";
import { useRef, useState, useCallback } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";
import { springSmooth } from "@/lib/animations";

interface SpotlightCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

/**
 * SpotlightCard: High-performance cursor-tracking glowing card.
 * Uses CSS variables `--mouse-x` and `--mouse-y` on mouse movement so
 * that only GPU compositor layers re-paint without React state re-render thrashing.
 */
export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
    ({ children, className, spotlightColor = "rgba(45, 212, 191, 0.12)", ...props }, ref) => {
        const divRef = useRef<HTMLDivElement>(null);
        const [isFocused, setIsFocused] = useState(false);
        const [opacity, setOpacity] = useState(0);

        const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            if (!divRef.current) return;
            const rect = divRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            divRef.current.style.setProperty("--mouse-x", `${x}px`);
            divRef.current.style.setProperty("--mouse-y", `${y}px`);
        }, []);

        const handleFocus = () => {
            setIsFocused(true);
            setOpacity(1);
        };

        const handleBlur = () => {
            setIsFocused(false);
            setOpacity(0);
        };

        const handleMouseEnter = () => {
            setOpacity(1);
        };

        const handleMouseLeave = () => {
            setOpacity(0);
        };

        return (
            <motion.div
                ref={(node) => {
                    // Set local ref and forwarded ref
                    (divRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
                    if (typeof ref === "function") ref(node);
                    else if (ref) ref.current = node;
                }}
                onMouseMove={handleMouseMove}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                whileHover={{ y: -4 }}
                transition={springSmooth}
                className={cn(
                    "relative overflow-hidden rounded-[var(--radius-card)] bg-white border border-gray-200/80 p-6 shadow-xs hover:shadow-xl transition-shadow duration-300",
                    className
                )}
                {...props}
            >
                {/* Spotlight Overlay */}
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-10"
                    style={{
                        opacity,
                        background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${spotlightColor}, transparent 40%)`,
                    }}
                />
                {children}
            </motion.div>
        );
    }
);

SpotlightCard.displayName = "SpotlightCard";
