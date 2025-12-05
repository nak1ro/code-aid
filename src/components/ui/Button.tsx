import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

    const variantStyles = {
        primary: `
            bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 
            hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500
            text-white 
            shadow-lg shadow-purple-500/30
            hover:shadow-xl hover:shadow-purple-500/50
            ring-1 ring-purple-400/30
            hover:ring-purple-400/50
            before:absolute before:inset-0 
            before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0
            before:translate-x-[-200%] hover:before:translate-x-[200%]
            before:transition-transform before:duration-700
        `,
        secondary: `
            bg-gradient-to-br from-purple-950/60 to-indigo-950/60 
            hover:from-purple-900/70 hover:to-indigo-900/70
            text-purple-100 
            border border-purple-500/30
            hover:border-purple-400/50
            shadow-lg shadow-purple-900/20
            hover:shadow-xl hover:shadow-purple-500/30
        `,
        danger: `
            bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 
            hover:from-red-500 hover:via-rose-500 hover:to-pink-500
            text-white 
            shadow-lg shadow-red-500/30
            hover:shadow-xl hover:shadow-red-500/50
            ring-1 ring-red-400/30
            hover:ring-red-400/50
        `,
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
}
