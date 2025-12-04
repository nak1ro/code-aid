import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { handleAPIError, successResponse } from '@/lib/apiResponse';
import { validateFile } from '@/lib/validation';
import { ValidationError, DatabaseError } from '@/lib/errors';
import { extractText } from '@/services/fileProcessingService';
import { chunkText } from '@/services/chunkingService';
import { generateEmbeddings } from '@/services/embeddingService';
import { UploadResponse } from '@/types';

export async function POST(request: NextRequest) {
    try {
        // Step 1: Parse multipart form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            throw new ValidationError('No file provided');
        }

        // Step 2: Validate file
        validateFile(file);

        // Step 3: Extract text from file
        const text = await extractText(file);

        if (!text || text.trim().length === 0) {
            throw new ValidationError('File appears to be empty or contains no extractable text');
        }

        // Step 4: Chunk the text
        const chunks = chunkText(text);

        if (chunks.length === 0) {
            throw new ValidationError('No text chunks could be created from the file');
        }

        // Step 5: Generate embeddings for all chunks
        const embeddings = await generateEmbeddings(chunks);

        // Step 6: Store document and chunks in database (transaction)
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Create document
            const document = await tx.document.create({
                data: {
                    filename: file.name,
                    fileType: file.type || 'unknown',
                    fileSize: file.size,
                },
            });

            // Create chunks with embeddings
            await tx.chunk.createMany({
                data: chunks.map((content, index) => ({
                    content,
                    embedding: embeddings[index],
                    documentId: document.id,
                })),
            });

            return document;
        });

        // Step 7: Return success response
        const response: UploadResponse = {
            success: true,
            document: result,
            chunksCreated: chunks.length,
        };

        return successResponse(response, 201);
    } catch (error) {
        return handleAPIError(error);
    }
}
