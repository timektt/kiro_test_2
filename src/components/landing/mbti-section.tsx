'use client'

import { Brain, Users, Target, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import InteractiveLinkButton from '@/components/common/InteractiveLinkButton'


const mbtiTypes = [
  {
    type: 'INTJ',
    name: 'The Architect',
    description: 'Strategic and independent thinkers',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    percentage: '15%',
  },
  {
    type: 'ENFP',
    name: 'The Campaigner',
    description: 'Enthusiastic and creative spirits',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    percentage: '12%',
  },
  {
    type: 'ISTP',
    name: 'The Virtuoso',
    description: 'Practical and hands-on problem solvers',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    percentage: '10%',
  },
  {
    type: 'ENTJ',
    name: 'The Commander',
    description: 'Bold and strong-willed leaders',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    percentage: '8%',
  },
]

const benefits = [
  {
    icon: Users,
    title: 'Find Your Tribe',
    description:
      'Connect with people who share your cognitive preferences and communication style',
  },
  {
    icon: Target,
    title: 'Better Relationships',
    description:
      'Understand compatibility and build stronger, more meaningful connections',
  },
  {
    icon: Lightbulb,
    title: 'Personal Growth',
    description:
      'Gain insights into your strengths, blind spots, and development opportunities',
  },
]

export function MBTISection() {
  return (
    <section className="py-24 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Discover Your <span className="text-primary">Personality Type</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of users who have discovered their MBTI personality type and found their perfect community matches
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - MBTI Types */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Popular Personality Types</h3>
              <div className="space-y-4">
                {mbtiTypes.map((mbti) => {
                  return (
                    <Card key={mbti.type} className="group hover:shadow-md transition-all duration-200 cursor-pointer">
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
                  )}
                )}
              </div>

              <div className="mt-6 text-center">
                <InteractiveLinkButton href="/mbti-types" variant="outline">
                  View All 16 Types
                </InteractiveLinkButton>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Why MBTI Matters</h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{benefit.title}</h4>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Assessment CTA */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">Take the Assessment</CardTitle>
                <CardDescription>
                  Discover your personality type with our comprehensive MBTI assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>&bull; 60 carefully crafted questions</span>
                    <span>&bull; Detailed personality report</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>&bull; Compatibility insights</span>
                    <span>&bull; Growth recommendations</span>
                  </div>
                  <InteractiveLinkButton href="/auth/signup" className="w-full mt-4">
                    Start Assessment
                  </InteractiveLinkButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MBTISection