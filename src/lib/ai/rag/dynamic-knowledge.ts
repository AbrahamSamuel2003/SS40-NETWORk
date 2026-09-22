import { prisma } from "@/lib/prisma";
import { KnowledgeChunk } from "./knowledge-chunks";

interface CacheContainer {
    chunks: KnowledgeChunk[];
    lastFetched: number;
}

let cachedDynamicData: CacheContainer | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

/**
 * Safely fetches active records from Prisma and converts them into KnowledgeChunks.
 * Includes in-memory caching to guarantee sub-millisecond retrieval on chat queries.
 */
export async function getDynamicKnowledgeChunks(): Promise<KnowledgeChunk[]> {
    const now = Date.now();
    if (cachedDynamicData && now - cachedDynamicData.lastFetched < CACHE_TTL_MS) {
        return cachedDynamicData.chunks;
    }

    try {
        const dynamicChunks: KnowledgeChunk[] = [];

        // 1. Fetch Site Configuration (Office, Contact, Socials)
        const siteConfig = await prisma.siteConfig.findFirst().catch(() => null);
        if (siteConfig) {
            dynamicChunks.push({
                id: "chunk-dynamic-site-config",
                title: "SS40 Network Official Contact & Office Information",
                category: "company",
                keywords: [
                    "contact", "phone", "email", "address", "location", "office", "tirunelveli", 
                    "business hours", "timing", "whatsapp", "visiting hours", "reach us"
                ],
                content: `SS40 NETWORK PRIVATE LIMITED is headquartered in Tirunelveli, Tamil Nadu.
- Company Legal Name: ${siteConfig.legalName || "SS40 NETWORK PRIVATE LIMITED"}
- Physical Address: ${siteConfig.addressText || "1st Floor, Municipal Corporation Incubation Centre, Sree Puram, Tirunelveli, Tamil Nadu 627001."}
- Primary Phone: ${siteConfig.contactPhone || "+91 93630 33440"}
- Official Email: ${siteConfig.contactEmail || "contact@ss40network.com"}
- WhatsApp Support: ${siteConfig.whatsappNumber || "+91 93630 33440"}
- Business & Office Hours: ${siteConfig.businessHours || "Monday to Saturday, 9:00 AM - 7:00 PM IST"}`,
                quickReplies: ["Get Direction", "WhatsApp Support", "Email Us", "Call Support"],
                link: { label: "Contact SS40 Network", url: "/contact" }
            });
        }

        // 2. Fetch Active SaaS Products
        const activeProducts = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            take: 10
        }).catch(() => []);

        if (activeProducts.length > 0) {
            const productSummaries = activeProducts.map(p => {
                const featureList = Array.isArray(p.features) 
                    ? p.features.map((f: any) => typeof f === "string" ? f : f.title || f.name).filter(Boolean).slice(0, 3).join(", ")
                    : "";
                return `- ${p.name} (${p.marketingTitle || "SaaS Platform"}): ${p.description} ${featureList ? `Key Highlights: ${featureList}.` : ""}`;
            }).join("\n");

            dynamicChunks.push({
                id: "chunk-dynamic-products",
                title: "SS40 Active SaaS Products & Software Platforms",
                category: "products",
                keywords: [
                    "product", "products", "saas", "software product", "clearinvoice", 
                    "invoicing", "billing", "erp", "cloud platform", "demo", "pricing"
                ],
                content: `SS40 Products builds high-performance, business-ready SaaS platforms:\n${productSummaries}`,
                quickReplies: ["Book a Product Demo", "View ClearInvoice", "Custom SaaS Setup"],
                link: { label: "Explore SS40 Products", url: "/products" }
            });
        }

        // 3. Fetch Student Projects Showcase
        const studentProjects = await prisma.studentProject.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
            take: 8
        }).catch(() => []);

        if (studentProjects.length > 0) {
            const projectSummaries = studentProjects.map(sp => 
                `- ${sp.title} [Category: ${sp.category}]: ${sp.description}`
            ).join("\n");

            dynamicChunks.push({
                id: "chunk-dynamic-student-projects",
                title: "SS40 Academics - Student Projects & Portfolios",
                category: "academics",
                keywords: [
                    "student project", "student projects", "showcase", "built by students", 
                    "student apps", "portfolio", "github projects", "student work"
                ],
                content: `Verified student projects developed during SS40 Academic Internship Sprints:\n${projectSummaries}`,
                quickReplies: ["Student Projects", "Internship Sprints", "Academic Overview"],
                link: { label: "Browse Student Projects", url: "/academics/student-projects" }
            });
        }

        // 4. Fetch Active Client Projects & Case Studies
        const clientProjects = await prisma.clientProject.findMany({
            where: { isActive: true, isConfidential: false },
            orderBy: { sortOrder: "asc" },
            take: 6
        }).catch(() => []);

        if (clientProjects.length > 0) {
            const clientSummaries = clientProjects.map(cp => 
                `- ${cp.title} (${cp.industry}): ${cp.description}`
            ).join("\n");

            dynamicChunks.push({
                id: "chunk-dynamic-client-projects",
                title: "SS40 Digital Solutions - Enterprise Client Projects",
                category: "digital-solutions",
                keywords: [
                    "client projects", "case studies", "portfolio", "work done", 
                    "enterprise engineering", "web development", "mobile apps"
                ],
                content: `Enterprise software applications built by SS40 Digital Solutions:\n${clientSummaries}`,
                quickReplies: ["Request a Quote", "Digital Solutions", "Book Consultation"],
                link: { label: "View Digital Solutions", url: "/digital-solutions" }
            });
        }

        // 5. Fetch Recent Activity Posts & Events
        const recentActivities = await prisma.activityPost.findMany({
            where: { isActive: true },
            orderBy: { activityDate: "desc" },
            take: 4
        }).catch(() => []);

        if (recentActivities.length > 0) {
            const activitySummaries = recentActivities.map(act => 
                `- ${act.title} (${act.activityType.replace(/_/g, " ")}): ${act.summary}`
            ).join("\n");

            dynamicChunks.push({
                id: "chunk-dynamic-activities",
                title: "SS40 Network Recent Milestones & Activities",
                category: "company",
                keywords: [
                    "news", "events", "activities", "updates", "mou signing", "visits", "achievements"
                ],
                content: `Latest news, industry visits, and ecosystem milestones at SS40 Network:\n${activitySummaries}`,
                quickReplies: ["About SS40", "University Partnerships", "Contact Office"],
                link: { label: "Company Updates", url: "/blogs" }
            });
        }

        cachedDynamicData = {
            chunks: dynamicChunks,
            lastFetched: now
        };

        return dynamicChunks;
    } catch (error) {
        console.warn("Failed to fetch dynamic RAG knowledge from database, falling back to static chunks:", error);
        return cachedDynamicData?.chunks || [];
    }
}
