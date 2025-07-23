import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SessionProvider } from '@/components/providers/session-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/layout/navbar'
import { MobileNav } from '@/components/layout/mobile-nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Community Platform',
  description: 'A modern social community platform for connecting and sharing',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="community-platform-theme"
        >
          <SessionProvider session={session}>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="pb-16 md:pb-0">{children}</main>
              {session && (
                <MobileNav 
                  userId={session.user.id}
                  username={session.user.username}
                  notificationCount={3}
                />
              )}
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}