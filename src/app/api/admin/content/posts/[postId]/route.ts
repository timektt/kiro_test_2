import { NextRequest, NextResponse } from 'next/server'
import { createAdminHandler } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/db-utils'

export const PUT = createAdminHandler('CONTENT_MODERATION')(
  async (request: NextRequest, adminUser, { params }: { params: { postId: string } }) => {
    try {
      const body = await request.json()
      const { action, reason } = body

      const post = await prisma.post.findUnique({
        where: { id: params.postId },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      })

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      let updatedPost
      let notificationMessage = ''

      switch (action) {
        case 'HIDE':
          updatedPost = await prisma.post.update({
            where: { id: params.postId },
            data: { isPublic: false },
          })
          notificationMessage = `Your post has been hidden by a moderator${reason ? `: ${reason}` : ''}`
          break

        case 'SHOW':
          updatedPost = await prisma.post.update({
            where: { id: params.postId },
            data: { isPublic: true },
          })
          notificationMessage = 'Your post has been restored by a moderator'
          break

        case 'DELETE':
          // Only ADMIN can delete posts
          if (adminUser.role !== 'ADMIN') {
            return NextResponse.json(
              { error: 'Only administrators can delete posts' },
              { status: 403 }
            )
          }

          await prisma.post.delete({
            where: { id: params.postId },
          })
          notificationMessage = `Your post has been deleted by an administrator${reason ? `: ${reason}` : ''}`
          break

        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          )
      }

      // Send notification to post author
      if (notificationMessage && action !== 'DELETE') {
        await createNotification(
          post.author.id,
          'SYSTEM',
          notificationMessage
        )
      } else if (action === 'DELETE') {
        // For deleted posts, still try to send notification if user exists
        try {
          await createNotification(
            post.author.id,
            'SYSTEM',
            notificationMessage
          )
        } catch (error) {
          // Ignore notification errors for deleted content
          console.warn('Could not send notification for deleted post:', error)
        }
      }

      return NextResponse.json({
        success: true,
        data: action === 'DELETE' ? null : updatedPost,
        message: `Post ${action.toLowerCase()}${action === 'DELETE' ? 'd' : action === 'HIDE' ? 'den' : 'n'} successfully`,
      })
    } catch (error) {
      console.error('Error moderating post:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)