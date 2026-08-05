import { Hero } from "@/components/home/Hero";
import { TrustedBy } from "@/components/home/TrustedBy";
import { About } from "@/components/home/About";
import { BusinessWings } from "@/components/home/BusinessWings";
import { SuccessStories } from "@/components/home/SuccessStories";
import { InteractiveImpactShowcase } from "@/components/home/InteractiveImpactShowcase";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  return (
    <div className="w-full flex-col flex">
      <Hero />
      <About />
      <BusinessWings />
      <SuccessStories />
      <InteractiveImpactShowcase />
      <TrustedBy />
      <ContactSection />
    </div>
  );
}
