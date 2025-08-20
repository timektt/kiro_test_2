'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  userId?: string
  username?: string
  notificationCount?: number
}

const navItems = [
  {
    href: '/feed',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/explore',
    label: 'Explore',
    icon: Search,
  },
  {
    href: '/create',
    label: 'Create',
    icon: PlusSquare,
  },
  {
    href: '/notifications',
    label: 'Notifications',
    icon: Heart,
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
  },
]

export function MobileNav({ userId, username, notificationCount = 0 }: MobileNavProps) {
  const pathname = usePathname()
  const isAuthenticated = Boolean(userId)

  // Show different nav items based on authentication status
  const displayNavItems = isAuthenticated 
    ? navItems 
    : [
        { href: '/', label: 'Home', icon: Home },
        { href: '/auth/signin', label: 'Sign In', icon: User },
      ]

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t md:hidden"
      role="navigation"
      aria-label="Mobile bottom navigation"
    >
      <div className="safe-area-inset-bottom">
        <div className="flex items-center justify-around px-1 py-1">
          {displayNavItems.map((item) => {
            const Icon = item.icon
            let href = item.href
            
            // Handle dynamic routes for authenticated users
            if (isAuthenticated && item.href === '/profile' && username) {
              href = `/profile/${username}`
            }
            
            const isActive = pathname === href || 
              (item.href === '/profile' && pathname.startsWith('/profile'))
            
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center px-2 py-2 rounded-xl transition-all duration-200 relative',
                  'min-h-[60px] min-w-[60px] touch-manipulation',
                  'active:scale-95 active:bg-muted/80',
                  isActive 
                    ? 'text-primary bg-primary/15 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative flex items-center justify-center">
                  <Icon 
                    className={cn(
                      'h-5 w-5 transition-transform duration-200',
                      isActive && 'scale-110'
                    )} 
                    aria-hidden="true"
                  />
                  {isAuthenticated && item.href === '/notifications' && notificationCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center min-w-[16px] font-semibold"
                      aria-label={`${notificationCount} unread notifications`}
                    >
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Badge>
                  )}
                </div>
                <span 
                  className={cn(
                    'text-[10px] mt-1 font-medium leading-tight text-center max-w-[50px] truncate',
                    isActive && 'font-semibold'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default MobileNav
