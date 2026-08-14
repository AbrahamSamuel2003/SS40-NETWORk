import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { getSiteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";

// Dynamically import heavy interactive layers below the fold
const BusinessWings = dynamic(() => import("@/components/home/BusinessWings").then(mod => mod.BusinessWings), { ssr: true });
const SuccessStories = dynamic(() => import("@/components/home/SuccessStories").then(mod => mod.SuccessStories), { ssr: true });
const InteractiveImpactShowcase = dynamic(() => import("@/components/home/InteractiveImpactShowcase").then(mod => mod.InteractiveImpactShowcase), { ssr: true });
const TrustedBy = dynamic(() => import("@/components/home/TrustedBy").then(mod => mod.TrustedBy), { ssr: true });
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(mod => mod.ContactSection), { ssr: true });

export const metadata: Metadata = {
  title: "Home",
  description: "SS40 NETWORK - Premium Digital Solutions, IT Services, and Academics for forward-thinking businesses.",
};

export default async function Home() {
  const config = await getSiteConfig();

  const [logos, happimonials] = await Promise.all([
    prisma.organizationLogo.findMany({
      where: { pageScope: 'HOME', isActive: true },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.happimonial.findMany({
      where: { pageScope: 'HOME', isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
  ]);

  return (
    <div className="w-full flex-col flex">
      {/* Above the fold (Critical Path LCP) */}
      <Hero />
      <About />

      {/* Below the fold (Deferred JavaScript Chunks) */}
      <BusinessWings />
      <SuccessStories data={happimonials} />
      <InteractiveImpactShowcase />
      <TrustedBy data={logos} />
      <ContactSection config={config} />
    </div>
  );
}
