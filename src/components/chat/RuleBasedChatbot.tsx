"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Bot,
    X,
    Send,
    RotateCcw,
    Sparkles,
    MessageCircle,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    HelpCircle,
    CheckCircle2,
    Clock,
    Briefcase,
    GraduationCap,
    Package,
    Code,
    ExternalLink,
    Building2,
    Users,
    Laptop,
    FileText,
    Rocket,
    BookOpen,
    Layers,
    Shield,
    DollarSign,
    Calendar,
    Compass
} from "lucide-react";
import type { SiteConfigData } from "@/lib/site-config";

// ----------------------------------------------------------------------------
// Constants & Map Data
// ----------------------------------------------------------------------------
const OFFICIAL_ADDRESS = "SS40 NETWORK PRIVATE LIMITED, 1st Floor, Municipal Corporation Incubation Centre (Near by trade centre), Sree Puram, Tirunelveli, Tamil Nadu 627001.";
const GOOGLE_MAPS_URL = "https://www.google.com/maps?q=8.729284,77.697432&entry=gps&g_ep=CAESBzI2LjMwLjkYACDjqwgqnwEsOTQyNjc3MjcsOTQyOTIxOTUsOTQyOTk1MzIsMTAwNzk2NDk4LDEwMDc5Nzc2MSwxMDA3OTY1MzUsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTksMTAwODE1NjM1LDEwMDgyMDIzNywxMDA4MjI0ODlCAklO&skid=a1aaead6-3ddc-4381-b4f9-1f245d314ef7&shorturl=1";

// ----------------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------------

interface ChatMessage {
    id: string;
    sender: "bot" | "user";
    text: string;
    timestamp: Date;
    quickReplies?: string[];
    isSupportCard?: boolean;
    isAcademicCard?: boolean;
    isWingsCard?: boolean;
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

interface KnowledgeRule {
    id: string;
    keywords: string[];
    patterns: RegExp[];
    weight: number;
    response: string;
    quickReplies?: string[];
    link?: { label: string; url: string };
    triggerSupport?: boolean;
    isAcademicCard?: boolean;
    isWingsCard?: boolean;
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
// Knowledge Base & Intelligent Rule Matcher Engine
// ----------------------------------------------------------------------------

const KNOWLEDGE_BASE: KnowledgeRule[] = [
    // 1. Greetings & Introductory
    {
        id: "greetings",
        keywords: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "namaste", "start", "welcome", "help", "menu"],
        patterns: [/\b(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|namaste|start|menu|who\s*are\s*you)\b/i],
        weight: 10,
        response: "Hello. Welcome to SS40 NETWORK. I am your AI Concierge. I can guide you through our Three Business Wings, SaaS Products, Academic Programs, or connect you directly with our team.",
        quickReplies: ["Our Three Wings", "SS40 Academics", "Digital Solutions", "SS40 Products", "Support Team"]
    },

    // 2. Our Three Wings (Comprehensive Ecosystem Breakdown)
    {
        id: "three_wings",
        keywords: ["three wings", "our three wings", "3 wings", "wings", "business wings", "ecosystem", "divisions", "what you do", "services", "company wings"],
        patterns: [/\b(three\s*wings?|our\s*three\s*wings?|3\s*wings?|business\s*wings?|ecosystem|all\s*wings?)\b/i],
        weight: 12,
        isWingsCard: true,
        response: "SS40 NETWORK operates as a unified technology ecosystem driven by Three Specialized Wings:\n\n1. SS40 Digital Solutions: Custom enterprise software engineering, web & mobile applications, AI process automation, and cloud systems.\n\n2. SS40 Products: Scalable SaaS platforms and operational software (including ClearInvoice) engineered with 99.99% uptime.\n\n3. SS40 Academics: Career Launch Pad, live project-based internships, placement acceleration, and university collaborations.",
        quickReplies: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Request a Quote", "Office Location"],
        link: { label: "Explore Our Three Wings on Home", url: "/#business-wings" }
    },

