import * as React from "react";
import { cn } from "@/utils/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "primary" | "accent";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flexitems-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
                    {
                        "bg-gray-100 text-gray-800": variant === "default",
                        "bg-[var(--color-primary)]/10 text-[var(--color-primary-hover)]": variant === "primary",
                        "bg-[var(--color-accent)]/20 text-yellow-800": variant === "accent",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = "Badge";
