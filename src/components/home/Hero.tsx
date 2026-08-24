import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";
import { HeroDashboardMockup } from "./HeroDashboardMockup";

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-white isolate", HERO_SPACING_CLASSES)}>
            {/* Background Ambient Shapes (Hardware-Accelerated Radial Gradients without CSS Filter Overhead) */}
            <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 transform-gpu pointer-events-none w-full h-full max-w-7xl overflow-hidden">
                <div 
                    className="absolute top-[-10%] left-[-5%] w-[550px] h-[550px] rounded-full pointer-events-none opacity-60" 
                    style={{ background: 'radial-gradient(circle, rgba(237,245,242,0.8) 0%, rgba(237,245,242,0) 70%)' }}
                />
                <div 
                    className="absolute top-[15%] right-[-10%] w-[450px] h-[450px] rounded-full pointer-events-none opacity-40" 
                    style={{ background: 'radial-gradient(circle, rgba(107,159,145,0.3) 0%, rgba(107,159,145,0) 70%)' }}
                />
                <div 
                    className="absolute bottom-[-20%] left-[25%] w-[600px] h-[600px] rounded-full pointer-events-none opacity-50" 
                    style={{ background: 'radial-gradient(circle, rgba(166,203,190,0.35) 0%, rgba(166,203,190,0) 70%)' }}
                />
            </div>

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-10">

                    {/* Left Column - Content (Rendered instantly by server for 0ms LCP delay) */}
                    <div
                        className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <div className="mb-8">
                            <Badge variant="primary" className="py-1.5 px-4 rounded-full flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>The Future of Enterprise Tech</span>
                            </Badge>
                        </div>

                        <h1 className="text-[clamp(40px,5vw,56px)] font-bold text-[var(--color-heading)] leading-[1.1] tracking-tight mb-6">
                            One Company.<br />
                            Three Business Wings.<br />
                            <span className="text-[var(--color-primary-hover)]">Endless Possibilities.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-[var(--color-body-text)] mb-10 max-w-xl leading-relaxed">
                            Driving the modern era forward with world-class digital solutions, innovative SaaS products, and elite academic empowerment.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-[var(--color-primary)]/20 bg-[#2E544A] hover:bg-[#234038] text-white font-semibold group">
                                <Link href="/digital-solutions">
                                    Explore Solutions
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/70 backdrop-blur-sm text-gray-800 border-gray-300 hover:bg-white hover:text-black">
                                <Link href="/contact?source=HOME_CONTACT_US&sourcePage=/">
                                    Contact Us
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Client Animated Showcase */}
                    <HeroDashboardMockup />
                </div>
            </Container>
        </section>
    );
}
