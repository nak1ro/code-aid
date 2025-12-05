import { InputHTMLAttributes } from 'react';
import { INPUT_STYLES } from '@/lib/theme';

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
                    ${INPUT_STYLES.base}
                    rounded-full
                    transition-all duration-300
                    ${error ? INPUT_STYLES.error : ''} 
                    ${className}
                `}
                {...props}
            />
            {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
        </div>
    );
}
