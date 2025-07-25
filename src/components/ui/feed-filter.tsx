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
      <CardContent className="p-2">
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
                <span className="hidden sm:inline">{filter.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
