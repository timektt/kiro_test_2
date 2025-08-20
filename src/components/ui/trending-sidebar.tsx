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

interface TrendingSidebarProps {
  className?: string
}

const trendingTopics = [
  { tag: 'webdev', posts: 234, growth: '+12%' },
  { tag: 'javascript', posts: 189, growth: '+8%' },
  { tag: 'react', posts: 156, growth: '+15%' },
  { tag: 'nextjs', posts: 98, growth: '+22%' },
  { tag: 'typescript', posts: 87, growth: '+5%' },
]

const upcomingEvents = [
  {
    id: '1',
    title: 'Web Dev Meetup',
    date: '2024-01-25',
    time: '18:00',
    attendees: 45,
  },
  {
    id: '2',
    title: 'React Workshop',
    date: '2024-01-28',
    time: '14:00',
    attendees: 32,
  },
  {
    id: '3',
    title: 'MBTI Discussion',
    date: '2024-01-30',
    time: '19:30',
    attendees: 67,
  },
]

const TrendingTopicsSection = memo(() => (
  <Card className="h-full">
    <CardHeader className="pb-3 sm:pb-4">
      <CardTitle className="text-base sm:text-lg flex items-center gap-2">
        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="truncate">Trending Topics</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 sm:space-y-3">
      {trendingTopics.map((topic, index) => (
        <Link
          key={topic.tag}
          href={`/explore?tag=${topic.tag}`}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors touch-manipulation"
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="font-medium text-sm truncate">{topic.tag}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {topic.posts} posts
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">
            {topic.growth}
          </Badge>
        </Link>
      ))}
      
      <Button variant="ghost" className="w-full text-sm h-8 sm:h-9" asChild>
        <Link href="/explore">Show more</Link>
      </Button>
    </CardContent>
  </Card>
))

TrendingTopicsSection.displayName = 'TrendingTopicsSection'

const SuggestedUsersSection = memo(() => {
  const suggestedUsers = useMemo(() => mockUsers.slice(0, 3), [])
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="truncate">People to Follow</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-2 sm:gap-3">
            <UserBadge 
              user={user} 
              size="sm" 
              showMBTI={false}
              className="flex-1 min-w-0"
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-shrink-0 h-7 px-3 text-xs sm:h-8 sm:px-4 sm:text-sm touch-manipulation"
            >
              Follow
            </Button>
          </div>
        ))}
        
        <Button variant="ghost" className="w-full text-sm h-8 sm:h-9" asChild>
          <Link href="/explore/people">View all</Link>
        </Button>
      </CardContent>
    </Card>
  )
})

SuggestedUsersSection.displayName = 'SuggestedUsersSection'

const UpcomingEventsSection = memo(() => (
  <Card className="h-full">
    <CardHeader className="pb-3 sm:pb-4">
      <CardTitle className="text-base sm:text-lg flex items-center gap-2">
        <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="truncate">Upcoming Events</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 sm:space-y-3">
      {upcomingEvents.map((event) => (
        <div 
          key={event.id} 
          className="p-2.5 sm:p-3 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer touch-manipulation"
        >
          <h4 className="font-medium text-sm truncate">{event.title}</h4>
          <div className="text-xs text-muted-foreground mt-1">
            {event.date} at {event.time}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3 flex-shrink-0" />
            <span>{event.attendees} attending</span>
          </div>
        </div>
      ))}
      
      <Button variant="ghost" className="w-full text-sm h-8 sm:h-9" asChild>
        <Link href="/events">View all events</Link>
      </Button>
    </CardContent>
  </Card>
))

UpcomingEventsSection.displayName = 'UpcomingEventsSection'

export const TrendingSidebar = memo<TrendingSidebarProps>(({ className }) => {
  return (
    <div className={cn('space-y-4 sm:space-y-6', className)}>
      {/* Quick Stats */}
      <Suspense fallback={<div className="h-16 sm:h-20 bg-muted animate-pulse rounded-lg" />}>
        <QuickStats />
      </Suspense>

      {/* Mobile: Horizontal scrollable sections */}
      <div className="sm:hidden">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-shrink-0 w-72">
            <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-lg" />}>
              <TrendingTopicsSection />
            </Suspense>
          </div>
          <div className="flex-shrink-0 w-72">
            <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-lg" />}>
              <SuggestedUsersSection />
            </Suspense>
          </div>
          <div className="flex-shrink-0 w-72">
            <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-lg" />}>
              <UpcomingEventsSection />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Desktop: Stacked sections */}
      <div className="hidden sm:block space-y-6">
        {/* Trending Topics */}
        <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
          <TrendingTopicsSection />
        </Suspense>

        {/* Suggested Users */}
        <Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-lg" />}>
          <SuggestedUsersSection />
        </Suspense>

        {/* Upcoming Events */}
        <Suspense fallback={<div className="h-56 bg-muted animate-pulse rounded-lg" />}>
          <UpcomingEventsSection />
        </Suspense>
      </div>
    </div>
  )
})

TrendingSidebar.displayName = 'TrendingSidebar'

export default TrendingSidebar
