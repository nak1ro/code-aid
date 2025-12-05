import { z } from 'zod';

const configSchema = z.object({
    DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
    OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
});

// Validate environment variables on startup
const envValidation = configSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});

if (!envValidation.success) {
    console.error('❌ Invalid environment variables:');
    envValidation.error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    throw new Error('Invalid environment variables. Please check your .env file.');
}

export const config = envValidation.data;

// Application constants
export const CHUNK_SIZE = 800;
export const CHUNK_OVERLAP = 100;
export const TOP_K = 5;
export const RELEVANCE_THRESHOLD = 0.5; // Minimum similarity score to consider a chunk relevant
export const EMBEDDING_MODEL = 'text-embedding-3-small';
export const CHAT_MODEL = 'gpt-4-turbo';
export const EMBEDDING_DIMENSIONS = 1536; // text-embedding-3-small dimension
