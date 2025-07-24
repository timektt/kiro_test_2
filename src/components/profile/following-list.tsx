'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import Link from 'next/link'
import { Search, UserCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FollowButton } from '@/components/ui/follow-button'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingFeed } from '@/components/ui/loading-feed'
import { cn } from '@/lib/utils'

interface FollowingData {
  following: Array<{
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

interface FollowingListProps {
  userId: string
  username?: string
  className?: string
}

export function FollowingList({ userId, username, className }: FollowingListProps) {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [allFollowing, setAllFollowing] = useState<FollowingData['following']>([])
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

    return `/api/users/${userId}/following?${params.toString()}`
  }, [userId])

  // Fetch following
  const { data, error, isLoading, mutate } = useSWR<FollowingData>(
    session ? buildApiUrl(1, searchQuery) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  // Update following when data changes
  useState(() => {
    if (data?.following) {
      if (page === 1) {
        setAllFollowing(data.following)
      } else {
        setAllFollowing(prev => [...prev, ...data.following])
      }
    }
  }, [data, page])

  // Reset when search changes
  useState(() => {
    setPage(1)
    setAllFollowing([])
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
    setAllFollowing([])
  }

  const handleLoadMore = async () => {
    if (!data?.pagination.hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      const nextPage = page + 1
      const response = await fetch(buildApiUrl(nextPage, searchQuery))
      
      if (!response.ok) {
        throw new Error('Failed to load more following')
      }

      const result = await response.json()
      if (result.success && result.data.following.length > 0) {
        setAllFollowing(prev => [...prev, ...result.data.following])
        setPage(nextPage)
      }
    } catch (error) {
      console.error('Error loading more following:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleFollowChange = (followingId: string, isFollowing: boolean) => {
    // Update local state optimistically
    setAllFollowing(prev => 
      prev.map(user => 
        user.id === followingId 
          ? { ...user, isFollowedByCurrentUser: isFollowing }
          : user
      )
    )
  }

  if (!session) {
    return (
      <EmptyState
        icon={UserCheck}
        title=\"Authentication Required\"
        description=\"Please sign in to view following\"
      />
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={UserCheck}
        title=\"Error Loading Following\"
        description={error.message || 'Failed to load following'}
      />
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            <UserCheck className=\"h-5 w-5\" />
            Following
            {data?.pagination.total ? (
              <span className=\"text-sm font-normal text-muted-foreground\">
                ({data.pagination.total})
              </span>
            ) : null}
          </CardTitle>
          
          {/* Search */}
          <div className=\"relative\">
            <Search className=\"absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground\" />
            <Input
              placeholder=\"Search following...\"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className=\"pl-10\"
            />
          </div>
        </CardHeader>
        
        <CardContent className=\"p-0\">
          {isLoading && allFollowing.length === 0 ? (
            <LoadingFeed />
          ) : allFollowing.length === 0 ? (
            <div className=\"p-8\">
              <EmptyState
                icon={UserCheck}
                title={searchQuery ? 'No users found' : `${username || 'This user'} isn't following anyone yet`}
                description={
                  searchQuery 
                    ? `No following users match \"${searchQuery}\"`
                    : 'Following will appear here when they start following people.'
                }
              />
            </div>
          ) : (
            <div>
              {allFollowing.map((user) => (
                <div
                  key={user.id}
                  className=\"flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/30 transition-colors\"
                >
                  <div className=\"flex items-center gap-3 flex-1 min-w-0\">
                    {/* Avatar */}
                    <Link href={`/profile/${user.username}`}>
                      <Avatar className=\"h-12 w-12\">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>
                          {user.name?.[0] || user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Link>

                    {/* User Info */}
                    <div className=\"flex-1 min-w-0\">
                      <Link 
                        href={`/profile/${user.username}`}
                        className=\"block hover:text-primary transition-colors\"
                      >
                        <div className=\"flex items-center gap-2\">
                          <h3 className=\"font-semibold truncate\">
                            {user.name || user.username}
                          </h3>
                          {user.mbti && (
                            <Badge variant=\"secondary\" className=\"text-xs\">
                              {user.mbti.type}
                            </Badge>
                          )}
                          {!user.isActive && (
                            <Badge variant=\"outline\" className=\"text-xs\">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className=\"text-sm text-muted-foreground\">
                          @{user.username}
                        </p>
                        {user.bio && (
                          <p className=\"text-sm text-muted-foreground mt-1 line-clamp-2\">
                            {user.bio}
                          </p>
                        )}
                      </Link>

                      {/* Stats */}
                      <div className=\"flex items-center gap-4 mt-2 text-xs text-muted-foreground\">
                        <span>{user._count.posts} posts</span>
                        <span>{user._count.followers} followers</span>
                        <span>{user._count.following} following</span>
                      </div>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <div className=\"flex-shrink-0 ml-4\">
                    <FollowButton
                      userId={user.id}
                      username={user.username}
                      size=\"sm\"
                      onFollowChange={(isFollowing) => handleFollowChange(user.id, isFollowing)}
                    />
                  </div>
                </div>
              ))}

              {/* Load More */}
              {data?.pagination.hasMore && (
                <div className=\"p-6 text-center border-t\">
                  <Button 
                    variant=\"outline\" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className=\"h-4 w-4 mr-2 animate-spin\" />
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                  <p className=\"text-xs text-muted-foreground mt-2\">
                    Showing {allFollowing.length} of {data.pagination.total} following
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