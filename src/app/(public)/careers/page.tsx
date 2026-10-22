import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CareersClient } from '@/components/careers/CareersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: {
        absolute: 'Careers & Open Positions — SS40 NETWORK | Join Our Technology Team',
    },
    description: 'Explore career opportunities at SS40 NETWORK in Tirunelveli. Work on enterprise digital solutions, scalable SaaS products, and high-impact technology academics.',
    alternates: {
        canonical: 'https://ss40network.com/careers',
    },
    openGraph: {
        title: 'Careers & Open Positions — SS40 NETWORK',
        description: 'Join SS40 NETWORK in Tirunelveli. Build cutting-edge software solutions, intelligent SaaS products, and empower emerging tech leaders.',
        url: 'https://ss40network.com/careers',
        siteName: 'SS40 NETWORK',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://ss40network.com/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'SS40 NETWORK Careers — Join Our Team',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Careers & Open Positions — SS40 NETWORK',
        description: 'Explore engineering, product, and tech mentor vacancies at SS40 NETWORK in Tirunelveli.',
        images: ['https://ss40network.com/og-image.jpg'],
    },
};

export default async function CareersPage() {
    const careers = await prisma.career.findMany({
        where: { isActive: true },
        orderBy: [
            { isFeatured: 'desc' },
            { sortOrder: 'asc' },
            { createdAt: 'desc' },
        ],
    }).catch(() => []);

    // Generate Schema.org JobPosting structured data for Google Jobs
    const jobPostingsSchema = careers.map((job) => ({
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description,
        datePosted: job.createdAt.toISOString(),
        validThrough: job.expiresAt ? job.expiresAt.toISOString() : undefined,
        employmentType: job.employmentType.toUpperCase().replace('-', '_'),
        hiringOrganization: {
            '@type': 'Organization',
            name: 'SS40 NETWORK PRIVATE LIMITED',
            sameAs: 'https://ss40network.com',
            logo: 'https://ss40network.com/og-image.jpg',
        },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Tirunelveli',
                addressRegion: 'Tamil Nadu',
                addressCountry: 'IN',
            },
        },
    }));

    const breadcrumbsSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://ss40network.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Careers',
                item: 'https://ss40network.com/careers',
            },
        ],
    };

    return (
        <div className="w-full flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
            />
            {jobPostingsSchema.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingsSchema) }}
                />
            )}
            <CareersClient initialCareers={careers as any} />
        </div>
    );
}
