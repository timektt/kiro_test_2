import { Users, MessageSquare, Heart, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Active Members',
    description: 'Growing community of diverse personalities',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    icon: MessageSquare,
    value: '50,000+',
    label: 'Posts Shared',
    description: 'Meaningful conversations every day',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  {
    icon: Heart,
    value: '200,000+',
    label: 'Connections Made',
    description: 'Lasting friendships and relationships',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10'
  },
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Satisfaction Rate',
    description: 'Members love their experience',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  }
]

const achievements = [
  {
    title: 'Featured in TechCrunch',
    description: 'Recognized as a leading personality-based social platform'
  },
  {
    title: 'App Store Featured',
    description: 'Selected as App of the Day for innovative social features'
  },
  {
    title: 'Community Choice Award',
    description: 'Voted best new social platform by our users'
  }
]

export function StatsSection() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Trusted by thousands of
              <span className="block text-primary">amazing people</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join a thriving community that&apos;s making real connections and meaningful impact.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className={`inline-flex p-4 rounded-full ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="space-y-2">
                      <div className={`text-4xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="font-semibold text-lg">
                        {stat.label}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Achievements */}
          <div className="bg-muted/50 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Recognition & Awards</h3>
              <p className="text-muted-foreground">
                Our platform has been recognized by industry leaders and loved by users worldwide.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

