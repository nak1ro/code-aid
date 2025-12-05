import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
    return (
        <div
            className={`
                relative
                bg-gradient-to-br from-purple-950/40 via-indigo-950/30 to-purple-950/40
                backdrop-blur-xl
                border border-purple-500/20
                rounded-xl 
                p-6 
                shadow-2xl shadow-purple-900/20
                hover:shadow-purple-500/30 hover:border-purple-400/30
                transition-all duration-300
                ring-1 ring-purple-400/10
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
}
