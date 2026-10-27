import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
    const ANAM_API_KEY = process.env.ANAM_API_KEY;
    const ANAM_PERSONA_ID = process.env.ANAM_PERSONA_ID;

    // 1. If API key is not configured, signal frontend that avatar is unavailable
    if (!ANAM_API_KEY) {
        return NextResponse.json(
            {
                success: false,
                available: false,
                error: "ANAM_API_KEY is not configured",
                code: "NOT_CONFIGURED"
            },
            { status: 200 }
        );
    }

    try {
        const ss40SystemPrompt = `You are Siva, Founder and CEO of SS40 NETWORK PRIVATE LIMITED, Tirunelveli, Tamil Nadu, India.
Corporate motto: 'A Little Bit More'.

OFFICIAL SS40 RAG KNOWLEDGE BASE:
1. SS40 DIGITAL SOLUTIONS: Custom web apps (Next.js, React), high-performance mobile apps, enterprise cloud architecture, and custom AI automations. Real client work includes Y.G Mayil Agro Foods, Annai Eva's Kitchen, and Jalsa Restaurant.
2. SS40 PRODUCTS: Ready-to-use business software.
   - ClearInvoice: Automated GST billing, instant PDF receipts, real-time inventory tracking, Razorpay online payments, and automatic Google Drive backup.
   - SS40 AI Email Agent: Inbox-only AI that prioritizes client emails, filters spam, and drafts instant professional replies.
   - GTC Suite: Enterprise operations and workflow management platform.
3. SS40 ACADEMICS: Career acceleration and hands-on software engineering internships for students, featuring DSA placement preparation and live student projects like LectureCast and WaveLink.
4. HEADQUARTERS & CONTACT:
   - Incubation Centre, Municipal Corporation Building, Sree Puram, Tirunelveli, Tamil Nadu 627001.
   - Phone: +91 83005 91750 | Email: support@ss40network.com.
   - Pricing: Milestone-based, fair pricing starting with a free scoping call and free demos.

STRICT SPEAKING RULES (ABSOLUTE CREDIT CONTROL):
- MAXIMUM 1 TO 2 CONCISE VERBAL SENTENCES (UNDER 20 WORDS TOTAL).
- NEVER speak paragraphs, bullet points, or filler like "I'd be glad to help with that". Jump straight to the factual answer.
- If asked about wings, state: "We operate across Digital Solutions, Products including ClearInvoice, and Academics."

FEW-SHOT EXAMPLES (FOLLOW THIS EXACT CRISPNESS):
- "What is ClearInvoice?" -> "ClearInvoice is our automated GST billing software with inventory tracking, Razorpay payments, and Google Drive backup."
- "What do you do in Academics?" -> "SS40 Academics provides practical engineering internships with real client projects and placement training in Tirunelveli."
- "Tell me about Digital Solutions" -> "We engineer custom web apps, mobile solutions, and enterprise AI automations tailored for businesses."
- "What is your pricing?" -> "Our pricing is transparent and milestone-based, starting with a free scoping call and demo."
- "How do I reach you?" -> "You can call us directly at +91 83005 91750 or email support@ss40network.com."`;

        // 2. Resolve Persona Configuration
        // Locks CEO Siva's visual avatar with the flagship fast LLM and official SS40 Knowledge Base
        let personaConfig = {
            name: "Siva - CEO of SS40 Network",
            avatarId: process.env.ANAM_AVATAR_ID || "7d10dac3-9589-47be-adcd-587aa8c1be2d",
            avatarModel: "cara-4.1-express",
            voiceId: process.env.ANAM_VOICE_ID || "8246d9f7-827e-4a5c-8697-644ce860ca02",
            llmId: process.env.ANAM_LLM_ID || "a7cf662c-2ace-4de1-a21e-ef0fbf144bb7",
            systemPrompt: ss40SystemPrompt
        };

        if (ANAM_PERSONA_ID) {
            try {
                const personaRes = await fetch(`https://api.anam.ai/v1/personas/${ANAM_PERSONA_ID}`, {
                    headers: { Authorization: `Bearer ${ANAM_API_KEY}` }
                });
                if (personaRes.ok) {
                    const personaData = await personaRes.json();
                    const avatar = personaData.publishedCall?.avatar || personaData.avatar;
                    const voice = personaData.publishedCall?.voice || personaData.voice;
                    if (avatar?.id) personaConfig.avatarId = avatar.id;
                    if (voice?.id) personaConfig.voiceId = voice.id;
                    if (personaData.publishedCall?.avatarModel) personaConfig.avatarModel = personaData.publishedCall.avatarModel;
                    // Retain full SS40 knowledge prompt and fast LLM to ensure crisp, accurate intelligence
                }
            } catch (err) {
                console.warn("[Anam API] Could not pre-fetch persona, using verified default personaConfig:", err);
            }
        }

        const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ANAM_API_KEY}`
            },
            body: JSON.stringify({ personaConfig })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.warn(`[Anam API] Session request failed with status ${response.status}:`, errText);

            // Determine if credit depletion or payment error
            const isCreditExhausted =
                response.status === 402 ||
                response.status === 429 ||
                errText.toLowerCase().includes("credit") ||
                errText.toLowerCase().includes("quota") ||
                errText.toLowerCase().includes("limit");

            return NextResponse.json(
                {
                    success: false,
                    available: false,
                    error: isCreditExhausted ? "Credits exhausted" : "Failed to acquire session token",
                    code: isCreditExhausted ? "CREDITS_EXHAUSTED" : "SESSION_FAILED"
                },
                { status: 200 }
            );
        }

        const data = await response.json();

        if (!data.sessionToken) {
            return NextResponse.json(
                {
                    success: false,
                    available: false,
                    error: "No session token returned",
                    code: "INVALID_RESPONSE"
                },
                { status: 200 }
            );
        }

        return NextResponse.json({
            success: true,
            available: true,
            sessionToken: data.sessionToken
        });
    } catch (error) {
        console.error("[Anam API] Session initialization error:", error);
        return NextResponse.json(
            {
                success: false,
                available: false,
                error: "Network error connecting to Anam video cluster",
                code: "NETWORK_ERROR"
            },
            { status: 200 }
        );
    }
}
