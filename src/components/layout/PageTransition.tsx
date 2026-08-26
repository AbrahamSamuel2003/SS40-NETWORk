"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useRef, useEffect } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFirstMount = useRef(true);

    useEffect(() => {
        isFirstMount.current = false;
    }, [pathname]);

    return (
        <motion.div
            key={pathname}
            initial={isFirstMount.current ? false : { opacity: 0.85, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-grow flex flex-col"
        >
            {children}
        </motion.div>
    );
}
