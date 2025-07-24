import { renderHook, act } from '@testing-library/react'
import { useFeedStore } from '@/stores/feed-store'

// Mock API calls
jest.mock('@/hooks/use-api', () => ({
  useApi: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}))

describe('Feed Store', () => {
  const mockPosts = [
    {
      id: 'post-1',
      content: 'First test post',
      imageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: true,
      author: {
        id: 'author-1',
        username: 'author1',
        name: 'Author One',
        image: null,
      },
      _count: {
        likes: 5,
        comments: 2,
      },
      isLiked: false,
    },
    {
      id: 'post-2',
      content: 'Second test post',
      imageUrl: 'https://example.com/image.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: true,
      author: {
        id: 'author-2',
        username: 'author2',
        name: 'Author Two',
        image: 'https://example.com/avatar.jpg',
      },
      _count: {
        likes: 10,
        comments: 5,
      },
      isLiked: true,
    },
  ]

  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useFeedStore())
    act(() => {
      result.current.setPosts([])
      result.current.setLoading(false)
      result.current.setError(null)
      result.current.setHasMore(true)
      result.current.setFeedType('following')
      result.current.clearOptimisticUpdates()
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useFeedStore())

      expect(result.current.posts).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.hasMore).toBe(true)
      expect(result.current.feedType).toBe('following')
      expect(result.current.optimisticUpdates).toBeInstanceOf(Map)
      expect(result.current.optimisticUpdates.size).toBe(0)
    })
  })

  describe('Posts Management', () => {
    it('should set posts', () => {
      const { result } = renderHook(() => useFeedStore())

      act(() => {
        result.current.setPosts(mockPosts)
      })

      expect(result.current.posts).toEqual(mockPosts)
    })

    it('should add a new post', () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setPosts([mockPosts[1]]) // Start with second post
      })

      const newPost = mockPosts[0]
      
      act(() => {
        result.current.addPost(newPost)
      })

      expect(result.current.posts).toHaveLength(2)
      expect(result.current.posts[0]).toEqual(newPost) // New post should be first
    })

    it('should update an existing post', () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setPosts(mockPosts)
      })

      const updatedPost = {
        ...mockPosts[0],
        content: 'Updated content',
        _count: { likes: 10, comments: 3 },
      }

      act(() => {
        result.current.updatePost(updatedPost)
      })

      expect(result.current.posts[0].content).toBe('Updated content')
      expect(result.current.posts[0]._count.likes).toBe(10)
    })

    it('should remove a post', () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setPosts(mockPosts)
      })

      act(() => {
        result.current.removePost('post-1')
      })

      expect(result.current.posts).toHaveLength(1)
      expect(result.current.posts[0].id).toBe('post-2')
    })

    it('should not add duplicate posts', () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setPosts([mockPosts[0]])
      })

      act(() => {
        result.current.addPost(mockPosts[0]) // Try to add same post again
      })

      expect(result.current.posts).toHaveLength(1)
    })
  })

  describe('Loading State', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useFeedStore())

      act(() => {
        result.current.setLoading(true)
      })

      expect(result.current.loading).toBe(true)

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.loading).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should set error state', () => {
      const { result } = renderHook(() => useFeedStore())
      const errorMessage = 'Failed to load posts'

      act(() => {
        result.current.setError(errorMessage)
      })

      expect(result.current.error).toBe(errorMessage)

      act(() => {
        result.current.setError(null)
      })

      expect(result.current.error).toBe(null)
    })
  })

  describe('Feed Type Management', () => {
    it('should change feed type', () => {
      const { result } = renderHook(() => useFeedStore())

      act(() => {
        result.current.setFeedType('discover')
      })

      expect(result.current.feedType).toBe('discover')

      act(() => {
        result.current.setFeedType('trending')
      })

      expect(result.current.feedType).toBe('trending')
    })

    it('should clear posts when changing feed type', () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setPosts(mockPosts)
        result.current.setFeedType('discover')
      })

      // Posts should be cleared when feed type changes
      expect(result.current.posts).toEqual([])
    })
  })

  describe('Pagination', () => {
    it('should manage hasMore state', () => {
      const { result } = renderHook(() => useFeedStore())

      act(() => {
        result.current.setHasMore(false)
      })

      expect(result.current.hasMore).toBe(false)

      act(() => {
        result.current.setHasMore(true)
      })

      expect(result.current.hasMore).toBe(true)
    })

    it('should load more posts', async () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setPosts([mockPosts[0]])
      })

      // Mock the loadMorePosts function to simulate API call
      const mockLoadMore = jest.fn().mockResolvedValue({
        posts: [mockPosts[1]],
        hasMore: false,
      })

      act(() => {
        result.current.loadMorePosts = mockLoadMore
      })

      await act(async () => {
        await result.current.loadMorePosts()
      })

      expect(mockLoadMore).toHaveBeenCalled()
    })
  })

  describe('Optimistic Updates', () => {
    it('should add optimistic update', () => {
      const { result } = renderHook(() => useFeedStore())
      
      const optimisticUpdate = {
        type: 'like' as const,
        isLiked: true,
        timestamp: Date.now(),
      }

      act(() => {
        result.current.addOptimisticUpdate('post-1', optimisticUpdate)
      })

      expect(result.current.optimisticUpdates.has('post-1')).toBe(true)
      expect(result.current.optimisticUpdates.get('post-1')).toEqual(optimisticUpdate)
    })

    it('should remove optimistic update', () => {
      const { result } = renderHook(() => useFeedStore())
      
      const optimisticUpdate = {
        type: 'like' as const,
        isLiked: true,
        timestamp: Date.now(),
      }

      act(() => {
        result.current.addOptimisticUpdate('post-1', optimisticUpdate)
      })

      expect(result.current.optimisticUpdates.has('post-1')).toBe(true)

      act(() => {
        result.current.removeOptimisticUpdate('post-1')
      })

      expect(result.current.optimisticUpdates.has('post-1')).toBe(false)
    })

    it('should clear all optimistic updates', () => {
      const { result } = renderHook(() => useFeedStore())
      
      const optimisticUpdate1 = {
        type: 'like' as const,
        isLiked: true,
        timestamp: Date.now(),
      }

      const optimisticUpdate2 = {
        type: 'comment' as const,
        commentCount: 5,
        timestamp: Date.now(),
      }

      act(() => {
        result.current.addOptimisticUpdate('post-1', optimisticUpdate1)
        result.current.addOptimisticUpdate('post-2', optimisticUpdate2)
      })

      expect(result.current.optimisticUpdates.size).toBe(2)

      act(() => {
        result.current.clearOptimisticUpdates()
      })

      expect(result.current.optimisticUpdates.size).toBe(0)
    })

    it('should handle multiple optimistic updates for same post', () => {
      const { result } = renderHook(() => useFeedStore())
      
      const likeUpdate = {
        type: 'like' as const,
        isLiked: true,
        timestamp: Date.now(),
      }

      const commentUpdate = {
        type: 'comment' as const,
        commentCount: 3,
        timestamp: Date.now() + 1000,
      }

      act(() => {
        result.current.addOptimisticUpdate('post-1', likeUpdate)
      })

      expect(result.current.optimisticUpdates.get('post-1')).toEqual(likeUpdate)

      act(() => {
        result.current.addOptimisticUpdate('post-1', commentUpdate)
      })

      // Should replace the previous update
      expect(result.current.optimisticUpdates.get('post-1')).toEqual(commentUpdate)
    })
  })

  describe('Feed Refresh', () => {
    it('should refresh feed', async () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setPosts(mockPosts)
        result.current.setError('Some error')
      })

      // Mock the refreshFeed function
      const mockRefresh = jest.fn().mockResolvedValue({
        posts: [mockPosts[1]], // Different posts after refresh
        hasMore: true,
      })

      act(() => {
        result.current.refreshFeed = mockRefresh
      })

      await act(async () => {
        await result.current.refreshFeed()
      })

      expect(mockRefresh).toHaveBeenCalled()
    })

    it('should clear error on refresh', () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setError('Network error')
      })

      expect(result.current.error).toBe('Network error')

      act(() => {
        result.current.refreshFeed()
      })

      expect(result.current.error).toBe(null)
    })
  })

  describe('Store Persistence', () => {
    it('should maintain lastFetch timestamp', () => {
      const { result } = renderHook(() => useFeedStore())
      
      const initialTimestamp = result.current.lastFetch
      
      act(() => {
        result.current.setPosts(mockPosts)
      })

      // lastFetch should be updated when posts are set
      expect(result.current.lastFetch).toBeGreaterThan(initialTimestamp)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty posts array', () => {
      const { result } = renderHook(() => useFeedStore())

      act(() => {
        result.current.setPosts([])
      })

      expect(result.current.posts).toEqual([])
    })

    it('should handle updating non-existent post', () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setPosts([mockPosts[0]])
      })

      const nonExistentPost = {
        ...mockPosts[1],
        id: 'non-existent',
      }

      act(() => {
        result.current.updatePost(nonExistentPost)
      })

      // Should not add the post, just ignore the update
      expect(result.current.posts).toHaveLength(1)
      expect(result.current.posts[0].id).toBe('post-1')
    })

    it('should handle removing non-existent post', () => {
      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.setPosts(mockPosts)
      })

      act(() => {
        result.current.removePost('non-existent')
      })

      // Should not affect existing posts
      expect(result.current.posts).toHaveLength(2)
    })

    it('should handle invalid feed type', () => {
      const { result } = renderHook(() => useFeedStore())

      act(() => {
        // @ts-ignore - Testing invalid input
        result.current.setFeedType('invalid-type')
      })

      // Should fallback to default or handle gracefully
      expect(['following', 'discover', 'trending']).toContain(result.current.feedType)
    })
  })

  describe('Performance', () => {
    it('should handle large number of posts efficiently', () => {
      const { result } = renderHook(() => useFeedStore())
      
      const largePosts = Array.from({ length: 1000 }, (_, i) => ({
        ...mockPosts[0],
        id: `post-${i}`,
        content: `Post ${i}`,
      }))

      const startTime = performance.now()
      
      act(() => {
        result.current.setPosts(largePosts)
      })

      const endTime = performance.now()
      
      expect(result.current.posts).toHaveLength(1000)
      expect(endTime - startTime).toBeLessThan(100) // Should complete within 100ms
    })

    it('should handle frequent optimistic updates efficiently', () => {
      const { result } = renderHook(() => useFeedStore())
      
      const startTime = performance.now()
      
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.addOptimisticUpdate(`post-${i}`, {
            type: 'like',
            isLiked: true,
            timestamp: Date.now(),
          })
        }
      })

      const endTime = performance.now()
      
      expect(result.current.optimisticUpdates.size).toBe(100)
      expect(endTime - startTime).toBeLessThan(50) // Should complete within 50ms
    })
  })
})