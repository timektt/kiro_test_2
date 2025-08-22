import React from 'react'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { EnhancedInteractiveFeed } from '@/components/feed/enhanced-interactive-feed'
import { useFeedStore } from '@/stores/feed-store'
import { useUIStore } from '@/stores/ui-store'
import { useSession } from 'next-auth/react'
import { usePosts, useCreatePost, useLikePost } from '@/hooks/use-posts'

// Mock dependencies
jest.mock('@/stores/feed-store')
jest.mock('@/stores/ui-store')
jest.mock('next-auth/react')
jest.mock('@/hooks/use-posts', () => ({
  usePosts: jest.fn(),
  useCreatePost: jest.fn(),
  useLikePost: jest.fn(),
}))

const mockUseFeedStore = useFeedStore as jest.MockedFunction<typeof useFeedStore>
const mockUseUIStore = useUIStore as jest.MockedFunction<typeof useUIStore>
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockUsePosts = usePosts as jest.MockedFunction<typeof usePosts>
const mockUseCreatePost = useCreatePost as jest.MockedFunction<typeof useCreatePost>
const mockUseLikePost = useLikePost as jest.MockedFunction<typeof useLikePost>

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

describe('EnhancedInteractiveFeed', () => {
  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
  }

  const mockSession = {
    user: { ...mockUser, role: 'USER' },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }

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
  ]

  const defaultFeedStore = {
    feedType: 'following' as const,
    sortBy: 'recent' as const,
    mbtiFilter: null,
    optimisticPosts: [],
    setFeedType: jest.fn(),
    setSortBy: jest.fn(),
    setMbtiFilter: jest.fn(),
    addOptimisticPost: jest.fn(),
    removeOptimisticPost: jest.fn(),
    clearOptimisticPosts: jest.fn(),
  }

  const defaultUIStore = {
    sidebarOpen: false,
    mobileMenuOpen: false,
    postComposerOpen: false,
    profileEditOpen: false,
    isLoading: false,
    loadingMessage: '',
    searchQuery: '',
    searchResults: [],
    searchLoading: false,
    toasts: [],
    setSidebarOpen: jest.fn(),
    setMobileMenuOpen: jest.fn(),
    setPostComposerOpen: jest.fn(),
    setProfileEditOpen: jest.fn(),
    setLoading: jest.fn(),
    addToast: jest.fn(),
    removeToast: jest.fn(),
    setSearchQuery: jest.fn(),
    setSearchResults: jest.fn(),
    setSearchLoading: jest.fn(),
    clearSearch: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    mockUseFeedStore.mockReturnValue(defaultFeedStore)
    mockUseUIStore.mockReturnValue(defaultUIStore)
    mockUsePosts.mockReturnValue({
      posts: mockPosts,
      pagination: { page: 1, limit: 20, total: 1, hasMore: false },
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })
    mockUseCreatePost.mockReturnValue({
      createPost: jest.fn(),
      isCreating: false,
    })
    mockUseLikePost.mockReturnValue({
      toggleLike: jest.fn(),
      isToggling: false,
    })
  })

  it('should render feed with posts', async () => {
    render(<EnhancedInteractiveFeed currentUserId="user-123" />)

    await waitFor(() => {
      expect(screen.getByText('First test post')).toBeInTheDocument()
    })

    expect(screen.getByText('Author One')).toBeInTheDocument()
  })

  it('should display feed controls when authenticated', () => {
    mockUseSession.mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('should display feed controls when unauthenticated', () => {
    mockUseSession.mockReturnValue({ 
      data: null, 
      status: 'unauthenticated',
      update: jest.fn()
    })
    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('should show Load More button when hasMore is true', () => {
    mockUsePosts.mockReturnValue({
      posts: mockPosts,
      pagination: { page: 1, limit: 20, total: 50, hasMore: true },
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })

    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    expect(screen.getByText('Load More')).toBeInTheDocument()
  })

  it('should hide Load More button when hasMore is false', () => {
    mockUsePosts.mockReturnValue({
      posts: mockPosts,
      pagination: { page: 1, limit: 20, total: 1, hasMore: false },
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })

    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    expect(screen.queryByText('Load More')).not.toBeInTheDocument()
  })

  it('should show loading state when posts are loading', () => {
    mockUsePosts.mockReturnValue({
      posts: [],
      pagination: { page: 1, limit: 20, total: 0, hasMore: false },
      isLoading: true,
      error: null,
      mutate: jest.fn(),
    })

    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should handle search functionality', async () => {
    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    
    const searchInput = screen.getByPlaceholderText('Search posts...')
    
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test query' } })
    })

    expect(searchInput).toHaveValue('test query')
  })

  it('should use virtualization for large datasets', () => {
    const largePosts = Array.from({ length: 150 }, (_, i) => ({
      ...mockPosts[0],
      id: `post-${i}`,
      content: `Test post ${i}`,
    }))

    mockUsePosts.mockReturnValue({
      posts: largePosts,
      pagination: { page: 1, limit: 20, total: 150, hasMore: true },
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })

    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    
    // Should render with virtualization for large datasets
    expect(screen.getByText('Test post 0')).toBeInTheDocument()
  })

  it('should handle infinite scroll mode', () => {
    mockUsePosts.mockReturnValue({
      posts: mockPosts,
      pagination: { page: 1, limit: 20, total: 50, hasMore: true },
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })

    // Mock the feed store to enable infinite scroll
    mockUseFeedStore.mockReturnValue({
      ...defaultFeedStore,
      infiniteScroll: true,
    })

    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    
    // Should not show Load More button in infinite scroll mode
    expect(screen.queryByText('Load More')).not.toBeInTheDocument()
  })

  it('should show performance warning for large datasets in development', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    
    const largePosts = Array.from({ length: 1500 }, (_, i) => ({
      ...mockPosts[0],
      id: `post-${i}`,
    }))

    mockUsePosts.mockReturnValue({
      posts: largePosts,
      pagination: { page: 1, limit: 20, total: 1500, hasMore: true },
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })

    render(<EnhancedInteractiveFeed currentUserId="user-123" />)

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Large dataset detected')
    )
    
    consoleSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })

  it('should handle empty posts state', () => {
    mockUsePosts.mockReturnValue({
      posts: [],
      pagination: { page: 1, limit: 20, total: 0, hasMore: false },
      isLoading: false,
      error: null,
      mutate: jest.fn(),
    })

    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    expect(screen.getByText('No posts found')).toBeInTheDocument()
  })

  it('should handle error state', () => {
    mockUsePosts.mockReturnValue({
      posts: [],
      pagination: { page: 1, limit: 20, total: 0, hasMore: false },
      isLoading: false,
      error: new Error('Failed to load posts'),
      mutate: jest.fn(),
    })

    render(<EnhancedInteractiveFeed currentUserId="user-123" />)
    expect(screen.getByText('Failed to load posts')).toBeInTheDocument()
  })
})
