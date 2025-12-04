import OpenAI from 'openai';
import { config, EMBEDDING_MODEL } from '@/lib/config';
import { OpenAIError } from '@/lib/errors';

const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
});

/**
 * Generate embedding for a single text string
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: text,
        });

        return response.data[0].embedding;
    } catch (error: any) {
        throw new OpenAIError(error.message || 'Failed to generate embedding');
    }
}

/**
 * Generate embeddings for multiple text strings (batch)
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
        const response = await openai.embeddings.create({
            model: EMBEDDING_MODEL,
            input: texts,
        });

        return response.data.map((item) => item.embedding);
    } catch (error: any) {
        throw new OpenAIError(error.message || 'Failed to generate embeddings');
    }
}
