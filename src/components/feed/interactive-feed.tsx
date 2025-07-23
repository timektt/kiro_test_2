'use client'

import { useState, useCallback } from 'react'
import { PostItem } from '@/components/ui/post-item'
import { FeedFilter } from '@/components/ui/feed-filter'
import { LoadingFeed } from '@/components/ui/loading-feed'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { FileText, RefreshCw } from 'lucide-react'
import type { Post, User } from '@/types'

interface InteractiveFeedProps {
  initialPosts: Array<Post & {
    author: User & { mbti?: { type: string } | null }
    _count: { likes: number; comments: number }
  }>
  currentUserId: string
}

export function InteractiveFeed({ initialPosts, currentUserId }: InteractiveFeedProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [currentFilter, setCurrentFilter] = useState('home')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const handleFilterChange = useCallback(async (filter: string) => {
    setCurrentFilter(filter)
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Fetch posts based on filter
    console.log('Fetching posts for filter:', filter)
    
    setIsLoading(false)
  }, [])

  const handleLike = useCallback(async (postId: string) => {
    // Optimistic update
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = false // TODO: Check if already liked
          return {
            ...post,
            _count: {
              ...post._count,
              likes: isLiked ? post._count.likes - 1 : post._count.likes + 1
            }
          }
        }
        return post
      })
    )

    // TODO: Make API call to like/unlike post
    console.log('Toggling like for post:', postId)
  }, [])

  const handleComment = useCallback((postId: string) => {
    // TODO: Navigate to post detail or open comment modal
    console.log('Opening comments for post:', postId)
  }, [])

  const handleShare = useCallback(async (postId: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post',
          url: `${window.location.origin}/post/${postId}`,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
        // TODO: Show toast notification
        console.log('Link copied to clipboard')
      }
    } catch (error) {
      console.error('Error sharing post:', error)
    }
  }, [])

  const handleBookmark = useCallback(async (postId: string) => {
    // TODO: Make API call to bookmark/unbookmark post
    console.log('Toggling bookmark for post:', postId)
  }, [])

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // TODO: Fetch more posts
    console.log('Loading more posts...')
    
    setIsLoadingMore(false)
  }, [])

  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Refresh posts
    console.log('Refreshing posts...')
    
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <FeedFilter currentFilter={currentFilter} onFilterChange={handleFilterChange} />
        <LoadingFeed />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <FeedFilter currentFilter={currentFilter} onFilterChange={handleFilterChange} />
        <EmptyState
          icon={FileText}
          title="No posts found"
          description={
            currentFilter === 'home'
              ? "Follow some people to see their posts in your feed"
              : `No posts found for ${currentFilter} filter`
          }
          action={{
            label: currentFilter === 'home' ? 'Find People' : 'Refresh',
            onClick: currentFilter === 'home' 
              ? () => console.log('Navigate to find people')
              : handleRefresh
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FeedFilter currentFilter={currentFilter} onFilterChange={handleFilterChange} />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onBookmark={handleBookmark}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-8">
        <Button 
          variant="outline" 
          size="lg"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? 'Loading...' : 'Load More Posts'}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Showing {posts.length} posts
        </p>
      </div>
    </div>
  )
}