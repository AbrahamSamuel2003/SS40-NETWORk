import * as React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const Linkedin = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>;
const Instagram = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>;
const Youtube = ({ className }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>;

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-gray-50 border-t border-[var(--color-border)] pt-16 pb-8">
            <div className="container-width">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 xl:gap-12 mb-16">

                    {/* Column 1: Logo & Description */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6">
                        <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-md">
                            <span className="text-2xl font-bold tracking-tight text-[var(--color-heading)]">
                                SS40 <span className="text-[var(--color-primary)]">NETWORK</span>
                            </span>
                        </Link>
                        <p className="text-[var(--color-body-text)] text-sm leading-relaxed max-w-sm">
                            We deliver premium digital solutions, innovative products, and world-class academics to elevate your business and career forward into the modern era.
                        </p>
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
                            <li className="flex flex-row items-start justify-center md:justify-start gap-3 w-full">
                                <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5 hidden md:block" />
                                <div className="text-center md:text-left">
                                    <a href="mailto:support@ss40network.com" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">support@ss40network.com</a>
                                </div>
                            </li>
                            <li className="flex flex-row items-start justify-center md:justify-start gap-3 w-full">
                                <Phone className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5 hidden md:block" />
                                <div className="text-center md:text-left">
                                    <a href="tel:+918300591750" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded">+91 83005 91750</a>
                                </div>
                            </li>
                            <li className="flex flex-row items-start justify-center md:justify-start gap-3 w-full">
                                <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5 hidden md:block" />
                                <div className="text-center md:text-left">
                                    <span>
                                        SS40 NETWORK PRIVATE LIMITED,<br />
                                        1st Floor,<br />
                                        Municipal Corporation Incubation Centre<br />
                                        (Near by trade centre),<br />
                                        Sree Puram, Tirunelveli,<br />
                                        Tamil Nadu 627001
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Row */}
                <div className="flex flex-col md:flex-row items-center justify-between border-t border-[var(--color-border)] pt-8 space-y-4 md:space-y-0">
                    <p className="text-sm text-[var(--color-body-text)] text-center md:text-left">
                        &copy; {currentYear} SS40 NETWORK. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-[var(--color-body-text)]">
                        <a href="https://www.instagram.com/ss40network/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-full p-1"><Instagram className="w-5 h-5" /></a>
                        <a href="https://www.youtube.com/@ss40network" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-full p-1"><Youtube className="w-5 h-5" /></a>
                        <a href="https://www.linkedin.com/company/ss40-network/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-[var(--color-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-full p-1"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
