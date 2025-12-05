'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { MessageBubble } from './MessageBubble';
import { ChunkWithScore } from '@/types';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: ChunkWithScore[];
    timestamp: Date;
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I\'m CodeAid. Upload your technical files and ask me anything about them.',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMessage.content }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get answer');
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer,
                sources: data.sources,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Sorry, I encountered an error: ${error.message}`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[600px] p-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        role={msg.role}
                        content={msg.content}
                        sources={msg.sources}
                        timestamp={msg.timestamp}
                    />
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-6">
                        <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 rounded-2xl rounded-tl-none px-5 py-4 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-sm shadow-purple-400"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75 shadow-sm shadow-purple-400"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150 shadow-sm shadow-purple-400"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-purple-500/20 bg-gradient-to-br from-purple-950/50 to-indigo-950/50 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your code..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                        Send
                    </Button>
                </form>
            </div>
        </Card>
    );
}
