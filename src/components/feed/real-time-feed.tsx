'use client'

import { memo, useCallback, useMemo } from 'react'
import { EnhancedInteractiveFeed } from './enhanced-interactive-feed'
import { SuspenseWrapper } from '@/components/ui/suspense-wrapper'
import { cn } from '@/lib/utils'

interface RealTimeFeedProps {
  userId?: string
  className?: string
}

export const RealTimeFeed = memo<RealTimeFeedProps>(({ userId, className }) => {
  const feedProps = useMemo(() => ({
    currentUserId: userId || '',
    realTime: true,
    className: cn('w-full', className),
  }), [userId, className])

  const handleError = useCallback((error: Error) => {
    console.error('Real-time feed error:', error)
  }, [])

  return (
    <SuspenseWrapper
      fallback={
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-3 sm:p-4 space-y-3 animate-pulse">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full flex-shrink-0" />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="w-20 sm:w-24 h-3 sm:h-4 bg-muted rounded" />
                  <div className="w-12 sm:w-16 h-2 sm:h-3 bg-muted rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-3 sm:h-4 bg-muted rounded" />
                <div className="w-3/4 h-3 sm:h-4 bg-muted rounded" />
                <div className="w-1/2 sm:w-3/4 h-3 sm:h-4 bg-muted rounded" />
              </div>
              {/* Mobile-optimized action buttons skeleton */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="w-12 h-6 bg-muted rounded" />
                  <div className="w-12 h-6 bg-muted rounded" />
                  <div className="w-12 h-6 bg-muted rounded" />
                </div>
                <div className="w-6 h-6 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      }
      errorFallback={
        <div className="text-center p-6 sm:p-8">
          <p className="text-sm sm:text-base text-muted-foreground">Failed to load real-time feed</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      }
    >
      <EnhancedInteractiveFeed {...feedProps} />
    </SuspenseWrapper>
  )
})

RealTimeFeed.displayName = 'RealTimeFeed'

export default RealTimeFeed
