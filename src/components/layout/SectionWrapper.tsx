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

    // Standard Vertical Rhythm (Compact 90% Scale Density)
    const standardRhythm = "py-10 md:py-14 lg:py-16";

    // Exception: Hero sections need extra top breathing room for the navbar
    const isHero = id === 'hero' || (className && className.includes('pt-32'));
    const finalRhythm = isHero ? "pt-24 pb-10 md:pt-32 md:pb-14 lg:pb-16" : standardRhythm;

    return (
        <motion.section
            id={id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12, margin: "0px 0px -50px 0px" }}
            variants={slideUp}
            className={cn(`${finalRhythm} w-full overflow-hidden transform-gpu`, strippedClassName)}
            {...props}
        >
            {children}
        </motion.section>
    );
}
