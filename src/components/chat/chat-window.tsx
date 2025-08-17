'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/hooks/use-socket'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { TypingIndicator } from './typing-indicator'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, ArrowDown } from 'lucide-react'
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
  name?: string
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

interface ChatWindowProps {
  chat: Chat
  messages: ChatMessage[]
  onSendMessage: (content: string, type?: 'TEXT' | 'IMAGE' | 'FILE', replyToId?: string) => Promise<void>
  onLoadMore: () => Promise<void>
  onMarkAsRead: (messageIds: string[]) => void
  hasMore: boolean
  loading: boolean
  error: string | null
}

export function ChatWindow({
  chat,
  messages,
  onSendMessage,
  onLoadMore,
  onMarkAsRead,
  hasMore,
  loading,
  error
}: ChatWindowProps) {
  const { data: session } = useSession()
  const { typingUsers, startTyping, stopTyping } = useSocket()
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<string | null>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[0]
      if (latestMessage.id !== lastMessageRef.current) {
        lastMessageRef.current = latestMessage.id
        
        // Only auto-scroll if user sent the message or if already at bottom
        if (latestMessage.senderId === session?.user?.id || !showScrollButton) {
          scrollToBottom()
        }
      }
    }
  }, [messages, session?.user?.id, showScrollButton])

  // Handle scroll events to show/hide scroll button
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // Mark messages as read when they come into view
  useEffect(() => {
    if (!session?.user?.id) return

    const unreadMessages = messages.filter(msg => 
      msg.senderId !== session.user.id && 
      !msg.readBy.some(read => read.userId === session.user.id)
    )

    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(msg => msg.id)
      onMarkAsRead(messageIds)
    }
  }, [messages, session?.user?.id, onMarkAsRead])

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'instant' 
    })
  }

  const handleSendMessage = async (content: string, type?: 'TEXT' | 'IMAGE' | 'FILE') => {
    try {
      await onSendMessage(content, type, replyToMessage?.id)
      setReplyToMessage(null)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleTypingStart = () => {
    startTyping(chat.id)
  }

  const handleTypingStop = () => {
    stopTyping(chat.id)
  }

  const currentTypingUsers = typingUsers.get(chat.id) || new Set()
  const typingUserNames = Array.from(currentTypingUsers)
    .filter(userId => userId !== session?.user?.id)
    .map(userId => {
      const participant = chat.participants.find(p => p.user.id === userId)
      const unknownName = {'ไม่ทราบชื่อ'}
      return participant?.user.name || participant?.user.username || unknownName
    })

  return (
    <div className="flex flex-col h-full">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="m-4 mb-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto relative"
      >
        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {'กำลังโหลด...'}
                </>
              ) : (
                {'โหลดข้อความเก่า'}
              )}
            </Button>
          </div>
        )}

        {/* Messages */}
        <MessageList
          messages={messages}
          currentUserId={session?.user?.id}
          onReply={setReplyToMessage}
          chat={chat}
        />

        {/* Typing Indicator */}
        {typingUserNames.length > 0 && (
          <div className="px-4 pb-2">
            <TypingIndicator userNames={typingUserNames} />
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />

        {/* Scroll to bottom button */}
        {showScrollButton && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => scrollToBottom()}
            className="absolute bottom-4 right-4 rounded-full h-10 w-10 p-0 shadow-lg"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Reply Preview */}
      {replyToMessage && (
        <div className="px-4 py-2 border-t bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">
                {'ตอบกลับ'} {replyToMessage.sender.name}
              </p>
              <p className="text-sm truncate">
                {replyToMessage.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyToMessage(null)}
              className="h-8 w-8 p-0 ml-2"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t">
        <MessageInput
          onSendMessage={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          disabled={loading}
          placeholder={(() => {
            const groupPlaceholder = {'ส่งข้อความถึงกลุ่ม...'}
             const chatPrefix = {'ส่งข้อความถึง '}
             const chatSuffix = {'...'}
             const defaultChat = {'แชท'}
            
            if (chat.type === 'GROUP') {
              return groupPlaceholder
            } else {
              const targetUser = chat.participants.find(p => p.user.id !== session?.user?.id)?.user.name || defaultChat
              return `${chatPrefix}${targetUser}${chatSuffix}`
            }
          })()}
        />
      </div>
    </div>
  )
}