import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";

// Code-split below-the-fold components to reduce initial main-thread JavaScript execution
const BusinessWings = dynamic(() => import("@/components/home/BusinessWings").then(mod => mod.BusinessWings), { ssr: true });
const SuccessStories = dynamic(() => import("@/components/home/SuccessStories").then(mod => mod.SuccessStories), { ssr: true });
const ActivityUpdates = dynamic(() => import("@/components/home/ActivityUpdates").then(mod => mod.ActivityUpdates), { ssr: true });
const InteractiveImpactShowcase = dynamic(() => import("@/components/home/InteractiveImpactShowcase").then(mod => mod.InteractiveImpactShowcase), { ssr: true });
const TrustedBy = dynamic(() => import("@/components/home/TrustedBy").then(mod => mod.TrustedBy), { ssr: true });
const ContactSection = dynamic(() => import("@/components/home/ContactSection").then(mod => mod.ContactSection), { ssr: true });

export const revalidate = 0; // Real-time dynamic CMS replication

export const metadata: Metadata = {
  title: "SS40 Network | Intelligent Digital Solutions, SaaS Products & Academics",
  description: "One Company. Three Business Wings. Driving the modern era forward with world-class digital services, innovative SaaS products, and elite academic empowerment.",
  openGraph: {
    title: "SS40 Network | Intelligent Digital Solutions, SaaS Products & Academics",
    description: "One Company. Three Business Wings. Driving the modern era forward with world-class digital services, innovative SaaS products, and elite academic empowerment.",
    url: "https://www.ss40network.com",
    siteName: "SS40 Network",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.ss40network.com/og-image.jpg",
        secureUrl: "https://www.ss40network.com/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "SS40 Network - Intelligent Digital Solutions, SaaS Products & Academics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SS40 Network | Intelligent Digital Solutions, SaaS Products & Academics",
    description: "One Company. Three Business Wings. Driving the modern era forward with world-class digital services, innovative SaaS products, and elite academic empowerment.",
    images: ["https://www.ss40network.com/og-image.jpg"],
  },
};

export default async function Home() {
  // Ultra-fast direct Prisma data fetch in parallel
  const [config, logos, happimonials, activities] = await Promise.all([
    getSiteConfig(),
    prisma.organizationLogo.findMany({
      where: { pageScope: 'HOME', isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    }),
    prisma.happimonial.findMany({
      where: { pageScope: 'HOME', isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    }),
    prisma.activityPost.findMany({
      where: { showOnHome: true, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { activityDate: 'desc' }]
    })
  ]);

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
        "name": "Contact",
        "description": "Get in touch with SS40 Network.",
        "url": "https://www.ss40network.com/contact"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "Terms of Service",
        "description": "Terms of service and legal conditions for SS40 Network.",
        "url": "https://www.ss40network.com/terms"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "Privacy Policy",
        "description": "Privacy policy and data protection guidelines of SS40 Network.",
        "url": "https://www.ss40network.com/privacy-policy"
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
