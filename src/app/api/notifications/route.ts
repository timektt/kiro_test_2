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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    
    const skip = (page - 1) * limit

    // Build where clause
    // eslint-disable-next-line prefer-const
    const whereClause: any = {
      userId: session.user.id,
      ...(unreadOnly && { read: false }),
    }

    const [notifications, totalCount, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: whereClause }),
      prisma.notification.count({
        where: {
          userId: session.user.id,
          read: false,
        },
      }),
    ])

    const hasMore = skip + notifications.length < totalCount

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total: totalCount,
          hasMore,
        },
        unreadCount,
      },
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action, notificationIds } = body

    if (action === 'markAllAsRead') {
      // Mark all notifications as read for the user
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false,
        },
        data: {
          read: true,
        },
      })

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      })
    }

    if (action === 'markAsRead' && notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id,
        },
        data: {
          read: true,
        },
      })

      return NextResponse.json({
        success: true,
        message: `${notificationIds.length} notifications marked as read`,
      })
    }

    if (action === 'markAsUnread' && notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as unread
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id,
        },
        data: {
          read: false,
        },
      })

      return NextResponse.json({
        success: true,
        message: `${notificationIds.length} notifications marked as unread`,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const notificationIds = searchParams.get('ids')?.split(',')

    if (!notificationIds || notificationIds.length === 0) {
      return NextResponse.json(
        { error: 'No notification IDs provided' },
        { status: 400 }
      )
    }

    // Delete notifications (only user's own notifications)
    const result = await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: `${result.count} notifications deleted`,
      deletedCount: result.count,
    })
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}