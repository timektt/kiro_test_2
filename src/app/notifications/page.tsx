import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NotificationsList } from '@/components/notifications/notifications-list'

export const metadata = {
  title: 'Notifications | Community Platform',
  description: 'View and manage your notifications',
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className=\"container max-w-4xl mx-auto py-8\">
      <NotificationsList />
    </div>
  )
}