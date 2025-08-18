import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useFeedStore } from '@/stores/feed-store'
import { useUserStore } from '@/stores/user-store'
import { useUIStore } from '@/stores/ui-store'

// Fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'API Error')
  }
  return result.data
}

// Mutation functions
async function createPost(url: string, { arg }: { arg: { content: string; imageUrl?: string } }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create post')
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to create post')
  }
  
  return result.data
}

async function updatePost(url: string, { arg }: { arg: { content?: string; isPublic?: boolean } }) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update post')
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to update post')
  }
  
  return result.data
}

async function deletePost(url: string) {
  const response = await fetch(url, { method: 'DELETE' })
  
  if (!response.ok) {
    throw new Error('Failed to delete post')
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete post')
  }
  
  return result.data
}

async function toggleLike(url: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to toggle like')
  }

  return response.json()
}

async function toggleBookmark(url: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to toggle bookmark')
  }

  return response.json()
}

async function sharePost(url: string, { arg }: { arg: { platform?: string; message?: string } }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  })

  if (!response.ok) {
    throw new Error('Failed to share post')
  }

  return response.json()
}

// Hook for fetching posts feed with pagination support
export function usePosts(params?: {
  type?: 'following' | 'discover' | 'trending'
  sort?: 'recent' | 'popular'
  mbti?: string
  page?: number
  limit?: number
}) {
  const { feedType, sortBy, mbtiFilter } = useFeedStore()
  const { addToast } = useUIStore()
  
  // Build query parameters
  const queryParams = new URLSearchParams({
    type: params?.type || feedType,
    sort: params?.sort || sortBy,
    page: (params?.page || 1).toString(),
    limit: (params?.limit || 20).toString(),
  })
  
  if (params?.mbti || mbtiFilter) {
    queryParams.append('mbti', params?.mbti || mbtiFilter || '')
  }
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/posts?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to load posts',
          description: error.message,
        })
      },
    }
  )
  
  return {
    posts: data?.posts || [],
    pagination: data?.pagination || { page: 1, limit: 20, total: 0, hasMore: false },
    isLoading,
    error,
    mutate,
  }
}

// Hook for loading more posts with pagination
export function useLoadMorePosts() {
  const { feedType, sortBy, mbtiFilter } = useFeedStore()
  const { addToast } = useUIStore()
  
  const loadMorePosts = async (currentPage: number, currentPosts: any[]) => {
    try {
      const nextPage = currentPage + 1
      const queryParams = new URLSearchParams({
        type: feedType,
        sort: sortBy,
        page: nextPage.toString(),
        limit: '20',
      })
      
      if (mbtiFilter) {
        queryParams.append('mbti', mbtiFilter)
      }
      
      const response = await fetch(`/api/posts?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to load more posts')
      }
      
      const data = await response.json()
      
      return {
        posts: [...currentPosts, ...data.posts],
        pagination: data.pagination,
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to load more posts',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }
  
  return { loadMorePosts }
}

// Hook for fetching a single post
export function usePost(postId: string) {
  const { addToast } = useUIStore()
  
  const { data, error, isLoading, mutate } = useSWR(
    postId ? `/api/posts/${postId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to load post',
          description: error.message,
        })
      },
    }
  )
  
  return {
    post: data,
    isLoading,
    error,
    mutate,
  }
}

// Hook for creating posts with optimistic updates
export function useCreatePost() {
  const { addOptimisticPost, removeOptimisticPost } = useFeedStore()
  const { currentUser } = useUserStore()
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation('/api/posts', createPost, {
    onSuccess: (data) => {
      // Remove optimistic post and add real post
      removeOptimisticPost(data.id)
      addToast({
        type: 'success',
        title: 'Post created successfully',
      })
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Failed to create post',
        description: error.message,
      })
    },
  })
  
  const createPostWithOptimistic = async (content: string, imageUrl?: string) => {
    if (!currentUser) return
    
    // Create optimistic post
    const optimisticPost = {
      id: `temp-${Date.now()}`,
      content,
      imageUrl: imageUrl || null,
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        username: currentUser.username,
        name: currentUser.name,
        image: currentUser.image,
        mbti: currentUser.mbti,
      },
      _count: {
        likes: 0,
        comments: 0,
      },
      isLiked: false,
      isBookmarked: false,
    }
    
    addOptimisticPost(optimisticPost)
    
    try {
      await trigger({ content, imageUrl })
    } catch (error) {
      // Remove optimistic post on error
      removeOptimisticPost(optimisticPost.id)
      throw error
    }
  }
  
  return {
    createPost: createPostWithOptimistic,
    isCreating: isMutating,
  }
}

