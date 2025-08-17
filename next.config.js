const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      'zustand',
      'swr',
    ],
  },

  serverExternalPackages: ['prisma', '@prisma/client'],
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
  },

  compress: true,
  trailingSlash: false,
  poweredByHeader: false,

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },

  async headers() {
    const isProd = process.env.NODE_ENV === 'production'

    const baseHeaders = isProd
      ? [
          {
            source: '/(.*)',
            headers: [
              { key: 'X-DNS-Prefetch-Control', value: 'on' },
              { key: 'X-XSS-Protection', value: '1; mode=block' },
              { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
              { key: 'X-Content-Type-Options', value: 'nosniff' },
              { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
              {
                key: 'Content-Security-Policy',
                value:
                  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.sentry-cdn.com; style-src 'self' 'unsafe-inline'; img-src * blob: data:; connect-src 'self' https://*.sentry.io https://vitals.vercel-analytics.com; object-src 'none'; frame-ancestors 'self'; base-uri 'self';",
              },
            ],
          },
        ]
      : []

    return [
      ...baseHeaders,
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*/',
  //       destination: '/:path*',
  //       permanent: true,
  //     },
  //   ]
  // },

  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/v1/:path*',
  //       destination: '/api/:path*',
  //     },
  //   ]
  // },
}

// Sentry configuration
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
}

module.exports = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig
