import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { BusinessWings } from "@/components/home/BusinessWings";
import { SuccessStories } from "@/components/home/SuccessStories";
import { ActivityUpdates } from "@/components/home/ActivityUpdates";
import { InteractiveImpactShowcase } from "@/components/home/InteractiveImpactShowcase";
import { TrustedBy } from "@/components/home/TrustedBy";
import { ContactSection } from "@/components/home/ContactSection";
import { prisma } from "@/lib/prisma";
import { getSiteConfig } from "@/lib/site-config";

// Sub-15ms TTFB: ISR memory caching with 60s background revalidation
export const revalidate = 60;

export const metadata: Metadata = {
  title: "SS40 NETWORK PRIVATE LIMITED — Enterprise Digital Solutions, SaaS Products & Tech Academics",
  description: "Architecting high-scale digital systems, intelligent SaaS products, and career-launching tech academics by SS40 NETWORK PRIVATE LIMITED. Built in India. Thinking Globally.",
  openGraph: {
    title: "SS40 NETWORK PRIVATE LIMITED — Enterprise Digital Solutions, SaaS Products & Tech Academics",
    description: "Architecting high-scale digital systems, intelligent SaaS products, and career-launching tech academics by SS40 NETWORK PRIVATE LIMITED. Built in India. Thinking Globally.",
    url: "https://www.ss40network.com",
    siteName: "SS40 NETWORK PRIVATE LIMITED",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.ss40network.com/og-image.jpg",
        secureUrl: "https://www.ss40network.com/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "SS40 NETWORK PRIVATE LIMITED — Digital Solutions, SaaS Products & Academics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SS40 NETWORK PRIVATE LIMITED — Enterprise Digital Solutions, SaaS Products & Tech Academics",
    description: "Architecting high-scale digital systems, intelligent SaaS products, and career-launching tech academics by SS40 NETWORK PRIVATE LIMITED. Built in India. Thinking Globally.",
    images: [
      {
        url: "https://www.ss40network.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SS40 NETWORK PRIVATE LIMITED — Digital Solutions, SaaS Products & Academics",
      },
    ],
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
    "name": "SS40 NETWORK PRIVATE LIMITED - Core Services & Sitelinks",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Digital Solutions",
        "description": "Custom enterprise software development, web applications, and AI systems by SS40 NETWORK PRIVATE LIMITED.",
        "url": "https://www.ss40network.com/digital-solutions"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Products",
        "description": "Proprietary SaaS products, enterprise ERPs, and automated software solutions engineered by SS40 NETWORK PRIVATE LIMITED.",
        "url": "https://www.ss40network.com/products"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Academics",
        "description": "Industry-grade tech training, software engineering programs, and student capstone projects by SS40 NETWORK PRIVATE LIMITED.",
        "url": "https://www.ss40network.com/academics"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Contact",
        "description": "Connect with SS40 NETWORK PRIVATE LIMITED in Tirunelveli for consultations, inquiries, and partnerships.",
        "url": "https://www.ss40network.com/contact"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "Blogs & Field Updates",
        "description": "Field visits, institutional partnerships, conclaves, and founder initiatives by SS40 NETWORK PRIVATE LIMITED.",
        "url": "https://www.ss40network.com/blogs"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "Terms of Service",
        "description": "Terms of service and legal conditions for SS40 NETWORK PRIVATE LIMITED.",
        "url": "https://www.ss40network.com/terms"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 7,
        "name": "Privacy Policy",
        "description": "Privacy policy and data protection standards of SS40 NETWORK PRIVATE LIMITED.",
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

      {/* Below the fold (Clean direct imports, 0 preload fragmentation) */}
      <BusinessWings />
      <SuccessStories data={happimonials} />
      <ActivityUpdates data={activities} />
      <InteractiveImpactShowcase />
      <TrustedBy data={logos} />
      <ContactSection config={config} />
    </div>
  );
}
