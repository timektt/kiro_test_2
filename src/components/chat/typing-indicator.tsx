'use client'

import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  userNames: string[]
  className?: string
}

export function TypingIndicator({ userNames, className }: TypingIndicatorProps) {
  if (userNames.length === 0) return null

  const getTypingText = () => {
    const typingText = {'กำลังพิมพ์...'}
    const andText = {'และ'}
    const peopleText = {'คน'}
    const moreText = {'อีก'}
    
    if (userNames.length === 1) {
      return `${userNames[0]} ${typingText}`
    } else if (userNames.length === 2) {
      return `${userNames[0]} ${andText} ${userNames[1]} ${typingText}`
    } else {
      return `${userNames[0]} ${andText}${moreText} ${userNames.length - 1} ${peopleText} ${typingText}`
    }
  }

  return (
    <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
      </div>
      <span className="text-xs">{getTypingText()}</span>
    </div>
  )
}