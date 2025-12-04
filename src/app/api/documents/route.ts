import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { handleAPIError, successResponse } from '@/lib/apiResponse';
import { DocumentListResponse } from '@/types';

export async function GET(request: NextRequest) {
    try {
        const documents = await prisma.document.findMany({
            orderBy: {
                uploadedAt: 'desc',
            },
            include: {
                _count: {
                    select: {
                        chunks: true,
                    },
                },
            },
        });

        const response: DocumentListResponse = {
            documents: documents.map((doc) => ({
                id: doc.id,
                filename: doc.filename,
                fileType: doc.fileType,
                fileSize: doc.fileSize,
                uploadedAt: doc.uploadedAt,
                chunkCount: doc._count.chunks,
            })),
        };

        return successResponse(response);
    } catch (error) {
        return handleAPIError(error);
    }
}
