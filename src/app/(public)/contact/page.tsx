import * as React from "react";
import { Suspense } from "react";
import { Hero } from "@/components/contact/Hero";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { ContactForm } from "@/components/contact/ContactForm";
import { OfficeLocation } from "@/components/contact/OfficeLocation";
import { Faq } from "@/components/contact/Faq";
import { getSiteConfig } from "@/lib/site-config";

export const metadata = {
    title: "Contact Top Software Developers in Tirunelveli",
    description: "Get in touch with SS40 NETWORK for custom web development, AI software, or enterprise IT solutions. Located in Tirunelveli, Tamil Nadu.",
};

export const revalidate = 60;

export default async function ContactPage() {
    const config = await getSiteConfig();
    return (
        <div className="w-full flex-col flex">
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
