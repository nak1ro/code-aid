import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { handleAPIError, successResponse } from '@/lib/apiResponse';
import { z } from 'zod';
import { FeedbackResponse } from '@/types';

const feedbackSchema = z.object({
    messageId: z.string().min(1, 'Message ID is required'),
    rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
    comment: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request
        const validatedData = feedbackSchema.parse(body);

        // Save feedback to database
        const feedback = await prisma.feedback.create({
            data: {
                messageId: validatedData.messageId,
                rating: validatedData.rating,
                comment: validatedData.comment || null,
            },
        });

        const response: FeedbackResponse = {
            success: true,
            feedback: {
                id: feedback.id,
                messageId: feedback.messageId,
                rating: feedback.rating,
                comment: feedback.comment || undefined,
                createdAt: feedback.createdAt,
            },
        };

        return successResponse(response, 201);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return handleAPIError(error.errors[0]);
        }
        return handleAPIError(error);
    }
}
