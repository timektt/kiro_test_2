import { cn } from '@/lib/utils'

interface FeedLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  className?: string
}

export function FeedLayout({ children, sidebar, className }: FeedLayoutProps) {
  return (
    <div className={cn('container mx-auto px-3 sm:px-4 py-4 sm:py-6', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6 min-w-0">
          {children}
        </div>

        {/* Sidebar - Hidden on mobile, shown as sticky on desktop */}
        {sidebar && (
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-16 sm:top-20 space-y-4 sm:space-y-6 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {sidebar}
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile bottom spacing to account for mobile nav */}
      <div className="h-20 md:h-0" aria-hidden="true" />
    </div>
  )
}

export default FeedLayout