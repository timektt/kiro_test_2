import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

// Loading component for admin components
const AdminLoadingFallback = () => (
  <Card>
    <CardContent className="pt-6">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

// Dynamically imported admin components
export const DynamicUserManagement = dynamic(
  () => import('./user-management').then(mod => ({ default: mod.UserManagement })),
  {
    loading: () => <AdminLoadingFallback />,
    ssr: false
  }
)

export const DynamicContentModeration = dynamic(
  () => import('./content-moderation').then(mod => ({ default: mod.ContentModeration })),
  {
    loading: () => <AdminLoadingFallback />,
    ssr: false
  }
)

export const DynamicAdminDashboard = dynamic(
  () => import('./admin-dashboard').then(mod => ({ default: mod.AdminDashboard })),
  {
    loading: () => <AdminLoadingFallback />,
    ssr: false
  }
)
