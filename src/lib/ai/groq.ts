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
    quickReplies: string[];
    link?: {
        label: string;
        url: string;
    };
    source: "groq-rag" | "retriever-fallback" | "off-topic-guard";
}

const SYSTEM_INSTRUCTIONS = `You are SS40 SKY, the official AI virtual assistant for SS40 NETWORK PRIVATE LIMITED (ss40network.com).

CRITICAL RULES YOU MUST ALWAYS FOLLOW:
1. STRICT WEBSITE-ONLY KNOWLEDGE: You ONLY answer questions directly based on the content of the official website ss40network.com (Our Three Wings: Digital Solutions, Products/ClearInvoice, and Academics; office in Tirunelveli, business hours, contact info, pricing quotes, and demo bookings).
2. SIMPLE & EASY TO UNDERSTAND: Write in simple, clear, and plain English so that any user or student can easily understand immediately.
3. STRICT BULLET FORMAT WITH "-" SYMBOL: Format every answer strictly using "- " bullet points (e.g., "- **Feature/Topic**: Simple clear explanation.").
4. STRICT LENGTH LIMIT: Provide only 2 to 4 concise bullet points maximum. Never write long paragraphs, preambles, or conversational filler.
5. OUT-OF-SCOPE REFUSAL: If the user asks ANY question not about SS40 Network (e.g. general coding tasks, world trivia, math, politics, unrelated advice), you MUST DECLINE in exactly ONE short sentence:
"I am SS40 SKY, dedicated exclusively to SS40 Network company details, services, products, and academics. How can I assist you with our offerings?"
6. NO HALLUCINATIONS: Rely strictly on the [RETRIEVED CONTEXT]. Never invent services, prices, or contact numbers.`;

export async function generateRagResponse(
    userMessage: string,
    history: ChatHistoryMessage[] = []
): Promise<RagResponseResult> {
    const retrieval: RetrievalResult = retrieveRelevantChunks(userMessage);

    // If retriever detected an obvious generic/off-topic query without SS40 keywords
    // and confidence is 0
    if (!retrieval.isCompanyRelevant && retrieval.confidenceScore === 0) {
        // Quick heuristics: check if greetings or small talk
        const lowerMsg = userMessage.toLowerCase().trim();
        const isGreeting = /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|who are you|help|start)\b/i.test(lowerMsg);
        
        if (!isGreeting) {
            return {
                replyText: "I am SS40 SKY, dedicated exclusively to SS40 Network company details, services, products, and academics. How can I assist you with our offerings?",
                quickReplies: ["About SS40", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"],
                link: { label: "Explore SS40 Network", url: "/#about" },
                source: "off-topic-guard"
            };
        }
    }

    const groqClient = getGroqClient();

    // If Groq is not configured, return grounded context directly
    if (!groqClient) {
        return {
            replyText: retrieval.chunks[0]?.content || "Welcome to SS40 NETWORK! We specialize in SS40 Digital Solutions, SS40 Products, and SS40 Academics.",
            quickReplies: retrieval.suggestedQuickReplies,
            link: retrieval.suggestedLink,
            source: "retriever-fallback"
        };
    }

    try {
        const systemPrompt = `${SYSTEM_INSTRUCTIONS}

[RETRIEVED CONTEXT]:
${retrieval.contextText}`;

        // Keep last 4 messages for concise context window
        const recentHistory = history.slice(-4).map(msg => ({
            role: msg.role === "assistant" ? "assistant" as const : "user" as const,
            content: msg.content
        }));

        let completion;
        try {
            completion = await groqClient.chat.completions.create({
                model: "openai/gpt-oss-120b",
                temperature: 0.2,
                max_tokens: 300,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...recentHistory,
                    { role: "user", content: userMessage }
                ]
            });
        } catch (modelErr) {
            console.warn("Retrying with fallback model qwen/qwen3.8-27b:", modelErr);
            completion = await groqClient.chat.completions.create({
                model: "qwen/qwen3.8-27b",
                temperature: 0.2,
                max_tokens: 300,
                messages: [
                    { role: "system", content: systemPrompt },
                    ...recentHistory,
                    { role: "user", content: userMessage }
                ]
            });
        }

        const replyText = completion.choices[0]?.message?.content?.trim() || 
            "SS40 NETWORK operates Three Wings: SS40 Digital Solutions, SS40 Products, and SS40 Academics.";

        return {
            replyText,
            quickReplies: retrieval.suggestedQuickReplies.length > 0
                ? retrieval.suggestedQuickReplies
                : ["About SS40", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"],
            link: retrieval.suggestedLink,
            source: "groq-rag"
        };
    } catch (error) {
        console.error("Groq AI RAG generation error:", error);
        // Fallback to top retrieved chunk content
        return {
            replyText: retrieval.chunks[0]?.content || "SS40 NETWORK is an enterprise technology company providing Digital Solutions, Products, and Academics.",
            quickReplies: retrieval.suggestedQuickReplies,
            link: retrieval.suggestedLink,
            source: "retriever-fallback"
        };
    }
}
