import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { StatsSection } from '@/components/landing/stats-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { MBTISection } from '@/components/landing/mbti-section'
import { CTASection } from '@/components/landing/cta-section'
import { FooterSection } from '@/components/landing/footer-section'

export const metadata = {
  title: 'Community Platform - Connect, Share, Grow',
  description: 'Join our vibrant community platform. Discover your personality type, share your thoughts, and build meaningful connections with like-minded individuals.',
  keywords: 'community, social platform, MBTI, personality types, networking, social media',
  openGraph: {
    title: 'Community Platform - Connect, Share, Grow',
    description: 'Join our vibrant community platform. Discover your personality type, share your thoughts, and build meaningful connections.',
    type: 'website',
    url: 'https://community-platform.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Platform - Connect, Share, Grow',
    description: 'Join our vibrant community platform. Discover your personality type, share your thoughts, and build meaningful connections.',
  },
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // Redirect authenticated users to feed
  if (session) {
    redirect('/feed')
  }

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <MBTISection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </main>
  )
}