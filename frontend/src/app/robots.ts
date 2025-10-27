import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/_next/',
        '/admin/',
      ],
    },
    sitemap: 'https://behindy.me/sitemap.xml',
  };
}
