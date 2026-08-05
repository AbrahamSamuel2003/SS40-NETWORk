import * as React from "react";
import { Card } from "./Card";
import { cn } from "@/utils/cn";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    label: string;
    description?: string;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
    ({ className, value, label, description, ...props }, ref) => {
        return (
            <Card ref={ref} className={cn("flex flex-col items-center justify-center text-center", className)} {...props}>
                <h3 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-2">{value}</h3>
                <p className="text-lg font-semibold text-[var(--color-heading)] mb-1">{label}</p>
                {description && <p className="text-sm text-[var(--color-body-text)]">{description}</p>}
            </Card>
        );
    }
);
StatCard.displayName = "StatCard";
