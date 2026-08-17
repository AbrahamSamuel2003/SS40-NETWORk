import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/admin'];

// Paths that should redirect to home if authenticated
const authPaths = ['/login'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('admin_session')?.value;

    // Check if path is protected
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    const isAuthPath = authPaths.some(path => pathname.startsWith(path));

    // Redirect authenticated users away from auth pages
    if (isAuthPath && token) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Redirect unauthenticated users to login
    if (isProtectedPath && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths except static files, API routes that don't need auth, and public routes
        '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
