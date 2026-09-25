"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    X,
    Send,
    RotateCcw,
    Sparkles,
    MessageCircle,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    CheckCircle2,
    Briefcase,
    GraduationCap,
    Package,
    Code,
    ExternalLink,
    Building2,
    Laptop,
    FileText,
    Rocket,
    Compass,
    SendHorizonal
} from "lucide-react";
import type { SiteConfigData } from "@/lib/site-config";
import { classifyIntent } from "@/lib/ai/rag/intent-classifier";

// ----------------------------------------------------------------------------
// Constants & Map Data
// ----------------------------------------------------------------------------
const GOOGLE_MAPS_URL = "https://www.google.com/maps?q=8.729284,77.697432";

// ----------------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------------

export interface ChatMessage {
    id: string;
    sender: "bot" | "user";
    text: string;
    timestamp: Date;
    quickReplies?: string[];
    actionType?: "STANDARD" | "WINGS_CARD" | "ACADEMIC_CARD" | "SUPPORT_CARD" | "LEAD_CAPTURE" | "PROJECT_PREVIEW";
    isSupportCard?: boolean;
    isAcademicCard?: boolean;
    isWingsCard?: boolean;
    isLeadCard?: boolean;
    isProjectCard?: boolean;
    extractedLeadInfo?: {
        phone?: string;
        email?: string;
        name?: string;
        requirement?: string;
    };
    supportData?: {
        phone: string;
        email: string;
        whatsappUrl: string;
        mailtoUrl: string;
        gmailUrl: string;
        contactUrl: string;
        mapsUrl: string;
    };
    link?: {
        label: string;
        url: string;
    };
}

// ----------------------------------------------------------------------------
// Helper: Generate Formatted Email Template URLs
// ----------------------------------------------------------------------------
function generateMailContent(query?: string) {
    const subject = query ? `SS40 Network Inquiry: ${query.slice(0, 50)}` : "SS40 Network Enterprise & Academic Inquiry";
    const body = 
`Hello SS40 Network Team,

I am writing to inquire regarding the following details:

- Area of Interest: [SS40 Digital Solutions / SS40 Products / SS40 Academics / General Support]
- Requirement / Question: ${query ? `"${query}"` : "Please share more information on your services and programs."}
- Full Name: 
- Organization / College: 
- Phone Number / WhatsApp: 
- Preferred Contact Time: 

Looking forward to your response.

Best regards,`;
    return { subject, body };
}

