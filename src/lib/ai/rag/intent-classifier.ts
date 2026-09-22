export type IntentType =
    | "GREETING"
    | "THREE_WINGS"
    | "DIGITAL_SOLUTIONS"
    | "PRODUCTS_SAAS"
    | "ACADEMICS_PROGRAMS"
    | "STUDENT_PROJECTS"
    | "SUPPORT_CONTACT"
    | "OFFICE_LOCATION"
    | "PRICING_QUOTE"
    | "LEAD_INTENT"
    | "GENERAL_SS40"
    | "OUT_OF_SCOPE";

export interface IntentClassificationResult {
    primaryIntent: IntentType;
    confidence: number;
    hasGreetingPrefix: boolean;
    isPureGreeting: boolean;
    actionType: "STANDARD" | "WINGS_CARD" | "ACADEMIC_CARD" | "SUPPORT_CARD" | "LEAD_CAPTURE" | "PROJECT_PREVIEW";
    suggestedQuickReplies: string[];
    suggestedLink?: {
        label: string;
        url: string;
    };
    extractedLeadInfo?: {
        phone?: string;
        email?: string;
        name?: string;
        requirement?: string;
    };
}

// Levenshtein distance helper for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

function isFuzzyMatch(word: string, target: string, maxDistance: number = 2): boolean {
    if (Math.abs(word.length - target.length) > maxDistance) return false;
    return levenshteinDistance(word, target) <= maxDistance;
}

function extractPhone(text: string): string | undefined {
    const phoneRegex = /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|\b\d{10}\b/;
    const match = text.match(phoneRegex);
    return match ? match[0].replace(/[\s-]/g, "") : undefined;
}

function extractEmail(text: string): string | undefined {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;
    const match = text.match(emailRegex);
    return match ? match[0].toLowerCase() : undefined;
}

