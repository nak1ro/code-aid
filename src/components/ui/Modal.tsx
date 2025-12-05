import { HTMLAttributes, ReactNode } from 'react';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className={`
                    relative w-full max-w-3xl max-h-[80vh] 
                    bg-gradient-to-br from-purple-950/95 via-indigo-950/95 to-purple-950/95
                    backdrop-blur-xl
                    border border-purple-500/30
                    rounded-2xl 
                    shadow-2xl shadow-purple-900/50
                    ring-1 ring-purple-400/20
                    overflow-hidden
                    ${className}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                    <h2 className="text-xl font-semibold text-purple-100">{title}</h2>
                    <button
                        onClick={onClose}
                        className="
                            p-2 
                            text-purple-400/70 
                            hover:text-purple-200 
                            hover:bg-purple-500/10 
                            rounded-lg 
                            transition-all duration-300
                            hover:shadow-lg hover:shadow-purple-500/20
                        "
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(80vh-5rem)] p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
