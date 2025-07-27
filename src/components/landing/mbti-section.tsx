import { Brain, Users, Target, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const mbtiTypes = [
  {
    type: 'INTJ',
    name: 'The Architect',
    description: 'Strategic and independent thinkers',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    percentage: '15%'
  },
  {
    type: 'ENFP',
    name: 'The Campaigner',
    description: 'Enthusiastic and creative spirits',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    percentage: '12%'
  },
  {
    type: 'ISTP',
    name: 'The Virtuoso',
    description: 'Practical and hands-on problem solvers',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    percentage: '10%'
  },
  {
    type: 'ENTJ',
    name: 'The Commander',
    description: 'Bold and strong-willed leaders',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    percentage: '8%'
  }
]

const benefits = [
  {
    icon: Users,
    title: 'Find Your Tribe',
    description: 'Connect with people who share your cognitive preferences and communication style'
  },
  {
    icon: Target,
    title: 'Better Relationships',
    description: 'Understand compatibility and build stronger, more meaningful connections'
  },
  {
    icon: Lightbulb,
    title: 'Personal Growth',
    description: 'Gain insights into your strengths, blind spots, and development opportunities'
  }
]

export function MBTISection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-4">
              <Brain className="w-4 h-4 mr-2" />
              MBTI Integration
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Discover your personality,
              <span className="block text-primary">find your people</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform uses the Myers-Briggs Type Indicator to help you understand yourself better 
              and connect with compatible personalities in meaningful ways.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - MBTI Types */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Popular Personality Types</h3>
                <div className="grid gap-4">
                  {mbtiTypes.map((mbti, index) => (
                    <Card key={index} className="group hover:shadow-md transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge className={mbti.color}>
                              {mbti.type}
                            </Badge>
                            <div>
                              <h4 className="font-semibold group-hover:text-primary transition-colors">
                                {mbti.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {mbti.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                              {mbti.percentage}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              of users
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/mbti-types">
                      View All 16 Types
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Benefits */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Why MBTI Matters</h3>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg mb-2">
                            {benefit.title}
                          </h4>
                          <p className="text-muted-foreground">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* MBTI Assessment CTA */}
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Take the Assessment
                  </CardTitle>
                  <CardDescription>
                    Discover your personality type with our comprehensive MBTI assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>✓ 60 carefully crafted questions</span>
                      <span>✓ Detailed personality report</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>✓ Compatibility insights</span>
                      <span>✓ Growth recommendations</span>
                    </div>
                    <Button className="w-full mt-4" asChild>
                      <Link href="/auth/signup">
                        Start Assessment
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

