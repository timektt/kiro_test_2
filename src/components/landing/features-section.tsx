import { 
  Brain, 
  MessageSquare, 
  Trophy, 
  Users, 
  Bell, 
  Shield,
  Zap,
  Heart,
  Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Brain,
    title: 'MBTI Integration',
    description: 'Discover your personality type and connect with compatible minds',
    details: 'Complete MBTI assessment with detailed insights and compatibility matching',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    badge: 'Core Feature'
  },
  {
    icon: MessageSquare,
    title: 'Rich Social Feed',
    description: 'Share thoughts, engage in discussions, and build your presence',
    details: 'Post updates, comment, like, and share with advanced engagement features',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    badge: 'Popular'
  },
  {
    icon: Trophy,
    title: 'Community Rankings',
    description: 'Compete in various categories and climb the leaderboards',
    details: 'Multiple ranking systems based on engagement, contributions, and activity',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    badge: 'Gamified'
  },
  {
    icon: Users,
    title: 'Smart Matching',
    description: 'Find people who share your interests and personality traits',
    details: 'AI-powered recommendations based on MBTI compatibility and interests',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    badge: 'AI Powered'
  },
  {
    icon: Bell,
    title: 'Real-time Notifications',
    description: 'Stay updated with likes, comments, follows, and mentions',
    details: 'Instant notifications with smart filtering and customizable preferences',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    badge: 'Real-time'
  },
  {
    icon: Shield,
    title: 'Safe Environment',
    description: 'Moderated community with robust privacy and safety features',
    details: 'Advanced moderation tools, privacy controls, and community guidelines',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
    badge: 'Secure'
  }
]

const additionalFeatures = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance with instant loading and smooth interactions'
  },
  {
    icon: Heart,
    title: 'Community First',
    description: 'Built by the community, for the community with continuous feedback'
  },
  {
    icon: Target,
    title: 'Goal Oriented',
    description: 'Set and track personal and community goals with progress insights'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold">
              Everything you need to
              <span className="block text-primary">connect and grow</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform combines the best of social networking with personality science 
              to create meaningful connections and foster personal growth.
            </p>
          </div>

          {/* Main Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${feature.bgColor}`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.details}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-start gap-4 p-6 rounded-lg bg-background/50 border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
