import * as React from "react";
import dynamic from "next/dynamic";
import { Hero } from "@/components/contact/Hero";
import { ContactMethods } from "@/components/contact/ContactMethods";

// Dynamically import heavy interactive layers below the fold (matches the
// pattern used by the other content pages). `ssr: true` keeps the server-rendered
// HTML identical on first load — only the JS chunk is deferred.
import type { SiteConfigData } from "@/lib/site-config";
const ContactForm = dynamic(() => import("@/components/contact/ContactForm").then(mod => mod.ContactForm), { ssr: true });
const OfficeLocation = dynamic<{ config?: SiteConfigData | null }>(() => import("@/components/contact/OfficeLocation").then(mod => mod.OfficeLocation), { ssr: true });
const Faq = dynamic(() => import("@/components/contact/Faq").then(mod => mod.Faq), { ssr: true });

import { getSiteConfig } from "@/lib/site-config";

export const metadata = {
    title: "Contact Top Software Developers in Tirunelveli",
    description: "Get in touch with SS40 NETWORK for custom web development, AI software, or enterprise IT solutions. Located in Tirunelveli, Tamil Nadu.",
};

export default async function ContactPage() {
    const config = await getSiteConfig();
    return (
        <div className="w-full flex-col flex">
            <Hero />
            <ContactMethods config={config} />
            <OfficeLocation config={config} />
            <React.Suspense fallback={<div className="py-20 text-center text-gray-500">Loading form...</div>}>
                <ContactForm />
            </React.Suspense>
            <Faq />
        </div>
    );
}