// Hook for updating posts
export function useUpdatePost(postId: string) {
  const { updatePost: updatePostInStore } = useFeedStore()
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation(
    `/api/posts/${postId}`,
    updatePost,
    {
      onSuccess: (data) => {
        updatePostInStore(postId, data)
        addToast({
          type: 'success',
          title: 'Post updated successfully',
        })
      },
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to update post',
          description: error.message,
        })
      },
    }
  )
  
  return {
    updatePost: trigger,
    isUpdating: isMutating,
  }
}

// Hook for deleting posts
export function useDeletePost() {
  const { removePost } = useFeedStore()
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation(
    '/api/posts',
    (url: string, { arg }: { arg: string }) => deletePost(`${url}/${arg}`),
    {
      onSuccess: (_, key) => {
        const postId = key.split('/').pop()!
        removePost(postId)
        addToast({
          type: 'success',
          title: 'Post deleted successfully',
        })
      },
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to delete post',
          description: error.message,
        })
      },
    }
  )
  
  return {
    deletePost: trigger,
    isDeleting: isMutating,
  }
}

// Hook for toggling likes with optimistic updates
export function useLikePost() {
  const { toggleLike: toggleLikeInStore, setOptimisticLike } = useFeedStore()
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation(
    '/api/posts/like',
    (url: string, { arg }: { arg: string }) => toggleLike(`/api/posts/${arg}/like`),
    {
      onError: (error, key) => {
        // Revert optimistic update on error
        const postId = key.split('/')[2]
        setOptimisticLike(postId, false)
        addToast({
          type: 'error',
          title: 'Failed to update like',
          description: error.message,
        })
      },
    }
  )
  
  const toggleLikeWithOptimistic = async (postId: string) => {
    // Apply optimistic update
    toggleLikeInStore(postId)
    
    try {
      await trigger(postId)
    } catch (error) {
      // Error handling is done in the mutation options
      throw error
    }
  }
  
  return {
    toggleLike: toggleLikeWithOptimistic,
    isToggling: isMutating,
  }
}

// Hook for bookmarking posts
export function useBookmarkPost() {
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation(
    '/api/posts/bookmark',
    (url: string, { arg }: { arg: string }) => toggleBookmark(`/api/posts/${arg}/bookmark`),
    {
      onSuccess: (data) => {
        addToast({
          type: 'success',
          title: data.data.bookmarked ? 'Post bookmarked' : 'Bookmark removed',
          description: data.data.message,
        })
      },
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to update bookmark',
          description: error.message,
        })
      },
    }
  )
  
  return {
    toggleBookmark: trigger,
    isToggling: isMutating,
  }
}

// Hook for sharing posts
export function useSharePost() {
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation(
    '/api/posts/share',
    (url: string, { arg }: { arg: { postId: string; platform?: string; message?: string } }) => 
      sharePost(`/api/posts/${arg.postId}/share`, { arg: { platform: arg.platform, message: arg.message } }),
    {
      onSuccess: (data) => {
        // Copy share URL to clipboard if platform is 'copy'
        if (data.data.shareUrls?.copy) {
          navigator.clipboard.writeText(data.data.shareUrls.copy)
          addToast({
            type: 'success',
            title: 'Link copied!',
            description: 'Share link has been copied to clipboard',
          })
        } else {
          addToast({
            type: 'success',
            title: 'Post shared',
            description: data.data.message,
          })
        }
      },
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to share post',
          description: error.message,
        })
      },
    }
  )
  
  return {
    sharePost: trigger,
    isSharing: isMutating,
  }
}

