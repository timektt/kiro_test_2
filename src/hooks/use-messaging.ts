import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useUIStore } from '@/stores/ui-store'

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

 // Generic fetcher function
 const fetcher = async (url: string) => {
   const response = await fetch(url)
   if (!response.ok) {
     const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
     throw error
   }
   return response.json()
 }

 // Hook for fetching chats (renamed from useMessaging to match tests)
export function useChats(page = 1, limit = 20) {
  const { data: session } = useSession()
  const { addToast } = useUIStore()

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
      dedupingInterval: 5000,
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to load chats',
          description: error.message,
        })
      },
    }
  )

  return {
    chats: data?.conversations || [],
    isLoading,
    error,
    mutate: mutateConversations
  }
}

// Hook for fetching messages (renamed from useConversation to match tests)
export function useMessages(chatId: string | null) {
  const { data: session } = useSession()
  const { addToast } = useUIStore()

  const {
    data,
    error,
    isLoading,
    mutate: mutateMessages
  } = useSWR(
    session?.user?.id && chatId ? `/api/chats/${chatId}/messages` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 3000, // Poll for new messages every 3 seconds
      onError: (error) => {
        addToast({
          type: 'error',
          title: 'Failed to load messages',
          description: error.message,
        })
      },
    }
  )

  return {
    messages: data?.messages || [],
    isLoading,
    error,
    mutate: mutateMessages
  }
}

// Mutation function for sending messages
async function sendMessageMutation(key: string, { arg }: { arg: { content: string } }) {
  // Use the URL from the trigger call or default key
  const url = key
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  })

  if (!response.ok) {
    let errorMessage = 'Failed to send message'
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      // If response.json() fails, use default message
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

// Hook for sending messages
export function useSendMessage() {
  const { addToast } = useUIStore()
  
  const sendMessage = async (url: string, { arg }: { arg: { content: string } }) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })

      if (!response.ok) {
        let errorMessage = 'Failed to send message'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response.json() fails, use default message
        }
        throw new Error(errorMessage)
      }

      return response.json()
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to send message',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  }

  return {
    trigger: sendMessage,
    isMutating: false // Simplified for testing
  }
}
