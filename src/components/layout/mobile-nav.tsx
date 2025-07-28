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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
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
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors relative',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {isAuthenticated && item.href === '/notifications' && notificationCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav