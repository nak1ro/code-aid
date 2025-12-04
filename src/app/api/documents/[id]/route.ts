import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { handleAPIError, successResponse } from '@/lib/apiResponse';
import { ValidationError } from '@/lib/errors';

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { id } = params;

        if (!id) {
            throw new ValidationError('Document ID is required');
        }

        // Delete document (chunks will be cascaded)
        await prisma.document.delete({
            where: { id },
        });

        return successResponse({ success: true, id });
    } catch (error: any) {
        // Handle case where document doesn't exist
        if (error.code === 'P2025') {
            return handleAPIError(new ValidationError('Document not found'));
        }
        return handleAPIError(error);
    }
}
