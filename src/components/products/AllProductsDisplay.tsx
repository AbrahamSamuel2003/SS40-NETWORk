"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CloudIcon, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CardMotion } from "@/components/ui/Card";
import { hoverLift, slideUp } from "@/lib/animations";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";

export function AllProductsDisplay() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeModalProduct, setActiveModalProduct] = useState<any | null>(null);

    React.useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data)) {
                    setProducts(data.data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <SectionWrapper className="bg-[#EDF5F2] min-h-[60vh] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#6B9F91] border-t-transparent rounded-full animate-spin mx-auto" />
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper className="bg-[#EDF5F2] min-h-screen pt-32 pb-24 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6B9F91]/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2DD4BF]/5 blur-[100px] rounded-full pointer-events-none" />

            <Container className="relative z-10 w-full">
                {/* Common Heading Block */}
                <div className="w-full flex flex-col justify-center mb-10 md:mb-16 gap-4 text-center items-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-heading)] tracking-tight relative text-center">
                        Explore All Products
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-[#6B9F91] rounded-full"></div>
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-2xl text-base lg:text-lg">Discover our complete range of innovative solutions designed to empower and scale your operations beautifully and efficiently.</p>
                </div>

                {/* Grid Area */}
                {products.length === 0 ? (
                    <div className="py-24 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                            <CloudIcon className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
                        <p className="text-gray-500">There are currently no active products to display.</p>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {products.map((product: any) => (
                                <CardMotion
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    {...hoverLift}
                                    className="bg-white overflow-hidden rounded-2xl flex-col group border border-[var(--color-border)] hover:border-[#6B9F91]/30 hover:shadow-xl hover:shadow-[#6B9F91]/10 transition-all duration-300 flex cursor-pointer"
                                    onClick={() => setActiveModalProduct(product)}
                                >
                                    {/* Grid Visual Placeholder */}
                                    <div className="relative w-full aspect-[16/10] bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center border-b border-gray-100">
                                        {product.screenshotUrl ? (
                                            <img src={product.screenshotUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-4 gap-3 bg-[#6B9F91]/5 group-hover:scale-105 transition-transform duration-500">
                                                <CloudIcon className="w-12 h-12 text-gray-300 opacity-50" />
                                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">No Screenshot</span>
                                            </div>
                                        )}
                                        {product.badgeText && (
                                            <div className="absolute top-4 right-4 z-10 shadow-sm">
                                                <span className="px-3 py-1.5 bg-[#2DD4BF]/90 text-white backdrop-blur-sm shadow-md rounded-md uppercase tracking-widest text-[9px] font-bold">
                                                    {product.badgeText}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Grid Content Area */}
                                    <div className="p-6 md:p-8 flex flex-col flex-1">
                                        <div className="flex items-center justify-between gap-4 mb-3">
                                            <span className="font-mono text-[#2DD4BF] text-[10px] font-bold uppercase tracking-wider rounded-md whitespace-nowrap overflow-hidden text-ellipsis">
                                                {product.name}
                                            </span>
                                            {product.isFeatured && (
                                                <div className="flex items-center gap-1 text-[9px] font-bold text-[#6B9F91] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    FEATURED
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-xl text-[var(--color-heading)] leading-tight mb-3 group-hover:text-[#6B9F91] transition-colors">
                                            {product.marketingTitle}
                                        </h3>

                                        <p className="text-[var(--color-body-text)] text-sm mb-6 flex-1 line-clamp-3">
                                            {product.description}
                                        </p>

                                        {/* View Details Context Button */}
                                        <div className="mt-auto flex items-center text-sm font-bold text-[#6B9F91] group-hover:text-[#588478] transition-colors group/btn">
                                            View Details
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </CardMotion>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </Container>

            {/* View Details Reading Modal overlay */}
            <AnimatePresence>
                {activeModalProduct && (
                    <ProductModal product={activeModalProduct} onClose={() => setActiveModalProduct(null)} />
                )}
            </AnimatePresence>
        </SectionWrapper>
    );
}

// ============================================================================
// MODAL COMPONENT (Reuses UI presentation of ClientProjectsModal)
// ============================================================================

function ProductModal({ product, onClose }: { product: any, onClose: () => void }) {
    // Lock body scroll when modal is open
    React.useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalStyle;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Parse tags safely from array
    const parsedTags = Array.isArray(product.tags) ? product.tags : [];
    const parsedFeatures = Array.isArray(product.features) ? product.features : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh] md:max-h-[85vh]"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center transition-colors z-10 focus-visible:outline-none shadow-sm"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content Area */}
                <div
                    className="overflow-y-auto px-6 py-8 md:px-10 md:py-10 flex flex-col h-full [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >

                    {/* 1. Category / Brand */}
                    <div className="flex items-center gap-2 pr-12 mb-4">
                        <span className="font-mono text-[#2DD4BF] text-xs font-bold uppercase tracking-widest rounded-md whitespace-nowrap">
                            {product.name}
                        </span>
                        {product.isFeatured && (
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#2DD4BF] uppercase tracking-wider whitespace-nowrap bg-[#2DD4BF]/10 px-2 py-0.5 rounded-sm">
                                <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                FEATURED
                            </span>
                        )}
                        {product.badgeText && (
                            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-sm">
                                {product.badgeText}
                            </span>
                        )}
                    </div>

                    {/* 2. Product Marketing Title */}
                    <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[var(--color-heading)] leading-tight tracking-tight mb-6 pr-6">
                        {product.marketingTitle}
                    </h2>

                    {/* 3. Short Description */}
                    <p className="text-gray-600 font-medium text-sm md:text-base leading-relaxed mb-6">
                        {product.description}
                    </p>

                    {/* 4. Technologies / Tags */}
                    {parsedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {parsedTags.map((tag: string, idx: number) => (
                                <span key={idx} className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 shadow-sm rounded-lg text-[11px] font-bold uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 5. Visit Live Product / CTA */}
                    {product.productUrl ? (
                        <div className="mb-10 shrink-0">
                            <a
                                href={product.productUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#2DD4BF] text-white font-bold shadow-lg shadow-[#2DD4BF]/30 hover:bg-[#14b8a6] transition-all hover:scale-105 active:scale-95"
                            >
                                {product.ctaText || 'Launch Product'}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                        </div>
                    ) : (
                        <div className="mb-10 shrink-0" />
                    )}

                    {/* 6. Feature List (Maps to Case Study equivalent conceptually) */}
                    {parsedFeatures.length > 0 && (
                        <div className="border-t border-gray-100 pt-8 mt-2 flex-grow">
                            <h3 className="text-lg font-bold text-[var(--color-heading)] mb-6">
                                Core Capabilities
                            </h3>
                            <ul className="space-y-4">
                                {parsedFeatures.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-[#2DD4BF] mr-3 shrink-0 mt-0.5" />
                                        <span className="text-sm md:text-base text-gray-600 leading-relaxed font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

