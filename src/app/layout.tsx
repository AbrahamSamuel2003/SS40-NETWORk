import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const defaultTitle = config?.seoDefaultTitle || "SS40 NETWORK PRIVATE LIMITED | Best IT Company in Tirunelveli | Web & AI Development";
  const company = "SS40 NETWORK PRIVATE LIMITED";
  const defaultDesc = config?.seoDefaultDescription || "Top-rated IT Company in Tirunelveli offering premium Web Development, Custom Software Solutions, AI Development, and Tech Services to transform your business.";
  
  return {
    metadataBase: new URL("https://www.ss40network.com"),
    title: {
      default: defaultTitle,
      template: `%s | ${company}`,
    },
    description: defaultDesc,
    keywords: [
      "Best IT Company in Tirunelveli", 
      "Web Development in Tirunelveli", 
      "Custom Software Development", 
      "AI Development Company", 
      "Tech Service Provider",
      "Digital Solutions", 
      "Software Agency Tirunelveli",
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
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDesc,
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
        "name": "SS40 NETWORK PRIVATE LIMITED",
        "publisher": {
          "@id": "https://www.ss40network.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.ss40network.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        {children}
      </body>
    </html>
  );
}
