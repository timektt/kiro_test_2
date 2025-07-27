import { cn } from '@/lib/utils'

interface FeedLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  className?: string
}

export function FeedLayout({ children, sidebar, className }: FeedLayoutProps) {
  return (
    <div className={cn('container mx-auto px-4 py-6', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {children}
        </div>

        {/* Sidebar */}
        {sidebar && (
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {sidebar}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

