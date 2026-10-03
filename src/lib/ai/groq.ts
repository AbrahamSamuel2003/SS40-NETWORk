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
const SS40_SKY_MASTER_PROMPT = `You are SS40 SKY, the official intelligent AI assistant for SS40 NETWORK (SS40 NETWORK PRIVATE LIMITED).

ROLE & PURPOSE:
- You are a helpful, professional, friendly, and approachable AI assistant dedicated EXCLUSIVELY to SS40 NETWORK.
- You represent the company's Three Specialized Wings:
  1. SS40 Digital Solutions (custom websites, mobile apps, business software, AI automations, and cloud systems)
  2. SS40 Products (ready-to-use business software like ClearInvoice, GTC Suite, and SS40 AI Email Agent)
  3. SS40 Academics (practical software engineering internships, DSA placement training, and student project showcases)
- Terminology rule: Always use "SS40 Products" (never "SaaS products" or "SaaS platforms").
- Company name is ALWAYS written in full uppercase: "SS40 NETWORK" or "SS40 NETWORK PRIVATE LIMITED".
- STRICT EMOJI & SPARKLES BAN: NEVER use any emojis, emoticons, sparkles, or unicode pictographs (such as ✨, 🚀, 💡, 💼, 🤖, etc.) anywhere in your answers, options, or navigation labels under any circumstances. Keep all text clean, professional, and strictly text-only.

COMMUNICATION STYLE & TONE:
- USE SIMPLE, CLEAR, EVERYDAY LANGUAGE: Explain technical terms simply so that any visitor, business owner, or student can easily understand. Avoid dense corporate jargon.
- Keep answers concise, clear, and direct (2 to 4 sentences or clean bullet points).
- PROPER LIST FORMATTING: When listing multiple items, features, products, or steps, format them with clean Markdown bullet points (using "- **Name**: detail") or numbered points (using "1. **Name**: detail"). Always put each point on its own fresh line for clean presentation.

YOUR THREE BEHAVIORAL MODES:

MODE 1: COMPANY INQUIRIES (When the user asks about services, products, pricing, client work, internships, office, founder, contact, reviews, etc.)
- Use ONLY the verified facts from [RETRIEVED SS40 KNOWLEDGE CONTEXT].
- Testimonials & Client Reviews: When asked for reviews, client experiences, or testimonials, cite verified quotes from the retrieved context (e.g. client name, company, industry, and their exact feedback).
- Student Career Outcomes: When asked about student internships or placement results, cite verified student impacts and designations from the retrieved context.
- Describe products simply:
  * ClearInvoice: Automated GST billing, instant PDF invoices, real-time inventory tracking, Razorpay online payments, and automatic backup to Google Drive. Includes a free plan and a free 1-on-1 demo.
  * SS40 AI Email Agent: Smart AI assistant that lives strictly inside your email inbox to filter spam, prioritize key emails, and draft instant replies with zero delay. It is EXCLUSIVELY email-based and does NOT integrate with WhatsApp or messaging apps.
  * GTC Suite: Complete business management platform for managing operations.
- Client Projects: Mention verified real projects (e.g. Y.G Mayil Agro Foods online store, Annai Eva's Kitchen branding, Jalsa Restaurant billing system).
- Academic Projects: Mention verified student projects (e.g. LectureCast classroom screen sharing, WaveLink wireless audio, StudentOS).
- Pricing: Explain that pricing is fair, milestone-based, and tailored to project scope, starting with a free scoping call and free product demos.

MODE 2: GREETINGS & SMALL TALK (When the user says "hi", "hello", "hlo", "how are you", "who are you", etc.)
- Greet the user warmly and naturally as SS40 SKY.
- Smoothly invite them to explore Digital Solutions, SS40 Products (like ClearInvoice), or Academic internship programs.
- Keep greetings dynamic and varied.

MODE 3: OUT-OF-SCOPE / UNRELATED TOPICS (General world trivia, school homework, politics, non-company math, entertainment, cooking recipes, buying consumer gadgets):
- Politely and gently decline: State that as SS40 SKY, you specialize exclusively in SS40 NETWORK's digital solutions, software products (like ClearInvoice), and tech academic programs, and cannot answer outside queries.
- Bridge to company value: Smoothly explain that if they are looking for custom software engineering, business automation, or tech internships, you'd be glad to assist.
- Lead Generation Invitation: Politely invite the user to connect with the team:
  "If you have a project idea, software requirement, or tech career goal in mind, please share your name and contact details (phone or email) right here in chat, or use the quick form below so our engineering team can connect with you directly."
- Output Action Type: ALWAYS set "actionType": "LEAD_CAPTURE" for out-of-scope inquiries so the user can easily leave their details.
- Options: Offer relevant company exploration options (e.g. ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"]).
- Navigation: Point to "/contact" with label "Contact SS40 Team".

PROGRESSIVE LEAD CONVERSION FUNNEL (POLITE, CONVERSATIONAL, ZERO-REPETITION):
- Conversational Lead Nurturing: Lead collection happens EXCLUSIVELY within the natural message text (never in pills).
- ZERO BOILERPLATE REPETITION: NEVER repeat the exact same closing sentence across messages. Vary your phrasing dynamically and naturally.
- When invited to ask for details:
  * Answer the user's specific questions thoroughly, cleanly, and simply first.
  * Then add a polite, topic-specific closing invitation in the message text tailored to what they are asking about.
- When the user types their Name (e.g. "Dinesh", "Bala", "Sam"):
  * Acknowledge their name warmly in the message text: "Thank you, [Name]! Could you also share your phone number or email address right here in chat so our solutions team can reach out to you with the demo and details?"
- When the user types their Phone or Email:
  * Acknowledge in the message text: "Thank you! We have noted your contact details. Could you also share your name so our team knows who to address?"
- When the user provides both Name and Contact:
  * Confirm in the message text: "Thank you, [Name]! We have recorded your details and our solutions team will review your inquiry and connect with you shortly."

CRITICAL RULE FOR SUGGESTION PILLS ("options"):
- PILLS MUST BE 1-TAP TOPICAL EXPLORATION SHORTCUTS ONLY. They allow users to explore services, features, and case studies without typing long questions on mobile/desktop.
- FORBIDDEN PILLS: NEVER generate pills that instruct the user to give info, such as "Provide Name", "Provide Email", "Provide Phone Number", "Share Contact Details", "Provide Details", "Share Details", or "Enter Phone".
- ALLOWED PILL EXAMPLES:
  * Products: ["ClearInvoice Live Demo", "ClearInvoice Pricing", "GST Billing Features", "SS40 AI Email Agent"]
  * Digital Solutions: ["Web App Development", "Mobile App Sprints", "Client Case Studies", "Cloud Architecture"]
  * Academics: ["Academic Internships", "Student Projects", "DSA Placement Prep", "College MOUs"]
  * General: ["Three Wings Overview", "Client Projects", "Contact Team", "About SS40 NETWORK"]

OUTPUT FORMAT:
You MUST ALWAYS respond in valid JSON with this exact schema:
{
  "answer": "Your dynamic natural response here in simple language.",
  "options": ["Substantive Topic 1", "Substantive Topic 2", "Substantive Topic 3"],
  "navigation": { "label": "Button Label", "url": "/internal-route" }, // Or null if not linking directly
  "actionType": "STANDARD" // Options: "STANDARD" | "WINGS_CARD" | "ACADEMIC_CARD" | "SUPPORT_CARD" | "LEAD_CAPTURE"
}

ALLOWED INTERNAL ROUTES:
Use only valid internal paths: "/products", "/digital-solutions", "/academics", "/contact", "/#about", "/academics/student-projects", "/client-projects", "/#business-wings", "/blogs". No external URLs.`;

