import useSWR from 'swr'
import { useCallback, useState } from 'react'
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

// Main hook for notifications with all functionality
export function useNotifications(page = 1, limit = 10, unreadOnly = false) {
  const { addToast } = useUIStore()
  const [currentPage, setCurrentPage] = useState(page)
  
  const queryParams = new URLSearchParams({
    page: currentPage.toString(),
    limit: limit.toString(),
  })
  
  if (unreadOnly) {
    queryParams.append('unread', 'true')
  }
  
  const { data, error, isLoading, mutate } = useSWR(
    `/api/notifications?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh every 30 seconds
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to load notifications',
          description: error.message,
        })
      },
    }
  )

  const notifications = data?.notifications || []
  const unreadCount = data?.unreadCount || 0
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, hasMore: false }
  const hasMore = pagination.hasMore

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark as read')
      }
      
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to mark as read')
      }
      
      // Refresh the data
      await mutate()
      
      return result.data
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to mark notification as read',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }, [mutate, addToast])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllAsRead' }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark all as read')
      }
      
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to mark all as read')
      }
      
      // Refresh the data
      await mutate()
      
      addToast({
        type: 'success',
        title: 'All notifications marked as read',
      })
      
      return result.data
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to mark all notifications as read',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }, [mutate, addToast])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }
      
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete notification')
      }
      
      // Refresh the data
      await mutate()
      
      addToast({
        type: 'success',
        title: 'Notification deleted',
      })
      
      return result.data
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to delete notification',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }, [mutate, addToast])

  // Load more notifications (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore) return
    
    try {
      const nextPage = currentPage + 1
      const response = await fetch(`/api/notifications?page=${nextPage}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Failed to load more notifications')
      }
      
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to load more notifications')
      }
      
      setCurrentPage(nextPage)
      await mutate()
      
      return result.data
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to load more notifications',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }, [hasMore, currentPage, limit, mutate, addToast])

  // Refresh notifications
  const refresh = useCallback(async () => {
    return await mutate()
  }, [mutate])

  // Get only unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter((notification: any) => !notification.isRead)
  }, [notifications])

  return {
    notifications,
    unreadCount,
    pagination,
    hasMore,
    isLoading,
    error,
    mutate,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh,
    getUnreadNotifications,
  }
}

// Legacy hooks for backward compatibility - these now use the main hook internally
export function useMarkNotificationAsRead() {
  const { markAsRead } = useNotifications()
  
  return {
    markAsRead,
    isMarking: false, // For backward compatibility
  }
}

export function useMarkAllNotificationsAsRead() {
  const { markAllAsRead } = useNotifications()
  
  return {
    markAllAsRead,
    isMarking: false, // For backward compatibility
  }
}

export function useDeleteNotification() {
  const { deleteNotification } = useNotifications()
  
  return {
    deleteNotification,
    isDeleting: false, // For backward compatibility
  }
}

// Hook for real-time notifications (using polling)
export function useRealtimeNotifications() {
  const { data, mutate } = useSWR(
    '/api/notifications?unread=true&limit=5',
    fetcher,
    {
      refreshInterval: 10000, // Poll every 10 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )
  
  return {
    unreadNotifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    refresh: mutate,
  }
}
