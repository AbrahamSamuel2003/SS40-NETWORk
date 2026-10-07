import { ChatHistoryMessage } from "../groq";

export interface ProcessedQuery {
    rawQuery: string;
    normalizedQuery: string;
    isGreeting: boolean;
    isSmallTalk: boolean;
    isGibberish: boolean;
    isOutOfScope: boolean;
    outOfScopeReason?: string;
    contextResolvedQuery: string;
}

/**
 * Detects whether an input is keyboard smash, nonsense characters, or meaningless text.
 * e.g. "kjfbveaubviwubuEBFUjb", "asdfghjkl", "zzzzzzzz", "???!!!!"
 */
export function isGibberishOrMeaningless(rawText: string): boolean {
    const text = rawText.trim();
    if (!text) return true;

    // 1. Single character or pure punctuation/symbols
    const alphanumericOnly = text.replace(/[^a-zA-Z0-9]/g, "");
    if (alphanumericOnly.length < 2 && text.length > 0) return true;
    if (alphanumericOnly.length === 0) return true;

    // 2. High symbol ratio (more than 60% symbols)
    if (alphanumericOnly.length / text.length < 0.4 && text.length >= 4) return true;

    // 3. Repeated single character 3+ times (e.g. "aaa", "zzzz", "1111")
    if (/(.)\1{2,}/.test(text.toLowerCase())) return true;

    // 4. Common keyboard smash patterns
    const smashPatterns = [
        "asdf", "sdfg", "dfgh", "fghj", "ghjk", "hjkl",
        "qwerty", "werty", "ertyu", "rtyui", "tyuio", "yuiop",
        "zxcv", "xcvb", "cvbn", "vbnm",
        "qazwsx", "wsxedc"
    ];
    const lower = text.toLowerCase();
    for (const pat of smashPatterns) {
        if (lower.includes(pat) && alphanumericOnly.length <= 15) return true;
    }

    // 5. Unpronounceable consonant bigrams/trigrams impossible in English and Indian languages:
    // e.g. "kj", "kf", "fv", "vkj", "zx", "qj", "xj", "vj", "bx", "dx", "fx", "gx", "hx", "jx", "wx"
    const unpronounceableClusters = /\b(kj|kf|fv|vk|zx|qj|xj|vj|bx|dx|fx|gx|hx|jx|wx|zq|qg|qk|qf|qm|qn|vf|vg|vh|vj|vk|vl|vm|vn|vp|vq|vr|vs|vt|vw|vx|vy|vz)/i;
    const internalNonsense = /(kjf|fvk|vkj|zxq|qzx|bdf|fgj|gjk|jkl|klm|lmn|xcv|cvb|vbn|bnm)/i;

    // 6. Check individual tokens for consonant clusters or unpronounceable patterns
    const tokens = text.split(/\s+/).map(t => t.replace(/[^a-zA-Z]/g, ""));
    for (const token of tokens) {
        if (token.length >= 4) {
            if (unpronounceableClusters.test(token)) return true;
            if (internalNonsense.test(token)) return true;

            // 5+ consecutive consonants without vowel
            if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(token)) return true;
        }

        // Random casing keysmashing in a single word (e.g. "wubuEBFUjb")
        if (token.length >= 6 && /[a-z]+[A-Z]{2,}[a-z]+/.test(token)) return true;
    }

    return false;
}

