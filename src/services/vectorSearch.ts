import prisma from '@/lib/prisma';
import { TOP_K, RELEVANCE_THRESHOLD } from '@/lib/config';
import { ChunkWithScore } from '@/types';
import { DatabaseError } from '@/lib/errors';

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
        return 0;
    }

    return dotProduct / (normA * normB);
}

/**
 * Find the most similar chunks to a query embedding using in-memory cosine similarity
 * Filters results by relevance threshold and returns top K most relevant chunks
 * Suitable for datasets < 1,000 chunks
 */
export async function findSimilarChunks(
    queryEmbedding: number[],
    topK: number = TOP_K,
    threshold: number = RELEVANCE_THRESHOLD
): Promise<ChunkWithScore[]> {
    try {
        // Load all chunks with their documents
        const chunks = await prisma.chunk.findMany({
            include: {
                document: true,
            },
        });

        // Calculate similarity scores for each chunk
        const chunksWithScores: ChunkWithScore[] = chunks.map((chunk) => ({
            chunk,
            score: cosineSimilarity(queryEmbedding, chunk.embedding),
        }));

        // Filter by relevance threshold
        const relevantChunks = chunksWithScores.filter(item => item.score >= threshold);

        // Sort by score descending and take top K
        relevantChunks.sort((a, b) => b.score - a.score);

        const results = relevantChunks.slice(0, topK);

        // Log relevance metrics for monitoring
        if (results.length > 0) {
            const avgScore = results.reduce((sum, item) => sum + item.score, 0) / results.length;
            console.log(`[VectorSearch] Found ${results.length} relevant chunks (avg similarity: ${(avgScore * 100).toFixed(1)}%)`);
        } else {
            console.log(`[VectorSearch] No chunks found above threshold ${threshold}`);
        }

        return results;
    } catch (error: any) {
        throw new DatabaseError(error.message || 'Failed to retrieve chunks');
    }
}
