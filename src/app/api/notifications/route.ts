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
    const type = searchParams.get('type')

    const skip = (page - 1) * limit

    // Build where clause
    let whereClause: any = {
      userId: session.user.id,
    }

    if (unreadOnly) {
      whereClause.read = false
    }

    if (type) {
      whereClause.type = type
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

export async function PATCH(request: NextRequest) {
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

    if (action === 'markAsRead') {
      let updateResult

      if (notificationIds && Array.isArray(notificationIds)) {
        // Mark specific notifications as read
        updateResult = await prisma.notification.updateMany({
          where: {
            id: { in: notificationIds },
            userId: session.user.id,
            read: false,
          },
          data: {
            read: true,
          },
        })
      } else {
        // Mark all notifications as read
        updateResult = await prisma.notification.updateMany({
          where: {
            userId: session.user.id,
            read: false,
          },
          data: {
            read: true,
          },
        })
      }

      return NextResponse.json({
        success: true,
        data: {
          updatedCount: updateResult.count,
        },
      })
    }

    if (action === 'markAsUnread') {
      if (!notificationIds || !Array.isArray(notificationIds)) {
        return NextResponse.json(
          { error: 'Notification IDs are required for markAsUnread action' },
          { status: 400 }
        )
      }

      const updateResult = await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id,
          read: true,
        },
        data: {
          read: false,
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          updatedCount: updateResult.count,
        },
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
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
    const deleteAll = searchParams.get('all') === 'true'

    if (deleteAll) {
      // Delete all notifications for the user
      const deleteResult = await prisma.notification.deleteMany({
        where: {
          userId: session.user.id,
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          deletedCount: deleteResult.count,
        },
      })
    }

    if (!notificationIds || notificationIds.length === 0) {
      return NextResponse.json(
        { error: 'Notification IDs are required' },
        { status: 400 }
      )
    }

    // Delete specific notifications
    const deleteResult = await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        deletedCount: deleteResult.count,
      },
    })
  } catch (error) {
    console.error('Error deleting notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
