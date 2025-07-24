'use client'

import { useEffect } from 'react'
import { PostItem } from '@/components/ui/post-item'
import { FeedFilter } from '@/components/ui/feed-filter'
import { LoadingFeed } from '@/components/ui/loading-feed'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { FileText, RefreshCw } from 'lucide-react'
import { usePosts, useCreatePost, useLikePost } from '@/hooks/use-posts'
import { useFeedStore } from '@/stores/feed-store'
import { useUIStore } from '@/stores/ui-store'

interface EnhancedInteractiveFeedProps {
  currentUserId: string
}

export function EnhancedInteractiveFeed({ currentUserId }: EnhancedInteractiveFeedProps) {
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
  
  // Fetch posts using the custom hook
  const { posts, pagination, isLoading, error, mutate } = usePosts({
    type: feedType,
    sort: sortBy,
    mbti: mbtiFilter || undefined,
  })
  
  // Post creation hook
  const { createPost, isCreating } = useCreatePost()
  
  // Like functionality
  const { toggleLike, isToggling } = useLikePost()
  
  // Combine real posts with optimistic posts
  const allPosts = [...optimisticPosts, ...posts]
  
  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    if (filter === 'home') {
      setFeedType('following')
    } else if (filter === 'discover') {
      setFeedType('discover')
    } else if (filter === 'trending') {
      setFeedType('trending')
    }
  }
  
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
    <div className="space-y-6">
      {/* Feed Controls */}
      <div className="flex items-center justify-between">
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
          >
            <option value="recent">Recent</option>
            <option value="popular">Popular</option>
          </select>
          
          {/* MBTI Filter */}
          <select
            value={mbtiFilter || ''}
            onChange={(e) => handleMbtiFilter(e.target.value || null)}
            className="px-3 py-1 border rounded-md text-sm"
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
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      {/* Loading State */}
      {(isLoading || globalLoading) && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading posts...
          </div>
        </div>
      )}
      
      {/* Posts Feed */}
      {allPosts.length === 0 && !isLoading ? (
        <EmptyState
          icon={FileText}
          title="No posts found"
          description={
            feedType === 'following'
              ? "Follow some users to see their posts in your feed"
              : "No posts match your current filters"
          }
        />
      ) : (
        <div className="space-y-6">
          {allPosts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              onLike={() => handleLike(post.id)}
              isLiking={isToggling}
              // Add optimistic styling for temporary posts
              className={post.id.startsWith('temp-') ? 'opacity-70' : ''}
            />
          ))}
          
          {/* Load More Button */}
          {pagination.hasMore && (
            <div className="text-center py-4">
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement load more functionality
                  console.log('Load more posts')
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Creating Post Indicator */}
      {isCreating && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Creating post...
          </div>
        </div>
      )}
    </div>
  )
}