const STOP_WORDS_AND_VERBS = new Set([
    "what", "is", "that", "this", "it", "dont", "do", "does", "did", "use", "using", "miss", "missuse",
    "thank", "thanks", "thankyou", "u", "you", "your", "ok", "okay", "okk", "okie", "done", "cool", "how", "why", "where", "when", "which",
    "who", "can", "could", "will", "would", "shall", "should", "tell", "show", "give", "share", "need",
    "want", "have", "has", "had", "are", "am", "was", "were", "be", "been", "being", "help", "more",
    "details", "info", "sure", "fine", "good", "great", "nice", "got", "know", "call", "send", "chat",
    "talk", "team", "support", "about", "product", "products", "solution", "solutions", "academic",
    "academics", "service", "services", "ecommerce", "website", "app", "mobile", "web", "consultation",
    "quote", "demo", "pricing", "price", "cost", "hi", "hello", "hlo", "hloo", "hey", "start", "greetings",
    "gud", "mrng", "morning", "afternoon", "evening", "night",
    "yes", "no", "clearinvoice", "invoice", "billing", "gtc", "internship", "internships", "intern",
    "student", "placement", "founder", "ceo", "location", "address", "tirunelveli", "office", "contact",
    "mayil", "annai", "jalsa", "lecturecast", "wavelink", "studentos", "mou", "mous", "wings", "our",
    "email", "mail", "agent", "ai", "bot", "overview", "feature", "features", "live", "system", "software",
    "tech", "technology", "network", "code", "project", "projects", "case", "study", "dsa", "lead", "client", "user"
]);

export function isLegitimateHumanName(text: string): boolean {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 35) return false;
    if (/\d/.test(trimmed) || trimmed.includes("@") || /[!?,;:]/.test(trimmed)) return false;

    // Reject keysmash / gibberish immediately
    if (isGibberishOrMeaningless(trimmed)) return false;

    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length < 1 || words.length > 3) return false;

    // A real person's name will NOT contain conversational verbs, pronouns, or question words
    for (const word of words) {
        if (STOP_WORDS_AND_VERBS.has(word) || word.length < 2) {
            return false;
        }
    }

    return /^[A-Za-z\s]+$/.test(trimmed);
}

/**
 * Checks if a query is completely out-of-scope for the SS40 NETWORK company assistant.
 * (e.g. math calculations, generic coding exercises, non-company trivia, buying appliances, creative writing)
 */
export function detectOutOfScope(normalizedQuery: string): { isOutOfScope: boolean; reason?: string } {
    const trimmed = normalizedQuery.trim();

    // 0. Pleasantries & standard conversational words should NEVER be out-of-scope
    if (/^(ok|okay|okk|okie|thanks|thank you|thank u|sure|cool|fine|great|yes|no|got it|understood|noted)$/i.test(trimmed)) {
        return { isOutOfScope: false };
    }

    // 0. A valid human name should NEVER be treated as out-of-scope trivia
    if (isLegitimateHumanName(trimmed)) {
        return { isOutOfScope: false };
    }

    // 1. Math calculations & equations (e.g. "1+2", "7+4", "5 * 10", "sqrt(16)", "solve 2x+5=15")
    if (/^\d+\s*[\+\-\*\/\^%]\s*\d+/.test(trimmed) || /^(calculate|what is|solve)\s+\d+\s*[\+\-\*\/]/i.test(trimmed) || /\bsolve\s+[0-9a-z\+\-\*\/\=\s]+/i.test(trimmed)) {
        return { isOutOfScope: true, reason: "math_calculation" };
    }

    // 2. Generic coding / programming problem solving (e.g. "python program for factorial", "write code for binary search")
    if (/\b(python program for|write a program for|write code for|factorial of|fibonacci|bubble sort|leetcode|solve in c\+\+|java code for)\b/i.test(trimmed)) {
        return { isOutOfScope: true, reason: "generic_coding_request" };
    }

    // 3. Creative writing & jokes (e.g. "write a poem", "tell a joke", "tell a story")
    if (/\b(write (a|me a) (poem|story|song|essay|joke)|tell (me a|a) (joke|story)|make me laugh)\b/i.test(trimmed)) {
        return { isOutOfScope: true, reason: "creative_entertainment" };
    }

    // 4. World trivia, politics, sports, geography, astronomy
    if (/\b(who is the (president|prime minister|governor|king|queen|ceo of google|ceo of apple)|capital of|population of|currency of|who won the (match|cup|world cup|ipl|election)|weather in|temperature in|photosynthesis|solar system|speed of light)\b/i.test(trimmed)) {
        return { isOutOfScope: true, reason: "general_world_trivia" };
    }

    // 5. Unrelated consumer shopping / general advice (e.g. "which ac i can buy for 30000", "recipe for pizza", "best phone under 20000")
    if (/\b(buy\s+(ac|air\s*conditioner|phone|car|bike|laptop|tv)|recipe for|cook|movie recommendation|which car to buy|how to cook)\b/i.test(trimmed)) {
        return { isOutOfScope: true, reason: "general_consumer_trivia" };
    }

    // 6. Random single-word non-company dictionary terms (e.g. "mouse", "keyboard", "dog", "cat", "script", "what is script")
    const words = trimmed.split(/\s+/);
    const isKnownCompanyWord = /\b(hi|hello|hlo|hey|clearinvoice|internship|internships|intern|services|service|wings|pricing|price|contact|support|phone|email|mail|whatsapp|products|product|academics|academic|about|office|founder|ceo|sivasubramanian|clients|client|projects|project|jobs|careers|quote|demo|lecturecast|wavelink|studentos|mayil|annai|jalsa|mou|mous|blogs|dsa|placement|placements|sprint|sprints|tirunelveli)\b/i.test(trimmed);
    
    if (words.length === 1 && !isKnownCompanyWord && !isLegitimateHumanName(trimmed)) {
        return { isOutOfScope: true, reason: "isolated_non_company_noun" };
    }

    if (/^(what is|explain)\s+(script|mouse|keyboard|cpu|ram|cloud computing|internet|biology|chemistry)$/i.test(trimmed)) {
        return { isOutOfScope: true, reason: "generic_definition_request" };
    }

    return { isOutOfScope: false };
}

