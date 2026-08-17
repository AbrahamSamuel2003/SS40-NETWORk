import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.ss40network.com';

    // Static public routes
    const staticRoutes = [
        '',
        '/about',
        '/academics',
        '/academics/student-projects',
        '/client-projects',
        '/contact',
        '/digital-solutions',
        '/happimonials',
        '/product-impacts',
        '/products',
        '/products/all-products',
        '/privacy-policy',
        '/refund-policy',
        '/terms',
    ];

    const staticEntries = staticRoutes.map((route) => {
        // Assign priorities based on page hierarchy
        let priority = 0.5;
        if (route === '') priority = 1.0;
        else if (['/products', '/digital-solutions', '/academics'].includes(route)) priority = 0.9;
        else if (['/client-projects', '/contact', '/about'].includes(route)) priority = 0.8;

        return {
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority,
        };
    });

    // Dynamic client projects from DB
    let projectEntries: MetadataRoute.Sitemap = [];
    try {
        const projects = await prisma.clientProject.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true },
        });

        projectEntries = projects.map((project) => ({
            url: `${baseUrl}/client-projects/${project.id}`,
            lastModified: project.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Failed to generate dynamic sitemap entries:', error);
    }

    return [...staticEntries, ...projectEntries];
}
