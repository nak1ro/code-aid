import { RAGResponse } from '@/types';
import { generateEmbedding } from './embeddingService';
import { findSimilarChunks } from './vectorSearch';
import { generateAnswer } from './llmService';

/**
 * RAG Pipeline: Orchestrates the complete retrieval-augmented generation flow
 * 1. Embed the question
 * 2. Retrieve similar chunks
 * 3. Construct context from chunks
 * 4. Generate answer using LLM
 */
export async function answerQuestion(question: string): Promise<RAGResponse> {
    // Step 1: Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question);

    // Step 2: Retrieve most similar chunks
    const similarChunks = await findSimilarChunks(questionEmbedding);

    // Handle case where no documents are uploaded
    if (similarChunks.length === 0) {
        return {
            answer: 'No documents have been uploaded yet. Please upload some technical files first so I can help answer your questions.',
            sources: [],
            question,
        };
    }

    // Step 3: Construct context from retrieved chunks
    const context = similarChunks
        .map((item, index) => {
            const { chunk } = item;
            return `[Source ${index + 1}: ${chunk.document.filename}]\n${chunk.content}`;
        })
        .join('\n\n---\n\n');

    // Step 4: Generate answer using LLM
    const answer = await generateAnswer(question, context);

    return {
        answer,
        sources: similarChunks,
        question,
    };
}
