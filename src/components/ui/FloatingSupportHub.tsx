"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MessageSquare, X } from "lucide-react";
import type { SiteConfigData } from "@/lib/site-config";

// Pre-load RuleBasedChatbot in background for 0-latency instant opening
const loadChatbot = () => import("@/components/chat/RuleBasedChatbot");
const RuleBasedChatbot = dynamic(
    () => loadChatbot().then((mod) => mod.RuleBasedChatbot),
    { ssr: false }
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
);

export const SkyLogoIcon = ({
    className,
    headColor = "#0F766E",
    bubbleColor = "#FFFFFF",
    dotsColor = "#0F766E"
}: {
    className?: string;
    headColor?: string;
    bubbleColor?: string;
    dotsColor?: string;
}) => (
    <svg
        viewBox="0 0 100 70"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Left Ear Tab */}
        <rect x="5" y="27" width="10" height="16" rx="5" fill={headColor} />
        {/* Right Ear Tab */}
        <rect x="85" y="27" width="10" height="16" rx="5" fill={headColor} />

        {/* Main Outer Head Frame */}
        <path
            d="M 24 7 C 41 3 59 3 76 7 C 85 9 88 15 88 24 L 88 46 C 88 55 85 61 76 63 C 59 67 41 67 24 63 C 15 61 12 55 12 46 L 12 24 C 12 15 15 9 24 7 Z"
            fill={headColor}
        />

        {/* Inner Speech Bubble */}
        <path
            d="M 30 16 C 43 13 57 13 70 16 C 76 17.5 77 22 77 27 L 77 43 C 77 48 76 52.5 70 54 C 57 57 43 57 30 54 C 27.5 53.4 25.8 51.8 25 49 L 19 60 L 24.2 46.5 C 23.5 43.5 23 38 23 27 C 23 22 24 17.5 30 16 Z"
            fill={bubbleColor}
        />

        {/* 3 Horizontal Chat Ellipsis Dots */}
        <circle cx="37" cy="35" r="5" fill={dotsColor} />
        <circle cx="50" cy="35" r="5" fill={dotsColor} />
        <circle cx="63" cy="35" r="5" fill={dotsColor} />
    </svg>
);

export function FloatingSupportHub({ config }: { config?: SiteConfigData | null }) {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const hubRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        // Pre-warm the chatbot chunk during idle time for 0-latency opening
        if (typeof window !== "undefined") {
            if ("requestIdleCallback" in window) {
                (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(
                    () => { loadChatbot(); },
                    { timeout: 2500 }
                );
            } else {
                setTimeout(() => { loadChatbot(); }, 1200);
            }
        }
    }, []);

    // ── CLICK OUTSIDE DETECTION TO CLOSE MENU ──
    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (hubRef.current && !hubRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside, { passive: true });

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isMenuOpen]);

    if (!mounted) return null;

    const phoneNumber = config?.whatsappNumber ? config.whatsappNumber.replace(/\s+/g, '') : "918300591750";
    const companyName = config?.companyName || "SS40 NETWORK";
    const message = encodeURIComponent(`Hello ${companyName}, I'm interested in learning more about your services.`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    const handleMainButtonClick = () => {
        if (isChatOpen) {
            setIsChatOpen(false);
        } else {
            setIsMenuOpen(prev => !prev);
        }
    };

    return (
        <>
            {/* Mobile menu backdrop dismiss overlay with pure GPU alpha (zero backdrop-blur stall) */}
            <AnimatePresence>
                {isMenuOpen && !isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        onClick={() => setIsMenuOpen(false)}
                        className="fixed inset-0 bg-black/30 z-30 sm:hidden cursor-pointer"
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Floating Action Menu Stack */}
            <div
                ref={hubRef}
                className="fixed bottom-4 right-4 md:bottom-6 md:right-8 lg:bottom-8 lg:right-10 z-40 flex flex-col-reverse items-end gap-2.5 sm:gap-3 group select-none"
                onPointerEnter={() => {
                    loadChatbot(); // Warm immediately on hover
                    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                        setIsMenuOpen(true);
                    }
                }}
                onPointerLeave={() => {
                    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                        setIsMenuOpen(false);
                    }
                }}
                onTouchStart={() => loadChatbot()} // Warm instantly on touch contact
            >
                {/* ── Main Trigger Button (Message Icon) ── */}
                <motion.button
                    onClick={handleMainButtonClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative flex items-center justify-center w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full shadow-[0_8px_30px_rgba(15,118,110,0.35)] hover:shadow-[0_12px_45px_rgba(15,118,110,0.5)] transition-shadow duration-200 outline-none z-20 cursor-pointer touch-manipulation bg-[#0F766E] text-white active:bg-[#115E59]"
                    aria-label="Open support and assistant menu"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isChatOpen ? (
                            <motion.div
                                key="close-icon"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center justify-center"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="msg-icon"
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.85, opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="flex items-center justify-center"
                            >
                                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-xs" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* ── Revealed Stack Buttons (WhatsApp & SS40 SKY) ── */}
                <AnimatePresence>
                    {isMenuOpen && !isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col items-end gap-2.5 pointer-events-auto will-change-[transform,opacity]"
                        >
                            <button
                                onClick={() => {
                                    setIsChatOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-2.5 pl-3.5 pr-2 py-1.5 sm:py-2 rounded-full bg-white text-[#0F766E] shadow-xl border border-gray-200/90 hover:border-[#0F766E]/40 hover:bg-[#0F766E]/10 active:scale-95 transition-all duration-150 cursor-pointer touch-manipulation group/chat"
                                aria-label="Open SS40 SKY Digital Assistant"
                            >
                                <span className="text-xs font-bold text-[#0F172A] tracking-tight">
                                    SS40 SKY
                                </span>
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EDF5F2] flex items-center justify-center shadow-xs border border-[#0F766E]/20 p-1 group-hover/chat:scale-105 transition-transform">
                                    <SkyLogoIcon className="w-6 h-6" headColor="#0F766E" bubbleColor="#FFFFFF" dotsColor="#0F766E" />
                                </div>
                            </button>

                            {/* 2. WhatsApp Action Pill */}
                            <div className="w-fit">
                                <Link
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2.5 pl-3.5 pr-2 py-1.5 sm:py-2 rounded-full bg-white text-[#25D366] shadow-xl border border-gray-200/90 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 active:scale-95 transition-all duration-150 cursor-pointer touch-manipulation group/wa"
                                    aria-label="Chat with us on WhatsApp"
                                >
                                    <span className="text-xs font-bold text-[#0F172A] tracking-tight">
                                        WhatsApp
                                    </span>
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover/wa:scale-105 transition-transform">
                                        <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Rule-Based Chatbot Window (Rendered only when opened) ── */}
            {isChatOpen && (
                <RuleBasedChatbot
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    config={config}
                />
            )}
        </>
    );
}
