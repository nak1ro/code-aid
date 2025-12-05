'use client';

import { ChunkWithScore } from '@/types';
import { SourceChunks } from './SourceChunks';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { GRADIENTS, BORDERS } from '@/lib/theme';

interface MessageBubbleProps {
    messageId: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: ChunkWithScore[];
    timestamp: Date;
}

export function MessageBubble({ messageId, role, content, sources, timestamp }: MessageBubbleProps) {
    const isUser = role === 'user';
    const [feedbackGiven, setFeedbackGiven] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFeedback = async (rating: number) => {
        if (feedbackGiven !== null || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId, rating }),
            });

            if (response.ok) {
                setFeedbackGiven(rating);
            }
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
            <div
                className={`
                    max-w-[85%] rounded-2xl px-5 py-4
                    ${isUser
                        ? `${GRADIENTS.userMessage} 
                           text-white rounded-tr-none 
                           shadow-lg shadow-violet-500/30
                           ring-1 ring-violet-400/30`
                        : `${GRADIENTS.assistantMessage} 
                           text-purple-50 rounded-tl-none 
                           border ${BORDERS.secondary}
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

                {/* Feedback buttons for assistant messages */}
                {!isUser && messageId !== 'welcome' && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-purple-500/20">
                        <span className="text-xs text-purple-300/60">Helpful?</span>
                        <button
                            onClick={() => handleFeedback(5)}
                            disabled={isSubmitting || feedbackGiven !== null}
                            className={`
                                p-1.5 rounded transition-all duration-200
                                ${feedbackGiven === 5
                                    ? 'bg-emerald-500/30 text-emerald-300'
                                    : 'hover:bg-purple-500/20 text-purple-300/60 hover:text-purple-200'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                            title="Thumbs up"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleFeedback(1)}
                            disabled={isSubmitting || feedbackGiven !== null}
                            className={`
                                p-1.5 rounded transition-all duration-200
                                ${feedbackGiven === 1
                                    ? 'bg-red-500/30 text-red-300'
                                    : 'hover:bg-purple-500/20 text-purple-300/60 hover:text-purple-200'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                            title="Thumbs down"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                            </svg>
                        </button>
                        {feedbackGiven !== null && (
                            <span className="text-xs text-emerald-400/80 ml-1">Thanks for your feedback!</span>
                        )}
                    </div>
                )}

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
