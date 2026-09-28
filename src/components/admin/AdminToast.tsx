'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    title?: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: ToastItem[];
    addToast: (toast: Omit<ToastItem, 'id'>) => string;
    removeToast: (id: string) => void;
    success: (message: string, title?: string) => string;
    error: (message: string, title?: string) => string;
    info: (message: string, title?: string) => string;
    warning: (message: string, title?: string) => string;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

let toastDispatchers: {
    addToast: (toast: Omit<ToastItem, 'id'>) => string;
    removeToast: (id: string) => void;
} | null = null;

export const toast = {
    success: (message: string, title?: string) => {
        return toastDispatchers?.addToast({ type: 'success', message, title }) || '';
    },
    error: (message: string, title?: string) => {
        return toastDispatchers?.addToast({ type: 'error', message, title }) || '';
    },
    info: (message: string, title?: string) => {
        return toastDispatchers?.addToast({ type: 'info', message, title }) || '';
    },
    warning: (message: string, title?: string) => {
        return toastDispatchers?.addToast({ type: 'warning', message, title }) || '';
    },
    dismiss: (id: string) => {
        toastDispatchers?.removeToast(id);
    }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastItem[]>([]);

    const removeToast = React.useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = React.useCallback((item: Omit<ToastItem, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        const duration = item.duration ?? 3500;
        const newToast: ToastItem = { ...item, id };

        setToasts(prev => [...prev.slice(-4), newToast]); // keep max 5 toasts

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    React.useEffect(() => {
        toastDispatchers = { addToast, removeToast };
        return () => {
            toastDispatchers = null;
        };
    }, [addToast, removeToast]);

    const success = React.useCallback((message: string, title?: string) => addToast({ type: 'success', message, title }), [addToast]);
    const error = React.useCallback((message: string, title?: string) => addToast({ type: 'error', message, title }), [addToast]);
    const info = React.useCallback((message: string, title?: string) => addToast({ type: 'info', message, title }), [addToast]);
    const warning = React.useCallback((message: string, title?: string) => addToast({ type: 'warning', message, title }), [addToast]);

    const contextValue = React.useMemo(() => ({
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
        warning
    }), [toasts, addToast, removeToast, success, error, info, warning]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div
                aria-live="polite"
                aria-label="Notifications"
                className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0"
            >
                {toasts.map(t => {
                    const isSuccess = t.type === 'success';
                    const isError = t.type === 'error';
                    const isWarning = t.type === 'warning';

                    const Icon = isSuccess
                        ? CheckCircle2
                        : isError
                        ? AlertCircle
                        : isWarning
                        ? AlertTriangle
                        : Info;

                    return (
                        <div
                            key={t.id}
                            className={cn(
                                "pointer-events-auto relative overflow-hidden rounded-2xl p-4 shadow-xl border bg-white flex items-start gap-3.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3",
                                isSuccess && "border-[#0F766E]/30 shadow-[#0F766E]/5",
                                isError && "border-rose-200 shadow-rose-500/5",
                                isWarning && "border-amber-200 shadow-amber-500/5",
                                !isSuccess && !isError && !isWarning && "border-gray-200"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                                    isSuccess && "bg-[#EDF5F2] text-[#0F766E] border-[#0F766E]/20",
                                    isError && "bg-rose-50 text-rose-600 border-rose-200",
                                    isWarning && "bg-amber-50 text-amber-600 border-amber-200",
                                    !isSuccess && !isError && !isWarning && "bg-gray-50 text-gray-600 border-gray-200"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0 pr-2 pt-0.5">
                                {t.title && (
                                    <h4 className="text-xs font-extrabold text-[#0F172A] leading-tight mb-0.5">
                                        {t.title}
                                    </h4>
                                )}
                                <p className="text-xs font-semibold text-gray-600 leading-snug break-words">
                                    {t.message}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => removeToast(t.id)}
                                aria-label="Dismiss notification"
                                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        return toast;
    }
    return context;
}
