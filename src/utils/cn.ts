import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Global standardized layout utilities (Hero bleeds behind fixed transparent Navbar)
export const HERO_SPACING_CLASSES = "pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16 lg:min-h-[min(75vh,720px)] flex items-center";

