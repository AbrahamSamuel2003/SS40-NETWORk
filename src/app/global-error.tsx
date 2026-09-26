"use client";

import * as React from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    React.useEffect(() => {
        console.error("Global Layout Error Caught:", error);

        // Auto-heal stale chunk load errors caused by new Vercel deployments
        const errorMsg = error?.message || "";
        const isChunkError =
            error?.name === "ChunkLoadError" ||
            errorMsg.includes("Loading chunk") ||
            errorMsg.includes("Failed to fetch dynamically imported module") ||
            errorMsg.includes("Failed to load script");

        if (isChunkError && typeof window !== "undefined") {
            const hasAutoReloaded = sessionStorage.getItem("ss40_global_chunk_reload");
            if (!hasAutoReloaded) {
                sessionStorage.setItem("ss40_global_chunk_reload", "true");
                window.location.reload();
                return;
            }
        }

        if (typeof window !== "undefined") {
            setTimeout(() => {
                sessionStorage.removeItem("ss40_global_chunk_reload");
            }, 5000);
        }
    }, [error]);

    return (
        <html lang="en">
            <body className="min-h-screen flex items-center justify-center p-4 bg-[#FAFCFB] font-sans antialiased text-[#0F172A]">
                <div className="max-w-md w-full text-center bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/50 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E] mb-5">
                        <svg className="w-8 h-8 text-[#0F766E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-[#0F172A] mb-2 font-serif">
                        Unable to load application
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        A temporary version synchronization error occurred. Please reload the page.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => {
                                if (typeof window !== "undefined") {
                                    window.location.reload();
                                } else {
                                    reset();
                                }
                            }}
                            className="w-full bg-[#0F766E] hover:bg-[#115E59] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-[#0F766E]/20 cursor-pointer"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