/**
 * Analyzes and prepares the user message for RAG processing.
 */
export function processUserQuery(
    message: string,
    history: ChatHistoryMessage[] = []
): ProcessedQuery {
    const rawQuery = message.trim();
    const normalizedQuery = normalizeQuery(rawQuery);
    const tokenCount = normalizedQuery.split(/\s+/).length;

    // Gibberish & meaningless input detection
    const isGibberish = isGibberishOrMeaningless(rawQuery);

    // Greeting detection
    const isGreeting = !isGibberish && /^(h+i+|h+e+l+l*o+|h+l+o+|h+e+y+|greetings|namaste|vanakkam|start|howdy|hey there|hi there)\b/i.test(normalizedQuery) &&
        tokenCount <= 3;

    // Friendly small talk detection
    const isSmallTalk = !isGibberish && /^(how\s*(r|are)\s*u|how\s*are\s*you|who\s*are\s*you|what\s*is\s*your\s*name|what\s*can\s*you\s*do|tell\s*me\s*about\s*yourself)\b/i.test(normalizedQuery);

    // Check if user is introducing themselves with a valid human name
    const isHumanName = isLegitimateHumanName(rawQuery);

    // Out of scope detection
    const { isOutOfScope, reason: outOfScopeReason } = (!isGibberish && !isHumanName)
        ? detectOutOfScope(normalizedQuery)
        : { isOutOfScope: false };

    const contextResolvedQuery = resolveConversationContext(rawQuery, history);

    return {
        rawQuery,
        normalizedQuery,
        isGreeting,
        isSmallTalk,
        isGibberish,
        isOutOfScope,
        outOfScopeReason,
        contextResolvedQuery,
    };
}

