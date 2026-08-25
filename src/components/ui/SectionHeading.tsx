import * as React from "react";
import { cn } from "@/utils/cn";

interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title: React.ReactNode;
    description?: React.ReactNode;
    badge?: string;
    align?: "left" | "center" | "right";
    highlight?: string;
}

export const SectionHeading = React.forwardRef<HTMLDivElement, SectionHeadingProps>(
    ({ className, title, description, badge, align = "center", highlight, ...props }, ref) => {
        // Universal consistent dual-tone gradient title renderer across all sections
        const renderTitle = () => {
            if (typeof title !== "string") {
                return title;
            }

            const trimmedTitle = title.trim();

            // 1. Explicit highlight prop
            if (highlight && trimmedTitle.includes(highlight)) {
                const parts = trimmedTitle.split(highlight);
                return (
                    <>
                        {parts[0]}
                        <span className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#2DD4BF] bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                            {highlight}
                        </span>
                        {parts.slice(1).join(highlight)}
                    </>
                );
            }

            // 2. Split on natural punctuation if present (. — - :) [NO COMMA SPLIT]
            const punctuationRegex = /([.—\-:])\s+/;
            const match = trimmedTitle.match(punctuationRegex);
            if (match && match.index !== undefined) {
                const splitIndex = match.index + match[1].length;
                const firstPart = trimmedTitle.slice(0, splitIndex).trim();
                const secondPart = trimmedTitle.slice(splitIndex).trim();
                if (secondPart) {
                    return (
                        <>
                            <span>{firstPart} </span>
                            <span className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#2DD4BF] bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                                {secondPart}
                            </span>
                        </>
                    );
                }
            }

            // 3. Natural balanced word-split for consistent dual-tone across all headings
            const words = trimmedTitle.split(/\s+/);
            if (words.length >= 2) {
                const splitAt = words.length <= 3 ? Math.max(1, words.length - 1) : Math.ceil(words.length / 2);
                const firstWords = words.slice(0, splitAt).join(" ");
                const secondWords = words.slice(splitAt).join(" ");
                return (
                    <>
                        <span>{firstWords} </span>
                        <span className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#2DD4BF] bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                            {secondWords}
                        </span>
                    </>
                );
            }

            // 4. Fallback for single-word title
            return (
                <span className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#2DD4BF] bg-clip-text text-transparent">
                    {trimmedTitle}
                </span>
            );
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "flex flex-col gap-3.5 sm:gap-4",
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
                    <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#0F766E] border border-[#0F766E]/20 shadow-xs">
                        {badge}
                    </div>
                )}

                <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-extrabold tracking-[-0.03em] leading-[1.18] text-[#0F172A]">
                    {renderTitle()}
                </h2>

                {description && (
                    <div
                        className={cn(
                            "text-sm sm:text-base text-[#334155] font-medium leading-relaxed max-w-xl",
                            align === "left" && "md:border-l-2 md:border-[#2DD4BF]/60 md:pl-4 md:py-0.5"
                        )}
                    >
                        {description}
                    </div>
                )}
            </div>
        );
    }
);
SectionHeading.displayName = "SectionHeading";
