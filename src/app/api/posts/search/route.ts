import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const searchSchema = z.object({
  q: z.string().min(1),
  page: z.string().transform(Number).default('1'),
  
  // Content filters
  category: z.string().optional(),
  mbti: z.string().optional(),
  authorMbti: z.string().optional(),
  hasImage: z.string().transform(val => val === 'true').optional(),
  hasVideo: z.string().transform(val => val === 'true').optional(),
  
  // Engagement filters
  minLikes: z.string().transform(Number).optional(),
  maxLikes: z.string().transform(Number).optional(),
  minComments: z.string().transform(Number).optional(),
  maxComments: z.string().transform(Number).optional(),
  
  // Time filters
  dateFrom: z.string().transform(str => new Date(str)).optional(),
  dateTo: z.string().transform(str => new Date(str)).optional(),
  
  // Author filters
  minFollowers: z.string().transform(Number).optional(),
  verifiedOnly: z.string().transform(val => val === 'true').optional(),
  
  // Sorting
  sort: z.enum(['recent', 'popular', 'trending', 'relevant']).default('recent'),
  order: z.enum(['asc', 'desc']).default('desc')
})

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
    const rawParams = Object.fromEntries(searchParams.entries())
    
    const validatedParams = searchSchema.parse(rawParams)
    const {
      q: query,
      page,
      category,
      mbti,
      authorMbti,
      hasImage,
      hasVideo,
      minLikes,
      maxLikes,
      minComments,
      maxComments,
      dateFrom,
      dateTo,
      minFollowers,
      verifiedOnly,
      sort,
      order
    } = validatedParams

    const limit = 20
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      AND: [
        {
          OR: [
            {
              content: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              category: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        }
      ]
    }

    // Content filters
    if (category) {
      whereClause.AND.push({
        category: {
          equals: category,
          mode: 'insensitive'
        }
      })
    }

    if (mbti) {
      whereClause.AND.push({
        mbti: {
          type: mbti
        }
      })
    }

    if (hasImage) {
      whereClause.AND.push({
        imageUrl: { not: null }
      })
    }

    if (hasVideo) {
      whereClause.AND.push({
        videoUrl: { not: null }
      })
    }

    // Time filters
    if (dateFrom || dateTo) {
      const dateFilter: any = {}
      if (dateFrom) dateFilter.gte = dateFrom
      if (dateTo) dateFilter.lte = dateTo
      whereClause.AND.push({
        createdAt: dateFilter
      })
    }

    // Author filters
    const authorWhere: any = {}
    if (authorMbti) {
      authorWhere.mbti = {
        type: authorMbti
      }
    }
    if (verifiedOnly) {
      authorWhere.verified = true
    }
    
    if (Object.keys(authorWhere).length > 0) {
      whereClause.AND.push({
        author: authorWhere
      })
    }

    // Build order by clause
    let orderBy: any = []
    switch (sort) {
      case 'popular':
        orderBy = [
          { likes: { _count: order } },
          { comments: { _count: order } },
          { createdAt: 'desc' }
        ]
        break
      case 'trending':
        // Trending: combination of recent and popular
        orderBy = [
          { likes: { _count: 'desc' } },
          { createdAt: 'desc' }
        ]
        break
      case 'relevant':
        // For relevance, we'll use creation date as fallback
        orderBy = [{ createdAt: 'desc' }]
        break
      case 'recent':
      default:
        orderBy = [{ createdAt: order }]
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
            verified: true,
            mbti: {
              select: {
                type: true
              }
            },
            _count: {
              select: {
                followers: true
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
      take: limit,
      skip
    })

    // Apply engagement filters after fetching (since Prisma doesn't support filtering by count directly)
    let filteredPosts = posts
    if (minLikes || maxLikes || minComments || maxComments || minFollowers) {
      filteredPosts = posts.filter(post => {
        const likesCount = post._count.likes
        const commentsCount = post._count.comments
        const followersCount = post.author._count.followers
        
        if (minLikes && likesCount < minLikes) return false
        if (maxLikes && likesCount > maxLikes) return false
        if (minComments && commentsCount < minComments) return false
        if (maxComments && commentsCount > maxComments) return false
        if (minFollowers && followersCount < minFollowers) return false
        
        return true
      })
    }

    // Get total count for pagination
    const total = await prisma.post.count({
      where: whereClause
    })

    const totalPages = Math.ceil(total / limit)

    // Format posts
    const formattedPosts = filteredPosts.map(post => ({
      id: post.id,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl,
      videoUrl: post.videoUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        username: post.author.username,
        name: post.author.name,
        image: post.author.image,
        verified: post.author.verified,
        mbti: post.author.mbti,
        followersCount: post.author._count.followers
      },
      stats: {
        likes: post._count.likes,
        comments: post._count.comments
      },
      isLiked: post.likes.length > 0
    }))

    return NextResponse.json({
      posts: formattedPosts,
      total: filteredPosts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPosts.length / limit),
      query,
      filters: {
        category,
        mbti,
        authorMbti,
        hasImage,
        hasVideo,
        minLikes,
        maxLikes,
        minComments,
        maxComments,
        dateFrom,
        dateTo,
        minFollowers,
        verifiedOnly,
        sort,
        order
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error searching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}