'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';
import { Modal } from './ui/Modal';
import { DocumentListResponse } from '@/types';
import { GRADIENTS, BORDERS, SHADOWS } from '@/lib/theme';

interface DocumentListProps {
    refreshTrigger: number;
}

interface Chunk {
    id: string;
    content: string;
    embedding: number[];
}

export function DocumentList({ refreshTrigger }: DocumentListProps) {
    const [documents, setDocuments] = useState<DocumentListResponse['documents']>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [loadingChunks, setLoadingChunks] = useState(false);

    const fetchDocuments = async () => {
        try {
            const response = await fetch('/api/documents');
            if (response.ok) {
                const data = await response.json();
                setDocuments(data.documents);
            }
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [refreshTrigger]);

    const fetchChunks = async (docId: string) => {
        setLoadingChunks(true);
        try {
            const response = await fetch(`/api/documents/${docId}/chunks`);
            if (response.ok) {
                const data = await response.json();
                setChunks(data.chunks || []);
            }
        } catch (error) {
            console.error('Failed to fetch chunks:', error);
            setChunks([]);
        } finally {
            setLoadingChunks(false);
        }
    };

    const handleBadgeClick = (docId: string) => {
        setSelectedDocId(docId);
        fetchChunks(docId);
    };

    const handleCloseModal = () => {
        setSelectedDocId(null);
        setChunks([]);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;

        setDeletingId(id);
        try {
            const response = await fetch(`/api/documents/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setDocuments((prev) => prev.filter((doc) => doc.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete document:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: Date | string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner />
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-8 text-purple-300/60">
                <p>No documents uploaded yet.</p>
            </div>
        );
    }

    const selectedDoc = documents.find(doc => doc.id === selectedDocId);

    return (
        <>
            <div className="space-y-3">
                {documents.map((doc) => (
                    <Card key={doc.id} className="p-4 flex items-center justify-between group hover:scale-[1.01] transition-transform">
                        <div className="min-w-0 flex-1 mr-4">
                            <div className="flex-col items-start mb-4">
                                <h3 className="font-medium mb-3 text-purple-100 truncate" title={doc.filename}>
                                    {doc.filename}
                                </h3>
                                <button onClick={() => handleBadgeClick(doc.id)} className="cursor-pointer">
                                    <Badge variant="info">{doc.fileType.split('/').pop()}</Badge>
                                </button>
                            </div>
                            <div className="text-xs text-purple-300/60 flex gap-3">
                                <span>{formatFileSize(doc.fileSize)}</span>
                                <span>•</span>
                                <span>{formatDate(doc.uploadedAt)}</span>
                                <span>•</span>
                                <span>{doc.chunkCount} chunks</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(doc.id)}
                            disabled={deletingId === doc.id}
                            className="
                                p-2
                                text-purple-400/70
                                hover:text-red-400
                                hover:bg-red-900/20
                                rounded-lg
                                transition-all duration-300
                                opacity-0 group-hover:opacity-100
                                focus:opacity-100
                                hover:shadow-lg hover:shadow-red-500/30
                            "
                            title="Delete document"
                        >
                            {deletingId === doc.id ? (
                                <Spinner size="sm" />
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </button>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={selectedDocId !== null}
                onClose={handleCloseModal}
                title={`Chunks: ${selectedDoc?.filename || ''}`}
            >
                {loadingChunks ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : chunks.length > 0 ? (
                    <div className="space-y-4">
                        {chunks.map((chunk, index) => (
                            <div
                                key={chunk.id}
                                className={`
                                    ${GRADIENTS.sourceCard}
                                    rounded-lg p-4 
                                    border ${BORDERS.secondary}
                                    ${SHADOWS.glow}
                                    backdrop-blur-sm
                                `}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-purple-300">
                                        Chunk {index + 1}
                                    </span>
                                    <span className="
                                        text-xs px-2 py-1 
                                        bg-violet-900/40 
                                        border border-violet-500/30 
                                        rounded-md
                                        text-violet-300
                                    ">
                                        {chunk.content.length} chars
                                    </span>
                                </div>
                                <div className="
                                    text-sm text-purple-200/90 font-mono 
                                    bg-black/30 p-3 rounded 
                                    overflow-x-auto whitespace-pre-wrap
                                    border border-purple-500/10
                                    max-h-60 overflow-y-auto
                                ">
                                    {chunk.content}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-purple-300/60">
                        <p>No chunks found for this document.</p>
                    </div>
                )}
            </Modal>
        </>
    );
}
