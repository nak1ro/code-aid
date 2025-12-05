export const COLORS = {
    // Base Palette
    background: '#0a0612',
    foreground: '#f0f0f5',

    // Brand Colors
    violet: {
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        900: '#4c1d95',
        950: '#2e1065',
    },
    purple: {
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        900: '#581c87',
        950: '#3b0764',
    },
    fuchsia: {
        200: '#f5d0fe',
        400: '#e879f9',
        600: '#c026d3',
    },
    cyan: {
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        900: '#164e63',
    },
    emerald: {
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        900: '#064e3b',
    },
    red: {
        300: '#fca5a5',
        500: '#ef4444',
        900: '#7f1d1d',
    },
    indigo: {
        900: '#312e81',
        950: '#1e1b4b',
    }
} as const;

export const GRADIENTS = {
    primary: 'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600',
    primaryText: 'bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200',
    userMessage: 'bg-gradient-to-br from-violet-600 to-purple-600',
    assistantMessage: 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60',
    sourceCard: 'bg-gradient-to-br from-purple-950/50 to-indigo-950/50',
    loading: 'bg-gradient-to-br from-purple-900/60 to-indigo-900/60',
    matchBadge: 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50',
} as const;

export const SHADOWS = {
    primary: 'shadow-lg shadow-purple-500/50',
    secondary: 'shadow-lg shadow-purple-900/30',
    glow: 'shadow-sm shadow-purple-500/20',
} as const;

export const BORDERS = {
    primary: 'border-purple-500/20',
    secondary: 'border-purple-500/30',
    highlight: 'ring-1 ring-purple-400/30',
} as const;

export const BUTTON_VARIANTS = {
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
} as const;

export const BADGE_VARIANTS = {
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
} as const;

export const INPUT_STYLES = {
    base: `
        bg-gradient-to-br from-purple-950/50 to-indigo-950/50
        border border-purple-500/30 
        text-purple-50 
        placeholder-purple-300/40
        focus:outline-none 
        focus:ring-2 focus:ring-purple-500/50
        focus:border-purple-400/50
        focus:shadow-lg focus:shadow-purple-500/20
        backdrop-blur-sm
    `,
    error: 'border-red-500/50 focus:ring-red-500/50 focus:border-red-400/50',
} as const;

export const MODAL_STYLES = {
    overlay: 'bg-black/60 backdrop-blur-sm',
    content: `
        bg-gradient-to-br from-purple-950/95 via-indigo-950/95 to-purple-950/95
        backdrop-blur-xl
        border border-purple-500/30
        shadow-2xl shadow-purple-900/50
        ring-1 ring-purple-400/20
    `,
} as const;
