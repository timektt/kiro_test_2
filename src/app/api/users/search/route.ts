import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : 20

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        users: [],
        total: 0
      })
    }

    const searchTerm = query.trim()

    // Search users by username, name, or email
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: session.user.id // Exclude current user
            }
          },
          {
            OR: [
              {
                username: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        email: true,
        createdAt: true,
        mbti: {
          select: {
            type: true
          }
        },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true
          }
        }
      },
      take: Math.min(limit, 50), // Cap at 50 results
      orderBy: [
        {
          username: 'asc'
        },
        {
          name: 'asc'
        }
      ]
    })

    // Get total count for pagination
    const total = await prisma.user.count({
      where: {
        AND: [
          {
            id: {
              not: session.user.id
            }
          },
          {
            OR: [
              {
                username: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: searchTerm,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ]
      }
    })

    // Remove sensitive information
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      mbti: user.mbti,
      stats: {
        posts: user._count.posts,
        followers: user._count.followers,
        following: user._count.following
      }
    }))

    logger.info(`User search completed`, {
      userId: session.user.id,
      query: searchTerm,
      resultsCount: users.length,
      total
    })

    return NextResponse.json({
      users: sanitizedUsers,
      total,
      query: searchTerm,
      limit
    })

  } catch (error) {
    logger.error('Error searching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}