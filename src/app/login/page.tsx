'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    ShieldCheck,
    Sparkles
} from 'lucide-react';
import type { SiteConfigData } from '@/lib/site-config';

// -----------------------------------------------------------------------------
// MOBILE ANIMATED VECTOR SCENE (Skyline + Cruising Car + Swaying Leaves)
// -----------------------------------------------------------------------------

function MobileAnimatedScene() {
    return (
        <div className="relative w-full h-[210px] bg-gradient-to-b from-[#D4ECE2] via-[#E4F4ED] to-[#EDF5F2] overflow-hidden select-none">
            {/* Drifting Clouds */}
            <motion.div
                animate={{ x: [-40, 360] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute top-5 left-0 opacity-60 pointer-events-none"
            >
                <div className="w-16 h-5 bg-white rounded-full blur-[1px]" />
            </motion.div>

            {/* City Skyline Silhouette in Brand Palette */}
            <div className="absolute bottom-5 inset-x-0 h-28 flex items-end justify-center pointer-events-none opacity-85">
                <svg viewBox="0 0 400 140" className="w-full h-full" preserveAspectRatio="none">
                    <rect x="30" y="50" width="35" height="90" fill="#B2D8CB" rx="2" />
                    <rect x="75" y="30" width="40" height="110" fill="#9CCBB9" rx="2" />
                    <rect x="125" y="60" width="30" height="80" fill="#B2D8CB" rx="2" />
                    <rect x="280" y="45" width="45" height="95" fill="#B2D8CB" rx="2" />
                    
                    <rect x="180" y="15" width="50" height="125" fill="#6B9F91" rx="3" />
                    <rect x="188" y="5" width="4" height="15" fill="#588478" />
                    <rect x="218" y="5" width="4" height="15" fill="#588478" />
                    <rect x="235" y="35" width="38" height="105" fill="#7EAEA0" rx="3" />
                    <rect x="278" y="55" width="32" height="85" fill="#8EBEB1" rx="2" />
                    <rect x="150" y="40" width="28" height="100" fill="#7EAEA0" rx="2" />
                    
                    <rect x="190" y="30" width="8" height="12" fill="#E8F6F1" opacity="0.7" />
                    <rect x="212" y="30" width="8" height="12" fill="#E8F6F1" opacity="0.7" />
                    <rect x="190" y="50" width="8" height="12" fill="#E8F6F1" opacity="0.7" />
                    <rect x="212" y="50" width="8" height="12" fill="#E8F6F1" opacity="0.7" />
                </svg>
            </div>

            {/* Swaying Tropical Leaves */}
            <motion.div
                animate={{ rotate: [-4, 6, -4], y: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 -right-3 w-28 h-28 pointer-events-none z-10 origin-top-right"
            >
                <svg viewBox="0 0 120 120" className="w-full h-full">
                    <path d="M 120 0 Q 70 30 20 50 Q 60 70 120 0 Z" fill="#6B9F91" />
                    <path d="M 120 0 Q 80 50 40 85 Q 75 95 120 0 Z" fill="#588478" />
                    <path d="M 120 0 Q 95 65 65 110 Q 95 105 120 0 Z" fill="#84B5A7" />
                </svg>
            </motion.div>

            {/* Road Strip */}
            <div className="absolute bottom-0 inset-x-0 h-6 bg-[#E2EFE9] border-t border-[#CCE2D8] flex items-center justify-between" />

            {/* Animated Cruising White Car */}
            <motion.div
                animate={{ x: [-90, 360] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-1 left-0 z-20 pointer-events-none"
            >
                <motion.div
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-28 h-12"
                >
                    <svg viewBox="0 0 160 70" className="w-full h-full">
                        <ellipse cx="80" cy="62" rx="65" ry="5" fill="#000000" opacity="0.15" />
                        <path
                            d="M 15 48 C 15 42, 25 35, 45 35 L 60 22 C 70 15, 110 15, 125 25 L 145 38 C 152 40, 155 45, 155 50 L 148 52 C 145 42, 125 42, 122 52 L 48 52 C 45 42, 25 42, 22 52 Z"
                            fill="#FFFFFF"
                            stroke="#CBD5E1"
                            strokeWidth="1.2"
                        />
                        <path d="M 62 25 L 90 25 L 90 35 L 48 35 Z" fill="#6B9F91" opacity="0.4" />
                        <path d="M 94 25 L 122 27 L 138 36 L 94 36 Z" fill="#6B9F91" opacity="0.4" />
                        <line x1="92" y1="25" x2="92" y2="50" stroke="#CBD5E1" strokeWidth="1" />
                        <rect x="75" y="38" width="8" height="2" rx="1" fill="#94A3B8" />

                        {/* SS40 Logo Emblem on car */}
                        <circle cx="92" cy="42" r="4.5" fill="#EDF5F2" stroke="#6B9F91" strokeWidth="0.8" />
                        <circle cx="92" cy="42" r="2" fill="#6B9F91" />

                        <path d="M 152 45 L 155 48 L 150 49 Z" fill="#38BDF8" />
                        <path d="M 15 44 L 17 48 L 15 48 Z" fill="#EF4444" />

                        <g transform="translate(35, 50)">
                            <circle cx="0" cy="0" r="10" fill="#1E293B" />
                            <circle cx="0" cy="0" r="6" fill="#E2E8F0" />
                            <circle cx="0" cy="0" r="2.5" fill="#6B9F91" />
                        </g>
                        <g transform="translate(133, 50)">
                            <circle cx="0" cy="0" r="10" fill="#1E293B" />
                            <circle cx="0" cy="0" r="6" fill="#E2E8F0" />
                            <circle cx="0" cy="0" r="2.5" fill="#6B9F91" />
                        </g>
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// DESKTOP VECTOR SVG ILLUSTRATION (Wave + Foliage + Phone + Sitting Person)
// -----------------------------------------------------------------------------

function DesktopLoginIllustration() {
    return (
        <div className="relative w-full h-full min-h-[440px] flex items-center justify-center overflow-hidden select-none bg-white">
            <svg
                viewBox="0 0 500 600"
                className="absolute inset-0 w-full h-full object-cover"
                preserveAspectRatio="none"
            >
                <path
                    d="M 180 150 C 260 140, 320 200, 300 280 C 280 360, 210 400, 160 380 C 120 360, 120 200, 180 150 Z"
                    fill="#EDF5F2"
                    opacity="0.9"
                />
                <path
                    d="M 0 0 L 120 0 C 80 120, 10 240, 70 360 C 130 460, 240 500, 320 600 L 0 600 Z"
                    fill="#6B9F91"
                />
                <path
                    d="M 0 350 C 80 380, 160 440, 220 600 L 0 600 Z"
                    fill="#588478"
                    opacity="0.75"
                />
            </svg>

            {/* Botanical Foliage */}
            <svg
                viewBox="0 0 200 400"
                className="absolute left-10 bottom-16 w-36 h-72 pointer-events-none z-0"
            >
                <path d="M 50 380 Q 70 200 60 40" stroke="#4D776C" strokeWidth="2.5" fill="none" />
                <path d="M 60 50 Q 85 45 95 30 Q 80 60 60 50 Z" fill="#6B9F91" />
                <path d="M 58 75 Q 30 65 20 50 Q 40 85 58 75 Z" fill="#84B5A7" />
                <path d="M 62 105 Q 92 100 102 85 Q 85 115 62 105 Z" fill="#6B9F91" />
                <path d="M 60 135 Q 30 125 18 110 Q 38 145 60 135 Z" fill="#84B5A7" />
                <path d="M 64 170 Q 95 165 105 150 Q 88 180 64 170 Z" fill="#6B9F91" />
                <path d="M 62 205 Q 28 195 15 180 Q 38 215 62 205 Z" fill="#84B5A7" />
                <path d="M 66 245 Q 98 240 108 225 Q 90 255 66 245 Z" fill="#6B9F91" />
                <path d="M 64 285 Q 28 275 14 260 Q 38 295 64 285 Z" fill="#84B5A7" />
            </svg>

            {/* Floating Leaf Particles */}
            <motion.div
                animate={{ y: [-5, 5, -5], rotate: [-8, 8, -8] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-28 top-28 w-4 h-6 bg-[#6B9F91] rounded-full transform rotate-45 opacity-85 shadow-sm"
            />
            <motion.div
                animate={{ y: [5, -5, 5], rotate: [8, -8, 8] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-16 bottom-20 w-3 h-5 bg-[#588478] rounded-full transform -rotate-12 opacity-80 shadow-sm"
            />

            {/* Smartphone Device with Live Screen Animations */}
            <div className="relative z-10 w-[160px] sm:w-[175px] h-[300px] sm:h-[320px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[#1E293B] rounded-[32px] p-2.5 shadow-2xl border-2 border-slate-700 flex flex-col items-center overflow-hidden">
                    <div className="w-12 h-1.5 bg-slate-600 rounded-full mb-1.5 z-20" />
                    
                    <div className="w-full flex-1 bg-gradient-to-b from-[#6B9F91] via-[#5C8C80] to-[#4D776C] rounded-[24px] overflow-hidden relative shadow-inner flex flex-col items-center pt-4">
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4], y: [-2, 2, -2] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-4/5 h-4 bg-white/20 rounded-md mb-2 backdrop-blur-xs border border-white/10"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3], y: [2, -2, 2] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                            className="w-3/5 h-3 bg-white/15 rounded-md mb-3"
                        />

                        {[
                            { left: '20%', delay: 0, duration: 4 },
                            { left: '50%', delay: 1.2, duration: 3.5 },
                            { left: '80%', delay: 2.1, duration: 4.2 }
                        ].map((p, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ y: 160, opacity: 0 }}
                                animate={{ y: -20, opacity: [0, 0.9, 0] }}
                                transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
                                className="absolute w-2 h-2 bg-white rounded-full blur-[0.5px] pointer-events-none shadow-sm"
                                style={{ left: p.left }}
                            />
                        ))}
                    </div>
                    <div className="w-full h-3" />
                </div>

                {/* Sitting Person Illustration */}
                <motion.div
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-28 h-44 z-20 flex flex-col items-center pointer-events-none"
                >
                    <svg viewBox="0 0 100 160" className="w-full h-full">
                        <path d="M 40 22 C 38 12, 62 12, 60 22 C 65 24, 63 32, 60 34 C 55 30, 45 30, 40 34 C 37 32, 35 24, 40 22 Z" fill="#583C28" />
                        <circle cx="50" cy="28" r="9" fill="#F8C4B4" />
                        <ellipse cx="50" cy="30" rx="7.5" ry="8" fill="#F8C4B4" />
                        <path d="M 42 36 L 58 36 L 63 76 L 37 76 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
                        <path d="M 49 37 L 51 37 L 52 56 L 50 62 L 48 56 Z" fill="#991B1B" />
                        <path d="M 37 40 Q 30 55 36 68 Q 42 70 45 68" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
                        <path d="M 63 40 Q 70 55 64 68 Q 58 70 55 68" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
                        <circle cx="46" cy="69" r="3" fill="#F8C4B4" />
                        <circle cx="54" cy="69" r="3" fill="#F8C4B4" />
                        <rect x="35" y="74" width="14" height="18" rx="4" fill="#334155" />
                        <rect x="51" y="74" width="14" height="18" rx="4" fill="#334155" />
                        <rect x="36" y="88" width="10" height="28" rx="3" fill="#334155" />
                        <rect x="54" y="88" width="10" height="28" rx="3" fill="#334155" />
                        <ellipse cx="40" cy="118" rx="6" ry="4" fill="#B45309" />
                        <ellipse cx="60" cy="118" rx="6" ry="4" fill="#B45309" />
                    </svg>
                </motion.div>
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------
// MAIN LOGIN PAGE (SOFT AMBIENT BACKGROUND WITH RICH BRAND HEADER)
// -----------------------------------------------------------------------------

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<SiteConfigData | null>(null);
    const [companyName, setCompanyName] = useState('SS40 NETWORK');

    useEffect(() => {
        fetch('/api/site-config')
            .then((res) => res.json())
            .then((data) => {
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
                router.push(data.redirectTo || '/admin');
                router.refresh();
            } else {
                setError(data.error || 'Invalid credentials. Please verify your email and password.');
            }
        } catch {
            setError('An unexpected connection error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen max-h-screen w-screen overflow-hidden flex items-center justify-center bg-[#F2F7F5] p-3 sm:p-6 lg:p-8 select-none relative">
            {/* Soft Ambient Glow Orbs (Subtle Opacity Background) */}
            <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-[#6B9F91]/12 rounded-full blur-[140px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-[#6B9F91]/10 rounded-full blur-[140px] pointer-events-none translate-x-1/3 translate-y-1/3" />

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* MOBILE CARD (Matches Skyline + Animated Car Screenshot)       */}
            {/* ═════════════════════════════════════════════════════════════ */}
            <div className="flex md:hidden w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden flex-col max-h-[94vh] border border-gray-100 relative z-10">
                {/* Top Skyline + Moving Car Scene */}
                <MobileAnimatedScene />

                {/* Bottom Form Card */}
                <div className="p-6 bg-white flex flex-col justify-center -mt-4 rounded-t-[28px] relative z-20 shadow-lg">
                    
                    {/* Mobile Brand Header (Centered) */}
                    <div className="flex flex-col items-center justify-center text-center gap-2 mb-3 pb-3 border-b border-gray-100">
                        {(config?.uploadedLogoUrl || config?.logoUrl) ? (
                            <img
                                src={(config?.uploadedLogoUrl || config?.logoUrl) as string}
                                alt={`${companyName} Logo`}
                                className="h-9 w-auto drop-shadow-xs"
                            />
                        ) : (
                            <img
                                src="/logos/ss40-logo.jpeg"
                                alt={`${companyName} Logo`}
                                className="h-9 w-auto rounded-md drop-shadow-xs"
                            />
                        )}
                        <div className="flex flex-col items-center text-center">
                            <span className="text-sm font-extrabold text-[#111827] tracking-tight">{companyName}</span>
                            <span className="text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider">Enterprise Portal</span>
                        </div>
                    </div>

                    {/* Welcome Text (Centered) */}
                    <div className="mb-4 text-center">
                        <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Sign in to access your administrative dashboard.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold text-center mb-3"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-3.5">
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="Email or Username"
                                className="w-full bg-[#EDF5F2] hover:bg-[#E4F2EC] focus:bg-white text-sm text-[#111827] placeholder-gray-400 rounded-2xl px-4 py-3.5 border border-transparent focus:border-[#6B9F91] focus:outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-[#EDF5F2] hover:bg-[#E4F2EC] focus:bg-white text-sm text-[#111827] placeholder-gray-400 rounded-2xl px-4 py-3.5 pr-11 border border-transparent focus:border-[#6B9F91] focus:outline-none transition-all font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-full bg-[#6B9F91] hover:bg-[#588478] text-white font-bold text-sm py-3.5 uppercase tracking-wider shadow-lg shadow-[#6B9F91]/25 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer mt-1"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    SIGNING IN...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-3.5 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#6B9F91] transition-colors"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to Website
                        </Link>
                    </div>
                </div>
            </div>

            {/* ═════════════════════════════════════════════════════════════ */}
            {/* DESKTOP CARD (Matches Desktop Split Screenshot + Brand Head)  */}
            {/* ═════════════════════════════════════════════════════════════ */}
            <div className="hidden md:flex w-full max-w-4xl bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl shadow-gray-200/80 overflow-hidden flex-row min-h-[480px] max-h-[540px] relative z-10 border border-gray-100">
                
                {/* Left Side Illustration */}
                <div className="w-1/2 h-full bg-white relative items-center justify-center overflow-hidden border-r border-gray-100 flex">
                    <DesktopLoginIllustration />
                </div>

                {/* Right Side Form */}
                <div className="w-1/2 p-8 lg:p-11 flex flex-col justify-center bg-white my-auto">
                    
                    {/* Top Logo Branding & Enterprise Tag */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            {(config?.uploadedLogoUrl || config?.logoUrl) ? (
                                <img
                                    src={(config?.uploadedLogoUrl || config?.logoUrl) as string}
                                    alt={`${companyName} Logo`}
                                    className="h-8 w-auto drop-shadow-xs group-hover:scale-105 transition-transform"
                                />
                            ) : (
                                <img
                                    src="/logos/ss40-logo.jpeg"
                                    alt={`${companyName} Logo`}
                                    className="h-8 w-auto rounded-md drop-shadow-xs group-hover:scale-105 transition-transform"
                                />
                            )}
                            <div className="flex flex-col text-left">
                                <span className="text-sm font-extrabold text-[#111827] tracking-tight">{companyName}</span>
                                <span className="text-[10px] font-bold text-[#6B9F91] uppercase tracking-wider">Enterprise Portal</span>
                            </div>
                        </Link>

                        <span className="inline-flex items-center gap-1 bg-[#EDF5F2] text-[#6B9F91] text-[10px] font-bold px-2.5 py-1 rounded-full">
                            <ShieldCheck className="w-3 h-3" />
                            SSO Secure
                        </span>
                    </div>

                    {/* Welcome Back Heading & Subtext */}
                    <div className="text-left mb-5">
                        <h1 className="text-2xl font-black text-[#111827] tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Sign in to access your administrative dashboard and manage operations.
                        </p>
                    </div>

                    {/* Authentication Form */}
                    <form onSubmit={handleLogin} className="space-y-4 w-full">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Username Input with Underline Style */}
                        <div className="space-y-1 text-left">
                            <label className="block text-[11px] font-bold text-gray-600">
                                Username or Email
                            </label>
                            <div className="flex items-center gap-2.5 pb-1.5 border-b-2 border-[#6B9F91] transition-colors">
                                <User className="w-4 h-4 text-[#6B9F91] shrink-0" />
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="admin@ss40network.com"
                                    className="w-full bg-transparent text-sm text-[#111827] placeholder-gray-300 focus:outline-none font-medium py-1"
                                />
                            </div>
                        </div>

                        {/* Password Input with Underline Style */}
                        <div className="space-y-1 text-left pt-1">
                            <label className="block text-[11px] font-bold text-gray-600">
                                Password
                            </label>
                            <div className="flex items-center gap-2.5 pb-1.5 border-b-2 border-gray-200 focus-within:border-[#6B9F91] transition-colors relative">
                                <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-transparent text-sm text-[#111827] placeholder-gray-300 focus:outline-none font-medium py-1 pr-7"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>

                        {/* Brand Emerald Rounded-Pill Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-full bg-[#6B9F91] hover:bg-[#588478] text-white font-bold text-sm py-3.5 uppercase tracking-wider shadow-lg shadow-[#6B9F91]/25 hover:shadow-xl hover:shadow-[#6B9F91]/35 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        SIGNING IN...
                                    </span>
                                ) : (
                                    'SIGN IN TO DASHBOARD'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Back to Website Link */}
                    <div className="mt-4 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#6B9F91] transition-colors"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Back to Website
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
