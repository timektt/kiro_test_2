import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { NotificationDropdown } from '@/components/ui/notification-dropdown'
import useSWR from 'swr'

// Mock dependencies
jest.mock('next-auth/react')
jest.mock('swr')

const mockSession = {
  user: {
    id: 'user-1',
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
  },
  expires: '2024-12-31T23:59:59.999Z',
}

const mockNotifications = [
  {
    id: 'notification-1',
    type: 'LIKE' as const,
    message: 'liked your post',
    isRead: false,
    readAt: null,
    createdAt: new Date(),
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
    readAt: new Date(),
    createdAt: new Date(),
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

describe('NotificationDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('should not render when user is not authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: null, 
      status: 'unauthenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    const { container } = render(<NotificationDropdown />)
    expect(container.firstChild).toBeNull()
  })

  it('should render notification bell with unread count', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<NotificationDropdown />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // Unread count badge
  })

  it('should show loading state', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      mutate: jest.fn(),
    })

    render(<NotificationDropdown />)
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('Loading notifications...')).toBeInTheDocument()
  })

  it('should show error state', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: null,
      error: new Error('Failed to fetch'),
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<NotificationDropdown />)
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('Failed to load notifications')).toBeInTheDocument()
  })

  it('should show empty state when no notifications', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { ...mockNotificationData, notifications: [], unreadCount: 0 },
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<NotificationDropdown />)
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('No notifications')).toBeInTheDocument()
    expect(screen.getByText("You're all caught up!")).toBeInTheDocument()
  })

  it('should display notifications correctly', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<NotificationDropdown />)
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('User 2')).toBeInTheDocument()
    expect(screen.getByText('User 3')).toBeInTheDocument()
    expect(screen.getByText('liked your post')).toBeInTheDocument()
    expect(screen.getByText('commented on your post')).toBeInTheDocument()
  })

  it('should handle mark all as read', async () => {
    const mockMutate = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
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

    render(<NotificationDropdown />)
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    // Click mark all read button
    const markAllReadButton = screen.getByText('Mark all read')
    fireEvent.click(markAllReadButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllAsRead' }),
      })
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should auto-mark notifications as read when dropdown opens', async () => {
    const mockMutate = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
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

    render(<NotificationDropdown />)
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'markAsRead',
          notificationIds: ['notification-1'], // Only unread notification
        }),
      })
    })

    expect(mockMutate).toHaveBeenCalled()
  })

  it('should show View all notifications link', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: mockNotificationData,
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<NotificationDropdown />)
    
    // Click to open dropdown
    fireEvent.click(screen.getByRole('button'))
    
    const viewAllLink = screen.getByText('View all notifications')
    expect(viewAllLink).toBeInTheDocument()
    expect(viewAllLink.closest('a')).toHaveAttribute('href', '/notifications')
  })

  it('should not show unread count badge when no unread notifications', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { ...mockNotificationData, unreadCount: 0 },
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<NotificationDropdown />)

    expect(screen.queryByText('1')).not.toBeInTheDocument()
  })

  it('should show 99+ for high unread counts', () => {
    ;(useSession as jest.Mock).mockReturnValue({ 
      data: mockSession, 
      status: 'authenticated',
      update: jest.fn()
    })
    ;(useSWR as jest.Mock).mockReturnValue({
      data: { ...mockNotificationData, unreadCount: 150 },
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<NotificationDropdown />)

    expect(screen.getByText('99+')).toBeInTheDocument()
  })
})
