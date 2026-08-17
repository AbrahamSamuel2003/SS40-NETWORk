"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    CloudIcon,
    BadgeCheck,
    Loader2
} from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hoverLift, slideUp, staggerContainer } from "@/lib/animations";
import { FeaturedProductSkeleton } from "@/components/ui/Skeleton";

export function FeaturedProduct() {
    const [products, setProducts] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const displayedProducts = React.useMemo(() => {
        const featured = products.filter(product => product.isFeatured);
        const source = featured.length > 0 ? featured : products;
        const seenNames = new Set<string>();

        return source.filter(product => {
            const key = String(product.name || product.id).trim().toLowerCase();
            if (seenNames.has(key)) return false;
            seenNames.add(key);
            return true;
        }).slice(0, 2);
    }, [products]);

    React.useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setProducts(data.data);
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

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
            <SectionWrapper id="featured-product" className="bg-[#EDF5F2] scroll-mt-24">
                <Container className="space-y-24">
                    {/* Section Header */}
                    <SectionHeading
                        badge="OUR PRODUCTS"
                        title={
                            <>
                                Innovative Tools.<br />
                                Built for <span className="text-[#2DD4BF]">Real Impact.</span>
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

    return (
        <SectionWrapper id="featured-product" className="bg-[#EDF5F2] scroll-mt-24">
            <Container className="space-y-24">
                {/* Section Header */}
                <SectionHeading
                    badge="OUR PRODUCTS"
                    title={
                        <>
                            Innovative Tools.<br />
                            Built for <span className="text-[#2DD4BF]">Real Impact.</span>
                        </>
                    }
                    description="Discover our flagship products designed to simplify operations, supercharge productivity, and deliver measurable results for your business."
                    align="center"
                />

                {displayedProducts.map((product, pIdx) => {
                    const isEven = pIdx % 2 === 0;
                    const tags = Array.isArray(product.tags) ? product.tags : [];
                    const features = Array.isArray(product.features) ? product.features : [];

                    return (
                        <div key={product.id} className="w-full">
                            {/* Top Section Layout (Two Columns) */}
                            <div className={`flex flex-col gap-12 lg:gap-16 items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

                                {/* Text Column */}
                                <div className="w-full lg:w-[45%] flex flex-col text-center lg:text-left items-center lg:items-start">
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        variants={slideUp}
                                        className="flex flex-col items-center lg:items-start"
                                    >
                                        {(product.badgeText || product.isFeatured) && (
                                            <Badge className="mb-4 rounded-md uppercase tracking-widest text-[10px] font-bold bg-[#2DD4BF]/15 text-[#0F766E]">
                                                {product.badgeText || "FEATURED PRODUCT"}
                                            </Badge>
                                        )}

                                        <div className="mb-8 border-l-4 border-[#2DD4BF] pl-4 lg:border-l-4 lg:pl-4 border-l-0 pl-0 border-b-4 pb-2 lg:border-b-0 lg:pb-0 inline-block">
                                            <h4 className="text-[#2DD4BF] font-mono text-sm tracking-widest font-bold mb-2 uppercase">{product.name}</h4>
                                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight tracking-tight">
                                                {product.marketingTitle}
                                            </h2>
                                        </div>

                                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                                            {product.description}
                                        </p>

                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                                                {tags.map((chip: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold shadow-sm">
                                                        {chip}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {features.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 w-full max-w-lg">
                                                {features.slice(0, 4).map((feature: string, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-center lg:justify-start gap-2 text-sm font-semibold text-gray-700">
                                                        <BadgeCheck className="w-4 h-4 text-[#2DD4BF] shrink-0" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {product.productUrl && (
                                            <Button asChild size="lg" className="w-full sm:w-auto bg-[#2DD4BF] hover:bg-[#14b8a6] text-white shadow-lg shadow-[#2DD4BF]/20 rounded-xl group">
                                                <a href={product.productUrl} target="_blank" rel="noopener noreferrer">
                                                    {product.ctaText || `Start using ${product.name}`}
                                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </a>
                                            </Button>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Image Column */}
                                <div className="w-full lg:w-[55%] relative flex justify-center min-h-[400px]">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[#DFE9D4]/40 blur-[80px] rounded-full z-0" />

                                    <motion.div
                                        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="relative z-10 w-full max-w-[650px] aspect-[16/11] bg-white rounded-2xl shadow-2xl shadow-gray-300/50 border border-gray-200 flex flex-col overflow-hidden items-center justify-center"
                                    >
                                        {product.screenshotUrl ? (
                                            <img src={product.screenshotUrl} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400 gap-4 p-8 text-center">
                                                <CloudIcon className="w-16 h-16 opacity-20" />
                                                <p>No screenshot available for {product.name}</p>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Ambient floating elements can go here if needed in future */}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {products.length > displayedProducts.length && (
                    <motion.div
                        id="view-all-featured-products"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center pt-8 scroll-mt-24"
                    >
                        <Link href="/products/all-products" className="inline-flex items-center justify-center font-bold text-lg text-[#6B9F91] hover:text-[#588478] transition-colors group">
                            View All Products
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </Container>
        </SectionWrapper>
    );
}



