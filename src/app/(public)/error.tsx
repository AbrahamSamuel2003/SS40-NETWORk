"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function PublicError({ error, reset }: ErrorProps) {
    const [isRetrying, setIsRetrying] = React.useState(false);

    React.useEffect(() => {
        // Log the error to console for diagnostics
        console.error("Public Route Error Caught:", error);

        // Auto-heal stale chunk load errors caused by new Vercel deployments
        const errorMsg = error?.message || "";
        const isChunkError =
            error?.name === "ChunkLoadError" ||
            errorMsg.includes("Loading chunk") ||
            errorMsg.includes("Failed to fetch dynamically imported module") ||
            errorMsg.includes("Failed to load script");

        if (isChunkError && typeof window !== "undefined") {
            const hasAutoReloaded = sessionStorage.getItem("ss40_auto_chunk_reload");
            if (!hasAutoReloaded) {
                sessionStorage.setItem("ss40_auto_chunk_reload", "true");
                window.location.reload();
                return;
            }
        }

        // Clear flag once rendered
        if (typeof window !== "undefined") {
            setTimeout(() => {
                sessionStorage.removeItem("ss40_auto_chunk_reload");
            }, 5000);
        }
    }, [error]);

    const handleRetry = () => {
        setIsRetrying(true);
        try {
            reset();
        } catch {
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        }
        setTimeout(() => setIsRetrying(false), 1500);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FAFCFB]">
            <div className="max-w-md w-full text-center bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/50 flex flex-col items-center">
                {/* Warning Icon Badge */}
                <div className="w-16 h-16 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E] mb-6 shadow-xs">
                    <AlertTriangle className="w-8 h-8 text-[#0F766E]" />
                </div>

                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0F766E] bg-[#EDF5F2] px-3 py-1 rounded-full mb-3">
                    Temporary Loading Interruption
                </span>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-serif mb-3">
                    Something went wrong
                </h1>

                <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                    We encountered a brief connection or version sync issue while loading this page. Please try refreshing.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
                    <Button
                        onClick={handleRetry}
                        disabled={isRetrying}
                        className="flex-1 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold py-3 rounded-xl shadow-md shadow-[#0F766E]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
                        <span>{isRetrying ? "Reloading..." : "Try Again"}</span>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="flex-1 border-gray-200 hover:bg-gray-50 text-[#0F172A] font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                        <Link href="/">
                            <Home className="w-4 h-4 text-gray-500" />
                            <span>Home</span>
                        </Link>
                    </Button>
                </div>

                {/* Support Assistance */}
                <div className="w-full pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-500">
                    <a
                        href="https://wa.me/918300591750"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#0F766E] hover:underline font-semibold"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        WhatsApp Support
                    </a>
                    <span>•</span>
                    <a
                        href="tel:+918300591750"
                        className="inline-flex items-center gap-1.5 text-[#0F766E] hover:underline font-semibold"
                    >
                        <Phone className="w-3.5 h-3.5" />
                        +91 83005 91750
                    </a>
                </div>
            </div>
        </div>
    );
}
