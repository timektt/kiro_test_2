import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        post: {
          select: {
            id: true,
            content: true,
            isPublic: true,
            authorId: true,
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

    // Check access to private posts
    if (!comment.post.isPublic && 
        comment.post.authorId !== session.user.id && 
        comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: true, data: comment })
  } catch (error) {
    console.error('Error fetching comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { content } = await request.json()

    // Check if comment exists and user owns it or is admin
    const existingComment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    const isOwner = existingComment.authorId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const updatedComment = await prisma.comment.update({
      where: { id: params.commentId },
      data: { 
        content,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: updatedComment })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if comment exists and user owns it or is admin
    const existingComment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    const isOwner = existingComment.authorId === session.user.id
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: params.commentId },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Comment deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}