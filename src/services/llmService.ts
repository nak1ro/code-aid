import OpenAI from 'openai';
import { config, CHAT_MODEL } from '@/lib/config';
import { OpenAIError } from '@/lib/errors';

const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are CodeAid, a helpful technical support assistant. Your role is to answer questions based on the provided context from uploaded technical documents.

Guidelines:
- Answer questions using ONLY the information provided in the context
- If the context doesn't contain enough information to answer the question, say so clearly
- Cite specific parts of the context when possible
- Be concise but thorough
- If you're unsure, admit it rather than making up information`;

/**
 * Generate an answer using OpenAI chat completion with provided context
 */
export async function generateAnswer(
    question: string,
    context: string
): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: CHAT_MODEL,
            messages: [
                {
                    role: 'system',
                    content: SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: `Context from uploaded documents:\n\n${context}\n\nQuestion: ${question}`,
                },
            ],
            temperature: 0.3,
            max_tokens: 1000,
        });

        return response.choices[0].message.content || 'No response generated';
    } catch (error: any) {
        throw new OpenAIError(error.message || 'Failed to generate answer');
    }
}
