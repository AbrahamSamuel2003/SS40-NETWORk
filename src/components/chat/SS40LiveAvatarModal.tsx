"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient, AnamEvent } from "@anam-ai/js-sdk";
import type AnamClient from "@anam-ai/js-sdk/dist/module/AnamClient";
import { PhoneOff, Mic, MicOff, X, Clock } from "lucide-react";

const TOTAL_SESSION_SECONDS = 60; // 1-minute strict limit to conserve free credits
const FAREWELL_TRIGGER_SECONDS = 8; // At 52s (8s remaining), avatar speaks farewell

interface SS40LiveAvatarModalProps {
    isSupportMenuOpen?: boolean;
}

export function SS40LiveAvatarModal({ isSupportMenuOpen = false }: SS40LiveAvatarModalProps) {
    const [isAvailable, setIsAvailable] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(true); // Visible on page by default as compact card
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SESSION_SECONDS);
    const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const clientRef = useRef<AnamClient | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isHoveredRef = useRef<boolean>(false);
    const hasInitialTimerRun = useRef<boolean>(false);
    const hasTriggeredFarewell = useRef<boolean>(false);

    // Initial check: if server has no key or credits are 0, hide completely
    useEffect(() => {
        let mounted = true;
        async function checkAvailability() {
            try {
                const res = await fetch("/api/anam-session", { method: "POST" });
                const data = await res.json();
                if (mounted) {
                    if (!data.available) {
                        setIsAvailable(false);
                    }
                }
            } catch {
                if (mounted) setIsAvailable(false);
            }
        }
        checkAvailability();
        return () => {
            mounted = false;
        };
    }, []);

    // Initial 1.5-second display on page load, then auto-collapse to circle
    useEffect(() => {
        if (hasInitialTimerRun.current || isConnected || isLoading) return;
        const initialTimer = setTimeout(() => {
            hasInitialTimerRun.current = true;
            if (!isHoveredRef.current && !isConnected && !isLoading) {
                setIsCollapsed(true);
            }
        }, 1500);

        return () => {
            clearTimeout(initialTimer);
        };
    }, [isConnected, isLoading]);

    // Outside-tap listener to collapse when expanded on mobile touch
    useEffect(() => {
        if (isCollapsed || isConnected || !isOpen) return;

        const handleOutsideTouch = (event: MouseEvent | TouchEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsCollapsed(true);
            }
        };

        document.addEventListener("mousedown", handleOutsideTouch);
        document.addEventListener("touchstart", handleOutsideTouch, { passive: true });

        return () => {
            document.removeEventListener("mousedown", handleOutsideTouch);
            document.removeEventListener("touchstart", handleOutsideTouch);
        };
    }, [isCollapsed, isConnected, isOpen]);

    // Mouse-only hover expansion logic (strict pointerType === "mouse" to never interfere with touch)
    const handlePointerEnter = (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        isHoveredRef.current = true;
        if (collapseTimerRef.current) {
            clearTimeout(collapseTimerRef.current);
            collapseTimerRef.current = null;
        }
        setIsCollapsed(false);
    };

    const handlePointerLeave = (e: React.PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        isHoveredRef.current = false;
        if (isConnected || isLoading) return;
        // If initial 3s display has already completed, collapse promptly on mouse leave
        if (hasInitialTimerRun.current) {
            if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
            collapseTimerRef.current = setTimeout(() => {
                if (!isHoveredRef.current && !isConnected && !isLoading) {
                    setIsCollapsed(true);
                }
            }, 250);
        }
    };

    // 1-minute countdown timer logic
    useEffect(() => {
        if (!isConnected) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeLeft(TOTAL_SESSION_SECONDS);
            hasTriggeredFarewell.current = false;
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                // At 8s remaining (52s elapsed), speak verbal farewell
                if (prev <= FAREWELL_TRIGGER_SECONDS && !hasTriggeredFarewell.current) {
                    hasTriggeredFarewell.current = true;
                    if (clientRef.current) {
                        try {
                            clientRef.current.talk("For further details, please contact SS40 Network. Have a great day!");
                        } catch (e) {
                            console.warn("[Anam] Could not trigger farewell speech:", e);
                        }
                    }
                }

                // When timer reaches 0, gracefully fade out and terminate
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    handleTimeExhausted();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isConnected]);

    const handleTimeExhausted = () => {
        setIsFadingOut(true);
        setTimeout(async () => {
            await endSession();
            // Disappear slowly like credits ended
            setIsAvailable(false);
        }, 1200);
    };

    const startSession = async () => {
        setIsLoading(true);
        setIsCollapsed(false); // Ensure fully expanded during call
        try {
            // 1. Fetch ephemeral session token from Next.js backend
            const res = await fetch("/api/anam-session", { method: "POST" });
            const data = await res.json();

            // Auto-killswitch: if credits are exhausted or key missing, disappear
            if (!data.available || !data.sessionToken) {
                setIsAvailable(false);
                return;
            }

            // 2. Initialize Anam WebRTC Client
            const client = createClient(data.sessionToken);
            clientRef.current = client;

            // 3. Listen for session termination / credit limit events
            client.addListener(AnamEvent.CONNECTION_CLOSED, () => {
                setIsConnected(false);
                setIsAvailable(false);
            });

            // 4. Bind WebRTC media stream to video element
            await client.streamToVideoElement("anam-video-element");
            setIsConnected(true);
        } catch (err: unknown) {
            console.error("[Anam] Failed to connect live avatar:", err);
            setIsAvailable(false);
        } finally {
            setIsLoading(false);
        }
    };

    const endSession = async () => {
        if (clientRef.current) {
            try {
                await clientRef.current.stopStreaming();
            } catch (err) {
                console.warn("[Anam] Error stopping stream:", err);
            }
            clientRef.current = null;
        }
        setIsConnected(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleClose = async () => {
        setIsFadingOut(true);
        setTimeout(async () => {
            await endSession();
            setIsOpen(false);
        }, 300);
    };

    const toggleMute = () => {
        if (!clientRef.current) return;
        if (isMuted) {
            clientRef.current.unmuteInputAudio();
            setIsMuted(false);
        } else {
            clientRef.current.muteInputAudio();
            setIsMuted(true);
        }
    };

    // Format remaining time MM:SS
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    // If credits ended or avatar disabled, render nothing (floating support remains solo)
    if (!isAvailable || !isOpen) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                ref={modalRef}
                layout
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{
                    opacity: isFadingOut ? 0 : 1,
                    scale: isFadingOut ? 0.9 : 1,
                    y: isFadingOut ? 15 : (isCollapsed && !isConnected && isSupportMenuOpen ? -142 : 0)
                }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                    layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: isFadingOut ? 1.2 : 0.2 },
                    scale: { duration: 0.2 },
                    y: { duration: 0.25, ease: "easeOut" }
                }}
                className={`fixed right-4 md:right-8 lg:right-10 z-40 overflow-hidden font-sans select-none ${
                    isCollapsed && !isConnected
                        ? "bottom-[76px] md:bottom-[94px] lg:bottom-[104px] w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer bg-slate-900 border border-transparent"
                        : "bottom-[76px] md:bottom-[94px] lg:bottom-[104px] w-[calc(100vw-32px)] max-w-[310px] sm:max-w-none sm:w-[350px] md:w-[370px] h-[210px] sm:h-[235px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-gray-200/90 dark:border-white/10 bg-slate-950"
                }`}
                style={{
                    contain: "paint layout",
                    transformOrigin: "bottom right",
                    willChange: "transform, width, height, border-radius"
                }}
                onClick={(e) => {
                    if (isCollapsed && !isConnected) {
                        e.stopPropagation();
                        setIsCollapsed(false);
                    }
                }}
            >
                <div className="relative w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {/* Continuous Representative Photo Background (Siva - CEO) */}
                    <img
                        src="/avatar/siva-ceo.png"
                        alt="Siva - CEO, SS40 Network"
                        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300"
                        style={{ objectPosition: isCollapsed ? "center 27%" : "center 28%" }}
                    />

                    {/* Active WebRTC Video Stream */}
                    <video
                        id="anam-video-element"
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-10 ${
                            isConnected ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    />

                    {/* Pre-Call Poster / Preview Controls (Graceful fade-in/fade-out) */}
                    {!isConnected && !isLoading && (
                        <div
                            className={`absolute inset-0 flex flex-col justify-between p-3.5 z-20 transition-opacity duration-200 ${
                                isCollapsed
                                    ? "opacity-0 pointer-events-none"
                                    : "opacity-100 pointer-events-auto delay-75"
                            }`}
                        >
                            {/* Subtle dark gradient overlay for button contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none z-10" />

                            {/* Top Controls: Dismiss / Minimize [X] Button */}
                            <div className="flex justify-end w-full z-20">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsCollapsed(true);
                                    }}
                                    title="Minimize to Circle"
                                    className="w-7 h-7 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Bottom Centered "Chat now" Button (No 'English' label) */}
                            <div className="flex items-center justify-center w-full z-20 pb-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startSession();
                                    }}
                                    className="px-6 py-2 rounded-full bg-[#00B4D8] hover:bg-[#0096C7] active:scale-95 text-white font-bold text-xs tracking-wide transition-all shadow-lg hover:shadow-cyan-500/25 cursor-pointer touch-manipulation flex items-center justify-center"
                                >
                                    Chat now
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Connecting Spinner Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-2 text-white z-20">
                            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                            <p className="text-[11px] font-medium text-cyan-200">Starting 1-min quick call...</p>
                        </div>
                    )}

                    {/* ── Active Video Overlays (Controls Directly Over Video) ── */}
                    {isConnected && (
                        <>
                            {/* Top-Right Close Button Overlay */}
                            <button
                                onClick={handleClose}
                                title="Close"
                                className="absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Bottom Center Floating Control Pill Over Video */}
                            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center z-30 pointer-events-auto">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 shadow-xl text-white">
                                    {/* 1-Minute Live Countdown Timer */}
                                    <div className="flex items-center gap-1 pr-1.5 border-r border-white/20 text-[11px] font-mono font-bold text-teal-300">
                                        <Clock className="w-3 h-3 text-teal-300" />
                                        <span>{formatTime(timeLeft)}</span>
                                    </div>

                                    {/* Mic Toggle */}
                                    <button
                                        onClick={toggleMute}
                                        title={isMuted ? "Unmute" : "Mute"}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                            isMuted
                                                ? "bg-rose-500/80 text-white"
                                                : "bg-white/20 hover:bg-white/30 text-white"
                                        }`}
                                    >
                                        {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                                    </button>

                                    {/* End Call Button */}
                                    <button
                                        onClick={handleClose}
                                        title="End Call"
                                        className="px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center gap-1 font-bold text-[10.5px] transition-all shadow-md cursor-pointer"
                                    >
                                        <PhoneOff className="w-3 h-3" />
                                        <span>End</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
