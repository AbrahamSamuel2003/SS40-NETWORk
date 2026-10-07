import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { BusinessWings } from "@/components/home/BusinessWings";
import { SuccessStories } from "@/components/home/SuccessStories";
import { ActivityUpdates } from "@/components/home/ActivityUpdates";
import { TrustedBy } from "@/components/home/TrustedBy";
import { ContactSection } from "@/components/home/ContactSection";
import { prisma } from "@/lib/prisma";
import { getSiteConfig, isSectionVisible } from "@/lib/site-config";

// Real-time instantaneous data reflection for admin updates
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    absolute: "SS40 NETWORK — Enterprise Digital Solutions, SaaS Products & Tech Academics",
  },
  description: "SS40 NETWORK is an enterprise technology company architecting custom digital solutions, intelligent SaaS products, and career-launching tech academics in Tirunelveli.",
  alternates: {
    canonical: "https://ss40network.com",
  },
  openGraph: {
    title: "SS40 NETWORK — Enterprise Digital Solutions, SaaS Products & Tech Academics",
    description: "SS40 NETWORK is an enterprise technology company architecting custom digital solutions, intelligent SaaS products, and career-launching tech academics in Tirunelveli.",
    url: "https://ss40network.com",
    siteName: "SS40 NETWORK",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://ss40network.com/og-image.jpg",
        secureUrl: "https://ss40network.com/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "SS40 NETWORK — Digital Solutions, SaaS Products & Tech Academics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SS40 NETWORK — Enterprise Digital Solutions, SaaS Products & Tech Academics",
    description: "SS40 NETWORK is an enterprise technology company architecting custom digital solutions, intelligent SaaS products, and career-launching tech academics in Tirunelveli.",
    images: [
      {
        url: "https://ss40network.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SS40 NETWORK — Digital Solutions, SaaS Products & Tech Academics",
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
    "name": "SS40 NETWORK - Core Services & Navigation Sitelinks",
    "itemListElement": [
      {
        "@type": "SiteNavigationElement",
        "position": 1,
        "name": "Digital Solutions",
        "description": "Custom enterprise software development, web applications, and AI systems.",
        "url": "https://ss40network.com/digital-solutions"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 2,
        "name": "Products",
        "description": "Proprietary SaaS products, invoicing platforms, and automated software tools.",
        "url": "https://ss40network.com/products"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 3,
        "name": "Academics",
        "description": "Industry-grade tech training, software engineering internships, and placement prep.",
        "url": "https://ss40network.com/academics"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 4,
        "name": "Company",
        "description": "Official corporate identity, MCA incorporation, DPIIT Startup India recognition, and milestones.",
        "url": "https://ss40network.com/company"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 5,
        "name": "Contact Us",
        "description": "Get in touch with SS40 NETWORK in Tirunelveli for digital solutions, software products, and academic partnerships.",
        "url": "https://ss40network.com/contact"
      },
      {
        "@type": "SiteNavigationElement",
        "position": 6,
        "name": "Blogs & Updates",
        "description": "Official field updates, conclaves, institutional partnerships, and founder initiatives.",
        "url": "https://ss40network.com/blogs"
      }
    ]
  };

  return (
    <div className="w-full flex-col flex">
      {/* Declarative Speculative Preload for Primary LCP Hero Visual */}
      <link rel="preload" href="/images/hero/wing-digital-solutions.webp" as="image" type="image/webp" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksSchema) }}
      />
      {/* Above the fold (Critical Path LCP) */}
      <Hero />
      <About />

      {/* Below the fold (GPU-accelerated with content-visibility containment to prevent main-thread layout thrashing) */}
      <div className="cv-auto">
        <BusinessWings />
      </div>
      {isSectionVisible(config, 'home_happimonials') && (
        <div className="cv-auto">
          <SuccessStories data={happimonials} />
        </div>
      )}
      {isSectionVisible(config, 'home_activities') && (
        <div className="cv-auto">
          <ActivityUpdates data={activities} />
        </div>
      )}
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
