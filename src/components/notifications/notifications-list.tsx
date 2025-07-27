'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { Bell, Filter, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationItem } from '@/components/ui/notification-item'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/loading-skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface NotificationData {
  notifications: Array<{
    id: string
    type: 'LIKE' | 'COMMENT' | 'FOLLOW'
    message: string
    isRead: boolean
    readAt: Date | null
    createdAt: Date
    actor: {
      id: string
      username: string
      name: string | null
      image: string | null
    }
    post?: {
      id: string
      content: string
    } | null
  }>
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
  unreadCount: number
}

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

interface NotificationsListProps {
  className?: string
}

export function NotificationsList({ className }: NotificationsListProps) {
  const { data: session } = useSession()
  const [currentTab, setCurrentTab] = useState('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [allNotifications, setAllNotifications] = useState<NotificationData['notifications']>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)

  // Build API URL based on filters
  const buildApiUrl = useCallback((tabType: string, pageNum: number) => {
    const params = new URLSearchParams({
      page: pageNum.toString(),
      limit: '20',
    })

    if (tabType === 'unread') {
      params.append('unreadOnly', 'true')
    }

    return `/api/notifications?${params.toString()}`
  }, [])

  // Fetch notifications
  const { data, error, isLoading, mutate } = useSWR<NotificationData>(
    session ? buildApiUrl(currentTab, 1) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  // Update notifications when data changes
  useEffect(() => {
    if (data?.notifications) {
      if (page === 1) {
        setAllNotifications(data.notifications)
      } else {
        setAllNotifications(prev => [...prev, ...data.notifications])
      }
    }
  }, [data, page])

  // Reset when tab changes
  useEffect(() => {
    setPage(1)
    setAllNotifications([])
  }, [currentTab])

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    setPage(1)
    setAllNotifications([])
  }

  const handleMarkAllAsRead = async () => {
    if (isMarkingAllRead || !data?.unreadCount) return
    
    setIsMarkingAllRead(true)
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllAsRead' }),
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        mutate()
        // Update local state optimistically
        setAllNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n)
        )
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAsUnread = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: false }),
      })

      if (response.ok) {
        mutate()
        // Update local state optimistically
        setAllNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: false, readAt: null } : n)
        )
      }
    } catch (error) {
      console.error('Error marking as unread:', error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        mutate()
        // Remove from local state optimistically
        setAllNotifications(prev => prev.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleLoadMore = async () => {
    if (!data?.pagination.hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      const nextPage = page + 1
      const response = await fetch(buildApiUrl(currentTab, nextPage))
      
      if (!response.ok) {
        throw new Error('Failed to load more notifications')
      }

      const result = await response.json()
      if (result.success && result.data.notifications.length > 0) {
        setAllNotifications(prev => [...prev, ...result.data.notifications])
        setPage(nextPage)
      }
    } catch (error) {
      console.error('Error loading more notifications:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Filter notifications by type
  const filteredNotifications = typeFilter === 'all' 
    ? allNotifications 
    : allNotifications.filter(n => n.type === typeFilter)

  if (!session) {
    return (
      <EmptyState
        icon={Bell}
        title="Authentication Required"
        description="Please sign in to view your notifications"
      />
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={Bell}
        title="Error Loading Notifications"
        description={error.message || 'Failed to load notifications'}
      />
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {data?.unreadCount ? (
                <span className="text-sm font-normal text-muted-foreground">
                  ({data.unreadCount} unread)
                </span>
              ) : null}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="LIKE">Likes</SelectItem>
                  <SelectItem value="COMMENT">Comments</SelectItem>
                  <SelectItem value="FOLLOW">Follows</SelectItem>
                </SelectContent>
              </Select>
              {data?.unreadCount ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAllRead}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <div className="px-6 pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {data?.unreadCount ? `(${data.unreadCount})` : ''}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={currentTab} className="mt-0">
              {isLoading && allNotifications.length === 0 ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 border-b">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={Bell}
                    title={currentTab === 'unread' ? 'No unread notifications' : 'No notifications'}
                    description={
                      currentTab === 'unread' 
                        ? "You're all caught up!" 
                        : 'Notifications will appear here when you receive likes, comments, or follows.'
                    }
                  />
                </div>
              ) : (
                <div>
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAsUnread={handleMarkAsUnread}
                      onDelete={handleDelete}
                    />
                  ))}

                  {/* Load More */}
                  {data?.pagination.hasMore && (
                    <div className="p-6 text-center border-t">
                      <Button 
                        variant="outline" 
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                      >
                        {isLoadingMore ? 'Loading...' : 'Load More'}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Showing {filteredNotifications.length} of {data.pagination.total} notifications
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotificationsList