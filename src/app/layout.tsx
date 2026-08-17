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
  const defaultTitle = config?.seoDefaultTitle || "SS40 NETWORK | Digital Solutions & Academics";
  const company = config?.companyName || "SS40 NETWORK";
  const defaultDesc = config?.seoDefaultDescription || "Premium Digital Solutions, IT Services, and Academics.";
  
  return {
    metadataBase: new URL("https://www.ss40network.com"),
    title: {
      default: defaultTitle,
      template: `%s | ${company}`,
    },
    description: defaultDesc,
    keywords: ["Digital Solutions", "Software Development", "IT Training", "Academics", "Enterprise Software"],
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
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-white">
        {children}
      </body>
    </html>
  );
}
