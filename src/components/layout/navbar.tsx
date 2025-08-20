'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  Users,
  Bell,
  Search,
  MessageCircle,
  Shield
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { NotificationDropdown } from '@/components/ui/notification-dropdown'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ClientLinkButton } from '@/components/ui/client-link-button'

export function Navbar() {
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const navItems = [
    { href: '/feed', label: 'Feed', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>
      
      <nav 
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 min-w-0 flex-shrink-0"
            aria-label="Community Platform Home"
          >
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs sm:text-sm">CP</span>
            </div>
            <span className="font-bold text-lg sm:text-xl hidden sm:inline-block truncate">
              Community Platform
            </span>
          </Link>

          {/* Desktop Navigation */}
          {session && (
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-1 justify-center max-w-md">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 text-sm font-medium transition-colors px-3 py-2 rounded-md",
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    aria-label={`Navigate to ${item.label}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Notifications - Hidden on mobile, shown in mobile nav */}
            {session && (
              <div className="hidden sm:block">
                <NotificationDropdown />
              </div>
            )}
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Authentication */}
            {status === 'loading' ? (
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full min-h-[44px] sm:min-h-[auto] p-0"
                      aria-label={`User menu for ${session.user.name || session.user.username}`}
                      aria-haspopup="menu"
                    >
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                        <AvatarImage 
                          src={session.user.image || undefined} 
                          alt={session.user.name || 'User avatar'} 
                        />
                        <AvatarFallback className="text-xs sm:text-sm">
                          {session.user.name ? getInitials(session.user.name) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 sm:w-64" 
                    align="end" 
                    forceMount
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          @{session.user.username}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer min-h-[44px] sm:min-h-[auto] flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer min-h-[44px] sm:min-h-[auto] flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings/privacy" className="cursor-pointer min-h-[44px] sm:min-h-[auto] flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Privacy</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="cursor-pointer min-h-[44px] sm:min-h-[auto] flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden h-8 w-8 sm:h-9 sm:w-9 px-0 min-h-[44px] sm:min-h-[auto]"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-navigation"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <ClientLinkButton variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3" href="/auth/signin">
                  Sign In
                </ClientLinkButton>
                <ClientLinkButton size="sm" className="text-xs sm:text-sm px-2 sm:px-3" href="/auth/signup">
                  Sign Up
                </ClientLinkButton>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {session && isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Mobile Menu */}
            <div 
              id="mobile-navigation"
              className="fixed top-14 sm:top-16 left-0 right-0 bg-background border-b shadow-lg z-50 md:hidden"
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto">
                <div className="px-3 sm:px-4 py-4 space-y-1">
                  {/* Navigation Items */}
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-3 text-base font-medium rounded-lg transition-colors min-h-[44px]",
                          isActive 
                            ? "text-primary bg-primary/10" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                        role="menuitem"
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                  
                  {/* Mobile-only Notifications */}
                  <div className="pt-2 border-t">
                    <div className="px-3 py-2">
                      <NotificationDropdown />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
    </>
  )
}

export default Navbar
