import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { OFFICIAL_SS40_CORPUS, KnowledgeSourceDocument } from "./corpus";
import { generateEmbedding, computeCosineSimilarity } from "./embeddings";

export interface VectorChunk extends KnowledgeSourceDocument {
    embedding: number[];
}

export interface VectorSearchResult {
    chunks: VectorChunk[];
    contextText: string;
    topScore: number;
    primaryChunk?: VectorChunk;
}

const STORAGE_DIR = path.join(process.cwd(), "storage");
const VECTOR_STORE_FILE = path.join(STORAGE_DIR, "vector-store.json");

// In-memory cache of static and dynamic vector chunks
let memoryVectorStore: VectorChunk[] | null = null;
let dynamicChunksCache: { chunks: VectorChunk[]; timestamp: number } | null = null;
const DYNAMIC_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache for live DB items

/**
 * Loads the persistent vector store from storage/vector-store.json.
 * If not found or incomplete, generates embeddings and saves to disk.
 */
export async function getOrInitializeVectorStore(): Promise<VectorChunk[]> {
    if (memoryVectorStore && memoryVectorStore.length > 0) {
        return memoryVectorStore;
    }

    try {
        if (fs.existsSync(VECTOR_STORE_FILE)) {
            const rawData = fs.readFileSync(VECTOR_STORE_FILE, "utf-8");
            const parsed = JSON.parse(rawData) as VectorChunk[];
            if (Array.isArray(parsed) && parsed.length >= OFFICIAL_SS40_CORPUS.length) {
                memoryVectorStore = parsed;
                return memoryVectorStore;
            }
        }
    } catch (err) {
        console.warn("Could not read vector store from disk, regenerating:", err);
    }

    // Build and persist fresh vector store
    return await reindexVectorStore();
}

/**
 * Re-indexes all official corpus documents with neural embeddings and persists to disk.
 */
export async function reindexVectorStore(): Promise<VectorChunk[]> {
    console.log(`[RAG Vector Store] Generating neural embeddings for ${OFFICIAL_SS40_CORPUS.length} corpus chunks...`);
    
    const vectorizedChunks: VectorChunk[] = [];
    for (const doc of OFFICIAL_SS40_CORPUS) {
        const textToEmbed = `${doc.title}\n${doc.summary}\n${doc.content}\nKeywords: ${doc.keywords.join(", ")}`;
        const embedding = await generateEmbedding(textToEmbed);
        vectorizedChunks.push({
            ...doc,
            embedding,
            lastUpdated: new Date().toISOString(),
        });
    }

    // Ensure storage directory exists
    try {
        if (!fs.existsSync(STORAGE_DIR)) {
            fs.mkdirSync(STORAGE_DIR, { recursive: true });
        }
        fs.writeFileSync(VECTOR_STORE_FILE, JSON.stringify(vectorizedChunks, null, 2), "utf-8");
        console.log(`[RAG Vector Store] Persisted ${vectorizedChunks.length} chunks to ${VECTOR_STORE_FILE}`);
    } catch (fsErr) {
        console.error("[RAG Vector Store] Failed to write vector store to disk:", fsErr);
    }

    memoryVectorStore = vectorizedChunks;
    return memoryVectorStore;
}

/**
 * Fetches dynamic entities from Prisma (Products, Client Projects, Student Projects, Activity Posts, SiteConfig)
 * and generates neural embeddings for real-time RAG synchronization.
 */
