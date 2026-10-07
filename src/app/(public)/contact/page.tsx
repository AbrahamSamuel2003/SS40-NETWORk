import * as React from "react";
import { Suspense } from "react";
import { Hero } from "@/components/contact/Hero";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { ContactForm } from "@/components/contact/ContactForm";
import { OfficeLocation } from "@/components/contact/OfficeLocation";
import { Faq } from "@/components/contact/Faq";
import { getSiteConfig } from "@/lib/site-config";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | SS40 NETWORK",
    description: "Get in touch with SS40 NETWORK in Tirunelveli for custom digital solutions, SaaS software products, and academic tech training partnerships.",
    alternates: {
        canonical: "https://ss40network.com/contact",
    },
    openGraph: {
        title: "Contact Us | SS40 NETWORK",
        description: "Get in touch with SS40 NETWORK in Tirunelveli for custom digital solutions, SaaS software products, and academic tech training partnerships.",
        url: "https://ss40network.com/contact",
        siteName: "SS40 NETWORK",
        type: "website",
        images: [
            {
                url: "https://ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Contact — SS40 NETWORK",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | SS40 NETWORK",
        description: "Get in touch with SS40 NETWORK in Tirunelveli for custom digital solutions, SaaS software products, and academic tech training partnerships.",
        images: ["https://ss40network.com/og-image.jpg"],
    },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContactPage() {
    const config = await getSiteConfig();

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
                        "name": "Contact",
                        "item": "https://ss40network.com/contact"
                    }
                ]
            },
            {
                "@type": "ContactPage",
                "@id": "https://ss40network.com/contact#page",
                "name": `Contact ${config?.companyName || "SS40 NETWORK PRIVATE LIMITED"}`,
                "url": "https://ss40network.com/contact",
                "mainEntity": {
                    "@type": "Organization",
                    "name": config?.companyName || "SS40 NETWORK PRIVATE LIMITED",
                    "telephone": config?.contactPhone || "+91 83005 91750",
                    "email": config?.contactEmail || "support@ss40network.com",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": config?.addressText || "1st Floor, Municipal Corporation Incubation Centre (Near by trade centre), Sree Puram",
                        "addressLocality": "Tirunelveli",
                        "addressRegion": "Tamil Nadu",
                        "postalCode": "627001",
                        "addressCountry": "IN"
                    }
                }
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
            <ContactMethods config={config} />

            {/* Below the fold (GPU-accelerated with content-visibility containment for 0-latency paint) */}
            <div className="cv-auto">
                <OfficeLocation config={config} />
            </div>
            <div className="cv-auto">
                <Suspense fallback={<div className="w-full py-16 text-center text-gray-400" />}>
                    <ContactForm />
                </Suspense>
            </div>

            {/* Standalone FAQ section for mobile screens only */}
            <div className="block lg:hidden cv-auto">
                <Faq />
            </div>
        </div>
    );
}
