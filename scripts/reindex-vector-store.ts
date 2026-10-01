import "dotenv/config";
import { reindexVectorStore } from "../src/lib/ai/rag/vector-store";

async function main() {
    console.log("==================================================");
    console.log("SS40 NETWORK - Neural Vector Knowledge Reindexer");
    console.log("==================================================");
    const startTime = Date.now();

    try {
        const chunks = await reindexVectorStore();
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\nSuccessfully indexed and persisted ${chunks.length} chunks in ${duration}s.`);
        console.log("Persistent Storage Path: storage/vector-store.json");
    } catch (error) {
        console.error("Re-indexing failed:", error);
        process.exit(1);
    }
}

main();
