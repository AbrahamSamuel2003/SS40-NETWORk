"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function ContactHeroIllustration() {
    return (
        <div className="relative w-full max-w-[500px] mx-auto select-none flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full aspect-square flex items-center justify-center"
            >
                <Image
                    src="/images/contact-hero.png"
                    alt="SS40 Technical Support & Advisory Desk"
                    width={600}
                    height={600}
                    priority
                    className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
                />
            </motion.div>
        </div>
    );
}

