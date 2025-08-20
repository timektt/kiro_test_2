import { NextRequest, NextResponse } from 'next/server'
import { createAdminHandler } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export const GET = createAdminHandler('USER_MANAGEMENT')(
  async (request: NextRequest, adminUser) => {
    try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const search = searchParams.get('search') || ''
      const role = searchParams.get('role') || ''
      const status = searchParams.get('status') || ''

      const skip = (page - 1) * limit

      // Build where clause
      const whereClause: any = {}

      if (search) {
        whereClause.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      }

      if (role && role !== 'ALL') {
        whereClause.role = role
      }

      if (status === 'ACTIVE') {
        whereClause.isActive = true
      } else if (status === 'INACTIVE') {
        whereClause.isActive = false
      }

      const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          include: {
            mbti: true,
            _count: {
              select: {
                posts: true,
                followers: true,
                following: true,
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
        prisma.user.count({ where: whereClause }),
      ])

      const hasMore = skip + users.length < totalCount

      return NextResponse.json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total: totalCount,
            hasMore,
          },
        },
      })
    } catch (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
)


