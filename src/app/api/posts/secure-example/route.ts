import { NextRequest, NextResponse } from 'next/server'
import { securityWrappers } from '@/lib/security'
import { postSchema } from '@/lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Example of a secure API route using the security wrapper
export const POST = securityWrappers.posts(
  async (request: NextRequest, context: { body: any }) => {
    try {
      // Get authenticated user
      const session = await getServerSession(authOptions)
      if (!session?.user) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          },
          { status: 401 }
        )
      }

      // Validate input (already done by security wrapper)
      const { content, imageUrl, isPublic } = context.body

      // Create post with sanitized content
      const post = await prisma.post.create({
        data: {
          content,
          imageUrl,
          isPublic: isPublic ?? true,
          authorId: session.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
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
      })
    } catch (error) {
      console.error('Error creating post:', error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to create post',
          },
        },
        { status: 500 }
      )
    }
  }
)

// Example of a secure GET route with search validation
export const GET = securityWrappers.search(
  async (request: NextRequest, context: { query: any }) => {
    try {
      const { q, type, page, limit } = context.query

      // Build search query
      const searchConditions: any = {
        OR: [
          { content: { contains: q, mode: 'insensitive' } },
        ],
        isPublic: true,
      }

      // Execute search with pagination
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where: searchConditions,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.post.count({ where: searchConditions }),
      ])

      return NextResponse.json({
        success: true,
        data: {
          posts,
          pagination: {
            page,
            limit,
            total,
            hasMore: page * limit < total,
          },
        },
      })
    } catch (error) {
      console.error('Error searching posts:', error)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SEARCH_ERROR',
            message: 'Search failed',
          },
        },
        { status: 500 }
      )
    }
  }
)