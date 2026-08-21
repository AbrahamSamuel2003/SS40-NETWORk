import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/', '/siva/', '/siva'],
    },
    sitemap: 'https://www.ss40network.com/sitemap.xml',
  };
}
