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
        { error: 'Unauthorized' },
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
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json(
        { error: 'Post already liked' },
        { status: 409 }
      )
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        postId,
        userId,
      },
    })

    // Create notification for post author (if not liking own post)
    if (post.authorId !== userId) {
      await createNotification(
        post.authorId,
        'LIKE',
        `${session.user.name || session.user.username} liked your post`,
        postId
      )
    }

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId },
    })

    return NextResponse.json({
      success: true,
      data: {
        like,
        likeCount,
        isLiked: true,
      },
    })
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const postId = params.postId

    // Find and delete like
    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })

    if (!like) {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      )
    }

    await prisma.like.delete({
      where: {
        id: like.id,
      },
    })

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId },
    })

    return NextResponse.json({
      success: true,
      data: {
        likeCount,
        isLiked: false,
      },
    })
  } catch (error) {
    console.error('Error unliking post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const postId = params.postId

    // Check if user has liked the post
    const like = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })

    // Get total like count
    const likeCount = await prisma.like.count({
      where: { postId },
    })

    return NextResponse.json({
      success: true,
      data: {
        isLiked: !!like,
        likeCount,
        likedAt: like?.createdAt || null,
      },
    })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}