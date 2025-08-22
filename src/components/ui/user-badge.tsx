import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getMBTIColorClass, getMBTIInfo } from '@/lib/mbti'
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
  // Guard against undefined/null user
  if (!user) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Avatar className={sizeConfig[size].avatar}>
          <AvatarFallback className={sizeConfig[size].text}>?</AvatarFallback>
        </Avatar>
        <span className={cn('font-medium text-muted-foreground', sizeConfig[size].name)}>
          Unknown User
        </span>
      </div>
    )
  }

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
        <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
        <AvatarFallback className={config.text}>
          {user?.name ? getInitials(user.name) : (user?.username?.[0]?.toUpperCase() || '?')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium truncate', config.name)}>
            {user?.name || user?.username || 'Unknown'}
          </span>
          {showMBTI && user?.mbti?.type && (
            <Badge 
              variant="secondary" 
              className={cn('text-xs px-1.5 py-0.5', getMBTIColorClass(user.mbti.type))}
              title={`${user.mbti.type} - ${getMBTIInfo(user.mbti.type).name}`}
            >
              {getMBTIInfo(user.mbti.type).emoji} {user.mbti.type}
            </Badge>
          )}
          {showRole && user?.role && user.role !== 'USER' && (
            <Badge 
              variant="secondary" 
              className={cn('text-xs px-1.5 py-0.5', roleColors[user.role as keyof typeof roleColors] || roleColors.USER)}
            >
              {user.role}
            </Badge>
          )}
        </div>
        <span className={cn('text-muted-foreground truncate', config.text)}>
          @{user?.username || 'unknown'}
        </span>
      </div>
    </div>
  )

  if (clickable && user?.username) {
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

export default UserBadge
