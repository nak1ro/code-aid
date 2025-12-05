'use client';

import { useState, useRef, DragEvent } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SUPPORTED_FILE_EXTENSIONS } from '@/lib/validation';

interface FileUploadProps {
    onUploadSuccess: () => void;
}

type UploadStage = 'idle' | 'extracting' | 'embedding' | 'saving';

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStage, setUploadStage] = useState<UploadStage>('idle');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        setMessage(null);

        try {
            setUploadStage('extracting');
            await new Promise(resolve => setTimeout(resolve, 300));

            const formData = new FormData();
            formData.append('file', file);

            setUploadStage('embedding');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            setUploadStage('saving');

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Upload failed');
            }

            const data = await response.json();

            setMessage({
                type: 'success',
                text: `✓ File uploaded successfully: ${file.name} (${data.chunksCreated} chunks created)`,
            });

            onUploadSuccess();

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: `✗ ${error.message}`,
            });
        } finally {
            setIsUploading(false);
            setUploadStage('idle');
        }
    };

    const getStageText = () => {
        switch (uploadStage) {
            case 'extracting':
                return 'Extracting text...';
            case 'embedding':
                return 'Generating embeddings...';
            case 'saving':
                return 'Saving to database...';
            default:
                return 'Processing file...';
        }
    };

    return (
        <Card>
            <div
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center 
                    transition-all duration-300 cursor-pointer
                    ${isDragging
                        ? 'border-violet-400 bg-violet-500/20 shadow-lg shadow-violet-500/30'
                        : 'border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-500/5'
                    } 
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    accept={SUPPORTED_FILE_EXTENSIONS.join(',')}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full shadow-lg shadow-purple-500/50"></div>
                        <p className="text-purple-200 font-medium">{getStageText()}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <svg
                            className="h-12 w-12 text-purple-400/60"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div>
                            <p className="text-purple-100 font-medium mb-1">
                                Drag and drop a file here, or click to select
                            </p>
                            <p className="text-sm text-purple-300/60">
                                Supported: {SUPPORTED_FILE_EXTENSIONS.join(', ')}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {message && (
                <div
                    className={`
                        mt-4 p-3 rounded-lg border backdrop-blur-sm
                        ${message.type === 'success'
                            ? 'bg-emerald-900/30 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20'
                            : 'bg-red-900/30 border-red-500/40 text-red-300 shadow-sm shadow-red-500/20'
                        }
                    `}
                >
                    {message.text}
                </div>
            )}
        </Card>
    );
}
