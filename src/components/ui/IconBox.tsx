import * as React from "react";
import { cn } from "@/utils/cn";

interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "accent";
}

export const IconBox = React.forwardRef<HTMLDivElement, IconBoxProps>(
    ({ className, size = "md", variant = "primary", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex flex-shrink-0 items-center justify-center rounded-2xl",
                    {
                        "w-10 h-10": size === "sm",
                        "w-12 h-12": size === "md",
                        "w-16 h-16": size === "lg",
                        "bg-[var(--color-primary)]/10 text-[var(--color-primary)]": variant === "primary",
                        "bg-[var(--color-alternate)] text-[var(--color-primary-hover)]": variant === "secondary",
                        "bg-[var(--color-accent)]/10 text-[var(--color-accent)]": variant === "accent",
                    },
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
IconBox.displayName = "IconBox";
