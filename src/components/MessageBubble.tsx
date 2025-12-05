'use client';

import { ChunkWithScore } from '@/types';
import { SourceChunks } from './SourceChunks';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    sources?: ChunkWithScore[];
    timestamp: Date;
}

export function MessageBubble({ role, content, sources, timestamp }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
            <div
                className={`
                    max-w-[85%] rounded-2xl px-5 py-4
                    ${isUser
                        ? `bg-gradient-to-br from-violet-600 to-purple-600 
                           text-white rounded-tr-none 
                           shadow-lg shadow-violet-500/30
                           ring-1 ring-violet-400/30`
                        : `bg-gradient-to-br from-purple-900/60 to-indigo-900/60 
                           text-purple-50 rounded-tl-none 
                           border border-purple-500/30
                           shadow-lg shadow-purple-900/30
                           ring-1 ring-purple-400/10`
                    }
                `}
            >
                <div className="prose prose-invert prose-sm max-w-none">
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{content}</p>
                    ) : (
                        <ReactMarkdown>{content}</ReactMarkdown>
                    )}
                </div>

                {!isUser && sources && <SourceChunks sources={sources} />}

                <div
                    className={`
                        text-[10px] mt-2 opacity-60 text-right
                        ${isUser ? 'text-violet-100' : 'text-purple-300'}
                    `}
                >
                    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}
