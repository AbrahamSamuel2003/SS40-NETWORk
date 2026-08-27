# SS40 NETWORK — Performance Optimization Plan (100/100 Lighthouse Target)

> **Status: Analysis & Planning Only** — Per user instruction, no implementation has begun.

---

## Executive Summary

The SS40 NETWORK Next.js 16 application has a solid foundation (ISR infrastructure exists, `next/image` is used in most places, Tailwind v4 is configured, security headers are present) but has several **critical anti-patterns** that cap it well below 100/100 Performance. The single biggest blocker is `revalidate = 0` on the three primary pages (Home, Blogs, Academics), which forces fully dynamic rendering on **every request** — completely bypassing ISR and the existing `unstable_cache` infrastructure.

The estimated gap to 100/100 is roughly **40–55 Lighthouse Performance points**, achievable in three tiers.

---

## Tier 1 — Critical Fixes (30–40 point gain)

### 1.1 Eliminate `revalidate = 0` on Core Pages

**Files:** `src/app/(public)/page.tsx:16`, `src/app/(public)/blogs/page.tsx:14`, `src/app/(public)/academics/page.tsx:18`

**Problem:** All three pages export `revalidate = 0`, which tells Next.js "render this page dynamically on every single request." This means:
- No ISR — the page is never cached at the edge
- Full server-side data fetch (DB round-trip) on every page load
- No CDN caching possible
- The existing `getHomeDataCached()` in `src/lib/home-cache.ts` (which uses `unstable_cache` with `revalidate: 3600` and tags `['home-data', 'activities', 'logos', 'happimonials', 'site-config']`) is **completely ignored** — the home page calls `prisma` directly instead

