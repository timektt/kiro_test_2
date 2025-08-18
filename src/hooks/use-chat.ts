'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from './use-socket'
import logger from '@/lib/logger'

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

interface UseChatReturn {
  chats: Chat[]
  currentChat: Chat | null
  messages: ChatMessage[]
  loading: boolean
  error: string | null
  hasMoreMessages: boolean
  hasMoreChats: boolean
  loadChats: () => Promise<void>
  loadMoreChats: () => Promise<void>
  loadMessages: (chatId: string) => Promise<void>
  loadMoreMessages: () => Promise<void>
  sendMessage: (content: string, type?: 'TEXT' | 'IMAGE' | 'FILE', replyToId?: string) => Promise<void>
  createChat: (participantIds: string[], type?: 'DIRECT' | 'GROUP', name?: string) => Promise<Chat | null>
  setCurrentChat: (chat: Chat | null) => void
  markMessagesAsRead: (messageIds: string[]) => void
  refreshChat: (chatId: string) => Promise<void>
}

const MESSAGES_PER_PAGE = 50
const CHATS_PER_PAGE = 20

export const useChat = (): UseChatReturn => {
  const { data: session } = useSession()
  const { socket, isConnected, joinChat, leaveChat, sendMessage: socketSendMessage, markMessagesAsRead: socketMarkAsRead } = useSocket()
  
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [hasMoreChats, setHasMoreChats] = useState(true)
  const [chatPage, setChatPage] = useState(1)
  const [messagePage, setMessagePage] = useState(1)

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleNewMessage = (message: ChatMessage) => {
      setMessages(prev => {
        // Check if message already exists
        if (prev.some(m => m.id === message.id)) return prev
        return [message, ...prev]
      })

      // Update last message in chats list
      setChats(prev => prev.map(chat => {
        if (chat.id === message.chatId) {
          return {
            ...chat,
            lastMessage: {
              id: message.id,
              content: message.content,
              type: message.type,
              createdAt: message.createdAt,
              sender: {
                username: message.sender.username,
                name: message.sender.name
              }
            },
            lastMessageAt: message.createdAt
          }
        }
        return chat
      }))
    }

    const handleMessageRead = (data: { messageIds: string[], userId: string, readAt: string }) => {
      setMessages(prev => prev.map(message => {
        if (data.messageIds.includes(message.id)) {
          const existingRead = message.readBy.find(r => r.userId === data.userId)
          if (!existingRead) {
            return {
              ...message,
              readBy: [...message.readBy, {
                userId: data.userId,
                readAt: data.readAt,
                user: { username: '', name: '' } // Will be populated by API
              }]
            }
          }
        }
        return message
      }))
    }

    socket.on('message:new', handleNewMessage)
    socket.on('message:read', handleMessageRead)

    return () => {
      socket.off('message:new', handleNewMessage)
      socket.off('message:read', handleMessageRead)
    }
  }, [socket, isConnected])

  const loadChats = useCallback(async () => {
    if (!session?.user?.id) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/chat?page=1&limit=${CHATS_PER_PAGE}`)
      if (!response.ok) {
        throw new Error('Failed to load chats')
      }

      const data = await response.json()
      setChats(data.chats || [])
      setHasMoreChats(data.hasMore || false)
      setChatPage(1)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chats'
      setError(errorMessage)
      logger.error('Error loading chats:', err)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  const loadMoreChats = useCallback(async () => {
    if (!session?.user?.id || !hasMoreChats || loading) return

    setLoading(true)
    const nextPage = chatPage + 1

    try {
      const response = await fetch(`/api/chat?page=${nextPage}&limit=${CHATS_PER_PAGE}`)
      if (!response.ok) {
        throw new Error('Failed to load more chats')
      }

      const data = await response.json()
      setChats(prev => [...prev, ...(data.chats || [])])
      setHasMoreChats(data.hasMore || false)
      setChatPage(nextPage)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more chats'
      setError(errorMessage)
      logger.error('Error loading more chats:', err)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, hasMoreChats, loading, chatPage])

  const loadMessages = useCallback(async (chatId: string) => {
    if (!session?.user?.id) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/chat/${chatId}/messages?page=1&limit=${MESSAGES_PER_PAGE}`)
      if (!response.ok) {
        throw new Error('Failed to load messages')
      }

      const data = await response.json()
      setMessages(data.messages || [])
      setHasMoreMessages(data.hasMore || false)
      setMessagePage(1)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages'
      setError(errorMessage)
      logger.error('Error loading messages:', err)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  const loadMoreMessages = useCallback(async () => {
    if (!currentChat || !hasMoreMessages || loading) return

    setLoading(true)
    const nextPage = messagePage + 1

    try {
      const response = await fetch(`/api/chat/${currentChat.id}/messages?page=${nextPage}&limit=${MESSAGES_PER_PAGE}`)
      if (!response.ok) {
        throw new Error('Failed to load more messages')
      }

      const data = await response.json()
      setMessages(prev => [...prev, ...(data.messages || [])])
      setHasMoreMessages(data.hasMore || false)
      setMessagePage(nextPage)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more messages'
      setError(errorMessage)
      logger.error('Error loading more messages:', err)
    } finally {
      setLoading(false)
    }
  }, [currentChat, hasMoreMessages, loading, messagePage])

  const sendMessage = useCallback(async (
    content: string,
    type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT',
    replyToId?: string
  ) => {
    if (!currentChat || !session?.user?.id || !content.trim()) return

    try {
      // Send via socket for real-time delivery
      socketSendMessage({
        chatId: currentChat.id,
        content: content.trim(),
        type,
        replyToId
      })

      // Also send via API for persistence
      const response = await fetch(`/api/chat/${currentChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content.trim(),
          type,
          replyToId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
      logger.error('Error sending message:', err)
    }
  }, [currentChat, session?.user?.id, socketSendMessage])

  const createChat = useCallback(async (
    participantIds: string[],
    type: 'DIRECT' | 'GROUP' = 'DIRECT',
    name?: string
  ): Promise<Chat | null> => {
    if (!session?.user?.id) return null

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantIds,
          type,
          name
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create chat')
      }

      const newChat = await response.json()
      setChats(prev => [newChat, ...prev])
      return newChat
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create chat'
      setError(errorMessage)
      logger.error('Error creating chat:', err)
      return null
    }
  }, [session?.user?.id])

  const setCurrentChat = useCallback((chat: Chat | null) => {
    // Leave previous chat
    if (currentChat) {
      leaveChat(currentChat.id)
    }

    setCurrentChatState(chat)
    setMessages([])
    setHasMoreMessages(true)
    setMessagePage(1)

    // Join new chat and load messages
    if (chat) {
      joinChat(chat.id)
      loadMessages(chat.id)
    }
  }, [currentChat, leaveChat, joinChat, loadMessages])

  const markMessagesAsRead = useCallback((messageIds: string[]) => {
    if (messageIds.length > 0) {
      socketMarkAsRead(messageIds)
    }
  }, [socketMarkAsRead])

  const refreshChat = useCallback(async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat?page=1&limit=${CHATS_PER_PAGE}`)
      if (!response.ok) return

      const data = await response.json()
      const updatedChat = data.chats?.find((c: Chat) => c.id === chatId)
      
      if (updatedChat) {
        setChats(prev => prev.map(chat => 
          chat.id === chatId ? updatedChat : chat
        ))
        
        if (currentChat?.id === chatId) {
          setCurrentChatState(updatedChat)
        }
      }
    } catch (err) {
      logger.error('Error refreshing chat:', err)
    }
  }, [currentChat?.id])

  // Load chats on mount
  useEffect(() => {
    if (session?.user?.id) {
      loadChats()
    }
  }, [session?.user?.id, loadChats])

  return {
    chats,
    currentChat,
    messages,
    loading,
    error,
    hasMoreMessages,
    hasMoreChats,
    loadChats,
    loadMoreChats,
    loadMessages,
    loadMoreMessages,
    sendMessage,
    createChat,
    setCurrentChat,
    markMessagesAsRead,
    refreshChat
  }
}