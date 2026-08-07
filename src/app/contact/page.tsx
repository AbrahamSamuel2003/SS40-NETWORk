import dynamic from "next/dynamic";
import { Hero } from "@/components/contact/Hero";
import { ContactMethods } from "@/components/contact/ContactMethods";

// Dynamically import heavy interactive layers below the fold (matches the
// pattern used by the other content pages). `ssr: true` keeps the server-rendered
// HTML identical on first load — only the JS chunk is deferred.
const ContactForm = dynamic(() => import("@/components/contact/ContactForm").then(mod => mod.ContactForm), { ssr: true });
const OfficeLocation = dynamic(() => import("@/components/contact/OfficeLocation").then(mod => mod.OfficeLocation), { ssr: true });
const Faq = dynamic(() => import("@/components/contact/Faq").then(mod => mod.Faq), { ssr: true });

export const metadata = {
    title: "Contact Us | SS40 NETWORK",
    description: "Connect with SS40 NETWORK to explore digital solutions, academic collaborations, and innovative products.",
};

export default function ContactPage() {
    return (
        <div className="w-full flex-col flex">
            <Hero />
            <ContactMethods />
            <ContactForm />
            <OfficeLocation />
            <Faq />
        </div>
    );
}
