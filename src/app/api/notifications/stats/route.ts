import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get notification statistics
    const [
      totalCount,
      unreadCount,
      typeBreakdown,
      recentActivity,
    ] = await Promise.all([
      // Total notifications
      prisma.notification.count({
        where: { userId },
      }),
      
      // Unread notifications
      prisma.notification.count({
        where: { 
          userId,
          read: false,
        },
      }),
      
      // Breakdown by type
      prisma.notification.groupBy({
        by: ['type'],
        where: { userId },
        _count: {
          type: true,
        },
        orderBy: {
          _count: {
            type: 'desc',
          },
        },
      }),
      
      // Recent activity (last 7 days)
      prisma.notification.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    // Get unread count by type
    const unreadByType = await prisma.notification.groupBy({
      by: ['type'],
      where: { 
        userId,
        read: false,
      },
      _count: {
        type: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        totalCount,
        unreadCount,
        recentActivity,
        typeBreakdown: typeBreakdown.map(item => ({
          type: item.type,
          count: item._count.type,
        })),
        unreadByType: unreadByType.map(item => ({
          type: item.type,
          count: item._count.type,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching notification stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


