import { CHUNK_SIZE, CHUNK_OVERLAP } from '@/lib/config';

/**
 * Split text into chunks with overlap
 * Handles edge cases: empty files, very short files, whitespace-only files
 */
export function chunkText(
    text: string,
    chunkSize: number = CHUNK_SIZE,
    overlap: number = CHUNK_OVERLAP
): string[] {
    // Trim whitespace
    const trimmedText = text.trim();

    // Handle empty or whitespace-only files
    if (trimmedText.length === 0) {
        return [];
    }

    // Handle very short files (shorter than chunk size)
    if (trimmedText.length <= chunkSize) {
        return [trimmedText];
    }

    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < trimmedText.length) {
        // Extract chunk
        const endIndex = Math.min(startIndex + chunkSize, trimmedText.length);
        const chunk = trimmedText.substring(startIndex, endIndex);

        chunks.push(chunk);

        // Move to next chunk with overlap
        // For the last chunk, we break to avoid duplicates
        if (endIndex === trimmedText.length) {
            break;
        }

        startIndex += chunkSize - overlap;
    }

    return chunks;
}
