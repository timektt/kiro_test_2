import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { User, MBTIType } from '@/types'

interface UserBadgeProps {
  user: Pick<User, 'id' | 'username' | 'name' | 'image' | 'role'> & {
    mbti?: { type: MBTIType } | null
  }
  size?: 'sm' | 'md' | 'lg'
  showMBTI?: boolean
  showRole?: boolean
  className?: string
  clickable?: boolean
}

const sizeConfig = {
  sm: {
    avatar: 'h-6 w-6',
    text: 'text-xs',
    name: 'text-sm',
  },
  md: {
    avatar: 'h-8 w-8',
    text: 'text-sm',
    name: 'text-base',
  },
  lg: {
    avatar: 'h-10 w-10',
    text: 'text-sm',
    name: 'text-lg',
  },
}

const mbtiColors: Record<MBTIType, string> = {
  // Analysts
  INTJ: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  INTP: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ENTJ: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  ENTP: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  // Diplomats
  INFJ: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  INFP: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ENFJ: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ENFP: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  // Sentinels
  ISTJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ISFJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ESTJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ESFJ: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  // Explorers
  ISTP: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  ISFP: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  ESTP: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  ESFP: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
}

const roleColors = {
  USER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  MODERATOR: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
}

export function UserBadge({
  user,
  size = 'md',
  showMBTI = true,
  showRole = false,
  className,
  clickable = true,
}: UserBadgeProps) {
  const config = sizeConfig[size]
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <Avatar className={config.avatar}>
        <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
        <AvatarFallback className={config.text}>
          {user.name ? getInitials(user.name) : user.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium truncate', config.name)}>
            {user.name || user.username}
          </span>
          {showMBTI && user.mbti && (
            <Badge 
              variant="secondary" 
              className={cn('text-xs px-1.5 py-0.5', mbtiColors[user.mbti.type])}
            >
              {user.mbti.type}
            </Badge>
          )}
          {showRole && user.role !== 'USER' && (
            <Badge 
              variant="secondary" 
              className={cn('text-xs px-1.5 py-0.5', roleColors[user.role])}
            >
              {user.role}
            </Badge>
          )}
        </div>
        <span className={cn('text-muted-foreground truncate', config.text)}>
          @{user.username}
        </span>
      </div>
    </div>
  )

  if (clickable) {
    return (
      <Link 
        href={`/profile/${user.username}`}
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    )
  }

  return content
}