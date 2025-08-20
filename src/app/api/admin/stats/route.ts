import { NextRequest, NextResponse } from 'next/server'
import { createAdminHandler } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export const GET = createAdminHandler('SYSTEM_SETTINGS')(
  async (request: NextRequest, adminUser) => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [
        totalUsers,
        activeUsers,
        totalPosts,
        totalComments,
        totalLikes,
        pendingReports,
        newUsersToday,
        postsToday,
      ] = await Promise.all([
        // Total users
        prisma.user.count(),
        
        // Active users (logged in within last 30 days)
        prisma.user.count({
          where: {
            isActive: true,
            updatedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        
        // Total posts
        prisma.post.count(),
        
        // Total comments
        prisma.comment.count(),
        
        // Total likes
        prisma.like.count(),
        
        // Pending reports
        prisma.report.count({
          where: {
            status: 'PENDING',
          },
        }),
        
        // New users today
        prisma.user.count({
          where: {
            createdAt: {
              gte: today,
            },
          },
        }),
        
        // Posts today
        prisma.post.count({
          where: {
            createdAt: {
              gte: today,
            },
          },
        }),
      ])

      return NextResponse.json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          totalPosts,
          totalComments,
          totalLikes,
          pendingReports,
          newUsersToday,
          postsToday,
        },
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)


