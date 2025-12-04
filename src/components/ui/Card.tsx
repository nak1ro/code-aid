import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
    return (
        <div
            className={`bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 shadow-xl ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
