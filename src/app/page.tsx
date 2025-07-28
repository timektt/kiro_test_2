export const dynamic = 'force-dynamic'; // 🔥 บังคับไม่ใช้ static cache



import { FeaturesSection } from '@/components/landing/features-section';
import { StatsSection } from '@/components/landing/stats-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { MBTISection } from '@/components/landing/mbti-section';
import { CTASection } from '@/components/landing/cta-section';
import { FooterSection } from '@/components/landing/footer-section';
import { HeroSection } from '@/components/landing/hero-section';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata = {
  title: 'Community Platform - Connect, Share, Grow',
  description:
    'Join our vibrant community platform where personality meets connection. Discover your MBTI type, share your thoughts, and build meaningful relationships with like-minded individuals. Connect with your personality tribe today.',
  keywords: [
    'community platform',
    'social network',
    'MBTI',
    'personality types',
    'networking',
    'social media',
    'personality matching',
    'online community',
    'discussion forum',
    'social connection',
    'personality assessment',
    'community building',
    'social platform',
    'user engagement',
  ],
  authors: [
    { name: 'Community Platform Team', url: 'https://community-platform.com' },
  ],
  creator: 'Community Platform',
  publisher: 'Community Platform',
  applicationName: 'Community Platform',
  category: 'Social Networking',
  classification: 'Social Network',
  openGraph: {
    title: 'Community Platform - Connect with Your Personality Tribe',
    description:
      'Join thousands of members who have found their community. Discover your MBTI type, share meaningful content, and connect with people who truly understand you.',
    type: 'website',
    url: '/',
    siteName: 'Community Platform',
    locale: 'en_US',
    images: [
      {
        url: '/og-image-home.png',
        width: 1200,
        height: 630,
        alt: 'Community Platform - Connect with your personality tribe',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 400,
        height: 400,
        alt: 'Community Platform Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@communityplatform',
    creator: '@communityplatform',
    title: 'Community Platform - Connect with Your Personality Tribe',
    description:
      'Join thousands of members who have found their community. Discover your MBTI type and connect with like-minded individuals.',
    images: ['/twitter-image-home.png'],
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
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification-code',
  },
};

export default async function HomePage() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting server session:', error);
    // Continue with session = null - this is safe
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Community Platform',
    description:
      'Join our vibrant community platform. Discover your personality type, share your thoughts, and build meaningful connections with like-minded individuals.',
    url: process.env.NEXTAUTH_URL || 'https://community-platform.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXTAUTH_URL || 'https://community-platform.com'}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://twitter.com/communityplatform',
      'https://github.com/communityplatform',
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Community Platform',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXTAUTH_URL || 'https://community-platform.com'}/logo.png`,
      },
    },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'Community Platform',
      applicationCategory: 'SocialNetworkingApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'MBTI Personality Assessment',
        'Social Networking',
        'Content Sharing',
        'Community Rankings',
        'Real-time Notifications',
      ],
    },
  };

  try {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <main className="min-h-screen bg-background">
          <HeroSection session={session} />
          <FeaturesSection />
          <StatsSection />
          <MBTISection />
          <TestimonialsSection />
          <CTASection session={session} />
          <FooterSection />
        </main>
      </>
    );
  } catch (error) {
    console.error('Error rendering homepage:', error);

    // Fallback UI if anything fails
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto max-w-md p-6 text-center">
          <h1 className="mb-4 text-3xl font-bold">
            Welcome to Community Platform
          </h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Connect with like-minded people and discover your personality tribe.
          </p>
          <div className="space-y-4">
            <a
              href="/auth/signup"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </a>
            <a
              href="/auth/signin"
              className="ml-4 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Sign In
            </a>
          </div>
        </div>
      </main>
    );
  }
}
