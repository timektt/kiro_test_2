'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import Link from 'next/link'
import { Bell, Settings, CheckCheck, Heart, MessageCircle, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { EmptyState } from '@/components/ui/empty-state'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal, Eye, EyeOff, X } from 'lucide-react'

interface NotificationData {
  notifications: Array<{
    id: string
    type: 'LIKE' | 'COMMENT' | 'FOLLOW'
    message: string
    read: boolean
    createdAt: Date
    relatedId?: string | null
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

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'LIKE':
      return <Heart className="h-4 w-4 text-red-500" />
    case 'COMMENT':
      return <MessageCircle className="h-4 w-4 text-blue-500" />
    case 'FOLLOW':
      return <UserPlus className="h-4 w-4 text-green-500" />
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />
  }
}

interface SimpleNotificationItemProps {
  notification: {
    id: string
    type: 'LIKE' | 'COMMENT' | 'FOLLOW'
    message: string
    read: boolean
    createdAt: Date
    relatedId?: string | null
  }
  onMarkAsRead?: (notificationId: string) => void
  onMarkAsUnread?: (notificationId: string) => void
  onDelete?: (notificationId: string) => void
}

function SimpleNotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
}: SimpleNotificationItemProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleMarkAsRead = async () => {
    if (isLoading || !onMarkAsRead) return
    setIsLoading(true)
    try {
      await onMarkAsRead(notification.id)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsUnread = async () => {
    if (isLoading || !onMarkAsUnread) return
    setIsLoading(true)
    try {
      await onMarkAsUnread(notification.id)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (isLoading || !onDelete) return
    setIsLoading(true)
    try {
      await onDelete(notification.id)
    } finally {
      setIsLoading(false)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 sm:p-4 border-b border-border/50 hover:bg-muted/30 transition-colors group',
        !notification.read && 'bg-primary/5 border-l-2 border-l-primary'
      )}
    >
      {/* Notification Icon */}
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          {notification.message}
        </p>
        
        {/* Timestamp and Status */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {!notification.read && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              New
            </Badge>
          )}
        </div>
      </div>

      {/* Actions Menu */}
      <div className="flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isLoading}
              aria-label="Notification actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {notification.read ? (
              <DropdownMenuItem onClick={handleMarkAsUnread} disabled={isLoading}>
                <EyeOff className="h-4 w-4 mr-2" />
                Mark as unread
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={handleMarkAsRead} disabled={isLoading}>
                <Eye className="h-4 w-4 mr-2" />
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={handleDelete} 
              disabled={isLoading}
              className="text-destructive focus:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

interface NotificationDropdownProps {
  className?: string
  forceOpen?: boolean // For testing purposes
}

export function NotificationDropdown({ className, forceOpen }: NotificationDropdownProps) {
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
    const isDropdownOpen = forceOpen || isOpen
    if (isDropdownOpen && data?.notifications.some(n => !n.read)) {
      // Auto-mark notifications as read when viewed
      const unreadIds = data.notifications
        .filter(n => !n.read)
        .map(n => n.id)
      
      if (unreadIds.length > 0) {
        const fetchPromise = fetch('/api/notifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'markAsRead',
            notificationIds: unreadIds,
          }),
        })
        
        if (fetchPromise && fetchPromise.then) {
          fetchPromise.then(() => {
            mutate()
          }).catch((error) => {
            console.error('Error auto-marking notifications as read:', error)
          })
        }
      }
    }
  }, [forceOpen, isOpen, data, mutate])

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
        body: JSON.stringify({ read: true }),
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
        body: JSON.stringify({ read: false }),
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
    <DropdownMenu open={forceOpen || isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('relative h-9 w-9 sm:h-10 sm:w-10 p-0 min-h-[44px] sm:min-h-[auto]', className)}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 text-xs flex items-center justify-center"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-72 sm:w-80 p-0"
        sideOffset={8}
        role="menu"
        aria-label="Notifications menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h3 className="font-semibold text-sm" id="notifications-heading">Notifications</h3>
          <div className="flex items-center gap-1 sm:gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllRead}
                className="h-8 px-2 text-xs min-h-[44px] sm:min-h-[32px]"
                aria-label="Mark all notifications as read"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Mark all read</span>
              </Button>
            )}
            <Link href="/notifications">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs min-h-[44px] sm:min-h-[32px]"
                aria-label="Open notification settings"
              >
                <Settings className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-80 sm:max-h-96" role="region" aria-labelledby="notifications-heading">
          {isLoading ? (
            <div className="p-3 sm:p-4 text-center text-xs sm:text-sm text-muted-foreground" role="status" aria-live="polite">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="p-3 sm:p-4 text-center text-xs sm:text-sm text-destructive" role="alert">
              Failed to load notifications
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 sm:p-8">
              <EmptyState
                icon={Bell}
                title="No notifications"
                description="You're all caught up!"
                compact
              />
            </div>
          ) : (
            <ScrollArea className="max-h-80 sm:max-h-96">
              <ul role="list" aria-label="Notification list">
                {notifications.map((notification) => (
                  <li key={notification.id} role="listitem">
                    <SimpleNotificationItem
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAsUnread={handleMarkAsUnread}
                      onDelete={handleDelete}
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
            <div className="p-2 sm:p-3 text-center">
              <Link href="/notifications">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs min-h-[44px] sm:min-h-[auto] w-full sm:w-auto"
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