function generateMailtoUrl(email: string, query?: string) {
    const { subject, body } = generateMailContent(query);
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function generateGmailUrl(email: string, query?: string) {
    const { subject, body } = generateMailContent(query);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ----------------------------------------------------------------------------
// Component Implementation
// ----------------------------------------------------------------------------

export function RuleBasedChatbot({
    isOpen,
    onClose,
    config
}: {
    isOpen: boolean;
    onClose: () => void;
    config?: SiteConfigData | null;
}) {
    const rawPhone = config?.whatsappNumber || "919363033440";
    const cleanPhone = rawPhone.replace(/\D/g, "");
    const email = config?.contactEmail || "contact@ss40network.com";

    const initialBotMessage: ChatMessage = {
        id: "msg-welcome",
        sender: "bot",
        text: `Hello! Welcome to SS40 Network. How can I help you today?

We specialize in custom software engineering (Digital Solutions), scalable SaaS platforms like ClearInvoice, and tech academic internships. Feel free to ask any question or select an option below!`,
        timestamp: new Date(),
        actionType: "STANDARD",
        quickReplies: [
            "SS40 Digital Solutions",
            "ClearInvoice (SaaS)",
            "Academic Internships",
            "Contact Team"
        ]
    };

    const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [leadSubmitting, setLeadSubmitting] = useState(false);
    const [leadSubmittedId, setLeadSubmittedId] = useState<string | null>(null);

    // Dynamic Lead Form State
    const [leadFormState, setLeadFormState] = useState<{
        fullName: string;
        phone: string;
        email: string;
        serviceInterest: string;
    }>({
        fullName: "",
        phone: "",
        email: "",
        serviceInterest: "Digital Solutions"
    });

    const [viewportStyle, setViewportStyle] = useState<{
        top?: number;
        height?: number;
        maxHeight?: number;
    }>({});

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopyEmail = (emailToCopy: string) => {
        try {
            navigator.clipboard.writeText(emailToCopy);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } catch {}
    };

    // Smooth auto-scroll
    const scrollToBottom = useCallback((smooth = true) => {
        requestAnimationFrame(() => {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTo({
                    top: messagesContainerRef.current.scrollHeight,
                    behavior: smooth ? "smooth" : "auto"
                });
            }
        });
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages, scrollToBottom]);

    // Dynamic visual viewport tracking for mobile
    useEffect(() => {
        if (!isOpen) return;

        const updateViewport = () => {
            if (typeof window === "undefined") return;

            if (window.innerWidth < 640 && window.visualViewport) {
                const vv = window.visualViewport;
                const vh = vv.height;
                const vTop = vv.offsetTop;

                const safeHeight = Math.max(260, vh - 20);
                const safeTop = Math.max(10, vTop + 10);

                setViewportStyle({
                    top: safeTop,
                    height: safeHeight,
                    maxHeight: safeHeight
                });
            } else {
                setViewportStyle({});
            }
        };

        if (typeof window !== "undefined" && window.visualViewport) {
            window.visualViewport.addEventListener("resize", updateViewport);
            window.visualViewport.addEventListener("scroll", updateViewport);
            updateViewport();
        }

        return () => {
            if (typeof window !== "undefined" && window.visualViewport) {
                window.visualViewport.removeEventListener("resize", updateViewport);
                window.visualViewport.removeEventListener("scroll", updateViewport);
            }
        };
    }, [isOpen]);

    // Click outside and Escape handling
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Helper: Render Markdown bullet points with styling
    const renderFormattedMessage = (text: string) => {
        const lines = text.split("\n").filter(line => line.trim().length > 0);

        return (
            <div className="space-y-2 text-gray-800">
                {lines.map((line, idx) => {
                    const trimmed = line.trim();
                    const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ");

                    if (isBullet) {
                        const contentWithoutBullet = trimmed.replace(/^[-•*]\s+/, "");
                        const parts = contentWithoutBullet.split(/(\*\*[^*]+\*\*)/g);

                        const bulletTokens = parts.map((part, pIdx) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                                return <strong key={pIdx} className="font-bold text-[#0F766E]">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                        });

                        return (
                            <div key={idx} className="flex items-start gap-2 pl-0.5 my-1">
                                <span className="text-[#0F766E] font-black text-sm leading-none mt-0.5 select-none">-</span>
                                <span className="flex-1 leading-relaxed text-gray-800">{bulletTokens}</span>
                            </div>
                        );
                    }

                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    const renderedParts = parts.map((part, pIdx) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                            return <strong key={pIdx} className="font-bold text-[#0F766E]">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    });

                    return (
                        <p key={idx} className="leading-relaxed text-gray-800">
                            {renderedParts}
                        </p>
                    );
                })}
            </div>
        );
    };

    // Helper to build Support Card payload
    const createSupportPayload = (query: string) => ({
        phone: cleanPhone,
        email,
        whatsappUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello SS40, I need assistance regarding: "${query}"`)}`,
        mailtoUrl: generateMailtoUrl(email, query),
        gmailUrl: generateGmailUrl(email, query),
        contactUrl: "/contact",
        mapsUrl: GOOGLE_MAPS_URL
    });

    // Handle user sending message
    const handleSend = async (textToSend?: string) => {
        const text = (textToSend || inputValue).trim();
        if (!text || isTyping) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: "user",
            text,
            timestamp: new Date()
        };

        const currentMessages = [...messages, userMsg];
        setMessages(currentMessages);
        setInputValue("");
        setIsTyping(true);

        const historyPayload = currentMessages.slice(-6).map(m => ({
            role: m.sender === "user" ? "user" as const : "assistant" as const,
            content: m.text
        }));

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    history: historyPayload
                })
            });

            if (!res.ok) {
                throw new Error(`Chat API status: ${res.status}`);
            }

            const data = await res.json();
            const actionType = data.actionType || "STANDARD";

            // If lead info was detected, prefill the lead state
            if (data.extractedLeadInfo) {
                setLeadFormState(prev => ({
                    ...prev,
                    phone: data.extractedLeadInfo.phone || prev.phone,
                    email: data.extractedLeadInfo.email || prev.email,
                    fullName: data.extractedLeadInfo.name || prev.fullName
                }));
            }

            const isSupport = actionType === "SUPPORT_CARD";
            const isWings = actionType === "WINGS_CARD";
            const isAcademic = actionType === "ACADEMIC_CARD";
            const isLead = actionType === "LEAD_CAPTURE";
            const isProject = actionType === "PROJECT_PREVIEW";

            const botMsg: ChatMessage = {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text: data.replyText || "SS40 NETWORK operates Three Specialized Wings: SS40 Digital Solutions, SS40 Products, and SS40 Academics.",
                timestamp: new Date(),
                actionType,
                quickReplies: data.quickReplies && data.quickReplies.length > 0
                    ? data.quickReplies
                    : ["Request a Quote", "ClearInvoice SaaS", "Academic Sprints", "Talk to Team"],
                link: data.link,
                isWingsCard: isWings,
                isAcademicCard: isAcademic,
                isSupportCard: isSupport,
                isLeadCard: isLead,
                isProjectCard: isProject,
                extractedLeadInfo: data.extractedLeadInfo,
                supportData: isSupport ? createSupportPayload(text) : undefined
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.warn("RAG Chat API unavailable, switching to intelligent fallback:", err);
            // Intelligent synchronized fallback using the exact same Intent Classifier
            const intent = classifyIntent(text);
            const isSupport = intent.actionType === "SUPPORT_CARD";
            const isWings = intent.actionType === "WINGS_CARD";
            const isAcademic = intent.actionType === "ACADEMIC_CARD";
            const isLead = intent.actionType === "LEAD_CAPTURE";
            const isProject = intent.actionType === "PROJECT_PREVIEW";

            let fallbackText = "SS40 Network operates across Three Specialized Wings: Digital Solutions for custom software, SaaS Products like ClearInvoice, and Academics for project-based internships. How can I assist you?";
            if (isWings) {
                fallbackText = "SS40 Network operates across Three Specialized Wings:\n\n- Digital Solutions: Custom web & mobile applications, AI automation, and cloud systems.\n- SaaS Products: Scalable platforms including ClearInvoice for automated billing.\n- Academics: Project-based internships and technical career preparation.";
            } else if (isAcademic) {
                fallbackText = "SS40 Academics offers project-based internships where students work on real production software, build verified GitHub portfolios, and receive 1-on-1 mentor guidance.";
            }

            const botFallbackMsg: ChatMessage = {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text: fallbackText,
                timestamp: new Date(),
                actionType: intent.actionType,
                quickReplies: intent.suggestedQuickReplies,
                link: intent.suggestedLink,
                isWingsCard: isWings,
                isAcademicCard: isAcademic,
                isSupportCard: isSupport,
                isLeadCard: isLead,
                isProjectCard: isProject,
                extractedLeadInfo: intent.extractedLeadInfo,
                supportData: isSupport ? createSupportPayload(text) : undefined
            };

            setMessages(prev => [...prev, botFallbackMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    // Handle inline lead form submission
    const handleLeadSubmit = async (msgId: string) => {
        if (!leadFormState.fullName.trim() || !leadFormState.phone.trim() || !leadFormState.email.trim()) {
            return;
        }

        setLeadSubmitting(true);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "submit-lead",
                    fullName: leadFormState.fullName,
                    phone: leadFormState.phone,
                    email: leadFormState.email,
                    serviceInterest: leadFormState.serviceInterest,
                    message: "Inquiry submitted through SS40 SKY AI Assistant"
                })
            });

            if (res.ok) {
                setLeadSubmittedId(msgId);
                const botAckMsg: ChatMessage = {
                    id: `bot-${Date.now()}`,
                    sender: "bot",
                    text: `- **Inquiry Registered**: Thank you, ${leadFormState.fullName}! Our solutions team has received your request.\n- **Fast Response**: We will contact you at ${leadFormState.phone} / ${leadFormState.email} promptly.\n- **Direct Chat**: Feel free to connect directly via WhatsApp anytime.`,
                    timestamp: new Date(),
                    actionType: "SUPPORT_CARD",
                    quickReplies: ["Our Three Wings", "Digital Solutions", "SS40 Products", "SS40 Academics"],
                    link: { label: "Explore Services", url: "/digital-solutions" },
                    isSupportCard: true,
                    supportData: createSupportPayload(leadFormState.serviceInterest)
                };
                setMessages(prev => [...prev, botAckMsg]);
            }
        } catch (e) {
            console.error("Lead submission error:", e);
        } finally {
            setLeadSubmitting(false);
        }
    };

    const handleReset = () => {
        setMessages([initialBotMessage]);
        setInputValue("");
        setLeadSubmittedId(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Mobile Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 sm:hidden cursor-pointer"
                        aria-hidden="true"
                    />

                    {/* Chat Modal Window */}
                    <motion.div
                        ref={chatContainerRef}
                        initial={{ opacity: 0, y: 20, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={
                            viewportStyle.top !== undefined
                                ? {
                                    top: `${viewportStyle.top}px`,
                                    height: `${viewportStyle.height}px`,
                                    maxHeight: `${viewportStyle.maxHeight}px`,
                                    bottom: "auto"
                                }
                                : undefined
                        }
                        className="fixed bottom-20 right-3 left-3 sm:left-auto sm:right-6 lg:right-8 sm:bottom-24 z-50 flex flex-col w-auto sm:w-[390px] md:w-[410px] h-[500px] sm:h-[540px] max-h-[calc(100dvh-95px)] sm:max-h-[calc(100vh-120px)] bg-white rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(15,118,110,0.18)] border border-gray-200/90 overflow-hidden"
                    >
                        {/* Header - Enterprise Brand Palette */}
                        <div className="bg-gradient-to-r from-[#0F766E] via-[#0D6E66] to-[#0A5751] text-white px-4 py-3 flex items-center justify-between shadow-xs relative z-10 shrink-0 border-b border-[#0F766E]/40">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#0F766E] flex items-center justify-center shadow-xs border border-white/30 shrink-0">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5 sm:w-6 sm:h-6"
                                        fill="currentColor"
                                    >
                                        <circle cx="12" cy="2.5" r="1.5" />
                                        <path d="M11 4h2v2h-2z" />
                                        <rect x="4" y="6" width="16" height="12" rx="4.5" />
                                        <rect x="2" y="9.5" width="2" height="5" rx="1" />
                                        <rect x="20" y="9.5" width="2" height="5" rx="1" />
                                        <rect x="6.5" y="8.5" width="11" height="7" rx="2.5" fill="#FFFFFF" />
                                        <circle cx="9.5" cy="11.5" r="1.3" fill="#0F766E" />
                                        <circle cx="14.5" cy="11.5" r="1.3" fill="#0F766E" />
                                        <path d="M10 13.5c.7.6 1.8.6 2.5 0" stroke="#0F766E" strokeWidth="1" strokeLinecap="round" fill="none" />
                                        <path d="M8 19h8a2 2 0 0 1 2 2v1H6v-1a2 2 0 0 1 2-2z" opacity="0.9" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-[15px] leading-tight text-white tracking-tight">
                                        SS40 SKY
                                    </h3>
                                    <p className="text-[11px] text-[#D8E8E2]/90 font-medium mt-0.5">
                                        AI assistant of SS40 NETWORK
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleReset}
                                    className="p-1.5 rounded-lg hover:bg-white/15 active:bg-white/25 text-white/90 hover:text-white transition-colors cursor-pointer touch-manipulation"
                                    title="Reset conversation"
                                    aria-label="Reset chat"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-white/15 active:bg-white/25 text-white/90 hover:text-white transition-colors cursor-pointer touch-manipulation"
                                    title="Close chat"
                                    aria-label="Close chat"
                                >
                                    <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Scroll Area */}
                        <div
                            ref={messagesContainerRef}
                            data-lenis-prevent="true"
                            className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-[#F8FAFB] overscroll-contain"
                            style={{
                                WebkitOverflowScrolling: "touch",
                                touchAction: "pan-y"
                            }}
                        >
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] sm:max-w-[84%] text-[13px] sm:text-[13.5px] leading-relaxed break-words transition-all ${
                                            msg.sender === "user"
                                                ? "bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white rounded-2xl rounded-tr-xs shadow-xs font-medium px-4 py-2.5 sm:py-3"
                                                : "bg-white text-[#1F2937] rounded-2xl rounded-tl-xs border border-gray-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03)] px-4 py-3 sm:py-3.5"
                                        }`}
                                    >
                                        {msg.sender === "user" ? (
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                                        ) : (
                                            renderFormattedMessage(msg.text)
                                        )}

                                        {/* Action Link if provided (omitted when interactive cards already provide dedicated navigation) */}
                                        {msg.link && !msg.isWingsCard && !msg.isAcademicCard && !msg.isProjectCard && (
                                            <div className="mt-2.5 pt-2 border-t border-gray-100">
                                                {msg.link.url.startsWith("http") ? (
                                                    <a
                                                        href={msg.link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-between w-full p-2.5 rounded-xl bg-teal-50/80 hover:bg-teal-100/90 active:scale-[0.98] border border-[#0F766E]/25 text-xs font-bold text-[#0F766E] transition-all touch-manipulation shadow-2xs group"
                                                    >
                                                        <span className="truncate">{msg.link.label}</span>
                                                        <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                                    </a>
                                                ) : (
                                                    <Link
                                                        href={msg.link.url}
                                                        onClick={onClose}
                                                        className="inline-flex items-center justify-between w-full p-2.5 rounded-xl bg-[#E6F3EE] hover:bg-[#D4EBE1] active:scale-[0.98] border border-[#0F766E]/25 text-xs font-bold text-[#0F766E] transition-all touch-manipulation shadow-2xs group"
                                                    >
                                                        <span className="truncate">{msg.link.label}</span>
                                                        <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                                    </Link>
                                                )}
                                            </div>
                                        )}

                                        {/* Rich Three Wings Interactive Card */}
                                        {msg.isWingsCard && (
                                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                                                <div className="grid grid-cols-1 gap-1.5 text-[11.5px] font-medium text-gray-700">
                                                    <Link
                                                        href="/digital-solutions"
                                                        onClick={onClose}
                                                        className="p-2.5 bg-[#F0FDF4] hover:bg-[#DCFCE7] active:scale-[0.98] rounded-xl border border-[#0F766E]/20 flex items-center justify-between transition-all text-[#0F766E] font-semibold touch-manipulation shadow-2xs"
                                                    >
                                                        <span className="flex items-center gap-2 truncate">
                                                            <Code className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                                            <span className="truncate">1. SS40 Digital Solutions</span>
                                                        </span>
                                                        <ArrowRight className="w-3 h-3 text-[#0F766E] shrink-0" />
                                                    </Link>
                                                    <Link
                                                        href="/products"
                                                        onClick={onClose}
                                                        className="p-2.5 bg-[#F5F3FF] hover:bg-[#EDE9FE] active:scale-[0.98] rounded-xl border border-purple-200/80 flex items-center justify-between transition-all text-purple-950 font-semibold touch-manipulation shadow-2xs"
                                                    >
                                                        <span className="flex items-center gap-2 truncate">
                                                            <Package className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                                            <span className="truncate">2. SS40 Products (SaaS)</span>
                                                        </span>
                                                        <ArrowRight className="w-3 h-3 text-purple-600 shrink-0" />
                                                    </Link>
                                                    <Link
                                                        href="/academics"
                                                        onClick={onClose}
                                                        className="p-2.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] active:scale-[0.98] rounded-xl border border-blue-200/80 flex items-center justify-between transition-all text-blue-950 font-semibold touch-manipulation shadow-2xs"
                                                    >
                                                        <span className="flex items-center gap-2 truncate">
                                                            <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                            <span className="truncate">3. SS40 Academics</span>
                                                        </span>
                                                        <ArrowRight className="w-3 h-3 text-blue-600 shrink-0" />
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        {/* Rich Academic Interactive Card */}
                                        {msg.isAcademicCard && (
                                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                                                <div className="p-2 bg-[#EDF5F2] rounded-xl border border-[#0F766E]/20 text-xs font-semibold text-[#0F766E] flex items-center gap-1.5 shadow-2xs">
                                                    <GraduationCap className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                                    <span>Academic Sprints &amp; Internships Open</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1 text-[10.5px] font-medium text-gray-700">
                                                    <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-150 flex items-center gap-1 truncate">
                                                        <Rocket className="w-3.5 h-3.5 text-[#0F766E] shrink-0" /> <span className="truncate">Live Sprints</span>
                                                    </div>
                                                    <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-150 flex items-center gap-1 truncate">
                                                        <Briefcase className="w-3.5 h-3.5 text-[#0F766E] shrink-0" /> <span className="truncate">Placement Prep</span>
                                                    </div>
                                                    <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-150 flex items-center gap-1 truncate">
                                                        <Building2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" /> <span className="truncate">University MOUs</span>
                                                    </div>
                                                    <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-150 flex items-center gap-1 truncate">
                                                        <Laptop className="w-3.5 h-3.5 text-[#0F766E] shrink-0" /> <span className="truncate">Student Projects</span>
                                                    </div>
                                                </div>
                                                <Link
                                                    href="/academics"
                                                    onClick={onClose}
                                                    className="mt-1 p-2 bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.98] rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                                                >
                                                    <span>Explore Academics &amp; Apply</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        )}

                                        {/* Student Project Showcase Card */}
                                        {msg.isProjectCard && (
                                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                                                <div className="p-2 bg-[#EBF5FB] rounded-xl border border-blue-200 text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                                                    <Laptop className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                                                    <span>Verified Student Projects Showcase</span>
                                                </div>
                                                <Link
                                                    href="/academics/student-projects"
                                                    onClick={onClose}
                                                    className="p-2 bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.98] rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                                                >
                                                    <span>Browse All Student Projects</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </div>
                                        )}

                                        {/* Inline Lead Capture Form */}
                                        {msg.isLeadCard && (
                                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col gap-2">
                                                <div className="p-2 bg-[#E6F3EE] rounded-xl border border-[#0F766E]/25 text-xs font-bold text-[#0F766E] flex items-center gap-1.5">
                                                    <SendHorizonal className="w-3.5 h-3.5 text-[#0F766E]" />
                                                    <span>Fast-Track Callback &amp; Quote Request</span>
                                                </div>

                                                {leadSubmittedId === msg.id ? (
                                                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                        <span>Inquiry recorded! Our engineering team will contact you shortly.</span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1.5 text-xs">
                                                        <input
                                                            type="text"
                                                            placeholder="Your Full Name *"
                                                            value={leadFormState.fullName}
                                                            onChange={(e) => setLeadFormState(prev => ({ ...prev, fullName: e.target.value }))}
                                                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:outline-none focus:border-[#0F766E]"
                                                        />
                                                        <div className="grid grid-cols-2 gap-1.5">
                                                            <input
                                                                type="tel"
                                                                placeholder="Phone Number *"
                                                                value={leadFormState.phone}
                                                                onChange={(e) => setLeadFormState(prev => ({ ...prev, phone: e.target.value }))}
                                                                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:outline-none focus:border-[#0F766E]"
                                                            />
                                                            <input
                                                                type="email"
                                                                placeholder="Email Address *"
                                                                value={leadFormState.email}
                                                                onChange={(e) => setLeadFormState(prev => ({ ...prev, email: e.target.value }))}
                                                                className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:outline-none focus:border-[#0F766E]"
                                                            />
                                                        </div>
                                                        <select
                                                            value={leadFormState.serviceInterest}
                                                            onChange={(e) => setLeadFormState(prev => ({ ...prev, serviceInterest: e.target.value }))}
                                                            className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:outline-none focus:border-[#0F766E]"
                                                        >
                                                            <option value="Digital Solutions">SS40 Digital Solutions (Custom Software)</option>
                                                            <option value="Products - ClearInvoice">SS40 Products (ClearInvoice SaaS)</option>
                                                            <option value="Academics - Internships">SS40 Academics (Internships &amp; Training)</option>
                                                            <option value="General Consultation">General Scoping &amp; Consultation</option>
                                                        </select>

                                                        <button
                                                            onClick={() => handleLeadSubmit(msg.id)}
                                                            disabled={leadSubmitting || !leadFormState.fullName.trim() || !leadFormState.phone.trim() || !leadFormState.email.trim()}
                                                            className="w-full p-2 bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.98] disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                                        >
                                                            {leadSubmitting ? (
                                                                <span>Submitting Inquiry...</span>
                                                            ) : (
                                                                <>
                                                                    <span>Submit Inquiry to Team</span>
                                                                    <SendHorizonal className="w-3.5 h-3.5" />
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Structured Support Card - Uniform Brand Palette */}
                                        {msg.isSupportCard && msg.supportData && (
                                            <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-col gap-1.5">
                                                {/* WhatsApp Quick Launcher */}
                                                <a
                                                    href={msg.supportData.whatsappUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-between p-2.5 rounded-xl bg-[#F0F8F6] hover:bg-[#E1F3EE] active:scale-[0.98] text-[#0F766E] font-bold text-xs transition-all border border-[#0F766E]/20 cursor-pointer touch-manipulation shadow-2xs"
                                                >
                                                    <span className="flex items-center gap-2 truncate">
                                                        <MessageCircle className="w-4 h-4 text-[#0F766E] shrink-0" />
                                                        <span className="truncate">Chat on WhatsApp</span>
                                                    </span>
                                                    <ExternalLink className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                                </a>

                                                {/* 2-Column Row: Gmail + Copy Address */}
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    {/* 1. Gmail Web */}
                                                    <a
                                                        href={msg.supportData.gmailUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center p-2 rounded-xl bg-[#F0F8F6] hover:bg-[#E1F3EE] active:scale-95 text-[#0F766E] font-bold text-[11px] transition-all border border-[#0F766E]/20 cursor-pointer text-center truncate touch-manipulation shadow-2xs"
                                                        title="Open pre-filled email in Gmail Web"
                                                    >
                                                        <Mail className="w-3.5 h-3.5 text-[#0F766E] mr-1.5 shrink-0" />
                                                        <span className="truncate">Gmail</span>
                                                    </a>

                                                    {/* 2. Copy Address */}
                                                    <button
                                                        onClick={() => handleCopyEmail(msg.supportData!.email)}
                                                        className="inline-flex items-center justify-center p-2 rounded-xl bg-[#F0F8F6] hover:bg-[#E1F3EE] active:scale-95 text-[#0F766E] font-semibold text-[11px] transition-all border border-[#0F766E]/20 cursor-pointer text-center truncate touch-manipulation shadow-2xs"
                                                        title="Copy email address to clipboard"
                                                    >
                                                        {copiedEmail ? (
                                                            <>
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] mr-1.5 shrink-0" />
                                                                <span className="text-[#0F766E] font-bold truncate">Copied</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FileText className="w-3.5 h-3.5 text-[#0F766E] mr-1.5 shrink-0" />
                                                                <span className="truncate">Copy</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Google Maps Location Launcher */}
                                                <a
                                                    href={msg.supportData.mapsUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-between p-2.5 rounded-xl bg-[#F0F8F6] hover:bg-[#E1F3EE] active:scale-[0.98] text-[#0F766E] font-bold text-xs transition-all border border-[#0F766E]/20 cursor-pointer touch-manipulation shadow-2xs"
                                                >
                                                    <span className="flex items-center gap-2 truncate">
                                                        <Compass className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                                        <span className="truncate">Office Google Maps</span>
                                                    </span>
                                                    <ExternalLink className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                                </a>

                                                {/* Direct Phone Call */}
                                                <a
                                                    href={`tel:+${msg.supportData.phone}`}
                                                    className="inline-flex items-center justify-between p-2.5 rounded-xl bg-[#F0F8F6] hover:bg-[#E1F3EE] active:scale-[0.98] text-[#0F766E] font-semibold text-xs transition-all border border-[#0F766E]/20 cursor-pointer touch-manipulation shadow-2xs"
                                                >
                                                    <span className="flex items-center gap-2 truncate">
                                                        <Phone className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                                        <span className="truncate">Call: +{msg.supportData.phone}</span>
                                                    </span>
                                                    <ArrowRight className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">
                                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>

                                    {/* Quick Reply Pills */}
                                    {(() => {
                                        const rawPills = msg.quickReplies || [];
                                        let displayedPills = rawPills;

                                        if (msg.isWingsCard) {
                                            // Exclude redundant wing name pills since the 3 cards above already display them
                                            const redundant = new Set([
                                                "our three wings",
                                                "three wings",
                                                "ss40 digital solutions",
                                                "digital solutions",
                                                "ss40 products",
                                                "ss40 products (saas)",
                                                "products",
                                                "ss40 academics",
                                                "academics",
                                                "1. ss40 digital solutions",
                                                "2. ss40 products (saas)",
                                                "3. ss40 academics"
                                            ]);
                                            const filtered = rawPills.filter(p => !redundant.has(p.toLowerCase().trim()));
                                            displayedPills = filtered.length > 0 
                                                ? filtered 
                                                : ["Request a Quote", "ClearInvoice SaaS", "Academic Sprints", "Talk to Team"];
                                        }

                                        if (displayedPills.length === 0) return null;

                                        return (
                                            <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                                                {displayedPills.map((pill, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleSend(pill)}
                                                        className="text-[11px] sm:text-xs font-semibold text-[#0F766E] bg-white hover:bg-[#D8E8E2] active:bg-[#C2DDD3] border border-[#0F766E]/20 shadow-2xs hover:shadow-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer touch-manipulation"
                                                    >
                                                        {pill}
                                                    </button>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            ))}

                            {/* Typing Animation */}
                            {isTyping && (
                                <div className="flex items-start">
                                    <div className="bg-white border border-gray-200/80 rounded-2xl rounded-tl-xs p-3 shadow-xs flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Footer - Prominently Highlighted Pill with Nested Send Icon */}
                        <div className="bg-[#F8FAFB] border-t border-gray-200/90 px-3.5 py-2.5 pb-[max(0.7rem,env(safe-area-inset-bottom))] sm:pb-3 shrink-0 flex flex-col gap-1.5">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSend();
                                }}
                                className="relative flex items-center w-full bg-white border-2 border-[#0F766E]/40 hover:border-[#0F766E]/60 focus-within:border-[#0F766E] focus-within:ring-3 focus-within:ring-[#0F766E]/20 rounded-full pl-4 pr-1.5 py-1.5 shadow-[0_2px_10px_rgba(15,118,110,0.08)] transition-all"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onFocus={() => {
                                        setTimeout(() => {
                                            scrollToBottom();
                                        }, 180);
                                    }}
                                    placeholder="Ask a question or select a topic..."
                                    className="flex-1 bg-transparent py-1 text-base sm:text-sm text-[#111827] placeholder:text-gray-400 font-medium focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="w-8 h-8 rounded-full bg-[#0F766E] hover:bg-[#115E59] active:scale-90 disabled:opacity-25 disabled:pointer-events-none text-white flex items-center justify-center transition-all shrink-0 cursor-pointer touch-manipulation shadow-xs"
                                    aria-label="Send message"
                                >
                                    <Send className="w-3.5 h-3.5 translate-x-px" />
                                </button>
                            </form>
                            <p className="text-[10px] text-gray-400 text-center font-medium tracking-wide">
                                SS40 SKY
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
