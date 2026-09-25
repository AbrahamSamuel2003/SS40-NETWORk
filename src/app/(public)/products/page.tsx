import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/products/Hero";

const FeaturedProduct = dynamic(
    () => import("@/components/products/FeaturedProduct").then((mod) => mod.FeaturedProduct)
);
const ProductImpacts = dynamic(
    () => import("@/components/products/ProductImpacts").then((mod) => mod.ProductImpacts)
);
const Brands = dynamic(
    () => import("@/components/products/Brands").then((mod) => mod.Brands)
);
const BookDemo = dynamic(
    () => import("@/components/products/BookDemo").then((mod) => mod.BookDemo)
);

export const metadata: Metadata = {
    title: "Innovative Tools. Built for Real Impact. | SS40 NETWORK PRIVATE LIMITED",
    description: "Discover business-ready SaaS products, invoicing tools, and automated software solutions engineered by SS40 NETWORK PRIVATE LIMITED in Tirunelveli, Tamil Nadu.",
    alternates: {
        canonical: "https://ss40network.com/products",
    },
    openGraph: {
        title: "Innovative Tools. Built for Real Impact. | SS40 NETWORK PRIVATE LIMITED",
        description: "Discover business-ready SaaS products, invoicing tools, and automated software solutions engineered by SS40 NETWORK PRIVATE LIMITED in Tirunelveli, Tamil Nadu.",
        url: "https://ss40network.com/products",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Products — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Innovative Tools. Built for Real Impact. | SS40 NETWORK PRIVATE LIMITED",
        description: "Discover business-ready SaaS products, invoicing tools, and automated software solutions engineered by SS40 NETWORK PRIVATE LIMITED in Tirunelveli, Tamil Nadu.",
        images: ["https://ss40network.com/og-image.jpg"],
    },
};

export const revalidate = 60;

import { prisma } from "@/lib/prisma";
import { getSiteConfig, isSectionVisible } from "@/lib/site-config";

export default async function ProductsPage() {
    const [config, products, happimonials, logos] = await Promise.all([
        getSiteConfig(),
        prisma.product.findMany({
            where: { isActive: true },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'asc' }
            ]
        }).catch(() => []),
        prisma.happimonial.findMany({
            where: { pageScope: 'PRODUCTS', isActive: true },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ]
        }).catch(() => []),
        prisma.organizationLogo.findMany({
            where: { pageScope: 'PRODUCTS', isActive: true },
            orderBy: [
                { sortOrder: 'asc' },
                { createdAt: 'desc' }
            ]
        }).catch(() => [])
    ]);

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://ss40network.com/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Products",
                        "item": "https://ss40network.com/products"
                    }
                ]
            },
            {
                "@type": "Product",
                "@id": "https://ss40network.com/products#software",
                "name": "Enterprise Software & SaaS Suite",
                "brand": {
                    "@type": "Brand",
                    "name": "SS40 NETWORK PRIVATE LIMITED"
                },
                "manufacturer": {
                    "@type": "Organization",
                    "name": "SS40 NETWORK PRIVATE LIMITED",
                    "url": "https://ss40network.com"
                },
                "description": "Comprehensive SaaS products and automated enterprise tools engineered for modern business scalability by SS40 NETWORK PRIVATE LIMITED."
            }
        ]
    };

    return (
        <div className="w-full flex-col flex">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Above the fold (Critical Path) */}
            <Hero />
            {isSectionVisible(config, 'products_showcase') && (
                <div className="cv-auto">
                    <FeaturedProduct initialData={products} />
                </div>
            )}

            {/* Below the fold (GPU-accelerated with content-visibility containment) */}
            {isSectionVisible(config, 'products_testimonials') && (
                <div className="cv-auto">
                    <ProductImpacts initialData={happimonials} />
                </div>
            )}
            {isSectionVisible(config, 'products_logos') && (
                <div className="cv-auto">
                    <Brands initialData={logos} />
                </div>
            )}
            <div className="cv-auto">
                <BookDemo />
            </div>
        </div>
    );
}
