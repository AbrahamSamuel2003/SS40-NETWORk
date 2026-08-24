import * as React from "react";
import { Activity, Users, Box, BarChart3, LayoutDashboard, Briefcase, Sparkles, GraduationCap } from "lucide-react";

export function HeroDashboardMockup() {
    return (
        <div className="w-full lg:w-[45%] relative mt-10 lg:mt-0 hidden lg:flex justify-center lg:justify-end select-none">
            {/* Main Dashboard Mockup */}
            <div
                className="animate-float-slow relative w-full max-w-[500px] h-[400px] bg-white rounded-2xl shadow-[var(--shadow-hover)] border border-[var(--color-border)] overflow-hidden flex flex-col z-10"
            >
                {/* Browser Header */}
                <div className="h-10 bg-gray-50 border-b border-[var(--color-border)] flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="ml-4 w-48 h-5 bg-white rounded-md border border-[var(--color-border)] flex items-center px-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-sm" />
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-16 border-r border-[var(--color-border)] bg-gray-50/50 flex flex-col items-center py-4 gap-6">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                            <div className="w-4 h-4 bg-[var(--color-primary)] rounded-sm" />
                        </div>
                        <div className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center hover:bg-gray-100"><LayoutDashboard className="w-5 h-5" /></div>
                        <div className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center hover:bg-gray-100"><Users className="w-5 h-5" /></div>
                        <div className="w-8 h-8 rounded-lg text-gray-400 flex items-center justify-center hover:bg-gray-100"><Activity className="w-5 h-5" /></div>
                    </div>

                    {/* Main Area */}
                    <div className="flex-1 p-5 flex flex-col gap-5 bg-gray-50/30">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <div className="w-32 h-4 bg-gray-200 rounded-md" />
                                <div className="w-20 h-3 bg-gray-100 rounded-md" />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-[var(--color-border)] space-y-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="w-16 h-3 bg-gray-100 rounded-md" />
                                <div className="w-24 h-5 bg-gray-200 rounded-md" />
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-[var(--color-border)] space-y-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                    <Box className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="w-16 h-3 bg-gray-100 rounded-md" />
                                <div className="w-24 h-5 bg-gray-200 rounded-md" />
                            </div>
                        </div>

                        <div className="bg-white flex-1 rounded-xl shadow-sm border border-[var(--color-border)] p-4 space-y-4">
                            <div className="w-32 h-3 bg-gray-200 rounded-md" />
                            <div className="space-y-2">
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-[var(--color-primary)] rounded-full" />
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="w-1/2 h-full bg-[var(--color-alternate)] rounded-full" />
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="w-5/6 h-full bg-[var(--color-accent)] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Feature Cards */}
            <div
                className="animate-float-delayed-1 absolute -left-6 top-12 z-20 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-[var(--color-border)] flex items-center gap-3 hidden md:flex"
            >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Briefcase className="w-5 h-5" />
                </div>
                <div className="pr-2">
                    <p className="text-sm font-bold text-[var(--color-heading)]">Digital Services</p>
                    <p className="text-xs text-[var(--color-body-text)]">Premium IT Solutions</p>
                </div>
            </div>

            <div
                className="animate-float-delayed-2 absolute -right-8 bottom-24 z-20 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-[var(--color-border)] flex items-center gap-3 hidden sm:flex"
            >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="pr-2">
                    <p className="text-sm font-bold text-[var(--color-heading)]">AI Solutions</p>
                    <p className="text-xs text-[var(--color-body-text)]">Next-gen intelligence</p>
                </div>
            </div>

            <div
                className="animate-float-slow absolute left-10 -bottom-8 z-20 bg-[#0F766E] text-white p-3 rounded-xl shadow-lg shadow-[#0F766E]/20 flex items-center gap-3"
            >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="pr-4">
                    <p className="text-sm font-bold text-white">Products & Academics</p>
                    <p className="text-xs text-white/95 font-medium">World-class education</p>
                </div>
            </div>
        </div>
    );
}

