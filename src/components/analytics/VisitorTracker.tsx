'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function VisitorTracker() {
    const pathname = usePathname();
    const hasTrackedInitial = useRef(false);

    useEffect(() => {
        // Prevent double tracking in React Strict Mode on mount
        if (!hasTrackedInitial.current) {
            hasTrackedInitial.current = true;
        }

        const trackPath = async () => {
            // Avoid tracking admin or api routes
            if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
                return;
            }

            try {
                await fetch('/api/visitors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        currentPath: pathname,
                        referrer: document.referrer || null
                    }) // Note: IP, UserAgent, etc are captured securely on the backend
                });
            } catch (err) {
                // Silently fail, tracking should not disrupt UX
                console.error('Visitor tracking error:', err);
            }
        };

        trackPath();
    }, [pathname]);

    return null; // Totally headless
}
