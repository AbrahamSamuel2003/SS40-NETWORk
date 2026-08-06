import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";

// Dynamically import heavy interactive layers below the fold
const BusinessWings = dynamic(() => import("@/components/home/BusinessWings").then(mod => mod.BusinessWings), { ssr: true });
const SuccessStories = dynamic(() => import("@/components/home/SuccessStories").then(mod => mod.SuccessStories), { ssr: true });
const InteractiveImpactShowcase = dynamic(() => import("@/components/home/InteractiveImpactShowcase").then(mod => mod.InteractiveImpactShowcase), { ssr: true });
const TrustedBy = dynamic(() => import("@/components/home/TrustedBy").then(mod => mod.TrustedBy), { ssr: true });
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(mod => mod.ContactSection), { ssr: true });

export default function Home() {
  return (
    <div className="w-full flex-col flex">
      {/* Above the fold (Critical Path LCP) */}
      <Hero />
      <About />

      {/* Below the fold (Deferred JavaScript Chunks) */}
      <BusinessWings />
      <SuccessStories />
      <InteractiveImpactShowcase />
      <TrustedBy />
      <ContactSection />
    </div>
  );
}
