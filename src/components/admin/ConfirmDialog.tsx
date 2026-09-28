'use client';

import * as React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

export function ConfirmDialog({
    isOpen,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = true,
    isLoading = false,
    onConfirm,
    onCancel
}: ConfirmDialogProps) {
    React.useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isLoading, onCancel]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => {
                if (!isLoading) onCancel();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200/90 overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className={cn(
                                "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border",
                                isDestructive
                                    ? "bg-rose-50 text-rose-600 border-rose-200"
                                    : "bg-[#EDF5F2] text-[#0F766E] border-[#0F766E]/20"
                            )}
                        >
                            {isDestructive ? (
                                <Trash2 className="w-5 h-5" />
                            ) : (
                                <AlertTriangle className="w-5 h-5" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0 pr-2">
                            <h3 id="confirm-dialog-title" className="text-base font-extrabold text-[#0F172A] tracking-tight">
                                {title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={onCancel}
                            aria-label="Close dialog"
                            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={onCancel}
                            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={onConfirm}
                            className={cn(
                                "px-4.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60",
                                isDestructive
                                    ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
                                    : "bg-[#0F766E] hover:bg-[#115E59] active:bg-[#134E4A]"
                            )}
                        >
                            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{confirmText}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