    // 3. Academics - Core Overview
    {
        id: "academics_core",
        keywords: ["academic", "academics", "academic program", "academic programs", "education", "training", "courses", "student", "college program", "study"],
        patterns: [/\b(academic\s*programs?|academics|ss40\s*academics|education|student\s*programs?|training\s*programs?)\b/i],
        weight: 11,
        isAcademicCard: true,
        response: "SS40 Academics bridges the gap between formal education and real-world technology practice across 4 pillars:\n\n1. Project-Based Internships: Build production-ready web, cloud, and AI applications with GitHub portfolio proof.\n2. Career Launch Pad: Master technical interviews, algorithmic coding, system design, and resume coaching.\n3. Placement Pipelines: Direct referral opportunities with verified hiring partners.\n4. Institutional MOUs: Campus workshops, industry-aligned curricula, and hands-on faculty enablement.",
        quickReplies: ["Internship Sprints", "Placement Prep", "University MOUs", "Student Projects", "Apply for Academics"],
        link: { label: "Explore SS40 Academics Platform", url: "/academics" }
    },

    // 4. Academics - Internships & Live Sprints
    {
        id: "academics_internships",
        keywords: ["internship", "intern", "sprint", "live project", "hands-on", "fresher", "practical learning", "stipend", "certificate", "skills"],
        patterns: [/\b(internship|intern|live\s*project|hands-on\s*learning|fresher\s*training|skill\s*sprints?)\b/i],
        weight: 9,
        response: "SS40 Internship Sprints provide immersive, project-based engineering training. Students work on actual production codebases, collaborate via GitHub, receive 1-on-1 industry mentorship, and earn verified credentials.",
        quickReplies: ["Academic Overview", "Student Projects", "Placement Prep", "Talk to Academic Team"],
        link: { label: "View Academic Programs", url: "/academics" }
    },

    // 5. Academics - Placements & Career Readiness
    {
        id: "academics_placements",
        keywords: ["placement", "job", "career", "hiring", "interview", "resume", "aptitude", "mock interview", "placement support", "salary", "package"],
        patterns: [/\b(placement|job|career|interview\s*prep|resume\s*review|hiring\s*support|placement\s*support)\b/i],
        weight: 9,
        response: "Our Career Launch Pad equips learners with mock technical interviews, DSA coding problem-solving, system design fundamentals, resume coaching, and direct recruitment pathways to leading tech companies.",
        quickReplies: ["Placement Journey", "Student Success Stories", "Collaborate with Us", "Support Team"],
        link: { label: "Explore Placement Journey", url: "/academics#placements" }
    },

    // 6. Academics - Student Projects Showcase
    {
        id: "academics_student_projects",
        keywords: ["student project", "student projects", "showcase", "built by students", "github projects", "portfolios", "student apps"],
        patterns: [/\b(student\s*projects?|student\s*showcase|built\s*by\s*students)\b/i],
        weight: 9,
        response: "Students at SS40 build full-fledged applications across AI automation, healthcare software, e-commerce engines, and developer productivity tools. Explore our verified student project repository.",
        quickReplies: ["View Student Projects", "Internship Sprints", "Academic Overview"],
        link: { label: "Browse Student Projects Showcase", url: "/academics/student-projects" }
    },

    // 7. Academics - College & University Collaborations (MOUs)
    {
        id: "academics_colleges",
        keywords: ["college", "university", "institution", "mou", "faculty", "workshop", "guest lecture", "collaboration", "campus", "curriculum", "hackathon"],
        patterns: [/\b(college|university|institution|mou|faculty|workshop|campus\s*drive|academic\s*partner|curriculum)\b/i],
        weight: 9,
        response: "We partner with universities and colleges through strategic MOUs, modern industry-aligned curriculum integration, specialized technical workshops, faculty enablement, and campus innovation labs.",
        quickReplies: ["Partner with SS40", "Academic Collaborations", "Talk to Academic Team"],
        link: { label: "University Partnerships & MOUs", url: "/academics#collaborations" }
    },

