import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { RankingType } from '@/types'

const querySchema = z.object({
  type: z.enum([
    'POSTS_LIKES',
    'POSTS_COUNT', 
    'COMMENTS_COUNT',
    'FOLLOWERS_COUNT',
    'ENGAGEMENT',
    'WEEKLY_ACTIVE',
    'MONTHLY_ACTIVE'
  ] as const).optional(),
  period: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  page: z.coerce.number().min(1).default(1)
})

// GET /api/rankings - Get rankings leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      type: searchParams.get('type'),
      period: searchParams.get('period'),
      limit: searchParams.get('limit'),
      page: searchParams.get('page')
    })

    const { type, period, limit, page } = query
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (type) where.type = type
    if (period) where.period = period

    // Get rankings with user data
    const rankings = await prisma.ranking.findMany({
      where,
      include: {
        user: {
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
        }
      },
      orderBy: [
        { type: 'asc' },
        { period: 'desc' },
        { rank: 'asc' }
      ],
      skip: offset,
      take: limit
    })

    // Get total count for pagination
    const total = await prisma.ranking.count({ where })

    // Group by type and period for better organization
    const groupedRankings: Record<string, Record<string, typeof rankings>> = {}
    
    rankings.forEach(ranking => {
      if (!groupedRankings[ranking.type]) {
        groupedRankings[ranking.type] = {}
      }
      if (!groupedRankings[ranking.type][ranking.period]) {
        groupedRankings[ranking.type][ranking.period] = []
      }
      groupedRankings[ranking.type][ranking.period].push(ranking)
    })

    return NextResponse.json({
      success: true,
      data: {
        rankings: type && period ? rankings : groupedRankings,
        pagination: {
          page,
          limit,
          total,
          hasMore: offset + limit < total
        }
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: error.errors
        }
      }, { status: 400 })
    }

    console.error('Error fetching rankings:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }, { status: 500 })
  }
}

// POST /api/rankings/calculate - Trigger ranking calculation (admin only)
export async function POST(request: NextRequest) {
  try {
    // This would typically be called by a cron job or admin action
    // For now, we'll implement a basic version
    
    const body = await request.json()
    const { types, periods } = body

    // This is a simplified version - in production you'd want proper job queuing
    const results = await calculateRankings(types, periods)

    return NextResponse.json({
      success: true,
      data: {
        message: 'Rankings calculation triggered',
        results
      }
    })

  } catch (error) {
    console.error('Error calculating rankings:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }, { status: 500 })
  }
}

async function calculateRankings(types?: RankingType[], periods?: string[]) {
  // This is a simplified implementation
  // In production, you'd want to use a proper job queue system
  
  const rankingTypes: RankingType[] = types || [
    'POSTS_LIKES',
    'POSTS_COUNT',
    'COMMENTS_COUNT', 
    'FOLLOWERS_COUNT',
    'ENGAGEMENT',
    'WEEKLY_ACTIVE',
    'MONTHLY_ACTIVE'
  ]

  const results = []

  for (const type of rankingTypes) {
    try {
      const result = await calculateRankingForType(type)
      results.push({ type, success: true, count: result })
    } catch (error) {
      results.push({ type, success: false, error: error.message })
    }
  }

  return results
}

async function calculateRankingForType(type: RankingType) {
  // Get current period for this ranking type
  const period = getCurrentPeriod(type)
  
  // Calculate user stats based on ranking type
  let userStats
  
  switch (type) {
    case 'POSTS_LIKES':
      userStats = await prisma.user.findMany({
        select: {
          id: true,
          _count: {
            select: {
              posts: true,
              comments: true,
              followers: true
            }
          }
        }
      })
      break
      
    // Add other cases as needed
    default:
      userStats = []
  }

  // Calculate scores and update rankings
  const rankings = []
  
  for (const user of userStats) {
    // Calculate score based on type
    const score = calculateScore(type, user)
    
    rankings.push({
      userId: user.id,
      type,
      score,
      period
    })
  }

  // Sort by score and assign ranks
  rankings.sort((a, b) => b.score - a.score)
  
  // Update database with new rankings
  await prisma.$transaction(async (tx) => {
    // Delete old rankings for this type and period
    await tx.ranking.deleteMany({
      where: { type, period }
    })
    
    // Insert new rankings
    for (let i = 0; i < rankings.length; i++) {
      await tx.ranking.create({
        data: {
          ...rankings[i],
          rank: i + 1,
          calculatedAt: new Date()
        }
      })
    }
  })

  return rankings.length
}

function getCurrentPeriod(type: RankingType): string {
  const now = new Date()
  
  switch (type) {
    case 'WEEKLY_ACTIVE':
      const monday = new Date(now)
      monday.setDate(now.getDate() - now.getDay() + 1)
      return `${monday.getFullYear()}-W${getWeekNumber(monday)}`
    
    case 'MONTHLY_ACTIVE':
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    
    default:
      return 'all-time'
  }
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function calculateScore(type: RankingType, user: any): number {
  // Simplified scoring - in production you'd use the ranking utilities
  switch (type) {
    case 'POSTS_LIKES':
      return user._count.posts * 10 // Simplified
    case 'POSTS_COUNT':
      return user._count.posts
    case 'COMMENTS_COUNT':
      return user._count.comments
    case 'FOLLOWERS_COUNT':
      return user._count.followers
    default:
      return 0
  }
}


