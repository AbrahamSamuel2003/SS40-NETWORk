'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface SectionVisibilityToggleProps {
    sectionKey: string;
    sectionTitle?: string;
    sectionLabel?: string;
    pageName?: string;
    description?: string;
}

export function SectionVisibilityToggle({
    sectionKey,
    sectionTitle,
    sectionLabel,
}: SectionVisibilityToggleProps) {
    const title = sectionTitle || sectionLabel || 'Section';
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

    // Initial Fetch
    useEffect(() => {
        let isMounted = true;
        fetch('/api/admin/section-visibility')
            .then(res => res.json())
            .then(data => {
                if (isMounted && data.success && data.data) {
                    if (typeof data.data[sectionKey] === 'boolean') {
                        setIsVisible(data.data[sectionKey]);
                    }
                }
            })
            .catch(() => {})
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [sectionKey]);

    const handleToggle = async () => {
        if (isLoading || isSaving) return;
        const nextState = !isVisible;

        // 1. Instant 0-Latency Optimistic UI update
        setIsVisible(nextState);
        setIsSaving(true);
        setStatusFeedback(nextState ? 'Visible' : 'Hidden');

        try {
            const res = await fetch('/api/admin/section-visibility', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sectionKey,
                    isVisible: nextState
                })
            });
            const data = await res.json();
            if (!data.success) {
                // Revert on failure
                setIsVisible(!nextState);
                setStatusFeedback('Error');
            }
        } catch {
            // Revert on network error
            setIsVisible(!nextState);
            setStatusFeedback('Error');
        } finally {
            setIsSaving(false);
            setTimeout(() => {
                setStatusFeedback(null);
            }, 2500);
        }
    };

    return (
        <div
            className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all duration-200 shadow-2xs select-none ${
                isVisible
                    ? 'bg-white border-emerald-200/90 hover:border-emerald-300'
                    : 'bg-amber-50/70 border-amber-200/90 hover:border-amber-300'
            }`}
            title={`Toggle public visibility for ${title} on website`}
        >
            {/* Label */}
            <div className="flex items-center gap-1.5">
                {isLoading && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
                )}
                <span className="text-xs font-semibold text-[#111827] tracking-tight whitespace-nowrap">
                    {isVisible ? 'Section Active' : 'Section Hidden'}
                </span>
            </div>

            {/* Separator */}
            <span className="h-3.5 w-px bg-gray-200" />

            {/* Clean Micro Toggle Switch */}
            <button
                type="button"
                role="switch"
                aria-checked={isVisible}
                aria-label={`Toggle ${title} visibility`}
                onClick={handleToggle}
                disabled={isLoading || isSaving}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-1 disabled:opacity-60 ${
                    isVisible ? 'bg-[#0F766E]' : 'bg-gray-300'
                }`}
            >
                <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out mt-0.5 ${
                        isVisible ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                />
            </button>

            {/* Micro Toast Feedback */}
            {statusFeedback && (
                <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all ${
                        statusFeedback === 'Error'
                            ? 'bg-red-100 text-red-700'
                            : isVisible
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                    }`}
                >
                    {statusFeedback}
                </span>
            )}
        </div>
    );
}

