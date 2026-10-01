import { NextRequest, NextResponse } from "next/server";
import { reindexVectorStore } from "@/lib/ai/rag/vector-store";
import { getCurrentAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const admin = await getCurrentAdmin();
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const chunks = await reindexVectorStore();

        return NextResponse.json({
            success: true,
            message: `Vector store reindexed successfully with ${chunks.length} neural chunks.`,
            chunkCount: chunks.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error("Admin reindex error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to reindex vector store",
        }, { status: 500 });
    }
}