    // 8. Digital Solutions - Custom Software & Engineering
    {
        id: "digital_solutions_core",
        keywords: ["digital solutions", "custom software", "web development", "mobile app", "full stack", "react", "nextjs", "nodejs", "python", "backend", "frontend", "api", "database", "cloud architecture"],
        patterns: [/\b(digital\s*solutions?|ss40\s*digital|custom\s*software|web\s*(app|development)|mobile\s*app|full\s*stack|api|backend|frontend|software\s*development)\b/i],
        weight: 10,
        response: "SS40 Digital Solutions architects and builds enterprise-grade web applications, native & cross-platform mobile apps, secure APIs, and scalable cloud systems tailored to specific business operations.",
        quickReplies: ["Client Projects", "Request a Quote", "Development Lifecycle", "Start Your Project"],
        link: { label: "Explore Digital Solutions", url: "/digital-solutions" }
    },

    // 9. Digital Solutions - AI & Automation
    {
        id: "ai_automation",
        keywords: ["ai", "artificial intelligence", "automation", "workflow", "machine learning", "bot", "llm", "data pipeline", "intelligent software"],
        patterns: [/\b(ai|artificial\s*intelligence|automation|workflow\s*automation|machine\s*learning|llm|data\s*sync)\b/i],
        weight: 9,
        response: "We design AI-driven automation systems, intelligent workflows, and custom LLM integrations that eliminate repetitive manual operations and deliver actionable business intelligence.",
        quickReplies: ["Start Your Project", "Digital Solutions", "Book Consultation"],
        link: { label: "AI & Digital Engineering", url: "/digital-solutions#what-we-build" }
    },

    // 10. Products - SaaS & Software Platforms
    {
        id: "products_core",
        keywords: ["product", "products", "saas", "software product", "clearinvoice", "cloud platform", "tools", "crm", "erp", "license", "subscription", "features"],
        patterns: [/\b(products?|ss40\s*products?|saas|software\s*product|cloud\s*platform|business\s*tool|clearinvoice)\b/i],
        weight: 10,
        response: "SS40 Products delivers scalable, business-ready SaaS applications engineered for operational efficiency, automated invoicing, real-time analytics, and guaranteed 99.99% uptime.",
        quickReplies: ["Book a Product Demo", "Our Product Brands", "Custom Enterprise Setup"],
        link: { label: "Discover SS40 Products", url: "/products" }
    },

    // 11. Demo Booking
    {
        id: "book_demo",
        keywords: ["demo", "book demo", "trial", "test product", "walkthrough", "live demo", "preview", "schedule demo"],
        patterns: [/\b(book\s*a?\s*demo|schedule\s*a?\s*demo|free\s*trial|live\s*demo|product\s*preview)\b/i],
        weight: 10,
        response: "We would be glad to give you a live interactive walkthrough of our products. You can schedule a personalized demo with our solutions engineering team.",
        quickReplies: ["Schedule Demo Now", "WhatsApp Demo Request", "View Products"],
        link: { label: "Book a Demo on Contact Page", url: "/contact?source=BOOK_DEMO" }
    },

    // 12. Pricing, Estimates & Custom Quotes
    {
        id: "pricing_quotes",
        keywords: ["price", "pricing", "cost", "quote", "budget", "rate", "estimate", "charges", "how much", "fees"],
        patterns: [/\b(price|pricing|cost|quote|budget|rate|estimate|how\s*much|fees)\b/i],
        weight: 9,
        response: "Our digital solutions and product implementations are scoped transparently based on functional specifications, architecture complexity, and delivery timeline. We provide free initial project estimations.",
        quickReplies: ["Request Free Quote", "Chat on WhatsApp", "Email Support"],
        link: { label: "Get a Custom Project Quote", url: "/contact" }
    },

    // 13. Portfolio, Case Studies & Client Projects
    {
        id: "portfolio_projects",
        keywords: ["portfolio", "projects", "work", "case study", "clients", "testimonials", "success stories", "examples", "past work"],
        patterns: [/\b(portfolio|client\s*projects?|case\s*stud(y|ies)|past\s*work|success\s*stories|testimonials)\b/i],
        weight: 8,
        response: "We have delivered high-impact digital systems across retail, healthcare, education, logistics, and tech startups. Check out our real client success stories and project showcases.",
        quickReplies: ["View Client Projects", "Success Stories", "Start Your Project"],
        link: { label: "View Client Projects", url: "/digital-solutions#client-projects" }
    },

