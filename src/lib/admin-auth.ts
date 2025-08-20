import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export interface AdminUser {
  id: string
  username: string
  name: string | null
  email: string
  role: 'ADMIN' | 'MODERATOR'
  image: string | null
}

/**
 * Check if the current user has admin privileges
 */
export async function checkAdminAuth(): Promise<AdminUser | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return null
    }

    // Get user with role information
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        image: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return null
    }

    // Check if user has admin or moderator role
    if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role as 'ADMIN' | 'MODERATOR',
      image: user.image,
    }
  } catch (error) {
    console.error('Error checking admin auth:', error)
    return null
  }
}

/**
 * Middleware to protect admin routes
 */
export async function withAdminAuth(
  handler: (request: NextRequest, adminUser: AdminUser) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const adminUser = await checkAdminAuth()
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return handler(request, adminUser)
  }
}

/**
 * Check if user has specific admin permissions
 */
export function hasAdminPermission(
  adminUser: AdminUser,
  permission: 'USER_MANAGEMENT' | 'CONTENT_MODERATION' | 'SYSTEM_SETTINGS'
): boolean {
  // ADMIN has all permissions
  if (adminUser.role === 'ADMIN') {
    return true
  }

  // MODERATOR has limited permissions
  if (adminUser.role === 'MODERATOR') {
    switch (permission) {
      case 'CONTENT_MODERATION':
        return true
      case 'USER_MANAGEMENT':
        return false // Only basic user actions, not role changes
      case 'SYSTEM_SETTINGS':
        return false
      default:
        return false
    }
  }

  return false
}

/**
 * Higher-order function to create admin API handlers with permission checks
 */
export function createAdminHandler(
  permission: 'USER_MANAGEMENT' | 'CONTENT_MODERATION' | 'SYSTEM_SETTINGS'
) {
  return function (
    handler: (request: NextRequest, adminUser: AdminUser, context?: any) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, context?: any) => {
      const adminUser = await checkAdminAuth()
      
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      if (!hasAdminPermission(adminUser, permission)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      return handler(request, adminUser, context)
    }
  }
}