const COMMON_TYPOS: Record<string, string> = {
    "clerinvoice": "clearinvoice",
    "clrinvoice": "clearinvoice",
    "clear invoice": "clearinvoice",
    "invois": "invoice",
    "intership": "internship",
    "intrenship": "internship",
    "inturnship": "internship",
    "interships": "internships",
    "s40": "ss40",
    "ss 40": "ss40",
    "ss40net": "ss40 network",
    "sivasubramaniam": "sivasubramanian",
    "tirunelvely": "tirunelveli",
    "nellai": "tirunelveli",
    "palayamkottai": "tirunelveli",
    "whats app": "whatsapp",
    "whatsap": "whatsapp",
    "watsapp": "whatsapp",
    "locaton": "location",
    "addres": "address",
    "servises": "services",
    "solutons": "solutions",
    "digitalsolution": "digital solutions",
    "digitalsolutions": "digital solutions",
    "clientw": "clients",
    "lecturcast": "lecturecast",
    "lecture cast": "lecturecast",
    "wavelink": "wavelink",
    "wave link": "wavelink",
    "student os": "studentos",
    "mayil foods": "mayil agro foods",
    "annai evas": "annai eva kitchen",
    "jalsa rest": "jalsa restaurant"
};

const SHORT_QUERY_EXPANSIONS: Record<string, string> = {
    "client": "SS40 client projects case studies Mayil Agro Foods Annai Eva Jalsa Restaurant",
    "clients": "SS40 client projects case studies Mayil Agro Foods Annai Eva Jalsa Restaurant",
    "customer": "SS40 client projects case studies Mayil Agro Foods Annai Eva Jalsa Restaurant",
    "customers": "SS40 client projects case studies Mayil Agro Foods Annai Eva Jalsa Restaurant",
    "case study": "SS40 client projects case studies Mayil Agro Foods Annai Eva Jalsa Restaurant",
    "case studies": "SS40 client projects case studies Mayil Agro Foods Annai Eva Jalsa Restaurant",
    "student project": "SS40 Academics student projects LectureCast WaveLink StudentOS showcase",
    "student projects": "SS40 Academics student projects LectureCast WaveLink StudentOS showcase",
    "capstone": "SS40 Academics student projects LectureCast WaveLink StudentOS showcase",
    "capstones": "SS40 Academics student projects LectureCast WaveLink StudentOS showcase",
    "lecturecast": "LectureCast classroom screen sharing over college wifi SS40 Academics student project",
    "wavelink": "WaveLink smartphone wireless microphone SS40 Academics student project",
    "studentos": "StudentOS student management system web platform SS40 Academics student project",
    "mayil": "Y.G Mayil Agro Foods D2C ecommerce platform SS40 client project",
    "mayil agro": "Y.G Mayil Agro Foods D2C ecommerce platform SS40 client project",
    "mayil agro foods": "Y.G Mayil Agro Foods D2C ecommerce platform SS40 client project",
    "yg": "Y.G Mayil Agro Foods D2C ecommerce platform SS40 client project",
    "annai": "Annai Eva's Kitchen restaurant branding and logo SS40 client project",
    "annai eva": "Annai Eva's Kitchen restaurant branding and logo SS40 client project",
    "annai eva's kitchen": "Annai Eva's Kitchen restaurant branding and logo SS40 client project",
    "jalsa": "Jalsa Restaurant Hosur restaurant billing and management system SS40 client project",
    "jalsa restaurant": "Jalsa Restaurant Hosur restaurant billing and management system SS40 client project",
    "product": "SS40 Products ClearInvoice SS40 AI Email Agent GTC Suite",
    "products": "SS40 Products ClearInvoice SS40 AI Email Agent GTC Suite",
    "clearinvoice": "ClearInvoice automated GST billing invoice inventory tracking Razorpay Google Drive sync",
    "clear invoice": "ClearInvoice automated GST billing invoice inventory tracking Razorpay Google Drive sync",
    "email agent": "SS40 AI Email Agent zero latency inbox automation",
    "ai email agent": "SS40 AI Email Agent zero latency inbox automation",
    "gtc": "GTC Suite enterprise scale operations and business management platform",
    "gtc suite": "GTC Suite enterprise scale operations and business management platform",
    "wings": "Three Wings SS40 Digital Solutions SS40 Products SS40 Academics",
    "three wings": "Three Wings SS40 Digital Solutions SS40 Products SS40 Academics",
    "3 wings": "Three Wings SS40 Digital Solutions SS40 Products SS40 Academics",
    "solutions": "SS40 Digital Solutions custom web mobile software development AI cloud",
    "digital solutions": "SS40 Digital Solutions custom web mobile software development AI cloud",
    "service": "SS40 Digital Solutions custom web mobile software development AI cloud",
    "services": "SS40 Digital Solutions custom web mobile software development AI cloud",
    "internship": "SS40 Academics practical software engineering internships live project sprints",
    "internships": "SS40 Academics practical software engineering internships live project sprints",
    "intern": "SS40 Academics practical software engineering internships live project sprints",
    "academics": "SS40 Academics practical software engineering internships DSA placement prep student projects",
    "academic": "SS40 Academics practical software engineering internships DSA placement prep student projects",
    "placement": "SS40 Career Launch Pad DSA coding interview mock interviews placement referrals",
    "placements": "SS40 Career Launch Pad DSA coding interview mock interviews placement referrals",
    "training": "SS40 Academics practical software engineering internships live project sprints",
    "location": "SS40 NETWORK office location Municipal Corporation Incubation Centre Sree Puram Tirunelveli",
    "address": "SS40 NETWORK office location Municipal Corporation Incubation Centre Sree Puram Tirunelveli",
    "office": "SS40 NETWORK office location Municipal Corporation Incubation Centre Sree Puram Tirunelveli",
    "contact": "SS40 NETWORK official contact support email phone whatsapp desk",
    "support": "SS40 NETWORK official contact support email phone whatsapp desk",
    "phone": "SS40 NETWORK official contact phone +91 8300591750",
    "email": "SS40 NETWORK official contact email support@ss40network.com",
    "whatsapp": "SS40 NETWORK official WhatsApp support widget",
    "founder": "SS40 NETWORK founder CEO M. Sivasubramanian founded 2023",
    "ceo": "SS40 NETWORK founder CEO M. Sivasubramanian",
    "sivasubramanian": "SS40 NETWORK founder CEO M. Sivasubramanian",
    "about": "About SS40 NETWORK PRIVATE LIMITED vision mission 2023 Tirunelveli",
    "price": "SS40 NETWORK pricing project quote milestone scoping consultation",
    "pricing": "SS40 NETWORK pricing project quote milestone scoping consultation",
    "quote": "SS40 NETWORK project quote milestone scoping consultation",
    "demo": "SS40 Products book a live walkthrough demo ClearInvoice",
    "mou": "SS40 Academics university college MOUs technical workshops innovation labs",
    "mous": "SS40 Academics university college MOUs technical workshops innovation labs",
    "blogs": "SS40 NETWORK blogs announcements field updates conclaves founder initiatives"
};

