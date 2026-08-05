import { Variants } from "framer-motion";

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};

export const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const hoverLift = {
    rest: { y: 0 },
    hover: {
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" }
    },
};

export const scaleOnHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
    },
};