    // 14. About SS40 NETWORK & Company Background
    {
        id: "about_company",
        keywords: ["about", "ss40", "company", "founded", "history", "founder", "team", "vision", "mission", "built in india", "who founded"],
        patterns: [/\b(about\s*(ss40|company|network)|who\s*founded|vision|mission|built\s*in\s*india)\b/i],
        weight: 9,
        response: "SS40 NETWORK was founded in 2023 with the vision 'Built in India. Thinking Globally.' We operate as an enterprise-grade technology company across Digital Solutions, Products, and Academics.",
        quickReplies: ["Our Three Wings", "Success Stories", "Office Location"],
        link: { label: "Read Our Story on Home", url: "/#about" }
    },

    // 15. Office Location, Address & Google Maps Link (Updated with exact official coordinates)
    {
        id: "location_hours",
        keywords: ["location", "office", "address", "where", "visit", "hours", "timing", "city", "tirunelveli", "tamil nadu", "india", "map", "google map", "sree puram"],
        patterns: [/\b(location|address|where\s*(are\s*you|is\s*office)|visiting\s*hours|business\s*hours|tirunelveli|google\s*maps?|map)\b/i],
        weight: 12,
        response: `SS40 NETWORK PRIVATE LIMITED\n1st Floor, Municipal Corporation Incubation Centre (Near by trade centre), Sree Puram, Tirunelveli, Tamil Nadu 627001.\n\nBusiness Hours: Monday – Saturday, 9:00 AM – 6:00 PM IST.`,
        quickReplies: ["Open Google Maps", "Contact Office", "WhatsApp Support", "Email Support"],
        link: { label: "Open in Google Maps", url: GOOGLE_MAPS_URL }
    },

    // 16. Careers & Working at SS40
    {
        id: "careers_hiring",
        keywords: ["career", "job", "hiring", "vacancy", "openings", "work with us", "apply for job", "developer role", "mentor role"],
        patterns: [/\b(careers?|job\s*openings?|hiring|work\s*with\s*us|vacancy|join\s*the\s*team)\b/i],
        weight: 8,
        response: "We are always looking for passionate software engineers, product architects, and academic mentors. You can share your resume and profile through our contact desk.",
        quickReplies: ["Submit Resume / Contact", "WhatsApp HR", "Email Support"],
        link: { label: "Contact Careers Desk", url: "/contact" }
    },

    // 17. Direct Support & Human Handover Request
    {
        id: "human_support",
        keywords: ["human", "agent", "support", "person", "representative", "help", "talk", "call", "whatsapp", "phone", "email", "mail", "contact", "reach", "speak", "support mail"],
        patterns: [/\b(human|agent|support\s*team|representative|talk\s*to\s*someone|call\s*us|whatsapp\s*chat|contact\s*support|support\s*mail|send\s*email|email\s*support)\b/i],
        weight: 10,
        response: "Our technical consultants and support advisors are ready to assist you directly. Connect via your preferred channel:",
        triggerSupport: true,
        quickReplies: ["WhatsApp Support", "Email Support", "Visit Contact Page"]
    }
];

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
    const rawPhone = config?.whatsappNumber || "918300591750";
    const cleanPhone = rawPhone.replace(/\D/g, "");
    const email = config?.contactEmail || "contact@ss40network.com";

    const initialBotMessage: ChatMessage = {
        id: "msg-welcome",
        sender: "bot",
        text: "Hello. Welcome to SS40 NETWORK. How can I assist you today?",
        timestamp: new Date(),
        quickReplies: ["Our Three Wings", "SS40 Academics", "Digital Solutions", "SS40 Products", "Support Team"]
    };