/**
 * Normalizes text, corrects common domain typos, and standardizes punctuation.
 */
export function normalizeQuery(query: string): string {
    let text = query.trim().toLowerCase();

    // Replace common domain typos
    for (const [typo, replacement] of Object.entries(COMMON_TYPOS)) {
        const regex = new RegExp(`\\b${typo}\\b`, "gi");
        text = text.replace(regex, replacement);
    }

    return text.replace(/\s+/g, " ");
}

/**
 * Resolves conversational context, 1-2 word query expansions, and pronoun references.
 */
export function resolveConversationContext(
    currentQuery: string,
    history: ChatHistoryMessage[] = []
): string {
    const normalized = normalizeQuery(currentQuery);

    // Direct 1-2 word query expansion
    if (SHORT_QUERY_EXPANSIONS[normalized]) {
        return SHORT_QUERY_EXPANSIONS[normalized];
    }

    if (history.length === 0) {
        return normalized;
    }

    // Check if query contains follow-up indicators
    const isFollowUp = /\b(it|this|that|these|cost|price|pricing|how much|where|apply|join|features|demo|contact them|tell me more|more details)\b/i.test(normalized) &&
        normalized.split(/\s+/).length <= 7;

    if (!isFollowUp) {
        return normalized;
    }

    // Look back at the last 2 user or assistant messages for subject context
    const recentMessages = history.slice(-3);
    let subjectContext = "";

    for (let i = recentMessages.length - 1; i >= 0; i--) {
        const content = recentMessages[i].content.toLowerCase();
        if (content.includes("clearinvoice") || content.includes("invoice") || content.includes("billing")) {
            subjectContext = "ClearInvoice";
            break;
        } else if (content.includes("lecturecast") || content.includes("wavelink") || content.includes("studentos") || content.includes("student project")) {
            subjectContext = "SS40 Academics Student Projects";
            break;
        } else if (content.includes("mayil") || content.includes("annai") || content.includes("jalsa") || content.includes("client project")) {
            subjectContext = "SS40 Client Projects";
            break;
        } else if (content.includes("internship") || content.includes("academic") || content.includes("placement") || content.includes("student")) {
            subjectContext = "SS40 Academics Internship";
            break;
        } else if (content.includes("digital solutions") || content.includes("custom software") || content.includes("web app") || content.includes("mobile app")) {
            subjectContext = "SS40 Digital Solutions";
            break;
        } else if (content.includes("location") || content.includes("address") || content.includes("office") || content.includes("tirunelveli")) {
            subjectContext = "SS40 NETWORK Office Location";
            break;
        }
    }

    if (subjectContext) {
        return `${subjectContext} ${normalized}`;
    }

    return normalized;
}

