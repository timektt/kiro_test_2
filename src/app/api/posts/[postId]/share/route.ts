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
    const body = await request.json()
    const { platform, message } = body

    // Check if post exists and is public
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

    if (!post.isPublic) {
      return NextResponse.json(
        { success: false, error: 'Cannot share private post' },
        { status: 403 }
      )
    }

    // Create share record
    const share = await prisma.share.create({
      data: {
        postId,
        userId,
        platform: platform || 'INTERNAL',
        message: message || null,
      },
    })

    // Update post share count
    await prisma.post.update({
      where: { id: postId },
      data: {
        shareCount: {
          increment: 1,
        },
      },
    })

    // Create notification for post author (if not sharing own post)
    if (post.authorId !== userId) {
      await createNotification(
        post.authorId,
        'SHARE',
        `${session.user.name || session.user.username} shared your post`,
        {
          postId,
          userId,
          platform,
        }
      )
    }

    // Generate share URL
    const shareUrl = `${process.env.NEXTAUTH_URL}/post/${postId}`
    
    // Generate platform-specific share URLs
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.content.substring(0, 100) + '...')}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(post.content.substring(0, 100) + '... ' + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.content.substring(0, 100) + '...')}`,
      copy: shareUrl,
    }

    return NextResponse.json({
      success: true,
      data: {
        share,
        shareUrl,
        shareUrls,
        message: 'Post shared successfully',
      },
    })
  } catch (error) {
    console.error('Error sharing post:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get share statistics for a post
export async function GET(
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

    const postId = params.postId

    // Get share statistics
    const [totalShares, sharesByPlatform, recentShares] = await Promise.all([
      prisma.share.count({
        where: { postId },
      }),
      prisma.share.groupBy({
        by: ['platform'],
        where: { postId },
        _count: {
          platform: true,
        },
      }),
      prisma.share.findMany({
        where: { postId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalShares,
        sharesByPlatform,
        recentShares,
      },
    })
  } catch (error) {
    console.error('Error fetching share statistics:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}