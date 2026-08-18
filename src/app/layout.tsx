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
  const defaultTitle = config?.seoDefaultTitle || "SS40 NETWORK | Best IT Company in Tirunelveli | Web & AI Development";
  const company = config?.companyName || "SS40 NETWORK";
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
      "SS40 NETWORK"
    ],
    alternates: {
      canonical: "/",
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
      google: "add-your-google-site-verification-code-here", // Note for user to add
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Advanced Local SEO Schema Markup (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ITService", // Highly specific business type
    "name": "SS40 NETWORK",
    "image": "https://www.ss40network.com/icon.jpg",
    "@id": "https://www.ss40network.com",
    "url": "https://www.ss40network.com",
    "telephone": "", // Add your company phone here
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Tirunelveli",
      "addressRegion": "Tamil Nadu",
      "postalCode": "",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 8.7139, // Approx Tirunelveli coordinates
      "longitude": 77.7567
    },
    "url": "https://www.ss40network.com",
    "sameAs": [
      // Add social media links here
    ],
    "description": "Best IT Company in Tirunelveli providing top-notch web development, custom software, and AI development services.",
    "priceRange": "$$"
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
