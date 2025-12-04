import { z } from 'zod';

// File upload validation
export const SUPPORTED_FILE_TYPES = [
    'text/plain',
    'application/javascript',
    'text/javascript',
    'application/typescript',
    'text/x-python',
    'text/x-java-source',
    'text/x-log',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

export const SUPPORTED_FILE_EXTENSIONS = [
    '.txt', '.js', '.ts', '.py', '.java', '.log', '.md', '.docx', '.xlsx'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_QUESTION_LENGTH = 1000;

export const fileValidationSchema = z.object({
    name: z.string().min(1, 'Filename is required'),
    size: z.number().max(MAX_FILE_SIZE, 'File size must be less than 10MB'),
    type: z.string().refine(
        (type) => {
            // Check if the MIME type is in supported list or starts with text/
            return SUPPORTED_FILE_TYPES.includes(type as any) || type.startsWith('text/');
        },
        'Unsupported file type'
    ),
});

export const askRequestSchema = z.object({
    question: z
        .string()
        .min(1, 'Question cannot be empty')
        .max(MAX_QUESTION_LENGTH, `Question must be less than ${MAX_QUESTION_LENGTH} characters`),
});

export function validateFile(file: File) {
    try {
        return fileValidationSchema.parse({
            name: file.name,
            size: file.size,
            type: file.type,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.errors[0].message);
        }
        throw error;
    }
}

export function validateAskRequest(data: unknown) {
    return askRequestSchema.parse(data);
}
