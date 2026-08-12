"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SiteConfigData } from "@/lib/site-config";

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={className}
        fill="currentColor"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
);

export function FloatingWhatsApp({ config }: { config?: SiteConfigData | null }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch on structural render
    if (!mounted) return null;

    const phoneNumber = config?.whatsappNumber ? config.whatsappNumber.replace(/\s+/g, '') : "918300591750";
    const companyName = config?.companyName || "SS40 NETWORK";
    const message = encodeURIComponent(`Hello ${companyName}, I'm interested in learning more about your services.`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    if (!config?.whatsappNumber) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 1 }}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-8 lg:bottom-8 lg:right-10 z-30 flex items-center justify-center pointer-events-none"
        >
            {/* The idle pulse ring behind the button */}
            <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25 pointer-events-none" style={{ animationDuration: '3s' }} />

            <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto relative flex items-center justify-center w-[54px] h-[54px] md:w-[60px] md:h-[60px] bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_45px_rgba(37,211,102,0.6)] hover:bg-[#20BE5A] outline-none group transition-all duration-300 ease-out z-10 hover:scale-[1.08] hover:-translate-y-1"
                aria-label="Chat with us on WhatsApp"
            >
                <WhatsAppIcon className="w-7 h-7 md:w-8 md:h-8 fill-current drop-shadow-sm" />
            </Link>
        </motion.div>
    );
}
