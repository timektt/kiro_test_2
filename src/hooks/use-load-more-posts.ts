import { useState, useCallback } from 'react'

export interface LoadMorePostsParams {
  page?: number
  limit?: number
  type?: 'discover' | 'following' | 'trending'
  sort?: 'latest' | 'popular' | 'trending'
  mbti?: string
  search?: string
}

export interface LoadMorePostsResponse {
  posts: any[]
  pagination: {
    hasMore: boolean
    currentPage: number
    totalPages: number
  }
}

export interface UseLoadMorePostsReturn {
  isLoading: boolean
  error: string | null
  loadMorePosts: (params: LoadMorePostsParams) => Promise<LoadMorePostsResponse>
  retryCount: number
}

export function useLoadMorePosts(): UseLoadMorePostsReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount] = useState(0)

  const loadMorePosts = useCallback(async (params: LoadMorePostsParams): Promise<LoadMorePostsResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.type) queryParams.append('type', params.type)
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.mbti) queryParams.append('mbti', params.mbti)
      if (params.search) queryParams.append('search', params.search)

      const url = `/api/posts?${queryParams.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      const result: LoadMorePostsResponse = {
        posts: data.posts || [],
        pagination: {
          hasMore: data.pagination?.hasMore ?? false,
          currentPage: data.pagination?.currentPage ?? 1,
          totalPages: data.pagination?.totalPages ?? 1,
        }
      }

      setIsLoading(false)
      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load posts'
      setError(errorMessage)
      setIsLoading(false)
      throw err
    }
  }, [])

  return {
    isLoading,
    error,
    loadMorePosts,
    retryCount,
  }
}
