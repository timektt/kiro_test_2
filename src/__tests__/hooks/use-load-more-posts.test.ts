import { renderHook, waitFor } from '@testing-library/react'
import { act } from 'react'
import { useLoadMorePosts } from '@/hooks/use-load-more-posts'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock AbortController
global.AbortController = jest.fn(() => ({
  abort: jest.fn(),
  signal: { aborted: false }
}))

describe('useLoadMorePosts', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    jest.clearAllTimers()
  })

  it('should return hook functions', () => {
    const { result } = renderHook(() => useLoadMorePosts())
    
    expect(result.current).toHaveProperty('loadMorePosts')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
    expect(result.current).toHaveProperty('retryCount')
    expect(typeof result.current.loadMorePosts).toBe('function')
  })

  it('should load more posts successfully', async () => {
    const mockResponse = {
      posts: [
        { id: '3', title: 'Post 3', content: 'Content 3' },
        { id: '4', title: 'Post 4', content: 'Content 4' },
      ],
      pagination: {
        page: 2,
        limit: 10,
        total: 20,
        hasMore: true,
      },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const { result } = renderHook(() => useLoadMorePosts())

    await act(async () => {
      const response = await result.current.loadMorePosts({
        page: 2,
        limit: 10,
        type: 'discover',
        sort: 'recent',
      })
      expect(response.posts).toEqual(mockResponse.posts)
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/posts?page=2&limit=10&type=discover&sort=recent',
      expect.objectContaining({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    )
  })

  it('should handle API errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useLoadMorePosts())

    await act(async () => {
      await expect(
        result.current.loadMorePosts({
          page: 1,
          limit: 10,
        })
      ).rejects.toThrow('Network error')
    })
  })

  it('should build correct query parameters', async () => {
    const mockResponse = {
      posts: [],
      pagination: { hasMore: false, currentPage: 3, totalPages: 5 },
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const { result } = renderHook(() => useLoadMorePosts())

    await act(async () => {
      await result.current.loadMorePosts({
        page: 3,
        limit: 20,
        type: 'following',
        sort: 'popular',
        mbti: 'INTJ',
        search: 'test query',
      })
    })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/posts?page=3&limit=20&type=following&sort=popular&mbti=INTJ&search=test+query',
      expect.objectContaining({
        method: 'GET',
      })
    )
  })
})
