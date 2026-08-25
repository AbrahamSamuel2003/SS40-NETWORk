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
    Calendar
} from "lucide-react";
import type { SiteConfigData } from "@/lib/site-config";

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
    isProductCard?: boolean;
    isDigitalCard?: boolean;
    supportData?: {
        phone: string;
        email: string;
        whatsappUrl: string;
        mailtoUrl: string;
        contactUrl: string;
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
    isProductCard?: boolean;
    isDigitalCard?: boolean;
}

// ----------------------------------------------------------------------------
// Helper: Generate Formatted Email Template URL (Matching WhatsApp standard)
// ----------------------------------------------------------------------------
function generateMailtoUrl(email: string, query?: string) {
    const subject = encodeURIComponent(
        query ? `SS40 Network Inquiry: ${query.slice(0, 50)}` : "SS40 Network Enterprise & Academic Inquiry"
    );
    const body = encodeURIComponent(
`Hello SS40 Network Team,

I am writing to inquire regarding the following details:

- Area of Interest: [SS40 Digital Solutions / SS40 Products / SS40 Academics / Support]
- Requirement / Question: ${query ? `"${query}"` : "Please share more information on your services and offerings."}
- Full Name: 
- Organization / College: 
- Phone Number / WhatsApp: 
- Preferred Contact Time: 

Looking forward to your response.

Best regards,`
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
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
        response: "Hello. Welcome to SS40 NETWORK. I am your AI Assistant. I can help you explore our Digital Solutions, SaaS Products, and Academic Programs, or connect you directly with our team.",
        quickReplies: ["SS40 Academics", "Digital Solutions", "SS40 Products", "Request a Quote", "Support Team"]
    },

    // 2. Academics - Core Overview (High priority match for Academic Programs)
    {
        id: "academics_core",
        keywords: ["academic", "academics", "academic program", "academic programs", "education", "training", "courses", "student", "college program"],
        patterns: [/\b(academic\s*programs?|academics|education|student\s*programs?|training\s*programs?)\b/i],
        weight: 10,
        isAcademicCard: true,
        response: "SS40 Academics bridges the gap between formal higher education and real-world technology engineering. Our ecosystem is built on 4 core pillars:\n\n1. Project-Based Internships: Build production-ready web, cloud, and AI applications with live code reviews.\n2. Career Launch Pad: Master technical interviews, algorithmic coding, resume crafting, and portfolio building.\n3. Placement Pipelines: Direct referral and recruitment pathways with verified hiring partners.\n4. Institutional MOUs: Campus workshops, guest lectures, curriculum alignment, and innovation labs.",
        quickReplies: ["Internship Sprints", "Placement Prep", "University MOUs", "Student Projects", "Apply for Academics"],
        link: { label: "Explore SS40 Academics Platform", url: "/academics" }
    },

    // 3. Academics - Internships & Live Sprints
    {
        id: "academics_internships",
        keywords: ["internship", "intern", "sprint", "live project", "hands-on", "fresher", "practical learning", "stipend", "certificate", "skills"],
        patterns: [/\b(internship|intern|live\s*project|hands-on\s*learning|fresher\s*training|skill\s*sprints?)\b/i],
        weight: 9,
        response: "SS40 Internship Sprints provide immersive, project-based engineering training. Students work on actual production codebases, collaborate via GitHub, receive 1-on-1 industry mentorship, and earn verified credentials.",
        quickReplies: ["Academic Overview", "Student Projects", "Placement Prep", "Talk to Academic Team"],
        link: { label: "View Academic Programs", url: "/academics" }
    },

    // 4. Academics - Placements & Career Readiness
    {
        id: "academics_placements",
        keywords: ["placement", "job", "career", "hiring", "interview", "resume", "aptitude", "mock interview", "placement support", "salary", "package"],
        patterns: [/\b(placement|job|career|interview\s*prep|resume\s*review|hiring\s*support|placement\s*support)\b/i],
        weight: 9,
        response: "Our Career Launch Pad equips learners with mock technical interviews, DSA coding problem-solving, system design fundamentals, resume coaching, and direct recruitment pathways to leading tech companies.",
        quickReplies: ["Placement Journey", "Student Success Stories", "Collaborate with Us", "Support Team"],
        link: { label: "Explore Placement Journey", url: "/academics#placements" }
    },

    // 5. Academics - Student Projects Showcase
    {
        id: "academics_student_projects",
        keywords: ["student project", "student projects", "showcase", "built by students", "github projects", "portfolios", "student apps"],
        patterns: [/\b(student\s*projects?|student\s*showcase|built\s*by\s*students)\b/i],
        weight: 9,
        response: "Students at SS40 build full-fledged applications across AI automation, healthcare software, e-commerce engines, and developer productivity tools. Explore our verified student project repository.",
        quickReplies: ["View Student Projects", "Internship Sprints", "Academic Overview"],
        link: { label: "Browse Student Projects Showcase", url: "/academics/student-projects" }
    },

    // 6. Academics - College & University Collaborations (MOUs)
    {
        id: "academics_colleges",
        keywords: ["college", "university", "institution", "mou", "faculty", "workshop", "guest lecture", "collaboration", "campus", "curriculum", "hackathon"],
        patterns: [/\b(college|university|institution|mou|faculty|workshop|campus\s*drive|academic\s*partner|curriculum)\b/i],
        weight: 9,
        response: "We partner with universities and colleges through strategic MOUs, modern industry-aligned curriculum integration, specialized technical workshops, faculty enablement, and campus innovation labs.",
        quickReplies: ["Partner with SS40", "Academic Collaborations", "Talk to Academic Team"],
        link: { label: "University Partnerships & MOUs", url: "/academics#collaborations" }
    },

    // 7. Digital Solutions - Custom Software & Engineering
    {
        id: "digital_solutions_core",
        keywords: ["digital solutions", "custom software", "web development", "mobile app", "full stack", "react", "nextjs", "nodejs", "python", "backend", "frontend", "api", "database", "cloud architecture"],
        patterns: [/\b(digital\s*solutions?|custom\s*software|web\s*(app|development)|mobile\s*app|full\s*stack|api|backend|frontend|software\s*development)\b/i],
        weight: 9,
        isDigitalCard: true,
        response: "SS40 Digital Solutions architects and builds enterprise-grade web applications, native & cross-platform mobile apps, secure APIs, and scalable cloud systems tailored to specific business operations.",
        quickReplies: ["Client Projects", "Request a Quote", "Development Lifecycle", "Start Your Project"],
        link: { label: "Explore Digital Solutions", url: "/digital-solutions" }
    },

    // 8. Digital Solutions - AI & Automation
    {
        id: "ai_automation",
        keywords: ["ai", "artificial intelligence", "automation", "workflow", "machine learning", "bot", "llm", "data pipeline", "intelligent software"],
        patterns: [/\b(ai|artificial\s*intelligence|automation|workflow\s*automation|machine\s*learning|llm|data\s*sync)\b/i],
        weight: 9,
        response: "We design AI-driven automation systems, intelligent workflows, and custom LLM integrations that eliminate repetitive manual operations and deliver actionable business intelligence.",
        quickReplies: ["Start Your Project", "Digital Solutions", "Book Consultation"],
        link: { label: "AI & Digital Engineering", url: "/digital-solutions#what-we-build" }
    },

    // 9. Products - SaaS & Software Platforms
    {
        id: "products_core",
        keywords: ["product", "products", "saas", "software product", "clearinvoice", "cloud platform", "tools", "crm", "erp", "license", "subscription", "features"],
        patterns: [/\b(products?|saas|software\s*product|cloud\s*platform|business\s*tool|clearinvoice)\b/i],
        weight: 9,
        isProductCard: true,
        response: "SS40 Products delivers scalable, business-ready SaaS applications engineered for operational efficiency, automated invoicing, real-time analytics, and guaranteed 99.99% uptime.",
        quickReplies: ["Book a Product Demo", "Our Product Brands", "Custom Enterprise Setup"],
        link: { label: "Discover SS40 Products", url: "/products" }
    },

    // 10. Demo Booking
    {
        id: "book_demo",
        keywords: ["demo", "book demo", "trial", "test product", "walkthrough", "live demo", "preview", "schedule demo"],
        patterns: [/\b(book\s*a?\s*demo|schedule\s*a?\s*demo|free\s*trial|live\s*demo|product\s*preview)\b/i],
        weight: 10,
        response: "We would be glad to give you a live interactive walkthrough of our products. You can schedule a personalized demo with our solutions engineering team.",
        quickReplies: ["Schedule Demo Now", "WhatsApp Demo Request", "View Products"],
        link: { label: "Book a Demo on Contact Page", url: "/contact?source=BOOK_DEMO" }
    },

    // 11. Pricing, Estimates & Custom Quotes
    {
        id: "pricing_quotes",
        keywords: ["price", "pricing", "cost", "quote", "budget", "rate", "estimate", "charges", "how much", "fees"],
        patterns: [/\b(price|pricing|cost|quote|budget|rate|estimate|how\s*much|fees)\b/i],
        weight: 9,
        response: "Our digital solutions and product implementations are scoped transparently based on functional specifications, architecture complexity, and delivery timeline. We provide free initial project estimations.",
        quickReplies: ["Request Free Quote", "Chat on WhatsApp", "Email Support"],
        link: { label: "Get a Custom Project Quote", url: "/contact" }
    },

    // 12. Portfolio, Case Studies & Client Projects
    {
        id: "portfolio_projects",
        keywords: ["portfolio", "projects", "work", "case study", "clients", "testimonials", "success stories", "examples", "past work"],
        patterns: [/\b(portfolio|client\s*projects?|case\s*stud(y|ies)|past\s*work|success\s*stories|testimonials)\b/i],
        weight: 8,
        response: "We have delivered high-impact digital systems across retail, healthcare, education, logistics, and tech startups. Check out our real client success stories and project showcases.",
        quickReplies: ["View Client Projects", "Success Stories", "Start Your Project"],
        link: { label: "View Client Projects", url: "/digital-solutions#client-projects" }
    },

    // 13. About SS40 NETWORK & Company Background
    {
        id: "about_company",
        keywords: ["about", "ss40", "company", "founded", "history", "founder", "team", "vision", "mission", "ecosystem", "india", "global"],
        patterns: [/\b(about\s*(ss40|company|network)|who\s*founded|vision|mission|ecosystem|built\s*in\s*india)\b/i],
        weight: 8,
        response: "SS40 NETWORK was founded in 2023 with the mission 'Built in India. Thinking Globally.' We operate as a unified ecosystem across Digital Solutions, Products, and Academics.",
        quickReplies: ["Our Three Wings", "Success Stories", "Office Location"],
        link: { label: "Read Our Story", url: "/#about" }
    },

    // 14. Office Location, Visiting & Business Hours
    {
        id: "location_hours",
        keywords: ["location", "office", "address", "where", "visit", "hours", "timing", "city", "salem", "tamil nadu", "india"],
        patterns: [/\b(location|address|where\s*(are\s*you|is\s*office)|visiting\s*hours|business\s*hours|salem)\b/i],
        weight: 8,
        response: "Our headquarters is located in Salem, Tamil Nadu, India. Our office hours are Monday through Saturday, 9:00 AM to 6:00 PM IST. Virtual consultations are available globally.",
        quickReplies: ["View on Map", "Contact Office", "WhatsApp Support", "Send Email"],
        link: { label: "Office & Location Details", url: "/contact#locations" }
    },

    // 15. Careers & Working at SS40
    {
        id: "careers_hiring",
        keywords: ["career", "job", "hiring", "vacancy", "openings", "work with us", "apply for job", "developer role", "mentor role"],
        patterns: [/\b(careers?|job\s*openings?|hiring|work\s*with\s*us|vacancy|join\s*the\s*team)\b/i],
        weight: 8,
        response: "We are always looking for passionate software engineers, product architects, and academic mentors. You can share your resume and profile through our contact desk.",
        quickReplies: ["Submit Resume / Contact", "WhatsApp HR", "Send Email"],
        link: { label: "Contact Careers Desk", url: "/contact" }
    },

    // 16. Direct Support & Human Handover Request
    {
        id: "human_support",
        keywords: ["human", "agent", "support", "person", "representative", "help", "talk", "call", "whatsapp", "phone", "email", "mail", "contact", "reach", "speak", "support mail"],
        patterns: [/\b(human|agent|support\s*team|representative|talk\s*to\s*someone|call\s*us|whatsapp\s*chat|contact\s*support|support\s*mail|send\s*email|email\s*support)\b/i],
        weight: 10,
        response: "Our dedicated support engineers and business consultants are available to assist you directly. Connect via your preferred channel:",
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
        text: "Hello. I am the SS40 AI Concierge. How can I assist you today?",
        timestamp: new Date(),
        quickReplies: ["SS40 Academics", "Digital Solutions", "SS40 Products", "Request a Quote", "Support Team"]
    };

    const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom of messages
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
                scrollToBottom();
            }, 250);
        }
    }, [isOpen, messages, scrollToBottom]);

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
        }, 500);
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
                        contactUrl: "/contact"
                    },
                    quickReplies: ["SS40 Academics", "Digital Solutions", "SS40 Products"]
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
                isProductCard: bestMatch.isProductCard,
                isDigitalCard: bestMatch.isDigitalCard
            };
        }

        // ── FALLBACK WHEN QUESTION IS UNRECOGNIZED ──
        return {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: "I want to ensure you receive precise assistance. Our technical consultants and academic advisors are available directly:",
            timestamp: new Date(),
            isSupportCard: true,
            supportData: {
                phone: cleanPhone,
                email,
                whatsappUrl: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello SS40 Support, I have an inquiry about: "${query}"`)}`,
                mailtoUrl: generateMailtoUrl(email, query),
                contactUrl: "/contact"
            },
            quickReplies: ["SS40 Academics", "Digital Solutions", "SS40 Products", "Request a Quote"]
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
                    initial={{ opacity: 0, y: 30, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.94 }}
                    transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="fixed bottom-20 right-4 md:bottom-24 md:right-8 lg:bottom-24 lg:right-10 z-50 w-[calc(100vw-32px)] sm:w-[430px] h-[590px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden transform-gpu"
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
                                    Online • 24/7 Intelligent Assistant
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

                    {/* Messages Scroll Area */}
                    <div
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80"
                        style={{ scrollbarWidth: "thin" }}
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
                                            <Link
                                                href={msg.link.url}
                                                onClick={onClose}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#115E59] transition-colors"
                                            >
                                                {msg.link.label}
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
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

                                    {/* Structured Support Card (Email Formatted + WhatsApp + Contact) */}
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
                                                    Chat on WhatsApp (Instant)
                                                </span>
                                                <ExternalLink className="w-3.5 h-3.5 text-[#128C7E]" />
                                            </a>

                                            {/* Formatted Mailto Launcher (With Full Inquiry Template) */}
                                            <a
                                                href={msg.supportData.mailtoUrl}
                                                className="inline-flex items-center justify-between p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-800 font-bold text-xs transition-colors border border-blue-200 cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2 truncate">
                                                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                                                    <span className="truncate">Email Support (Pre-filled)</span>
                                                </span>
                                                <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0" />
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

                                            {/* Consultation & Location Desk */}
                                            <Link
                                                href={msg.supportData.contactUrl}
                                                onClick={onClose}
                                                className="inline-flex items-center justify-between p-2.5 rounded-xl bg-[#D8E8E2]/60 hover:bg-[#D8E8E2] text-[#0F766E] font-bold text-xs transition-colors border border-[#0F766E]/20 cursor-pointer"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-[#0F766E]" />
                                                    Consultation &amp; Contact Desk
                                                </span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
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

                    {/* Input Footer & Beta Disclaimer */}
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
                            SS40 Concierge Assistant • Click outside or press Esc to close
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
