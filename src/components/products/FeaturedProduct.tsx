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
            <SectionWrapper id="featured-product" className="bg-[#D8E8E2] scroll-mt-24">
                <Container className="space-y-12 lg:space-y-24">
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
        <SectionWrapper id="featured-product" className="bg-[#D8E8E2] scroll-mt-24">
            <Container className="space-y-12 lg:space-y-24">
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
                    const badgeSource = features.length > 0 ? features : tags;

                    return (
                        <div key={product.id} className="w-full">
                            {/* Top Section Layout (Two Columns) */}
                            <div className={`flex flex-col gap-6 lg:gap-16 items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

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
                                             <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-8">
                                                 {tags.map((chip: string, idx: number) => (
                                                     <span key={idx} className="px-3 py-1.5 bg-white border border-gray-200/80 rounded-xl shadow-sm text-xs font-bold text-gray-700 flex items-center gap-1.5 select-none">
                                                         <BadgeCheck className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                                                         {chip}
                                                     </span>
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
                                      className="w-full lg:w-[55%] relative flex justify-center items-center min-h-[280px] lg:min-h-[420px]"
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

                                          {/* Outer circle — slow clockwise */}
                                          <motion.div
                                              animate={{ rotate: 360 }}
                                              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                                              className="absolute w-[85%] h-[85%]"
                                          >
                                              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#2DD4BF]/60" />
                                          </motion.div>

                                          {/* Inner circle — counter-clockwise */}
                                          <motion.div
                                              animate={{ rotate: -360 }}
                                              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                              className="absolute w-[50%] h-[50%]"
                                          >
                                              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#6B9F91]/60" />
                                          </motion.div>
                                      </div>

                                      {/* Main Product Screenshot (Browser Mockup Shell) */}
                                      <motion.div
                                          variants={{
                                              hidden: { opacity: 0, scale: 0.96, y: 30 },
                                              visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 15, duration: 0.8 } },
                                              hover: { y: -6, transition: { duration: 0.3 } }
                                          }}
                                          className="relative z-10 w-full max-w-[500px] aspect-[16/11] bg-white border border-gray-200/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                                      >
                                          {/* Browser Header Bar */}
                                          <div className="h-8 bg-gray-50 flex items-center px-4 justify-between border-b border-gray-200 shrink-0 select-none">
                                              <div className="flex gap-1.5 shrink-0">
                                                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                                                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                                                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                                              </div>
                                              <div className="bg-white/80 border border-gray-200/60 rounded px-8 py-0.5 text-[9px] font-mono text-gray-400 truncate max-w-[200px]">
                                                  {product.name.toLowerCase()}.com
                                              </div>
                                              <div className="w-12" /> {/* Spacer */}
                                          </div>

                                          <div className="flex-grow flex items-center justify-center p-1 relative bg-gradient-to-tr from-[#E0F2FE] via-[#D8E8E2] to-[#CCFBF1] overflow-hidden">
                                               {/* Light Sun/Halo glow */}
                                               <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-[#99F6E4]/40 blur-[30px] rounded-full pointer-events-none" />
                                               
                                               {/* Abstract vector hills / ocean waves */}
                                               <svg className="absolute bottom-0 left-0 w-full h-[55%] opacity-[0.70] pointer-events-none select-none" style={{color:'#6EE7B7'}} viewBox="0 0 1440 320" fill="currentColor" preserveAspectRatio="none">
                                                   <path d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,117C672,117,768,171,864,186.7C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                                               </svg>
                                               <svg className="absolute bottom-0 left-0 w-full h-[40%] opacity-[0.55] pointer-events-none select-none" style={{color:'#93C5FD'}} viewBox="0 0 1440 320" fill="currentColor" preserveAspectRatio="none">
                                                   <path d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,112C672,117,768,171,864,197.3C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                                               </svg>

                                               {product.screenshotUrl ? (
                                                   <img 
                                                       src={product.screenshotUrl} 
                                                       alt={`${product.name} - Featured Custom Software Solution by SS40 NETWORK Tirunelveli`} 
                                                       className="w-full h-full object-contain select-none transition-all duration-300 relative z-10 filter drop-shadow-[0_12px_24px_rgba(15,118,110,0.15)]" 
                                                   />
                                               ) : (
                                                   <div className="flex flex-col items-center justify-center text-gray-400 gap-4 p-8 text-center select-none relative z-10">
                                                       <CloudIcon className="w-16 h-16 opacity-20" />
                                                       <p>No screenshot available for {product.name}</p>
                                                   </div>
                                               )}
                                           </div>
                                      </motion.div>

                                      {/* Floating Perimeter Cards */}
                                      <div className="absolute inset-0 z-20 pointer-events-none hidden md:block">
                                          {/* Top-Left */}
                                          {badgeSource[0] && (
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
                                                  className="absolute top-2 left-2 bg-[#0F766E]/5 backdrop-blur-md border border-[#2DD4BF]/25 px-3.5 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-[#0F766E] flex items-center gap-2 select-none"
                                              >
                                                  <BadgeCheck className="w-4 h-4 text-[#2DD4BF]" />
                                                  <span>{badgeSource[0]}</span>
                                              </motion.div>
                                          )}

                                          {/* Top-Right */}
                                          {badgeSource[1] && (
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
                                                  className="absolute top-4 right-2 bg-[#0F766E]/5 backdrop-blur-md border border-[#2DD4BF]/25 px-3.5 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-[#0F766E] flex items-center gap-2 select-none"
                                              >
                                                  <BadgeCheck className="w-4 h-4 text-[#2DD4BF]" />
                                                  <span>{badgeSource[1]}</span>
                                              </motion.div>
                                          )}

                                          {/* Bottom-Left */}
                                          {badgeSource[2] && (
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
                                                  className="absolute bottom-4 left-2 bg-[#0F766E]/5 backdrop-blur-md border border-[#2DD4BF]/25 px-3.5 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-[#0F766E] flex items-center gap-2 select-none"
                                              >
                                                  <BadgeCheck className="w-4 h-4 text-[#2DD4BF]" />
                                                  <span>{badgeSource[2]}</span>
                                              </motion.div>
                                          )}

                                          {/* Bottom-Right */}
                                          {badgeSource[3] && (
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
                                                  className="absolute bottom-2 right-2 bg-[#0F766E]/5 backdrop-blur-md border border-[#2DD4BF]/25 px-3.5 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-[#0F766E] flex items-center gap-2 select-none"
                                              >
                                                  <BadgeCheck className="w-4 h-4 text-[#2DD4BF]" />
                                                  <span>{badgeSource[3]}</span>
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



