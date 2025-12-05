// Database Models (matching Prisma schema)
export interface Document {
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    uploadedAt: Date;
}

export interface Chunk {
    id: string;
    content: string;
    embedding: number[];
    documentId: string;
    document?: Document;
}

// API Request/Response Types
export interface UploadResponse {
    success: boolean;
    document: Document;
    chunksCreated: number;
}

export interface DocumentListResponse {
    documents: (Document & { chunkCount: number })[];
}

export interface AskRequest {
    question: string;
}

export interface RAGResponse {
    answer: string;
    sources: ChunkWithScore[];
    question: string;
}

export interface ChunkWithScore {
    chunk: Chunk & { document: Document };
    score: number;
}

// Feedback Types
export interface Feedback {
    id: string;
    messageId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
}

export interface FeedbackRequest {
    messageId: string;
    rating: number;
    comment?: string;
}

export interface FeedbackResponse {
    success: boolean;
    feedback: Feedback;
}

// Error Types
export interface APIError {
    error: string;
    message: string;
    statusCode: number;
}
