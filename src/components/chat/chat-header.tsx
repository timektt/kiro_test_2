'use client'

import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Users, User, MoreVertical, Phone, Video, Info, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  _count: {
    messages: number
    participants: number
  }
}

interface ChatHeaderProps {
  chat: Chat
  onlineUsers: Set<string>
  isConnected: boolean
}

export function ChatHeader({ chat, onlineUsers, isConnected }: ChatHeaderProps) {
  const { data: session } = useSession()

  const getChatDisplayInfo = () => {
    if (chat.type === 'GROUP') {
      const onlineCount = chat.participants.filter(p => 
        onlineUsers.has(p.user.id)
      ).length
      
      const memberCount = chat._count.participants
      const onlineText = onlineCount > 0 ? ` &bull; ${onlineCount} online` : ''
      return {
        name: chat.name || `Group ${memberCount} members`,
      subtitle: `${memberCount} members${onlineText}`,
        avatar: null,
        isOnline: onlineCount > 0
      }
    }

    // For direct chats, find the other participant
    const otherParticipant = chat.participants.find(
      p => p.user.id !== session?.user?.id
    )

    if (!otherParticipant) {
      const unknownName = 'Unknown'
const notConnected = 'Not connected'
      return {
        name: unknownName,
        subtitle: notConnected,
        avatar: null,
        isOnline: false
      }
    }

    const isOnline = onlineUsers.has(otherParticipant.user.id)
    
    const onlineText = 'Online'
const offlineText = 'Offline'
    
    return {
      name: otherParticipant.user.name || otherParticipant.user.username,
      subtitle: isOnline ? onlineText : offlineText,
      avatar: otherParticipant.user.image,
      isOnline
    }
  }

  const { name, subtitle, avatar, isOnline } = getChatDisplayInfo()

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg truncate">{name}</h2>
            {!isConnected && (
              <Badge variant="destructive" className="text-xs">
                Disconnected
              </Badge>
            )}
          </div>
          <p className={cn(
            'text-sm truncate',
            isOnline ? 'text-green-600' : 'text-muted-foreground'
          )}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Call buttons for direct chats */}
        {chat.type === 'DIRECT' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              disabled={!isConnected || !isOnline}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              disabled={!isConnected || !isOnline}
            >
              <Video className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* More options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Info className="h-4 w-4 mr-2" />
              Chat Info
            </DropdownMenuItem>
            
            {chat.type === 'GROUP' && (
              <>
                <DropdownMenuItem>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem className="text-destructive">
              {chat.type === 'GROUP' ? 'Leave Group' : 'Delete Chat'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
