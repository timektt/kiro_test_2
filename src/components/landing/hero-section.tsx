'use client';

import Link from 'next/link'
import { ArrowRight, Sparkles, Users, MessageSquare } from 'lucide-react'
import { ServerButton } from '@/components/ui/server-button'
import { InteractiveDemoButton } from '@/components/ui/interactive-demo-button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Session } from 'next-auth'

interface HeroSectionProps {
  session?: Session | null
}

export function HeroSection({ session }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Announcement Badge */}
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            New: MBTI-based matching is now live!
          </Badge>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Connect with your
              <span className="block text-primary">
                personality tribe
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join a vibrant community where your personality type matters. 
              Share thoughts, discover insights, and build meaningful connections 
              with people who truly understand you.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {session ? (
              // Authenticated user - show welcome message and feed button
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                    <AvatarFallback>
                      {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-lg font-semibold">Welcome back, {session.user.name || 'there'}! 👋</p>
                    <p className="text-muted-foreground">Ready to connect with your community?</p>
                  </div>
                </div>
                <ServerButton asChild size="lg" className="text-lg px-8 py-6 rounded-full">
                  <Link href="/feed">
                    Go to Feed
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </ServerButton>
              </div>
            ) : (
              // Unauthenticated user - show signup/demo buttons
              <>
                <ServerButton asChild size="lg" className="text-lg px-8 py-6 rounded-full">
                  <Link href="/auth/signup">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </ServerButton>
                
                <InteractiveDemoButton 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full" 
                />
              </>
            )}
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">
                <strong className="text-foreground">10,000+</strong> active members
              </span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-border" />
            
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">
                <strong className="text-foreground">50,000+</strong> conversations started
              </span>
            </div>
            
            <div className="hidden sm:block w-px h-6 bg-border" />
            
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm">
                <strong className="text-foreground">16</strong> personality types supported
              </span>
            </div>
          </div>

          {/* Hero Image/Illustration Placeholder */}
          <div className="pt-16">
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Interactive platform preview coming soon
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full animate-pulse" />
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-secondary rounded-full animate-pulse delay-1000" />
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-accent rounded-full animate-pulse delay-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection