import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Build where clause for search
    const whereClause: any = {
      followingId: params.userId,
    }

    if (search) {
      whereClause.follower = {
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }
    }

    const [follows, totalCount] = await Promise.all([
      prisma.follow.findMany({
        where: whereClause,
        include: {
          follower: {
            include: {
              mbti: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                  posts: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.follow.count({ where: whereClause }),
    ])

    // Get current user's following status for each follower
    const followerIds = follows.map(f => f.followerId)
    const currentUserFollowing = await prisma.follow.findMany({
      where: {
        followerId: session.user.id,
        followingId: { in: followerIds },
      },
      select: { followingId: true },
    })

    const followingSet = new Set(currentUserFollowing.map(f => f.followingId))

    // Format response
    const followers = follows.map(follow => ({
      ...follow.follower,
      followedAt: follow.createdAt,
      isFollowedByCurrentUser: followingSet.has(follow.followerId),
    }))

    const hasMore = skip + follows.length < totalCount

    return NextResponse.json({
      success: true,
      data: {
        followers,
        pagination: {
          page,
          limit,
          total: totalCount,
          hasMore,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching followers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}