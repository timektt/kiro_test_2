'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import { MoreHorizontal, Reply, Copy, Trash2, Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'FILE'
  senderId: string
  chatId: string
  replyToId?: string
  createdAt: string
  sender: {
    id: string
    username: string
    name: string
    image?: string
  }
  replyTo?: {
    id: string
    content: string
    sender: {
      username: string
      name: string
    }
  }
  readBy: {
    userId: string
    readAt: string
    user: {
      username: string
      name: string
    }
  }[]
}

interface Chat {
  id: string
  type: 'DIRECT' | 'GROUP'
  participants: {
    userId: string
    user: {
      id: string
      username: string
      name: string
      image?: string
    }
  }[]
}

interface MessageItemProps {
  message: ChatMessage
  isOwn: boolean
  showAvatar: boolean
  showSenderName: boolean
  showTimestamp: boolean
  onReply: () => void
  chat: Chat
}

export function MessageItem({
  message,
  isOwn,
  showAvatar,
  showSenderName,
  showTimestamp,
  onReply,
  chat
}: MessageItemProps) {
  const [showActions, setShowActions] = useState(false)

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return ''
    }
  }

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: th
      })
    } catch {
      return ''
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const getReadStatus = () => {
    if (!isOwn) return null
    
    const otherParticipants = chat.participants.filter(p => p.user.id !== message.senderId)
    const readByOthers = message.readBy.filter(read => read.userId !== message.senderId)
    
    const sentText = 'ส่งแล้ว'
const readText = 'อ่านแล้ว'
const peopleText = 'คน'
    
    if (readByOthers.length === 0) {
      return { icon: Check, color: 'text-muted-foreground', tooltip: sentText }
    } else if (readByOthers.length === otherParticipants.length) {
      return { icon: CheckCheck, color: 'text-blue-500', tooltip: readText }
    } else {
      return { icon: CheckCheck, color: 'text-muted-foreground', tooltip: `${readText} ${readByOthers.length}/${otherParticipants.length} ${peopleText}` }
    }
  }

  const readStatus = getReadStatus()
  const ReadIcon = readStatus?.icon

  return (
    <div
      className={cn(
        'flex gap-3 group hover:bg-accent/50 px-2 py-1 rounded-lg transition-colors',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={cn('flex-shrink-0', showAvatar ? 'opacity-100' : 'opacity-0')}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.image || undefined} />
          <AvatarFallback className="text-xs">
            {message.sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message Content */}
      <div className={cn('flex-1 min-w-0', isOwn ? 'text-right' : 'text-left')}>
        {/* Sender Name */}
        {showSenderName && !isOwn && (
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {message.sender.name}
          </p>
        )}

        {/* Reply Preview */}
        {message.replyTo && (
          <div className={cn(
            'mb-2 p-2 rounded border-l-2 bg-muted/50 text-sm',
            isOwn ? 'border-l-primary' : 'border-l-muted-foreground'
          )}>
            <p className="text-xs text-muted-foreground mb-1">
              {message.replyTo.sender.name}
            </p>
            <p className="truncate">{message.replyTo.content}</p>
          </div>
        )}

        {/* Message Bubble */}
        <div className={cn(
          'relative inline-block max-w-[70%] break-words',
          isOwn ? 'ml-auto' : 'mr-auto'
        )}>
          <div className={cn(
            'px-3 py-2 rounded-2xl',
            isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          )}>
            {/* Message Content */}
            <div className="whitespace-pre-wrap">
              {message.type === 'TEXT' && message.content}
              {message.type === 'IMAGE' && (
                <div>
                  <img
                    src={message.content}
                    alt="Image message"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
              {message.type === 'FILE' && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-background/20 rounded">
                    📎
                  </div>
                  <div>
                    <p className="font-medium">ไฟล์แนบ</p>
                    <p className="text-xs opacity-70">{message.content}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Actions */}
            {showActions && (
              <div className={cn(
                'absolute top-0 flex items-center gap-1',
                isOwn ? '-left-20' : '-right-20'
              )}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onReply}
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Reply className="h-3 w-3" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align={isOwn ? 'end' : 'start'}>
                    <DropdownMenuItem onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      คัดลอก
                    </DropdownMenuItem>
                    {isOwn && (
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        ลบข้อความ
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Timestamp and Read Status */}
          {showTimestamp && (
            <div className={cn(
              'flex items-center gap-1 mt-1 text-xs text-muted-foreground',
              isOwn ? 'justify-end' : 'justify-start'
            )}>
              <span>{formatTime(message.createdAt)}</span>
              {ReadIcon && (
                <ReadIcon className={cn('h-3 w-3', readStatus.color)} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}