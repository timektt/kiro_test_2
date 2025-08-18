'use client'

import { useEffect, memo, useCallback, useMemo, useState } from 'react'
import { PostItem } from '@/components/ui/post-item'
import { FeedFilter } from '@/components/ui/feed-filter'
import { LoadingFeed } from '@/components/ui/loading-feed'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { FileText, RefreshCw } from 'lucide-react'
import { usePosts, useCreatePost, useLikePost, useLoadMorePosts } from '@/hooks/use-posts'
import { useFeedStore } from '@/stores/feed-store'
import { useUIStore } from '@/stores/ui-store'
import { cn } from '@/lib/utils'

interface EnhancedInteractiveFeedProps {
  currentUserId: string
  realTime?: boolean
  className?: string
}

export const EnhancedInteractiveFeed = memo<EnhancedInteractiveFeedProps>(({ currentUserId, realTime, className }) => {
  const {
    feedType,
    sortBy,
    mbtiFilter,
    setFeedType,
    setSortBy,
    setMbtiFilter,
    optimisticPosts,
  } = useFeedStore()
  
  const { isLoading: globalLoading } = useUIStore()
  
  // Local state for pagination
  const [allLoadedPosts, setAllLoadedPosts] = useState<any[]>([])
  const [currentPagination, setCurrentPagination] = useState<any>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  // Fetch posts using the custom hook
  const { posts, pagination, isLoading, error, mutate } = usePosts({
    type: feedType,
    sort: sortBy,
    mbti: mbtiFilter || undefined,
  })
  
  // Load more posts hook
  const { loadMorePosts } = useLoadMorePosts()
  
  // Post creation hook
  const { createPost, isCreating } = useCreatePost()
  
  // Like functionality
  const { toggleLike, isToggling } = useLikePost()
  
  // Update local state when posts change
  useEffect(() => {
    if (posts.length > 0) {
      setAllLoadedPosts(posts)
      setCurrentPagination(pagination)
    }
  }, [posts, pagination])
  
  // Combine real posts with optimistic posts
  const allPosts = useMemo(() => [...optimisticPosts, ...allLoadedPosts], [optimisticPosts, allLoadedPosts])
  
  // Handle filter changes
  const handleFilterChange = useCallback((filter: string) => {
    if (filter === 'home') {
      setFeedType('following')
    } else if (filter === 'discover') {
      setFeedType('discover')
    } else if (filter === 'trending') {
      setFeedType('trending')
    }
  }, [setFeedType])
  
  // Handle sort changes
  const handleSortChange = (sort: 'recent' | 'popular') => {
    setSortBy(sort)
  }
  
  // Handle MBTI filter
  const handleMbtiFilter = (mbti: string | null) => {
    setMbtiFilter(mbti)
  }
  
  // Handle like with optimistic updates
  const handleLike = async (postId: string) => {
    try {
      await toggleLike(postId)
      // Refresh posts to get updated counts
      mutate()
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  // Handle load more posts
  const handleLoadMore = async () => {
    if (!currentPagination?.hasMore || isLoadingMore) return
    
    setIsLoadingMore(true)
    try {
      const result = await loadMorePosts(currentPagination.page, allLoadedPosts)
      setAllLoadedPosts(result.posts)
      setCurrentPagination(result.pagination)
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }
  
  // Handle refresh
  const handleRefresh = () => {
    mutate()
  }
  
  if (error) {
    return (
      <EmptyState
        icon={FileText}
        title="Failed to load feed"
        description={error.message}
        action={{
          label: 'Try Again',
          onClick: handleRefresh,
        }}
      />
    )
  }
  
  if (isLoading && allPosts.length === 0) {
    return <LoadingFeed />
  }
  
  return (
    <div className={cn('space-y-4 sm:space-y-6', className)}>
      {/* Mobile: Stacked controls */}
      <div className="sm:hidden space-y-3">
        <FeedFilter
          currentFilter={feedType === 'following' ? 'home' : feedType}
          onFilterChange={handleFilterChange}
        />
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {/* Sort Controls */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'recent' | 'popular')}
            className="px-2 py-1 border rounded-md text-xs flex-shrink-0 h-7"
            title="Sort posts"
          >
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
          </select>
          
          {/* MBTI Filter */}
          <select
            value={mbtiFilter || ''}
            onChange={(e) => handleMbtiFilter(e.target.value || null)}
            className="px-2 py-1 border rounded-md text-xs flex-shrink-0 h-7 min-w-0"
            title="Filter by MBTI type"
          >
            <option value="">All Types</option>
            <option value="INTJ">INTJ</option>
            <option value="INTP">INTP</option>
            <option value="ENTJ">ENTJ</option>
            <option value="ENTP">ENTP</option>
            <option value="INFJ">INFJ</option>
            <option value="INFP">INFP</option>
            <option value="ENFJ">ENFJ</option>
            <option value="ENFP">ENFP</option>
            <option value="ISTJ">ISTJ</option>
            <option value="ISFJ">ISFJ</option>
            <option value="ESTJ">ESTJ</option>
            <option value="ESFJ">ESFJ</option>
            <option value="ISTP">ISTP</option>
            <option value="ISFP">ISFP</option>
            <option value="ESTP">ESTP</option>
            <option value="ESFP">ESFP</option>
          </select>
          
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex-shrink-0 h-7 w-7 p-0"
            title="Refresh feed"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Desktop: Side-by-side controls */}
      <div className="hidden sm:flex items-center justify-between">
        <FeedFilter
          currentFilter={feedType === 'following' ? 'home' : feedType}
          onFilterChange={handleFilterChange}
        />
        
        <div className="flex items-center gap-2">
          {/* Sort Controls */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'recent' | 'popular')}
            className="px-3 py-1 border rounded-md text-sm"
            title="Sort posts"
          >
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
          </select>
          
          {/* MBTI Filter */}
          <select
            value={mbtiFilter || ''}
            onChange={(e) => handleMbtiFilter(e.target.value || null)}
            className="px-3 py-1 border rounded-md text-sm"
            title="Filter by MBTI type"
          >
            <option value="">All Types</option>
            <option value="INTJ">INTJ</option>
            <option value="INTP">INTP</option>
            <option value="ENTJ">ENTJ</option>
            <option value="ENTP">ENTP</option>
            <option value="INFJ">INFJ</option>
            <option value="INFP">INFP</option>
            <option value="ENFJ">ENFJ</option>
            <option value="ENFP">ENFP</option>
            <option value="ISTJ">ISTJ</option>
            <option value="ISFJ">ISFJ</option>
            <option value="ESTJ">ESTJ</option>
            <option value="ESFJ">ESFJ</option>
            <option value="ISTP">ISTP</option>
            <option value="ISFP">ISFP</option>
            <option value="ESTP">ESTP</option>
            <option value="ESFP">ESFP</option>
          </select>
          
          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            title="Refresh feed"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {/* Loading State */}
      {(isLoading || globalLoading) && (
        <div className="text-center py-3 sm:py-4">
          <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading posts...
          </div>
        </div>
      )}
      
      {/* Posts Feed */}
      {allPosts.length === 0 && !isLoading ? (
        <div className="px-4 sm:px-0">
          <EmptyState
            icon={FileText}
            title="No posts found"
            description={
              feedType === 'following'
                ? "Follow some users to see their posts in your feed"
                : "No posts match your current filters"
            }
          />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {allPosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onLike={() => handleLike(post.id)}
              // Add optimistic styling for temporary posts
              className={post.id.startsWith('temp-') ? 'opacity-70' : ''}
            />
          ))}
          
          {/* Load More Button */}
          {currentPagination?.hasMore && (
            <div className="text-center py-4 sm:py-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoading || isLoadingMore}
                className="w-full sm:w-auto px-6 sm:px-8 h-10 sm:h-11"
              >
                {isLoadingMore ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Loading more...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Creating Post Indicator - Mobile optimized */}
      {isCreating && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            <span className="text-xs sm:text-sm">Creating post...</span>
          </div>
        </div>
      )}
    </div>
  )
})

EnhancedInteractiveFeed.displayName = 'EnhancedInteractiveFeed'

export default EnhancedInteractiveFeed