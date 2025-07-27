'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  X, 
  Eye, 
  EyeOff,
  MoreHorizontal 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: {
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
  }
  onMarkAsRead?: (notificationId: string) => void
  onMarkAsUnread?: (notificationId: string) => void
  onDelete?: (notificationId: string) => void
  className?: string
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
      return null
  }
}

const getNotificationLink = (notification: NotificationItemProps['notification']) => {
  switch (notification.type) {
    case 'LIKE':
    case 'COMMENT':
      return notification.post ? `/post/${notification.post.id}` : `/profile/${notification.actor.username}`
    case 'FOLLOW':
      return `/profile/${notification.actor.username}`
    default:
      return `/profile/${notification.actor.username}`
  }
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  className,
}: NotificationItemProps) {
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

  const notificationLink = getNotificationLink(notification)
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors',
        !notification.isRead && 'bg-primary/5 border-l-2 border-l-primary',
        className
      )}
    >
      {/* Notification Icon */}
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Actor Avatar */}
      <Link href={`/profile/${notification.actor.username}`} className="flex-shrink-0">
        <Avatar className="h-8 w-8">
          <AvatarImage src={notification.actor.image || undefined} />
          <AvatarFallback>
            {notification.actor.name?.[0] || notification.actor.username[0]}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <Link href={notificationLink} className="block group">
          <p className="text-sm text-foreground group-hover:text-primary transition-colors">
            <span className="font-medium">
              {notification.actor.name || notification.actor.username}
            </span>{' '}
            {notification.message}
          </p>
          
          {/* Post Preview */}
          {notification.post && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              "{notification.post.content}"
            </p>
          )}
        </Link>

        {/* Timestamp and Status */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {!notification.isRead && (
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
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {notification.isRead ? (
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

