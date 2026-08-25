import * as React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingSupportHub } from '@/components/ui/FloatingSupportHub';
import { getSiteConfig } from '@/lib/site-config';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const config = await getSiteConfig();
    return (
        <>
            <Navbar config={config} />
            <main className="flex-grow flex flex-col">
                {children}
            </main>
            <Footer />
            <FloatingSupportHub config={config} />
        </>
    );
}
