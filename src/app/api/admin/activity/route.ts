import { NextRequest, NextResponse } from 'next/server'
import { createAdminHandler } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export const GET = createAdminHandler('SYSTEM_SETTINGS')(
  async (request: NextRequest, adminUser) => {
    try {
      const { searchParams } = new URL(request.url)
      const limit = parseInt(searchParams.get('limit') || '20')

      // For now, we'll create mock recent activity based on actual data
      // In a real implementation, you'd have an activity log table
      
      const [recentUsers, recentPosts] = await Promise.all([
        prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          take: Math.floor(limit / 2),
          select: {
            id: true,
            username: true,
            name: true,
            createdAt: true,
          },
        }),
        prisma.post.findMany({
          orderBy: { createdAt: 'desc' },
          take: Math.floor(limit / 2),
          include: {
            author: {
              select: {
                username: true,
                name: true,
              },
            },
          },
        }),
      ])

      // Create activity entries
      const activities = [
        ...recentUsers.map(user => ({
          id: `user-${user.id}`,
          type: 'USER_REGISTERED' as const,
          message: `New user registered: ${user.name || user.username}`,
          timestamp: user.createdAt,
          severity: 'info' as const,
        })),
        ...recentPosts.map(post => ({
          id: `post-${post.id}`,
          type: 'POST_CREATED' as const,
          message: `New post created by ${post.author.name || post.author.username}`,
          timestamp: post.createdAt,
          severity: 'info' as const,
        })),
      ]

      // Sort by timestamp and limit
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)

      return NextResponse.json({
        success: true,
        data: sortedActivities,
      })
    } catch (error) {
      console.error('Error fetching admin activity:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)

