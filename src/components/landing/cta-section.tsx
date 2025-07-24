import Link from 'next/link'
import { ArrowRight, Mail, Github, Sparkles, Users, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="text-center space-y-8 mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Ready to get started?
            </Badge>
            
            <h2 className="text-3xl md:text-5xl font-bold">
              Your personality tribe
              <span className="block text-primary">is waiting for you</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of people who have already discovered meaningful connections 
              through personality-based matching. It&apos;s free to start!
            </p>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 py-8">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-primary">
                        {stat.value}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full">
                <Link href="/auth/signup">
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="outline" asChild size="lg" className="text-lg px-8 py-6 rounded-full">
                <Link href="/auth/signin">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>

          {/* Auth Options */}
          <Card className="bg-background/50 backdrop-blur-sm border-2">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Multiple Ways to Join</h3>
                <p className="text-muted-foreground">
                  Choose your preferred sign-up method and get started in seconds
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {authOptions.map((option, index) => {
                  const Icon = option.icon
                  return (
                    <div key={index} className="text-center p-6 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors">
                      <div className={`inline-flex p-4 rounded-full ${option.bgColor} mb-4`}>
                        <Icon className={`h-6 w-6 ${option.color}`} />
                      </div>
                      <h4 className="font-semibold mb-2">{option.provider}</h4>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="text-center mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground">
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security & Trust */}
          <div className="text-center mt-12 space-y-4">
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