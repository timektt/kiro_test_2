import { NextRequest, NextResponse } from 'next/server'
import { createAdminHandler } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/db-utils'

export const DELETE = createAdminHandler('CONTENT_MODERATION')(
  async (request: NextRequest, adminUser, { params }: { params: { commentId: string } }) => {
    try {
      const body = await request.json()
      const { reason } = body

      const comment = await prisma.comment.findUnique({
        where: { id: params.commentId },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
            },
          },
        },
      })

      if (!comment) {
        return NextResponse.json(
          { error: 'Comment not found' },
          { status: 404 }
        )
      }

      // Delete comment
      await prisma.comment.delete({
        where: { id: params.commentId },
      })

      // Send notification to comment author
      const notificationMessage = `Your comment has been deleted by a moderator${reason ? `: ${reason}` : ''}`
      
      try {
        await createNotification(
          comment.author.id,
          'SYSTEM',
          notificationMessage
        )
      } catch (error) {
        // Ignore notification errors for deleted content
        console.warn('Could not send notification for deleted comment:', error)
      }

      return NextResponse.json({
        success: true,
        message: 'Comment deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)