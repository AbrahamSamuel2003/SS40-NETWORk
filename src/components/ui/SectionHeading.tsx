import * as React from "react";
import { cn } from "@/utils/cn";

interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title: React.ReactNode;
    description?: React.ReactNode;
    badge?: string;
    align?: "left" | "center" | "right";
}

export const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
    ({ className, title, description, badge, align = "center", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col gap-4",
                    {
                        "items-center text-center md:items-start md:text-left": align === "left",
                        "items-center text-center": align === "center",
                        "items-end text-right": align === "right",
                    },
                    className
                )}
                {...props}
            >
                {badge && (
                    <span className="inline-block rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-hover)]">
                        {badge}
                    </span>
                )}
                <h2 className="text-section-title font-bold text-[var(--color-heading)]">{title}</h2>
                {description && (
                    <p className="text-section-desc text-[var(--color-body-text)] max-w-2xl">{description}</p>
                )}
            </div>
        );
    }
);
SectionHeading.displayName = "SectionHeading";
