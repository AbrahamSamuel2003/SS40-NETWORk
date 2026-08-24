import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSiteConfig } from '@/lib/site-config';

export const getHomeDataCached = unstable_cache(
    async () => {
        const [config, logos, happimonials, activities] = await Promise.all([
            getSiteConfig(),
            prisma.organizationLogo.findMany({
                where: { pageScope: 'HOME', isActive: true },
                orderBy: { sortOrder: 'asc' }
            }),
            prisma.happimonial.findMany({
                where: { pageScope: 'HOME', isActive: true },
                orderBy: { sortOrder: 'asc' }
            }),
            prisma.activityPost.findMany({
                where: { showOnHome: true, isActive: true },
                orderBy: [{ sortOrder: 'asc' }, { activityDate: 'desc' }]
            })
        ]);

        return { config, logos, happimonials, activities };
    },
    ['home-page-data'],
    {
        tags: ['home-data', 'activities', 'logos', 'happimonials', 'site-config'],
        revalidate: 3600 // 1 hour background revalidation fallback
    }
);
