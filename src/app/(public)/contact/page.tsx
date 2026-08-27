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
    title: "Contact | SS40 NETWORK PRIVATE LIMITED",
    description: "Connect with SS40 NETWORK PRIVATE LIMITED in Tirunelveli for custom enterprise software development, product demos, and academic collaborations.",
    alternates: {
        canonical: "https://www.ss40network.com/contact",
    },
    openGraph: {
        title: "Contact | SS40 NETWORK PRIVATE LIMITED",
        description: "Connect with SS40 NETWORK PRIVATE LIMITED in Tirunelveli for custom enterprise software development, product demos, and academic collaborations.",
        url: "https://www.ss40network.com/contact",
        siteName: "SS40 NETWORK PRIVATE LIMITED",
        type: "website",
        images: [
            {
                url: "https://www.ss40network.com/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Contact — SS40 NETWORK PRIVATE LIMITED",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact | SS40 NETWORK PRIVATE LIMITED",
        description: "Connect with SS40 NETWORK PRIVATE LIMITED in Tirunelveli for custom enterprise software development, product demos, and academic collaborations.",
        images: ["https://www.ss40network.com/og-image.jpg"],
    },
};

export const revalidate = 60;

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
                        "item": "https://www.ss40network.com/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Contact",
                        "item": "https://www.ss40network.com/contact"
                    }
                ]
            },
            {
                "@type": "ContactPage",
                "@id": "https://www.ss40network.com/contact#page",
                "name": "Contact SS40 NETWORK PRIVATE LIMITED",
                "url": "https://www.ss40network.com/contact",
                "mainEntity": {
                    "@type": "Organization",
                    "name": "SS40 NETWORK PRIVATE LIMITED",
                    "telephone": "+91 83005 91750",
                    "email": "support@ss40network.com",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "1st Floor, Municipal Corporation Incubation Centre (Near by trade centre), Sree Puram",
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

            {/* Below the fold */}
            <OfficeLocation config={config} />
            <Suspense fallback={<div className="w-full py-16 text-center text-gray-400" />}>
                <ContactForm />
            </Suspense>
            <Faq />
        </div>
    );
}
