import Groq from "groq-sdk";
import { retrieveRelevantChunks, RetrievalResult } from "./rag/retriever";

function getGroqClient(): Groq | null {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
    return new Groq({ apiKey });
}

export interface ChatHistoryMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface RagResponseResult {
    replyText: string;
    actionType: "STANDARD" | "WINGS_CARD" | "ACADEMIC_CARD" | "SUPPORT_CARD" | "LEAD_CAPTURE" | "PROJECT_PREVIEW";
    quickReplies: string[];
    link?: {
        label: string;
        url: string;
    };
    extractedLeadInfo?: {
        phone?: string;
        email?: string;
        name?: string;
        requirement?: string;
    };
    source: "groq-rag" | "retriever-fallback" | "off-topic-guard";
}

const SYSTEM_INSTRUCTIONS = `You are SS40 SKY, the friendly and helpful AI assistant for SS40 NETWORK (ss40network.com).

CRITICAL CONVERSATIONAL GUIDELINES:
1. TALK NATURALLY LIKE A SIMPLE AI CHATBOT:
   - Speak conversationally, warmly, and directly (like ChatGPT or Claude).
   - NEVER use rigid "Key: Value" headers on every line (do NOT write "Three Specialized Wings:", "Founded in 2023:", "Client Promise:", or "SS40 Network Concierge:").
   - Write in simple, fluent paragraphs. Use clean, natural bullet points only when listing features or services.
2. STRICT ZERO EMOJIS: Do not include any emojis in your response.
3. GREETINGS:
   - When a user says "hi", "hlo", "hello", "hey", or similar: Greet them warmly and introduce what you can help with in 2-3 friendly, natural sentences.
4. COMPANY KNOWLEDGE:
   - Three Wings: SS40 Digital Solutions (custom web/mobile apps, AI automation, cloud systems), SS40 Products (SaaS platforms like ClearInvoice for automated GST billing with 99.99% uptime), and SS40 Academics (project-based internships, placement preparation, college MOUs).
   - Office Address: 1st Floor, Municipal Corporation Incubation Centre, Sree Puram, Tirunelveli, Tamil Nadu 627001.
   - Business Hours: Monday to Saturday, 9:00 AM - 7:00 PM IST.
   - Phone Desk: +91 93630 33440 | Email: contact@ss40network.com.
5. OUT-OF-SCOPE INQUIRIES:
   - If a user asks about topics completely unrelated to SS40 Network (movies, cricket, politics, general coding puzzles), reply politely in a friendly, conversational tone:
   "I am SS40 SKY, dedicated to helping you with SS40 Network services, SaaS products, and academic programs. How can I assist you with our offerings today?"
6. FACTUAL & CONCISE: Base your answers on the [RETRIEVED CONTEXT]. Keep responses around 2 to 4 concise sentences or simple clean points.`;

