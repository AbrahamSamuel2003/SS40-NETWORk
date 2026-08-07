import * as React from "react";
import { cn } from "@/utils/cn";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]": variant === "primary",
                        "bg-[var(--color-alternate)] text-[var(--color-heading)] hover:bg-[var(--color-soft)]": variant === "secondary",
                        "border border-[var(--color-border)] bg-transparent hover:bg-gray-50": variant === "outline",
                        "bg-transparent hover:bg-gray-100": variant === "ghost",
                        "h-9 px-4 py-2 text-sm rounded-[var(--radius-btn)]": size === "sm",
                        "h-[56px] px-[28px] py-[16px] text-base rounded-[var(--radius-btn)]": size === "md",
                        "h-14 px-8 text-lg rounded-[var(--radius-btn)]": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
