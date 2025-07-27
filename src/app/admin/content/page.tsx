import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { ContentModeration } from '@/components/admin/content-moderation'

export const metadata = {
  title: 'Content Moderation | Admin Dashboard',
  description: 'Moderate posts and comments',
}

export default async function AdminContentPage() {
  const adminUser = await checkAdminAuth()

  if (!adminUser) {
    redirect('/auth/signin?callbackUrl=/admin/content')
  }

  return (
    <AdminLayout adminUser={adminUser}>
      <ContentModeration adminUser={adminUser} />
    </AdminLayout>
  )
}

