import type { Metadata } from "next";
import { Inter, Playfair_Display, Crimson_Pro } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const defaultTitle = config?.seoDefaultTitle || "One Company. Three Wings. Endless Possibilities. | SS40 NETWORK PRIVATE LIMITED";
  const company = "SS40 NETWORK PRIVATE LIMITED";
  const defaultDesc = config?.seoDefaultDescription || "SS40 NETWORK PRIVATE LIMITED is a technology company in Tirunelveli architecting enterprise digital solutions, intelligent SaaS products, and career-launching tech academics.";
  
  return {
    metadataBase: new URL("https://ss40network.com"),
    title: {
      default: defaultTitle,
      template: `%s | ${company}`,
    },
    description: defaultDesc,
    keywords: [
      "SS40 NETWORK PRIVATE LIMITED",
      "SS40 NETWORK",
      "IT company in Tirunelveli",
      "software company in Tirunelveli",
      "software development company in Tirunelveli",
      "web development company in Tirunelveli",
      "digital solutions company in Tirunelveli",
      "AI solutions in Tirunelveli",
      "custom software development",
      "SaaS products India",
      "tech academics Tirunelveli",
      "mobile app development"
    ],
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: config?.uploadedLogoUrl || config?.logoUrl || "/icon.jpg",
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDesc,
      url: "https://ss40network.com",
      siteName: company,
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
      title: defaultTitle,
      description: defaultDesc,
      images: [
        {
          url: "https://ss40network.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "SS40 NETWORK PRIVATE LIMITED — Digital Solutions, SaaS Products & Tech Academics",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE_HERE", // Replace with your actual verification code from Google Search Console
      yandex: "YOUR_YANDEX_VERIFICATION_CODE_HERE", // Optional: Add if using Yandex Webmaster
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Advanced SEO Sitelinks & Brand Schema Markup (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ss40network.com/#organization",
        "name": "SS40 NETWORK PRIVATE LIMITED",
        "legalName": "SS40 NETWORK PRIVATE LIMITED",
        "url": "https://ss40network.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ss40network.com/icon.jpg"
        },
        "description": "SS40 NETWORK PRIVATE LIMITED is a technology company in Tirunelveli architecting enterprise digital solutions, intelligent SaaS products, and career-launching tech academics.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1st Floor, Municipal Corporation Incubation Centre (Near by trade centre), Sree Puram",
          "addressLocality": "Tirunelveli",
          "addressRegion": "Tamil Nadu",
          "postalCode": "627001",
          "addressCountry": "IN"
        },
        "telephone": "+91 83005 91750",
        "email": "support@ss40network.com",
        "areaServed": "India, Global",
        "sameAs": [
          "https://www.linkedin.com/company/ss40-network"
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://ss40network.com/#localbusiness",
        "name": "SS40 NETWORK PRIVATE LIMITED",
        "legalName": "SS40 NETWORK PRIVATE LIMITED",
        "url": "https://ss40network.com",
        "telephone": "+91 83005 91750",
        "email": "support@ss40network.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1st Floor, Municipal Corporation Incubation Centre (Near by trade centre), Sree Puram",
          "addressLocality": "Tirunelveli",
          "addressRegion": "Tamil Nadu",
          "postalCode": "627001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "url": "https://goo.gl/maps/DWiCMVGgqKi2r5188"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "18:00"
        },
        "priceRange": "$$"
      },
      {
        "@type": "WebSite",
        "@id": "https://ss40network.com/#website",
        "url": "https://ss40network.com",
        "name": "SS40 NETWORK PRIVATE LIMITED",
        "alternateName": ["SS40 NETWORK PRIVATE LIMITED", "SS40 NETWORK", "SS40"],
        "publisher": {
          "@id": "https://ss40network.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://ss40network.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "SiteNavigationElement",
        "@id": "https://ss40network.com/#navigation",
        "name": "Primary Site Navigation",
        "hasPart": [
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
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${crimsonPro.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white" suppressHydrationWarning>
        <NextTopLoader
          color="#2DD4BF"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2DD4BF, 0 0 5px #0F766E"
          zIndex={99999}
        />
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
