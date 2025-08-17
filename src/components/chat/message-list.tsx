'use client'

import { forwardRef } from 'react'
import { MessageItem } from './message-item'
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

interface MessageListProps {
  messages: ChatMessage[]
  currentUserId?: string
  onReply: (message: ChatMessage) => void
  chat: Chat
  className?: string
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, currentUserId, onReply, chat, className }, ref) => {
    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
      const date = new Date(message.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
      return groups
    }, {} as Record<string, ChatMessage[]>)

    // Sort dates in descending order (newest first)
    const sortedDates = Object.keys(groupedMessages).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    )

    const formatDateHeader = (dateString: string) => {
      const date = new Date(dateString)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const todayText = {'วันนี้'}
      const yesterdayText = {'เมื่อวาน'}
      
      if (date.toDateString() === today.toDateString()) {
        return todayText
      } else if (date.toDateString() === yesterday.toDateString()) {
        return yesterdayText
      } else {
        return date.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    }

    const shouldShowAvatar = (message: ChatMessage, index: number, dayMessages: ChatMessage[]) => {
      // Always show avatar for group chats
      if (chat.type === 'GROUP') return true
      
      // For direct chats, show avatar if it's the first message of the day
      // or if the previous message was from a different sender
      if (index === dayMessages.length - 1) return true
      
      const nextMessage = dayMessages[index + 1]
      return nextMessage.senderId !== message.senderId
    }

    const shouldShowSenderName = (message: ChatMessage, index: number, dayMessages: ChatMessage[]) => {
      // Only show sender name in group chats
      if (chat.type !== 'GROUP') return false
      
      // Show name if it's the first message of the day
      // or if the previous message was from a different sender
      if (index === dayMessages.length - 1) return true
      
      const nextMessage = dayMessages[index + 1]
      return nextMessage.senderId !== message.senderId
    }

    const shouldShowTimestamp = (message: ChatMessage, index: number, dayMessages: ChatMessage[]) => {
      // Show timestamp if it's the last message from this sender
      // or if more than 5 minutes have passed since the next message
      if (index === 0) return true
      
      const prevMessage = dayMessages[index - 1]
      if (prevMessage.senderId !== message.senderId) return true
      
      const timeDiff = new Date(prevMessage.createdAt).getTime() - new Date(message.createdAt).getTime()
      return timeDiff > 5 * 60 * 1000 // 5 minutes
    }

    if (messages.length === 0) {
      const noMessagesText = {'ยังไม่มีข้อความ'}
      const startConversationText = {'เริ่มสนทนาด้วยการส่งข้อความแรก'}
      
      return (
        <div ref={ref} className={cn('flex-1 flex items-center justify-center p-8', className)}>
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">{noMessagesText}</p>
            <p className="text-sm">{startConversationText}</p>
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('flex flex-col-reverse gap-1 p-4', className)}>
        {sortedDates.map((date) => {
          const dayMessages = groupedMessages[date]
          // Sort messages within each day in descending order (newest first)
          const sortedDayMessages = [...dayMessages].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )

          return (
            <div key={date} className="flex flex-col-reverse">
              {/* Messages for this day */}
              {sortedDayMessages.map((message, index) => {
                const isOwn = message.senderId === currentUserId
                const showAvatar = shouldShowAvatar(message, index, sortedDayMessages)
                const showSenderName = shouldShowSenderName(message, index, sortedDayMessages)
                const showTimestamp = shouldShowTimestamp(message, index, sortedDayMessages)

                return (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    showSenderName={showSenderName}
                    showTimestamp={showTimestamp}
                    onReply={() => onReply(message)}
                    chat={chat}
                  />
                )
              })}

              {/* Date header */}
              <div className="flex justify-center my-4">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {formatDateHeader(date)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)

MessageList.displayName = 'MessageList'