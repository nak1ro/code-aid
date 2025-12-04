import { NextRequest } from 'next/server';
import { handleAPIError, successResponse } from '@/lib/apiResponse';
import { validateAskRequest } from '@/lib/validation';
import { answerQuestion } from '@/services/ragService';
import { z } from 'zod';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request
        const { question } = validateAskRequest(body);

        // Execute RAG pipeline
        const response = await answerQuestion(question);

        return successResponse(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return handleAPIError(error.errors[0]);
        }
        return handleAPIError(error);
    }
}
