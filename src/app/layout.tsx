import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const defaultTitle = config?.seoDefaultTitle || "SS40 NETWORK | Digital Solutions & Academics";
  const company = config?.companyName || "SS40 NETWORK";
  return {
    title: {
      default: defaultTitle,
      template: `%s | ${company}`,
    },
    description: config?.seoDefaultDescription || "Premium Digital Solutions, IT Services, and Academics.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
