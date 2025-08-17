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
    const category = searchParams.get('category')
    const mbtiType = searchParams.get('mbti')
    const sortBy = searchParams.get('sort') || 'recent' // recent, popular, oldest
    const pageParam = searchParams.get('page')
    const limitParam = searchParams.get('limit')
    
    const page = pageParam ? parseInt(pageParam, 10) : 1
    const limit = limitParam ? parseInt(limitParam, 10) : 20
    const skip = (page - 1) * Math.min(limit, 50)

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        posts: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      })
    }

    const searchTerm = query.trim()

    // Build where clause
    const whereClause: any = {
      AND: [
        {
          OR: [
            {
              content: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            },
            {
              category: {
                contains: searchTerm,
                mode: 'insensitive'
              }
            }
          ]
        }
      ]
    }

    // Add category filter
    if (category && category !== 'all') {
      whereClause.AND.push({
        category: {
          equals: category,
          mode: 'insensitive'
        }
      })
    }

    // Add MBTI filter
    if (mbtiType && mbtiType !== 'all') {
      whereClause.AND.push({
        author: {
          mbti: {
            type: mbtiType
          }
        }
      })
    }

    // Build order by clause
    let orderBy: any = []
    switch (sortBy) {
      case 'popular':
        orderBy = [
          { likes: { _count: 'desc' } },
          { comments: { _count: 'desc' } },
          { createdAt: 'desc' }
        ]
        break
      case 'oldest':
        orderBy = [{ createdAt: 'asc' }]
        break
      case 'recent':
      default:
        orderBy = [{ createdAt: 'desc' }]
        break
    }

    // Search posts
    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            mbti: {
              select: {
                type: true
              }
            }
          }
        },
        likes: {
          where: {
            userId: session.user.id
          },
          select: {
            id: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy,
      take: Math.min(limit, 50),
      skip
    })

    // Get total count for pagination
    const total = await prisma.post.count({
      where: whereClause
    })

    const totalPages = Math.ceil(total / Math.min(limit, 50))

    // Format posts
    const formattedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        username: post.author.username,
        name: post.author.name,
        image: post.author.image,
        mbti: post.author.mbti
      },
      stats: {
        likes: post._count.likes,
        comments: post._count.comments
      },
      isLiked: post.likes.length > 0
    }))

    logger.info(`Post search completed`, {
      userId: session.user.id,
      query: searchTerm,
      category,
      mbtiType,
      sortBy,
      resultsCount: posts.length,
      total,
      page
    })

    return NextResponse.json({
      posts: formattedPosts,
      total,
      page,
      limit: Math.min(limit, 50),
      totalPages,
      query: searchTerm,
      filters: {
        category,
        mbtiType,
        sortBy
      }
    })

  } catch (error) {
    logger.error('Error searching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}