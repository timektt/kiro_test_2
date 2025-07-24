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
}\n\nconst getNotificationIcon = (type: string) => {\n  switch (type) {\n    case 'LIKE':\n      return <Heart className=\"h-4 w-4 text-red-500\" />\n    case 'COMMENT':\n      return <MessageCircle className=\"h-4 w-4 text-blue-500\" />\n    case 'FOLLOW':\n      return <UserPlus className=\"h-4 w-4 text-green-500\" />\n    default:\n      return null\n  }\n}\n\nconst getNotificationLink = (notification: NotificationItemProps['notification']) => {\n  switch (notification.type) {\n    case 'LIKE':\n    case 'COMMENT':\n      return notification.post ? `/post/${notification.post.id}` : `/profile/${notification.actor.username}`\n    case 'FOLLOW':\n      return `/profile/${notification.actor.username}`\n    default:\n      return `/profile/${notification.actor.username}`\n  }\n}\n\nexport function NotificationItem({\n  notification,\n  onMarkAsRead,\n  onMarkAsUnread,\n  onDelete,\n  className,\n}: NotificationItemProps) {\n  const [isLoading, setIsLoading] = useState(false)\n\n  const handleMarkAsRead = async () => {\n    if (isLoading || !onMarkAsRead) return\n    setIsLoading(true)\n    try {\n      await onMarkAsRead(notification.id)\n    } finally {\n      setIsLoading(false)\n    }\n  }\n\n  const handleMarkAsUnread = async () => {\n    if (isLoading || !onMarkAsUnread) return\n    setIsLoading(true)\n    try {\n      await onMarkAsUnread(notification.id)\n    } finally {\n      setIsLoading(false)\n    }\n  }\n\n  const handleDelete = async () => {\n    if (isLoading || !onDelete) return\n    setIsLoading(true)\n    try {\n      await onDelete(notification.id)\n    } finally {\n      setIsLoading(false)\n    }\n  }\n\n  const notificationLink = getNotificationLink(notification)\n  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })\n\n  return (\n    <div\n      className={cn(\n        'flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors',\n        !notification.isRead && 'bg-primary/5 border-l-2 border-l-primary',\n        className\n      )}\n    >\n      {/* Notification Icon */}\n      <div className=\"flex-shrink-0 mt-1\">\n        {getNotificationIcon(notification.type)}\n      </div>\n\n      {/* Actor Avatar */}\n      <Link href={`/profile/${notification.actor.username}`} className=\"flex-shrink-0\">\n        <Avatar className=\"h-8 w-8\">\n          <AvatarImage src={notification.actor.image || undefined} />\n          <AvatarFallback>\n            {notification.actor.name?.[0] || notification.actor.username[0]}\n          </AvatarFallback>\n        </Avatar>\n      </Link>\n\n      {/* Notification Content */}\n      <div className=\"flex-1 min-w-0\">\n        <Link href={notificationLink} className=\"block group\">\n          <p className=\"text-sm text-foreground group-hover:text-primary transition-colors\">\n            <span className=\"font-medium\">\n              {notification.actor.name || notification.actor.username}\n            </span>{' '}\n            {notification.message}\n          </p>\n          \n          {/* Post Preview */}\n          {notification.post && (\n            <p className=\"text-xs text-muted-foreground mt-1 line-clamp-2\">\n              \"{notification.post.content}\"\n            </p>\n          )}\n        </Link>\n\n        {/* Timestamp and Status */}\n        <div className=\"flex items-center gap-2 mt-2\">\n          <span className=\"text-xs text-muted-foreground\">{timeAgo}</span>\n          {!notification.isRead && (\n            <Badge variant=\"secondary\" className=\"text-xs px-1.5 py-0.5\">\n              New\n            </Badge>\n          )}\n        </div>\n      </div>\n\n      {/* Actions Menu */}\n      <div className=\"flex-shrink-0\">\n        <DropdownMenu>\n          <DropdownMenuTrigger asChild>\n            <Button\n              variant=\"ghost\"\n              size=\"sm\"\n              className=\"h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity\"\n              disabled={isLoading}\n            >\n              <MoreHorizontal className=\"h-4 w-4\" />\n            </Button>\n          </DropdownMenuTrigger>\n          <DropdownMenuContent align=\"end\" className=\"w-48\">\n            {notification.isRead ? (\n              <DropdownMenuItem onClick={handleMarkAsUnread} disabled={isLoading}>\n                <EyeOff className=\"h-4 w-4 mr-2\" />\n                Mark as unread\n              </DropdownMenuItem>\n            ) : (\n              <DropdownMenuItem onClick={handleMarkAsRead} disabled={isLoading}>\n                <Eye className=\"h-4 w-4 mr-2\" />\n                Mark as read\n              </DropdownMenuItem>\n            )}\n            <DropdownMenuItem \n              onClick={handleDelete} \n              disabled={isLoading}\n              className=\"text-destructive focus:text-destructive\"\n            >\n              <X className=\"h-4 w-4 mr-2\" />\n              Delete\n            </DropdownMenuItem>\n          </DropdownMenuContent>\n        </DropdownMenu>\n      </div>\n    </div>\n  )\n}"