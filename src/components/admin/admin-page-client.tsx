'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamic imports for admin components
const AdminLayout = dynamic(
  () => import('@/components/admin/admin-layout').then(mod => ({ default: mod.AdminLayout })),
  {
    loading: () => (
      <div className="min-h-screen bg-muted/30 animate-pulse">
        <div className="h-16 bg-muted" />
        <div className="container mx-auto px-4 py-6">
          <div className="h-96 bg-muted rounded-lg" />
        </div>
      </div>
    ),
  }
)

const AdminDashboard = dynamic(
  () => import('@/components/admin/admin-dashboard').then(mod => ({ default: mod.AdminDashboard })),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    ),
    ssr: false,
  }
)

interface AdminPageClientProps {
  adminUser: any
}

export function AdminPageClient({ adminUser }: AdminPageClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-muted/30 animate-pulse">
        <div className="h-16 bg-muted" />
        <div className="container mx-auto px-4 py-6">
          <div className="h-96 bg-muted rounded-lg" />
        </div>
      </div>
    }>
      <AdminLayout adminUser={adminUser}>
        <Suspense fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </div>
        }>
          <AdminDashboard adminUser={adminUser} />
        </Suspense>
      </AdminLayout>
    </Suspense>
  )
}