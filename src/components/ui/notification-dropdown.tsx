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
  DropdownMenuHeader,
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
          variant=\"ghost\"\n          size=\"sm\"\n          className={cn('relative h-9 w-9 p-0', className)}\n        >\n          <Bell className=\"h-4 w-4\" />\n          {unreadCount > 0 && (\n            <Badge \n              variant=\"destructive\" \n              className=\"absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center\"\n            >\n              {unreadCount > 99 ? '99+' : unreadCount}\n            </Badge>\n          )}\n        </Button>\n      </DropdownMenuTrigger>\n      <DropdownMenuContent \n        align=\"end\" \n        className=\"w-80 p-0\"\n        sideOffset={8}\n      >\n        {/* Header */}\n        <div className=\"flex items-center justify-between p-4 border-b\">\n          <h3 className=\"font-semibold text-sm\">Notifications</h3>\n          <div className=\"flex items-center gap-2\">\n            {unreadCount > 0 && (\n              <Button\n                variant=\"ghost\"\n                size=\"sm\"\n                onClick={handleMarkAllAsRead}\n                disabled={isMarkingAllRead}\n                className=\"h-8 px-2 text-xs\"\n              >\n                <CheckCheck className=\"h-3 w-3 mr-1\" />\n                Mark all read\n              </Button>\n            )}\n            <Link href=\"/notifications\">\n              <Button variant=\"ghost\" size=\"sm\" className=\"h-8 px-2 text-xs\">\n                <Settings className=\"h-3 w-3 mr-1\" />\n                Settings\n              </Button>\n            </Link>\n          </div>\n        </div>\n\n        {/* Content */}\n        <div className=\"max-h-96\">\n          {isLoading ? (\n            <div className=\"p-4 text-center text-sm text-muted-foreground\">\n              Loading notifications...\n            </div>\n          ) : error ? (\n            <div className=\"p-4 text-center text-sm text-destructive\">\n              Failed to load notifications\n            </div>\n          ) : notifications.length === 0 ? (\n            <div className=\"p-8\">\n              <EmptyState\n                icon={Bell}\n                title=\"No notifications\"\n                description=\"You're all caught up!\"\n                compact\n              />\n            </div>\n          ) : (\n            <ScrollArea className=\"max-h-96\">\n              {notifications.map((notification) => (\n                <NotificationItem\n                  key={notification.id}\n                  notification={notification}\n                  onMarkAsRead={handleMarkAsRead}\n                  onMarkAsUnread={handleMarkAsUnread}\n                  onDelete={handleDelete}\n                  className=\"border-b-0\"\n                />\n              ))}\n            </ScrollArea>\n          )}\n        </div>\n\n        {/* Footer */}\n        {notifications.length > 0 && (\n          <>\n            <Separator />\n            <div className=\"p-3 text-center\">\n              <Link href=\"/notifications\">\n                <Button variant=\"ghost\" size=\"sm\" className=\"text-xs\">\n                  View all notifications\n                </Button>\n              </Link>\n            </div>\n          </>\n        )}\n      </DropdownMenuContent>\n    </DropdownMenu>\n  )\n}"