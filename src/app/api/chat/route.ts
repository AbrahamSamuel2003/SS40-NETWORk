import { NextRequest, NextResponse } from "next/server";
import { generateRagResponse, ChatHistoryMessage } from "@/lib/ai/groq";
import { rateLimit } from "@/lib/rate-limiter";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        // 1. IP rate limiting (40 requests per 10 minutes per IP)
        const forwardedFor = req.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous-client";
        const rateLimitResult = rateLimit(`chat_${ip}`, 40, 10 * 60 * 1000);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    replyText: "You have reached the chat query limit for now. Please wait a few minutes or contact our support team directly.",
                    actionType: "SUPPORT_CARD",
                    quickReplies: ["WhatsApp Support", "Email Support", "Visit Contact Page"],
                    link: { label: "Go to Contact Page", url: "/contact" },
                    source: "rate-limit"
                },
                { status: 429 }
            );
        }

        // 2. Parse and validate JSON payload
        const body = await req.json();

        // Check if this is an inline lead submission from Chatbot
        if (body.action === "submit-lead") {
            const { fullName, phone, email, serviceInterest, message } = body;
            if (!fullName || !phone || !email) {
                return NextResponse.json({ success: false, error: "Missing required contact details" }, { status: 400 });
            }

            try {
                await prisma.lead.create({
                    data: {
                        fullName: String(fullName).trim(),
                        phone: String(phone).trim(),
                        email: String(email).trim().toLowerCase(),
                        serviceInterest: String(serviceInterest || "General Inquiry").trim(),
                        message: String(message || "Inquiry submitted via SS40 SKY AI Assistant").trim(),
                        source: "SS40_SKY_CHATBOT",
                        sourcePage: "/#sky-assistant"
                    }
                });

                return NextResponse.json({
                    success: true,
                    replyText: "- **Inquiry Received**: Thank you! Your details have been securely recorded.\n- **Quick Follow-up**: Our solutions engineering team will connect with you shortly.\n- **Need Instant Support?**: You can also reach our desk directly on WhatsApp.",
                    actionType: "SUPPORT_CARD",
                    quickReplies: ["Explore Three Wings", "Digital Solutions", "SS40 Products", "SS40 Academics"],
                    link: { label: "Visit Contact Page", url: "/contact" },
                    source: "lead-submission"
                }, { status: 201 });
            } catch (dbErr) {
                console.error("Error saving lead from chat:", dbErr);
                return NextResponse.json({
                    replyText: "- **Thank You**: We have noted your request.\n- **Direct Desk**: Please feel free to reach us on WhatsApp or visit our contact page.",
                    actionType: "SUPPORT_CARD",
                    quickReplies: ["WhatsApp Support", "Email Support"],
                    link: { label: "Go to Contact Page", url: "/contact" }
                });
            }
        }

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

        // 3. Generate RAG response via Groq AI & Dynamic Knowledge
        const result = await generateRagResponse(trimmedMessage, Array.isArray(history) ? history : []);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error in /api/chat route:", error);
        return NextResponse.json(
            {
                replyText: "- **SS40 NETWORK**: We operate across Three Specialized Wings — Digital Solutions, Products (ClearInvoice), and Academics.\n- **Support Desk**: Our team in Tirunelveli is ready to assist you.",
                actionType: "STANDARD",
                quickReplies: ["Our Three Wings", "SS40 Academics", "Digital Solutions", "Support Team"],
                link: { label: "Contact SS40 Team", url: "/contact" },
                source: "error-fallback"
            },
            { status: 500 }
        );
    }
}
