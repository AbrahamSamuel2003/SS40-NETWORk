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
    title: "Contact Us",
    description: "Connect with SS40 NETWORK to explore digital solutions, academic collaborations, and innovative products.",
};

export default async function ContactPage() {
    const config = await getSiteConfig();
    return (
        <div className="w-full flex-col flex">
            <Hero />
            <ContactMethods config={config} />
            <ContactForm />
            <OfficeLocation config={config} />
            <Faq />
        </div>
    );
}
