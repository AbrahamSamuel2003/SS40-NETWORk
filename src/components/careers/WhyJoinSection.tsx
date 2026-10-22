'use client';

import React from 'react';
import { 
    Code2,
    Cpu,
    Building2,
    Layers,
    Zap,
    ShieldCheck
} from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function WhyJoinSection() {
    return (
        <section className="relative w-full bg-[#D8E8E2] border-y border-[#0F766E]/15 py-12 sm:py-16 md:py-20 overflow-hidden">
            <Container className="relative z-10 max-w-6xl mx-auto space-y-10 sm:space-y-12">
                
                {/* ================= SECTION HEADER ================= */}
                <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-white text-[#0F766E] border border-[#0F766E]/20 text-[11px] font-extrabold uppercase tracking-widest font-crimson shadow-2xs">
                        Why Choose SS40 NETWORK
                    </span>
                    
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight font-serif font-crimson leading-[1.15]">
                        What Will You Make Real?
                    </h2>
                    
                    <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
                        Choosing SS40 NETWORK means having the opportunity to make an authentic difference—working on impactful digital solutions, building scalable products, and mastering software craft in Tirunelveli.
                    </p>
                </div>

                {/* ================= 6 CULTURE CARDS (SIMPLE EVERYDAY TERMS) ================= */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                    {/* Card 1 */}
                    <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-sm transition-all">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                                    <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h4 className="text-xs sm:text-base font-bold text-[#0F172A] leading-tight">True Ownership</h4>
                            </div>
                            <p className="text-[11px] sm:text-sm text-[#64748B] leading-relaxed line-clamp-3 sm:line-clamp-none">
                                You won&apos;t just move tickets or do busywork. You help design real features, propose ideas, and see your work used by real customers.
                            </p>
                        </div>
                        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center text-[10px] sm:text-[11px] font-bold text-[#0F766E]">
                            <span>Work With Autonomy</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-sm transition-all">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                                    <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h4 className="text-xs sm:text-base font-bold text-[#0F172A] leading-tight">Modern Tech Stack</h4>
                            </div>
                            <p className="text-[11px] sm:text-sm text-[#64748B] leading-relaxed line-clamp-3 sm:line-clamp-none">
                                Build on modern technologies like Next.js, TypeScript, PostgreSQL, and modern AI tools. Zero outdated legacy systems.
                            </p>
                        </div>
                        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center text-[10px] sm:text-[11px] font-bold text-[#0F766E]">
                            <span>Modern Technologies</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-sm transition-all">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                                    <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h4 className="text-xs sm:text-base font-bold text-[#0F172A] leading-tight">Great Work-Life Balance</h4>
                            </div>
                            <p className="text-[11px] sm:text-sm text-[#64748B] leading-relaxed line-clamp-3 sm:line-clamp-none">
                                Build world-class software right from Tirunelveli with flexible hybrid schedules and plenty of time for life and family.
                            </p>
                        </div>
                        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center text-[10px] sm:text-[11px] font-bold text-[#0F766E]">
                            <span>Flexible Schedules</span>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-sm transition-all">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                                    <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h4 className="text-xs sm:text-base font-bold text-[#0F172A] leading-tight">Helpful Mentorship</h4>
                            </div>
                            <p className="text-[11px] sm:text-sm text-[#64748B] leading-relaxed line-clamp-3 sm:line-clamp-none">
                                Learn directly from experienced teammates who review your code constructively and help you grow into a stronger engineer.
                            </p>
                        </div>
                        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center text-[10px] sm:text-[11px] font-bold text-[#0F766E]">
                            <span>Learn &amp; Grow Daily</span>
                        </div>
                    </div>

                    {/* Card 5 */}
                    <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-sm transition-all">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h4 className="text-xs sm:text-base font-bold text-[#0F172A] leading-tight">Fair Recognition &amp; Growth</h4>
                            </div>
                            <p className="text-[11px] sm:text-sm text-[#64748B] leading-relaxed line-clamp-3 sm:line-clamp-none">
                                Clear promotions and rewards based honestly on your contribution, problem-solving skills, and the value you bring.
                            </p>
                        </div>
                        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center text-[10px] sm:text-[11px] font-bold text-[#0F766E]">
                            <span>Clear Career Growth</span>
                        </div>
                    </div>

                    {/* Card 6 */}
                    <div className="p-3 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs flex flex-col justify-between hover:border-[#0F766E]/40 hover:shadow-sm transition-all">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#EDF5F2] text-[#0F766E] flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <h4 className="text-xs sm:text-base font-bold text-[#0F172A] leading-tight">Friendly &amp; Supportive Team</h4>
                            </div>
                            <p className="text-[11px] sm:text-sm text-[#64748B] leading-relaxed line-clamp-3 sm:line-clamp-none">
                                An ego-free, welcoming team where questions are encouraged, teammates help one another, and we celebrate wins together.
                            </p>
                        </div>
                        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-100 flex items-center text-[10px] sm:text-[11px] font-bold text-[#0F766E]">
                            <span>Supportive Culture</span>
                        </div>
                    </div>
                </div>

            </Container>
        </section>
    );
}
