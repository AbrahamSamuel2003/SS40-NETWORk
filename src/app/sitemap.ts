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
    let studentProjectEntries: MetadataRoute.Sitemap = [];
    let productEntries: MetadataRoute.Sitemap = [];

    try {
        const [clientProjects, studentProjects, products] = await Promise.all([
            prisma.clientProject.findMany({
                where: { isActive: true },
                select: { id: true, updatedAt: true },
            }),
            prisma.studentProject.findMany({
                where: { isActive: true },
                select: { id: true, updatedAt: true },
            }),
            prisma.product.findMany({
                where: { isActive: true },
                select: { id: true, updatedAt: true },
            })
        ]);

        projectEntries = clientProjects.map((project) => ({
            url: `${baseUrl}/client-projects/${project.id}`,
            lastModified: project.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        studentProjectEntries = studentProjects.map((project) => ({
            url: `${baseUrl}/academics/student-projects/${project.id}`,
            lastModified: project.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        productEntries = products.map((product) => ({
            url: `${baseUrl}/products/${product.id}`,
            lastModified: product.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));

    } catch (error) {
        console.error('Failed to generate dynamic sitemap entries:', error);
    }

    return [...staticEntries, ...projectEntries, ...studentProjectEntries, ...productEntries];
}
