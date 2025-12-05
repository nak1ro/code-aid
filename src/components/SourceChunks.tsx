'use client';

import { ChunkWithScore } from '@/types';
import { useState } from 'react';
import { GRADIENTS, BORDERS, SHADOWS } from '@/lib/theme';

interface SourceChunksProps {
    sources: ChunkWithScore[];
}

export function SourceChunks({ sources }: SourceChunksProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-4 border-t border-purple-500/20 pt-3">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="
                    flex items-center gap-2 
                    text-xs font-medium 
                    text-purple-300/70 
                    hover:text-purple-200 
                    transition-colors duration-300
                "
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
                        <div
                            key={item.chunk.id}
                            className={`
                                ${GRADIENTS.sourceCard}
                                rounded-lg p-3 text-xs 
                                border ${BORDERS.secondary}
                                ${SHADOWS.glow}
                                backdrop-blur-sm
                            `}
                        >
                            <div className="flex justify-between items-center mb-2 text-purple-300/70">
                                <span className="font-medium text-violet-300">{item.chunk.document?.filename}</span>
                                <span className={`
                                    ${GRADIENTS.matchBadge}
                                    px-2 py-0.5 rounded text-[10px]
                                    border border-cyan-500/30
                                    text-cyan-300
                                    shadow-sm shadow-cyan-500/20
                                `}>
                                    Match: {(item.score * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="
                                text-purple-200/90 font-mono 
                                bg-black/30 p-2 rounded 
                                overflow-x-auto whitespace-pre-wrap
                                border border-purple-500/10
                            ">
                                {item.chunk.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
