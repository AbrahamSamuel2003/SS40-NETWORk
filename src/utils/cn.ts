import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Global standardized layout utilities
export const HERO_SPACING_CLASSES = "pt-12 pb-16 lg:pt-16 lg:pb-32 lg:min-h-[min(85vh,900px)] flex items-center";

