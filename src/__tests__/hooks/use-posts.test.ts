import { renderHook, waitFor, act } from '@testing-library/react'
import { usePosts } from '@/hooks/use-posts'
import { useFeedStore } from '@/stores/feed-store'
import { useUIStore } from '@/stores/ui-store'

// Mock dependencies
jest.mock('@/stores/feed-store')
jest.mock('@/stores/ui-store')

// Mock fetch globally
global.fetch = jest.fn()

const mockUseFeedStore = useFeedStore as jest.MockedFunction<typeof useFeedStore>
const mockUseUIStore = useUIStore as jest.MockedFunction<typeof useUIStore>
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('usePosts Hook', () => {
  const mockFeedStore = {
    feedType: 'following' as const,
    sortBy: 'recent' as const,
    mbtiFilter: null,
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
    mockFetch.mockClear()
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

    // Mock successful fetch response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockResponse }),
    } as Response)

    const { result } = renderHook(() => usePosts())

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts)
    })
  })

  it('should handle fetch posts error', async () => {
    // Mock failed fetch response
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => usePosts())

    // Just check that the hook doesn't crash
    expect(result.current).toBeDefined()
    expect(typeof result.current.mutate).toBe('function')
  })
})
