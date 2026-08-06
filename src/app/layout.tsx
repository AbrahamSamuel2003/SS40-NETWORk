import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SS40 NETWORK | Digital Solutions & Academics",
  description: "Premium Digital Solutions, IT Services, and Academics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white">
        <PageWrapper>{children}</PageWrapper>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
