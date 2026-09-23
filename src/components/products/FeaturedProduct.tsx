"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    CloudIcon,
    BadgeCheck,
    Sparkles
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeaturedProductSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

interface FeaturedProductProps {
    initialData?: any[];
}

export function FeaturedProduct({ initialData }: FeaturedProductProps = {}) {
    const [products, setProducts] = React.useState<any[]>(initialData || []);
    const [isLoading, setIsLoading] = React.useState(!initialData || initialData.length === 0);
    const [activeTab, setActiveTab] = React.useState(0);

    const displayedProducts = React.useMemo(() => {
        const featured = products.filter(p => p.isFeatured);
        const nonFeatured = products.filter(p => !p.isFeatured);
        const combined = [...featured, ...nonFeatured];
        const seenNames = new Set<string>();

        return combined.filter(product => {
            const key = String(product.name || product.id).trim().toLowerCase();
            if (seenNames.has(key)) return false;
            seenNames.add(key);
            return true;
        });
    }, [products]);

    React.useEffect(() => {
        if (initialData && initialData.length > 0) {
            setProducts(initialData);
            setIsLoading(false);
            return;
        }

        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setProducts(data.data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [initialData]);

    React.useEffect(() => {
        if (!isLoading && typeof window !== 'undefined' && (window.location.hash === '#featured-product' || window.location.hash === '#view-all-featured-products')) {
            const hashId = window.location.hash.substring(1);
            const el = document.getElementById(hashId);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [isLoading]);

    if (isLoading || products.length === 0) {
        return (
            <SectionWrapper id="featured-product" className="bg-[#D8E8E2] scroll-mt-24 py-8 sm:py-12">
                <Container className="space-y-6 sm:space-y-8">
                    <SectionHeading
                        badge="OUR PRODUCTS"
                        title={
                            <>
                                Innovative Tools.<br />
                                Built for <span className="text-[#0F766E]">Real Impact.</span>
                            </>
                        }
                        description="Discover our flagship products designed to simplify operations, supercharge productivity, and deliver measurable results for your business."
                        align="center"
                    />
                    <FeaturedProductSkeleton />
                </Container>
            </SectionWrapper>
        );
    }

    const currentProduct = displayedProducts[activeTab] || displayedProducts[0];
    const tags = Array.isArray(currentProduct?.tags) ? currentProduct.tags : [];
    const features = Array.isArray(currentProduct?.features) ? currentProduct.features : [];
    const allChips = features.length > 0 ? features : tags;

    return (
        <SectionWrapper id="featured-product" className="bg-[#D8E8E2] scroll-mt-24 relative overflow-hidden py-8 sm:py-12 lg:py-14">
            {/* Ambient Background Aura */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none -z-0" />

            <Container className="flex flex-col gap-5 sm:gap-7 lg:gap-8 relative z-10 max-w-6xl">
                {/* Section Header */}
                <div className="order-0">
                    <SectionHeading
                        badge="OUR PRODUCTS"
                        title={
                            <>
                                Innovative Tools.<br />
                                Built for <span className="text-[#0F766E]">Real Impact.</span>
                            </>
                        }
                        description="Discover our flagship products designed to simplify operations, supercharge productivity, and deliver measurable results for your business."
                        align="center"
                    />
                </div>

                {/* 1. Interactive Product Switcher Tray (Placed below product section on mobile, above on desktop) */}
                {displayedProducts.length > 1 && (
                    <div className="w-full flex justify-center order-2 sm:order-1 mt-3 sm:mt-0 sm:mb-2">
                        <div className="inline-flex flex-wrap items-center justify-center p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md border border-[var(--color-border)] shadow-sm gap-1.5 sm:gap-2 max-w-full">
                            {displayedProducts.map((p, idx) => {
                                const isActive = activeTab === idx;
                                return (
                                    <button
                                        key={p.id || idx}
                                        type="button"
                                        onClick={() => setActiveTab(idx)}
                                        className={cn(
                                            "px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap flex items-center justify-center select-none cursor-pointer border",
                                            isActive
                                                ? "bg-[#0F766E] text-white border-[#0F766E] shadow-sm shadow-[#0F766E]/20 ring-1 ring-[#2DD4BF]/40"
                                                : "bg-white/90 text-[#334155] border-gray-200/70 hover:border-[#0F766E]/30 hover:bg-white hover:text-[#0F766E]"
                                        )}
                                    >
                                        <span className="relative z-10 font-bold tracking-tight">
                                            {p.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 2. Flagship Showcase Deck (Order-1 on mobile, Order-2 on desktop) */}
                <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-7 border border-white/80 shadow-xl relative overflow-hidden order-1 sm:order-2">
                    {/* Inner Subtle Radial Glow */}
                    <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-[#2DD4BF]/15 via-transparent to-transparent rounded-bl-full pointer-events-none -z-0" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-8 items-center relative z-10">
                        
                        {/* Left Column: Narrative & Features (Stable Container Height: Eliminates Layout Shift & Navbar Jitter) */}
                        <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-start text-center lg:text-left min-h-[260px] xs:min-h-[270px] sm:min-h-[280px] lg:min-h-[280px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentProduct?.id || activeTab}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="flex flex-col items-center lg:items-start w-full"
                                >
                                    {/* Product Badge Pill */}
                                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#2DD4BF]/15 border border-[#2DD4BF]/30 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#0F766E] shadow-2xs mb-2 sm:mb-2.5">
                                        <Sparkles className="w-3 h-3 text-[#2DD4BF]" />
                                        <span>{currentProduct?.badgeText || "SS40 PRODUCT"}</span>
                                    </div>

                                    {/* Product Name & Marketing Title */}
                                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#0F172A] tracking-tight leading-snug mb-1.5 sm:mb-2.5 font-serif">
                                        {currentProduct?.marketingTitle || currentProduct?.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed max-w-lg">
                                        {currentProduct?.description}
                                    </p>

                                    {/* Feature Chips / Tags Grid */}
                                    {allChips.length > 0 && (
                                        <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 mb-3.5 sm:mb-4">
                                            {allChips.map((chip: string, cIdx: number) => (
                                                <span
                                                    key={cIdx}
                                                    className="px-2.5 py-1 bg-[#D8E8E2]/50 border border-[#2DD4BF]/25 rounded-lg text-[10px] sm:text-xs font-bold text-[#0F766E] flex items-center gap-1 shadow-2xs select-none"
                                                >
                                                    <BadgeCheck className="w-3 h-3 text-[#2DD4BF] shrink-0" />
                                                    <span>{chip}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action CTA */}
                                    {currentProduct?.productUrl ? (
                                        <Button
                                            asChild
                                            size="sm"
                                            className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#115E59] text-white shadow-md shadow-[#0F766E]/20 rounded-xl group px-6 py-2.5 text-xs sm:text-sm font-bold"
                                        >
                                            <a href={currentProduct.productUrl} target="_blank" rel="noopener noreferrer">
                                                {currentProduct.ctaText || `Start using ${currentProduct.name}`}
                                                <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </Button>
                                    ) : (
                                        <Button
                                            asChild
                                            size="sm"
                                            className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#115E59] text-white shadow-md shadow-[#0F766E]/20 rounded-xl group px-6 py-2.5 text-xs sm:text-sm font-bold"
                                        >
                                            <Link href="/contact">
                                                Request Product Demo
                                                <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right Column: Screenshot Showcase (Zero Empty Space on Both Mobile & Desktop) */}
                        <div className="lg:col-span-6 relative flex justify-center items-center min-h-[170px] xs:min-h-[200px] sm:min-h-[260px] lg:min-h-[320px] w-full">
                            {/* Stage Ambient Field */}
                            <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center transform-gpu">
                                <div
                                    className="w-full max-w-[450px] h-full max-h-[320px] rounded-full pointer-events-none transform-gpu"
                                    style={{
                                        background: 'radial-gradient(ellipse at center, rgba(45,212,191,0.22) 0%, rgba(107,159,145,0.06) 50%, transparent 70%)',
                                        willChange: 'transform'
                                    }}
                                />
                            </div>

                            {/* Standalone Product Screenshot Stage with Fluid Cross-Fade */}
                            <div className="relative w-full h-full min-h-[170px] xs:min-h-[200px] sm:min-h-[260px] lg:min-h-[320px] flex items-center justify-center z-10 select-none">
                                {displayedProducts.map((p, idx) => {
                                    const isActive = activeTab === idx;
                                    return (
                                        <div
                                            key={p.id || idx}
                                            className={cn(
                                                "absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out will-change-[opacity]",
                                                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                                            )}
                                        >
                                            {p.screenshotUrl ? (
                                                <img
                                                    src={p.screenshotUrl}
                                                    alt={`${p.name} - Software Solution by SS40 NETWORK`}
                                                    loading="eager"
                                                    decoding="async"
                                                    className="block w-auto max-w-full h-auto max-h-[170px] xs:max-h-[200px] sm:max-h-[260px] lg:max-h-[320px] rounded-xl select-none filter drop-shadow-[0_10px_24px_rgba(15,118,110,0.16)] transition-transform duration-300 hover:scale-[1.01]"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-400 gap-2 py-6 px-4 text-center select-none bg-[#0F766E]/5 border border-[#2DD4BF]/20 rounded-xl w-full min-w-[220px]">
                                                    <CloudIcon className="w-8 h-8 opacity-30 text-[#0F766E]" />
                                                    <p className="text-xs font-medium text-[#0F766E]">Software preview for {p.name}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>

                {/* View All Products Link */}
                {products.length > displayedProducts.length && (
                    <div id="view-all-featured-products" className="flex justify-center pt-1 scroll-mt-24 order-3">
                        <Link
                            href="/products/all-products"
                            className="inline-flex items-center justify-center font-bold text-xs sm:text-sm text-[#0F766E] hover:text-[#115E59] transition-colors group"
                        >
                            View All Products in Catalog
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </Container>
        </SectionWrapper>
    );
}
