"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { slideUp } from "@/lib/animations";

import { HTMLMotionProps } from "framer-motion";

interface SectionWrapperProps extends HTMLMotionProps<"section"> {
    children: React.ReactNode;
}

export function SectionWrapper({ children, className, id, ...props }: SectionWrapperProps) {

    // Globally strip all hard-coded vertical paddings from instances to enforce strict vertical rhythm
    const strippedClassName = className
        ? className.replace(/\b(sm:|md:|lg:|xl:)?p[tyb]-[0-9]+\b/g, '').replace(/\s+/g, ' ').trim()
        : '';

    // Standard Vertical Rhythm (Desktop: 96px, Mobile: 56px) - via Tailwind classes
    const standardRhythm = "py-14 md:py-20 lg:py-24";

    // Exception: Hero sections need extra top breathing room for the navbar
    const isHero = id === 'hero' || (className && className.includes('pt-32'));
    const finalRhythm = isHero ? "pt-32 pb-14 md:pt-40 md:pb-20 lg:pb-24" : standardRhythm;

    return (
        <motion.section
            id={id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideUp}
            className={cn(`${finalRhythm} w-full overflow-hidden`, strippedClassName)}
            {...props}
        >
            {children}
        </motion.section>
    );
}
