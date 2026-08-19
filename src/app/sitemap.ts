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

        // Advanced SEO: Get real file modification time instead of faking new Date()
        let lastModified = new Date();
        try {
            const fs = require('fs');
            const path = require('path');
            // Resolve the physical file path. Handle root '' vs named routes
            const routePath = route === '' ? 'page.tsx' : `${route}/page.tsx`;
            // Note: In production, process.cwd() is the root of the project
            const fullPath = path.join(process.cwd(), 'src', 'app', '(public)', routePath);
            if (fs.existsSync(fullPath)) {
                const stats = fs.statSync(fullPath);
                lastModified = stats.mtime;
            }
        } catch (e) {
            // Fallback to current date if file system read fails (e.g., in some serverless environments)
        }

        return {
            url: `${baseUrl}${route}`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority,
        };
    });

    // Dynamic client projects from DB
    let projectEntries: MetadataRoute.Sitemap = [];
    let studentProjectEntries: MetadataRoute.Sitemap = [];
    let productEntries: MetadataRoute.Sitemap = [];
    let happimonialEntries: MetadataRoute.Sitemap = [];

    try {
        const clientProjects = await prisma.clientProject.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true },
        });

        projectEntries = clientProjects.map((project) => ({
            url: `${baseUrl}/client-projects/${project.id}`,
            lastModified: project.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        const studentProjects = await prisma.studentProject.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true },
        });

        studentProjectEntries = studentProjects.map((project) => ({
            url: `${baseUrl}/academics/student-projects/${project.id}`,
            lastModified: project.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        const products = await prisma.product.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true },
        });

        productEntries = products.map((product) => ({
            url: `${baseUrl}/products/${product.id}`,
            lastModified: product.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        const happimonials = await prisma.happimonial.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true },
        });

        happimonialEntries = happimonials.map((item) => ({
            url: `${baseUrl}/happimonials/${item.id}`,
            lastModified: item.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        }));

    } catch (error) {
        console.error('Failed to generate dynamic sitemap entries:', error);
    }

    return [...staticEntries, ...projectEntries, ...studentProjectEntries, ...productEntries, ...happimonialEntries];
}
