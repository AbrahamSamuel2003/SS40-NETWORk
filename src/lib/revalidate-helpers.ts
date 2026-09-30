import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Universal Cache Invalidator for Admin Actions
 * 
 * Instantly invalidates Next.js App Router layouts, pages, and tagged query
 * caches so that admin mutations appear in real time on public pages.
 */
export function revalidateEntityCache(
    entity: 'ORGANIZATION_LOGO' | 'HAPPIMONIAL' | 'ACTIVITY' | 'SITE_CONFIG' | 'PRODUCT' | 'STUDENT_PROJECT' | 'STUDENT_IMPACT' | 'CLIENT_PROJECT', 
    pageScope?: string
) {
    try {
        const scope = (pageScope || 'GLOBAL').toUpperCase();

        // 1. Invalidate root layout (purges Navbar, Footer, SiteConfig, and all subtrees)
        try { revalidatePath('/', 'layout'); } catch {}

        // 2. Invalidate Next.js cache tags
        try { (revalidateTag as any)('home-data'); } catch {}
        try { (revalidateTag as any)('site-config'); } catch {}

        switch (entity) {
            case 'ORGANIZATION_LOGO':
                try { (revalidateTag as any)('logos'); } catch {}
                try { revalidatePath('/', 'page'); } catch {}
                try { revalidatePath('/digital-solutions', 'page'); } catch {}
                try { revalidatePath('/products', 'page'); } catch {}
                try { revalidatePath('/academics', 'page'); } catch {}
                break;

            case 'HAPPIMONIAL':
                try { (revalidateTag as any)('happimonials'); } catch {}
                try { revalidatePath('/', 'page'); } catch {}
                try { revalidatePath('/digital-solutions', 'page'); } catch {}
                try { revalidatePath('/products', 'page'); } catch {}
                try { revalidatePath('/happimonials', 'page'); } catch {}
                break;

            case 'ACTIVITY':
                try { (revalidateTag as any)('activities'); } catch {}
                try { revalidatePath('/', 'page'); } catch {}
                try { revalidatePath('/blogs', 'page'); } catch {}
                break;

            case 'SITE_CONFIG':
                try { (revalidateTag as any)('site-config'); } catch {}
                try { revalidatePath('/', 'layout'); } catch {}
                try { revalidatePath('/', 'page'); } catch {}
                try { revalidatePath('/contact', 'page'); } catch {}
                break;

            case 'PRODUCT':
                try { (revalidateTag as any)('products'); } catch {}
                try { revalidatePath('/products', 'page'); } catch {}
                try { revalidatePath('/products/all-products', 'page'); } catch {}
                try { revalidatePath('/', 'page'); } catch {}
                break;

            case 'CLIENT_PROJECT':
                try { (revalidateTag as any)('client-projects'); } catch {}
                try { revalidatePath('/digital-solutions', 'page'); } catch {}
                try { revalidatePath('/client-projects', 'page'); } catch {}
                break;

            case 'STUDENT_PROJECT':
                try { (revalidateTag as any)('student-projects'); } catch {}
                try { revalidatePath('/academics', 'page'); } catch {}
                try { revalidatePath('/academics/student-projects', 'page'); } catch {}
                break;

            case 'STUDENT_IMPACT':
                try { (revalidateTag as any)('student-impacts'); } catch {}
                try { revalidatePath('/academics', 'page'); } catch {}
                try { revalidatePath('/product-impacts', 'page'); } catch {}
                break;
        }
    } catch (err) {
        console.warn(`[Cache Revalidation] Warning during ${entity} invalidation:`, err);
    }
}
