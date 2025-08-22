import { renderHook, waitFor } from '@testing-library/react'
import { useNotifications } from '@/hooks/use-notifications'
import useSWR from 'swr'

// Mock SWR
jest.mock('swr')

const mockNotifications = [
  {
    id: 'notification-1',
    type: 'LIKE' as const,
    message: 'liked your post',
    isRead: false,
    readAt: null,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    actor: {
      id: 'user-2',
      username: 'user2',
      name: 'User 2',
      image: null,
    },
    post: {
      id: 'post-1',
      content: 'Test post content',
    },
  },
  {
    id: 'notification-2',
    type: 'COMMENT' as const,
    message: 'commented on your post',
    isRead: true,
    readAt: new Date('2024-01-01T09:00:00Z'),
    createdAt: new Date('2024-01-01T08:00:00Z'),
    actor: {
      id: 'user-3',
      username: 'user3',
      name: 'User 3',
      image: null,
    },
    post: {
      id: 'post-1',
      content: 'Test post content',
    },
  },
]

const mockNotificationData = {
  notifications: mockNotifications,
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    hasMore: false,
  },
  unreadCount: 1,
}

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('should fetch notifications', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useNotifications())

    expect(result.current.notifications).toEqual(mockNotifications)
    expect(result.current.unreadCount).toBe(1)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle loading state', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useNotifications())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.notifications).toEqual([])
    expect(result.current.unreadCount).toBe(0)
  })

  it('should handle error state', () => {
    const error = new Error('Failed to fetch notifications')
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useNotifications())

    expect(result.current.error).toBe(error)
    expect(result.current.notifications).toEqual([])
  })

  it('should mark notification as read', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    const { result } = renderHook(() => useNotifications())

    await waitFor(async () => {
      await result.current.markAsRead('notification-1')
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/notifications/notification-1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: true }),
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should mark all notifications as read', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    const { result } = renderHook(() => useNotifications())

    await waitFor(async () => {
      await result.current.markAllAsRead()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markAllAsRead' }),
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should handle mark as read error', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useNotifications())

    await expect(result.current.markAsRead('notification-1')).rejects.toThrow('Network error')
  })

  it('should delete notification', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    const { result } = renderHook(() => useNotifications())

    await waitFor(async () => {
      await result.current.deleteNotification('notification-1')
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/notifications/notification-1', {
      method: 'DELETE',
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should handle pagination', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { ...mockNotificationData, pagination: { ...mockNotificationData.pagination, hasMore: true } },
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useNotifications())

    expect(result.current.hasMore).toBe(true)
    expect(result.current.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 2,
      hasMore: true,
    })
  })

  it('should load more notifications', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { ...mockNotificationData, pagination: { ...mockNotificationData.pagination, hasMore: true } },
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          notifications: [mockNotifications[0]],
          pagination: { page: 2, limit: 10, total: 2, hasMore: false },
        },
      }),
    })

    const { result } = renderHook(() => useNotifications())

    await waitFor(async () => {
      await result.current.loadMore()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/notifications?page=2&limit=20')
    expect(mockMutate).toHaveBeenCalled()
  })

  it('should refresh notifications', async () => {
    const mockMutate = jest.fn()
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    })

    const { result } = renderHook(() => useNotifications())

    await result.current.refresh()

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should get unread notifications only', () => {
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { result } = renderHook(() => useNotifications())

    const unreadNotifications = result.current.getUnreadNotifications()
    expect(unreadNotifications).toHaveLength(1)
    expect(unreadNotifications[0].id).toBe('notification-1')
  })
})

