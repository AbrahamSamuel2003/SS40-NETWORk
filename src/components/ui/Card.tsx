import * as React from "react";
import { cn } from "@/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-[var(--radius-card)] bg-white p-[var(--spacing-card)] shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-hover)] border border-[var(--color-border)]",
                    className
                )}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";

export const CardMotion = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
    ({ className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "rounded-[var(--radius-card)] bg-white p-[var(--spacing-card)] shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-hover)] border border-[var(--color-border)]",
                    className
                )}
                {...props}
            />
        );
    }
);
CardMotion.displayName = "CardMotion";
