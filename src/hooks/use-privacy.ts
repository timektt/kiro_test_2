import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'

interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE'
  showEmail: boolean
  showMBTI: boolean
  showBio: boolean
  showJoinDate: boolean
  showFollowerCount: boolean
  showFollowingCount: boolean
  defaultPostVisibility: 'PUBLIC' | 'FOLLOWERS_ONLY' | 'PRIVATE' | 'CUSTOM'
  allowComments: boolean
  allowLikes: boolean
  allowShares: boolean
  allowDirectMessages: boolean
  allowMentions: boolean
  allowTagging: boolean
  showOnlineStatus: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

interface ProfileVisibility {
  canViewProfile: boolean
  canViewPosts: boolean
  canSendMessage: boolean
  canMention: boolean
  canTag: boolean
  showMBTI: boolean
  showBio: boolean
  showJoinDate: boolean
  showFollowerCount: boolean
  showFollowingCount: boolean
  showEmail: boolean
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }
  const data = await response.json()
  return data
}

// Hook to get user's own privacy settings
export function usePrivacySettings() {
  const { data, error, mutate } = useSWR('/api/privacy/settings', fetcher)
  
  const updateSettings = async (settings: Partial<PrivacySettings>) => {
    try {
      const response = await fetch('/api/privacy/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update privacy settings')
      }
      
      const result = await response.json()
      mutate(result.settings)
      toast.success('Privacy settings updated successfully')
      return result.settings
    } catch (error) {
      console.error('Error updating privacy settings:', error)
      toast.error('Failed to update privacy settings')
      throw error
    }
  }
  
  return {
    settings: data?.settings as PrivacySettings | undefined,
    isLoading: !error && !data,
    isError: error,
    updateSettings,
    refresh: mutate,
  }
}

// Hook to check what profile information can be viewed
export function useProfileVisibility(targetUserId: string, currentUserId?: string) {
  const { data, error } = useSWR(
    currentUserId ? `/api/privacy/profile-visibility/${targetUserId}` : null,
    fetcher
  )
  
  return {
    visibility: data?.visibility as ProfileVisibility | undefined,
    isLoading: !error && !data,
    isError: error,
  }
}

// Hook to block/unblock users
export function useBlockUser() {
  const [isLoading, setIsLoading] = useState(false)
  
  const blockUser = async (userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/privacy/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to block user')
      }
      
      toast.success('User blocked successfully')
      return true
    } catch (error) {
      console.error('Error blocking user:', error)
      toast.error('Failed to block user')
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  const unblockUser = async (userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/privacy/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to unblock user')
      }
      
      toast.success('User unblocked successfully')
      return true
    } catch (error) {
      console.error('Error unblocking user:', error)
      toast.error('Failed to unblock user')
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  return {
    blockUser,
    unblockUser,
    isLoading,
  }
}

// Hook to get blocked users list
export function useBlockedUsers() {
  const { data, error, mutate } = useSWR('/api/privacy/blocked-users', fetcher)
  
  return {
    blockedUsers: data?.users || [],
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  }
}

// Hook to report users
export function useReportUser() {
  const [isLoading, setIsLoading] = useState(false)
  
  const reportUser = async (userId: string, reason: string, description?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'USER',
          targetId: userId,
          reason,
          description,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to report user')
      }
      
      toast.success('User reported successfully')
      return true
    } catch (error) {
      console.error('Error reporting user:', error)
      toast.error('Failed to report user')
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  return {
    reportUser,
    isLoading,
  }
}

// Utility function to check if user can perform action
export function canPerformAction(
  visibility: ProfileVisibility | undefined,
  action: 'viewProfile' | 'viewPosts' | 'sendMessage' | 'mention' | 'tag'
): boolean {
  if (!visibility) return false
  
  switch (action) {
    case 'viewProfile':
      return visibility.canViewProfile
    case 'viewPosts':
      return visibility.canViewPosts
    case 'sendMessage':
      return visibility.canSendMessage
    case 'mention':
      return visibility.canMention
    case 'tag':
      return visibility.canTag
    default:
      return false
  }
}

// Utility function to check what profile info to show
export function getVisibleProfileInfo(
  visibility: ProfileVisibility | undefined,
  isOwnProfile: boolean = false
) {
  if (isOwnProfile) {
    return {
      showMBTI: true,
      showBio: true,
      showJoinDate: true,
      showFollowerCount: true,
      showFollowingCount: true,
      showEmail: true,
    }
  }
  
  if (!visibility) {
    return {
      showMBTI: false,
      showBio: false,
      showJoinDate: false,
      showFollowerCount: false,
      showFollowingCount: false,
      showEmail: false,
    }
  }
  
  return {
    showMBTI: visibility.showMBTI,
    showBio: visibility.showBio,
    showJoinDate: visibility.showJoinDate,
    showFollowerCount: visibility.showFollowerCount,
    showFollowingCount: visibility.showFollowingCount,
    showEmail: visibility.showEmail,
  }
}