async function getLiveDynamicChunks(): Promise<VectorChunk[]> {
    const now = Date.now();
    if (dynamicChunksCache && now - dynamicChunksCache.timestamp < DYNAMIC_CACHE_TTL_MS) {
        return dynamicChunksCache.chunks;
    }

    const dynamicChunks: VectorChunk[] = [];

    try {
        // 1. Live Site Config
        const siteConfig = await prisma.siteConfig.findFirst().catch(() => null);
        if (siteConfig) {
            const content = `SS40 NETWORK PRIVATE LIMITED Official Contact & Hours:
- Legal Entity: ${siteConfig.legalName || "SS40 NETWORK PRIVATE LIMITED"}
- Physical Address: ${siteConfig.addressText || "1st Floor, Municipal Corporation Incubation Centre, Sree Puram, Tirunelveli, Tamil Nadu 627001."}
- Primary Phone: ${siteConfig.contactPhone || "+91 93630 33440"}
- Support Email: ${siteConfig.contactEmail || "support@ss40network.com"}
- WhatsApp Desk: ${siteConfig.whatsappNumber || "+91 93630 33440"}
- Business Hours: ${siteConfig.businessHours || "Monday to Saturday, 9:00 AM - 7:00 PM IST"}`;

            const embedding = await generateEmbedding(`Live Office Contact SiteConfig\n${content}`);
            dynamicChunks.push({
                id: "live-doc-site-config",
                title: "Live SS40 NETWORK Official Office & Contact Information",
                category: "contact",
                sourceUrl: "https://ss40network.com/contact",
                route: "/contact",
                content,
                summary: "Live updated contact info, phone, email, and business hours from database.",
                keywords: ["contact", "phone", "email", "address", "location", "office", "tirunelveli", "hours", "whatsapp"],
                suggestedOptions: ["WhatsApp Support", "Email Us", "Visit Contact Page", "Office Location"],
                lastUpdated: siteConfig.updatedAt ? siteConfig.updatedAt.toISOString() : new Date().toISOString(),
                embedding,
            });
        }

        // 2. Active SaaS Products
        const activeProducts = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            take: 10,
        }).catch(() => []);

        for (const p of activeProducts) {
            const features = Array.isArray(p.features)
                ? p.features.map((f: any) => typeof f === "string" ? f : f.title || f.name).filter(Boolean).join(", ")
                : "";
            const content = `Product: ${p.name} (${p.marketingTitle || "SaaS Platform"})\nDescription: ${p.description}\n${features ? `Key Capabilities: ${features}` : ""}\nStatus: Live Active Product`;
            const embedding = await generateEmbedding(`${p.name} ${p.marketingTitle}\n${content}`);

            dynamicChunks.push({
                id: `live-product-${p.id}`,
                title: `${p.name} - ${p.marketingTitle || "SaaS Product"}`,
                category: "products",
                sourceUrl: "https://ss40network.com/products",
                route: "/products",
                content,
                summary: p.description.slice(0, 120),
                keywords: [p.name.toLowerCase(), "saas", "product", "software", "pricing", "demo"],
                suggestedOptions: [`Book ${p.name} Demo`, "Explore Products", "Contact Sales"],
                lastUpdated: p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString(),
                embedding,
            });
        }

        // 3. Active Client Projects
        const clientProjects = await prisma.clientProject.findMany({
            where: { isActive: true, isConfidential: false },
            orderBy: { sortOrder: "asc" },
            take: 6,
        }).catch(() => []);

        for (const cp of clientProjects) {
            const content = `Client Project: ${cp.title} (Industry: ${cp.industry})\nDescription: ${cp.description}`;
            const embedding = await generateEmbedding(`${cp.title} ${cp.industry}\n${content}`);

            dynamicChunks.push({
                id: `live-client-proj-${cp.id}`,
                title: `${cp.title} (${cp.industry}) - Client Project`,
                category: "digital-solutions",
                sourceUrl: "https://ss40network.com/digital-solutions",
                route: "/digital-solutions",
                content,
                summary: cp.description.slice(0, 120),
                keywords: [cp.title.toLowerCase(), cp.industry.toLowerCase(), "client project", "case study"],
                suggestedOptions: ["Request Project Quote", "Digital Solutions", "Contact Solutions Team"],
                lastUpdated: cp.updatedAt ? cp.updatedAt.toISOString() : new Date().toISOString(),
                embedding,
            });
        }

        // 4. Active Student Projects
        const studentProjects = await prisma.studentProject.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            take: 6,
        }).catch(() => []);

        for (const sp of studentProjects) {
            const content = `Student Project: ${sp.title} [Category: ${sp.category}]\nDescription: ${sp.description}`;
            const embedding = await generateEmbedding(`${sp.title} ${sp.category}\n${content}`);

            dynamicChunks.push({
                id: `live-student-proj-${sp.id}`,
                title: `${sp.title} - SS40 Student Project`,
                category: "projects",
                sourceUrl: "https://ss40network.com/academics/student-projects",
                route: "/academics/student-projects",
                content,
                summary: sp.description.slice(0, 120),
                keywords: [sp.title.toLowerCase(), sp.category.toLowerCase(), "student project", "portfolio"],
                suggestedOptions: ["Student Projects", "Internship Sprints", "SS40 Academics"],
                lastUpdated: sp.updatedAt ? sp.updatedAt.toISOString() : new Date().toISOString(),
                embedding,
            });
        }

        // 5. Recent Activity Posts
        const recentActivities = await prisma.activityPost.findMany({
            where: { isActive: true },
            orderBy: { activityDate: "desc" },
            take: 4,
        }).catch(() => []);

        for (const act of recentActivities) {
            const content = `Activity Post: ${act.title} [Type: ${act.activityType.replace(/_/g, " ")}]\nSummary: ${act.summary}\nDate: ${new Date(act.activityDate).toLocaleDateString()}`;
            const embedding = await generateEmbedding(`${act.title}\n${content}`);

            dynamicChunks.push({
                id: `live-activity-${act.id}`,
                title: `${act.title} - Company Update`,
                category: "announcements",
                sourceUrl: `https://ss40network.com/blogs`,
                route: "/blogs",
                content,
                summary: act.summary.slice(0, 120),
                keywords: [act.title.toLowerCase(), "news", "update", "mou", "visit", "announcement"],
                suggestedOptions: ["Company Updates", "Three Wings", "Contact Office"],
                lastUpdated: act.updatedAt ? act.updatedAt.toISOString() : new Date().toISOString(),
                embedding,
            });
        }

        dynamicChunksCache = {
            chunks: dynamicChunks,
            timestamp: now,
        };
    } catch (err) {
        console.warn("[RAG Vector Store] Live dynamic synchronization error, using cached items:", err);
    }

    return dynamicChunksCache?.chunks || [];
}

