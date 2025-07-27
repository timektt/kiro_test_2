'use client'

import { memo, useCallback, useMemo } from 'react'
import { EnhancedInteractiveFeed } from './enhanced-interactive-feed'
import { SuspenseWrapper } from '@/components/ui/suspense-wrapper'

interface RealTimeFeedProps {
  userId?: string
  className?: string
}

export const RealTimeFeed = memo<RealTimeFeedProps>(({ userId, className }) => {
  const feedProps = useMemo(() => ({
    userId,
    className,
    realTime: true,
  }), [userId, className])

  const handleError = useCallback((error: Error) => {
    console.error('Real-time feed error:', error)
  }, [])

  return (
    <SuspenseWrapper
      fallback={
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3 animate-pulse">
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
            </div>
          ))}
        </div>
      }
      errorFallback={
        <div className="text-center p-8">
          <p className="text-muted-foreground">Failed to load real-time feed</p>
        </div>
      }
    >
      <EnhancedInteractiveFeed {...feedProps} />
    </SuspenseWrapper>
  )
})

RealTimeFeed.displayName = 'RealTimeFeed'

