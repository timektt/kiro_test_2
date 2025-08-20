'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import Link from 'next/link'
import { Search, Users, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FollowButton } from '@/components/ui/follow-button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingFeed } from '@/components/ui/loading-feed'
import { cn } from '@/lib/utils'

interface FollowerData {
  followers: Array<{
    id: string
    username: string
    name: string | null
    image: string | null
    bio: string | null
    isActive: boolean
    followedAt: Date
    isFollowedByCurrentUser: boolean
    mbti?: {
      type: string
    } | null
    _count: {
      followers: number
      following: number
      posts: number
    }
  }>
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'API Error')
  }
  return result.data
}

interface FollowersListProps {
  userId: string
  username?: string
  className?: string
}

export function FollowersList({ userId, username, className }: FollowersListProps) {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [allFollowers, setAllFollowers] = useState<FollowerData['followers']>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Build API URL
  const buildApiUrl = useCallback((pageNum: number, search: string) => {
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: '20',
    })

    if (search.trim()) {
      params.append('search', search.trim())
    }

    return `/api/users/${userId}/followers?${params.toString()}`
  }, [userId])

  // Fetch followers
  const { data, error, isLoading, mutate } = useSWR<FollowerData>(
    session ? buildApiUrl(1, searchQuery) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  // Update followers when data changes
  useState(() => {
    if (data?.followers) {
      if (page === 1) {
        setAllFollowers(data.followers)
      } else {
        setAllFollowers(prev => [...prev, ...data.followers])
      }
    }
  }, [data, page])

  // Reset when search changes
  useEffect(() => {
    setPage(1)
    setAllFollowers([])
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
    setAllFollowers([])
  }

  const handleLoadMore = async () => {
    if (!data?.pagination.hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      const nextPage = page + 1
      const response = await fetch(buildApiUrl(nextPage, searchQuery))
      
      if (!response.ok) {
        throw new Error('Failed to load more followers')
      }

      const result = await response.json()
      if (result.success && result.data.followers.length > 0) {
        setAllFollowers(prev => [...prev, ...result.data.followers])
        setPage(nextPage)
      }
    } catch (error) {
      console.error('Error loading more followers:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleFollowChange = (followerId: string, isFollowing: boolean) => {
    // Update local state optimistically
    setAllFollowers(prev => 
      prev.map(follower => 
        follower.id === followerId 
          ? { ...follower, isFollowedByCurrentUser: isFollowing }
          : follower
      )
    )
  }

  if (!session) {
    return (
      <EmptyState
        icon={Users}
        title="Authentication Required"
        description="Please sign in to view followers"
      />
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={Users}
        title="Error Loading Followers"
        description={error.message || 'Failed to load followers'}
      />
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Followers
            {data?.pagination.total ? (
              <span className="text-sm font-normal text-muted-foreground">
                ({data.pagination.total})
              </span>
            ) : null}
          </CardTitle>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search followers..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading && allFollowers.length === 0 ? (
            <LoadingFeed />
          ) : allFollowers.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Users}
                title={searchQuery ? 'No followers found' : `${username || 'This user'} has no followers yet`}
                description={
                  searchQuery 
                    ? `No followers match "${searchQuery}"`
                    : 'Followers will appear here when people start following.'
                }
              />
            </div>
          ) : (
            <div>
              {allFollowers.map((follower) => (
                <div
                  key={follower.id}
                  className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <Link href={`/profile/${follower.username}`}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={follower.image || undefined} />
                        <AvatarFallback>
                          {follower.name?.[0] || follower.username[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/profile/${follower.username}`}
                        className="block hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">
                            {follower.name || follower.username}
                          </h3>
                          {follower.mbti && (
                            <Badge variant="secondary" className="text-xs">
                              {follower.mbti.type}
                            </Badge>
                          )}
                          {!follower.isActive && (
                            <Badge variant="outline" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          @{follower.username}
                        </p>
                        {follower.bio && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {follower.bio}
                          </p>
                        )}
                      </Link>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{follower._count.posts} posts</span>
                        <span>{follower._count.followers} followers</span>
                        <span>{follower._count.following} following</span>
                      </div>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <div className="flex-shrink-0 ml-4">
                    <FollowButton
                      userId={follower.id}
                      username={follower.username}
                      size="sm"
                      onFollowChange={(isFollowing) => handleFollowChange(follower.id, isFollowing)}
                    />
                  </div>
                </div>
              ))}

              {/* Load More */}
              {data?.pagination.hasMore && (
                <div className="p-6 text-center border-t">
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing {allFollowers.length} of {data.pagination.total} followers
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default FollowersList
