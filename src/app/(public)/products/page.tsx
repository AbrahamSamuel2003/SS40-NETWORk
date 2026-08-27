import type { Metadata } from "next";
import { Hero } from "@/components/products/Hero";
import { FeaturedProduct } from "@/components/products/FeaturedProduct";
import { ProductImpacts } from "@/components/products/ProductImpacts";
import { Brands } from "@/components/products/Brands";
import { BookDemo } from "@/components/products/BookDemo";

export const metadata: Metadata = {
    title: "Enterprise SaaS & Custom Software Products",
    description: "Explore cutting-edge SaaS products, ERP systems, and business automation software engineered by SS40 NETWORK.",
};

export const revalidate = 60;

export default function ProductsPage() {
    return (
        <div className="w-full flex-col flex">
            {/* Above the fold (Critical Path) */}
            <Hero />
            <FeaturedProduct />

            {/* Below the fold (Clean direct imports, 0 preload fragmentation) */}
            <ProductImpacts />
            <Brands />
            <BookDemo />
        </div>
    );
}
