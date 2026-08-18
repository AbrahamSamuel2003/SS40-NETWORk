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
 
                                         <div className="mb-6 flex flex-col items-center lg:items-start w-full">
                                             <div className="flex items-center gap-2 mb-2">
                                                 <span className="w-4 h-0.5 bg-[#2DD4BF]" />
                                                 <h4 className="text-[#0F766E] font-mono text-xs tracking-[0.2em] font-extrabold uppercase">{product.name}</h4>
                                             </div>
                                             {(() => {
                                                 const title = product.marketingTitle || "";
                                                 const parts = title.split(/[:|]/);
                                                 if (parts.length > 1) {
                                                     return (
                                                         <>
                                                             <h2 className="text-3xl md:text-4xl lg:text-[44px] font-black text-[#111827] leading-tight tracking-tight">
                                                                 {parts[0].trim()}
                                                             </h2>
                                                             <p className="text-sm md:text-base font-bold bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] bg-clip-text text-transparent mt-2 uppercase tracking-widest">
                                                                 {parts.slice(1).join(":").trim()}
                                                             </p>
                                                         </>
                                                     );
                                                 }
                                                 const words = title.split(' ');
                                                 if (words.length > 2) {
                                                     const lastWord = words.pop();
                                                     const secondLastWord = words.pop();
                                                     return (
                                                         <h2 className="text-3xl md:text-4xl lg:text-[44px] font-black text-[#111827] leading-tight tracking-tight">
                                                             {words.join(' ')} <span className="bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] bg-clip-text text-transparent">{secondLastWord} {lastWord}</span>
                                                         </h2>
                                                     );
                                                 }
                                                 return (
                                                     <h2 className="text-3xl md:text-4xl lg:text-[44px] font-black text-[#111827] leading-tight tracking-tight">
                                                         {title}
                                                     </h2>
                                                 );
                                             })()}
                                         </div>
 
                                         <p className="text-base md:text-lg text-gray-600/95 mb-8 leading-relaxed max-w-lg font-medium text-center lg:text-left">
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
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 w-full max-w-lg text-left">
                                                 {features.slice(0, 4).map((feature: string, idx: number) => (
                                                     <div key={idx} className="flex items-start gap-2.5 p-3.5 bg-white/70 border border-gray-200/50 rounded-xl shadow-sm hover:shadow-md hover:border-[#2DD4BF]/20 transition-all duration-300">
                                                         <BadgeCheck className="w-5 h-5 text-[#2DD4BF] shrink-0 mt-0.5" />
                                                         <span className="text-xs md:text-sm font-semibold text-gray-700 leading-snug">{feature}</span>
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

                                 <motion.div 
                                     initial="hidden"
                                     whileInView="visible"
                                     whileHover="hover"
                                     viewport={{ once: true, margin: "-100px" }}
                                     className="w-full lg:w-[55%] relative flex justify-center items-center min-h-[420px]"
                                 >
                                     {/* Subtle Stage Background */}
                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] z-0 pointer-events-none select-none overflow-visible flex items-center justify-center">
                                         {/* Restrained radial glow */}
                                         <div className="absolute w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.06)_0%,transparent_70%)] blur-[40px] rounded-full" />
                                         
                                         {/* Mini SVG Grid pattern */}
                                         <svg className="absolute w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                             <defs>
                                                 <pattern id={`stage-grid-${product.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                                                     <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="1"/>
                                                 </pattern>
                                             </defs>
                                             <rect width="100%" height="100%" fill={`url(#stage-grid-${product.id})`} />
                                         </svg>

                                         {/* Tiny Particles */}
                                         <motion.div 
                                             animate={{ rotate: 360 }} 
                                             transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
                                             className="absolute w-full h-full"
                                         >
                                             <span className="absolute top-[20%] left-[15%] w-1 h-1 rounded-full bg-[#2DD4BF]/25" />
                                             <span className="absolute top-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-[#6B9F91]/20" />
                                             <span className="absolute bottom-[20%] left-[30%] w-1 h-1 rounded-full bg-[#2DD4BF]/30" />
                                             <span className="absolute bottom-[35%] right-[15%] w-1.5 h-1.5 rounded-full bg-[#6B9F91]/25" />
                                         </motion.div>
                                     </div>

                                     {/* Main Product Screenshot */}
                                     <motion.div
                                         variants={{
                                             hidden: { opacity: 0, scale: 0.96, y: 30 },
                                             visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 15, duration: 0.8 } },
                                             hover: { y: -6, transition: { duration: 0.3 } }
                                         }}
                                         className="relative z-10 w-full max-w-[500px] aspect-[16/11] flex items-center justify-center pointer-events-none"
                                     >
                                         {product.screenshotUrl ? (
                                             <img 
                                                 src={product.screenshotUrl} 
                                                 alt={product.name} 
                                                 className="w-full h-full object-contain select-none filter drop-shadow-[0_20px_35px_rgba(15,118,110,0.18)] transition-all duration-300" 
                                             />
                                         ) : (
                                             <div className="flex flex-col items-center justify-center text-gray-400 gap-4 p-8 text-center select-none">
                                                 <CloudIcon className="w-16 h-16 opacity-20" />
                                                 <p>No screenshot available for {product.name}</p>
                                             </div>
                                         )}
                                     </motion.div>

                                     {/* Floating Perimeter Cards */}
                                     <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
                                         {/* Top-Left */}
                                         {features[0] && (
                                             <motion.div
                                                 variants={{
                                                     hidden: { opacity: 0, scale: 0.8, x: -10, y: -10 },
                                                     visible: { 
                                                         opacity: 1, 
                                                         scale: 1, 
                                                         x: 0, 
                                                         y: 0, 
                                                         transition: { delay: 0.1, duration: 0.5, type: "spring" } 
                                                     },
                                                     hover: { x: -6, y: -6, transition: { duration: 0.3 } }
                                                 }}
                                                 animate={{
                                                     y: [0, -4, 0],
                                                     transition: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.1 }
                                                 }}
                                                 className="absolute top-2 left-2 bg-[#0F766E]/5 backdrop-blur-md border border-[#2DD4BF]/25 px-3.5 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-[#0F766E] flex items-center gap-2"
                                             >
                                                 <BadgeCheck className="w-4 h-4 text-[#2DD4BF]" />
                                                 <span>{features[0]}</span>
                                             </motion.div>
                                         )}

                                         {/* Top-Right */}
                                         {features[1] && (
                                             <motion.div
                                                 variants={{
                                                     hidden: { opacity: 0, scale: 0.8, x: 10, y: -10 },
                                                     visible: { 
                                                         opacity: 1, 
                                                         scale: 1, 
                                                         x: 0, 
                                                         y: 0, 
                                                         transition: { delay: 0.2, duration: 0.5, type: "spring" } 
                                                     },
                                                     hover: { x: 6, y: -6, transition: { duration: 0.3 } }
                                                 }}
                                                 animate={{
                                                     y: [0, 4, 0],
                                                     transition: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.2 }
                                                 }}
                                                 className="absolute top-4 right-2 bg-[#0F766E]/5 backdrop-blur-md border border-[#2DD4BF]/25 px-3.5 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-[#0F766E] flex items-center gap-2"
                                             >
                                                 <BadgeCheck className="w-4 h-4 text-[#2DD4BF]" />
                                                 <span>{features[1]}</span>
                                             </motion.div>
                                         )}

                                         {/* Bottom-Left */}
                                         {features[2] && (
                                             <motion.div
                                                 variants={{
                                                     hidden: { opacity: 0, scale: 0.8, x: -10, y: 10 },
                                                     visible: { 
                                                         opacity: 1, 
                                                         scale: 1, 
                                                         x: 0, 
                                                         y: 0, 
                                                         transition: { delay: 0.3, duration: 0.5, type: "spring" } 
                                                     },
                                                     hover: { x: -6, y: 6, transition: { duration: 0.3 } }
                                                 }}
                                                 animate={{
                                                     y: [0, 4, 0],
                                                     transition: { repeat: Infinity, duration: 4.2, ease: "easeInOut", delay: 0.3 }
                                                 }}
                                                 className="absolute bottom-4 left-2 bg-[#0F766E]/5 backdrop-blur-md border border-[#2DD4BF]/25 px-3.5 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-[#0F766E] flex items-center gap-2"
                                             >
                                                 <BadgeCheck className="w-4 h-4 text-[#2DD4BF]" />
                                                 <span>{features[2]}</span>
                                             </motion.div>
                                         )}

                                         {/* Bottom-Right */}
                                         {features[3] && (
                                             <motion.div
                                                 variants={{
                                                     hidden: { opacity: 0, scale: 0.8, x: 10, y: 10 },
                                                     visible: { 
                                                         opacity: 1, 
                                                         scale: 1, 
                                                         x: 0, 
                                                         y: 0, 
                                                         transition: { delay: 0.4, duration: 0.5, type: "spring" } 
                                                     },
                                                     hover: { x: 6, y: 6, transition: { duration: 0.3 } }
                                                 }}
                                                 animate={{
                                                     y: [0, -4, 0],
                                                     transition: { repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.4 }
                                                 }}
                                                 className="absolute bottom-2 right-2 bg-[#0F766E]/5 backdrop-blur-md border border-[#2DD4BF]/25 px-3.5 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-[#0F766E] flex items-center gap-2"
                                             >
                                                 <BadgeCheck className="w-4 h-4 text-[#2DD4BF]" />
                                                 <span>{features[3]}</span>
                                             </motion.div>
                                         )}
                                     </div>
                                 </motion.div>
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



