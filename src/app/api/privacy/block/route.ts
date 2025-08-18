import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'
import { z } from 'zod'

const blockUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  reason: z.string().optional()
})

// POST /api/privacy/block - Block a user
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
    const { userId: blockedUserId, reason } = blockUserSchema.parse(body)

    // Check if user is trying to block themselves
    if (session.user.id === blockedUserId) {
      return NextResponse.json(
        { error: 'Cannot block yourself' },
        { status: 400 }
      )
    }

    // Check if user exists
    const userToBlock = await prisma.user.findUnique({
      where: { id: blockedUserId },
      select: { id: true, username: true }
    })

    if (!userToBlock) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already blocked
    const existingBlock = await prisma.blockedUser.findUnique({
      where: {
        userId_blockedId: {
          userId: session.user.id,
          blockedId: blockedUserId
        }
      }
    })

    if (existingBlock) {
      return NextResponse.json(
        { error: 'User is already blocked' },
        { status: 400 }
      )
    }

    // Block the user
    const blockedUser = await prisma.blockedUser.create({
      data: {
        userId: session.user.id,
        blockedId: blockedUserId,
        reason
      },
      include: {
        blocked: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        }
      }
    })

    logger.info(`User ${session.user.id} blocked user ${blockedUserId}`, {
      blockerId: session.user.id,
      blockedId: blockedUserId,
      reason
    })

    return NextResponse.json({
      message: 'User blocked successfully',
      blockedUser
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    logger.error('Error blocking user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}