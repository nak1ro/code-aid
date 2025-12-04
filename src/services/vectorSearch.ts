import prisma from '@/lib/prisma';
import { TOP_K } from '@/lib/config';
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
 * Suitable for datasets < 1,000 chunks
 */
export async function findSimilarChunks(
    queryEmbedding: number[],
    topK: number = TOP_K
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

        // Sort by score descending and take top K
        chunksWithScores.sort((a, b) => b.score - a.score);

        return chunksWithScores.slice(0, topK);
    } catch (error: any) {
        throw new DatabaseError(error.message || 'Failed to retrieve chunks');
    }
}
