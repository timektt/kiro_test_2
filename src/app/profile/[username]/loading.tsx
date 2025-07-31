import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Profile Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <Skeleton className="h-6 w-8 mx-auto mb-1" />
                    <Skeleton className="h-3 w-12 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-6 w-8 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-6 w-8 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Tabs */}
          <Card>
            <CardHeader>
              <div className="flex gap-4 border-b">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}