/**
 * Searches the neural vector knowledge store using Cosine Similarity + Keyword/Domain hybrid scoring.
 * 
 * @param query Cleaned and normalized search query
 * @param topK Number of chunks to retrieve (default: 4)
 * @param similarityThreshold Minimum similarity score cutoff (default: 0.35)
 */
export async function searchVectorKnowledge(
    query: string,
    topK: number = 4,
    similarityThreshold: number = 0.35
): Promise<VectorSearchResult> {
    const rawQuery = query.toLowerCase().trim();
    const queryTokens = rawQuery.split(/\W+/).filter(w => w.length > 2);

    // 1. Load static vector store and dynamic live records
    const [staticChunks, dynamicChunks] = await Promise.all([
        getOrInitializeVectorStore(),
        getLiveDynamicChunks(),
    ]);

    const allChunks = [...dynamicChunks, ...staticChunks];

    // 2. Generate neural embedding for user query
    const queryEmbedding = await generateEmbedding(rawQuery);

    // 3. Compute Hybrid Score (Neural Cosine Similarity + Exact Token Overlap Bonus)
    const scoredChunks = allChunks.map(chunk => {
        // Cosine similarity (range: -1 to 1, typically 0.2 to 0.9 for relevant texts)
        const cosineSim = computeCosineSimilarity(queryEmbedding, chunk.embedding);

        // Token match boost for domain-specific precision
        let tokenBonus = 0;
        const chunkContentLower = (chunk.title + " " + chunk.keywords.join(" ") + " " + chunk.content).toLowerCase();

        for (const token of queryTokens) {
            if (chunkContentLower.includes(token)) {
                tokenBonus += 0.05; // 5% boost per token match
            }
        }

        // Exact keyword phrase match boost
        for (const kw of chunk.keywords) {
            if (rawQuery === kw.toLowerCase() || rawQuery.includes(kw.toLowerCase())) {
                tokenBonus += 0.12;
                break;
            }
        }

        // Domain-specific keyword boosts
        if (/\b(clearinvoice|invoice|billing|gst)\b/i.test(rawQuery) && chunk.category === "products") {
            tokenBonus += 0.15;
        } else if (/\b(internship|internships|intern|sprint|dsa|college|placement)\b/i.test(rawQuery) && (chunk.category === "academics" || chunk.category === "internships")) {
            tokenBonus += 0.15;
        } else if (/\b(digital\s*solutions|custom\s*software|web\s*dev|app\s*dev)\b/i.test(rawQuery) && chunk.category === "digital-solutions") {
            tokenBonus += 0.15;
        } else if (/\b(address|office|location|tirunelveli|where|hours|phone|email|contact)\b/i.test(rawQuery) && (chunk.category === "location" || chunk.category === "contact")) {
            tokenBonus += 0.15;
        }

        const hybridScore = cosineSim * 0.75 + tokenBonus;

        return {
            chunk,
            score: hybridScore,
            cosineSim,
        };
    });

    // 4. Sort descending by hybrid score
    scoredChunks.sort((a, b) => b.score - a.score);

    const topScored = scoredChunks.slice(0, topK);
    const topScore = topScored[0]?.score || 0;

    // Filter by similarity threshold
    const relevantChunks = topScored
        .filter(item => item.score >= similarityThreshold)
        .map(item => item.chunk);

    // Build cleanly formatted context string for Groq
    const contextText = relevantChunks.length > 0
        ? relevantChunks
            .map(c => `[SOURCE: ${c.title} | Category: ${c.category} | URL: ${c.sourceUrl} | Route: ${c.route}]\n${c.content}`)
            .join("\n\n")
        : "";

    return {
        chunks: relevantChunks,
        contextText,
        topScore,
        primaryChunk: relevantChunks[0] || topScored[0]?.chunk,
    };
}
