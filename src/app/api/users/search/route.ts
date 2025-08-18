import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const userSearchSchema = z.object({
  q: z.string().min(1),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  
  // User filters
  mbti: z.string().optional(),
  minFollowers: z.string().transform(Number).optional(),
  verified: z.string().transform(val => val === 'true').optional(),
  
  // Sorting
  sort: z.enum(['recent', 'popular', 'trending', 'relevant']).default('relevant')
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const rawParams = Object.fromEntries(searchParams.entries())
    
    const validatedParams = userSearchSchema.parse(rawParams)
    const {
      q: query,
      page,
      limit,
      mbti,
      minFollowers,
      verified,
      sort
    } = validatedParams

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      OR: [
        {
          username: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        },
        {
          bio: {
            contains: query,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Apply filters
    if (mbti) {
      where.mbti = {
        type: mbti
      }
    }

    if (verified !== undefined) {
      where.verified = verified
    }

    // Build orderBy clause
    let orderBy: any = []
    switch (sort) {
      case 'popular':
        orderBy = [
          { followers: { _count: 'desc' } },
          { posts: { _count: 'desc' } },
          { createdAt: 'desc' }
        ]
        break
      case 'recent':
        orderBy = [{ createdAt: 'desc' }]
        break
      case 'trending':
        // Trending users: recent activity + followers
        orderBy = [
          { followers: { _count: 'desc' } },
          { createdAt: 'desc' }
        ]
        break
      case 'relevant':
      default:
        orderBy = [
          { verified: 'desc' },
          { followers: { _count: 'desc' } },
          { createdAt: 'desc' }
        ]
        break
    }

    // Search users
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        verified: true,
        createdAt: true,
        mbti: {
          select: {
            type: true
          }
        },
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // Apply follower count filter after fetching (since Prisma doesn't support filtering by count directly)
    let filteredUsers = users
    if (minFollowers) {
      filteredUsers = users.filter(user => user._count.followers >= minFollowers)
    }

    // Get total count for pagination
    const total = await prisma.user.count({ where })
    const hasMore = skip + limit < total

    // Format users
    const formattedUsers = filteredUsers.map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.image,
      bio: user.bio,
      verified: user.verified,
      mbti: user.mbti?.type,
      stats: {
        followers: user._count.followers,
        following: user._count.following,
        posts: user._count.posts
      },
      createdAt: user.createdAt
    }))

    return NextResponse.json({
      users: formattedUsers,
      total: filteredUsers.length,
      hasMore,
      page,
      limit,
      query,
      filters: {
        mbti,
        minFollowers,
        verified,
        sort
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error searching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}