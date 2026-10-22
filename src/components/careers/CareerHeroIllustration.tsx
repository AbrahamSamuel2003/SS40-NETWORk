'use client';

import * as React from 'react';
import Image from 'next/image';

export function CareerHeroIllustration() {
    return (
        <div className="relative w-full max-w-[520px] mx-auto lg:ml-auto lg:mr-0 select-none flex items-center justify-center lg:justify-end">
            <Image
                src="/images/careers-hero.webp"
                alt="SS40 Network Technical Interview & Engineering Team"
                width={1200}
                height={896}
                priority
                className="w-full h-auto object-contain select-none"
            />
        </div>
    );
}
