import { renderHook, waitFor } from '@testing-library/react'
import { useComments } from '@/hooks/use-comments'
import useSWR from 'swr'

// Mock SWR
jest.mock('swr')

const mockComments = [
  {
    id: 'comment-1',
    content: 'First comment',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    author: {
      id: 'user-1',
      name: 'User 1',
      username: 'user1',
      image: null,
    },
  },
  {
    id: 'comment-2',
    content: 'Second comment',
    createdAt: new Date('2024-01-01T11:00:00Z'),
    author: {
      id: 'user-2',
      name: 'User 2',
      username: 'user2',
      image: null,
    },
  },
]

describe('useComments', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('should fetch comments for a post', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { comments: mockComments, total: 2 },
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useComments('post-1'))

    expect(result.current.comments).toEqual(mockComments)
    expect(result.current.total).toBe(2)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle loading state', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useComments('post-1'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.comments).toEqual([])
  })

  it('should handle error state', () => {
    const error = new Error('Failed to fetch comments')
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useComments('post-1'))

    expect(result.current.error).toBe(error)
    expect(result.current.comments).toEqual([])
  })

  it('should create a new comment', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { comments: mockComments, total: 2 },
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          id: 'comment-3',
          content: 'New comment',
          createdAt: new Date(),
          author: { id: 'user-3', name: 'User 3', username: 'user3' },
        },
      }),
    })

    const { result } = renderHook(() => useComments('post-1'))

    await waitFor(async () => {
      await result.current.createComment('New comment')
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/posts/post-1/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'New comment' }),
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should handle comment creation error', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { comments: mockComments, total: 2 },
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useComments('post-1'))

    await expect(result.current.createComment('New comment')).rejects.toThrow('Network error')
  })

  it('should delete a comment', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { comments: mockComments, total: 2 },
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    const { result } = renderHook(() => useComments('post-1'))

    await waitFor(async () => {
      await result.current.deleteComment('comment-1')
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/posts/post-1/comments/comment-1', {
      method: 'DELETE',
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should handle comment deletion error', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { comments: mockComments, total: 2 },
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useComments('post-1'))

    await expect(result.current.deleteComment('comment-1')).rejects.toThrow('Network error')
  })

  it('should not fetch when postId is not provided', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useComments(null))

    expect(result.current.comments).toEqual([])
    expect(result.current.total).toBe(0)
  })

  it('should refresh comments', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { comments: mockComments, total: 2 },
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    const { result } = renderHook(() => useComments('post-1'))

    await result.current.refresh()

    expect(mockMutate).toHaveBeenCalled()
  })
})
