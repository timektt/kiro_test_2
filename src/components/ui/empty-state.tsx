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
  compact?: boolean
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardContent className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-6 px-4' : 'py-12 px-6'
      )}>
        {Icon && (
          <div className={cn(
            'flex items-center justify-center rounded-full bg-muted',
            compact ? 'mb-2 h-12 w-12' : 'mb-4 h-16 w-16'
          )}>
            <Icon className={cn(
              'text-muted-foreground',
              compact ? 'h-6 w-6' : 'h-8 w-8'
            )} />
          </div>
        )}
        
        <h3 className={cn(
          'font-semibold mb-2',
          compact ? 'text-base' : 'text-lg'
        )}>{title}</h3>
        
        {description && (
          <p className={cn(
            'text-muted-foreground max-w-sm',
            compact ? 'mb-3 text-sm' : 'mb-6'
          )}>
            {description}
          </p>
        )}
        
        {action && (
          <Button onClick={action.onClick} size={compact ? 'sm' : 'default'}>
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default EmptyState