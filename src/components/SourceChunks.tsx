'use client';

import { ChunkWithScore } from '@/types';
import { useState } from 'react';

interface SourceChunksProps {
    sources: ChunkWithScore[];
}

export function SourceChunks({ sources }: SourceChunksProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-4 border-t border-zinc-800 pt-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
            >
                <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
                {sources.length} Source{sources.length !== 1 ? 's' : ''} Used
            </button>

            {isExpanded && (
                <div className="mt-3 space-y-3">
                    {sources.map((item, index) => (
                        <div key={item.chunk.id} className="bg-zinc-900/50 rounded-lg p-3 text-xs border border-zinc-800">
                            <div className="flex justify-between items-center mb-2 text-zinc-400">
                                <span className="font-medium text-blue-400">{item.chunk.document?.filename}</span>
                                <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">
                                    Match: {(item.score * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="text-zinc-300 font-mono bg-black/30 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                                {item.chunk.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
