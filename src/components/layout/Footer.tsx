import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { getSiteConfig } from "@/lib/site-config";

import { FooterInteractive } from "./FooterInteractive";

const Linkedin = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);
const Instagram = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);
const Youtube = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
);

export async function Footer() {
    const config = await getSiteConfig();
    const currentYear = new Date().getFullYear();
    const companyName = config?.companyName || "SS40 NETWORK";

    return (
        <FooterInteractive>
            <div className="container-width">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12 mb-16">

                    {/* Column 1: Logo & Description */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
                        <Link href="/" className="flex items-center justify-center md:justify-start gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-md shrink-0">
                            {(config?.uploadedLogoUrl || config?.logoUrl) && (
                                <Image
                                    src={(config?.uploadedLogoUrl || config?.logoUrl) as string}
                                    alt={`${companyName} Logo`}
                                    width={48}
                                    height={48}
                                    className="h-7 md:h-9 w-auto object-contain shrink-0 mix-blend-multiply"
                                />
                            )}
                            <span className="text-lg md:text-2xl font-bold tracking-tight text-[var(--color-heading)] shrink-0 min-w-0 truncate max-w-[220px] sm:max-w-none">
                                {companyName}
                            </span>
                        </Link>
                        {config?.footerDescription && (
                            <p className="text-[var(--color-body-text)] text-sm leading-relaxed max-w-sm">
                                {config.footerDescription}
                            </p>
                        )}
                    </div>

                    {/* Column 2: Company */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h4 className="text-[var(--color-heading)] font-semibold mb-6">Company</h4>
                        <ul className="flex flex-col items-center md:items-start gap-4 text-sm text-[var(--color-body-text)]">
                            <li><Link href="/" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">Home</Link></li>
                            <li><Link href="/digital-solutions" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">Digital Solutions</Link></li>
                            <li><Link href="/products" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">Products</Link></li>
                            <li><Link href="/academics" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">Academics</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h4 className="text-[var(--color-heading)] font-semibold mb-6">Legal</h4>
                        <ul className="flex flex-col items-center md:items-start gap-4 text-sm text-[var(--color-body-text)]">
                            <li><Link href="/privacy-policy" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">Terms of Service</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">Refund & Cancellation</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left w-full overflow-hidden">
                        <h4 className="text-[var(--color-heading)] font-semibold mb-6 text-center md:text-left w-full">Contact</h4>
                        <ul className="flex flex-col items-center md:items-start gap-4 text-sm text-[var(--color-body-text)] w-full">
                            {config?.contactEmail && (
                                <li className="flex flex-row items-start justify-center md:justify-start gap-3 w-full">
                                    <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5 hidden md:block" />
                                    <div className="text-center md:text-left">
                                        <a href={`mailto:${config.contactEmail}`} className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">{config.contactEmail}</a>
                                    </div>
                                </li>
                            )}
                            {config?.contactPhone && (
                                <li className="flex flex-row items-start justify-center md:justify-start gap-3 w-full">
                                    <Phone className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5 hidden md:block" />
                                    <div className="text-center md:text-left">
                                        <a href={`tel:${config.contactPhone.replace(/\s+/g, '')}`} className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">{config.contactPhone}</a>
                                    </div>
                                </li>
                            )}
                            {config?.addressText && (
                                <li className="flex flex-row items-start justify-center md:justify-start gap-3 w-full">
                                    <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5 hidden md:block" />
                                    <div className="text-center md:text-left">
                                        <span className="whitespace-pre-line">{config.addressText}</span>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>

                </div>

                {/* Bottom Row - Social Media Icons, Centered Copyright */}
                <div className="relative border-t border-[var(--color-border)] pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left: Social Media Icons (LinkedIn, Instagram, YouTube) */}
                    <div className="flex items-center gap-6 text-[#111827] order-2 md:order-1">
                        <a
                            href={config?.urlLinkedin || "https://www.linkedin.com/company/ss40-network"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="hover:text-[var(--color-primary)] transition-all hover:scale-110 p-0.5 text-[#111827]"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                            href={config?.urlInstagram || "https://instagram.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="hover:text-[var(--color-primary)] transition-all hover:scale-110 p-0.5 text-[#111827]"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href={config?.urlYoutube || "https://youtube.com"}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            className="hover:text-[var(--color-primary)] transition-all hover:scale-110 p-0.5 text-[#111827]"
                        >
                            <Youtube className="w-5 h-5" />
                        </a>
                    </div>

                    {/* Center: Copyright */}
                    <div className="text-center md:absolute md:left-1/2 md:-translate-x-1/2 order-1 md:order-2">
                        <p className="text-xs md:text-sm text-gray-500 font-normal">
                            &copy; {currentYear} {config?.legalName || companyName} | All Rights Reserved
                        </p>
                    </div>

                    {/* Right spacer to keep center copyright perfectly balanced */}
                    <div className="hidden md:block w-32 order-3 pointer-events-none" />
                </div>
            </div>
        </FooterInteractive>
    );
}
