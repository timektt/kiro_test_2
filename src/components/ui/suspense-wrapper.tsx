/**
 * Suspense wrapper components for better loading UX
 */

import { Suspense, ReactNode } from 'react'
import { ErrorBoundary } from './error-boundary'

interface SuspenseWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
}

// Loading skeleton components
export const PostSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-muted rounded-full" />
      <div className="space-y-1">
        <div className="w-24 h-4 bg-muted rounded" />
        <div className="w-16 h-3 bg-muted rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="w-full h-4 bg-muted rounded" />
      <div className="w-3/4 h-4 bg-muted rounded" />
    </div>
    <div className="flex space-x-4">
      <div className="w-12 h-6 bg-muted rounded" />
      <div className="w-12 h-6 bg-muted rounded" />
    </div>
  </div>
)

export const FeedSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>
)

export const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-20 h-20 bg-muted rounded-full" />
      <div className="space-y-2">
        <div className="w-32 h-6 bg-muted rounded" />
        <div className="w-24 h-4 bg-muted rounded" />
        <div className="w-48 h-4 bg-muted rounded" />
      </div>
    </div>
    <div className="flex space-x-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="text-center space-y-1">
          <div className="w-8 h-6 bg-muted rounded mx-auto" />
          <div className="w-12 h-4 bg-muted rounded" />
        </div>
      ))}
    </div>
  </div>
)

export const NotificationSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-start space-x-3 p-3 animate-pulse">
        <div className="w-6 h-6 bg-muted rounded" />
        <div className="flex-1 space-y-1">
          <div className="w-full h-4 bg-muted rounded" />
          <div className="w-16 h-3 bg-muted rounded" />
        </div>
      </div>
    ))}
  </div>
)

export const RankingSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 p-3 border rounded animate-pulse">
        <div className="w-6 h-6 bg-muted rounded text-center" />
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="flex-1 space-y-1">
          <div className="w-32 h-4 bg-muted rounded" />
          <div className="w-24 h-3 bg-muted rounded" />
        </div>
        <div className="w-12 h-6 bg-muted rounded" />
      </div>
    ))}
  </div>
)

export const AdminSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg space-y-2">
          <div className="w-16 h-4 bg-muted rounded" />
          <div className="w-8 h-8 bg-muted rounded" />
        </div>
      ))}
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border rounded">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="space-y-1">
              <div className="w-24 h-4 bg-muted rounded" />
              <div className="w-32 h-3 bg-muted rounded" />
            </div>
          </div>
          <div className="w-16 h-8 bg-muted rounded" />
        </div>
      ))}
    </div>
  </div>
)

// Generic loading spinner
export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary border-t-transparent`}
      />
    </div>
  )
}

// Main suspense wrapper
export const SuspenseWrapper = ({
  children,
  fallback = <LoadingSpinner />,
  errorFallback,
}: SuspenseWrapperProps) => (
  <ErrorBoundary fallback={errorFallback ? () => <>{errorFallback}</> : undefined}>
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </ErrorBoundary>
)

// Specialized suspense wrappers
export const FeedSuspense = ({ children }: { children: ReactNode }) => (
  <SuspenseWrapper fallback={<FeedSkeleton />}>
    {children}
  </SuspenseWrapper>
)

export const ProfileSuspense = ({ children }: { children: ReactNode }) => (
  <SuspenseWrapper fallback={<ProfileSkeleton />}>
    {children}
  </SuspenseWrapper>
)

export const NotificationSuspense = ({ children }: { children: ReactNode }) => (
  <SuspenseWrapper fallback={<NotificationSkeleton />}>
    {children}
  </SuspenseWrapper>
)

export const RankingSuspense = ({ children }: { children: ReactNode }) => (
  <SuspenseWrapper fallback={<RankingSkeleton />}>
    {children}
  </SuspenseWrapper>
)

export const AdminSuspense = ({ children }: { children: ReactNode }) => (
  <SuspenseWrapper fallback={<AdminSkeleton />}>
    {children}
  </SuspenseWrapper>
)

// Higher-order component for adding suspense
export function withSuspense<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const SuspenseComponent = (props: P) => (
    <SuspenseWrapper fallback={fallback}>
      <Component {...props} />
    </SuspenseWrapper>
  )

  SuspenseComponent.displayName = `withSuspense(${Component.displayName || Component.name})`
  return SuspenseComponent
}