export interface ExtractedContactInfo {
    name?: string;
    phone?: string;
    email?: string;
    company?: string;
    hasAnyContactInfo: boolean;
    synthesizedBrief: string;
}

function cleanCapitalize(name: string): string {
    return name
        .toLowerCase()
        .split(/[\s._-]+/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

/**
 * Derives a clean human-readable name from an email username when no explicit name is provided.
 * e.g. "abrahamsamuel6451@gmail.com" -> "Abraham Samuel"
 * e.g. "john.doe@company.com" -> "John Doe"
 */
function deriveNameFromEmail(email: string): string | undefined {
    const userPart = email.split("@")[0].replace(/\d+/g, "").trim();
    if (userPart.length >= 2) {
        // Split camelCase or dot/underscore separated names
        const words = userPart.replace(/([a-z])([A-Z])/g, "$1 $2").split(/[\s._-]+/).filter(w => w.length > 1);
        if (words.length > 0) {
            return cleanCapitalize(words.join(" "));
        }
    }
    return undefined;
}

/**
 * Automatically extracts complete contact information (Name, Phone, Email, Company)
 * across the entire conversation history to guarantee zero loss.
 */
export function extractContactDetails(
    currentText: string,
    history: ChatHistoryMessage[] = []
): ExtractedContactInfo {
    let name: string | undefined;
    let phone: string | undefined;
    let email: string | undefined;
    let company: string | undefined;

    // Collect all user utterances in chronological order
    const userUtterances: string[] = [
        ...history.filter(m => m.role === "user").map(m => m.content.trim()),
        currentText.trim()
    ].filter(Boolean);

    const fullConversationText = userUtterances.join("\n");

    // 1. Phone extraction across all user messages
    const phoneMatch = fullConversationText.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/) || fullConversationText.match(/\b\d{10}\b/);
    if (phoneMatch) {
        phone = phoneMatch[0].replace(/\D/g, "");
    }

    // 2. Email extraction across all user messages
    const emailMatch = fullConversationText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
        email = emailMatch[0].toLowerCase();
    }

    // 3. Company / College extraction
    const companyMatch = fullConversationText.match(/(?:from|company|organization|college|university|working at|firm)\s*[:\-]?\s+([A-Za-z0-9&.\s]{2,40})/i);
    if (companyMatch) {
        const potentialCompany = companyMatch[1].trim();
        if (!STOP_WORDS_AND_VERBS.has(potentialCompany.toLowerCase()) && !/\b(tirunelveli|india|tamilnadu|support|team|chat|website)\b/i.test(potentialCompany)) {
            company = potentialCompany;
        }
    }

    // 4. Name extraction with multi-turn inspection
    // Pattern A: Explicit introductory phrases ("my name is Bala", "I am Bala", "this is Bala", "name: Bala")
    const nameIntroMatch = fullConversationText.match(/(?:my name is|i am|this is|i'm|call me|name\s*[:\-])\s+([A-Za-z][A-Za-z\s]{1,30})/i);
    if (nameIntroMatch) {
        const candidate = nameIntroMatch[1].trim();
        if (isLegitimateHumanName(candidate)) {
            name = cleanCapitalize(candidate);
        }
    }

    if (!name) {
        for (const utterance of userUtterances) {
            const clean = utterance.replace(/[,;:]/g, " ").trim();

            // Starts with name before contact (e.g. "Bala 7838373892" or "Bala bala@gmail.com")
            const leadingMatch = clean.match(/^([A-Za-z]{2,20}(?:\s+[A-Za-z]{2,20})?)\s+(?:[A-Za-z0-9._%+-]+@|\d{10}|\+91)/);
            if (leadingMatch) {
                const leadCandidate = leadingMatch[1].trim();
                if (isLegitimateHumanName(leadCandidate)) {
                    name = cleanCapitalize(leadCandidate);
                    break;
                }
            }

            // Standalone name if the text is a legitimate human name
            if (isLegitimateHumanName(clean)) {
                name = cleanCapitalize(clean);
                break;
            }
        }
    }

    // Pattern C: If email is available but explicit name is still missing, derive clean name from email
    if (!name && email) {
        name = deriveNameFromEmail(email);
    }

    // 5. Synthesize clean project brief from substantive inquiry questions across the conversation
    const substantiveInquiries = userUtterances.filter(u => {
        const lower = u.toLowerCase().trim();
        if (u.includes("@") || /^\d{10}$/.test(u.replace(/\D/g, ""))) return false;
        if (isLegitimateHumanName(u)) return false;
        if (["hi", "hello", "hlo", "ok", "okay", "thank u", "thanks", "ok thank u", "dont miss use it", "what is that", "yes", "no"].includes(lower)) return false;
        return u.length >= 3;
    });

    const synthesizedBrief = substantiveInquiries.length > 0
        ? `Inquiry via SS40 SKY AI Assistant:\n${substantiveInquiries.map(q => `• ${q}`).join("\n")}`
        : `Inquiry submitted via SS40 SKY Assistant (User message: "${currentText}")`;

    return {
        name,
        phone,
        email,
        company,
        hasAnyContactInfo: Boolean(name || phone || email),
        synthesizedBrief,
    };
}

/**
 * Infers primary service interest by analyzing USER inquiries only.
 */
export function inferServiceInterest(query: string, history: ChatHistoryMessage[] = []): string {
    // Only analyze what the USER asked to avoid false matches from assistant pills
    const userUtterances = [
        ...history.filter(m => m.role === "user").map(m => m.content.trim()),
        query.trim()
    ].join(" ").toLowerCase();

    if (/\b(ecommerce|e-commerce|online\s*store|d2c|custom\s*software|web\s*dev|app\s*dev|mobile|digital\s*solutions|cloud|enterprise|erp|crm)\b/i.test(userUtterances)) {
        return "SS40 Digital Solutions";
    }
    if (/\b(clearinvoice|invoice|billing|gst|gtc|saas|products|product)\b/i.test(userUtterances)) {
        return "SS40 Products (ClearInvoice)";
    }
    if (/\b(internship|intern|academic|student|placement|dsa|college|university|mou|sprint)\b/i.test(userUtterances)) {
        return "SS40 Academics (Internships & Training)";
    }
    return "SS40 Digital Solutions";
}
