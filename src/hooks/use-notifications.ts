import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
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
async function markAsRead(url: string) {
  const response = await fetch(url, { method: 'PUT' })
  
  if (!response.ok) {
    throw new Error('Failed to mark as read')
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to mark as read')
  }
  
  return result.data
}

async function markAllAsRead(url: string) {
  const response = await fetch(url, { method: 'PUT' })
  
  if (!response.ok) {
    throw new Error('Failed to mark all as read')
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to mark all as read')
  }
  
  return result.data
}

async function deleteNotification(url: string) {
  const response = await fetch(url, { method: 'DELETE' })
  
  if (!response.ok) {
    throw new Error('Failed to delete notification')
  }
  
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete notification')
  }
  
  return result.data
}

// Hook for fetching notifications
export function useNotifications(page = 1, limit = 20, unreadOnly = false) {
  const { addToast } = useUIStore()
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
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
  
  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    pagination: data?.pagination || { page: 1, limit: 20, total: 0, hasMore: false },
    isLoading,
    error,
    mutate,
  }
}

// Hook for marking notification as read
export function useMarkNotificationAsRead() {
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation(
    (notificationId: string) => `/api/notifications/${notificationId}`,
    markAsRead,
    {
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to mark notification as read',
          description: error.message,
        })
      },
    }
  )
  
  return {
    markAsRead: trigger,
    isMarking: isMutating,
  }
}

// Hook for marking all notifications as read
export function useMarkAllNotificationsAsRead() {
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation(
    '/api/notifications/mark-all-read',
    markAllAsRead,
    {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: 'All notifications marked as read',
        })
      },
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to mark all notifications as read',
          description: error.message,
        })
      },
    }
  )
  
  return {
    markAllAsRead: trigger,
    isMarking: isMutating,
  }
}

// Hook for deleting notification
export function useDeleteNotification() {
  const { addToast } = useUIStore()
  
  const { trigger, isMutating } = useSWRMutation(
    (notificationId: string) => `/api/notifications/${notificationId}`,
    deleteNotification,
    {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: 'Notification deleted',
        })
      },
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to delete notification',
          description: error.message,
        })
      },
    }
  )
  
  return {
    deleteNotification: trigger,
    isDeleting: isMutating,
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