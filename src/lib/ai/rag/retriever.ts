import { SS40_KNOWLEDGE_CHUNKS, KnowledgeChunk } from "./knowledge-chunks";

export interface RetrievalResult {
    chunks: KnowledgeChunk[];
    contextText: string;
    isCompanyRelevant: boolean;
    confidenceScore: number;
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
    "those", "am", "tell", "show", "give", "know", "how", "why", "when", "where", "please", "want"
]);

function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

export function retrieveRelevantChunks(query: string, topK: number = 3): RetrievalResult {
    const rawQuery = query.toLowerCase().trim();
    const queryTokens = tokenize(query);

    const scoredChunks = SS40_KNOWLEDGE_CHUNKS.map(chunk => {
        let score = 0;
        const chunkContentLower = chunk.content.toLowerCase();
        const chunkTitleLower = chunk.title.toLowerCase();

        // 1. Direct whole-phrase / substring matches
        for (const kw of chunk.keywords) {
            const kwLower = kw.toLowerCase();
            if (rawQuery.includes(kwLower)) {
                score += kwLower.includes(" ") ? 8 : 4;
            }
        }

        // 2. Title matches (high importance)
        for (const token of queryTokens) {
            if (chunkTitleLower.includes(token)) {
                score += 5;
            }
        }

        // 3. Keyword token matches
        for (const token of queryTokens) {
            for (const kw of chunk.keywords) {
                if (kw.toLowerCase().includes(token)) {
                    score += 3;
                }
            }
            if (chunkContentLower.includes(token)) {
                score += 1;
            }
        }

        // 4. Boost for generic company mentions
        if ((rawQuery.includes("ss40") || rawQuery.includes("network") || rawQuery.includes("sky")) && 
            (chunk.id === "chunk-about-ss40" || chunk.id === "chunk-three-wings")) {
            score += 4;
        }

        return { chunk, score };
    });

    // Sort descending by score
    scoredChunks.sort((a, b) => b.score - a.score);

    const highestScore = scoredChunks[0]?.score ?? 0;
    // Relevance threshold: if score >= 3, it's relevant to SS40 facts
    const isCompanyRelevant = highestScore >= 2;

    // Filter top K matching chunks with positive score
    const topMatches = scoredChunks
        .filter(item => item.score > 0)
        .slice(0, topK)
        .map(item => item.chunk);

    // If no specific match, default to top company overview chunk
    const selectedChunks = topMatches.length > 0 
        ? topMatches 
        : [SS40_KNOWLEDGE_CHUNKS[0], SS40_KNOWLEDGE_CHUNKS[1]];

    // Build synthesized context string
    const contextText = selectedChunks
        .map(c => `[DOCUMENT: ${c.title}]\n${c.content}`)
        .join("\n\n");

    // Aggregate unique quick replies
    const quickRepliesSet = new Set<string>();
    for (const c of selectedChunks) {
        if (c.quickReplies) {
            for (const qr of c.quickReplies) {
                quickRepliesSet.add(qr);
                if (quickRepliesSet.size >= 4) break;
            }
        }
    }

    const suggestedLink = selectedChunks.find(c => c.link)?.link;

    return {
        chunks: selectedChunks,
        contextText,
        isCompanyRelevant,
        confidenceScore: highestScore,
        suggestedQuickReplies: Array.from(quickRepliesSet),
        suggestedLink
    };
}
