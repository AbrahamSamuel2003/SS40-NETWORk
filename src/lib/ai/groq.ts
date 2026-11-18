import Groq from "groq-sdk";
import { searchVectorKnowledge, VectorSearchResult, VectorChunk } from "./rag/vector-store";
import { processUserQuery, extractContactDetails } from "./rag/query-processor";

function getGroqClient(): Groq | null {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
    return new Groq({ apiKey });
}

function stripEmojisAndSparkles(text: string): string {
    if (!text) return "";
    return text
        .replace(/\p{Extended_Pictographic}/gu, "")
        .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{FE00}-\u{FE0F}]/gu, "")
        .replace(/[✨⭐🌟💡🚀🔥🎉👍👋🤖]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

export interface ChatHistoryMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface StructuredSkyResponse {
    answer: string;
    options: string[];
    navigation: {
        label: string;
        url: string;
    } | null;
    replyText?: string;
    quickReplies?: string[];
    link?: {
        label: string;
        url: string;
    } | null;
    actionType?: "STANDARD" | "WINGS_CARD" | "ACADEMIC_CARD" | "SUPPORT_CARD" | "LEAD_CAPTURE" | "PROJECT_PREVIEW";
    source: "groq-rag-ai" | "emergency-fallback";
}

/**
 * Single Unified Master System Prompt for SS40 SKY
 * Governs all 3 interaction modes (Company inquiries, Greetings/Small Talk, and Out-of-Scope redirection)
 * while guaranteeing zero repetition, dynamic conversational language, and strict factual grounding.
 */
const SS40_SKY_MASTER_PROMPT = `You are SS40 SKY, official AI assistant for SS40 NETWORK (SS40 NETWORK PRIVATE LIMITED).

CORE RULES:
1. EXCLUSIVE SCOPE: Specialize strictly in SS40 NETWORK.
2. THREE WINGS:
   - SS40 Digital Solutions (custom web, mobile apps, enterprise software, AI & cloud systems).
   - SS40 Products (ClearInvoice GST billing, GTC Suite, SS40 AI Email Agent). Never say "SaaS products".
   - SS40 Academics (practical software engineering internships, live sprints, DSA placement prep).
3. BUSINESS DOCTOR: 1-on-1 strategic diagnostic consultation ("Diagnose Before You Scale") to identify operational bottlenecks and provide a technology prescription. 45-60 min private session available In-Person in Tirunelveli OR Online via Google Meet (GMeet), booked at https://ss40-consultancy.vercel.app/.
4. STRICT BAN: NEVER use any emojis or sparkles under any circumstances. Text only.
5. COMPANY NAME: Always full uppercase: "SS40 NETWORK".
6. CRISP REPLIES: Keep answers direct, concise (2 to 3 sentences or clean markdown bullet points). No fluff or padding.
7. PRICING RULE: NEVER quote or state any price or consultation fee amounts.

INQUIRY MODES:
- Company Inquiries: Use ONLY facts from [RETRIEVED SS40 KNOWLEDGE CONTEXT].
  * Products: ClearInvoice (GST billing, PDF invoices, inventory, Razorpay, Google Drive sync). AI Email Agent (inbox only, filters spam, instant drafts; no WhatsApp). GTC Suite (business management).
  * Business Doctor: Mention 1-on-1 session (GMeet/Tirunelveli), 6 diagnostic pillars, Executive Diagnosis Report & Tech Prescription. No price. Nav: {"label": "Book Business Health Checkup", "url": "https://ss40-consultancy.vercel.app/"}.
  * Academics: Mention practical sprints, live client projects, placement referrals, certificates.
  * Pricing: Explain custom milestone-based pricing with free initial scoping and product demos.
- Contact Requests: Provide Phone: +91 83005 91750 | Email: support@ss40network.com | Location: Tirunelveli, Tamil Nadu. actionType: "LEAD_CAPTURE".
- Out-of-Scope (trivia, homework, politics, non-tech): Politely state you specialize strictly in SS40 NETWORK's digital solutions, software products, and tech academics. Nav: "/contact".

LEAD CONVERSION:
- Never repeat closing sentences. Acknowledge user names warmly. Phone/email are recorded securely.

SUGGESTION PILLS ("options"):
- Must be 1-tap exploration shortcuts (never "Provide Name" or form requests).
- Allowed pills:
  * General: ["Three Wings Overview", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"]
  * Products: ["ClearInvoice", "SS40 AI Email Agent", "GTC Suite", "Explore Products"]
  * Invoicing: ["ClearInvoice Live Demo", "ClearInvoice Pricing", "GST Billing Features", "Explore Products"]
  * Solutions: ["Web App Development", "Mobile App Sprints", "Client Case Studies", "Cloud Architecture"]
  * Consultation: ["Business Health Checkup", "Book Consultation Session", "Explore Digital Solutions", "Contact Team"]
  * Academics: ["Academic Internships", "Student Projects", "DSA Placement Prep", "College MOUs"]

OUTPUT FORMAT (JSON ONLY):
{
  "answer": "Concise natural response here.",
  "options": ["Pill 1", "Pill 2", "Pill 3"],
  "navigation": { "label": "Button Label", "url": "/internal-route-or-allowed-link" }, // or null
  "actionType": "STANDARD" // STANDARD | WINGS_CARD | ACADEMIC_CARD | SUPPORT_CARD | LEAD_CAPTURE
}
ALLOWED ROUTES: "/products", "/digital-solutions", "/academics", "/contact", "/#about", "/academics/student-projects", "/client-projects", "/#business-wings", "/blogs", or "https://ss40-consultancy.vercel.app/".`;

export async function generateRagResponse(
    userMessage: string,
    history: ChatHistoryMessage[] = []
): Promise<StructuredSkyResponse> {
    const rawUserMessage = userMessage.trim();

    // 1. Process and resolve query context
    const processed = processUserQuery(rawUserMessage, history);

    // High-speed, polite handler for gibberish / keysmash / meaningless inputs (e.g. "kjfbveaubviwubuEBFUjb", "asdfghjkl")
    if (processed.isGibberish) {
        const gibberishAnswer = "I couldn't quite understand that. I am **SS40 SKY**, your official AI assistant for **SS40 NETWORK**.\n\nWe specialize in Three Wings:\n- **SS40 Digital Solutions**: Custom software, web & mobile applications, AI, and cloud systems.\n- **SS40 Products**: Scalable business software and enterprise tools.\n- **SS40 Academics**: Hands-on software engineering internships and DSA placement training.\n\nPlease pick an option below, or let me know what software or tech service you are looking for.";
        return {
            answer: gibberishAnswer,
            replyText: gibberishAnswer,
            options: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            quickReplies: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            navigation: { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            link: { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            actionType: "WINGS_CARD",
            source: "groq-rag-ai"
        };
    }

    // High-speed, polite handler for out-of-scope random questions (math, school questions, trivia, creative writing)
    if (processed.isOutOfScope) {
        const outOfScopeAnswer = "I am **SS40 SKY**, the official AI assistant for **SS40 NETWORK**. I specialize strictly in our custom software engineering (Digital Solutions), scalable products, and tech academic internships, so I cannot assist with outside topics or general trivia.\n\nHowever, if you have a software requirement, project idea, or tech career goal in mind, our engineering team in Tirunelveli would love to assist you.\n\nPlease feel free to explore our services below or visit our Contact page to reach our team.";
        return {
            answer: outOfScopeAnswer,
            replyText: outOfScopeAnswer,
            options: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            quickReplies: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            navigation: { label: "Contact SS40 Team", url: "/contact" },
            link: { label: "Contact SS40 Team", url: "/contact" },
            actionType: "STANDARD",
            source: "groq-rag-ai"
        };
    }

    // High-speed instant handler for greetings (< 5ms response, zero LLM delay)
    if (processed.isGreeting) {
        const greetingOptions = [
            "Hello! I am **SS40 SKY**, your official AI assistant for **SS40 NETWORK**.\n\nWe specialize in Three Wings: Custom Software (**SS40 Digital Solutions**), Enterprise Products (**SS40 Products**), and Practical Tech Internships (**SS40 Academics**).\n\nWhat would you like to explore today?",
            "Hi there! Welcome to **SS40 NETWORK**. I'm **SS40 SKY**, here to guide you through our digital engineering services, business software products, and tech academics.\n\nHow can I help you today?",
            "Greetings! I am **SS40 SKY**, the AI assistant for **SS40 NETWORK**. Whether you are looking for custom software engineering, business tools like ClearInvoice, or our Business Doctor checkup, I'm here to assist."
        ];
        const selectedGreeting = greetingOptions[Math.floor(Math.random() * greetingOptions.length)];
        return {
            answer: selectedGreeting,
            replyText: selectedGreeting,
            options: ["Three Wings Overview", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            quickReplies: ["Three Wings Overview", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            navigation: { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            link: { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            actionType: "WINGS_CARD",
            source: "groq-rag-ai"
        };
    }

    if (processed.isSmallTalk && !/what|who|service|product|clearinvoice|doctor/i.test(rawUserMessage)) {
        const smallTalkAnswer = "I'm doing well, thank you! I am **SS40 SKY**, ready to assist you with custom software engineering, ready-to-use business products, or tech internship programs at **SS40 NETWORK**.\n\nWhat would you like to discover today?";
        return {
            answer: smallTalkAnswer,
            replyText: smallTalkAnswer,
            options: ["Three Wings Overview", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            quickReplies: ["Three Wings Overview", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            navigation: { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            link: { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            actionType: "STANDARD",
            source: "groq-rag-ai"
        };
    }

    // 2. Retrieve relevant company context via Neural Vector Search
    const vectorResult: VectorSearchResult = await searchVectorKnowledge(
        processed.contextResolvedQuery,
        4,    // topK
        0.30  // threshold
    );

    const primaryChunk: VectorChunk | undefined = vectorResult.primaryChunk;
    const groqClient = getGroqClient();

    // Emergency fallback only if Groq is completely unavailable
    if (!groqClient) {
        let fallbackText = "SS40 NETWORK operates across Three Specialized Wings: SS40 Digital Solutions for custom software, SS40 Products, and SS40 Academics for practical internships. How can I assist you today?";
        let fallbackOptions = ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"];

        if (processed.isGreeting) {
            fallbackText = "Hello! I am SS40 SKY, your official AI assistant for SS40 NETWORK. We specialize in custom software engineering (Digital Solutions), scalable SS40 Products, and tech academic internships. What would you like to explore today?";
            fallbackOptions = ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"];
        } else if (processed.isSmallTalk) {
            fallbackText = "Hello! I am SS40 SKY, the AI assistant for SS40 NETWORK. I'm here to help you discover our custom software engineering, SS40 Products, and academic internship programs. How can I assist you?";
        } else if (primaryChunk && vectorResult.topScore >= 0.45) {
            fallbackText = primaryChunk.summary || primaryChunk.content;
            fallbackOptions = primaryChunk.suggestedOptions || fallbackOptions;
        }

        return {
            answer: fallbackText,
            replyText: fallbackText,
            options: sanitizePillOptions(fallbackOptions, primaryChunk, rawUserMessage, processed.isGreeting || processed.isSmallTalk),
            quickReplies: sanitizePillOptions(fallbackOptions, primaryChunk, rawUserMessage, processed.isGreeting || processed.isSmallTalk),
            navigation: primaryChunk?.route ? { label: "Explore", url: primaryChunk.route } : { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            link: primaryChunk?.route ? { label: "Explore", url: primaryChunk.route } : { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            actionType: "STANDARD",
            source: "emergency-fallback",
        };
    }

    // 3. Let Groq dynamically generate the response using RAG context
    try {
        const contextText = vectorResult.chunks.length > 0 && vectorResult.topScore >= 0.35
            ? vectorResult.contextText
            : "No specific company document was directly matched. If this is small talk or off-topic, follow Mode 2 or Mode 3 instructions in the system prompt.";

        const userTurnCount = history.filter(m => m.role === "user").length + 1;
        const currentContact = extractContactDetails(rawUserMessage, history);

        // Check if the previous assistant message already asked for contact info to prevent consecutive nagging
        const lastAssistantMessage = [...history].reverse().find(m => m.role === "assistant");
        const lastAssistantAskedForLead = lastAssistantMessage
            ? /\b(drop your name|share your phone|share your email|phone or email|feel free to share|contact details|quote and|reach out to you)\b/i.test(lastAssistantMessage.content)
            : false;

        const hasHighCommercialIntent = /\b(pricing|price|cost|quote|demo|consultation|scoping|apply|join|admission|walkthrough)\b/i.test(rawUserMessage);

        let dynamicLeadDirective = "";
        if (!currentContact.hasAnyContactInfo && (hasHighCommercialIntent || (userTurnCount >= 3 && !lastAssistantAskedForLead)) && !processed.isGreeting && !processed.isOutOfScope) {
            dynamicLeadDirective = `\n\n[DYNAMIC CONTEXTUAL LEAD CONVERSION DIRECTIVE - Turn ${userTurnCount}]:
- First, answer the user's specific question completely, simply, and accurately.
- Then, smoothly connect your answer to a polite, gentle 1-sentence closing invitation tailored to the EXACT TOPIC discussed:
  * If discussing SS40 Products: Offer a quick 1-on-1 walkthrough or pricing details for their business.
  * If discussing SS40 Digital Solutions: Offer a free project scoping consultation or milestone quote.
  * If discussing SS40 Academics: Offer the upcoming sprint syllabus, project access, or admission details.
- Phrasing MUST be dynamic, varied, polite, and natural. NEVER repeat boilerplate sentences from previous turns. Keep it completely in sync with what was asked.`;
        } else if (currentContact.name && !currentContact.phone && !currentContact.email) {
            dynamicLeadDirective = `\n\n[DYNAMIC CONTEXTUAL LEAD DIRECTIVE]:
- The user's name is "${currentContact.name}".
- Acknowledge them warmly by name as SS40 SKY (e.g. "Hello ${currentContact.name}! Great to connect with you."), answer their question or introduce our Three Wings, and invite them to explore SS40 Digital Solutions, SS40 Products, or Academics.`;
        } else if (!currentContact.name && (currentContact.phone || currentContact.email)) {
            dynamicLeadDirective = `\n\n[DYNAMIC CONTEXTUAL LEAD DIRECTIVE]:
- The user provided contact info (${currentContact.phone || currentContact.email}) but has not shared their name.
- Acknowledge the contact info and politely ask for their name so our team knows who to address.`;
        } else if (currentContact.name && (currentContact.phone || currentContact.email)) {
            dynamicLeadDirective = `\n\n[DYNAMIC CONTEXTUAL LEAD DIRECTIVE]:
- Complete contact info is present (Name: ${currentContact.name}, Contact: ${currentContact.phone || currentContact.email}).
- Acknowledge them warmly and confirm our team will review their inquiry and reach out shortly.`;
        }

        const systemPromptWithContext = `${SS40_SKY_MASTER_PROMPT}

[RETRIEVED SS40 KNOWLEDGE CONTEXT]:
${contextText}${dynamicLeadDirective}`;

        const recentHistory = history.slice(-10).map(msg => ({
            role: msg.role === "assistant" ? "assistant" as const : "user" as const,
            content: msg.content,
        }));

        let completion;
        try {
            completion = await groqClient.chat.completions.create({
                model: "openai/gpt-oss-120b",
                temperature: 0.3,
                max_tokens: 600,
                reasoning_effort: "low",
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: systemPromptWithContext },
                    ...recentHistory,
                    { role: "user", content: rawUserMessage },
                ],
            } as any);
        } catch (err1) {
            console.warn("Retrying with fallback model openai/gpt-oss-20b:", err1);
            try {
                completion = await groqClient.chat.completions.create({
                    model: "openai/gpt-oss-20b",
                    temperature: 0.3,
                    max_tokens: 600,
                    reasoning_effort: "low",
                    response_format: { type: "json_object" },
                    messages: [
                        { role: "system", content: systemPromptWithContext },
                        ...recentHistory,
                        { role: "user", content: rawUserMessage },
                    ],
                } as any);
            } catch (err2) {
                console.warn("Retrying with fallback model qwen/qwen3.8-27b:", err2);
                completion = await groqClient.chat.completions.create({
                    model: "qwen/qwen3.8-27b",
                    temperature: 0.3,
                    max_tokens: 600,
                    response_format: { type: "json_object" },
                    messages: [
                        { role: "system", content: systemPromptWithContext },
                        ...recentHistory,
                        { role: "user", content: rawUserMessage },
                    ],
                });
            }
        }

        const rawJsonString = completion.choices[0]?.message?.content?.trim() || "{}";
        let parsed: any;
        try {
            parsed = JSON.parse(rawJsonString);
        } catch {
            parsed = {
                answer: rawJsonString,
                options: ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"],
                navigation: { label: "Explore SS40 NETWORK", url: "/#business-wings" },
                actionType: "STANDARD",
            };
        }

        let finalAnswer: string = typeof parsed.answer === "string" && parsed.answer.trim()
            ? parsed.answer.trim()
            : "Hello! I am SS40 SKY, your assistant for SS40 NETWORK. How can I assist you with our services, products, or academic programs today?";

        // Enforce full uppercase company name, sanitize product feature claims, and strip emojis/sparkles
        finalAnswer = stripEmojisAndSparkles(
            finalAnswer
                .replace(/SS40\s+Network\b/g, "SS40 NETWORK")
                .replace(/ss40\s+network\b/gi, "SS40 NETWORK")
                .replace(/\s*(?:directly\s*in|available\s*via|replies\s*via|also\s*available\s*via|with|over|via)\s*WhatsApp/gi, "")
                .replace(/\s*\((?:available via|replies via|also available via|with|over|via)?\s*WhatsApp\)/gi, "")
        );

        // Sanitize pill options to guarantee they are 1-tap topic exploration shortcuts (never form prompts)
        const options: string[] = sanitizePillOptions(parsed.options, primaryChunk, rawUserMessage, processed.isGreeting || processed.isSmallTalk);

        let navigation: { label: string; url: string } | null = null;
        if (parsed.navigation && typeof parsed.navigation.url === "string" && (parsed.navigation.url.startsWith("/") || parsed.navigation.url.startsWith("https://ss40-consultancy.vercel.app"))) {
            navigation = {
                label: stripEmojisAndSparkles(String(parsed.navigation.label || "Learn More")),
                url: parsed.navigation.url.trim(),
            };
        } else if (primaryChunk?.route && vectorResult.topScore >= 0.40) {
            navigation = {
                label: primaryChunk.id === "doc-business-doctor"
                    ? "Book Business Health Checkup"
                    : `Explore ${primaryChunk.category === "products" ? "Products" : primaryChunk.category === "academics" || primaryChunk.category === "internships" ? "Academics" : primaryChunk.category === "digital-solutions" ? "Digital Solutions" : "SS40 NETWORK"}`,
                url: primaryChunk.route,
            };
        }

        let actionType: StructuredSkyResponse["actionType"] = "STANDARD";
        const isExplicitContactRequest = /^(contact|contact team|contact us|contact details|contact info|get in touch|talk to team|leave contact details|request callback|callback request|how to contact|reach out)$/i.test(rawUserMessage.trim()) || /\b(contact details|contact info|how (can i|to) contact|phone number|reach your team)\b/i.test(rawUserMessage);
        const isHighIntentTopic = /\b(live demo|book demo|schedule demo|pricing|quote|get a quote|request a quote|scoping call|hire|consultation)\b/i.test(rawUserMessage);

        if (isExplicitContactRequest) {
            actionType = "LEAD_CAPTURE";
        } else if (userTurnCount >= 3 && isHighIntentTopic && !processed.isGreeting) {
            actionType = "LEAD_CAPTURE";
        } else if (parsed.actionType && ["STANDARD", "WINGS_CARD", "ACADEMIC_CARD", "SUPPORT_CARD", "LEAD_CAPTURE"].includes(parsed.actionType)) {
            actionType = parsed.actionType;
        } else {
            actionType = determineActionType(primaryChunk, rawUserMessage);
            const isContactOrLead = /\b(contact|phone|call|email|reach|quote|demo|callback)\b/i.test(rawUserMessage);
            if (actionType === "LEAD_CAPTURE" && !isContactOrLead && (userTurnCount < 3 || processed.isGreeting)) {
                actionType = "STANDARD";
            }
        }

        // When lead form is displayed, suppress duplicate link buttons to keep vertical height compact
        if (actionType === "LEAD_CAPTURE" || isExplicitContactRequest) {
            navigation = null;
        }

        return {
            answer: finalAnswer,
            replyText: finalAnswer,
            options,
            quickReplies: options,
            navigation,
            link: navigation,
            actionType,
            source: "groq-rag-ai",
        };
    } catch (error) {
        let fallbackContent = "SS40 NETWORK operates across Three Specialized Wings: SS40 Digital Solutions for custom software, SS40 Products, and SS40 Academics for practical internships. How can I assist you today?";
        let fallbackOptions = ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"];

        if (processed.isGreeting) {
            fallbackContent = "Hello! I am SS40 SKY, your official AI assistant for SS40 NETWORK. We specialize in custom software engineering (Digital Solutions), scalable SS40 Products, and tech academic internships. What would you like to explore today?";
        } else if (processed.isSmallTalk) {
            fallbackContent = "Hello! I am SS40 SKY, the AI assistant for SS40 NETWORK. How can I assist you with our services, products, or academic programs today?";
        } else if (primaryChunk && vectorResult.topScore >= 0.45) {
            fallbackContent = stripEmojisAndSparkles(primaryChunk.summary || primaryChunk.content);
            fallbackOptions = primaryChunk.suggestedOptions || fallbackOptions;
        }

        return {
            answer: fallbackContent,
            replyText: fallbackContent,
            options: sanitizePillOptions(fallbackOptions, primaryChunk, rawUserMessage, processed.isGreeting || processed.isSmallTalk),
            quickReplies: sanitizePillOptions(fallbackOptions, primaryChunk, rawUserMessage, processed.isGreeting || processed.isSmallTalk),
            navigation: primaryChunk?.route ? { label: "Explore Details", url: primaryChunk.route } : { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            link: primaryChunk?.route ? { label: "Explore Details", url: primaryChunk.route } : { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            actionType: "STANDARD",
            source: "emergency-fallback",
        };
    }
}

function determineActionType(chunk?: VectorChunk, query: string = ""): StructuredSkyResponse["actionType"] {
    const q = query.toLowerCase();
    if (/\b(quote|get a quote|callback|call back|request callback|book demo|schedule demo|discuss project|hire|inquiry|consultation|scoping|leave details|my details|contact|contact us|contact details|contact info|phone number)\b/i.test(q)) {
        return "LEAD_CAPTURE";
    }
    if (/\b(phone|call|email|whatsapp|address|reach|talk to human|location|where are you)\b/i.test(q)) {
        return "SUPPORT_CARD";
    }
    if (/\b(three wings|3 wings|all wings|what do you do|services|ecosystem)\b/i.test(q)) {
        return "WINGS_CARD";
    }
    if (chunk?.category === "academics" || chunk?.category === "internships" || chunk?.category === "projects" || /\b(internship|student|placement|dsa)\b/i.test(q)) {
        return "ACADEMIC_CARD";
    }
    return "STANDARD";
}

/**
 * Sanitizes and validates quick-reply pills to guarantee they are 1-tap topic exploration shortcuts
 * and never form-prompting instructions (e.g. rejects "Provide Name", "Share Contact Details").
 */
function sanitizePillOptions(
    rawOptions: any[],
    primaryChunk?: VectorChunk,
    query: string = "",
    isGreetingOrSmallTalk: boolean = false
): string[] {
    const FORBIDDEN_PILL_REGEX = /\b(provide|share|enter|give|send|type)\s+(name|phone|email|contact|number|details|info)\b|\b(provide\s+name|share\s+contact|ask\s+another\s+question)\b/i;

    const q = query.toLowerCase().trim();
    const isGreeting = isGreetingOrSmallTalk || /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|who are you|what do you do|tell me about ss40|about ss40|ss40 network)$/i.test(q);
    const isExplicitProductQuery = /\b(product|products|clearinvoice|invoice|billing|email agent|gtc|saas)\b/i.test(q);

    // On greetings, small talk, or generic company question: guarantee high-level balanced wing pills
    if (isGreeting) {
        return ["Three Wings Overview", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"];
    }

    let filtered = (Array.isArray(rawOptions) ? rawOptions : [])
        .map(o => stripEmojisAndSparkles(String(o || "")).trim())
        .filter(pill => {
            if (!pill || pill.length < 3 || pill.length > 40) return false;
            if (FORBIDDEN_PILL_REGEX.test(pill)) return false;
            return true;
        });

    // If query is not specifically about products or invoicing, remove any stray single-product pills
    if (!isExplicitProductQuery && primaryChunk?.category !== "products") {
        filtered = filtered.filter(pill => !/\b(clearinvoice|invoice|billing|email agent|gtc)\b/i.test(pill));
    }

    if (filtered.length >= 2) {
        return filtered.slice(0, 5);
    }

    // Contextual exploration fallbacks
    if (q.includes("clearinvoice") || q.includes("invoice") || q.includes("billing")) {
        return ["ClearInvoice Live Demo", "ClearInvoice Pricing", "GST Billing Features", "Explore Products"];
    }
    if (isExplicitProductQuery || primaryChunk?.category === "products") {
        return ["ClearInvoice", "SS40 AI Email Agent", "GTC Suite", "Explore Products"];
    }
    if (q.includes("internship") || q.includes("academic") || q.includes("student") || primaryChunk?.category === "academics") {
        return ["Academic Internships", "Student Projects", "DSA Placement Prep", "Three Wings Overview"];
    }
    if (q.includes("doctor") || q.includes("health checkup") || q.includes("consult") || primaryChunk?.id === "doc-business-doctor") {
        return ["Business Health Checkup", "Book Consultation Session", "Explore Digital Solutions", "Contact Team"];
    }
    if (q.includes("client") || q.includes("project") || q.includes("ecommerce") || primaryChunk?.category === "digital-solutions") {
        return ["Web App Development", "Mobile App Sprints", "Client Case Studies", "Three Wings Overview"];
    }

    return ["Three Wings Overview", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"];
}
