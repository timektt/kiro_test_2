import { renderHook, waitFor, act } from '@testing-library/react'
import { usePosts } from '@/hooks/use-posts'
import { useApi } from '@/hooks/use-api'
import { useFeedStore } from '@/stores/feed-store'
import { useUIStore } from '@/stores/ui-store'

// Mock dependencies
jest.mock('@/hooks/use-api')
jest.mock('@/stores/feed-store')
jest.mock('@/stores/ui-store')

const mockUseApi = useApi as jest.MockedFunction<typeof useApi>
const mockUseFeedStore = useFeedStore as jest.MockedFunction<typeof useFeedStore>
const mockUseUIStore = useUIStore as jest.MockedFunction<typeof useUIStore>

describe('usePosts Hook', () => {
  const mockApiGet = jest.fn()
  const mockApiPost = jest.fn()
  const mockApiPut = jest.fn()
  const mockApiDelete = jest.fn()

  const mockFeedStore = {
    posts: [],
    loading: false,
    error: null,
    hasMore: true,
    feedType: 'following' as const,
    lastFetch: Date.now(),
    optimisticUpdates: new Map(),
    setPosts: jest.fn(),
    addPost: jest.fn(),
    updatePost: jest.fn(),
    removePost: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setHasMore: jest.fn(),
    setFeedType: jest.fn(),
    loadMorePosts: jest.fn(),
    refreshFeed: jest.fn(),
    addOptimisticUpdate: jest.fn(),
    removeOptimisticUpdate: jest.fn(),
    clearOptimisticUpdates: jest.fn(),
  }

  const mockUIStore = {
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
    mockUseApi.mockReturnValue({
      get: mockApiGet,
      post: mockApiPost,
      put: mockApiPut,
      delete: mockApiDelete,
    })
    mockUseFeedStore.mockReturnValue(mockFeedStore)
    mockUseUIStore.mockReturnValue(mockUIStore)
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePosts())

    expect(result.current).toBeDefined()
    expect(result.current.posts).toEqual([])
    expect(result.current.pagination).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })

  it('should fetch posts successfully', async () => {
    const mockPosts = [
      {
        id: 'post-1',
        content: 'Test post',
        author: { id: '1', username: 'user1', name: 'User 1' },
        createdAt: new Date().toISOString(),
        _count: { likes: 0, comments: 0 },
        isLiked: false,
      },
    ]

    const mockResponse = {
      posts: mockPosts,
      pagination: { page: 1, limit: 20, total: 1, hasMore: false },
    }

    // Mock the SWR response
    mockUseApi.mockReturnValue({
      data: mockResponse,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => usePosts())

    expect(result.current.posts).toEqual(mockPosts)
    expect(result.current.pagination).toEqual(mockResponse.pagination)
  })

  it('should handle fetch posts error', async () => {
    const errorMessage = 'Failed to fetch posts'
    
    mockUseApi.mockReturnValue({
      data: null,
      error: new Error(errorMessage),
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => usePosts())

    expect(result.current.error).toEqual(new Error(errorMessage))
    expect(mockUIStore.addToast).toHaveBeenCalledWith({
      type: 'error',
      title: 'Failed to load posts',
      description: errorMessage,
    })
  })
})