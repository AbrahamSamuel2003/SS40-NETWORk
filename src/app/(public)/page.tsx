import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { getHomeDataCached } from "@/lib/home-cache";

// Code-split below-the-fold components to reduce initial main-thread JavaScript execution
const BusinessWings = dynamic(() => import("@/components/home/BusinessWings").then(mod => mod.BusinessWings), { ssr: true });
const SuccessStories = dynamic(() => import("@/components/home/SuccessStories").then(mod => mod.SuccessStories), { ssr: true });
const ActivityUpdates = dynamic(() => import("@/components/home/ActivityUpdates").then(mod => mod.ActivityUpdates), { ssr: true });
const InteractiveImpactShowcase = dynamic(() => import("@/components/home/InteractiveImpactShowcase").then(mod => mod.InteractiveImpactShowcase));
const TrustedBy = dynamic(() => import("@/components/home/TrustedBy").then(mod => mod.TrustedBy), { ssr: true });
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(mod => mod.ContactSection), { ssr: true });

export const revalidate = 3600; // 1 hour ISR caching

export const metadata: Metadata = {
  title: "SS40 NETWORK PRIVATE LIMITED - Top IT Company in Tirunelveli",
  description: "SS40 NETWORK PRIVATE LIMITED is the leading IT company in Tirunelveli, Tamil Nadu. We specialize in custom software development, web applications, AI solutions, and IT training.",
};

export default async function Home() {
  // Ultra-fast cached data fetch (resolves in < 15ms)
  const { config, logos, happimonials, activities } = await getHomeDataCached();

  const sitelinksSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Digital Solutions",
        "description": "Premium Web Development, Mobile Apps, and AI Solutions",
        "url": "https://www.ss40network.com/digital-solutions"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Products",
        "description": "Explore our innovative software products and tools.",
        "url": "https://www.ss40network.com/products"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Academics",
        "description": "Tech training, internships, and student project guidance.",
        "url": "https://www.ss40network.com/academics"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Contact Us",
        "description": "Get in touch with SS40 NETWORK PRIVATE LIMITED.",
        "url": "https://www.ss40network.com/contact"
      }
    ]
  };

  return (
    <div className="w-full flex-col flex">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksSchema) }}
      />
      {/* Above the fold (Critical Path LCP) */}
      <Hero />
      <About />

      {/* Below the fold (Deferred JavaScript Chunks) */}
      <BusinessWings />
      <SuccessStories data={happimonials} />
      <ActivityUpdates data={activities} />
      <InteractiveImpactShowcase />
      <TrustedBy data={logos} />
      <ContactSection config={config} />
    </div>
  );
}
