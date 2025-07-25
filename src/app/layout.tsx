import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/session-provider'
import { StoreProvider } from '@/components/providers/store-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { Navbar } from '@/components/layout/navbar'
import { MobileNav } from '@/components/layout/mobile-nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Community Platform - Connect, Share, Grow',
    template: '%s | Community Platform',
  },
  description: 'Connect with like-minded people, share your thoughts, and build meaningful relationships in our vibrant community platform. Discover your personality type and find your tribe.',
  keywords: [
    'community', 'social', 'platform', 'connect', 'share', 'MBTI', 'personality',
    'social network', 'discussion', 'forum', 'personality types', 'networking',
    'online community', 'social media', 'user-generated content'
  ],
  authors: [{ name: 'Community Platform Team' }],
  creator: 'Community Platform',
  publisher: 'Community Platform',
  applicationName: 'Community Platform',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Community Platform - Connect, Share, Grow',
    description: 'Connect with like-minded people, share your thoughts, and build meaningful relationships. Discover your personality type and find your tribe.',
    siteName: 'Community Platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Community Platform - Connect with like-minded people',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Platform - Connect, Share, Grow',
    description: 'Connect with like-minded people, share your thoughts, and build meaningful relationships. Discover your personality type and find your tribe.',
    images: ['/twitter-image.png'],
    creator: '@communityplatform',
    site: '@communityplatform',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'social',
  classification: 'Social Network',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            defaultTheme="system"
            storageKey="community-platform-theme"
          >
            <SessionProvider session={session}>
              <StoreProvider>
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <main className="pb-16 md:pb-0" role="main">
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </main>
                  {session && (
                    <MobileNav 
                      userId={session.user.id}
                      username={session.user.username}
                      notificationCount={3}
                    />
                  )}
                </div>
              </StoreProvider>
            </SessionProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}