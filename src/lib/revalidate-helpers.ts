import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Universal Cache Invalidator for Admin Actions
 * 
 * Safely invalidates Next.js App Router static pages, layouts,
 * and unstable_cache tagged queries so that admin mutations appear
 * immediately on public pages without server restarts.
 */
export function revalidateEntityCache(
    entity: 'ORGANIZATION_LOGO' | 'HAPPIMONIAL' | 'ACTIVITY' | 'SITE_CONFIG' | 'PRODUCT' | 'STUDENT_PROJECT' | 'STUDENT_IMPACT' | 'CLIENT_PROJECT', 
    pageScope?: string
) {
    try {
        // Invalidate root and shared tags
        try { (revalidateTag as any)('home-data'); } catch {}

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
                break;

            case 'PRODUCT':
                try { revalidatePath('/products', 'page'); } catch {}
                try { revalidatePath('/products/all-products', 'page'); } catch {}
                try { revalidatePath('/', 'page'); } catch {}
                break;

            case 'CLIENT_PROJECT':
                try { revalidatePath('/digital-solutions', 'page'); } catch {}
                try { revalidatePath('/client-projects', 'page'); } catch {}
                break;

            case 'STUDENT_PROJECT':
                try { revalidatePath('/academics', 'page'); } catch {}
                try { revalidatePath('/academics/student-projects', 'page'); } catch {}
                break;

            case 'STUDENT_IMPACT':
                try { revalidatePath('/academics', 'page'); } catch {}
                try { revalidatePath('/product-impacts', 'page'); } catch {}
                break;
        }
    } catch (err) {
        console.warn(`[Cache Revalidation] Warning during ${entity} invalidation:`, err);
    }
}
