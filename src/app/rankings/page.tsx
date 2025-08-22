'use client'

import { useState, Suspense, memo, useMemo } from 'react'
import { useRankings, useRankingStats } from '@/hooks/use-rankings'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, Users, Trophy, Activity, Heart, FileText, MessageCircle, UserCheck, Star, Crown, BarChart } from 'lucide-react'
import { fmtNumber } from '@/lib/format'

// Dynamic import for ranking board
const RankingBoard = dynamic(
  () => import('@/components/rankings/ranking-board').then(mod => ({ default: mod.RankingBoard })),
  {
    loading: () => (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    ),
    ssr: false,
  }
)

const StatsOverview = memo(({ stats }: { stats: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{fmtNumber(stats.totalUsers)}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Activity className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{fmtNumber(stats.activeUsers)}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.topPerformers.length}</div>
            <div className="text-sm text-muted-foreground">Top Performers</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-bold">{Object.keys(stats.categoryStats).length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
))

StatsOverview.displayName = 'StatsOverview'

export default function RankingsPage() {
  const { rankings, isLoading: rankingsLoading } = useRankings()
  const { stats, isLoading: statsLoading } = useRankingStats()

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">[TROPHY] Community Rankings</h1>
          <p className="text-xl text-muted-foreground">
            Discover the most active and engaged community members
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          }>
            <StatsOverview stats={stats} />
          </Suspense>
        )}

        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard">
            <Suspense fallback={
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            }>
              <RankingBoard rankings={rankings} isLoading={rankingsLoading} />
            </Suspense>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.categoryStats).map(([type, categoryStats]) => (
                  <Card key={type}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{getCategoryIcon(type)}</span>
                        {getCategoryName(type)}
                      </CardTitle>
                      <CardDescription>
                        {getCategoryDescription(type)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Participants</span>
                        <span className="font-medium">{categoryStats.totalParticipants}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average Score</span>
                        <span className="font-medium">{categoryStats.averageScore.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Top Score</span>
                        <Badge variant="secondary">
                          {fmtNumber(categoryStats.topScore)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>
                      Users excelling across multiple categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.topPerformers.slice(0, 5).map((performer, index) => (
                        <div key={performer.userId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">#{index + 1}</Badge>
                            <div>
                              <div className="font-medium">
                                {performer.name || performer.username}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                @{performer.username}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {fmtNumber(performer.totalScore)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {performer.categories} categories
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Updates</CardTitle>
                    <CardDescription>
                      Latest ranking calculations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.recentUpdates.slice(0, 5).map((update, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span>{getCategoryIcon(update.type)}</span>
                            <div>
                              <div className="font-medium text-sm">
                                {getCategoryName(update.type)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatPeriod(update.period)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm">
                              {update.topUser.name || update.topUser.username}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {fmtNumber(update.topUser.score)} pts
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function getCategoryIcon(type: string): React.ReactNode {
  const iconProps = { className: "w-4 h-4" }
  const icons: Record<string, React.ReactNode> = {
    POSTS_LIKES: <Heart {...iconProps} />,
    POSTS_COUNT: <FileText {...iconProps} />,
    COMMENTS_COUNT: <MessageCircle {...iconProps} />,
    FOLLOWERS_COUNT: <UserCheck {...iconProps} />,
    ENGAGEMENT: <Star {...iconProps} />,
    WEEKLY_ACTIVE: <Trophy {...iconProps} />,
    MONTHLY_ACTIVE: <Crown {...iconProps} />
  }
  return icons[type] || <BarChart {...iconProps} />
}

function getCategoryName(type: string): string {
  const names: Record<string, string> = {
    POSTS_LIKES: 'Most Liked',
    POSTS_COUNT: 'Most Active',
    COMMENTS_COUNT: 'Most Engaged',
    FOLLOWERS_COUNT: 'Most Followed',
    ENGAGEMENT: 'Overall Engagement',
    WEEKLY_ACTIVE: 'Weekly Champion',
    MONTHLY_ACTIVE: 'Monthly Champion'
  }
  return names[type] || type
}

function getCategoryDescription(type: string): string {
  const descriptions: Record<string, string> = {
    POSTS_LIKES: 'Users with the most likes on their posts',
    POSTS_COUNT: 'Users who create the most posts',
    COMMENTS_COUNT: 'Users who comment the most',
    FOLLOWERS_COUNT: 'Users with the most followers',
    ENGAGEMENT: 'Combined engagement across all activities',
    WEEKLY_ACTIVE: 'Most active user this week',
    MONTHLY_ACTIVE: 'Most active user this month'
  }
  return descriptions[type] || 'Ranking category'
}

function formatPeriod(period: string): string {
  if (period === 'all-time') return 'All Time'
  if (period.includes('-W')) {
    const [year, week] = period.split('-W')
    return `Week ${week}, ${year}`
  }
  if (period.includes('-')) {
    const [year, month] = period.split('-')
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }
  return period
}


