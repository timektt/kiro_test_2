'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import Link from 'next/link'
import { Bell, Settings, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { NotificationItem } from '@/components/ui/notification-item'
import { EmptyState } from '@/components/ui/empty-state'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

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

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)

  // Fetch notifications
  const { data, error, isLoading, mutate } = useSWR<NotificationData>(
    session ? '/api/notifications?limit=10' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  // Mark notification as read when dropdown opens
  useEffect(() => {
    if (isOpen && data?.notifications.some(n => !n.isRead)) {
      // Auto-mark notifications as read when viewed
      const unreadIds = data.notifications
        .filter(n => !n.isRead)
        .map(n => n.id)
      
      if (unreadIds.length > 0) {
        fetch('/api/notifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'markAsRead',
            notificationIds: unreadIds,
          }),
        }).then(() => {
          mutate()
        })
      }
    }
  }, [isOpen, data, mutate])

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
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  if (!session) {
    return null
  }

  const unreadCount = data?.unreadCount || 0
  const notifications = data?.notifications || []

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('relative h-9 w-9 p-0', className)}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0"
        sideOffset={8}
        role="menu"
        aria-label="Notifications menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm" id="notifications-heading">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllRead}
                className="h-8 px-2 text-xs"
                aria-label="Mark all notifications as read"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Link href="/notifications">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                aria-label="Open notification settings"
              >
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96" role="region" aria-labelledby="notifications-heading">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground" role="status" aria-live="polite">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-destructive" role="alert">
              Failed to load notifications
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Bell}
                title="No notifications"
                description="You're all caught up!"
                compact
              />
            </div>
          ) : (
            <ScrollArea className="max-h-96">
              <ul role="list" aria-label="Notification list">
                {notifications.map((notification) => (
                  <li key={notification.id} role="listitem">
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAsUnread={handleMarkAsUnread}
                      onDelete={handleDelete}
                      className="border-b-0"
                    />
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3 text-center">
              <Link href="/notifications">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  aria-label="View all notifications in full page"
                >
                  View all notifications
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