**Fix:**
- Replace `export const revalidate = 0` with `export const revalidate = 3600` (1 hour ISR)
- Switch the home page to use `getHomeDataCached()` instead of raw `prisma` calls
- For blogs/academics pages, use the same caching pattern with `unstable_cache` and appropriate tags
- Ensure `revalidateTag('home-data')` in `revalidate-helpers.ts` works correctly (it already does, once the page is ISR'd)

### 1.2 Fix All API Route Caching

**Files:** `src/app/api/organization-logos/route.ts`, `src/app/api/happimonials/route.ts`, `src/app/api/products/route.ts`, `src/app/api/client-projects/route.ts` (and any others)

**Problem:** Every API route has `export const dynamic = 'force-dynamic'` and returns `Cache-Control: no-cache, no-store, max-age=0, must-revalidate`. This means:
- No caching at any layer (edge, CDN, browser)
- Every client-side `fetch()` triggers a full DB round-trip
- These routes serve as the data backbone for client-side components on listing pages

**Fix:**
- Remove `export const dynamic = 'force-dynamic'` from API routes that serve static/catalog data
- Replace `Cache-Control` header with `public, s-maxage=3600, stale-while-revalidate=86400` (1 hour cache, 24 hour stale-while-revalidate)
- For search-filtered queries (with query params), set shorter `s-maxage` (e.g., 300s) or implement query-based cache keys
- Use `dynamic = 'force-static'` or omit entirely for routes that don't need per-request uniqueness

### 1.3 Migrate Client-Side Data Fetching to Server-Side SSG/ISR

**Files:**
- `src/components/digital-solutions/ClientProjects.tsx` — fetches `/api/client-projects` in `useEffect`
- `src/components/digital-solutions/TrustedClients.tsx` — fetches `/api/organization-logos?pageScope=DIGITAL_SOLUTIONS` in `useEffect`
- `src/components/digital-solutions/Happimonials.tsx` — fetches `/api/happimonials?pageScope=DIGITAL_SOLUTIONS` in `useEffect`
- `src/components/products/Brands.tsx` — fetches `/api/organization-logos?pageScope=PRODUCTS` in `useEffect`

**Problem:** These components use the `"use client"` + `useEffect` + `fetch()` pattern, which:
- Delays rendering until JS executes and fetch completes (2 network round-trips: JS bundle → API → data)
- Shows skeleton loaders for 2–3 seconds on every visit
- Adds these API routes as waterfall dependencies
- Prevents the page from being served from cache — the HTML shell is empty, then JS fills it

**Fix:**
- Convert these to **server components** that fetch data directly via Prisma
- Pass data as props from the parent page (which is already using `dynamic` import)
- Remove the `useEffect` + `fetch` + `isLoading` state entirely
- Keep only the interaction logic (modal states) as client-side hooks, ideally via `next/dynamic` with `ssr: true` for the modal-only sub-components

### 1.4 Add `framer-motion` to `optimizePackageImports`

**File:** `next.config.ts`

**Problem:** `experimental.optimizePackageImports` currently only includes `['lucide-react', 'clsx', 'tailwind-merge']`. `framer-motion` is excluded, meaning **the entire Framer Motion library** (≈100KB+ uncompressed) is bundled on every page that imports it — even if only `motion.div` variants are used.

**Fix:**
```ts
experimental: {
  optimizePackageImports: ['lucide-react', 'clsx', 'tailwind-merge', 'framer-motion'],
}
```

### 1.5 Remove Unnecessary `"use client"` Directives

**Files:**
- `src/components/home/BusinessWings.tsx` — has `"use client"` but Grep confirmed: **no hooks, no event handlers, no client-side state**
- `src/components/home/ContactSection.tsx` — has `"use client"` but the `handleSubmit` only does `e.preventDefault()` (no actual submission logic). Uses Framer Motion `motion.div` for animations, which could be CSS instead

**Problem:** These components are forced into the client bundle even though they're static server-rendered content. Each unnecessary `"use client"` boundary creates a client component bundle that must be downloaded, parsed, and executed.

**Fix:**
- Remove `"use client"` from `BusinessWings.tsx` (make it a pure server component)
- Remove `"use client"` from `ContactSection.tsx`; replace Framer Motion animations with CSS `transition`/`@keyframes` or Alpine.js-style CSS-only animations

---

## Tier 2 — Significant Improvements (10–20 point gain)

### 2.1 Fix Image Optimization Configuration

**File:** `next.config.ts`

**Problems:**
- `images.minimumCacheTTL: 60` — 60 seconds is dangerously low. Image optimization cache expires almost immediately, meaning the Image Optimization API re-processes the same images on every cache expiry cycle
- `images.remotePatterns` uses wildcard `https://**` and `http://**` — security risk AND prevents optimal image caching because the optimizer can't determine which domains are trusted
- Hero image quality is `90` — too high for a background

**Fix:**
- Set `minimumCacheTTL: 31536000` (1 year)
- Replace wildcard patterns with explicit allowed domains (e.g., `images.unsplash.com`, `res.cloudinary.com`, your own S3/CDN domain)
- Reduce Hero image quality to `75` (quality > 75 has diminishing returns for perceived visual fidelity)

### 2.2 Add Static Asset Caching Headers

**File:** `next.config.ts`

**Problem:** The `headers()` function only adds security headers (HSTS, COOP, COEP, X-Frame-Options). There are **no Cache-Control headers** for static assets (JS chunks, CSS files, font files). Without `Cache-Control: public, max-age=31536000, immutable` on static assets, the browser re-fetches on every navigation.

**Fix:**
```ts
{
  source: '/_next/static/:path*',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
  ],
},
{
  source: '/_next/data/:path*',
  headers: [
    { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
  ],
},
```

### 2.3 Eliminate Hydration FOUC from `mounted` Pattern

**Files:** `src/components/ui/FloatingWhatsApp.tsx:19-26`, `src/components/ui/FloatingSupportHub.tsx:23-51`

**Problem:** Both components use the pattern:
```ts
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```
This causes a **flash of missing content** (FOUC) — the component renders null server-side, then re-renders when `mounted` becomes true. While this prevents hydration mismatch, it adds a double-render cycle and delays the visual appearance of the WhatsApp/FloatingSupportHub buttons.

**Fix:**
- Use `suppressHydrationWarning` on the wrapping element instead
- Render the content server-side with `suppressHydrationWarning` on the specific elements that might differ
- Or use CSS `opacity` transition instead of mount/unmount

### 2.4 Replace `scroll-behavior: smooth` CSS

**File:** `src/app/globals.css:50`

**Problem:** `html { scroll-behavior: smooth }` is set globally. This conflicts with:
- Programmatic `scrollIntoView({ behavior: 'smooth' })` calls in `ClientProjects.tsx` (line 299)
- Scroll handlers in `Navbar.tsx`, `ActivityUpdates.tsx`, `ActivityCard.tsx`
- It can cause **double-interpolation** where both CSS and JS smooth-scroll compete

**Fix:**
- Remove `scroll-behavior: smooth` from CSS
- Use JS-based smooth scrolling only where explicitly needed via `scrollIntoView({ behavior: 'smooth' })`

### 2.5 Reduce Navbar Client Component Surface

**File:** `src/components/layout/Navbar.tsx`

**Problem:** The entire Navbar is a `"use client"` component because it uses `usePathname` and scroll state. This means:
- Logo image with `priority` is loaded on every page (the logo IS marked `priority` in `Navbar.tsx:119`)
- The scroll handler logic and `requestAnimationFrame` code ships to the client on every page
- Navbar HTML cannot be cached at the edge

**Fix:**
- Split into: server-rendered static structure + minimal client hook for scroll state only
- Use `next/dynamic` with `ssr: true` for the scroll-aware parts
- Remove `priority` from the logo (it's not LCP-critical since the Hero image is the LCP element)
- The Navbar logo is small (48×48) — it doesn't need `priority`

### 2.6 Replace `PageTransition` Framer Motion with CSS

**File:** `src/components/layout/PageTransition.tsx`

**Problem:** Uses `motion.div` from Framer Motion with `usePathname` and `useEffect` for a simple 220ms opacity + translateY fade. This adds Framer Motion to the **client bundle on every page** for a transition that CSS can handle.

**Fix:**
- Replace with CSS `@keyframes` + `opacity` transition
- Use `animate__animated animate__fadeIn` pattern or custom CSS animation classes
- Eliminates one of the primary reasons Framer Motion needs to be in the critical client bundle

---

## Tier 3 — Polish & Fine-Tuning (5–10 point gain)

### 3.1 Replace Raw `<img>` Tags with `next/image`

**Files:**
- `src/components/ui/YouTubeResumeThumbnailPlayer.tsx:144` — uses `<img src={resolvedThumbnail} />` (has eslint-disable comment)
- `src/components/digital-solutions/ClientProjects.tsx:32, 127, 528` — uses `<img src={...} />`
- `src/app/(public)/client-projects/ClientProjectsList.tsx:67-71, 343-344` — uses `<img src={...} />`

**Problem:** Raw `<img>` tags bypass Next.js Image Optimization entirely — no format conversion (AVIF/WebP), no responsive sizing, no blur placeholders, no lazy loading by default.

**Fix:**
- Replace all `<img>` tags with `<Image>` component
- Add `sizes` attribute appropriate to each context
- Add `quality={75}` or `quality={80}` for non-critical images

### 3.2 Restrict Wildcard Remote Patterns & Add Resource Hints

**File:** `next.config.ts`

**Problem:** No resource hints (preconnect, dns-prefetch) for external domains. The app loads from:
- `youtube-nocookie.com` (YouTube iframes + thumbnails)
- `img.youtube.com` (YouTube thumbnail images)
- Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)
- Potentially external CMS/CDN for images

**Fix:**
- Add `preconnect` headers for YouTube domains, Google Fonts
- Replace wildcard `remotePatterns` with explicit domain allowlist
- Add `preconnect` for any CDN used for image hosting

### 3.3 Remove Unused Dependencies

**File:** `package.json`

**Problem:** `lenis` (smooth scrolling library, ~27KB) is in dependencies but `SmoothScrollProvider.tsx` is a deprecated no-op (returns `{children}` directly). If `lenis` is imported anywhere else, it adds unnecessary bundle weight.

**Fix:**
- Verify `lenis` is not imported anywhere in the app
- Remove from `package.json` if unused

### 3.4 Remove `text-rendering: optimizeLegibility`

**File:** `src/app/globals.css:51`

**Problem:** `text-rendering: optimizeLegibility` forces the browser to perform more expensive font rendering. On modern browsers, this provides negligible visual benefit while adding minor rendering overhead.

**Fix:**
- Remove the property or replace with `text-rendering: optimizeSpeed`

### 3.5 Consolidate `getSiteConfig()` Calls

**Files:** `src/app/(public)/layout.tsx:8`, `src/components/layout/Footer.tsx:25`, `src/components/layout/PageWrapper.tsx:7`

**Problem:** `getSiteConfig()` is called in multiple places. While it uses `unstable_cache`, each call still involves a cache lookup. If the cache miss happens, it triggers redundant DB queries.

**Fix:**
- The `PublicLayout` already fetches config and passes it to `Navbar` and `FloatingSupportHub`
- `Footer` independently calls `getSiteConfig()` — should accept `config` as a prop instead
- `PageWrapper` also calls it — should accept config as a prop

### 3.6 Convert FooterInteractive to CSS-Only

**File:** `src/components/layout/FooterInteractive.tsx`

**Problem:** The footer spotlight effect uses `useState` for `mousePosition` and `onMouseMove` handler — a client component that runs on every page. The SVG text reveal is a nice effect but the mouse tracking adds event listener overhead.

**Fix:**
- Replace with CSS `radial-gradient` + `:hover` or container queries
- Or use CSS `mask-image` with a CSS variable updated via `:mouse` (not currently possible in pure CSS, but a CSS-only `filter: brightness()` hover effect achieves a similar lightweight feel)
- Alternatively, convert to a server component and use CSS `:group-hover` for the reveal

### 3.7 Reduce Hero Image Quality & Add Preload

**File:** `src/components/home/Hero.tsx:16-24`

**Problem:**
- Hero background image uses `quality={90}` — excessive for a background
- No explicit `<link rel="preload">` for the LCP image

**Fix:**
- Reduce `quality` to `75`
- Add `<link rel="preload" as="image" href="/images/hero/home-hero-bg.jpg" />` in the root layout head
- Consider using `priority` on the Hero image (it's already set — keep it)

### 3.8 Audit and Split Heavy Client Components

**Files:** `src/components/home/SuccessStories.tsx`, `src/components/home/InteractiveImpactShowcase.tsx`, `src/components/home/ActivityUpdates.tsx`

**Problem:** These are all `"use client"` components with Framer Motion, complex state management, and continuous animation loops (`setInterval`, `useScroll`, `IntersectionObserver`). They are dynamically imported with `ssr: true` (good), but they still ship heavy client bundles.

**Fix:**
- Audit each for unnecessary re-renders
- Consider replacing Framer Motion with CSS animations for simple transitions
- Split complex components (e.g., separate the modal from the list)
- Ensure `motion` imports are tree-shaken (add to `optimizePackageImports`)

---

## Summary Table

| # | Issue | Impact | Effort | Tier | File(s) |
|---|-------|--------|--------|------|---------|
| 1.1 | `revalidate = 0` on 3 core pages | **Critical** — 15-20 pts | Low | T1 | 3 files |
| 1.2 | API routes: `force-dynamic` + `no-cache` | **Critical** — 10-15 pts | Low | T1 | 6 files |
| 1.3 | Client-side data fetching waterfall | **Critical** — 10-15 pts | Medium | T1 | 4 files |
| 1.4 | `framer-motion` missing from optimizePackageImports | High — 5-10 pts | Low | T1 | `next.config.ts` |
| 1.5 | Unnecessary `"use client"` directives | Medium — 5-8 pts | Low | T1 | `BusinessWings.tsx`, `ContactSection.tsx` |
| 2.1 | Image config: low TTL + wildcard patterns | High — 5-8 pts | Low | T2 | `next.config.ts` |
| 2.2 | No static asset caching headers | High — 5-8 pts | Low | T2 | `next.config.ts` |
| 2.3 | `mounted` → FOUC pattern | Medium — 3-5 pts | Low | T2 | `FloatingWhatsApp.tsx`, `FloatingSupportHub.tsx` |
| 2.4 | CSS `scroll-behavior: smooth` conflict | Medium — 3-5 pts | Low | T2 | `globals.css` |
| 2.5 | Navbar client component surface | Medium — 3-5 pts | Medium | T2 | `Navbar.tsx` |
| 2.6 | PageTransition using Framer Motion | Medium — 3-5 pts | Low | T2 | `PageTransition.tsx` |
| 3.1 | Raw `<img>` tags (9 locations) | 2-4 pts | Low | T3 | 3 files |
| 3.2 | No resource hints + wildcard domains | 2-3 pts | Low | T3 | `next.config.ts` |
| 3.3 | Unused `lenis` dependency | 1-2 pts | Low | T3 | `package.json` |
| 3.4 | `text-rendering: optimizeLegibility` | 1 pt | Trivial | T3 | `globals.css` |
| 3.5 | Redundant `getSiteConfig()` calls | 1-2 pts | Low | T3 | `Footer.tsx`, `PageWrapper.tsx` |
| 3.6 | FooterInteractive client component | 1-2 pts | Medium | T3 | `FooterInteractive.tsx` |
| 3.7 | Hero image quality too high | 1 pt | Trivial | T3 | `Hero.tsx` |
| 3.8 | Heavy client component audit | 2-5 pts | High | T3 | 3 files |

---

## Recommended Implementation Order

### Phase 1 (Days 1–2): The Big Wins
1. Fix `revalidate = 0` → `revalidate = 3600` on Home, Blogs, Academics
2. Wire up `getHomeDataCached()` for the home page (it exists but is unused)
3. Create cached server-side data fetchers for Blogs and Academics pages (or extend `home-cache.ts`)
4. Add `framer-motion` to `optimizePackageImports`
5. Remove unnecessary `"use client"` from `BusinessWings.tsx` and `ContactSection.tsx`

### Phase 2 (Days 3–4): Unlock Edge Caching
1. Fix all API routes: remove `force-dynamic`, add `s-maxage` + `stale-while-revalidate`
2. Add static asset caching headers (`Cache-Control: public, max-age=31536000, immutable`)
3. Migrate digital-solutions listing components from `useEffect + fetch` to server-side Prisma
4. Fix `images.minimumCacheTTL` → 31536000
5. Restrict `remotePatterns` to specific domains

### Phase 3 (Days 5–6): Client Bundle Reduction
1. Replace `PageTransition` Framer Motion with CSS animation
2. Eliminate `mounted` pattern in FloatingWhatsApp and FloatingSupportHub
3. Remove CSS `scroll-behavior: smooth`
4. Replace raw `<img>` tags with `next/image` across all components
5. Consolidate `getSiteConfig()` calls (pass config as prop to Footer)

### Phase 4 (Day 7): Polish
1. Add resource hints for external domains (YouTube, Google Fonts)
2. Reduce Hero image quality
3. Audit heavy client components for unnecessary re-renders
4. Remove unused `lenis` dependency
5. Remove `text-rendering: optimizeLegibility`

---

## Key Architectural Insights

### The Caching Pyramid (currently broken):

```
Browser Cache  (max-age=60 for images)  ← TOO LOW
    ↓
CDN/Edge Cache  (blocked by force-dynamic + no-cache)  ← NO CACHE
    ↓
ISR Cache  (blocked by revalidate=0)  ← DYNAMIC ON EVERY REQUEST
    ↓
unstable_cache  (defined but bypassed on home page)  ← UNUSED INFRASTRUCTURE
    ↓
Database  (hit on every page load)  ← HOT PATH
```

The fix is to **unblock each layer** so the database is hit at most once per hour (ISR TTL), not once per request.

### The Client Bundle Problem:

The app currently ships Framer Motion, full Navbar+Footer interactive logic, FloatingSupportHub with chatbot, PageTransition animation, and multiple modal components as client bundles on **every page**. With `optimizePackageImports` missing `framer-motion`, the entire library (~100KB+) is included everywhere.

---

*This plan is a draft for review. No implementation has begun per user instruction ("dont proceed").*