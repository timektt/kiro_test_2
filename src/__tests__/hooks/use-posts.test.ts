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

  describe('fetchPosts', () => {
    it('should fetch posts successfully', async () => {
      const mockResponse = {
        success: true,
        posts: mockPosts,
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          hasMore: false,
        },
      }

      mockApiGet.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => usePosts())

      await act(async () => {
        await result.current.fetchPosts()
      })

      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {
        params: {
          page: 1,
          limit: 20,
          type: 'following',
        },
      })

      expect(mockFeedStore.setPosts).toHaveBeenCalledWith(mockPosts)
      expect(mockFeedStore.setHasMore).toHaveBeenCalledWith(false)
      expect(mockFeedStore.setLoading).toHaveBeenCalledWith(false)
    })

    it('should handle fetch posts error', async () => {
      const errorMessage = 'Failed to fetch posts'
      mockApiGet.mockRejectedValue(new Error(errorMessage))

      const { result } = renderHook(() => usePosts())

      await act(async () => {
        await result.current.fetchPosts()
      })

      expect(mockFeedStore.setError).toHaveBeenCalledWith(errorMessage)
      expect(mockFeedStore.setLoading).toHaveBeenCalledWith(false)
    })

    it('should fetch posts with custom parameters', async () => {
      const mockResponse = {
        success: true,
        posts: mockPosts,
        pagination: { page: 2, limit: 10, total: 20, hasMore: true },
      }

      mockApiGet.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => usePosts())

      await act(async () => {
        await result.current.fetchPosts({ page: 2, limit: 10, type: 'discover' })
      })

      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {
        params: {
          page: 2,
          limit: 10,
          type: 'discover',
        },
      })
    })
  })

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const postData = {
        content: 'New test post',
        imageUrl: 'https://example.com/new-image.jpg',
      }

      const mockCreatedPost = {
        id: 'post-3',
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true,
        author: {
          id: 'current-user',
          username: 'currentuser',
          name: 'Current User',
          image: null,
        },
        _count: {
          likes: 0,
          comments: 0,
        },
        isLiked: false,
      }

      const mockResponse = {
        success: true,
        post: mockCreatedPost,
      }

      mockApiPost.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => usePosts())

      await act(async () => {
        await result.current.createPost(postData)
      })

      expect(mockApiPost).toHaveBeenCalledWith('/api/posts', postData)
      expect(mockFeedStore.addPost).toHaveBeenCalledWith(mockCreatedPost)
      expect(mockUIStore.addToast).toHaveBeenCalledWith({
        type: 'success',\n        title: 'Post created',\n        description: 'Your post has been published successfully.',\n      })\n    })\n\n    it('should handle create post error', async () => {\n      const postData = {\n        content: 'New test post',\n      }\n\n      const errorMessage = 'Failed to create post'\n      mockApiPost.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.createPost(postData)\n      })\n\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n\n    it('should validate post data before creating', async () => {\n      const invalidPostData = {\n        content: '', // Empty content\n      }\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.createPost(invalidPostData)\n      })\n\n      expect(mockApiPost).not.toHaveBeenCalled()\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Validation Error',\n        description: 'Post content is required.',\n      })\n    })\n  })\n\n  describe('updatePost', () => {\n    it('should update a post successfully', async () => {\n      const postId = 'post-1'\n      const updateData = {\n        content: 'Updated post content',\n      }\n\n      const mockUpdatedPost = {\n        ...mockPosts[0],\n        ...updateData,\n        updatedAt: new Date().toISOString(),\n      }\n\n      const mockResponse = {\n        success: true,\n        post: mockUpdatedPost,\n      }\n\n      mockApiPut.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.updatePost(postId, updateData)\n      })\n\n      expect(mockApiPut).toHaveBeenCalledWith(`/api/posts/${postId}`, updateData)\n      expect(mockFeedStore.updatePost).toHaveBeenCalledWith(mockUpdatedPost)\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'success',\n        title: 'Post updated',\n        description: 'Your post has been updated successfully.',\n      })\n    })\n\n    it('should handle update post error', async () => {\n      const postId = 'post-1'\n      const updateData = { content: 'Updated content' }\n      const errorMessage = 'Failed to update post'\n\n      mockApiPut.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.updatePost(postId, updateData)\n      })\n\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n  })\n\n  describe('deletePost', () => {\n    it('should delete a post successfully', async () => {\n      const postId = 'post-1'\n      const mockResponse = {\n        success: true,\n        message: 'Post deleted successfully',\n      }\n\n      mockApiDelete.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.deletePost(postId)\n      })\n\n      expect(mockApiDelete).toHaveBeenCalledWith(`/api/posts/${postId}`)\n      expect(mockFeedStore.removePost).toHaveBeenCalledWith(postId)\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'success',\n        title: 'Post deleted',\n        description: 'Your post has been deleted successfully.',\n      })\n    })\n\n    it('should handle delete post error', async () => {\n      const postId = 'post-1'\n      const errorMessage = 'Failed to delete post'\n\n      mockApiDelete.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.deletePost(postId)\n      })\n\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n  })\n\n  describe('likePost', () => {\n    it('should like a post successfully', async () => {\n      const postId = 'post-1'\n      const mockResponse = {\n        success: true,\n        liked: true,\n      }\n\n      mockApiPost.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.likePost(postId)\n      })\n\n      expect(mockApiPost).toHaveBeenCalledWith(`/api/posts/${postId}/like`)\n      expect(mockFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(postId, {\n        type: 'like',\n        isLiked: true,\n        timestamp: expect.any(Number),\n      })\n    })\n\n    it('should unlike a post successfully', async () => {\n      const postId = 'post-2' // This post is already liked\n      const mockResponse = {\n        success: true,\n        liked: false,\n      }\n\n      mockApiDelete.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.likePost(postId)\n      })\n\n      expect(mockApiDelete).toHaveBeenCalledWith(`/api/posts/${postId}/like`)\n      expect(mockFeedStore.addOptimisticUpdate).toHaveBeenCalledWith(postId, {\n        type: 'like',\n        isLiked: false,\n        timestamp: expect.any(Number),\n      })\n    })\n\n    it('should handle like post error', async () => {\n      const postId = 'post-1'\n      const errorMessage = 'Failed to like post'\n\n      mockApiPost.mockRejectedValue(new Error(errorMessage))\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.likePost(postId)\n      })\n\n      expect(mockFeedStore.removeOptimisticUpdate).toHaveBeenCalledWith(postId)\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Error',\n        description: errorMessage,\n      })\n    })\n  })\n\n  describe('loadMorePosts', () => {\n    it('should load more posts successfully', async () => {\n      const existingPosts = [mockPosts[0]]\n      const newPosts = [mockPosts[1]]\n      \n      mockUseFeedStore.mockReturnValue({\n        ...mockFeedStore,\n        posts: existingPosts,\n      })\n\n      const mockResponse = {\n        success: true,\n        posts: newPosts,\n        pagination: {\n          page: 2,\n          limit: 20,\n          total: 2,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.loadMorePosts()\n      })\n\n      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {\n        params: {\n          page: 2,\n          limit: 20,\n          type: 'following',\n        },\n      })\n\n      expect(mockFeedStore.setPosts).toHaveBeenCalledWith([...existingPosts, ...newPosts])\n      expect(mockFeedStore.setHasMore).toHaveBeenCalledWith(false)\n    })\n\n    it('should not load more when no more posts available', async () => {\n      mockUseFeedStore.mockReturnValue({\n        ...mockFeedStore,\n        hasMore: false,\n      })\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.loadMorePosts()\n      })\n\n      expect(mockApiGet).not.toHaveBeenCalled()\n    })\n\n    it('should not load more when already loading', async () => {\n      mockUseFeedStore.mockReturnValue({\n        ...mockFeedStore,\n        loading: true,\n      })\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.loadMorePosts()\n      })\n\n      expect(mockApiGet).not.toHaveBeenCalled()\n    })\n  })\n\n  describe('refreshPosts', () => {\n    it('should refresh posts successfully', async () => {\n      const mockResponse = {\n        success: true,\n        posts: mockPosts,\n        pagination: {\n          page: 1,\n          limit: 20,\n          total: 2,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.refreshPosts()\n      })\n\n      expect(mockFeedStore.setError).toHaveBeenCalledWith(null)\n      expect(mockFeedStore.clearOptimisticUpdates).toHaveBeenCalled()\n      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {\n        params: {\n          page: 1,\n          limit: 20,\n          type: 'following',\n        },\n      })\n    })\n  })\n\n  describe('changeFeedType', () => {\n    it('should change feed type and refresh posts', async () => {\n      const mockResponse = {\n        success: true,\n        posts: mockPosts,\n        pagination: {\n          page: 1,\n          limit: 20,\n          total: 2,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.changeFeedType('discover')\n      })\n\n      expect(mockFeedStore.setFeedType).toHaveBeenCalledWith('discover')\n      expect(mockFeedStore.setPosts).toHaveBeenCalledWith([])\n      expect(mockApiGet).toHaveBeenCalledWith('/api/posts', {\n        params: {\n          page: 1,\n          limit: 20,\n          type: 'discover',\n        },\n      })\n    })\n  })\n\n  describe('Edge Cases and Error Handling', () => {\n    it('should handle network errors gracefully', async () => {\n      const networkError = new Error('Network error')\n      networkError.name = 'NetworkError'\n      \n      mockApiGet.mockRejectedValue(networkError)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      expect(mockFeedStore.setError).toHaveBeenCalledWith('Network error')\n      expect(mockUIStore.addToast).toHaveBeenCalledWith({\n        type: 'error',\n        title: 'Network Error',\n        description: 'Please check your internet connection and try again.',\n      })\n    })\n\n    it('should handle API response without posts array', async () => {\n      const mockResponse = {\n        success: true,\n        // Missing posts array\n        pagination: {\n          page: 1,\n          limit: 20,\n          total: 0,\n          hasMore: false,\n        },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      expect(mockFeedStore.setPosts).toHaveBeenCalledWith([])\n    })\n\n    it('should handle malformed API responses', async () => {\n      const malformedResponse = {\n        // Missing success field and other required fields\n        data: 'invalid',\n      }\n\n      mockApiGet.mockResolvedValue(malformedResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      expect(mockFeedStore.setError).toHaveBeenCalledWith('Invalid response format')\n    })\n  })\n\n  describe('Performance and Optimization', () => {\n    it('should debounce rapid successive calls', async () => {\n      const mockResponse = {\n        success: true,\n        posts: mockPosts,\n        pagination: { page: 1, limit: 20, total: 2, hasMore: false },\n      }\n\n      mockApiGet.mockResolvedValue(mockResponse)\n\n      const { result } = renderHook(() => usePosts())\n\n      // Make multiple rapid calls\n      await act(async () => {\n        result.current.fetchPosts()\n        result.current.fetchPosts()\n        result.current.fetchPosts()\n      })\n\n      // Should only make one API call due to debouncing\n      expect(mockApiGet).toHaveBeenCalledTimes(1)\n    })\n\n    it('should cancel previous requests when new ones are made', async () => {\n      const { result } = renderHook(() => usePosts())\n\n      // Start first request\n      act(() => {\n        result.current.fetchPosts()\n      })\n\n      // Start second request before first completes\n      await act(async () => {\n        await result.current.fetchPosts()\n      })\n\n      // Should handle request cancellation gracefully\n      expect(mockFeedStore.setLoading).toHaveBeenCalledWith(false)\n    })\n  })\n})"