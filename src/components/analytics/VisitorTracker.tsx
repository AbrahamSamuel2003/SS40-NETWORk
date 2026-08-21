'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import * as React from 'react';

export const VisitorTracker = React.memo(function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Skip tracking for admin and API routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    // Prevent double tracking in React Strict Mode
    if (lastTrackedPath.current === pathname) {
      return;
    }

    lastTrackedPath.current = pathname;

    // Track visitor using sendBeacon for non-blocking
    const data = JSON.stringify({ currentPath: pathname, referrer: document.referrer });
    const blob = new Blob([data], { type: 'application/json' });
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/visitors', blob);
    } else {
      fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
      }).catch(console.error);
    }
  }, [pathname]);

  return null; // Headless component
});
