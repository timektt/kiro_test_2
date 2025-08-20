import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

// GET /api/privacy/blocked-users - Get list of blocked users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Get blocked users with pagination
    const [blockedUsers, total] = await Promise.all([
      prisma.blockedUser.findMany({
        where: { userId: session.user.id },
        include: {
          blocked: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              bio: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.blockedUser.count({
        where: { userId: session.user.id }
      })
    ])

    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      blockedUsers: blockedUsers.map(block => ({
        id: block.id,
        reason: block.reason,
        blockedAt: block.createdAt,
        user: block.blocked
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    })
  } catch (error) {
    logger.error('Error fetching blocked users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
