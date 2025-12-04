'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';
import { DocumentListResponse } from '@/types';

interface DocumentListProps {
    refreshTrigger: number;
}

export function DocumentList({ refreshTrigger }: DocumentListProps) {
    const [documents, setDocuments] = useState<DocumentListResponse['documents']>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

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
            <div className="text-center py-8 text-zinc-500">
                <p>No documents uploaded yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {documents.map((doc) => (
                <Card key={doc.id} className="p-4 flex items-center justify-between group">
                    <div className="min-w-0 flex-1 mr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-zinc-200 truncate" title={doc.filename}>
                                {doc.filename}
                            </h3>
                            <Badge variant="info">{doc.fileType.split('/').pop()}</Badge>
                        </div>
                        <div className="text-xs text-zinc-500 flex gap-3">
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
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
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
    );
}
