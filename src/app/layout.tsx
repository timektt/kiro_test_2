import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SessionProvider from '@/components/providers/session-provider';
import ThemeProvider from '@/components/providers/theme-provider';
import StoreProvider from '@/components/providers/store-provider';
import PostComposerProvider from '@/components/providers/pcp.client';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Community Platform',
    template: '%s | Community Platform',
  },
  description: 'A modern community platform for connecting people with shared interests',
  keywords: [
    'community',
    'social',
    'platform',
    'networking',
    'discussion',
    'forum',
    'chat',
    'groups',
  ],
  authors: [{ name: 'Community Platform Team' }],
  creator: 'Community Platform',
  publisher: 'Community Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Community Platform',
    description: 'A modern community platform for connecting people with shared interests',
    siteName: 'Community Platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Community Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Platform',
    description: 'A modern community platform for connecting people with shared interests',
    images: ['/og-image.png'],
    creator: '@communityplatform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: 'technology',
  classification: 'Social Networking',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Community Platform',
  },
  applicationName: 'Community Platform',
  generator: 'Next.js',
  abstract: 'Connect with like-minded individuals in our modern community platform',
  archives: [],
  assets: [],
  bookmarks: [],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting server session:', error);
    session = null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <StoreProvider>
              <PostComposerProvider>
                <div className="min-h-screen bg-background">
                  <main className="flex-1">{children}</main>
                </div>
              </PostComposerProvider>
            </StoreProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
