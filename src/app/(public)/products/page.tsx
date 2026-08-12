import dynamic from "next/dynamic";
import { Hero } from "@/components/products/Hero";
import { FeaturedProduct } from "@/components/products/FeaturedProduct";

// Dynamically import heavy interactive layers below the fold
const ProductImpacts = dynamic(() => import("@/components/products/ProductImpacts").then(mod => mod.ProductImpacts), { ssr: true });
const Brands = dynamic(() => import("@/components/products/Brands").then(mod => mod.Brands), { ssr: true });
const BookDemo = dynamic(() => import("@/components/products/BookDemo").then(mod => mod.BookDemo), { ssr: true });

export default function ProductsPage() {
    return (
        <div className="w-full flex-col flex">
            {/* Above the fold (Critical Path) */}
            <Hero />
            <FeaturedProduct />

            {/* Below the fold (Deferred JavaScript Chunks) */}
            <ProductImpacts />
            <Brands />
            <BookDemo />
        </div>
    );
}
