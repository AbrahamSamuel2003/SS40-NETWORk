import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.ss40network.com';

    // Static routes with explicit priority + changeFrequency per page.
    // Priority signal is used by Google to determine sitelink prominence order.
    // Desired sitelink order: Digital Solutions → Products → Academics → Contact → Privacy Policy → Terms
    type StaticRoute = {
        route: string;
        priority: number;
        changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    };

    const staticRouteConfig: StaticRoute[] = [
        // Homepage — highest priority
        { route: '',                          priority: 1.00, changeFrequency: 'daily' },
        // Core service pages — drive sitelink order via priority
        { route: '/digital-solutions',        priority: 0.95, changeFrequency: 'weekly' },
        { route: '/products',                 priority: 0.92, changeFrequency: 'weekly' },
        { route: '/academics',                priority: 0.90, changeFrequency: 'weekly' },
        // Supporting pages
        { route: '/contact',                  priority: 0.85, changeFrequency: 'monthly' },
        { route: '/about',                    priority: 0.80, changeFrequency: 'monthly' },
        { route: '/client-projects',          priority: 0.78, changeFrequency: 'weekly' },
        { route: '/happimonials',             priority: 0.72, changeFrequency: 'weekly' },
        { route: '/product-impacts',          priority: 0.70, changeFrequency: 'weekly' },
        { route: '/products/all-products',    priority: 0.68, changeFrequency: 'weekly' },
        { route: '/academics/student-projects', priority: 0.65, changeFrequency: 'weekly' },
        // Legal pages — low priority, rarely change
        { route: '/privacy-policy',           priority: 0.55, changeFrequency: 'yearly' },
        { route: '/refund-policy',            priority: 0.52, changeFrequency: 'yearly' },
        { route: '/terms',                    priority: 0.50, changeFrequency: 'yearly' },
    ];

    const staticEntries = staticRouteConfig.map(({ route, priority, changeFrequency }) => {
        // Advanced SEO: Use real file modification time for accurate lastModified
        let lastModified = new Date();
        try {
            const fs = require('fs');
            const path = require('path');
            const routePath = route === '' ? 'page.tsx' : `${route}/page.tsx`;
            const fullPath = path.join(process.cwd(), 'src', 'app', '(public)', routePath);
            if (fs.existsSync(fullPath)) {
                const stats = fs.statSync(fullPath);
                lastModified = stats.mtime;
            }
        } catch (e) {
            // Fallback to current date in serverless environments
        }

        return {
            url: `${baseUrl}${route}`,
            lastModified,
            changeFrequency,
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
