'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Users, User } from 'lucide-react'

interface Chat {
  id: string
  name?: string
  type: 'DIRECT' | 'GROUP'
  createdAt: string
  updatedAt: string
  lastMessageAt?: string
  participants: {
    userId: string
    joinedAt: string
    user: {
      id: string
      username: string
      name: string
      image?: string
    }
  }[]
  lastMessage?: {
    id: string
    content: string
    type: string
    createdAt: string
    sender: {
      username: string
      name: string
    }
  }
  _count: {
    messages: number
    participants: number
  }
}

interface ChatSidebarProps {
  chats: Chat[]
  currentChat: Chat | null
  onChatSelect: (chat: Chat) => void
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
  collapsed: boolean
  onlineUsers: Set<string>
}

export function ChatSidebar({
  chats,
  currentChat,
  onChatSelect,
  onLoadMore,
  hasMore,
  loading,
  collapsed,
  onlineUsers
}: ChatSidebarProps) {
  const { data: session } = useSession()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const getChatDisplayInfo = (chat: Chat) => {
    if (chat.type === 'GROUP') {
      return {
        name: chat.name || `กลุ่ม ${chat._count.participants} คน`,
        avatar: null,
        isOnline: false
      }
    }

    // For direct chats, find the other participant
    const otherParticipant = chat.participants.find(
      p => p.user.id !== session?.user?.id
    )

    if (!otherParticipant) {
      return {
        name: 'ไม่ทราบชื่อ',
        avatar: null,
        isOnline: false
      }
    }

    return {
      name: otherParticipant.user.name || otherParticipant.user.username,
      avatar: otherParticipant.user.image,
      isOnline: onlineUsers.has(otherParticipant.user.id)
    }
  }

  const formatLastMessageTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: th
      })
    } catch {
      return ''
    }
  }

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (collapsed) {
    return (
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {chats.map((chat) => {
            const { avatar, isOnline } = getChatDisplayInfo(chat)
            const isActive = currentChat?.id === chat.id

            return (
              <Button
                key={chat.id}
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onChatSelect(chat)}
                className="w-full h-12 p-2 relative"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatar || undefined} />
                    <AvatarFallback className="text-xs">
                      {chat.type === 'GROUP' ? (
                        <Users className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
              </Button>
            )
          })}

          {loading && (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    )
  }

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-2 space-y-1">
        {chats.map((chat) => {
          const { name, avatar, isOnline } = getChatDisplayInfo(chat)
          const isActive = currentChat?.id === chat.id

          return (
            <Button
              key={chat.id}
              variant={isActive ? 'secondary' : 'ghost'}
              onClick={() => onChatSelect(chat)}
              className="w-full h-16 p-3 justify-start relative hover:bg-accent/50"
            >
              <div className="flex items-center gap-3 w-full">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatar || undefined} />
                    <AvatarFallback>
                      {chat.type === 'GROUP' ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{name}</h4>
                    {chat.lastMessage && (
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatLastMessageTime(chat.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  
                  {chat.lastMessage ? (
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.lastMessage.sender.name}: {truncateMessage(chat.lastMessage.content)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {chat.type === 'GROUP' ? 'กลุ่มใหม่' : 'แชทใหม่'}
                    </p>
                  )}
                </div>

                {/* Unread indicator */}
                {chat._count.messages > 0 && (
                  <div className="flex-shrink-0">
                    <Badge variant="secondary" className="h-5 px-2 text-xs">
                      {chat._count.messages > 99 ? '99+' : chat._count.messages}
                    </Badge>
                  </div>
                )}
              </div>
            </Button>
          )
        })}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more button */}
        {hasMore && !loading && (
          <Button
            variant="ghost"
            onClick={onLoadMore}
            className="w-full mt-2"
            size="sm"
          >
            โหลดแชทเพิ่มเติม
          </Button>
        )}

        {/* Empty state */}
        {chats.length === 0 && !loading && (
          <div className="text-center py-8">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">ยังไม่มีแชท</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}