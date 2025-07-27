'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useUserStore } from '@/stores/user-store'
import { useUIStore } from '@/stores/ui-store'
import { ToastProvider } from '@/components/ui/toast-provider'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const { data: session, status } = useSession()
  const { setCurrentUser, setAuthenticated, clearUserData } = useUserStore()
  const { addToast } = useUIStore()

  // Sync session with user store
  useEffect(() => {
    if (status === 'loading') return

    if (session?.user) {
      setCurrentUser({
        id: session.user.id,
        username: session.user.username || '',
        name: session.user.name,
        email: session.user.email || '',
        image: session.user.image,
        bio: null,
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setAuthenticated(true)
    } else {
      clearUserData()
    }
  }, [session, status, setCurrentUser, setAuthenticated, clearUserData])

  // Show authentication status changes
  useEffect(() => {
    if (status === 'loading') return

    if (session?.user && status === 'authenticated') {
      addToast({
        type: 'success',
        title: 'Welcome back!',
        description: `Signed in as ${session.user.name || session.user.email}`,
      })
    }
  }, [session, status, addToast])

  return (
    <>
      {children}
      <ToastProvider />
    </>
  )
}