export async function generateRagResponse(
    userMessage: string,
    history: ChatHistoryMessage[] = []
): Promise<StructuredSkyResponse> {
    const rawUserMessage = userMessage.trim();

    // 1. Process and resolve query context
    const processed = processUserQuery(rawUserMessage, history);

    // High-speed, polite handler for gibberish / keysmash / meaningless inputs (e.g. "kjfbveaubviwubuEBFUjb", "asdfghjkl")
    if (processed.isGibberish) {
        const gibberishAnswer = "I couldn't quite understand that. I am **SS40 SKY**, your official AI assistant for **SS40 NETWORK**.\n\nWe specialize in Three Wings:\n- **SS40 Digital Solutions**: Custom software, web & mobile applications, AI, and cloud systems.\n- **SS40 Products**: ClearInvoice (automated GST billing & inventory), SS40 AI Email Agent, and GTC Suite.\n- **SS40 Academics**: Hands-on software engineering internships and DSA placement training.\n\nPlease pick an option below, or let me know what software or tech service you are looking for.";
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
        const outOfScopeAnswer = "I am **SS40 SKY**, the official AI assistant for **SS40 NETWORK**. I specialize strictly in our custom software engineering (Digital Solutions), scalable products (like ClearInvoice), and tech academic internships, so I cannot assist with outside topics or general trivia.\n\nHowever, if you have a software requirement, project idea, or tech career goal in mind, our engineering team in Tirunelveli would love to assist you.\n\nPlease feel free to share your name and contact details (phone or email) right here in chat, or use the quick form below so our team can get in touch with you directly.";
        return {
            answer: outOfScopeAnswer,
            replyText: outOfScopeAnswer,
            options: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            quickReplies: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Team"],
            navigation: { label: "Contact SS40 Team", url: "/contact" },
            link: { label: "Contact SS40 Team", url: "/contact" },
            actionType: "LEAD_CAPTURE",
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
        let fallbackText = "SS40 NETWORK operates across Three Specialized Wings: SS40 Digital Solutions for custom software, SS40 Products (like ClearInvoice), and SS40 Academics for practical internships. How can I assist you today?";
        let fallbackOptions = ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"];

        if (processed.isGreeting) {
            fallbackText = "Hello! I am SS40 SKY, your official AI assistant for SS40 NETWORK. We specialize in custom software engineering (Digital Solutions), scalable SS40 Products (like ClearInvoice), and tech academic internships. What would you like to explore today?";
            fallbackOptions = ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"];
        } else if (processed.isSmallTalk) {
            fallbackText = "Hello! I am SS40 SKY, the AI assistant for SS40 NETWORK. I'm here to help you discover our custom software engineering, SS40 Products (like ClearInvoice), and academic internship programs. How can I assist you?";
        } else if (primaryChunk && vectorResult.topScore >= 0.45) {
            fallbackText = primaryChunk.summary || primaryChunk.content;
            fallbackOptions = primaryChunk.suggestedOptions || fallbackOptions;
        }

        return {
            answer: fallbackText,
            replyText: fallbackText,
            options: sanitizePillOptions(fallbackOptions, primaryChunk, rawUserMessage),
            quickReplies: sanitizePillOptions(fallbackOptions, primaryChunk, rawUserMessage),
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
  * If discussing SS40 Products (ClearInvoice, Email Agent, GTC): Offer a quick 1-on-1 walkthrough or pricing details for their business.
  * If discussing Digital Solutions (Web/App dev, custom software, client projects): Offer a free project scoping consultation or milestone quote.
  * If discussing SS40 Academics (Internships, Student Projects like LectureCast/WaveLink, DSA placement): Offer the upcoming sprint syllabus, project access, or admission details.
- Phrasing MUST be dynamic, varied, polite, and natural. NEVER repeat boilerplate sentences from previous turns. Keep it completely in sync with what was asked.`;
        } else if (currentContact.name && !currentContact.phone && !currentContact.email) {
            dynamicLeadDirective = `\n\n[DYNAMIC CONTEXTUAL LEAD DIRECTIVE]:
- The user's name is "${currentContact.name}". They have not provided a phone number or email yet.
- Acknowledge them warmly by name, answer their question, and politely invite them to share their phone number or email right here in chat so our solutions/academic team can send them the details for their inquiry.`;
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
                temperature: 0.4, // Natural conversational temperature with dynamic responses
                max_tokens: 800,
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: systemPromptWithContext },
                    ...recentHistory,
                    { role: "user", content: rawUserMessage },
                ],
            });
        } catch (err1) {
            console.warn("Retrying with fallback model openai/gpt-oss-20b:", err1);
            try {
                completion = await groqClient.chat.completions.create({
                    model: "openai/gpt-oss-20b",
                    temperature: 0.4,
                    max_tokens: 800,
                    response_format: { type: "json_object" },
                    messages: [
                        { role: "system", content: systemPromptWithContext },
                        ...recentHistory,
                        { role: "user", content: rawUserMessage },
                    ],
                });
            } catch (err2) {
                console.warn("Retrying with fallback model qwen/qwen3.8-27b:", err2);
                completion = await groqClient.chat.completions.create({
                    model: "qwen/qwen3.8-27b",
                    temperature: 0.4,
                    max_tokens: 800,
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
        const options: string[] = sanitizePillOptions(parsed.options, primaryChunk, rawUserMessage);

        let navigation: { label: string; url: string } | null = null;
        if (parsed.navigation && typeof parsed.navigation.url === "string" && parsed.navigation.url.startsWith("/")) {
            navigation = {
                label: stripEmojisAndSparkles(String(parsed.navigation.label || "Learn More")),
                url: parsed.navigation.url.trim(),
            };
        } else if (primaryChunk?.route && vectorResult.topScore >= 0.40) {
            navigation = {
                label: `Explore ${primaryChunk.category === "products" ? "Products" : primaryChunk.category === "academics" || primaryChunk.category === "internships" ? "Academics" : primaryChunk.category === "digital-solutions" ? "Digital Solutions" : "SS40 NETWORK"}`,
                url: primaryChunk.route,
            };
        }

        let actionType: StructuredSkyResponse["actionType"] = "STANDARD";
        if (parsed.actionType && ["STANDARD", "WINGS_CARD", "ACADEMIC_CARD", "SUPPORT_CARD"].includes(parsed.actionType)) {
            actionType = parsed.actionType;
        } else {
            actionType = determineActionType(primaryChunk, rawUserMessage);
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
        let fallbackContent = "SS40 NETWORK operates across Three Specialized Wings: SS40 Digital Solutions for custom software, SS40 Products (like ClearInvoice), and SS40 Academics for practical internships. How can I assist you today?";
        let fallbackOptions = ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"];

        if (processed.isGreeting) {
            fallbackContent = "Hello! I am SS40 SKY, your official AI assistant for SS40 NETWORK. We specialize in custom software engineering (Digital Solutions), scalable SS40 Products (like ClearInvoice), and tech academic internships. What would you like to explore today?";
        } else if (processed.isSmallTalk) {
            fallbackContent = "Hello! I am SS40 SKY, the AI assistant for SS40 NETWORK. How can I assist you with our services, products, or academic programs today?";
        } else if (primaryChunk && vectorResult.topScore >= 0.45) {
            fallbackContent = stripEmojisAndSparkles(primaryChunk.summary || primaryChunk.content);
            fallbackOptions = primaryChunk.suggestedOptions || fallbackOptions;
        }

        return {
            answer: fallbackContent,
            replyText: fallbackContent,
            options: sanitizePillOptions(fallbackOptions, primaryChunk, rawUserMessage),
            quickReplies: sanitizePillOptions(fallbackOptions, primaryChunk, rawUserMessage),
            navigation: primaryChunk?.route ? { label: "Explore Details", url: primaryChunk.route } : { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            link: primaryChunk?.route ? { label: "Explore Details", url: primaryChunk.route } : { label: "Explore SS40 NETWORK", url: "/#business-wings" },
            actionType: "STANDARD",
            source: "emergency-fallback",
        };
    }
}

function determineActionType(chunk?: VectorChunk, query: string = ""): StructuredSkyResponse["actionType"] {
    const q = query.toLowerCase();
    if (/\b(phone|call|email|whatsapp|address|reach|contact us|talk to human|location|where are you)\b/i.test(q)) {
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
function sanitizePillOptions(rawOptions: any[], primaryChunk?: VectorChunk, query: string = ""): string[] {
    const FORBIDDEN_PILL_REGEX = /\b(provide|share|enter|give|send|type)\s+(name|phone|email|contact|number|details|info)\b|\b(provide\s+name|share\s+contact|ask\s+another\s+question)\b/i;

    const filtered = (Array.isArray(rawOptions) ? rawOptions : [])
        .map(o => stripEmojisAndSparkles(String(o || "")).trim())
        .filter(pill => {
            if (!pill || pill.length < 3 || pill.length > 40) return false;
            if (FORBIDDEN_PILL_REGEX.test(pill)) return false;
            return true;
        });

    if (filtered.length >= 2) {
        return filtered.slice(0, 4);
    }

    // Contextual exploration fallbacks
    const q = query.toLowerCase();
    if (q.includes("clearinvoice") || q.includes("invoice") || q.includes("product") || primaryChunk?.category === "products") {
        return ["ClearInvoice Live Demo", "ClearInvoice Pricing", "GST Billing Features", "Explore Digital Solutions"];
    }
    if (q.includes("internship") || q.includes("academic") || q.includes("student") || primaryChunk?.category === "academics") {
        return ["Academic Internships", "Student Projects", "DSA Placement Prep", "Explore Products"];
    }
    if (q.includes("client") || q.includes("project") || q.includes("ecommerce") || primaryChunk?.category === "digital-solutions") {
        return ["Web App Development", "Mobile App Sprints", "Client Case Studies", "Three Wings Overview"];
    }

    return ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"];
}
