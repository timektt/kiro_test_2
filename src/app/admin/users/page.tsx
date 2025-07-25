import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/admin-auth'
import { AdminLayout } from '@/components/admin/admin-layout'
import { UserManagement } from '@/components/admin/user-management'

export const metadata = {
  title: 'User Management | Admin Dashboard',
  description: 'Manage users and their roles',
}

export default async function AdminUsersPage() {
  const adminUser = await checkAdminAuth()

  if (!adminUser) {
    redirect('/auth/signin?callbackUrl=/admin/users')
  }

  // Check if user has permission for user management
  if (adminUser.role !== 'ADMIN') {
    redirect('/admin')
  }

  return (
    <AdminLayout adminUser={adminUser}>
      <UserManagement adminUser={adminUser} />
    </AdminLayout>
  )
}
