import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const defaultTitle = config?.seoDefaultTitle || "SS40 NETWORK PRIVATE LIMITED — Enterprise Digital Solutions, SaaS Products & Tech Academics";
  const company = "SS40 NETWORK PRIVATE LIMITED";
  const defaultDesc = config?.seoDefaultDescription || "Architecting high-scale digital systems, intelligent SaaS products, and career-launching tech academics by SS40 NETWORK PRIVATE LIMITED. Built in India. Thinking Globally.";
  
  return {
    metadataBase: new URL("https://www.ss40network.com"),
    title: {
      default: defaultTitle,
      template: `%s | ${company}`,
    },
    description: defaultDesc,
    keywords: [
      "SS40 Network",
      "SS40 Digital Solutions",
      "SS40 Products",
      "SS40 Academics",
      "Best IT Company in Tirunelveli", 
      "Web Development Company", 
      "Custom Software Development", 
      "AI Development Company", 
      "Tech Service Provider",
      "Digital Solutions Agency", 
      "SaaS Products",
      "Mobile App Development",
      "SS40 NETWORK PRIVATE LIMITED"
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
      url: "https://www.ss40network.com",
      siteName: company,
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
      title: defaultTitle,
      description: defaultDesc,
      images: [
        {
          url: "https://www.ss40network.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "SS40 Network — Digital Solutions, SaaS Products & Academics",
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
        "@id": "https://www.ss40network.com/#organization",
        "name": "SS40 NETWORK PRIVATE LIMITED",
        "url": "https://www.ss40network.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.ss40network.com/icon.jpg"
        },
        "description": "Best IT Company in Tirunelveli providing top-notch web development, custom software, and AI development services.",
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
        "areaServed": "Tirunelveli",
        "sameAs": []
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.ss40network.com/#localbusiness",
        "name": "SS40 NETWORK PRIVATE LIMITED",
        "url": "https://www.ss40network.com",
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
        "@id": "https://www.ss40network.com/#website",
        "url": "https://www.ss40network.com",
        "name": "SS40 Network Private Limited",
        "alternateName": ["SS40 Network", "SS40 NETWORK PRIVATE LIMITED"],
        "publisher": {
          "@id": "https://www.ss40network.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.ss40network.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.ss40network.com/digital-solutions"
            },
            "name": "Digital Solutions"
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white" suppressHydrationWarning>
        <VisitorTracker />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
