import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { MBTIType } from '@/types'

const mbtiSchema = z.object({
  type: z.enum([
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP', 
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ] as const),
  description: z.string().max(200).optional()
})

// GET /api/users/[userId]/mbti - Get user's MBTI
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    const mbti = await prisma.mBTI.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        }
      }
    })

    if (!mbti) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MBTI_NOT_FOUND',
          message: 'User has not set their MBTI type'
        }
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: mbti
    })

  } catch (error) {
    console.error('Error fetching MBTI:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }, { status: 500 })
  }
}

// POST /api/users/[userId]/mbti - Set user's MBTI
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized'
        }
      }, { status: 401 })
    }

    const { userId } = params

    // Users can only set their own MBTI
    if (session.user.id !== userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You can only set your own MBTI type'
        }
      }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = mbtiSchema.parse(body)

    // Check if user already has MBTI set
    const existingMBTI = await prisma.mBTI.findUnique({
      where: { userId }
    })

    if (existingMBTI && existingMBTI.isLocked) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MBTI_LOCKED',
          message: 'MBTI type is locked and cannot be changed'
        }
      }, { status: 400 })
    }

    // Create or update MBTI
    const mbti = await prisma.mBTI.upsert({
      where: { userId },
      update: {
        type: validatedData.type,
        description: validatedData.description,
        assignedAt: new Date()
      },
      create: {
        userId,
        type: validatedData.type,
        description: validatedData.description,
        isLocked: false
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: mbti
    }, { status: existingMBTI ? 200 : 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.errors
        }
      }, { status: 400 })
    }

    console.error('Error setting MBTI:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }, { status: 500 })
  }
}

// PUT /api/users/[userId]/mbti - Update user's MBTI (admin only for locking)
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized'
        }
      }, { status: 401 })
    }

    const { userId } = params
    const body = await request.json()

    // Only admins can lock/unlock MBTI types
    if (body.isLocked !== undefined && session.user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only admins can lock/unlock MBTI types'
        }
      }, { status: 403 })
    }

    // Users can only update their own MBTI description
    if (session.user.id !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Forbidden'
        }
      }, { status: 403 })
    }

    const updateData: any = {}
    
    if (body.description !== undefined) {
      updateData.description = body.description
    }
    
    if (body.isLocked !== undefined && session.user.role === 'ADMIN') {
      updateData.isLocked = body.isLocked
    }

    const mbti = await prisma.mBTI.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: mbti
    })

  } catch (error) {
    console.error('Error updating MBTI:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }, { status: 500 })
  }
}

// DELETE /api/users/[userId]/mbti - Remove user's MBTI (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Only admins can remove MBTI types'
        }
      }, { status: 403 })
    }

    const { userId } = params

    await prisma.mBTI.delete({
      where: { userId }
    })

    return NextResponse.json({
      success: true,
      message: 'MBTI type removed successfully'
    })

  } catch (error) {
    console.error('Error deleting MBTI:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }, { status: 500 })
  }
}