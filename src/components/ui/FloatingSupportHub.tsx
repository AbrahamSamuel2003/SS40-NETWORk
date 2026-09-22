"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Bot, X } from "lucide-react";
import type { SiteConfigData } from "@/lib/site-config";
import { RuleBasedChatbot } from "@/components/chat/RuleBasedChatbot";

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

export function FloatingSupportHub({ config }: { config?: SiteConfigData | null }) {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const hubRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
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
        document.addEventListener("touchstart", handleClickOutside);

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
            {/* Mobile menu backdrop dismiss overlay */}
            <AnimatePresence>
                {isMenuOpen && !isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => setIsMenuOpen(false)}
                        className="fixed inset-0 bg-black/25 backdrop-blur-[1px] z-30 sm:hidden cursor-pointer"
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Floating Action Menu Stack */}
            <div
                ref={hubRef}
                className="fixed bottom-4 right-4 md:bottom-6 md:right-8 lg:bottom-8 lg:right-10 z-40 flex flex-col-reverse items-end gap-2.5 sm:gap-3 group"
                onMouseEnter={() => {
                    // Only open on hover for pointer devices
                    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                        setIsMenuOpen(true);
                    }
                }}
                onMouseLeave={() => {
                    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
                        setIsMenuOpen(false);
                    }
                }}
            >
                {/* ── Main Trigger Button (Message Icon) ── */}
                <motion.button
                    onClick={handleMainButtonClick}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className={`relative flex items-center justify-center w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full shadow-[0_8px_30px_rgba(15,118,110,0.35)] hover:shadow-[0_12px_45px_rgba(15,118,110,0.5)] transition-all duration-300 outline-none z-20 cursor-pointer touch-manipulation ${
                        isChatOpen || isMenuOpen
                            ? "bg-[#0F766E] text-white"
                            : "bg-[#0F766E] text-white"
                    }`}
                    aria-label="Open support and assistant menu"
                >
                    <AnimatePresence mode="wait">
                        {isChatOpen ? (
                            <motion.div
                                key="close-icon"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="msg-icon"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                            >
                                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-xs" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                {/* ── Revealed Stack Buttons (WhatsApp & Chatbot) ── */}
                <AnimatePresence>
                    {isMenuOpen && !isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.2, staggerChildren: 0.05 }}
                            className="flex flex-col items-end gap-2.5 pointer-events-auto"
                        >
                            {/* 1. Chatbot Action Pill */}
                            <motion.button
                                initial={{ opacity: 0, x: 16, scale: 0.85 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 16, scale: 0.85 }}
                                transition={{ duration: 0.18 }}
                                onClick={() => {
                                    setIsChatOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-2.5 pl-3.5 pr-2 py-1.5 sm:py-2 rounded-full bg-white text-[#0F766E] shadow-xl border border-gray-200/90 hover:border-[#0F766E]/40 hover:bg-[#D8E8E2]/40 active:scale-95 transition-all duration-200 cursor-pointer touch-manipulation group/chat"
                                aria-label="Open SS40 SKY Digital Assistant"
                            >
                                <span className="text-xs font-bold text-[#0F172A] tracking-tight">
                                    SS40 SKY
                                </span>
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white p-1 overflow-hidden flex items-center justify-center shadow-md group-hover/chat:scale-105 transition-transform border border-gray-100">
                                    <Image
                                        src="/images/ss40-sky-logo.png"
                                        alt="SS40 SKY"
                                        width={36}
                                        height={36}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </motion.button>

                            {/* 2. WhatsApp Action Pill */}
                            <motion.div
                                initial={{ opacity: 0, x: 16, scale: 0.85 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 16, scale: 0.85 }}
                                transition={{ duration: 0.18, delay: 0.04 }}
                            >
                                <Link
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2.5 pl-3.5 pr-2 py-1.5 sm:py-2 rounded-full bg-white text-[#25D366] shadow-xl border border-gray-200/90 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 active:scale-95 transition-all duration-200 cursor-pointer touch-manipulation group/wa"
                                    aria-label="Chat with us on WhatsApp"
                                >
                                    <span className="text-xs font-bold text-[#0F172A] tracking-tight">
                                        WhatsApp
                                    </span>
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover/wa:scale-105 transition-transform">
                                        <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                                    </div>
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Rule-Based Chatbot Window ── */}
            <RuleBasedChatbot
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                config={config}
            />
        </>
    );
}
