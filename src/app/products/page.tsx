import { Hero } from "@/components/products/Hero";
import { FeaturedProduct } from "@/components/products/FeaturedProduct";
import { Brands } from "@/components/products/Brands";
import { ProductImpacts } from "@/components/products/ProductImpacts";
import { BookDemo } from "@/components/products/BookDemo";

export default function ProductsPage() {
    return (
        <div className="w-full flex-col flex">
            <Hero />
            <FeaturedProduct />
            <ProductImpacts />
            <Brands />
            <BookDemo />
        </div>
    );
}
