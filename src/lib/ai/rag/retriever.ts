import { SS40_KNOWLEDGE_CHUNKS, KnowledgeChunk } from "./knowledge-chunks";
import { getDynamicKnowledgeChunks } from "./dynamic-knowledge";
import { classifyIntent, IntentClassificationResult } from "./intent-classifier";

export interface RetrievalResult {
    chunks: KnowledgeChunk[];
    contextText: string;
    isCompanyRelevant: boolean;
    confidenceScore: number;
    intentResult: IntentClassificationResult;
    suggestedQuickReplies: string[];
    suggestedLink?: {
        label: string;
        url: string;
    };
}

const STOP_WORDS = new Set([
    "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "from", "and", "or", "is", "are", "was",
    "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "can", "could", "should", "would",
    "will", "shall", "may", "might", "must", "i", "you", "he", "she", "it", "we", "they", "me", "him", "her",
    "us", "them", "my", "your", "his", "their", "our", "what", "which", "who", "whom", "this", "that", "these",
    "those", "am", "tell", "show", "give", "know", "how", "why", "when", "where", "please", "want", "need",
    "hi", "hello", "hey", "start", "greetings"
]);

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

export async function retrieveRelevantChunks(query: string, topK: number = 3): Promise<RetrievalResult> {
    const rawQuery = query.toLowerCase().trim();
    const queryTokens = tokenize(query);

    // 1. Classify intent with fuzzy match & lead extraction
    const intentResult = classifyIntent(query);

    // 2. Aggregate static chunks with dynamic Prisma database chunks
    const dynamicChunks = await getDynamicKnowledgeChunks();
    const allChunks: KnowledgeChunk[] = [...dynamicChunks, ...SS40_KNOWLEDGE_CHUNKS];

    // 3. Score chunks based on tokens, intent alignment, and keyword relevance
    const scoredChunks = allChunks.map(chunk => {
        let score = 0;
        const chunkContentWords = new Set(chunk.content.toLowerCase().split(/[^\w\s-]+/));
        const chunkTitleWords = new Set(chunk.title.toLowerCase().split(/[^\w\s-]+/));

        // Intent-category bonus
        if (intentResult.primaryIntent === "GREETING") {
            if (chunk.id.includes("about-ss40") || chunk.id.includes("three-wings")) {
                score += 30;
            }
        } else if (intentResult.primaryIntent === "THREE_WINGS" && (chunk.id.includes("three-wings") || chunk.id.includes("about-ss40"))) {
            score += 25;
        } else if (intentResult.primaryIntent === "ACADEMICS_PROGRAMS" && chunk.category.toLowerCase().includes("academic")) {
            score += 20;
        } else if (intentResult.primaryIntent === "STUDENT_PROJECTS" && (chunk.id.includes("student-project") || chunk.title.toLowerCase().includes("student project"))) {
            score += 25;
        } else if (intentResult.primaryIntent === "PRODUCTS_SAAS" && (chunk.category.toLowerCase().includes("product") || chunk.id.includes("product"))) {
            score += 20;
        } else if (intentResult.primaryIntent === "DIGITAL_SOLUTIONS" && (chunk.category.toLowerCase().includes("digital") || chunk.id.includes("digital"))) {
            score += 20;
        } else if ((intentResult.primaryIntent === "SUPPORT_CONTACT" || intentResult.primaryIntent === "OFFICE_LOCATION") && 
                   (chunk.category.toLowerCase().includes("contact") || chunk.category.toLowerCase().includes("location") || chunk.id.includes("site-config"))) {
            score += 25;
        }

        // Exact & whole-phrase matches in keywords
        for (const kw of chunk.keywords) {
            const kwLower = kw.toLowerCase();
            if (rawQuery === kwLower || rawQuery.includes(kwLower)) {
                score += kwLower.includes(" ") ? 10 : 5;
            }
        }

        // Title whole-word matches
        for (const token of queryTokens) {
            if (chunkTitleWords.has(token)) {
                score += 6;
            }
        }

        // Keyword & Content whole-word matches (using Set.has to avoid substring false matches)
        for (const token of queryTokens) {
            for (const kw of chunk.keywords) {
                if (kw.toLowerCase().split(/\s+/).includes(token)) {
                    score += 4;
                }
            }
            if (chunkContentWords.has(token)) {
                score += 2;
            }
        }

        return { chunk, score };
    });

    // Sort descending by score
    scoredChunks.sort((a, b) => b.score - a.score);

    const highestScore = scoredChunks[0]?.score ?? 0;
    const isCompanyRelevant = intentResult.primaryIntent !== "OUT_OF_SCOPE" || highestScore >= 2;

    // Filter top K matching chunks with positive score
    const topMatches = scoredChunks
        .filter(item => item.score > 0)
        .slice(0, topK)
        .map(item => item.chunk);

    // If greeting or no specific match, prioritize company overview and wings
    const defaultChunks = allChunks.filter(c => c.id.includes("about-ss40") || c.id.includes("three-wings")).slice(0, 2);
    const selectedChunks = (intentResult.primaryIntent === "GREETING" || topMatches.length === 0)
        ? (defaultChunks.length > 0 ? defaultChunks : [allChunks[0], allChunks[1]])
        : topMatches;

    // Build synthesized context string
    const contextText = selectedChunks
        .map(c => `[DOCUMENT: ${c.title}]\n${c.content}`)
        .join("\n\n");

    // Aggregate unique quick replies (strictly max 4-5 items to avoid UI clutter)
    const quickRepliesSet = new Set<string>();
    if (intentResult.suggestedQuickReplies && intentResult.suggestedQuickReplies.length > 0) {
        for (const qr of intentResult.suggestedQuickReplies) {
            quickRepliesSet.add(qr);
            if (quickRepliesSet.size >= 4) break;
        }
    }
    if (quickRepliesSet.size < 4) {
        for (const c of selectedChunks) {
            if (c.quickReplies) {
                for (const qr of c.quickReplies) {
                    quickRepliesSet.add(qr);
                    if (quickRepliesSet.size >= 4) break;
                }
            }
        }
    }

    const suggestedLink = intentResult.suggestedLink || selectedChunks.find(c => c.link)?.link;

    return {
        chunks: selectedChunks,
        contextText,
        isCompanyRelevant,
        confidenceScore: highestScore,
        intentResult,
        suggestedQuickReplies: Array.from(quickRepliesSet).slice(0, 4),
        suggestedLink
    };
}
