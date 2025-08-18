import { useState } from 'react'
import { useSession } from 'next-auth/react'
import useSWR, { mutate } from 'swr'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  name: string
  image: string | null
  isActive: boolean
}

interface Message {
  id: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'FILE'
  createdAt: string
  sender: User
}

interface Conversation {
  id: string
  type: 'DIRECT' | 'GROUP'
  title: string | null
  createdAt: string
  updatedAt: string
  participant: User
  lastMessage: Message | null
  unreadCount: number
}

interface ConversationsResponse {
  conversations: Conversation[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

interface UseMessagingResult {
  conversations: Conversation[]
  isLoading: boolean
  error: Error | null
  createConversation: (participantId: string) => Promise<Conversation | null>
  startConversation: (participantId: string) => Promise<void>
  refresh: () => void
}

const fetcher = async (url: string): Promise<ConversationsResponse> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch conversations')
  }
  return response.json()
}

export function useMessaging(page = 1, limit = 20): UseMessagingResult {
  const { data: session } = useSession()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const {
    data,
    error,
    isLoading,
    mutate: mutateConversations
  } = useSWR<ConversationsResponse>(
    session?.user?.id ? `/api/chat/conversations?page=${page}&limit=${limit}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  )

  const createConversation = async (participantId: string): Promise<Conversation | null> => {
    if (!session?.user?.id) {
      toast.error('Please sign in to start a conversation')
      return null
    }

    if (isCreating) return null

    setIsCreating(true)
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ participantId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create conversation')
      }

      const result = await response.json()
      
      // Refresh conversations list
      mutateConversations()
      
      return result.conversation
    } catch (error) {
      console.error('Error creating conversation:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to start conversation')
      return null
    } finally {
      setIsCreating(false)
    }
  }

  const startConversation = async (participantId: string): Promise<void> => {
    const conversation = await createConversation(participantId)
    if (conversation) {
      // Navigate to the conversation
      router.push(`/chat/${conversation.id}`)
    }
  }

  return {
    conversations: data?.conversations || [],
    isLoading,
    error,
    createConversation,
    startConversation,
    refresh: mutateConversations
  }
}

// Hook for individual conversation messages
export function useConversation(conversationId: string) {
  const { data: session } = useSession()
  const [isSending, setIsSending] = useState(false)

  const {
    data,
    error,
    isLoading,
    mutate: mutateMessages
  } = useSWR(
    session?.user?.id && conversationId ? `/api/chat/conversations/${conversationId}/messages` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 3000 // Poll for new messages every 3 seconds
    }
  )

  const sendMessage = async (content: string, type: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT') => {
    if (!session?.user?.id) {
      toast.error('Please sign in to send messages')
      return
    }

    if (isSending || !content.trim()) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content.trim(), type })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      // Refresh messages
      mutateMessages()
      
      // Update conversations list to show new last message
      mutate('/api/chat/conversations')
      
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  return {
    messages: data?.messages || [],
    conversation: data?.conversation || null,
    isLoading,
    isSending,
    error,
    sendMessage,
    refresh: mutateMessages
  }
}

// Hook for checking if user can message another user
export function useCanMessage(userId: string) {
  const { data: session } = useSession()
  
  const {
    data,
    error,
    isLoading
  } = useSWR(
    session?.user?.id && userId ? `/api/users/${userId}/can-message` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000 // Cache for 30 seconds
    }
  )

  return {
    canMessage: data?.canMessage || false,
    reason: data?.reason || null,
    isLoading,
    error
  }
}