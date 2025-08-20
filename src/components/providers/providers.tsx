'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { StoreProvider } from '@/components/providers/store-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import { PostComposerProvider } from '@/contexts/post-composer-context'

interface ProvidersProps {
  children: React.ReactNode
  session?: any
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <StoreProvider>
          <PostComposerProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </PostComposerProvider>
        </StoreProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default Providers