    const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopyEmail = (emailToCopy: string) => {
        try {
            navigator.clipboard.writeText(emailToCopy);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } catch {}
    };

    // Optimized smooth auto-scroll to bottom without layout thrashing
    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    }, []);

    // ── CLICK OUTSIDE DETECTION & ESCAPE LISTENER ──
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

    // Initial focus on open
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
                scrollToBottom();
            }, 180);
            return () => clearTimeout(timer);
        }
    }, [isOpen, scrollToBottom]);

    // Scroll only on new message added (zero scroll lag during manual scrolling)
    useEffect(() => {
        if (isOpen && messages.length > 1) {
            scrollToBottom();
        }
    }, [messages.length, isOpen, scrollToBottom]);

    // Handle user sending message
    const handleSend = (textToSend?: string) => {
        const text = (textToSend || inputValue).trim();
        if (!text) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: "user",
            text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Process message through Rule Engine with realistic typing latency
        setTimeout(() => {
            const botResponse = matchRule(text);
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 400);
    };

    // ── INTELLIGENT RULE MATCHING ENGINE ──
    const matchRule = (query: string): ChatMessage => {
        const lowerQuery = query.toLowerCase().trim();
        const queryTokens = lowerQuery.split(/[\s,?.!-]+/).filter(Boolean);

        let bestMatch: KnowledgeRule | null = null;
        let highestScore = 0;

        for (const rule of KNOWLEDGE_BASE) {
            let currentScore = 0;

            // Check Regex patterns (High accuracy)
            for (const pattern of rule.patterns) {
                if (pattern.test(lowerQuery)) {
                    currentScore += rule.weight * 3;
                    break;
                }
            }

            // Keyword token matching
            for (const kw of rule.keywords) {
                if (lowerQuery.includes(kw)) {
                    currentScore += kw.includes(" ") ? 4 : 2;
                }
                for (const token of queryTokens) {
                    if (token.length > 2 && kw.includes(token)) {
                        currentScore += 1;
                    }
                }
            }

            if (currentScore > highestScore) {
                highestScore = currentScore;
                bestMatch = rule;
            }
        }

        // If strong match found (score threshold >= 3)
        if (bestMatch && highestScore >= 3) {
            if (bestMatch.triggerSupport) {
                return {
                    id: `bot-${Date.now()}`,
                    sender: "bot",
                    text: bestMatch.response,
                    timestamp: new Date(),
                    isSupportCard: true,
                    supportData: {
                        phone: cleanPhone,
                        email,
                        whatsappUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello SS40, I need assistance regarding: "${query}"`)}`,
                        mailtoUrl: generateMailtoUrl(email, query),
                        gmailUrl: generateGmailUrl(email, query),
                        contactUrl: "/contact",
                        mapsUrl: GOOGLE_MAPS_URL
                    },
                    quickReplies: ["Our Three Wings", "SS40 Academics", "Digital Solutions", "SS40 Products"]
                };
            }

            return {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text: bestMatch.response,
                timestamp: new Date(),
                quickReplies: bestMatch.quickReplies,
                link: bestMatch.link,
                isAcademicCard: bestMatch.isAcademicCard,
                isWingsCard: bestMatch.isWingsCard
            };
        }

        // ── FALLBACK WHEN QUESTION IS UNRECOGNIZED ──
        return {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "I want to make sure you get the most accurate answer. Our team is ready to assist you directly with custom requirements, technical consultations, or academic admissions:",
            timestamp: new Date(),
            isSupportCard: true,
            supportData: {
                phone: cleanPhone,
                email,
                whatsappUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello SS40 Support, I have an inquiry about: "${query}"`)}`,
                mailtoUrl: generateMailtoUrl(email, query),
                gmailUrl: generateGmailUrl(email, query),
                contactUrl: "/contact",
                mapsUrl: GOOGLE_MAPS_URL
            },
            quickReplies: ["Our Three Wings", "SS40 Academics", "Digital Solutions", "SS40 Products"]
        };
    };

    const handleReset = () => {
        setMessages([initialBotMessage]);
        setInputValue("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={chatContainerRef}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="fixed bottom-20 right-4 md:bottom-24 md:right-8 lg:bottom-24 lg:right-10 z-50 w-[calc(100vw-32px)] sm:w-[430px] h-[590px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-[#0F172A] border-b border-gray-800 text-white p-4 sm:p-4.5 flex items-center justify-between shadow-md relative z-10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F766E] to-[#2DD4BF] flex items-center justify-center text-white shadow-md shadow-[#2DD4BF]/20">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F172A]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5 text-white">
                                    SS40 Concierge
                                    <span className="text-[10px] bg-[#2DD4BF]/15 text-[#2DD4BF] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#2DD4BF]/30">
                                        Active
                                    </span>
                                </h3>
                                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Online • Instant AI Concierge
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleReset}
                                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                                title="Reset conversation"
                                aria-label="Reset chat"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                                title="Close chat (or click outside)"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Scroll Area (Lag-Free Hardware Scroll) */}
                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80 overscroll-contain"
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
                                    className={`max-w-[88%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                                        msg.sender === "user"
                                            ? "bg-[#0F766E] text-white rounded-br-xs shadow-sm font-medium"
                                            : "bg-white text-[#111827] rounded-bl-xs border border-gray-200/80 shadow-xs"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                                    {/* Action Link if provided */}
                                    {msg.link && (
                                        <div className="mt-3 pt-2.5 border-t border-gray-100">
                                            {msg.link.url.startsWith("http") ? (
                                                <a
                                                    href={msg.link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#115E59] transition-colors"
                                                >
                                                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                                                    {msg.link.label}
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            ) : (
                                                <Link
                                                    href={msg.link.url}
                                                    onClick={onClose}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#115E59] transition-colors"
                                                >
                                                    {msg.link.label}
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                            )}
                                        </div>
                                    )}

                                    {/* Rich Three Wings Interactive Card */}
                                    {msg.isWingsCard && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                                            <div className="grid grid-cols-1 gap-1.5 text-[11px] font-medium text-gray-700">
                                                <Link
                                                    href="/digital-solutions"
                                                    onClick={onClose}
                                                    className="p-2.5 bg-blue-50/70 hover:bg-blue-100/80 rounded-xl border border-blue-100 flex items-center justify-between transition-colors text-blue-900 font-semibold"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Code className="w-4 h-4 text-blue-600" />
                                                        1. SS40 Digital Solutions
                                                    </span>
                                                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                                                </Link>
                                                <Link
                                                    href="/products"
                                                    onClick={onClose}
                                                    className="p-2.5 bg-purple-50/70 hover:bg-purple-100/80 rounded-xl border border-purple-100 flex items-center justify-between transition-colors text-purple-900 font-semibold"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <Package className="w-4 h-4 text-purple-600" />
                                                        2. SS40 Products (SaaS)
                                                    </span>
                                                    <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
                                                </Link>
                                                <Link
                                                    href="/academics"
                                                    onClick={onClose}
                                                    className="p-2.5 bg-emerald-50/70 hover:bg-emerald-100/80 rounded-xl border border-emerald-100 flex items-center justify-between transition-colors text-emerald-900 font-semibold"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4 text-[#0F766E]" />
                                                        3. SS40 Academics
                                                    </span>
                                                    <ArrowRight className="w-3.5 h-3.5 text-[#0F766E]" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rich Academic Interactive Card */}
                                    {msg.isAcademicCard && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                                            <div className="p-2.5 bg-[#EDF5F2] rounded-xl border border-[#0F766E]/20 text-xs font-semibold text-[#0F766E] flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-[#0F766E] shrink-0" />
                                                <span>Admissions &amp; Academic Sprints Open</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium text-gray-700">
                                                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-1.5">
                                                    <Rocket className="w-3.5 h-3.5 text-[#0F766E]" /> Live Sprints
                                                </div>
                                                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-1.5">
                                                    <Briefcase className="w-3.5 h-3.5 text-[#0F766E]" /> Placement Prep
                                                </div>
                                                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5 text-[#0F766E]" /> University MOUs
                                                </div>
                                                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-1.5">
                                                    <Laptop className="w-3.5 h-3.5 text-[#0F766E]" /> Student GitHub
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Structured Support Card (Email Formatted + WhatsApp + Google Maps + Phone) */}
                                    {msg.isSupportCard && msg.supportData && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                                            {/* WhatsApp Quick Launcher */}
                                            <a
                                                href={msg.supportData.whatsappUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-between p-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs transition-colors border border-[#25D366]/30 cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                                                    Chat on WhatsApp
                                                </span>
                                                <ExternalLink className="w-3.5 h-3.5 text-[#128C7E]" />
                                            </a>

                                            {/* Single Row: Email (Gmail Web) + Default Mail App + Copy Address */}
                                            <div className="grid grid-cols-3 gap-1.5">
                                                {/* 1. Gmail Web */}
                                                <a
                                                    href={msg.supportData.gmailUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] transition-colors border border-blue-200 cursor-pointer text-center truncate"
                                                    title="Open pre-filled email in Gmail Web"
                                                >
                                                    <Mail className="w-3.5 h-3.5 text-blue-600 mr-1 shrink-0" />
                                                    <span className="truncate">Email</span>
                                                </a>

                                                {/* 2. Default Mail App */}
                                                <a
                                                    href={msg.supportData.mailtoUrl}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-[11px] transition-colors border border-gray-200 cursor-pointer text-center truncate"
                                                    title="Open in default desktop email client (Outlook, Apple Mail)"
                                                >
                                                    <Mail className="w-3.5 h-3.5 text-gray-500 mr-1 shrink-0" />
                                                    <span className="truncate">Default App</span>
                                                </a>

                                                {/* 3. Copy Address */}
                                                <button
                                                    onClick={() => handleCopyEmail(msg.supportData!.email)}
                                                    className="inline-flex items-center justify-center p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-[11px] transition-colors border border-gray-200 cursor-pointer text-center truncate"
                                                    title="Copy email address to clipboard"
                                                >
                                                    {copiedEmail ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0" />
                                                            <span className="text-emerald-700 font-bold truncate">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileText className="w-3.5 h-3.5 text-gray-500 mr-1 shrink-0" />
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
                                                className="inline-flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 font-bold text-xs transition-colors border border-amber-200 cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2 truncate">
                                                    <Compass className="w-4 h-4 text-amber-700 shrink-0" />
                                                    <span className="truncate">Open Office in Google Maps</span>
                                                </span>
                                                <ExternalLink className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                            </a>

                                            {/* Direct Phone Call */}
                                            <a
                                                href={`tel:+${msg.supportData.phone}`}
                                                className="inline-flex items-center justify-between p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200/80 text-[#374151] font-semibold text-xs transition-colors border border-gray-200 cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2 truncate">
                                                    <Phone className="w-4 h-4 text-[#0F766E] shrink-0" />
                                                    <span className="truncate">Call: +{msg.supportData.phone}</span>
                                                </span>
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>

                                {/* Quick Reply Pills */}
                                {msg.quickReplies && msg.quickReplies.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                                        {msg.quickReplies.map((pill, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(pill)}
                                                className="text-xs font-semibold text-[#0F766E] bg-white hover:bg-[#D8E8E2] border border-[#0F766E]/25 shadow-xs px-2.5 py-1 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                            >
                                                {pill}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Animation */}
                        {isTyping && (
                            <div className="flex items-start">
                                <div className="bg-white border border-gray-200/80 rounded-2xl rounded-bl-xs p-3 shadow-xs flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Footer & Disclaimer */}
                    <div className="bg-white border-t border-gray-200 p-3 shrink-0 flex flex-col gap-1.5">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask a question or select a topic..."
                                className="flex-1 px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]/40 focus:border-[#0F766E] text-[#111827] placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="w-10 h-10 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-xs cursor-pointer"
                                aria-label="Send message"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        <p className="text-[10px] text-gray-400 text-center">
                            SS40 Concierge • Click outside or press Esc to close
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
