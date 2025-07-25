'use client'

import { useState } from 'react'
import { Ranking, RankingType } from '@/types'
import { getRankingInfo, getRankingColorClass, getRankBadgeColor, getRankEmoji } from '@/lib/ranking'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserBadge } from '@/components/ui/user-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RankingBoardProps {
  rankings: Record<string, Record<string, Ranking[]>>
  isLoading?: boolean
}

export function RankingBoard({ rankings, isLoading }: RankingBoardProps) {
  const [selectedType, setSelectedType] = useState<RankingType>('ENGAGEMENT')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all-time')

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const currentRankings = rankings[selectedType]?.[selectedPeriod] || []
  const availablePeriods = rankings[selectedType] ? Object.keys(rankings[selectedType]) : ['all-time']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Rankings</h2>
          <p className="text-muted-foreground">
            See who's leading the community in various categories
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as RankingType)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(getRankingInfo).map(([type, info]) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center gap-2">
                    <span>{info.icon}</span>
                    <span>{info.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availablePeriods.map((period) => (
                <SelectItem key={period} value={period}>
                  {formatPeriod(period)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getRankingInfo(selectedType).icon}</span>
            <div>
              <CardTitle className="flex items-center gap-2">
                {getRankingInfo(selectedType).name}
                <Badge className={getRankingColorClass(selectedType)}>
                  {formatPeriod(selectedPeriod)}
                </Badge>
              </CardTitle>
              <CardDescription>
                {getRankingInfo(selectedType).description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentRankings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">No Rankings Yet</h3>
              <p className="text-sm text-muted-foreground">
                Rankings will appear here once users start engaging with the community
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentRankings.slice(0, 3).map((ranking) => (
                <TopRankingCard key={ranking.id} ranking={ranking} />
              ))}
              
              {currentRankings.length > 3 && (
                <div className="space-y-2 pt-4 border-t">
                  {currentRankings.slice(3, 10).map((ranking) => (
                    <RankingRow key={ranking.id} ranking={ranking} />
                  ))}
                </div>
              )}
              
              {currentRankings.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    View All Rankings
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TopRankingCard({ ranking }: { ranking: Ranking }) {
  const rankColor = getRankBadgeColor(ranking.rank || 0)
  const emoji = getRankEmoji(ranking.rank || 0)

  return (
    <Card className={cn(
      'relative overflow-hidden',
      ranking.rank === 1 && 'ring-2 ring-yellow-200 bg-yellow-50/50',
      ranking.rank === 2 && 'ring-2 ring-gray-200 bg-gray-50/50',
      ranking.rank === 3 && 'ring-2 ring-orange-200 bg-orange-50/50'
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={ranking.user?.image || undefined} />
                <AvatarFallback>
                  {ranking.user?.name?.[0] || ranking.user?.username?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1">
                <Badge className={cn('text-xs px-1.5 py-0.5', rankColor)}>
                  {emoji}
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">
                  {ranking.user?.name || ranking.user?.username}
                </h3>
                {ranking.user?.mbti && (
                  <Badge variant="secondary" className="text-xs">
                    {ranking.user.mbti.type}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                @{ranking.user?.username}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">
              {ranking.score.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              points
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RankingRow({ ranking }: { ranking: Ranking }) {
  const rankColor = getRankBadgeColor(ranking.rank || 0)
  const emoji = getRankEmoji(ranking.rank || 0)

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Badge className={cn('text-xs px-2 py-1', rankColor)}>
          {emoji} #{ranking.rank}
        </Badge>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={ranking.user?.image || undefined} />
          <AvatarFallback className="text-xs">
            {ranking.user?.name?.[0] || ranking.user?.username?.[0] || '?'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">
              {ranking.user?.name || ranking.user?.username}
            </span>
            {ranking.user?.mbti && (
              <Badge variant="secondary" className="text-xs">
                {ranking.user.mbti.type}
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            @{ranking.user?.username}
          </span>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-semibold">
          {ranking.score.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">
          pts
        </div>
      </div>
    </div>
  )
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

const getRankingInfo = (type: RankingType) => {
  const info = {
    POSTS_LIKES: { name: 'Most Liked', description: 'Users with the most likes', icon: '❤️' },
    POSTS_COUNT: { name: 'Most Active', description: 'Users with the most posts', icon: '📝' },
    COMMENTS_COUNT: { name: 'Most Engaged', description: 'Users with the most comments', icon: '💬' },
    FOLLOWERS_COUNT: { name: 'Most Followed', description: 'Users with the most followers', icon: '👥' },
    ENGAGEMENT: { name: 'Overall Engagement', description: 'Combined engagement score', icon: '🌟' },
    WEEKLY_ACTIVE: { name: 'Weekly Champion', description: 'Most active this week', icon: '🏆' },
    MONTHLY_ACTIVE: { name: 'Monthly Champion', description: 'Most active this month', icon: '👑' }
  }
  return info[type]
}
