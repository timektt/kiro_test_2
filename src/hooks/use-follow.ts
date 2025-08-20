import { useState } from 'react'
import { useSession } from 'next-auth/react'
import useSWR, { mutate } from 'swr'
import { toast } from 'sonner'

interface FollowStatus {
  isFollowing: boolean
  followedAt: string | null
}

interface UseFollowResult {
  isFollowing: boolean
  isLoading: boolean
  isToggling: boolean
  error: Error | null
  toggleFollow: () => Promise<void>
  followUser: () => Promise<void>
  unfollowUser: () => Promise<void>
}

const fetcher = async (url: string): Promise<any> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  const result = await response.json()
  if (!result.success && result.error) {
    throw new Error(result.error)
  }
  return result.success ? result.data : result
}

export function useFollow(userId: string): UseFollowResult {
  const { data: session } = useSession()
  const [isToggling, setIsToggling] = useState(false)

  const {
    data,
    error,
    isLoading,
    mutate: mutateFollow
  } = useSWR<FollowStatus>(
    session?.user?.id && userId ? `/api/users/${userId}/follow` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  )

  const followUser = async (): Promise<void> => {
    if (!session?.user?.id) {
      toast.error('Please sign in to follow users')
      return
    }

    if (isToggling) return

    setIsToggling(true)
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to follow user')
      }

      const result = await response.json()
      
      // Optimistically update the follow status
      await mutateFollow(
        { isFollowing: true, followedAt: new Date().toISOString() },
        false
      )

      // Revalidate related data
      mutate(`/api/users/${userId}`)
      mutate('/api/users/me/following')
      
      toast.success(`Successfully followed ${result.follow?.following?.name || 'user'}`)
    } catch (error) {
      console.error('Error following user:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to follow user')
      
      // Revert optimistic update on error
      mutateFollow()
    } finally {
      setIsToggling(false)
    }
  }

  const unfollowUser = async (): Promise<void> => {
    if (!session?.user?.id) {
      toast.error('Please sign in to unfollow users')
      return
    }

    if (isToggling) return

    setIsToggling(true)
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to unfollow user')
      }

      // Optimistically update the follow status
      await mutateFollow(
        { isFollowing: false, followedAt: null },
        false
      )

      // Revalidate related data
      mutate(`/api/users/${userId}`)
      mutate('/api/users/me/following')
      
      toast.success('Successfully unfollowed user')
    } catch (error) {
      console.error('Error unfollowing user:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to unfollow user')
      
      // Revert optimistic update on error
      mutateFollow()
    } finally {
      setIsToggling(false)
    }
  }

  const toggleFollow = async (): Promise<void> => {
    if (data?.isFollowing) {
      await unfollowUser()
    } else {
      await followUser()
    }
  }

  return {
    isFollowing: data?.isFollowing || false,
    isLoading,
    isToggling,
    error,
    toggleFollow,
    followUser,
    unfollowUser
  }
}

// Hook for getting user's followers
export function useFollowers(userId: string, page = 1, limit = 20) {
  const { data: session } = useSession()
  
  const {
    data,
    error,
    isLoading,
    mutate: mutateFollowers
  } = useSWR(
    userId ? `/api/users/${userId}/followers?page=${page}&limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000
    }
  )

  return {
    followers: data?.followers || [],
    pagination: data?.pagination || { page: 1, limit, total: 0, hasMore: false },
    totalCount: data?.pagination?.total || 0,
    isLoading,
    error,
    refresh: mutateFollowers
  }
}

// Hook for getting user's following
export function useFollowing(userId: string, page = 1, limit = 20) {
  const { data: session } = useSession()
  
  const {
    data,
    error,
    isLoading,
    mutate: mutateFollowing
  } = useSWR(
    userId ? `/api/users/${userId}/following?page=${page}&limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000
    }
  )

  return {
    following: data?.following || [],
    pagination: data?.pagination || { page: 1, limit, total: 0, hasMore: false },
    totalCount: data?.pagination?.total || 0,
    isLoading,
    error,
    refresh: mutateFollowing
  }
}
