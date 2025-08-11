import { Users, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Active Members',
    description: 'Growing community of diverse personalities',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: MessageSquare,
    value: '50,000+',
    label: 'Posts Shared',
    description: 'Meaningful conversations every day',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Heart,
    value: '200,000+',
    label: 'Connections Made',
    description: 'Lasting friendships and relationships',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: TrendingUp,
    value: '95%',
    label: 'Satisfaction Rate',
    description: 'Members love their experience',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

const achievements = [
  {
    title: 'Featured in TechCrunch',
    description: 'Recognized as a leading personality-based social platform',
  },
  {
    title: 'App Store Featured',
    description: 'Selected as App of the Day for innovative social features',
  },
  {
    title: 'Community Choice Award',
    description: 'Voted best new social platform by our users',
  },
];

export function StatsSection() {
  return (
    <section className="bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-bold md:text-5xl">
              Trusted by thousands of
              <span className="block text-primary">amazing people</span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              Join a thriving community that&apos;s making real connections and
              meaningful impact.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="group text-center transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="pb-6 pt-8">
                    <div
                      className={`inline-flex rounded-full p-4 ${stat.bgColor} mb-4 transition-transform group-hover:scale-110`}
                    >
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="space-y-2">
                      <div className={`text-4xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-lg font-semibold">{stat.label}</div>
                      <p className="text-sm text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Achievements */}
          <div className="rounded-2xl bg-muted/50 p-8 lg:p-12">
            <div className="mb-8 text-center">
              <h3 className="mb-4 text-2xl font-bold">Recognition & Awards</h3>
              <p className="text-muted-foreground">
                Our platform has been recognized by industry leaders and loved
                by users worldwide.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="space-y-2 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
  );
}

export default StatsSection;
