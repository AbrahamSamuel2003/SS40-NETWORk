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
        <div className="min-h-screen flex items-center justify-center bg-[#070707] text-white p-4">
            <Head>
                <title>Login - {companyName}</title>
            </Head>
            <div className="w-full max-w-md bg-[#111111] p-8 rounded-xl border border-white/10 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-6">
                        {(config?.uploadedLogoUrl || config?.logoUrl) ? (
                            <img
                                src={(config?.uploadedLogoUrl || config?.logoUrl) as string}
                                alt={`${companyName} Logo`}
                                className="h-16 w-auto mix-blend-multiply opacity-90 rounded-xl"
                            />
                        ) : (
                            <img
                                src="/logos/ss40-logo.jpeg"
                                alt={`${companyName} Logo`}
                                className="h-16 w-auto mix-blend-multiply opacity-90 rounded-xl"
                            />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-white/60">
                        Sign in to continue to your<br />{companyName} account.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Email or Username
                        </label>
                        <input
                            type="text"
                            required
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                            placeholder="Enter your email or username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-semibold rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-8"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                            className="text-white/50 hover:text-white transition-colors text-sm font-medium"
                        >
                            &larr; Back to Website
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
