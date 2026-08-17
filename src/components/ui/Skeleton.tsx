import * as React from "react";
import { cn } from "@/utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

// Base Skeleton component
export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("skeleton-shimmer rounded-md bg-gray-100", className)}
            {...props}
        />
    );
}

// 1. Logo Marquee Skeleton (for TrustedBy, Brands, Collaborations)
export function LogoMarqueeSkeleton({ count = 6, title = "Loading Partners..." }: { count?: number; title?: string }) {
    return (
        <div className="w-full py-8 flex flex-col items-center justify-center gap-6">
            {title && <Skeleton className="h-4 w-48 mb-4 mx-auto" />}
            <div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-6xl px-4">
                {Array.from({ length: count }).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="h-16 w-32 md:w-44 rounded-2xl"
                    />
                ))}
            </div>
        </div>
    );
}

// 2. Success Stories & Student Impacts Skeleton (Featured Video + Carousel Column)
export function StoryGridSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
            {/* Left Column (Featured Video Area) */}
            <div className="lg:col-span-2 flex flex-col h-full gap-4">
                <Skeleton className="w-full aspect-video rounded-2xl" />
            </div>

            {/* Right Column (Secondary Carousel) */}
            <div className="lg:col-span-1 flex flex-col h-full">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col gap-6 w-full h-full min-h-[320px]">
                    <div className="flex gap-1 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="w-5 h-5 rounded-full" />
                        ))}
                    </div>
                    <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="flex items-center gap-4 border-t border-gray-100 pt-6 shrink-0 mt-auto">
                        <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-3 w-1/3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 3. Grid/List Cards (Products, Projects, Testimonials)
export function CardGridSkeleton({ count = 3, columns = 3 }: { count?: number; columns?: number }) {
    const gridColsClass = 
        columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : 
        columns === 2 ? "grid-cols-1 md:grid-cols-2" : 
        "grid-cols-1 md:grid-cols-3";

    return (
        <div className={cn("grid gap-6 w-full max-w-6xl mx-auto px-4", gridColsClass)}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm h-full">
                    {/* Optional Card Image/Icon Placeholder */}
                    <Skeleton className="w-full aspect-video rounded-xl" />
                    
                    {/* Content */}
                    <div className="space-y-3 flex-1">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-5 w-1/3 rounded-full" />
                            <Skeleton className="h-4 w-1/5" />
                        </div>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 flex-1">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// 4. Featured Product Skeleton
export function FeaturedProductSkeleton() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row gap-8 items-center shadow-md">
                {/* Product Content Block */}
                <div className="flex-1 space-y-6 w-full">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-7 w-16 rounded-full" />
                        ))}
                    </div>
                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-12 w-36 rounded-xl" />
                        <Skeleton className="h-12 w-28 rounded-xl" />
                    </div>
                </div>

                {/* Product Screenshot Block */}
                <div className="flex-1 w-full max-w-lg">
                    <Skeleton className="w-full aspect-[4/3] rounded-2xl shadow-inner" />
                </div>
            </div>
        </div>
    );
}
