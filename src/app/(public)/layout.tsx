import * as React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { getSiteConfig } from '@/lib/site-config';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const config = await getSiteConfig();
    return (
        <>
            <PageWrapper>{children}</PageWrapper>
            <FloatingWhatsApp config={config} />
        </>
    );
}
