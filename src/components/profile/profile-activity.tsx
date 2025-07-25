import { 
  FileText, 
  Heart, 
  MessageSquare, 
  Users, 
  Trophy, 
  Calendar,
  TrendingUp,
  Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import type { User } from '@/types'

interface ProfileActivityProps {
  user: User & {
    _count?: {
      posts: number
      followers: number
      following: number
      likes: number
      comments: number
    }
  }
  className?: string
}

// Mock activity data - in real app this would come from API
const getActivityData = (user: User) => ({
  totalLikes: user._count?.likes || 0,
  totalComments: user._count?.comments || 0,
  engagementRate: 85, // percentage
  streakDays: 12,
  lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  monthlyGoal: {
    posts: { current: user._count?.posts || 0, target: 20 },
    engagement: { current: 156, target: 200 },
  },
  achievements: [
    { name: 'First Post', description: 'Created your first post', earned: true },
    { name: 'Social Butterfly', description: 'Made 10 connections', earned: true },
    { name: 'Conversation Starter', description: 'Received 50 comments', earned: false },
    { name: 'Influencer', description: 'Gained 100 followers', earned: false },
  ],
  weeklyActivity: [
    { day: 'Mon', posts: 2, likes: 15 },
    { day: 'Tue', posts: 1, likes: 8 },
    { day: 'Wed', posts: 3, likes: 22 },
    { day: 'Thu', posts: 0, likes: 5 },
    { day: 'Fri', posts: 2, likes: 18 },
    { day: 'Sat', posts: 1, likes: 12 },
    { day: 'Sun', posts: 1, likes: 9 },
  ]
})

export function ProfileActivity({ user, className }: ProfileActivityProps) {
  const activity = getActivityData(user)

  const stats = [
    {
      icon: FileText,
      label: 'Posts',
      value: user._count?.posts || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Heart,
      label: 'Likes Received',
      value: activity.totalLikes,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: MessageSquare,
      label: 'Comments',
      value: activity.totalComments,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Users,
      label: 'Followers',
      value: user._count?.followers || 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className={className}>
      <div className="grid gap-6">
        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activity Overview
            </CardTitle>
            <CardDescription>
              Your engagement and activity statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center p-4 rounded-lg border bg-muted/20">
                    <div className={`inline-flex p-3 rounded-full ${stat.bgColor} mb-3`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="space-y-1">
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Goals
            </CardTitle>
            <CardDescription>
              Track your progress towards monthly targets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Posts</span>
                <span className="text-sm text-muted-foreground">
                  {activity.monthlyGoal.posts.current} / {activity.monthlyGoal.posts.target}
                </span>
              </div>
              <Progress 
                value={(activity.monthlyGoal.posts.current / activity.monthlyGoal.posts.target) * 100} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Engagement</span>
                <span className="text-sm text-muted-foreground">
                  {activity.monthlyGoal.engagement.current} / {activity.monthlyGoal.engagement.target}
                </span>
              </div>
              <Progress 
                value={(activity.monthlyGoal.engagement.current / activity.monthlyGoal.engagement.target) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>
              Milestones and accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {activity.achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-muted/20 opacity-60'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    achievement.earned 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{achievement.name}</h4>
                      {achievement.earned && (
                        <Badge variant="secondary" className="text-xs">
                          Earned
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Last active</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatRelativeTime(activity.lastActive)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Activity streak</span>
              </div>
              <span className="text-sm font-medium">
                {activity.streakDays} days
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Engagement rate</span>
              </div>
              <span className="text-sm font-medium">
                {activity.engagementRate}%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Member since</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
