'use client';

import Link from 'next/link'
import { ArrowRight, Sparkles, Users, MessageSquare } from 'lucide-react'
import { ServerButton } from '@/components/ui/server-button'
import { InteractiveDemoButton } from '@/components/ui/interactive-demo-button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlatformPreview } from '@/components/landing/platform-preview'
import { Session } from 'next-auth'

interface HeroSectionProps {
  session?: Session | null
}

export function HeroSection({ session }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background decoration - responsive positioning */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-10 left-4 w-48 h-48 md:top-20 md:left-10 md:w-72 md:h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-4 w-64 h-64 md:bottom-20 md:right-10 md:w-96 md:h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          {/* Announcement Badge - responsive sizing */}
          <Badge variant="secondary" className="mb-3 md:mb-4 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
            New: MBTI-based matching is now live!
          </Badge>

          {/* Main Headline - improved mobile typography */}
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
              Connect with your
              <span className="block text-primary">
                personality tribe
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Join a vibrant community where your personality type matters. 
              Share thoughts, discover insights, and build meaningful connections 
              with people who truly understand you.
            </p>
          </div>

          {/* CTA Buttons - enhanced mobile layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-6 md:pt-8 px-4 sm:px-0">
            {session ? (
              // Authenticated user - show welcome message and feed button
              <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 text-center sm:text-left">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                    <AvatarFallback>
                      {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <p className="text-base sm:text-lg font-semibold">Welcome back, {session.user.name || 'there'}! 👋</p>
                    <p className="text-sm sm:text-base text-muted-foreground">Ready to connect with your community?</p>
                  </div>
                </div>
                <ServerButton asChild size="lg" className="text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-6 rounded-full w-full sm:w-auto min-h-[44px]">
                  <Link href="/feed">
                    Go to Feed
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </ServerButton>
              </div>
            ) : (
              // Unauthenticated user - show signup/demo buttons
              <>
                <ServerButton asChild size="lg" className="text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-6 rounded-full w-full sm:w-auto min-h-[44px]">
                  <Link href="/auth/signup">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </ServerButton>
                
                <InteractiveDemoButton 
                  variant="outline" 
                  size="lg" 
                  className="text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-6 rounded-full w-full sm:w-auto min-h-[44px]" 
                />
              </>
            )}
          </div>

          {/* Social Proof - improved mobile layout */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-8 md:pt-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">
                <strong className="text-foreground">10,000+</strong> active members
              </span>
            </div>
            
            <div className="hidden sm:block w-px h-4 md:h-6 bg-border" />
            
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">
                <strong className="text-foreground">50,000+</strong> conversations started
              </span>
            </div>
            
            <div className="hidden sm:block w-px h-4 md:h-6 bg-border" />
            
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">
                <strong className="text-foreground">16</strong> personality types supported
              </span>
            </div>
          </div>

          {/* Interactive Platform Preview - responsive sizing */}
          <div className="pt-8 md:pt-12 lg:pt-16 px-4 sm:px-0">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl md:rounded-2xl blur-3xl" />
                
                {/* Main preview container */}
                <div className="relative bg-background/80 backdrop-blur-sm rounded-xl md:rounded-2xl border shadow-lg md:shadow-2xl overflow-hidden">
                  <div className="flex items-center justify-center p-4 md:p-8">
                    <PlatformPreview />
                  </div>
                </div>
                
                {/* Floating elements - responsive positioning */}
                <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full animate-pulse" />
                <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-4 h-4 md:w-6 md:h-6 bg-secondary rounded-full animate-pulse delay-1000" />
                <div className="absolute top-1/2 -right-4 md:-right-8 w-3 h-3 md:w-4 md:h-4 bg-accent rounded-full animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection