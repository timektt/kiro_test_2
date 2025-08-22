import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { RealTimeFeed } from '@/components/feed/real-time-feed'
import useSWR from 'swr'

// Mock dependencies
jest.mock('next-auth/react')
jest.mock('swr')

const mockSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
  },
}

const mockPosts = [
  {
    id: 'post-1',
    content: 'Test post 1',
    imageUrl: null,
    authorId: 'user-1',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: 'user-1',
      username: 'testuser',
      name: 'Test User',
      image: null,
      mbti: { type: 'INTJ' },
    },
    _count: {
      likes: 5,
      comments: 3,
    },
  },
  {
    id: 'post-2',
    content: 'Test post 2',
    imageUrl: null,
    authorId: 'user-2',
    isPublic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: {
      id: 'user-2',
      username: 'testuser2',
      name: 'Test User 2',
      image: null,
      mbti: { type: 'ENFP' },
    },
    _count: {
      likes: 2,
      comments: 1,
    },
  },
]

const mockFeedData = {
  posts: mockPosts,
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    hasMore: false,
  },
}

describe('RealTimeFeed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
  })

  it('should render posts correctly', async () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockFeedData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<RealTimeFeed />)

    await waitFor(() => {
      expect(screen.getByText('Test post 1')).toBeInTheDocument()
      expect(screen.getByText('Test post 2')).toBeInTheDocument()
    })
  })

  it('should show loading state', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      mutate: jest.fn(),
    })

    render(<RealTimeFeed />)

    expect(screen.getByTestId('loading-feed')).toBeInTheDocument()
  })

  it('should show error state', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: new Error('Failed to fetch'),
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<RealTimeFeed />)

    expect(screen.getByText('Error Loading Feed')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
  })

  it('should show empty state when no posts', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { ...mockFeedData, posts: [] },
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<RealTimeFeed />)

    expect(screen.getByText('No posts found')).toBeInTheDocument()
  })

  it('should show authentication required when not logged in', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: null, 
      status: 'unauthenticated',
      update: jest.fn()
    })

    render(<RealTimeFeed />)

    expect(screen.getByText('Authentication Required')).toBeInTheDocument()
    expect(screen.getByText('Please sign in to view the feed')).toBeInTheDocument()
  })

  it('should handle filter changes', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockFeedData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    render(<RealTimeFeed />)

    // Find and click the following filter
    const followingButton = screen.getByText('Following')
    fireEvent.click(followingButton)

    // Should trigger a new SWR call with following=true
    await waitFor(() => {
      expect(useSWR).toHaveBeenCalledWith(
        '/api/posts?page=1&limit=10&following=true',
        expect.any(Function),
        expect.any(Object)
      )
    })
  })

  it('should handle refresh', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockFeedData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    render(<RealTimeFeed />)

    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should show load more button when hasMore is true', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: {
        ...mockFeedData,
        pagination: { ...mockFeedData.pagination, hasMore: true },
      },
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<RealTimeFeed />)

    expect(screen.getByText('Load More Posts')).toBeInTheDocument()
    expect(screen.getByText('Showing 2 of 2 posts')).toBeInTheDocument()
  })

  it('should handle post creation', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: mockPosts[0],
      }),
    })

    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockFeedData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    render(<RealTimeFeed />)

    // Find post composer and create a post
    const textarea = screen.getByPlaceholderText(/what's on your mind/i)
    fireEvent.change(textarea, { target: { value: 'New test post' } })

    const submitButton = screen.getByRole('button', { name: /post/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: 'New test post',
          imageUrl: undefined,
        }),
      })
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should handle like action', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { likeCount: 6 },
      }),
    })

    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockFeedData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    render(<RealTimeFeed />)

    // Find and click like button
    const likeButtons = screen.getAllByRole('button', { name: /like/i })
    fireEvent.click(likeButtons[0])

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/posts/post-1/like', {
        method: 'POST',
      })
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should handle share action', async () => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockFeedData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<RealTimeFeed />)

    // Find and click share button
    const shareButtons = screen.getAllByRole('button', { name: /share/i })
    fireEvent.click(shareButtons[0])

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'http://localhost/post/post-1'
      )
    })
  })

  it('should filter posts by user when userId prop is provided', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockFeedData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<RealTimeFeed userId="user-1" />)

    expect(useSWR).toHaveBeenCalledWith(
      '/api/posts?page=1&limit=10&userId=user-1',
      expect.any(Function),
      expect.any(Object)
    )
  })

  it('should not show post composer on user-specific feeds', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockFeedData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<RealTimeFeed userId="user-1" />)

    expect(screen.queryByPlaceholderText(/what's on your mind/i)).not.toBeInTheDocument()
  })
})

