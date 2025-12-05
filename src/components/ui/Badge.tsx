interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'info';
    className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const variantStyles = {
        default: `
            bg-gradient-to-r from-purple-900/40 to-indigo-900/40
            text-purple-200 
            border-purple-500/30
            shadow-sm shadow-purple-500/20
        `,
        success: `
            bg-gradient-to-r from-emerald-900/40 to-green-900/40
            text-emerald-300 
            border-emerald-500/30
            shadow-sm shadow-emerald-500/20
        `,
        warning: `
            bg-gradient-to-r from-amber-900/40 to-yellow-900/40
            text-amber-300 
            border-amber-500/30
            shadow-sm shadow-amber-500/20
        `,
        info: `
            bg-gradient-to-r from-cyan-900/40 to-blue-900/40
            text-cyan-300 
            border-cyan-500/30
            shadow-sm shadow-cyan-500/20
        `,
    };

    return (
        <span
            className={`
                inline-flex items-center px-2.5 py-0.5 
                rounded-md text-xs font-medium 
                border backdrop-blur-sm
                ${variantStyles[variant]} 
                ${className}
            `}
        >
            {children}
        </span>
    );
}
