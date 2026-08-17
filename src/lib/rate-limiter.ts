// Simple in-memory rate limiter for login attempts
// In production, consider using Redis or a database-backed solution

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function rateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): { success: boolean; remainingAttempts: number; resetTime: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    if (!entry || now > entry.resetTime) {
        // Create new entry or reset expired one
        const newEntry: RateLimitEntry = {
            count: 1,
            resetTime: now + windowMs,
        };
        rateLimitMap.set(identifier, newEntry);
        
        // Clean up expired entries periodically
        if (rateLimitMap.size > 1000) {
            cleanupExpiredEntries(now);
        }
        
        return {
            success: true,
            remainingAttempts: maxAttempts - 1,
            resetTime: newEntry.resetTime,
        };
    }

    if (entry.count >= maxAttempts) {
        return {
            success: false,
            remainingAttempts: 0,
            resetTime: entry.resetTime,
        };
    }

    entry.count++;
    return {
        success: true,
        remainingAttempts: maxAttempts - entry.count,
        resetTime: entry.resetTime,
    };
}

function cleanupExpiredEntries(now: number) {
    for (const [key, entry] of rateLimitMap.entries()) {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}

// Get remaining time until rate limit resets
export function getRateLimitResetTime(identifier: string): number | null {
    const entry = rateLimitMap.get(identifier);
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.resetTime) return null;
    
    return entry.resetTime;
}
