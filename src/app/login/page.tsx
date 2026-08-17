'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import type { SiteConfigData } from '@/lib/site-config';

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<SiteConfigData | null>(null);
    const [companyName, setCompanyName] = useState('SS40 NETWORK');

    useEffect(() => {
        fetch('/api/site-config')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setConfig(data.data);
                    setCompanyName(data.data.companyName || 'SS40 NETWORK');
                }
            })
            .catch(() => { });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: identifier, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.push(data.redirectTo);
                router.refresh();
            } else {
                setError(data.error || 'Login failed.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/20 p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/40 to-teal-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-200/30 to-emerald-100/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-100/20 to-transparent rounded-full blur-2xl"></div>
            
            <Head>
                <title>Login - {companyName}</title>
            </Head>
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm p-8 rounded-2xl border border-emerald-200/50 shadow-xl shadow-emerald-900/10 relative z-10 animate-fade-in">
                {/* Decorative top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-t-2xl"></div>
                
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-300/20 rounded-full blur-xl scale-150"></div>
                        {(config?.uploadedLogoUrl || config?.logoUrl) ? (
                            <img
                                src={(config?.uploadedLogoUrl || config?.logoUrl) as string}
                                alt={`${companyName} Logo`}
                                className="h-16 w-auto relative z-10 drop-shadow-lg"
                            />
                        ) : (
                            <img
                                src="/logos/ss40-logo.jpeg"
                                alt={`${companyName} Logo`}
                                className="h-16 w-auto relative z-10 drop-shadow-lg"
                            />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Welcome Back</h1>
                    <p className="text-gray-600">
                        Sign in to continue to your<br />{companyName} account.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email or Username
                        </label>
                        <input
                            type="text"
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200"
                            placeholder="Enter your email or username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg px-4 py-3 hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-8 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                    <div className="mt-6 text-center">
                        <a
                            href="/"
                            className="text-gray-500 hover:text-emerald-600 transition-colors text-sm font-medium inline-flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Website
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
