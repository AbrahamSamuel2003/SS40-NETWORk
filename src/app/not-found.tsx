import * as React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
    Home,
    Compass,
    Code2,
    Package,
    GraduationCap,
    Newspaper,
    ArrowRight,
    HelpCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingSupportHub } from '@/components/ui/FloatingSupportHub';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { getSiteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist or has been relocated on SS40 NETWORK.',
    robots: {
        index: false,
        follow: true,
    },
};

const POPULAR_DESTINATIONS = [
    {
        title: 'Digital Solutions',
        desc: 'Custom software, enterprise web apps & AI architectures.',
        href: '/digital-solutions',
        icon: Code2,
        badge: 'Enterprise',
    },
    {
        title: 'SaaS Products',
        desc: 'ClearInvoice & cloud-native productivity platforms.',
        href: '/products',
        icon: Package,
        badge: 'Products',
    },
    {
        title: 'Tech Academics',
        desc: 'Career-launching student programs & college MoUs.',
        href: '/academics',
        icon: GraduationCap,
        badge: 'Academics',
    },
    {
        title: 'Company Activities',
        desc: 'Industrial visits, MoUs & field activity journals.',
        href: '/blogs',
        icon: Newspaper,
        badge: 'Updates',
    },
];

export default async function NotFound() {
    const config = await getSiteConfig();

    return (
        <SmoothScrollProvider>
            <div className="min-h-screen flex flex-col bg-[#FAFCFB] text-[#0F172A] selection:bg-[#0F766E] selection:text-white">
                <Navbar config={config} />

                <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="max-w-4xl w-full mx-auto text-center">
                        
                        {/* 404 Status Pill */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF5F2] border border-[#2DD4BF]/30 text-[#0F766E] text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 shadow-xs">
                            <Compass className="w-4 h-4 text-[#0F766E]" />
                            <span>Error 404 • Page Not Found</span>
                        </div>

                        {/* Large 404 Monogram */}
                        <div className="relative mb-6 select-none">
                            <h1 className="text-8xl sm:text-9xl lg:text-[11rem] font-black tracking-tighter text-[#0F172A]/10 font-mono leading-none">
                                404
                            </h1>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#0F172A] tracking-tight">
                                    Lost in Digital Space?
                                </h2>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base lg:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed mb-8">
                            The link you clicked might be broken, outdated, or the page has been permanently relocated. 
                            Let's get you back on track across the SS40 ecosystem.
                        </p>

                        {/* Primary Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
                            <Link
                                href="/"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-sm shadow-md shadow-[#0F766E]/20 transition-all cursor-pointer min-h-[44px]"
                            >
                                <Home className="w-4 h-4" />
                                <span>Return to Homepage</span>
                            </Link>

                            <Link
                                href="/contact"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-[#0F172A] font-bold text-sm border border-gray-200 shadow-xs transition-all cursor-pointer min-h-[44px]"
                            >
                                <HelpCircle className="w-4 h-4 text-[#0F766E]" />
                                <span>Contact Support Team</span>
                            </Link>
                        </div>

                        {/* Quick Navigation Destination Hub */}
                        <div className="bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-200/40 text-left">
                            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A]">
                                        Explore Core SS40 Wings
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[#64748B]">
                                        Instant pathways to active portals and services
                                    </p>
                                </div>
                                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] bg-[#EDF5F2] px-3 py-1 rounded-full">
                                    Direct Routing
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                {POPULAR_DESTINATIONS.map((dest) => {
                                    const Icon = dest.icon;
                                    return (
                                        <Link
                                            key={dest.title}
                                            href={dest.href}
                                            className="group p-4 rounded-2xl border border-gray-100 hover:border-[#2DD4BF]/60 bg-white hover:bg-[#EDF5F2]/40 transition-all duration-200 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="w-9 h-9 rounded-xl bg-[#EDF5F2] text-[#0F766E] border border-[#2DD4BF]/30 flex items-center justify-center group-hover:bg-[#0F766E] group-hover:text-white transition-colors">
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                        {dest.badge}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#0F766E] transition-colors flex items-center justify-between">
                                                        <span>{dest.title}</span>
                                                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all" />
                                                    </h4>
                                                    <p className="text-xs text-[#64748B] mt-1 leading-snug line-clamp-2">
                                                        {dest.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </main>

                <Footer />
                <FloatingSupportHub config={config} />
            </div>
        </SmoothScrollProvider>
    );
}
