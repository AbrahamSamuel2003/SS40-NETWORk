import { Variants, Transition } from "framer-motion";

// ── Physics-Driven Spring Transitions (GPU Optimized) ──
export const springSnappy: Transition = {
    type: "spring",
    stiffness: 350,
    damping: 25,
    mass: 0.8,
};

export const springSmooth: Transition = {
    type: "spring",
    stiffness: 240,
    damping: 22,
    mass: 0.8,
};

export const springBouncy: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 15,
};

export const springGentle: Transition = {
    type: "spring",
    stiffness: 180,
    damping: 24,
    mass: 1,
};

// ── Viewport Observer Options (Pre-triggers BEFORE entering screen to eliminate blank box pop-in) ──
export const viewportOnce = {
    once: true,
    amount: 0.05,
    margin: "120px 0px -40px 0px"
};

export const viewportPredictive = {
    once: true,
    amount: 0.02,
    margin: "200px 0px -40px 0px"
};

// ── Performance-Tuned Variants ──
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
    },
};

export const slideUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 220, damping: 20, mass: 0.8 }
    },
};

export const slideUpSubtle: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 260, damping: 24 }
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 260, damping: 20 }
    },
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

export const staggerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

// ── Micro-Interactions (GPU-only transforms: will not trigger layout reflow) ──
export const hoverLift = {
    rest: { y: 0 },
    hover: {
        y: -4,
        transition: springSnappy
    },
};

export const scaleOnHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: springSnappy
    },
};

export const tapShrink = {
    scale: 0.97,
    transition: { duration: 0.1 }
};
