import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-purple-200 mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={`
                    w-full px-4 py-2.5 
                    bg-gradient-to-br from-purple-950/50 to-indigo-950/50
                    border border-purple-500/30 
                    rounded-lg 
                    text-purple-50 
                    placeholder-purple-300/40
                    focus:outline-none 
                    focus:ring-2 focus:ring-purple-500/50
                    focus:border-purple-400/50
                    focus:shadow-lg focus:shadow-purple-500/20
                    transition-all duration-300
                    backdrop-blur-sm
                    ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-400/50' : ''} 
                    ${className}
                `}
                {...props}
            />
            {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        </div>
    );
}
