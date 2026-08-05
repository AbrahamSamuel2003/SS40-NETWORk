import * as React from "react";
import { cn } from "@/utils/cn";

export const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "w-full max-w-[var(--spacing-container)] mx-auto px-6 md:px-8",
                    className
                )}
                {...props}
            />
        );
    }
);
Container.displayName = "Container";
