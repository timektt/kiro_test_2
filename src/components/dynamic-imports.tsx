/**
 * Dynamic imports for code splitting and performance optimization
 */

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
)

// Admin components - loaded only when needed
export const AdminDashboard = dynamic(
  () => import('@/components/admin/admin-dashboard').then(mod => ({ default: mod.AdminDashboard })),
  {
    loading: LoadingSpinner,
    ssr: false, // Admin components don't need SSR
  }
)

export const UserManagement = dynamic(
  () => import('@/components/admin/user-management').then(mod => ({ default: mod.UserManagement })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

export const ContentModeration = dynamic(
  () => import('@/components/admin/content-moderation').then(mod => ({ default: mod.ContentModeration })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

// Heavy UI components - loaded on demand
export const RankingBoard = dynamic(
  () => import('@/components/rankings/ranking-board').then(mod => ({ default: mod.RankingBoard })),
  {
    loading: LoadingSpinner,
  }
)

export const MBTISelector = dynamic(
  () => import('@/components/identity/mbti-selector').then(mod => ({ default: mod.MBTISelector })),
  {
    loading: LoadingSpinner,
  }
)

export const ProfileEditForm = dynamic(
  () => import('@/components/profile/profile-edit-form').then(mod => ({ default: mod.ProfileEditForm })),
  {
    loading: LoadingSpinner,
  }
)

// Chart components - loaded only when needed
export const AnalyticsChart = dynamic(
  () => import('@/components/analytics/chart').catch(() => ({ default: () => <div>Chart not available</div> })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

// Modal components - loaded on demand
export const PostComposerModal = dynamic(
  () => import('@/components/modals/post-composer-modal').catch(() => ({ 
    default: () => import('@/components/ui/post-composer').then(mod => ({ default: mod.PostComposer }))
  })),
  {
    loading: LoadingSpinner,
  }
)

// Settings components - loaded when accessed
export const SettingsPanel = dynamic(
  () => import('@/components/settings/settings-panel').catch(() => ({ default: () => <div>Settings not available</div> })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

// Notification components - can be lazy loaded
export const NotificationsList = dynamic(
  () => import('@/components/notifications/notifications-list').then(mod => ({ default: mod.NotificationsList })),
  {
    loading: () => (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    ),
  }
)

// Search components - loaded when search is used
export const SearchResults = dynamic(
  () => import('@/components/search/search-results').catch(() => ({ default: () => <div>Search not available</div> })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

// File upload components - loaded when needed
export const FileUploader = dynamic(
  () => import('@/components/upload/file-uploader').catch(() => ({ default: () => <div>Upload not available</div> })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
)

// Helper function to create dynamic component with error boundary
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loading?: ComponentType
    ssr?: boolean
    fallback?: ComponentType
  } = {}
) {
  return dynamic(
    () => importFn().catch(() => ({ 
      default: options.fallback || (() => <div>Component not available</div>) 
    })),
    {
      loading: options.loading || LoadingSpinner,
      ssr: options.ssr !== false,
    }
  )
}

// Preload functions for critical components
export const preloadAdminComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload admin components when user is likely to access them
    import('@/components/admin/admin-dashboard')
    import('@/components/admin/user-management')
    import('@/components/admin/content-moderation')
  }
}

export const preloadProfileComponents = () => {
  if (typeof window !== 'undefined') {
    import('@/components/profile/profile-edit-form')
    import('@/components/identity/mbti-selector')
  }
}

export const preloadRankingComponents = () => {
  if (typeof window !== 'undefined') {
    import('@/components/rankings/ranking-board')
  }
}

