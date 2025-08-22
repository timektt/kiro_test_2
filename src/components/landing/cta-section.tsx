import Link from 'next/link'
import { ArrowRight, Mail, Github, Sparkles, Users, MessageSquare } from 'lucide-react'
import { ServerButton } from '@/components/ui/server-button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const authOptions = [
  {
    provider: 'Google',
    icon: Mail,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Sign in with your Google account'
  },
  {
    provider: 'GitHub',
    icon: Github,
    color: 'text-gray-800 dark:text-gray-200',
    bgColor: 'bg-gray-800/10',
    description: 'Connect with your GitHub profile'
  },
  {
    provider: 'Email',
    icon: Mail,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Create account with email & password'
  }
]

const quickStats = [
  {
    icon: Users,
    value: '10K+',
    label: 'Members'
  },
  {
    icon: MessageSquare,
    value: '50K+',
    label: 'Posts'
  },
  {
    icon: Sparkles,
    value: '16',
    label: 'MBTI Types'
  }
]

import { Session } from 'next-auth'

interface CTASectionProps {
  session?: Session | null
}

export function CTASection({ session }: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Join the Community
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Find Your
              <span className="text-primary block mt-2">Perfect Match?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with like-minded individuals, discover your personality type, and build meaningful relationships in our thriving community.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Link
                href="/feed"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Go to Feed
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center justify-center px-8 py-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Auth Options */}
          {!session && (
            <div className="mt-12">
              <p className="text-sm text-muted-foreground mb-6">Choose your preferred sign-up method</p>
              <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {authOptions.map((option, index) => {
                  const IconComponent = option.icon
                  return (
                    <Card key={index} className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 ${option.bgColor} rounded-full mb-4`}>
                          <IconComponent className={`w-6 h-6 ${option.color}`} />
                        </div>
                        <h3 className="font-semibold mb-2">{option.provider}</h3>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Features Highlight */}
          <div className="mt-16 p-8 bg-muted/50 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6">What You'll Get</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Comprehensive MBTI personality assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Smart compatibility matching system</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Real-time chat and messaging</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Privacy-focused community features</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Personalized content recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Advanced search and filtering options</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12">
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Privacy First</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection