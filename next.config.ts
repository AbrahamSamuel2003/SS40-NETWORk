import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile devices on the local network to safely connect in dev mode
  allowedDevOrigins: [
    "192.168.1.5",
    "192.168.1.*",
    "192.168.0.*"
  ],
  // Compression is on by default; made explicit. The x-powered-by banner is
  // removed to reduce response overhead (no visual/output change).
  compress: true,
  poweredByHeader: false,
  // Serve images in modern formats and cache optimized variants. No effect on
  // the DOM/rendered output of existing placeholder images — purely an asset
  // delivery optimization.
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 160],
    minimumCacheTTL: 60,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
