import { PostSkeleton } from '@/components/ui/loading-skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/loading-skeleton'

interface LoadingFeedProps {
  count?: number
}

export function LoadingFeed({ count = 5 }: LoadingFeedProps) {
  return (
    <div className="space-y-6">
      {/* Loading composer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-20 w-full rounded-lg" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <Skeleton className="h-9 w-16" />
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
