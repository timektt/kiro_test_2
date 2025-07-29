import { PostSkeleton } from '@/components/ui/loading-skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/loading-skeleton'

interface LoadingFeedProps {
  count?: number
}

export function LoadingFeed({ count = 5 }: LoadingFeedProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Loading composer */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3 min-w-0">
              <Skeleton className="h-16 sm:h-20 w-full rounded-lg" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Skeleton className="h-7 w-7 sm:h-8 sm:w-8" />
                  <Skeleton className="h-7 w-7 sm:h-8 sm:w-8" />
                  <Skeleton className="hidden sm:block h-8 w-16" />
                </div>
                <Skeleton className="h-7 w-12 sm:h-9 sm:w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading posts */}
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  )
}

export default LoadingFeed