import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
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
async function updateProfile(url: string, { arg }: { arg: any }) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(arg),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update profile')
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to update profile')
  }
  
  return result.data
}

async function followUser(url: string) {
  const response = await fetch(url, { method: 'POST' })
  
  if (!response.ok) {
    throw new Error('Failed to follow user')
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to follow user')
  }
  
  return result.data
}

async function unfollowUser(url: string) {
  const response = await fetch(url, { method: 'DELETE' })
  
  if (!response.ok) {
    throw new Error('Failed to unfollow user')
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to unfollow user')
  }
  
  return result.data
}

// Hook for fetching current user profile
export function useCurrentUser() {
  const { currentUser, setCurrentUser } = useUserStore()
  const { addToast } = useUIStore()
  
  const { data, error, isLoading, mutate } = useSWR(
    '/api/users/me',
    fetcher,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        setCurrentUser(data)
      },
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to load profile',
          description: error.message,
        })
      },
    }
  )
  
  return {
    user: data || currentUser,
    isLoading,
    error,
    mutate,
  }
}

// Hook for fetching a user profile by username
export function useUser(username: string) {
  const { addToast } = useUIStore()
  
  const { data, error, isLoading, mutate } = useSWR(
    username ? `/api/users/profile/${username}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to load user profile',
          description: error.message,
        })
      },
    }
  )
  
  return {
    user: data,
    isLoading,
    error,
    mutate,
  }
}

// Hook for updating user profile
export function useUpdateProfile() {
  const { updateUser, currentUser } = useUserStore()
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation(
    currentUser ? `/api/users/${currentUser.id}` : null,
    updateProfile,
    {
      onSuccess: (data) => {
        updateUser(data)
        addToast({
          type: 'success',
          title: 'Profile updated successfully',
        })
      },
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to update profile',
          description: error.message,
        })
      },
    }
  )
  
  return {
    updateProfile: trigger,
    isUpdating: isMutating,
  }
}

// Hook for following/unfollowing users with optimistic updates
export function useFollowUser() {
  const { followUser: followUserInStore, unfollowUser: unfollowUserInStore } = useUserStore()
  const { addToast } = useUIStore()
  
  const { trigger: triggerFollow, isMutating: isFollowing } = useSWRMutation(
    (userId: string) => `/api/users/${userId}/follow`,
    followUser,
    {
      onError: (error, key) => {
        // Revert optimistic update on error
        const userId = key.split('/')[2]
        unfollowUserInStore(userId)
        addToast({
          type: 'error',
          title: 'Failed to follow user',
          description: error.message,
        })
      },
    }
  )
  
  const { trigger: triggerUnfollow, isMutating: isUnfollowing } = useSWRMutation(
    (userId: string) => `/api/users/${userId}/follow`,
    unfollowUser,
    {
      onError: (error, key) => {
        // Revert optimistic update on error
        const userId = key.split('/')[2]
        followUserInStore(userId)
        addToast({
          type: 'error',
          title: 'Failed to unfollow user',
          description: error.message,
        })
      },
    }
  )
  
  const followWithOptimistic = async (userId: string) => {
    // Apply optimistic update
    followUserInStore(userId)
    
    try {
      await triggerFollow(userId)
    } catch (error) {
      // Error handling is done in the mutation options
      throw error
    }
  }
  
  const unfollowWithOptimistic = async (userId: string) => {
    // Apply optimistic update
    unfollowUserInStore(userId)
    
    try {
      await triggerUnfollow(userId)
    } catch (error) {
      // Error handling is done in the mutation options
      throw error
    }
  }
  
  return {
    followUser: followWithOptimistic,
    unfollowUser: unfollowWithOptimistic,
    isFollowing,
    isUnfollowing,
  }
}

// Hook for fetching user followers
export function useUserFollowers(userId: string, page = 1, limit = 20) {
  const { addToast } = useUIStore()
  
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/users/${userId}/followers?page=${page}&limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to load followers',
          description: error.message,
        })
      },
    }
  )
  
  return {
    followers: data?.followers || [],
    pagination: data?.pagination || { page: 1, limit: 20, total: 0, hasMore: false },
    isLoading,
    error,
    mutate,
  }
}

// Hook for fetching user following
export function useUserFollowing(userId: string, page = 1, limit = 20) {
  const { addToast } = useUIStore()
  
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/users/${userId}/following?page=${page}&limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to load following',
          description: error.message,
        })
      },
    }
  )
  
  return {
    following: data?.following || [],
    pagination: data?.pagination || { page: 1, limit: 20, total: 0, hasMore: false },
    isLoading,
    error,
    mutate,
  }
}

// Hook for searching users
export function useSearchUsers(query: string, filters?: { mbti?: string }) {
  const { addToast } = useUIStore()
  
  const queryParams = new URLSearchParams({
    q: query,
    type: 'users',
  })
  
  if (filters?.mbti) {
    queryParams.append('mbti', filters.mbti)
  }
  
  const { data, error, isLoading, mutate } = useSWR(
    query.trim().length >= 2 ? `/api/search?${queryParams.toString()}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Search failed',
          description: error.message,
        })
      },
    }
  )
  
  return {
    users: data?.users || [],
    isLoading,
    error,
    mutate,
  }
}
