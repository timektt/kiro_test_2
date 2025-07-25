'use client'

import { useState } from 'react'
import { Plus, PenSquare, Image, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  onCreatePost?: () => void
  onAddImage?: () => void
  onAddEmoji?: () => void
  className?: string
}

export function FloatingActionButton({
  onCreatePost,
  onAddImage,
  onAddEmoji,
  className,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const actions = [
    {
      icon: PenSquare,
      label: 'Create Post',
      onClick: onCreatePost,
      color: 'bg-primary hover:bg-primary/90',
    },
    {
      icon: Image,
      label: 'Add Image',
      onClick: onAddImage,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: Smile,
      label: 'Add Emoji',
      onClick: onAddEmoji,
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
  ]

  return (
    <div className={cn('fixed bottom-20 right-4 z-40 md:hidden', className)}>
      {/* Action buttons */}
      <div className={cn(
        'flex flex-col gap-3 mb-3 transition-all duration-300',
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Button
              key={index}
              size="sm"
              className={cn(
                'h-12 w-12 rounded-full shadow-lg text-white',
                action.color
              )}
              onClick={() => {
                action.onClick?.()
                setIsExpanded(false)
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{action.label}</span>
            </Button>
          )
        })}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          'h-14 w-14 rounded-full shadow-lg transition-transform duration-300',
          isExpanded && 'rotate-45'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Create content</span>
      </Button>
    </div>
  )
}
