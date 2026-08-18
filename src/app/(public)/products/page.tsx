import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/products/Hero";
import { FeaturedProduct } from "@/components/products/FeaturedProduct";


// Dynamically import heavy interactive layers below the fold
const ProductImpacts = dynamic(() => import("@/components/products/ProductImpacts").then(mod => mod.ProductImpacts), { ssr: true });
const Brands = dynamic(() => import("@/components/products/Brands").then(mod => mod.Brands), { ssr: true });
const BookDemo = dynamic(() => import("@/components/products/BookDemo").then(mod => mod.BookDemo), { ssr: true });

export const metadata: Metadata = {
    title: "Enterprise SaaS & Custom Software Products",
    description: "Explore cutting-edge SaaS products, ERP systems, and business automation software engineered by SS40 NETWORK.",
};

export default function ProductsPage() {
            <Hero />
            <FeaturedProduct />

            {/* Below the fold (Deferred JavaScript Chunks) */}
            <ProductImpacts />
            <Brands />
            <BookDemo />
        </div>
    );
}
