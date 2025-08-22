import { renderHook, act } from '@testing-library/react'
import { useFeedStore } from '@/stores/feed-store'

// Mock the API hook
jest.mock('@/hooks/use-api', () => ({
  useApi: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

const mockPosts = [
  {
    id: 'post-1',
    content: 'First test post',
    imageUrl: null,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
    authorId: 'author-1',
    likes: [],
    comments: [],
    author: {
      id: 'author-1',
      username: 'author1',
      name: 'Author One',
      image: null,
    },
    _count: {
      likes: 5,
      comments: 3,
    },
  },
  {
    id: 'post-2',
    content: 'Second test post',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
    authorId: 'author-2',
    likes: [],
    comments: [],
    author: {
      id: 'author-2',
      username: 'author2',
      name: 'Author Two',
      image: 'https://example.com/avatar.jpg',
    },
    _count: {
      likes: 10,
      comments: 7,
    },
  },
]

describe('Feed Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useFeedStore())
    act(() => {
      result.current.reset()
    })
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useFeedStore())
      
      expect(result.current.posts).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.hasMore).toBe(true)
      expect(result.current.page).toBe(1)
    })
  })

  describe('Loading Posts', () => {
    it('should set loading state when fetching posts', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ posts: mockPosts, hasMore: true }),
          } as Response), 100)
        )
      )

      const { result } = renderHook(() => useFeedStore())
      
      act(() => {
        result.current.loadPosts()
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.error).toBeNull()

      // Wait for the async operation to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150))
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.posts).toEqual(mockPosts)
      expect(result.current.hasMore).toBe(true)
    })

    it('should handle API errors when loading posts', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValue(new Error('API Error'))

      const { result } = renderHook(() => useFeedStore())
      
      await act(async () => {
        await result.current.loadPosts()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Failed to load posts')
      expect(result.current.posts).toEqual([])
    })

    it('should handle HTTP errors when loading posts', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server Error' }),
      } as Response)

      const { result } = renderHook(() => useFeedStore())
      
      await act(async () => {
        await result.current.loadPosts()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe('Failed to load posts')
      expect(result.current.posts).toEqual([])
    })
  })

  describe('Load More Posts', () => {
    it('should append new posts when loading more', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      
      // First call - initial posts
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ posts: [mockPosts[0]], hasMore: true }),
      } as Response)
      
      // Second call - more posts
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ posts: [mockPosts[1]], hasMore: false }),
      } as Response)

      const { result } = renderHook(() => useFeedStore())
      
      // Load initial posts
      await act(async () => {
        await result.current.loadPosts()
      })

      expect(result.current.posts).toEqual([mockPosts[0]])
      expect(result.current.page).toBe(1)
      expect(result.current.hasMore).toBe(true)

      // Load more posts
      await act(async () => {
        await result.current.loadMorePosts()
      })

      expect(result.current.posts).toEqual(mockPosts)
      expect(result.current.page).toBe(2)
      expect(result.current.hasMore).toBe(false)
    })

    it('should not load more posts when hasMore is false', async () => {
      const { result } = renderHook(() => useFeedStore())
      
      // Set hasMore to false
      act(() => {
        result.current.setHasMore(false)
      })

      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      
      await act(async () => {
        await result.current.loadMorePosts()
      })

      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should not load more posts when already loading', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ posts: mockPosts, hasMore: true }),
          } as Response), 100)
        )
      )

      const { result } = renderHook(() => useFeedStore())
      
      // Start loading
      act(() => {
        result.current.loadPosts()
      })

      expect(result.current.isLoading).toBe(true)

      // Try to load more while already loading
      await act(async () => {
        await result.current.loadMorePosts()
      })

      // Should only be called once (from loadPosts)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Adding Posts', () => {
    it('should add a new post to the beginning of the list', () => {
      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      const newPost = {
        id: 'post-3',
        content: 'New test post',
        imageUrl: null,
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-03'),
        authorId: 'author-3',
        likes: [],
        comments: [],
        author: {
          id: 'author-3',
          username: 'author3',
          name: 'Author Three',
          image: null,
        },
        _count: {
          likes: 0,
          comments: 0,
        },
      }

      act(() => {
        result.current.addPost(newPost)
      })

      expect(result.current.posts[0]).toEqual(newPost)
      expect(result.current.posts.length).toBe(3)
    })
  })

  describe('Updating Posts', () => {
    it('should update an existing post', () => {
      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      const updatedPost = {
        ...mockPosts[0],
        content: 'Updated post content',
        updatedAt: new Date('2023-01-04'),
      }

      act(() => {
        result.current.updatePost('post-1', updatedPost)
      })

      expect(result.current.posts[0].content).toBe('Updated post content')
      expect(result.current.posts[0].updatedAt).toEqual(new Date('2023-01-04'))
    })

    it('should not update non-existent post', () => {
      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      const originalPosts = [...result.current.posts]

      act(() => {
        result.current.updatePost('non-existent', { content: 'Updated' })
      })

      expect(result.current.posts).toEqual(originalPosts)
    })
  })

  describe('Removing Posts', () => {
    it('should remove a post from the list', () => {
      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      act(() => {
        result.current.removePost('post-1')
      })

      expect(result.current.posts.length).toBe(1)
      expect(result.current.posts[0].id).toBe('post-2')
    })

    it('should not affect the list when removing non-existent post', () => {
      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      const originalLength = result.current.posts.length

      act(() => {
        result.current.removePost('non-existent')
      })

      expect(result.current.posts.length).toBe(originalLength)
    })
  })

  describe('Like/Unlike Posts', () => {
    it('should toggle like status and update count', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)

      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      await act(async () => {
        await result.current.toggleLike('post-1', false) // Currently not liked
      })

      expect(result.current.posts[0]._count.likes).toBe(6) // Increased by 1
      expect(mockFetch).toHaveBeenCalledWith('/api/posts/post-1/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })

    it('should handle unlike when post is already liked', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)

      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      await act(async () => {
        await result.current.toggleLike('post-1', true) // Currently liked
      })

      expect(result.current.posts[0]._count.likes).toBe(4) // Decreased by 1
      expect(mockFetch).toHaveBeenCalledWith('/api/posts/post-1/like', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })

    it('should handle API errors when toggling like', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValue(new Error('API Error'))

      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      const originalLikeCount = result.current.posts[0]._count.likes

      await act(async () => {
        await result.current.toggleLike('post-1', false)
      })

      // Like count should be reverted on error
      expect(result.current.posts[0]._count.likes).toBe(originalLikeCount)
    })
  })

  describe('Refresh Posts', () => {
    it('should refresh posts and reset pagination', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ posts: mockPosts, hasMore: true }),
      } as Response)

      const { result } = renderHook(() => useFeedStore())
      
      // Set some state
      act(() => {
        result.current.setPage(3)
        result.current.setHasMore(false)
        result.current.setPosts([mockPosts[0]])
      })

      await act(async () => {
        await result.current.refreshPosts()
      })

      expect(result.current.page).toBe(1)
      expect(result.current.hasMore).toBe(true)
      expect(result.current.posts).toEqual(mockPosts)
      expect(result.current.error).toBeNull()
    })
  })

  describe('Error Handling', () => {
    it('should clear error when loading posts successfully', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      
      const { result } = renderHook(() => useFeedStore())
      
      // Set an error first
      act(() => {
        result.current.setError('Previous error')
      })

      expect(result.current.error).toBe('Previous error')

      // Now load posts successfully
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ posts: mockPosts, hasMore: true }),
      } as Response)

      await act(async () => {
        await result.current.loadPosts()
      })

      expect(result.current.error).toBeNull()
    })

    it('should set error when API call fails', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useFeedStore())
      
      await act(async () => {
        await result.current.loadPosts()
      })

      expect(result.current.error).toBe('Failed to load posts')
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Reset Store', () => {
    it('should reset store to initial state', () => {
      const { result } = renderHook(() => useFeedStore())
      
      // Set some state
      act(() => {
        result.current.setPosts(mockPosts)
        result.current.setPage(3)
        result.current.setHasMore(false)
        result.current.setError('Some error')
        result.current.setLoading(true)
      })

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.posts).toEqual([])
      expect(result.current.page).toBe(1)
      expect(result.current.hasMore).toBe(true)
      expect(result.current.error).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('Optimistic Updates', () => {
    it('should optimistically update like count and revert on error', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      
      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      const originalLikeCount = result.current.posts[0]._count.likes

      // Mock API failure
      mockFetch.mockRejectedValue(new Error('API Error'))

      await act(async () => {
        await result.current.toggleLike('post-1', false)
      })

      // Should revert to original count on error
      expect(result.current.posts[0]._count.likes).toBe(originalLikeCount)
    })
  })

  describe('Concurrent Operations', () => {
    it('should handle concurrent like operations correctly', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)

      const { result } = renderHook(() => useFeedStore())
      
      // Set initial posts
      act(() => {
        result.current.setPosts(mockPosts)
      })

      // Trigger multiple like operations concurrently
      await act(async () => {
        await Promise.all([
          result.current.toggleLike('post-1', false),
          result.current.toggleLike('post-2', false),
        ])
      })

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result.current.posts[0]._count.likes).toBe(6) // Original 5 + 1
      expect(result.current.posts[1]._count.likes).toBe(11) // Original 10 + 1
    })
  })
})