'use client'

import { useState } from 'react'
import { Home, TrendingUp, Users, Clock, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FeedFilterProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  className?: string
}

const feedFilters = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    description: 'Posts from people you follow',
  },
  {
    id: 'trending',
    label: 'Trending',
    icon: TrendingUp,
    description: 'Popular posts right now',
  },
  {
    id: 'following',
    label: 'Following',
    icon: Users,
    description: 'Only from people you follow',
  },
  {
    id: 'recent',
    label: 'Recent',
    icon: Clock,
    description: 'Latest posts from everyone',
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks',
    icon: Bookmark,
    description: 'Posts you have saved',
  },
]

export function FeedFilter({ currentFilter, onFilterChange, className }: FeedFilterProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-2 sm:p-3">
        {/* Mobile: Horizontal scrollable filter */}
        <div className="sm:hidden">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {feedFilters.map((filter) => {
              const Icon = filter.icon
              const isActive = currentFilter === filter.id
              
              return (
                <Button
                  key={filter.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onFilterChange(filter.id)}
                  className={cn(
                    'flex items-center gap-1.5 text-sm whitespace-nowrap flex-shrink-0 h-8 px-3',
                    isActive && 'shadow-sm'
                  )}
                  title={filter.description}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs">{filter.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Desktop: Wrapped filter buttons */}
        <div className="hidden sm:block">
          <div className="flex flex-wrap gap-1">
            {feedFilters.map((filter) => {
              const Icon = filter.icon
              const isActive = currentFilter === filter.id
              
              return (
                <Button
                  key={filter.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onFilterChange(filter.id)}
                  className={cn(
                    'flex items-center gap-2 text-sm',
                    isActive && 'shadow-sm'
                  )}
                  title={filter.description}
                >
                  <Icon className="h-4 w-4" />
                  <span>{filter.label}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FeedFilter