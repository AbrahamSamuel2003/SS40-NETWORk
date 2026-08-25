import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Global standardized layout utilities (Compact 90% Scale Density)
export const HERO_SPACING_CLASSES = "pt-8 pb-12 lg:pt-10 lg:pb-14 lg:min-h-[min(70vh,680px)] flex items-center";

