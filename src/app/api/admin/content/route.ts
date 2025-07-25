import { NextRequest, NextResponse } from 'next/server'
import { createAdminHandler } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export const GET = createAdminHandler('CONTENT_MODERATION')(
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const type = searchParams.get('type') || 'ALL' // ALL, POSTS, COMMENTS
      const status = searchParams.get('status') || 'ALL' // ALL, ACTIVE, HIDDEN, DELETED
      const search = searchParams.get('search') || ''

      const skip = (page - 1) * limit

      let results: any = { posts: [], comments: [], pagination: { page, limit, total: 0, hasMore: false } }

      if (type === 'ALL' || type === 'POSTS') {
        // Build where clause for posts
        let postWhereClause: any = {}

        if (search) {
          postWhereClause.content = {
            contains: search,
            mode: 'insensitive',
          }
        }

        if (status === 'ACTIVE') {
          postWhereClause.isPublic = true
        } else if (status === 'HIDDEN') {
          postWhereClause.isPublic = false
        }

        const [posts, postCount] = await Promise.all([
          prisma.post.findMany({
            where: postWhereClause,
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
            orderBy: {
              createdAt: 'desc',
            },
            skip: type === 'POSTS' ? skip : 0,
            take: type === 'POSTS' ? limit : Math.floor(limit / 2),
          }),
          prisma.post.count({ where: postWhereClause }),
        ])

        results.posts = posts
        if (type === 'POSTS') {
          results.pagination.total = postCount
          results.pagination.hasMore = skip + posts.length < postCount
        }
      }

      if (type === 'ALL' || type === 'COMMENTS') {
        // Build where clause for comments
        let commentWhereClause: any = {}

        if (search) {
          commentWhereClause.content = {
            contains: search,
            mode: 'insensitive',
          }
        }

        const [comments, commentCount] = await Promise.all([
          prisma.comment.findMany({
            where: commentWhereClause,
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  image: true,
                },
              },
              post: {
                select: {
                  id: true,
                  content: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip: type === 'COMMENTS' ? skip : 0,
            take: type === 'COMMENTS' ? limit : Math.floor(limit / 2),
          }),
          prisma.comment.count({ where: commentWhereClause }),
        ])

        results.comments = comments
        if (type === 'COMMENTS') {
          results.pagination.total = commentCount
          results.pagination.hasMore = skip + comments.length < commentCount
        }
      }

      if (type === 'ALL') {
        const totalItems = results.posts.length + results.comments.length
        results.pagination.total = totalItems
        results.pagination.hasMore = false // For mixed results, disable pagination
      }

      return NextResponse.json({
        success: true,
        data: results,
      })
    } catch (error) {
      console.error('Error fetching content:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)
