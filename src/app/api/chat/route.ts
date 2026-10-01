import { NextRequest, NextResponse } from "next/server";
import { generateRagResponse, ChatHistoryMessage } from "@/lib/ai/groq";
import { rateLimit } from "@/lib/rate-limiter";
import { prisma } from "@/lib/prisma";
import { extractContactDetails, inferServiceInterest } from "@/lib/ai/rag/query-processor";
import { sendAdminNewLeadNotificationEmail } from "@/lib/mail";

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
                    answer: "You have reached the chat query limit for now. Please wait a few minutes or contact our support team directly.",
                    replyText: "You have reached the chat query limit for now. Please wait a few minutes or contact our support team directly.",
                    options: ["WhatsApp Support", "Email Support", "Visit Contact Page"],
                    quickReplies: ["WhatsApp Support", "Email Support", "Visit Contact Page"],
                    navigation: { label: "Go to Contact Page", url: "/contact" },
                    link: { label: "Go to Contact Page", url: "/contact" },
                    actionType: "SUPPORT_CARD",
                    source: "rate-limit"
                },
                { status: 429 }
            );
        }

        // 2. Parse and validate JSON payload
        const body = await req.json();

        // Check if this is an explicit lead submission from Chatbot form
        if (body.action === "submit-lead") {
            const { fullName, phone, email, serviceInterest, message } = body;
            if (!fullName || !phone || !email) {
                return NextResponse.json({ success: false, error: "Missing required contact details" }, { status: 400 });
            }

            try {
                const createdLead = await prisma.lead.create({
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

                sendAdminNewLeadNotificationEmail({
                    fullName: createdLead.fullName,
                    phone: createdLead.phone,
                    email: createdLead.email,
                    serviceInterest: createdLead.serviceInterest,
                    message: createdLead.message,
                    source: "SS40_SKY_CHATBOT",
                    sourcePage: "/#sky-assistant",
                    submittedAt: createdLead.createdAt,
                }).catch(e => console.error("Admin chat lead notification email failed:", e));

                const confirmationText = "- **Inquiry Received**: Thank you! Your details have been securely recorded.\n- **Quick Follow-up**: Our solutions engineering team will connect with you shortly.\n- **Instant Support**: You can also reach our desk directly on WhatsApp.";

                return NextResponse.json({
                    success: true,
                    answer: confirmationText,
                    replyText: confirmationText,
                    options: ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"],
                    quickReplies: ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"],
                    navigation: { label: "Visit Contact Page", url: "/contact" },
                    link: { label: "Visit Contact Page", url: "/contact" },
                    actionType: "SUPPORT_CARD",
                    leadRecorded: true,
                    source: "lead-submission"
                }, { status: 201 });
            } catch (dbErr) {
                console.error("Error saving lead from chat:", dbErr);
                return NextResponse.json({
                    answer: "We have noted your request. Please feel free to reach our team on WhatsApp or visit our contact page.",
                    replyText: "We have noted your request. Please feel free to reach our team on WhatsApp or visit our contact page.",
                    options: ["WhatsApp Support", "Email Support"],
                    quickReplies: ["WhatsApp Support", "Email Support"],
                    navigation: { label: "Go to Contact Page", url: "/contact" },
                    link: { label: "Go to Contact Page", url: "/contact" },
                    actionType: "SUPPORT_CARD"
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

        const trimmedMessage = message.trim().slice(0, 500);
        const historyArr = Array.isArray(history) ? history : [];

        // 3. Zero-loss Lead Detection: Auto-extract any provided contact info (Name, Phone, Email, Company)
        const extractedContact = extractContactDetails(trimmedMessage, historyArr);
        let autoLeadSaved = false;

        if (extractedContact.hasAnyContactInfo) {
            try {
                const service = inferServiceInterest(trimmedMessage, historyArr);
                const leadName = extractedContact.name && extractedContact.name.trim().length > 0
                    ? extractedContact.name.trim()
                    : "Chat Visitor";

                // Check if a recent chat lead from the same email, phone, or name exists to update
                let existingLead = null;
                if (extractedContact.email) {
                    existingLead = await prisma.lead.findFirst({
                        where: { email: extractedContact.email, source: "SS40_SKY_CHATBOT" },
                        orderBy: { createdAt: "desc" }
                    });
                }
                if (!existingLead && extractedContact.phone) {
                    existingLead = await prisma.lead.findFirst({
                        where: { phone: extractedContact.phone, source: "SS40_SKY_CHATBOT" },
                        orderBy: { createdAt: "desc" }
                    });
                }
                if (!existingLead && extractedContact.name && extractedContact.name !== "Chat Visitor") {
                    existingLead = await prisma.lead.findFirst({
                        where: {
                            fullName: extractedContact.name,
                            source: "SS40_SKY_CHATBOT",
                            createdAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) }
                        },
                        orderBy: { createdAt: "desc" }
                    });
                }

                if (existingLead) {
                    await prisma.lead.update({
                        where: { id: existingLead.id },
                        data: {
                            fullName: leadName !== "Chat Visitor" ? leadName : existingLead.fullName,
                            email: extractedContact.email || existingLead.email,
                            phone: extractedContact.phone || existingLead.phone,
                            company: extractedContact.company || existingLead.company,
                            serviceInterest: service,
                            message: extractedContact.synthesizedBrief,
                            updatedAt: new Date(),
                        }
                    });
                } else {
                    await prisma.lead.create({
                        data: {
                            fullName: leadName,
                            phone: extractedContact.phone || "Not provided",
                            email: extractedContact.email || "Not provided",
                            company: extractedContact.company || null,
                            serviceInterest: service,
                            message: extractedContact.synthesizedBrief,
                            source: "SS40_SKY_CHATBOT",
                            sourcePage: "/#sky-assistant",
                            status: "NEW"
                        }
                    });
                }
                autoLeadSaved = true;

                // Send instant Admin Email Notification if at least phone or email is present
                if (extractedContact.phone || extractedContact.email || leadName !== "Chat Visitor") {
                    sendAdminNewLeadNotificationEmail({
                        fullName: leadName !== "Chat Visitor" ? leadName : (existingLead?.fullName || "Chat Visitor"),
                        phone: extractedContact.phone || existingLead?.phone || null,
                        email: extractedContact.email || existingLead?.email || null,
                        company: extractedContact.company || existingLead?.company || null,
                        serviceInterest: service,
                        message: extractedContact.synthesizedBrief,
                        source: "SS40_SKY_CHATBOT",
                        sourcePage: "/#sky-assistant",
                        submittedAt: new Date(),
                    }).catch(e => console.error("Admin conversational lead email notification failed:", e));
                }
            } catch (err) {
                console.warn("Could not auto-save conversational lead to database:", err);
            }
        }

        // 4. Generate Structured Vector RAG response via Groq AI
        const result = await generateRagResponse(trimmedMessage, historyArr);

        return NextResponse.json({
            ...result,
            replyText: result.answer,
            quickReplies: result.options,
            link: result.navigation,
            leadRecorded: autoLeadSaved,
            extractedLeadInfo: extractedContact.hasAnyContactInfo ? extractedContact : undefined,
        }, { status: 200 });
    } catch (error) {
        console.error("Error in /api/chat route:", error);
        return NextResponse.json(
            {
                answer: "SS40 NETWORK operates across Three Specialized Wings: SS40 Digital Solutions, SS40 Products (ClearInvoice), and SS40 Academics. Our team in Tirunelveli is ready to assist you.",
                replyText: "SS40 NETWORK operates across Three Specialized Wings: SS40 Digital Solutions, SS40 Products (ClearInvoice), and SS40 Academics. Our team in Tirunelveli is ready to assist you.",
                options: ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"],
                quickReplies: ["Three Wings", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics"],
                navigation: { label: "Contact SS40 Team", url: "/contact" },
                link: { label: "Contact SS40 Team", url: "/contact" },
                actionType: "STANDARD",
                source: "error-fallback"
            },
            { status: 500 }
        );
    }
}
