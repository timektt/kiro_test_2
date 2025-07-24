import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export const metadata = {
  title: 'Admin Dashboard | Community Platform',
  description: 'Administrative dashboard for community platform management',
}

export default async function AdminPage() {
  const adminUser = await checkAdminAuth()

  if (!adminUser) {
    redirect('/auth/signin?callbackUrl=/admin')
  }

  return (
    <AdminLayout adminUser={adminUser}>
      <AdminDashboard adminUser={adminUser} />
    </AdminLayout>
  )
}