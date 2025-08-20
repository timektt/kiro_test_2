import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const searchSuggestionsSchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().min(1).max(20).default(8),
})

interface SearchSuggestion {
  id: string
  type: 'user' | 'post' | 'tag' | 'trending'
  title: string
  subtitle?: string
  image?: string
  category?: string
  mbti?: string
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const { q: query, limit } = searchSuggestionsSchema.parse({
      q: searchParams.get('q'),
      limit: searchParams.get('limit'),
    })

    const suggestions: SearchSuggestion[] = []

    // Search for users
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        mbti: {
          select: {
            type: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: Math.ceil(limit / 2),
      orderBy: [
        { _count: { followers: 'desc' } },
        { createdAt: 'desc' },
      ],
    })

    // Add user suggestions
    users.forEach(user => {
      suggestions.push({
        id: `user-${user.id}`,
        type: 'user',
        title: user.username,
        subtitle: user.name || `${user._count.followers} followers`,
        image: user.image || undefined,
        mbti: user.mbti?.type,
      })
    })

    // Search for posts by content
    const posts = await prisma.post.findMany({
      where: {
        content: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        content: true,
        category: true,
        author: {
          select: {
            username: true,
            name: true,
            mbti: {
              select: {
                type: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      take: Math.ceil(limit / 2),
      orderBy: [
        { _count: { likes: 'desc' } },
        { createdAt: 'desc' },
      ],
    })

    // Add post suggestions
    posts.forEach(post => {
      const contentPreview = post.content.length > 50 
        ? post.content.substring(0, 50) + '...'
        : post.content
      
      suggestions.push({
        id: `post-${post.id}`,
        type: 'post',
        title: contentPreview,
        subtitle: `by @${post.author.username} &bull; ${post._count.likes} likes`,
        category: post.category || undefined,
        mbti: post.author.mbti?.type,
      })
    })

    // Search for trending hashtags (if query starts with #)
    if (query.startsWith('#')) {
      const hashtag = query.substring(1)
      
      // Find posts with this hashtag in content
      const hashtagPosts = await prisma.post.findMany({
        where: {
          content: {
            contains: `#${hashtag}`,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          content: true,
        },
        take: 5,
      })

      if (hashtagPosts.length > 0) {
        suggestions.unshift({
          id: `tag-${hashtag}`,
          type: 'tag',
          title: `#${hashtag}`,
          subtitle: `${hashtagPosts.length} posts`,
        })
      }
    }

    // Add trending suggestions based on recent activity
    if (suggestions.length < limit) {
      const trendingPosts = await prisma.post.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        select: {
          id: true,
          content: true,
          category: true,
          author: {
            select: {
              username: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: [
          { _count: { likes: 'desc' } },
          { _count: { comments: 'desc' } },
        ],
        take: limit - suggestions.length,
      })

      trendingPosts.forEach(post => {
        const contentPreview = post.content.length > 40
          ? post.content.substring(0, 40) + '...'
          : post.content
        
        suggestions.push({
          id: `trending-${post.id}`,
          type: 'trending',
          title: contentPreview,
          subtitle: `Trending &bull; ${post._count.likes + post._count.comments} interactions`,
          category: post.category || undefined,
        })
      })
    }

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.title === suggestion.title)
      )
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      suggestions: uniqueSuggestions,
      total: uniqueSuggestions.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error fetching search suggestions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
