import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/feed',
          '/rankings',
          '/identity',
          '/profile/*',
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/auth/*',
          '/_next/*',
          '/notifications',
          '/identity/setup',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/feed',
          '/rankings',
          '/identity',
          '/profile/*',
        ],
        disallow: [
          '/admin/*',
          '/api/*',
          '/auth/*',
          '/_next/*',
          '/notifications',
          '/identity/setup',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}


