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
import { getSiteConfig, isSectionVisible } from "@/lib/site-config";

// Sub-15ms TTFB: ISR memory caching with 60s background revalidation
export const revalidate = 60;

export const metadata: Metadata = {
  title: "One Company. Three Wings. Endless Possibilities. | SS40 NETWORK PRIVATE LIMITED",
  description: "SS40 NETWORK PRIVATE LIMITED is a technology company in Tirunelveli architecting enterprise digital solutions, intelligent SaaS products, and career-launching tech academics.",
  alternates: {
    canonical: "https://ss40network.com",
  },
  openGraph: {
    title: "One Company. Three Wings. Endless Possibilities. | SS40 NETWORK PRIVATE LIMITED",
    description: "SS40 NETWORK PRIVATE LIMITED is a technology company in Tirunelveli architecting enterprise digital solutions, intelligent SaaS products, and career-launching tech academics.",
    url: "https://ss40network.com",
    siteName: "SS40 NETWORK PRIVATE LIMITED",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://ss40network.com/og-image.jpg",
        secureUrl: "https://ss40network.com/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "SS40 NETWORK PRIVATE LIMITED — Digital Solutions, SaaS Products & Tech Academics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "One Company. Three Wings. Endless Possibilities. | SS40 NETWORK PRIVATE LIMITED",
    description: "SS40 NETWORK PRIVATE LIMITED is a technology company in Tirunelveli architecting enterprise digital solutions, intelligent SaaS products, and career-launching tech academics.",
    images: [
      {
        url: "https://ss40network.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SS40 NETWORK PRIVATE LIMITED — Digital Solutions, SaaS Products & Tech Academics",
      },
    ],
  },
};

export default async function Home() {
  // Ultra-fast direct Prisma data fetch in parallel with safe fallbacks
  const [config, logos, happimonials, activities] = await Promise.all([
    getSiteConfig(),
    prisma.organizationLogo.findMany({
      where: { pageScope: 'HOME', isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    }).catch(() => []),
    prisma.happimonial.findMany({
      where: { pageScope: 'HOME', isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    }).catch(() => []),
    prisma.activityPost.findMany({
      where: { showOnHome: true, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { activityDate: 'desc' }]
    }).catch(() => [])
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
        "description": "Engineering Digital Experiences That Scale | Custom software development, web applications, and AI systems.",
        "url": "https://ss40network.com/digital-solutions"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Products",
        "description": "Innovative Tools. Built for Real Impact. | Proprietary SaaS products and automated software tools.",
        "url": "https://ss40network.com/products"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Academics",
        "description": "Learn. Build. Grow. | Industry-grade tech training, software engineering programs, and live capstone projects.",
        "url": "https://ss40network.com/academics"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Contact",
        "description": "Let's Build Something Amazing Together | Connect with SS40 NETWORK PRIVATE LIMITED in Tirunelveli.",
        "url": "https://ss40network.com/contact"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "Blogs & Field Updates",
        "description": "Field Updates, Conclaves & Founder Initiatives | Institutional partnerships and founder activities.",
        "url": "https://ss40network.com/blogs"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "Client Projects",
        "description": "Enterprise Client Projects & Case Studies | Custom software systems delivered for enterprise clients.",
        "url": "https://ss40network.com/client-projects"
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

      {/* Below the fold (GPU-accelerated with content-visibility containment) */}
      <BusinessWings />
      {isSectionVisible(config, 'home_happimonials') && <SuccessStories data={happimonials} />}
      {isSectionVisible(config, 'home_activities') && <ActivityUpdates data={activities} />}
      <InteractiveImpactShowcase />
      {isSectionVisible(config, 'home_logos') && (
        <div className="cv-auto">
          <TrustedBy data={logos} />
        </div>
      )}
      <div className="cv-auto">
        <ContactSection config={config} />
      </div>
    </div>
  );
}
