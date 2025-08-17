'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { ChatMessage, ChatRoom } from '@/lib/socket'
import { logger } from '@/lib/logger'

interface UseSocketReturn {
  socket: Socket | null
  isConnected: boolean
  joinChat: (chatId: string) => void
  leaveChat: (chatId: string) => void
  sendMessage: (data: {
    chatId: string
    content: string
    type?: 'TEXT' | 'IMAGE' | 'FILE'
    replyToId?: string
  }) => void
  markMessagesAsRead: (messageIds: string[]) => void
  startTyping: (chatId: string) => void
  stopTyping: (chatId: string) => void
  onlineUsers: Set<string>
  typingUsers: Map<string, Set<string>> // chatId -> Set of userIds
}

export const useSocket = (): UseSocketReturn => {
  const { data: session } = useSession()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(new Map())
  const typingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    if (!session?.user?.id) return

    // Initialize socket connection
    const socketInstance = io({
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    socketInstance.on('connect', () => {
      logger.info('Socket connected')
      setIsConnected(true)
      
      // Join user to socket
      socketInstance.emit('user:join', {
        userId: session.user.id,
        username: session.user.username || session.user.name || 'Unknown'
      })
    })

    socketInstance.on('disconnect', () => {
      logger.info('Socket disconnected')
      setIsConnected(false)
    })

    // Handle user online/offline status
    socketInstance.on('user:online', (data: { userId: string, username: string }) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]))
    })

    socketInstance.on('user:offline', (data: { userId: string, username: string }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(data.userId)
        return newSet
      })
    })

    // Handle typing indicators
    socketInstance.on('typing:start', (data: { userId: string, username: string, chatId: string }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev)
        const chatTypers = newMap.get(data.chatId) || new Set()
        chatTypers.add(data.userId)
        newMap.set(data.chatId, chatTypers)
        return newMap
      })

      // Clear typing after timeout
      const timeoutKey = `${data.chatId}-${data.userId}`
      const existingTimeout = typingTimeouts.current.get(timeoutKey)
      if (existingTimeout) {
        clearTimeout(existingTimeout)
      }

      const timeout = setTimeout(() => {
        setTypingUsers(prev => {
          const newMap = new Map(prev)
          const chatTypers = newMap.get(data.chatId)
          if (chatTypers) {
            chatTypers.delete(data.userId)
            if (chatTypers.size === 0) {
              newMap.delete(data.chatId)
            } else {
              newMap.set(data.chatId, chatTypers)
            }
          }
          return newMap
        })
        typingTimeouts.current.delete(timeoutKey)
      }, 3000)

      typingTimeouts.current.set(timeoutKey, timeout)
    })

    socketInstance.on('typing:stop', (data: { userId: string, chatId: string }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev)
        const chatTypers = newMap.get(data.chatId)
        if (chatTypers) {
          chatTypers.delete(data.userId)
          if (chatTypers.size === 0) {
            newMap.delete(data.chatId)
          } else {
            newMap.set(data.chatId, chatTypers)
          }
        }
        return newMap
      })

      // Clear timeout
      const timeoutKey = `${data.chatId}-${data.userId}`
      const existingTimeout = typingTimeouts.current.get(timeoutKey)
      if (existingTimeout) {
        clearTimeout(existingTimeout)
        typingTimeouts.current.delete(timeoutKey)
      }
    })

    socketInstance.on('error', (error: { message: string }) => {
      logger.error('Socket error:', error)
    })

    setSocket(socketInstance)

    return () => {
      // Clear all typing timeouts
      typingTimeouts.current.forEach(timeout => clearTimeout(timeout))
      typingTimeouts.current.clear()
      
      socketInstance.disconnect()
    }
  }, [session?.user?.id])

  const joinChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('chat:join', chatId)
    }
  }

  const leaveChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('chat:leave', chatId)
    }
  }

  const sendMessage = (data: {
    chatId: string
    content: string
    type?: 'TEXT' | 'IMAGE' | 'FILE'
    replyToId?: string
  }) => {
    if (socket && isConnected) {
      socket.emit('message:send', data)
    }
  }

  const markMessagesAsRead = (messageIds: string[]) => {
    if (socket && isConnected && messageIds.length > 0) {
      socket.emit('message:read', { messageIds })
    }
  }

  const startTyping = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('typing:start', { chatId })
    }
  }

  const stopTyping = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit('typing:stop', { chatId })
    }
  }

  return {
    socket,
    isConnected,
    joinChat,
    leaveChat,
    sendMessage,
    markMessagesAsRead,
    startTyping,
    stopTyping,
    onlineUsers,
    typingUsers
  }
}