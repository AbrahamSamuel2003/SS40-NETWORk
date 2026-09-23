"use client";

import React, { useRef, useState } from "react";

export function FooterInteractive({ children }: { children: React.ReactNode }) {
    const containerRef = useRef<HTMLElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <footer 
            ref={containerRef}
            className="relative w-full bg-gray-50 border-t border-[var(--color-border)] pt-16 pb-8 overflow-hidden font-crimson font-serif"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Spotlight Background Effect (Desktop Only) */}
            <div className="absolute inset-0 z-0 hidden md:block pointer-events-none select-none overflow-hidden">
                {/* Stretched SVG Text Reveal */}
                <div 
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        WebkitMaskImage: `radial-gradient(circle 500px at ${mousePosition.x}px ${mousePosition.y}px, black 35%, transparent 65%)`,
                        maskImage: `radial-gradient(circle 500px at ${mousePosition.x}px ${mousePosition.y}px, black 35%, transparent 65%)`,
                    }}
                >
                    <svg 
                        viewBox="0 0 2200 300" 
                        preserveAspectRatio="xMidYMax meet" 
                        className="w-full h-full opacity-[0.18] select-none pointer-events-none"
                    >
                        <text 
                            x="50%" 
                            y="95%" 
                            textAnchor="middle" 
                            className="font-black tracking-tighter uppercase" 
                            style={{ fontSize: '280px' }}
                        >
                            <tspan className="fill-black">SS40</tspan>
                            <tspan className="fill-[var(--color-primary)]"> NETWORK</tspan>
                        </text>
                    </svg>
                </div>
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 w-full">
                {children}
            </div>
        </footer>
    );
}
