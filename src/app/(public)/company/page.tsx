import * as React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { CompanyHero } from "@/components/company/CompanyHero";
import { OfficialCertifications } from "@/components/company/OfficialCertifications";

const CompanyTimeline = dynamic(
    () => import("@/components/company/CompanyTimeline").then((mod) => mod.CompanyTimeline),
    { ssr: true }
);

const CorporateGovernance = dynamic(
    () => import("@/components/company/CorporateGovernance").then((mod) => mod.CorporateGovernance),
    { ssr: true }
);

const CompanyCTA = dynamic(
    () => import("@/components/company/CompanyCTA").then((mod) => mod.CompanyCTA),
    { ssr: true }
);

export const metadata: Metadata = {
    title: "Company",
    description:
        "Official corporate identity, MCA incorporation (CIN: U62013TN2025PTC187678), GST compliance (33ABSCS2156D1ZC), DPIIT Startup India recognition (#DIPP268327), MSME Udyam Registration (UDYAM-TN-18-0099217), and StartupTN accreditation (STN97774) of SS40 NETWORK.",
    alternates: {
        canonical: "https://ss40network.com/company",
    },
    keywords: [
        "SS40 NETWORK",
        "SS40 NETWORK PRIVATE LIMITED",
        "SS40 NETWORK Company Profile",
        "MCA Registered Company",
        "GST Registered Software Company",
        "DPIIT Recognized Startup",
        "Startup India Recognition DIPP268327",
        "MSME Udyam Registration",
        "UDYAM-TN-18-0099217",
        "StartupTN Recognized Startup",
        "StartupTN SmartCard STN97774",
        "IT Services Tamil Nadu",
        "CIN U62013TN2025PTC187678",
    ],
    openGraph: {
        title: "Company | SS40 NETWORK",
        description:
            "Official corporate identity, MCA incorporation, GST compliance, DPIIT recognition, MSME registration, and StartupTN accreditation of SS40 NETWORK.",
        type: "website",
        url: "https://ss40network.com/company",
    },
};

export default function CompanyPage() {
    // Structured JSON-LD Organization Schema for SEO
    const organizationJsonLd = {
        "@context": "https://schema.org",
        "@type": "Corporation",
        "name": "SS40 NETWORK PRIVATE LIMITED",
        "legalName": "SS40 NETWORK PRIVATE LIMITED",
        "url": "https://ss40network.com",
        "logo": "https://ss40network.com/icon.jpg",
        "foundingDate": "2025-12-23",
        "founders": [
            {
                "@type": "Person",
                "name": "Muppidathi Sivasubramanian",
                "jobTitle": "Director"
            },
            {
                "@type": "Person",
                "name": "Muppidathi",
                "jobTitle": "Director"
            }
        ],
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "5/4/37a, West Car Street, Petta, Vadakku Ariyanayakipuram, Ambasamudram",
            "addressLocality": "Tirunelveli",
            "addressRegion": "Tamil Nadu",
            "postalCode": "627603",
            "addressCountry": "IN"
        },
        "taxID": "33ABSCS2156D1ZC",
        "identifier": [
            {
                "@type": "PropertyValue",
                "name": "CIN",
                "value": "U62013TN2025PTC187678"
            },
            {
                "@type": "PropertyValue",
                "name": "GSTIN",
                "value": "33ABSCS2156D1ZC"
            },
            {
                "@type": "PropertyValue",
                "name": "DPIIT Recognition Number",
                "value": "DIPP268327"
            },
            {
                "@type": "PropertyValue",
                "name": "Udyam Registration Number",
                "value": "UDYAM-TN-18-0099217"
            },
            {
                "@type": "PropertyValue",
                "name": "StartupTN SmartCard Number",
                "value": "STN97774"
            }
        ]
    };

    return (
        <main className="min-h-screen bg-white font-crimson font-serif">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            {/* Section 1: Hero (bg-white) */}
            <CompanyHero />

            {/* Section 2: Official Certifications (bg-[#D8E8E2]) */}
            <OfficialCertifications />

            {/* Section 3: The Story of SS40 NETWORK (bg-white) */}
            <CompanyTimeline />

            {/* Section 4: Corporate Governance & Leadership (bg-[#D8E8E2]) */}
            <CorporateGovernance />

            {/* Section 5: Partner With SS40 NETWORK CTA (bg-white) */}
            <CompanyCTA />
        </main>
    );
}
