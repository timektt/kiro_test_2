'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Flag, 
  Settings, 
  Menu, 
  X,
  Shield,
  BarChart3,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
  adminUser: {
    id: string
    username: string
    name: string | null
    email: string
    role: 'ADMIN' | 'MODERATOR'
    image: string | null
  }
}

const adminNavItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    href: '/admin/users',
    label: 'User Management',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    href: '/admin/content',
    label: 'Content Moderation',
    icon: FileText,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    href: '/admin/reports',
    label: 'Reports & Flags',
    icon: Flag,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
    roles: ['ADMIN'],
  },
  {
    href: '/admin/notifications',
    label: 'System Notifications',
    icon: Bell,
    roles: ['ADMIN'],
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    roles: ['ADMIN'],
  },
]

export function AdminLayout({ children, adminUser }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Filter nav items based on user role
  const visibleNavItems = adminNavItems.filter(item => 
    item.roles.includes(adminUser.role)
  )

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>

              {/* Logo */}
              <Link href="/admin" className="flex items-center gap-2">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="font-bold text-base sm:text-lg">Admin Panel</span>
              </Link>
            </div>

            {/* Admin user info */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium truncate max-w-32">{adminUser.name || adminUser.username}</p>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={adminUser.role === 'ADMIN' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {adminUser.role}
                  </Badge>
                </div>
              </div>
              <Link href="/" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 sm:w-72 transform bg-background border-r transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex h-full flex-col pt-14 sm:pt-16 md:pt-0">
            <nav className="flex-1 space-y-1 sm:space-y-2 p-3 sm:p-4">
              {visibleNavItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-2 sm:gap-3 rounded-lg px-3 py-2.5 sm:py-2 text-sm font-medium transition-colors min-h-[44px] sm:min-h-[40px]",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="container mx-auto p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout