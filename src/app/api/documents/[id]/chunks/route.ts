import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { handleAPIError, successResponse } from '@/lib/apiResponse';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { id } = params;

        const chunks = await prisma.chunk.findMany({
            where: {
                documentId: id,
            },
            select: {
                id: true,
                content: true,
                embedding: true,
            },
            orderBy: {
                id: 'asc',
            },
        });

        return successResponse({ chunks });
    } catch (error) {
        return handleAPIError(error);
    }
}
