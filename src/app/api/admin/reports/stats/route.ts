import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get basic counts
    const [total, pending, resolved, dismissed, reviewed] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.report.count({ where: { status: 'RESOLVED' } }),
      prisma.report.count({ where: { status: 'DISMISSED' } }),
      prisma.report.count({ where: { status: 'REVIEWED' } }),
    ])

    // Get reports by type
    const reportsByType = await prisma.report.groupBy({
      by: ['type'],
      _count: {
        id: true,
      },
    })

    const byType = reportsByType.reduce((acc, item) => {
      acc[item.type] = item._count.id
      return acc
    }, {} as Record<string, number>)

    // Get reports by reason
    const reportsByReason = await prisma.report.groupBy({
      by: ['reason'],
      _count: {
        id: true,
      },
    })

    const byReason = reportsByReason.reduce((acc, item) => {
      acc[item.reason] = item._count.id
      return acc
    }, {} as Record<string, number>)

    // Get reports by priority
    const reportsByPriority = await prisma.report.groupBy({
      by: ['priority'],
      _count: {
        id: true,
      },
    })

    const byPriority = reportsByPriority.reduce((acc, item) => {
      acc[item.priority] = item._count.id
      return acc
    }, {} as Record<string, number>)

    // Get recent reports (last 10)
    const recentReports = await prisma.report.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            image: true,
          },
        },
        reportedPost: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                name: true,
              },
            },
          },
        },
        reportedComment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                name: true,
              },
            },
          },
        },
        reviewedBy: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    })

    // Calculate additional metrics
    const stats = {
      total,
      pending,
      resolved,
      dismissed,
      reviewed,
      byType,
      byReason,
      byPriority,
      recentReports,
      // Additional metrics
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      pendingRate: total > 0 ? Math.round((pending / total) * 100) : 0,
      // Reports created in the last 24 hours
      recentCount: await prisma.report.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Reports created in the last 7 days
      weeklyCount: await prisma.report.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      // Average resolution time (in hours) for resolved reports
      avgResolutionTime: await getAverageResolutionTime(),
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching report stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch report statistics' },
      { status: 500 }
    )
  }
}

// Helper function to calculate average resolution time
async function getAverageResolutionTime(): Promise<number> {
  try {
    const resolvedReports = await prisma.report.findMany({
      where: {
        status: 'RESOLVED',
        reviewedAt: {
          not: null,
        },
      },
      select: {
        createdAt: true,
        reviewedAt: true,
      },
    })

    if (resolvedReports.length === 0) {
      return 0
    }

    const totalResolutionTime = resolvedReports.reduce((sum, report) => {
      if (report.reviewedAt) {
        const resolutionTime = new Date(report.reviewedAt).getTime() - new Date(report.createdAt).getTime()
        return sum + resolutionTime
      }
      return sum
    }, 0)

    // Convert from milliseconds to hours
    const avgResolutionTimeMs = totalResolutionTime / resolvedReports.length
    return Math.round(avgResolutionTimeMs / (1000 * 60 * 60) * 100) / 100 // Round to 2 decimal places
  } catch (error) {
    console.error('Error calculating average resolution time:', error)
    return 0
  }
}