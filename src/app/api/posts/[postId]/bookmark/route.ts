import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/db-utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const postId = params.postId

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if already bookmarked
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      })

      return NextResponse.json({
        success: true,
        data: {
          bookmarked: false,
          message: 'Bookmark removed successfully',
        },
      })
    } else {
      // Add bookmark
      const bookmark = await prisma.bookmark.create({
        data: {
          postId,
          userId,
        },
      })

      // Create notification for post author (if not bookmarking own post)
      if (post.authorId !== userId) {
        await createNotification(
          post.authorId,
          'BOOKMARK',
          `${session.user.name || session.user.username} bookmarked your post`,
          {
            postId,
            userId,
          }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          bookmarked: true,
          message: 'Post bookmarked successfully',
          bookmark,
        },
      })
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const postId = params.postId

    // Remove bookmark
    const deletedBookmark = await prisma.bookmark.deleteMany({
      where: {
        postId,
        userId,
      },
    })

    if (deletedBookmark.count === 0) {
      return NextResponse.json(
        { success: false, error: 'Bookmark not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        bookmarked: false,
        message: 'Bookmark removed successfully',
      },
    })
  } catch (error) {
    console.error('Error removing bookmark:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}