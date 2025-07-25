import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { postSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const userId = searchParams.get('userId')
    const following = searchParams.get('following') === 'true'

    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const skip = (page - 1) * limit

    let whereClause: any = {
      isPublic: true,
    }

    // Filter by specific user
    if (userId) {
      whereClause.authorId = userId
    }

    // Filter by following users only
    if (following && session.user.id) {
      const followingUsers = await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true },
      })

      const followingIds = followingUsers.map(f => f.followingId)
      followingIds.push(session.user.id) // Include own posts

      whereClause.authorId = {
        in: followingIds,
      }
    }

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: whereClause,
        include: {
          author: {
            include: {
              mbti: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: whereClause }),
    ])

    const hasMore = skip + posts.length < totalCount

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total: totalCount,
          hasMore,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const result = postSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: result.error.issues },
        { status: 400 }
      )
    }

    const { content, imageUrl } = result.data

    // Create post
    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        authorId: session.user.id,
        isPublic: true,
      },
      include: {
        author: {
          include: {
            mbti: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: post,
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
