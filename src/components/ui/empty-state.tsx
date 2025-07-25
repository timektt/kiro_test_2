import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {Icon && (
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        
        {description && (
          <p className="text-muted-foreground mb-6 max-w-sm">
            {description}
          </p>
        )}
        
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
