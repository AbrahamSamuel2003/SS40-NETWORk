/**
 * Neural Embedding Generator for SS40 SKY RAG Engine
 * Utilizes Xenova/all-MiniLM-L6-v2 (384-dimensional dense embeddings)
 * Runs locally via ONNX runtime for sub-millisecond inference with zero API cost.
 */

let pipelinePromise: Promise<any> | null = null;

async function getEmbeddingPipeline() {
    if (!pipelinePromise) {
        pipelinePromise = (async () => {
            const { pipeline, env } = await import("@xenova/transformers");
            // Disable telemetry and local cache settings if needed
            env.allowLocalModels = false;
            env.useBrowserCache = false;
            return await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
        })();
    }
    return pipelinePromise;
}

/**
 * Computes a 384-dimensional normalized neural embedding for the given input text.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const cleanedText = text.trim().replace(/\s+/g, " ");
    if (!cleanedText) {
        return new Array(384).fill(0);
    }

    try {
        const extractor = await getEmbeddingPipeline();
        const output = await extractor(cleanedText, {
            pooling: "mean",
            normalize: true,
        });
        return Array.from(output.data);
    } catch (error) {
        console.error("Neural embedding generation error, falling back to hashed float vector:", error);
        return fallbackEmbedding(cleanedText);
    }
}

/**
 * Computes cosine similarity between two normalized embedding vectors.
 * Since vectors are normalized to unit length, cosine similarity is simply the dot product.
 */
export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;
    let dot = 0;
    for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
    }
    return dot;
}

/**
 * Deterministic fallback embedding in case of environment initialization failures.
 */
function fallbackEmbedding(text: string): number[] {
    const vector = new Array(384).fill(0);
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        let hash = 0;
        for (let j = 0; j < word.length; j++) {
            hash = (hash * 31 + word.charCodeAt(j)) % 384;
        }
        vector[Math.abs(hash)] += 1;
    }
    // Normalize
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map(val => val / norm);
}
    