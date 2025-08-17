import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ChatContainer } from '@/components/chat/chat-container'

export const metadata: Metadata = {
  title: 'Chat | Community Platform',
  description: 'Real-time chat with community members'
}

export default async function ChatPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] py-4">
      <div className="h-full bg-card rounded-lg border shadow-sm overflow-hidden">
        <ChatContainer />
      </div>
    </div>
  )
}