export function classifyIntent(query: string): IntentClassificationResult {
    const lowerQuery = query.toLowerCase().trim();
    const tokens = lowerQuery.replace(/[^\w\s-]/g, " ").split(/\s+/).filter(w => w.length > 1);

    const phone = extractPhone(query);
    const email = extractEmail(query);

    // Robust Greeting Regex handling slangs and typos: hi, hii, hlo, helo, hlw, hey, heyy, etc.
    const greetingPattern = /^(h+i+|h+e+l+o+|h+l+o+|h+l+w+|h+e+y+|greetings|namaste|vanakkam|good\s*(morning|afternoon|evening)|start|menu|help|who\s*are\s*you)\b/i;
    const isPureGreeting = greetingPattern.test(lowerQuery) && tokens.length <= 3;
    const hasGreetingPrefix = greetingPattern.test(lowerQuery);

    // 1. Lead Intent
    if (phone || email || (/\b(call me|contact me|my number|reach me at|my email|hire you|quote for my)\b/i.test(lowerQuery))) {
        return {
            primaryIntent: "LEAD_INTENT",
            confidence: 0.95,
            hasGreetingPrefix,
            isPureGreeting: false,
            actionType: "LEAD_CAPTURE",
            suggestedQuickReplies: ["Digital Solutions", "SS40 Products", "SS40 Academics", "Office Location"],
            suggestedLink: { label: "Contact SS40 Team", url: "/contact" },
            extractedLeadInfo: {
                phone,
                email,
                requirement: query
            }
        };
    }

    // 2. Pure Greetings (hi, hlo, hello, etc.)
    if (isPureGreeting) {
        return {
            primaryIntent: "GREETING",
            confidence: 0.95,
            hasGreetingPrefix: true,
            isPureGreeting: true,
            actionType: "WINGS_CARD",
            suggestedQuickReplies: ["Request a Quote", "ClearInvoice SaaS", "Academic Sprints", "Office Location"],
            suggestedLink: undefined
        };
    }

    // 3. Three Wings / Ecosystem Overview
    const wingsRegex = /\b(three\s*wings?|3\s*wings?|our\s*wings?|business\s*wings?|ecosystem|all\s*wings?|what\s*does\s*ss40\s*do|what\s*do\s*you\s*do|services)\b/i;
    if (wingsRegex.test(lowerQuery) || tokens.some(t => isFuzzyMatch(t, "ecosystem") || isFuzzyMatch(t, "divisions"))) {
        return {
            primaryIntent: "THREE_WINGS",
            confidence: 0.95,
            hasGreetingPrefix,
            isPureGreeting: false,
            actionType: "WINGS_CARD",
            suggestedQuickReplies: ["Request a Quote", "ClearInvoice SaaS", "Academic Sprints", "Talk to Team"],
            suggestedLink: undefined
        };
    }

    // 4. Academics / Internships / Training / Career / Colleges
    const academicsKeywords = [
        "academic", "academics", "internship", "internships", "intern", "interns", "student", "students",
        "college", "university", "mou", "curriculum", "syllabus", "placement", "placements", "job", "career",
        "launchpad", "fresher", "freshers", "training", "courses", "course", "workshop", "dsa", "coding batch"
    ];
    const hasAcademicMatch = academicsKeywords.some(kw => 
        lowerQuery.includes(kw) || tokens.some(t => isFuzzyMatch(t, kw, kw.length > 5 ? 2 : 1))
    );

    if (hasAcademicMatch) {
        // Specific: Student Projects
        if (/\b(student\s*projects?|showcase|built\s*by\s*students?|github\s*projects?|portfolios?)\b/i.test(lowerQuery)) {
            return {
                primaryIntent: "STUDENT_PROJECTS",
                confidence: 0.92,
                hasGreetingPrefix,
                isPureGreeting: false,
                actionType: "PROJECT_PREVIEW",
                suggestedQuickReplies: ["Internship Sprints", "Academic Overview", "Apply Now", "Contact SS40"],
                suggestedLink: undefined
            };
        }

        return {
            primaryIntent: "ACADEMICS_PROGRAMS",
            confidence: 0.9,
            hasGreetingPrefix,
            isPureGreeting: false,
            actionType: "ACADEMIC_CARD",
            suggestedQuickReplies: ["Student Projects", "Placement Prep", "University MOUs", "Contact SS40"],
            suggestedLink: undefined
        };
    }

    // 5. Products / SaaS / ClearInvoice / Demos
    const productKeywords = [
        "product", "products", "saas", "clearinvoice", "invoice", "invoicing", "billing", "erp",
        "inventory", "crm", "software tool", "demo", "book demo", "trial", "software platform"
    ];
    const hasProductMatch = productKeywords.some(kw => 
        lowerQuery.includes(kw) || tokens.some(t => isFuzzyMatch(t, kw, kw.length > 5 ? 2 : 1))
    );

    if (hasProductMatch) {
        return {
            primaryIntent: "PRODUCTS_SAAS",
            confidence: 0.9,
            hasGreetingPrefix,
            isPureGreeting: false,
            actionType: "STANDARD",
            suggestedQuickReplies: ["Book a Product Demo", "View ClearInvoice", "Pricing & Plans", "Contact Sales"],
            suggestedLink: { label: "Explore SS40 Products", url: "/products" }
        };
    }

    // 6. Digital Solutions / Custom Engineering / Web / Mobile / AI Automation
    const solutionsKeywords = [
        "digital solutions", "custom software", "web development", "mobile app", "full stack", "react",
        "nextjs", "nodejs", "python", "backend", "frontend", "api", "database", "cloud", "ai",
        "automation", "workflow", "machine learning", "devops", "software development"
    ];
    const hasSolutionsMatch = solutionsKeywords.some(kw => 
        lowerQuery.includes(kw) || tokens.some(t => isFuzzyMatch(t, kw, kw.length > 6 ? 2 : 1))
    );

    if (hasSolutionsMatch) {
        return {
            primaryIntent: "DIGITAL_SOLUTIONS",
            confidence: 0.9,
            hasGreetingPrefix,
            isPureGreeting: false,
            actionType: "STANDARD",
            suggestedQuickReplies: ["Request a Quote", "Client Projects", "AI Automation", "Book Consultation"],
            suggestedLink: { label: "Explore Digital Solutions", url: "/digital-solutions" }
        };
    }

    // 7. Support / Contact / WhatsApp / Phone / Address / Location
    const supportKeywords = [
        "contact", "phone", "email", "whatsapp", "call", "human", "agent", "support",
        "representative", "reach", "help desk", "talk to someone", "customer care"
    ];
    const locationKeywords = ["address", "location", "office", "tirunelveli", "where are you", "direction", "maps", "visit"];

    const hasLocationMatch = locationKeywords.some(kw => lowerQuery.includes(kw) || tokens.some(t => isFuzzyMatch(t, kw, 1)));
    const hasSupportMatch = supportKeywords.some(kw => lowerQuery.includes(kw) || tokens.some(t => isFuzzyMatch(t, kw, 1)));

    if (hasSupportMatch || hasLocationMatch) {
        return {
            primaryIntent: hasLocationMatch ? "OFFICE_LOCATION" : "SUPPORT_CONTACT",
            confidence: 0.92,
            hasGreetingPrefix,
            isPureGreeting: false,
            actionType: "SUPPORT_CARD",
            suggestedQuickReplies: ["WhatsApp Support", "Email Support", "Get Directions", "Call Us Now"],
            suggestedLink: { label: "Contact SS40 Network", url: "/contact" }
        };
    }

    // 8. Pricing / Cost / Quotes
    const pricingKeywords = ["price", "pricing", "cost", "quote", "budget", "rate", "fees", "how much", "charges"];
    if (pricingKeywords.some(kw => lowerQuery.includes(kw) || tokens.some(t => isFuzzyMatch(t, kw, 1)))) {
        return {
            primaryIntent: "PRICING_QUOTE",
            confidence: 0.88,
            hasGreetingPrefix,
            isPureGreeting: false,
            actionType: "SUPPORT_CARD",
            suggestedQuickReplies: ["Request Free Quote", "WhatsApp Pricing Inquiry", "Schedule Consultation"],
            suggestedLink: { label: "Request a Custom Quote", url: "/contact" }
        };
    }

    // 9. General SS40 / Company info
    if (lowerQuery.includes("ss40") || lowerQuery.includes("sky") || lowerQuery.includes("network") || lowerQuery.includes("founder") || lowerQuery.includes("company")) {
        return {
            primaryIntent: "GENERAL_SS40",
            confidence: 0.8,
            hasGreetingPrefix,
            isPureGreeting: false,
            actionType: "STANDARD",
            suggestedQuickReplies: ["Our Three Wings", "Digital Solutions", "SS40 Products", "SS40 Academics"],
            suggestedLink: { label: "About SS40 Network", url: "/#about" }
        };
    }

    // 10. Adjacent Tech/Service Recognition
    const adjacentTechKeywords = ["software", "application", "tech", "technology", "code", "programming", "business", "service", "development"];
    if (adjacentTechKeywords.some(kw => lowerQuery.includes(kw))) {
        return {
            primaryIntent: "GENERAL_SS40",
            confidence: 0.6,
            hasGreetingPrefix,
            isPureGreeting: false,
            actionType: "STANDARD",
            suggestedQuickReplies: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Talk to Team"],
            suggestedLink: { label: "Explore SS40 Network", url: "/#about" }
        };
    }

    // Out of scope
    return {
        primaryIntent: "OUT_OF_SCOPE",
        confidence: 0.1,
        hasGreetingPrefix,
        isPureGreeting: false,
        actionType: "STANDARD",
        suggestedQuickReplies: ["Request a Quote", "ClearInvoice Demo", "Academic Sprints", "Talk to Team"],
        suggestedLink: { label: "Discover SS40 Network", url: "/#about" }
    };
}
