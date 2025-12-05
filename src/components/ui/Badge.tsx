import { BADGE_VARIANTS } from '@/lib/theme';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'info';
    className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const variantStyles = BADGE_VARIANTS;

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
