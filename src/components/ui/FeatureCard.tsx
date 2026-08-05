import * as React from "react";
import { Card } from "./Card";
import { IconBox } from "./IconBox";
import { cn } from "@/utils/cn";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
    ({ className, title, description, icon, ...props }, ref) => {
        return (
            <Card ref={ref} className={cn("flex flex-col gap-4 items-start", className)} {...props}>
                {icon && <IconBox size="md">{icon}</IconBox>}
                <div>
                    <h3 className="text-card-title mb-2">{title}</h3>
                    <p className="text-body text-[var(--color-body-text)]">{description}</p>
                </div>
            </Card>
        );
    }
);
FeatureCard.displayName = "FeatureCard";
