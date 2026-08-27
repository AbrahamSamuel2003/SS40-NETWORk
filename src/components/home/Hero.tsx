import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { HERO_SPACING_CLASSES, cn } from "@/utils/cn";
import { HeroDashboardMockup } from "./HeroDashboardMockup";

export function Hero() {
    return (
        <section className={cn("relative w-full overflow-hidden bg-white", HERO_SPACING_CLASSES)}>
            {/* Ambient Background Image & Gradients (Clean Stacking Context) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <Image
                    src="/images/hero/home-hero-bg.jpg"
                    alt=""
                    fill
                    loading="eager"
                    sizes="100vw"
                    className="object-cover object-center opacity-65 sm:opacity-75 mix-blend-multiply"
                    quality={90}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.85) 65%, #ffffff 100%)' }}
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
                            <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-[var(--color-primary)]/20 group">
                                <Link href="/digital-solutions" className="inline-flex items-center justify-center whitespace-nowrap">
                                    Explore Solutions
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/70 backdrop-blur-sm text-gray-800 border-gray-300 hover:bg-white hover:text-black">
                                <Link href="/contact?source=HOME_CONTACT_US&sourcePage=/" className="inline-flex items-center justify-center whitespace-nowrap">
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
