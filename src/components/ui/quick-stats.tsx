import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, MessageSquare, Heart } from 'lucide-react'

interface QuickStatsProps {
  stats?: {
    activeUsers: number
    postsToday: number
    totalLikes: number
    totalComments: number
  }
  className?: string
}

export function QuickStats({ 
  stats = {
    activeUsers: 1234,
    postsToday: 89,
    totalLikes: 5678,
    totalComments: 2341
  },
  className 
}: QuickStatsProps) {
  const statItems = [
    {
      label: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Posts Today',
      value: stats.postsToday.toString(),
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Trending',
      value: '+12%',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Community Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
