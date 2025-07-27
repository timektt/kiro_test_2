'use client'

import { MBTI } from '@/types'
import { getMBTIInfo, getMBTIColorClass } from '@/lib/mbti'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MBTIBadgeProps {
  mbti: MBTI
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  showEmoji?: boolean
  className?: string
}

export function MBTIBadge({ 
  mbti, 
  size = 'md', 
  showName = false, 
  showEmoji = true,
  className 
}: MBTIBadgeProps) {
  const info = getMBTIInfo(mbti.type)
  const colorClass = getMBTIColorClass(mbti.type)

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        colorClass,
        sizeClasses[size],
        'font-medium border',
        className
      )}
      title={`${info.name} - ${info.description}`}
    >
      {showEmoji && (
        <span className="mr-1" aria-hidden="true">
          {info.emoji}
        </span>
      )}
      <span className="font-bold">{mbti.type}</span>
      {showName && (
        <span className="ml-1 font-normal">
          {info.name}
        </span>
      )}
    </Badge>
  )
}

interface MBTITooltipProps {
  mbti: MBTI
  children: React.ReactNode
}

export function MBTITooltip({ mbti, children }: MBTITooltipProps) {
  const info = getMBTIInfo(mbti.type)

  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-64">
        <div className="font-semibold mb-1">
          {info.emoji} {info.type} - {info.name}
        </div>
        <div className="text-xs mb-2 text-gray-300">
          {info.nickname}
        </div>
        <div className="text-xs">
          {info.description}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
      </div>
    </div>
  )
}

export default MBTIBadge