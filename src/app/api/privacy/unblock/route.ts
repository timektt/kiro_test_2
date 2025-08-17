import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { z } from 'zod'

const unblockUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required')
})

// POST /api/privacy/unblock - Unblock a user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId: blockedUserId } = unblockUserSchema.parse(body)

    // Check if user is blocked
    const existingBlock = await prisma.blockedUser.findUnique({
      where: {
        userId_blockedId: {
          userId: session.user.id,
          blockedId: blockedUserId
        }
      },
      include: {
        blocked: {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
      }
    })

    if (!existingBlock) {
      return NextResponse.json(
        { error: 'User is not blocked' },
        { status: 400 }
      )
    }

    // Unblock the user
    await prisma.blockedUser.delete({
      where: {
        userId_blockedId: {
          userId: session.user.id,
          blockedId: blockedUserId
        }
      }
    })

    logger.info(`User ${session.user.id} unblocked user ${blockedUserId}`, {
      unblockerId: session.user.id,
      unblockedId: blockedUserId
    })

    return NextResponse.json({
      message: 'User unblocked successfully',
      unblockedUser: existingBlock.blocked
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Error unblocking user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}