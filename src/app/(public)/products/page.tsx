import type { Metadata } from "next";
import { Hero } from "@/components/products/Hero";
import { FeaturedProduct } from "@/components/products/FeaturedProduct";
import { ProductImpacts } from "@/components/products/ProductImpacts";
import { Brands } from "@/components/products/Brands";
import { BookDemo } from "@/components/products/BookDemo";

export const metadata: Metadata = {
    title: "Products | SS40 NETWORK PRIVATE LIMITED",
    description: "Explore proprietary high-performance SaaS tools, enterprise ERP systems, and automated software products built by SS40 NETWORK PRIVATE LIMITED.",
    alternates: {
        canonical: "https://www.ss40network.com/products",
    },
    openGraph: {
        title: "Products | SS40 NETWORK PRIVATE LIMITED",
        description: "Explore proprietary high-performance SaaS tools, enterprise ERP systems, and automated software products built by SS40 NETWORK PRIVATE LIMITED.",
        url: "https://www.ss40network.com/products",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Products — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Products | SS40 NETWORK PRIVATE LIMITED",
        description: "Explore proprietary high-performance SaaS tools, enterprise ERP systems, and automated software products built by SS40 NETWORK PRIVATE LIMITED.",
        images: ["https://www.ss40network.com/og-image.jpg"],
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
                        "item": "https://www.ss40network.com/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Products",
                        "item": "https://www.ss40network.com/products"
                    }
                ]
            },
            {
                "@type": "Product",
                "@id": "https://www.ss40network.com/products#software",
                "name": "Enterprise Software & SaaS Suite",
                "brand": {
                    "@type": "Brand",
                    "name": "SS40 NETWORK PRIVATE LIMITED"
                },
                "manufacturer": {
                    "@type": "Organization",
                    "name": "SS40 NETWORK PRIVATE LIMITED",
                    "url": "https://www.ss40network.com"
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
                <FeaturedProduct initialData={products} />
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
