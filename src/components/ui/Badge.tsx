interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'info';
    className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const variantStyles = {
        default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        success: 'bg-green-900/30 text-green-400 border-green-800',
        warning: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
        info: 'bg-blue-900/30 text-blue-400 border-blue-800',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
