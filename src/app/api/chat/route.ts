import { NextRequest, NextResponse } from "next/server";
import { generateRagResponse, ChatHistoryMessage } from "@/lib/ai/groq";
import { rateLimit } from "@/lib/rate-limiter";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        // 1. IP / Identifier rate limiting (e.g. 40 requests per 10 minutes per IP)
        const forwardedFor = req.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous-client";
        const rateLimitResult = rateLimit(`chat_${ip}`, 40, 10 * 60 * 1000);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    replyText: "You have reached the chat query limit for now. Please wait a few minutes or contact our support team directly.",
                    quickReplies: ["WhatsApp Support", "Email Support", "Visit Contact Page"],
                    link: { label: "Go to Contact Page", url: "/contact" },
                    source: "rate-limit"
                },
                { status: 429 }
            );
        }

        // 2. Parse and validate JSON payload
        const body = await req.json();
        const { message, history } = body as {
            message?: string;
            history?: ChatHistoryMessage[];
        };

        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json(
                { error: "A non-empty message is required." },
                { status: 400 }
            );
        }

        const trimmedMessage = message.trim().slice(0, 500); // Guard max query length

        // 3. Generate RAG response via Groq AI
        const result = await generateRagResponse(trimmedMessage, Array.isArray(history) ? history : []);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error in /api/chat route:", error);
        return NextResponse.json(
            {
                replyText: "SS40 NETWORK operates Three Specialized Wings: Digital Solutions, Products (ClearInvoice), and Academics. For immediate assistance, feel free to reach our support desk.",
                quickReplies: ["Our Three Wings", "SS40 Academics", "Digital Solutions", "Support Team"],
                link: { label: "Contact SS40 Team", url: "/contact" },
                source: "error-fallback"
            },
            { status: 500 }
        );
    }
}
