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
                className={`max-w-[85%] rounded-2xl px-5 py-4 ${isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
                    }`}
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
                    className={`text-[10px] mt-2 opacity-60 ${isUser ? 'text-blue-100' : 'text-zinc-400'
                        } text-right`}
                >
                    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
        </div>
    );
}
