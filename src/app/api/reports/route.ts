import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createReportSchema = z.object({
  type: z.enum(['POST', 'USER', 'COMMENT', 'CHAT_MESSAGE']),
  reason: z.enum(['SPAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'FAKE_ACCOUNT', 'OTHER']),
  description: z.string().optional(),
  reportedUserId: z.string().optional(),
  reportedPostId: z.string().optional(),
  reportedCommentId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createReportSchema.parse(body)

    // Validate that at least one target is specified
    const hasTarget = validatedData.reportedUserId || 
                     validatedData.reportedPostId || 
                     validatedData.reportedCommentId

    if (!hasTarget) {
      return NextResponse.json(
        { success: false, error: 'At least one target (user, post, or comment) must be specified' },
        { status: 400 }
      )
    }

    // Validate target exists based on type
    if (validatedData.type === 'USER' && validatedData.reportedUserId) {
      const user = await prisma.user.findUnique({
        where: { id: validatedData.reportedUserId },
      })
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Reported user not found' },
          { status: 404 }
        )
      }
    }

    if (validatedData.type === 'POST' && validatedData.reportedPostId) {
      const post = await prisma.post.findUnique({
        where: { id: validatedData.reportedPostId },
      })
      if (!post) {
        return NextResponse.json(
          { success: false, error: 'Reported post not found' },
          { status: 404 }
        )
      }
    }

    if (validatedData.type === 'COMMENT' && validatedData.reportedCommentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: validatedData.reportedCommentId },
      })
      if (!comment) {
        return NextResponse.json(
          { success: false, error: 'Reported comment not found' },
          { status: 404 }
        )
      }
    }

    // Check if user has already reported this content
    const existingReport = await prisma.report.findFirst({
      where: {
        reporterId: session.user.id,
        ...(validatedData.reportedUserId && { reportedUserId: validatedData.reportedUserId }),
        ...(validatedData.reportedPostId && { reportedPostId: validatedData.reportedPostId }),
        ...(validatedData.reportedCommentId && { reportedCommentId: validatedData.reportedCommentId }),
      },
    })

    if (existingReport) {
      return NextResponse.json(
        { success: false, error: 'You have already reported this content' },
        { status: 409 }
      )
    }

    // Determine priority based on reason
    let priority = 'MEDIUM'
    if (validatedData.reason === 'HARASSMENT') {
      priority = 'HIGH'
    } else if (validatedData.reason === 'SPAM') {
      priority = 'LOW'
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        type: validatedData.type,
        reason: validatedData.reason,
        description: validatedData.description,
        priority,
        reporterId: session.user.id,
        reportedUserId: validatedData.reportedUserId,
        reportedPostId: validatedData.reportedPostId,
        reportedCommentId: validatedData.reportedCommentId,
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    })

    // Create notification for admins (optional)
    await prisma.notification.create({
      data: {
        type: 'SYSTEM',
        message: `New ${validatedData.type.toLowerCase()} report: ${validatedData.reason}`,
        userId: 'admin', // This would need to be handled differently in a real system
        relatedId: report.id,
      },
    }).catch(() => {
      // Ignore notification errors
    })

    return NextResponse.json({
      success: true,
      data: report,
      message: 'Report submitted successfully. Our team will review it shortly.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's reports
    const reports = await prisma.report.findMany({
      where: {
        reporterId: session.user.id,
      },
      include: {
        reportedUser: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        reportedPost: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                username: true,
                name: true,
              },
            },
          },
        },
        reportedComment: {
          select: {
            id: true,
            content: true,
            author: {
              select: {
                username: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: reports,
    })
  } catch (error) {
    console.error('Error fetching user reports:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}