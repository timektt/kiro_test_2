'use client'

import { useEffect, memo, useCallback, useMemo, useState, useRef } from 'react'
import { FixedSizeList as List } from 'react-window'
import { PostItem } from '@/components/ui/post-item'
import { FeedFilter } from '@/components/ui/feed-filter'
import { LoadingFeed } from '@/components/ui/loading-feed'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Search, FileText, RefreshCw, Infinity, Settings2 } from 'lucide-react'
import { usePosts, useCreatePost, useLikePost, useLoadMorePosts } from '@/hooks/use-posts'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { useDebounce } from '@/hooks/use-debounce'
import { useFeedStore } from '@/stores/feed-store'
import { useUIStore } from '@/stores/ui-store'
import { cn } from '@/lib/utils'
import type { Post, User } from '@/types'

interface EnhancedInteractiveFeedProps {
  currentUserId: string
  realTime?: boolean
  className?: string
  infiniteScroll?: boolean // Enable infinite scroll instead of Load More button
  loadMoreThreshold?: number // Distance from bottom to trigger load more (for infinite scroll)
}

export const EnhancedInteractiveFeed = memo<EnhancedInteractiveFeedProps>(({ 
  currentUserId, 
  realTime, 
  className,
  infiniteScroll = false,
  loadMoreThreshold = 100
}) => {
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
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(infiniteScroll)
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  
  // Lazy loading state
  const [visiblePostsCount, setVisiblePostsCount] = useState(20)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  
  // Infinite scroll functionality
  const { sentinelRef, isIntersecting } = useInfiniteScroll({
    hasMore: currentPagination?.hasMore || false,
    isLoading: isLoadingMore,
    onLoadMore: () => handleLoadMore(),
    threshold: 0.1,
    rootMargin: `${loadMoreThreshold}px`,
    enabled: isInfiniteScrollEnabled,
  })
  
  // Fetch posts using the custom hook
  const { posts, pagination, isLoading, error, mutate } = usePosts({
    type: feedType,
    sort: sortBy === 'trending' ? 'popular' : sortBy as 'recent' | 'popular',
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
  
  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    const basePosts = allLoadedPosts.length > 0 ? allLoadedPosts : posts
    if (!debouncedSearchQuery) return basePosts
    
    return basePosts.filter((post: Post & { author: User & { mbti?: { type: string } | null }; _count: { likes: number; comments: number } }) => 
      post.content?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )
  }, [allLoadedPosts, posts, debouncedSearchQuery])
  
  // Lazy loaded posts for performance
  const displayPosts = useMemo(() => {
    return filteredPosts.slice(0, visiblePostsCount)
  }, [filteredPosts, visiblePostsCount])
  
  // Memoized post items for better performance
  const MemoizedPostItem = memo(PostItem)
  
  // Virtual list configuration for large datasets
  const ITEM_HEIGHT = 200 // Approximate height of each post item
  const CONTAINER_HEIGHT = 600 // Height of virtualized container
  
  // Performance thresholds
  const VIRTUALIZATION_THRESHOLD = 50 // Use virtualization for > 50 posts
  const LAZY_LOADING_BATCH_SIZE = 20 // Load 20 posts at a time
  const SEARCH_MIN_LENGTH = 2 // Minimum search query length
  
  // Determine if we should use virtualization (for large datasets)
  const shouldUseVirtualization = displayPosts.length > VIRTUALIZATION_THRESHOLD
  
  // Performance monitoring
  const performanceMetrics = useMemo(() => {
    return {
      totalPosts: filteredPosts.length,
      visiblePosts: displayPosts.length,
      isVirtualized: shouldUseVirtualization,
      isSearchActive: debouncedSearchQuery.length >= SEARCH_MIN_LENGTH,
      memoryUsage: displayPosts.length * ITEM_HEIGHT, // Approximate memory usage
    }
  }, [filteredPosts.length, displayPosts.length, shouldUseVirtualization, debouncedSearchQuery])
  


  // Virtual list item renderer
  const renderVirtualItem = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const post = displayPosts[index]
    if (!post) return null

    return (
      <div style={style} className="px-4">
        <div className="pb-4">
          <MemoizedPostItem
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onLike={() => handleLike(post.id)}
            className={post.id.startsWith('temp-') ? 'opacity-70' : ''}
          />
        </div>
      </div>
    )
  }, [displayPosts, currentUserId])
  
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
  
  // Handle search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setIsSearching(true)
  }, [])
  
  // Handle lazy loading more posts
   const handleLoadMoreVisible = useCallback(() => {
     if (visiblePostsCount < filteredPosts.length) {
       setVisiblePostsCount(prev => Math.min(prev + LAZY_LOADING_BATCH_SIZE, filteredPosts.length))
     }
   }, [visiblePostsCount, filteredPosts.length])
   
   // Memory cleanup for large datasets
   useEffect(() => {
     // Reset visible posts count when search changes to prevent memory bloat
     if (debouncedSearchQuery) {
       setVisiblePostsCount(LAZY_LOADING_BATCH_SIZE)
     }
   }, [debouncedSearchQuery])
   
   // Performance warning for development
   useEffect(() => {
     if (process.env.NODE_ENV === 'development' && performanceMetrics.totalPosts > 1000) {
       console.warn('Performance Warning: Large dataset detected', performanceMetrics)
     }
   }, [performanceMetrics])
  
  // Effect for debounced search
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setIsSearching(false)
    }
  }, [debouncedSearchQuery, searchQuery])
  
  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visiblePostsCount < filteredPosts.length) {
          handleLoadMoreVisible()
        }
      },
      { threshold: 0.1 }
    )
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }
    
    return () => observer.disconnect()
  }, [visiblePostsCount, filteredPosts.length, handleLoadMoreVisible])
  
  // Handle like with optimistic updates
  const handleLike = useCallback(async (postId: string) => {
    try {
      await toggleLike(postId)
      // Refresh posts to get updated counts
      mutate()
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }, [toggleLike, mutate])

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
      {/* Feed Header with Toggle Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Community Feed
          </h2>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Settings2 className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="infinite-scroll-toggle" className="text-muted-foreground">
            Infinite Scroll
          </Label>
          <Switch
            id="infinite-scroll-toggle"
            checked={isInfiniteScrollEnabled}
            onCheckedChange={setIsInfiniteScrollEnabled}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts, users, or tags..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
        {(isSearching || debouncedSearchQuery) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isSearching ? (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <span className="text-xs text-muted-foreground">
                {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

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
      {displayPosts.length === 0 && !isLoading ? (
        <div className="px-4 sm:px-0">
          <EmptyState
            icon={FileText}
            title={debouncedSearchQuery ? "No search results" : "No posts found"}
            description={
              debouncedSearchQuery
                ? `No posts found matching "${debouncedSearchQuery}"`
                : feedType === 'following'
                ? "Follow some users to see their posts in your feed"
                : "No posts match your current filters"
            }
          />
        </div>
      ) : (
        // Posts List - Virtualized or Regular
        <div className="space-y-4 sm:space-y-6">
          {shouldUseVirtualization ? (
            /* Virtualized List for Large Datasets */
            <div className="border rounded-lg overflow-hidden">
              <List
                height={CONTAINER_HEIGHT}
                width="100%"
                itemCount={displayPosts.length}
                itemSize={ITEM_HEIGHT}
                className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-background"
              >
                {renderVirtualItem}
              </List>
              
              {/* Virtual List Load More Indicator */}
              {currentPagination?.hasMore && isInfiniteScrollEnabled && (
                <div className="p-4 text-center border-t">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                    <RefreshCw className={cn('h-4 w-4', isLoadingMore && 'animate-spin')} />
                    <span>{isLoadingMore ? 'Loading more...' : 'Scroll for more'}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Regular List for Smaller Datasets */
            <>
              {displayPosts.map((post: Post & { author: User & { mbti?: { type: string } | null }; _count: { likes: number; comments: number } }) => (
                <MemoizedPostItem
                  key={post.id}
                  post={post}
                  currentUserId={currentUserId}
                  onLike={() => handleLike(post.id)}
                  className={post.id.startsWith('temp-') ? 'opacity-70' : ''}
                />
              ))}
              
              {/* Lazy Loading Sentinel */}
              {visiblePostsCount < filteredPosts.length && (
                <div 
                  ref={loadMoreRef}
                  className="flex items-center justify-center py-4 text-muted-foreground text-sm"
                >
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Loading more posts...
                </div>
              )}
            </>
          )}
          
          {/* Load More Section - Button or Infinite Scroll */}
          {currentPagination?.hasMore && (
            <div className="text-center py-4 sm:py-6">
              {isInfiniteScrollEnabled ? (
                <>
                  {/* Infinite Scroll Sentinel */}
                  <div 
                    ref={sentinelRef} 
                    className="h-4 flex items-center justify-center"
                  >
                    {isLoadingMore && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Loading more posts...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Infinite Scroll Indicator */}
                  {!isLoadingMore && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs opacity-60">
                      <Infinity className="h-3 w-3" />
                      <span>Scroll for more</span>
                    </div>
                  )}
                </>
              ) : (
                /* Traditional Load More Button */
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
              )}
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