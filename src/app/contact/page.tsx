import { Hero } from "@/components/contact/Hero";
import { ContactMethods } from "@/components/contact/ContactMethods";
import { ContactForm } from "@/components/contact/ContactForm";
import { OfficeLocation } from "@/components/contact/OfficeLocation";
import { Faq } from "@/components/contact/Faq";

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
