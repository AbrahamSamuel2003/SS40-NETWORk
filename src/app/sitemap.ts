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
        // 1. Digital Solutions
        { route: '/digital-solutions',        priority: 0.95, changeFrequency: 'weekly' },
        // 2. Products
        { route: '/products',                 priority: 0.90, changeFrequency: 'weekly' },
        // 3. Academics
        { route: '/academics',                priority: 0.85, changeFrequency: 'weekly' },
        // 4. Contact
        { route: '/contact',                  priority: 0.80, changeFrequency: 'monthly' },
        // 5. Blogs & Field Updates
        { route: '/blogs',                    priority: 0.75, changeFrequency: 'daily' },
        // Supporting secondary pages
        { route: '/client-projects',          priority: 0.70, changeFrequency: 'weekly' },
        { route: '/happimonials',             priority: 0.65, changeFrequency: 'weekly' },
        { route: '/product-impacts',          priority: 0.65, changeFrequency: 'weekly' },
        { route: '/products/all-products',    priority: 0.60, changeFrequency: 'weekly' },
        { route: '/academics/student-projects', priority: 0.60, changeFrequency: 'weekly' },
        { route: '/terms',                    priority: 0.55, changeFrequency: 'yearly' },
        { route: '/privacy-policy',           priority: 0.55, changeFrequency: 'yearly' },
        { route: '/refund-policy',            priority: 0.50, changeFrequency: 'yearly' },
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

    // Dynamic client projects from DB (has dedicated /client-projects/[id] route)
    let projectEntries: MetadataRoute.Sitemap = [];

    try {
        const clientProjects = await prisma.clientProject.findMany({
            where: { isActive: true },
            select: { id: true, updatedAt: true },
        });

        projectEntries = clientProjects.map((project) => ({
            url: `${baseUrl}/client-projects/${project.id}`,
            lastModified: project.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.65,
        }));

    } catch (error) {
        console.error('Failed to generate dynamic sitemap entries:', error);
    }

    return [...staticEntries, ...projectEntries];
}