export async function generateRagResponse(
    userMessage: string,
    history: ChatHistoryMessage[] = []
): Promise<RagResponseResult> {
    const retrieval: RetrievalResult = await retrieveRelevantChunks(userMessage);
    const intent = retrieval.intentResult;

    // Handle out-of-scope queries with natural, polite response
    if (intent.primaryIntent === "OUT_OF_SCOPE" && !retrieval.isCompanyRelevant && retrieval.confidenceScore === 0) {
        return {
            replyText: "I am SS40 SKY, dedicated to helping you with SS40 Network services, SaaS products, and academic programs. How can I assist your business or career goals today?",
            actionType: "STANDARD",
            quickReplies: ["Our Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"],
            link: { label: "Explore SS40 Network", url: "/#about" },
            source: "off-topic-guard"
        };
    }

    const groqClient = getGroqClient();

    // Natural fallback when Groq client is not configured
    if (!groqClient) {
        let fallbackText = "Hello! Welcome to SS40 Network. How can I help you today?\n\nWe specialize in custom software engineering (Digital Solutions), scalable SaaS platforms like ClearInvoice, and career-launching academic internships. Feel free to ask any question or select an option below!";
        if (intent.primaryIntent === "THREE_WINGS") {
            fallbackText = "SS40 Network operates across Three Specialized Wings:\n\n- Digital Solutions: Custom web & mobile applications, AI automation, and cloud systems.\n- SaaS Products: Scalable platforms including ClearInvoice for automated billing.\n- Academics: Project-based internships and technical career preparation.";
        } else if (intent.primaryIntent === "PRODUCTS_SAAS") {
            fallbackText = "ClearInvoice is our flagship SaaS product engineered for automated GST billing, invoice generation, inventory tracking, and payment reports with 99.99% uptime.";
        } else if (intent.primaryIntent === "ACADEMICS_PROGRAMS") {
            fallbackText = "SS40 Academics offers project-based internships where students write production code with Git/GitHub, master DSA problem-solving, and prepare for top tech placements.";
        }

        return {
            replyText: fallbackText,
            actionType: intent.actionType,
            quickReplies: retrieval.suggestedQuickReplies.slice(0, 4),
            link: retrieval.suggestedLink,
            extractedLeadInfo: intent.extractedLeadInfo,
            source: "retriever-fallback"
        };
    }

    try {
        const systemPrompt = `${SYSTEM_INSTRUCTIONS}

[RETRIEVED CONTEXT]:
${retrieval.contextText}`;

        const recentHistory = history.slice(-6).map(msg => ({
            role: msg.role === "assistant" ? "assistant" as const : "user" as const,
            content: msg.content
        }));

        let completion;
        try {
            // Primary verified active model on Groq
            completion = await groqClient.chat.completions.create({
                model: "openai/gpt-oss-120b",
                temperature: 0.3,
                max_tokens: 350,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...recentHistory,
                    { role: "user", content: userMessage }
                ]
            });
        } catch (primaryErr) {
            console.warn("Retrying with fallback model qwen/qwen3.8-27b:", primaryErr);
            try {
                completion = await groqClient.chat.completions.create({
                    model: "qwen/qwen3.8-27b",
                    temperature: 0.3,
                    max_tokens: 350,
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...recentHistory,
                        { role: "user", content: userMessage }
                    ]
                });
            } catch (secErr) {
                console.warn("Retrying with fallback model openai/gpt-oss-20b:", secErr);
                completion = await groqClient.chat.completions.create({
                    model: "openai/gpt-oss-20b",
                    temperature: 0.3,
                    max_tokens: 350,
                    messages: [
                        { role: "system", content: systemPrompt },
                        ...recentHistory,
                        { role: "user", content: userMessage }
                    ]
                });
            }
        }

        const rawReply = completion.choices[0]?.message?.content?.trim() || 
            "Hello! Welcome to SS40 Network. How can I help you today?";

        // Strip any accidental emojis and any lingering rigid headers
        const replyText = rawReply
            .replace(/[\u{1F600}-\u{1F6FF}|[\u{1F300}-\u{1F5FF}|[\u{1F680}-\u{1F6FF}|[\u{2600}-\u{26FF}|[\u{2700}-\u{27BF}|[\u{1F900}-\u{1F9FF}|[\u{1F1E0}-\u{1F1FF}]/gu, "")
            .replace(/^SS40 Network Concierge:\s*/i, "");

        return {
            replyText,
            actionType: intent.actionType,
            quickReplies: retrieval.suggestedQuickReplies.length > 0
                ? retrieval.suggestedQuickReplies.slice(0, 4)
                : ["Our Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"],
            link: retrieval.suggestedLink,
            extractedLeadInfo: intent.extractedLeadInfo,
            source: "groq-rag"
        };
    } catch (error) {
        console.error("Groq AI RAG generation error:", error);
        
        let errorFallback = "Hello! Welcome to SS40 Network. How can I help you today?\n\nWe specialize in custom software engineering (Digital Solutions), scalable SaaS platforms like ClearInvoice, and tech academic internships. Feel free to ask any question or select an option below!";
        if (intent.primaryIntent === "THREE_WINGS") {
            errorFallback = "SS40 Network operates across Three Specialized Wings: Digital Solutions (custom software), SaaS Products (ClearInvoice), and Academics (internships & training).";
        } else if (intent.primaryIntent === "PRODUCTS_SAAS") {
            errorFallback = "ClearInvoice is our flagship SaaS product designed for automated GST billing, invoice generation, inventory tracking, and payment reports with 99.99% uptime.";
        }

        return {
            replyText: errorFallback,
            actionType: intent.actionType,
            quickReplies: retrieval.suggestedQuickReplies.slice(0, 4),
            link: retrieval.suggestedLink,
            extractedLeadInfo: intent.extractedLeadInfo,
            source: "retriever-fallback"
        };
    }
}
