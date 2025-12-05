import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { FileProcessingError } from '@/lib/errors';

/**
 * Extract text from various file formats
 */
export async function extractText(file: File): Promise<string> {
    const filename = file.name.toLowerCase();
    const fileType = file.type;

    try {
        // Plain text files
        if (
            fileType.startsWith('text/') ||
            filename.endsWith('.txt') ||
            filename.endsWith('.js') ||
            filename.endsWith('.ts') ||
            filename.endsWith('.py') ||
            filename.endsWith('.java') ||
            filename.endsWith('.log') ||
            filename.endsWith('.md')
        ) {
            return await file.text();
        }

        // Word documents (.docx)
        if (
            filename.endsWith('.docx') ||
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        }

        // Excel files (.xlsx)
        if (
            filename.endsWith('.xlsx') ||
            fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // Extract text from all sheets
            const textParts: string[] = [];
            workbook.SheetNames.forEach((sheetName) => {
                const sheet = workbook.Sheets[sheetName];
                const sheetText = XLSX.utils.sheet_to_txt(sheet);
                textParts.push(`[Sheet: ${sheetName}]\n${sheetText}`);
            });

            return textParts.join('\n\n');
        }

        // Unsupported file type
        throw new FileProcessingError(
            `Unsupported file type: ${filename}. Supported formats: .txt, .js, .ts, .py, .java, .log, .md, .docx, .xlsx`
        );
    } catch (error: any) {
        if (error instanceof FileProcessingError) {
            throw error;
        }
        throw new FileProcessingError(
            `Failed to extract text from ${filename}: ${error.message}`
        );
    }
}
