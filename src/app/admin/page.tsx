import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin-auth'
import { AdminPageClient } from '@/components/admin/admin-page-client'

export const metadata = {
  title: 'Admin Dashboard | Community Platform',
  description: 'Administrative dashboard for community platform management',
}

export default async function AdminPage() {
  const adminUser = await checkAdminAuth()

  if (!adminUser) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  return <AdminPageClient adminUser={adminUser} />
}

