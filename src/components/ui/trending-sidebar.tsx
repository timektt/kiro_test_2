import { Suspense, memo, useMemo } from 'react'
import Link from 'next/link'
import { TrendingUp, Hash, Users, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserBadge } from '@/components/ui/user-badge'
import { QuickStats } from '@/components/ui/quick-stats'
import { cn } from '@/lib/utils'
import { mockUsers } from '@/lib/mock-data'
import { fmtNumber, fmtDate } from '@/lib/format'

interface TrendingSidebarProps {
  className?: string
}

// Mock trending data
const trendingTopics = [
  { tag: 'nextjs', count: 1234, growth: '+12%' },
  { tag: 'react', count: 987, growth: '+8%' },
  { tag: 'typescript', count: 756, growth: '+15%' },
  { tag: 'tailwind', count: 543, growth: '+5%' },
  { tag: 'prisma', count: 432, growth: '+20%' },
]

const suggestedUsers = [
  { id: '1', username: 'sarah_dev', name: 'Sarah Chen', followers: 1234, isFollowing: false },
  { id: '2', username: 'alex_ui', name: 'Alex Rivera', followers: 987, isFollowing: false },
  { id: '3', username: 'mike_backend', name: 'Mike Johnson', followers: 756, isFollowing: true },
  { id: '4', username: 'lisa_design', name: 'Lisa Thompson', followers: 543, isFollowing: false },
]

const upcomingEvents = [
  {
    id: '1',
    title: 'React Conference 2024',
    date: '2024-03-15',
    attendees: 234,
  },
  {
    id: '2',
    title: 'TypeScript Workshop',
    date: '2024-03-20',
    attendees: 89,
  },
  {
    id: '3',
    title: 'Next.js Meetup',
    date: '2024-03-25',
    attendees: 156,
  },
]

const TrendingTopics = memo(() => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <TrendingUp className="h-5 w-5" />
        Trending Topics
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {trendingTopics.map((topic, index) => (
        <div key={topic.tag} className="flex items-center justify-between">
          <Link 
            href={`/search?q=${encodeURIComponent(topic.tag)}`}
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <span className="text-muted-foreground text-sm">#{index + 1}</span>
            <Hash className="h-4 w-4" />
            <span className="font-medium">{topic.tag}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {fmtNumber(topic.count)}
            </Badge>
            <Badge variant="outline" className="text-xs text-green-600">
              {topic.growth}
            </Badge>
          </div>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
        <Link href="/trending">View all trending</Link>
      </Button>
    </CardContent>
  </Card>
))

TrendingTopics.displayName = 'TrendingTopics'

const SuggestedUsers = memo(() => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Users className="h-5 w-5" />
        Suggested Users
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {suggestedUsers.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserBadge 
              username={user.username}
              name={user.name}
              size="sm"
              showName
            />
            <div className="text-xs text-muted-foreground">
              {fmtNumber(user.followers)} followers
            </div>
          </div>
          <Button 
            variant={user.isFollowing ? "outline" : "default"} 
            size="sm"
            className="text-xs"
          >
            {user.isFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
        <Link href="/discover">Discover more users</Link>
      </Button>
    </CardContent>
  </Card>
))

SuggestedUsers.displayName = 'SuggestedUsers'

const UpcomingEvents = memo(() => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg">
        <Calendar className="h-5 w-5" />
        Upcoming Events
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {upcomingEvents.map((event) => (
        <div key={event.id} className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className="font-medium text-sm leading-tight">{event.title}</h4>
              <p className="text-xs text-muted-foreground">
                {fmtDate(event.date, 'en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {event.attendees} attending
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs">
            Join Event
          </Button>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
        <Link href="/events">View all events</Link>
      </Button>
    </CardContent>
  </Card>
))

UpcomingEvents.displayName = 'UpcomingEvents'

const TrendingSidebarContent = memo(({ className }: TrendingSidebarProps) => {
  const memoizedStats = useMemo(() => ({
    totalPosts: 12543,
    activeUsers: 3421,
    newToday: 89,
    trending: 15
  }), [])

  return (
    <aside className={cn('space-y-6', className)}>
      {/* Quick Stats */}
      <QuickStats 
        stats={[
          { label: 'Posts Today', value: memoizedStats.newToday, trend: '+12%' },
          { label: 'Active Users', value: memoizedStats.activeUsers, trend: '+5%' },
          { label: 'Total Posts', value: memoizedStats.totalPosts, trend: '+8%' },
        ]}
      />
      
      {/* Trending Topics */}
      <TrendingTopics />
      
      {/* Suggested Users */}
      <SuggestedUsers />
      
      {/* Upcoming Events */}
      <UpcomingEvents />
    </aside>
  )
})

TrendingSidebarContent.displayName = 'TrendingSidebarContent'

export const TrendingSidebar = memo(({ className }: TrendingSidebarProps) => (
  <Suspense fallback={
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-6 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  }>
    <TrendingSidebarContent className={className} />
  </Suspense>
))

TrendingSidebar.displayName = 'TrendingSidebar'

export default TrendingSidebar