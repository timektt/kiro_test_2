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
  <div className="animate-pulse space-y-4 p-4 border rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-3 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
    <div className="flex space-x-4">
      <div className="h-8 bg-gray-300 rounded w-16"></div>
      <div className="h-8 bg-gray-300 rounded w-16"></div>
      <div className="h-8 bg-gray-300 rounded w-16"></div>
    </div>
  </div>
)

export const CommentSkeleton = () => (
  <div className="animate-pulse space-y-2 p-3 ml-8">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      <div className="h-3 bg-gray-300 rounded w-20"></div>
    </div>
    <div className="space-y-1">
      <div className="h-3 bg-gray-300 rounded w-full"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
    </div>
  </div>
)

export const UserProfileSkeleton = () => (
  <div className="animate-pulse space-y-4 p-6">
    <div className="flex items-center space-x-4">
      <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="h-4 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-300 rounded w-40"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
    </div>
  </div>
)

export const FeedSkeleton = () => (
  <div className="space-y-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>
)

export const ChatSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
        <div className={`max-w-xs p-3 rounded-lg ${
          i % 2 === 0 ? 'bg-gray-300' : 'bg-blue-300'
        }`}>
          <div className="h-4 bg-gray-400 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-400 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
)

export const SearchResultsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="animate-pulse p-4 border rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5"></div>
        </div>
      </div>
    ))}
  </div>
)

// Main suspense wrapper component
export const SuspenseWrapper = ({ 
  children, 
  fallback = <div className="flex items-center justify-center p-8">Loading...</div>,
  errorFallback = <div className="text-red-500 p-4">Something went wrong</div>
}: SuspenseWrapperProps) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

// Specialized wrappers for different sections
export const FeedSuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <SuspenseWrapper fallback={<FeedSkeleton />}>
    {children}
  </SuspenseWrapper>
)

export const ProfileSuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <SuspenseWrapper fallback={<UserProfileSkeleton />}>
    {children}
  </SuspenseWrapper>
)

export const ChatSuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <SuspenseWrapper fallback={<ChatSkeleton />}>
    {children}
  </SuspenseWrapper>
)

export const SearchSuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <SuspenseWrapper fallback={<SearchResultsSkeleton />}>
    {children}
  </SuspenseWrapper>
)

// Loading states for specific components
export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}></div>
  )
}

export const LoadingButton = ({ children, isLoading, ...props }: any) => (
  <button {...props} disabled={isLoading || props.disabled}>
    {isLoading ? (
      <div className="flex items-center space-x-2">
        <LoadingSpinner size="sm" />
        <span>Loading...</span>
      </div>
    ) : children}
  </button>
)

// Page-level loading components
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600">Loading page...</p>
    </div>
  </div>
)

export const ComponentLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center space-y-2">
      <LoadingSpinner />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  </div>
)

// Error boundary fallback
export const ErrorFallback = ({ error, resetError }: { error: Error, resetError: () => void }) => (
  <div className="text-center p-8 border border-red-200 rounded-lg bg-red-50">
    <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
    <p className="text-red-600 mb-4">{error.message}</p>
    <button 
      onClick={resetError}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Try again
    </button>
  </div>
)